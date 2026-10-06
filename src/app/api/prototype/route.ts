import { createHash, createHmac, randomBytes, scrypt as scryptCallback, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
import { db } from "@/db";
import { children, dailyLogs, journalEntries, journalLicences, reportHistory } from "@/db/schema";
import { and, eq, isNull } from "drizzle-orm";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const SESSION_COOKIE = "mbwi_session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 30;
const scrypt = promisify(scryptCallback);

type PrototypeBody = {
  action?: "activate" | "login" | "logout" | "profile" | "log" | "entry" | "report";
  code?: string;
  email?: string;
  password?: string;
  profile?: Record<string, unknown>;
  log?: Record<string, unknown>;
  entry?: Record<string, unknown>;
  report?: Record<string, unknown>;
};

function normalizeCode(value: string) {
  return value.toUpperCase().replace(/[^A-Z0-9]/g, "");
}

function hashActivationCode(value: string) {
  return createHash("sha256").update(normalizeCode(value), "utf8").digest("hex");
}

function authSecret() {
  const secret = process.env.AUTH_SECRET;
  if (!secret && process.env.NODE_ENV === "production") throw new Error("AUTH_SECRET is required");
  return secret || "local-development-only-change-me";
}

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const derived = (await scrypt(password, salt, 64)) as Buffer;
  return `${salt}:${derived.toString("hex")}`;
}

async function passwordMatches(password: string, stored: string) {
  const [salt, encoded] = stored.split(":");
  if (!salt || !encoded) return false;
  const derived = (await scrypt(password, salt, 64)) as Buffer;
  const expected = Buffer.from(encoded, "hex");
  return derived.length === expected.length && timingSafeEqual(derived, expected);
}

function createSessionToken(licenceId: number) {
  const payload = Buffer.from(JSON.stringify({ licenceId, expiresAt: Date.now() + SESSION_MAX_AGE * 1000 })).toString("base64url");
  const signature = createHmac("sha256", authSecret()).update(payload).digest("base64url");
  return `${payload}.${signature}`;
}

function readSession(request: Request) {
  const cookie = request.headers.get("cookie")?.split(";").map((part) => part.trim()).find((part) => part.startsWith(`${SESSION_COOKIE}=`));
  const token = cookie?.slice(SESSION_COOKIE.length + 1);
  if (!token) return null;
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return null;
  const expected = createHmac("sha256", authSecret()).update(payload).digest();
  const provided = Buffer.from(signature, "base64url");
  if (expected.length !== provided.length || !timingSafeEqual(expected, provided)) return null;
  try {
    const session = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as { licenceId: number; expiresAt: number };
    return session.expiresAt > Date.now() ? session : null;
  } catch {
    return null;
  }
}

function withSession(response: NextResponse, licenceId: number) {
  response.cookies.set(SESSION_COOKIE, createSessionToken(licenceId), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: SESSION_MAX_AGE,
    path: "/",
  });
  return response;
}

async function getOrCreateChild(licenceId: number) {
  const [existing] = await db.select().from(children).where(eq(children.licenceId, licenceId)).limit(1);
  if (existing) return existing;
  const [created] = await db.insert(children).values({
    licenceId,
    name: "Baby",
    allergies: "None known",
    medicines: "None currently",
    conditions: "None known",
  }).returning();
  return created;
}

export async function GET(request: Request) {
  const session = readSession(request);
  if (!session) return NextResponse.json({ authenticated: false }, { status: 401 });
  const [licence] = await db.select({ id: journalLicences.id, email: journalLicences.email })
    .from(journalLicences).where(eq(journalLicences.id, session.licenceId)).limit(1);
  if (!licence?.email) return NextResponse.json({ authenticated: false }, { status: 401 });
  return NextResponse.json({ authenticated: true, email: licence.email });
}

export async function POST(request: Request) {
  const body = (await request.json()) as PrototypeBody;

  if (body.action === "activate") {
    const normalizedCode = normalizeCode(body.code || "");
    const email = (body.email || "").trim().toLowerCase();
    const password = body.password || "";
    if (!/^MBWJ[A-HJ-NP-Z2-9]{12}$/.test(normalizedCode)) {
      return NextResponse.json({ error: "That activation code is not valid. Check the code printed in your journal." }, { status: 400 });
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
    if (password.length < 8 || !/[^A-Za-z]/.test(password)) {
      return NextResponse.json({ error: "Use at least 8 characters and include a number or symbol." }, { status: 400 });
    }

    const passwordHash = await hashPassword(password);
    const result = await db.transaction(async (tx) => {
      const [licence] = await tx.select().from(journalLicences)
        .where(eq(journalLicences.activationCodeHash, hashActivationCode(normalizedCode))).limit(1);
      if (!licence) return { error: "That activation code was not found. Check the code and try again.", status: 404 } as const;
      if (licence.activatedAt) return { error: "This journal code has already been activated. Sign in instead.", status: 409 } as const;
      const [emailOwner] = await tx.select({ id: journalLicences.id }).from(journalLicences)
        .where(eq(journalLicences.email, email)).limit(1);
      if (emailOwner) return { error: "An account already exists for this email. Sign in instead.", status: 409 } as const;
      const [activated] = await tx.update(journalLicences)
        .set({ email, passwordHash, activatedAt: new Date() })
        .where(and(eq(journalLicences.id, licence.id), isNull(journalLicences.activatedAt)))
        .returning({ id: journalLicences.id });
      return activated ? { id: activated.id } : { error: "This journal code has already been activated.", status: 409 } as const;
    });
    if ("error" in result) return NextResponse.json({ error: result.error }, { status: result.status });
    return withSession(NextResponse.json({ ok: true }), result.id);
  }

  if (body.action === "login") {
    const email = (body.email || "").trim().toLowerCase();
    const [licence] = await db.select().from(journalLicences).where(eq(journalLicences.email, email)).limit(1);
    if (!licence?.passwordHash || !(await passwordMatches(body.password || "", licence.passwordHash))) {
      return NextResponse.json({ error: "Email or password is incorrect." }, { status: 401 });
    }
    return withSession(NextResponse.json({ ok: true }), licence.id);
  }

  if (body.action === "logout") {
    const response = NextResponse.json({ ok: true });
    response.cookies.set(SESSION_COOKIE, "", { httpOnly: true, maxAge: 0, path: "/" });
    return response;
  }

  const session = readSession(request);
  if (!session) return NextResponse.json({ error: "Please sign in to continue." }, { status: 401 });
  const child = await getOrCreateChild(session.licenceId);

  if (body.action === "profile" && body.profile) {
    const profile = body.profile;
    await db.update(children).set({
      name: String(profile.name || child.name), nickname: String(profile.nickname || child.nickname || ""),
      dateOfBirth: String(profile.dateOfBirth || child.dateOfBirth || "2024-03-18"), address: String(profile.address || ""),
      allergies: String(profile.allergies || "None known"), medicines: String(profile.medicines || "None currently"),
      conditions: String(profile.conditions || "None known"), medicalNotes: String(profile.medicalNotes || ""),
      dietaryRequirements: String(profile.dietaryRequirements || ""), sensitivities: String(profile.sensitivities || ""),
      preferredHospital: String(profile.preferredHospital || ""), gpSurgery: String(profile.gpSurgery || ""),
      gpPhone: String(profile.gpPhone || ""), updatedAt: new Date(),
    }).where(eq(children.id, child.id));
    return NextResponse.json({ ok: true, childId: child.id });
  }

  if (body.action === "log" && body.log) {
    const log = body.log;
    const logDate = String(log.date || new Date().toISOString().slice(0, 10));
    const values = {
      childId: child.id, logDate, health: Array.isArray(log.health) ? log.health as string[] : [],
      healthNotes: String(log.healthNotes || ""), totalSleep: String(log.totalSleep || ""),
      nightWakes: String(log.nightWakes || ""), napCount: String(log.napCount || ""), napTime: String(log.napTime || ""),
      mood: Array.isArray(log.mood) ? log.mood as string[] : [], meals: String(log.meals || ""),
      snacks: String(log.snacks || ""), fruitVeg: String(log.fruitVeg || ""), junkFood: String(log.junkFood || ""),
      isDraft: Boolean(log.isDraft), updatedAt: new Date(),
    };
    const [existing] = await db.select({ id: dailyLogs.id }).from(dailyLogs)
      .where(and(eq(dailyLogs.childId, child.id), eq(dailyLogs.logDate, logDate))).limit(1);
    if (existing) await db.update(dailyLogs).set(values).where(eq(dailyLogs.id, existing.id));
    else await db.insert(dailyLogs).values(values);
    return NextResponse.json({ ok: true });
  }

  if (body.action === "entry" && body.entry) {
    const entry = body.entry;
    const [saved] = await db.insert(journalEntries).values({
      childId: child.id, kind: String(entry.kind || "General Note"),
      entryDate: String(entry.date || new Date().toISOString().slice(0, 10)),
      title: String(entry.title || entry.kind || "Journal note"), notes: String(entry.notes || ""),
      details: (entry.details || {}) as Record<string, string | boolean | null>,
    }).returning({ id: journalEntries.id });
    return NextResponse.json({ ok: true, id: saved.id });
  }

  if (body.action === "report" && body.report) {
    const report = body.report;
    const [saved] = await db.insert(reportHistory).values({
      childId: child.id, reportType: String(report.type || "doctor"), periodStart: String(report.start || "2025-10-12"),
      periodEnd: String(report.end || "2025-10-18"), snapshot: report,
    }).returning({ id: reportHistory.id });
    return NextResponse.json({ ok: true, id: saved.id });
  }

  return NextResponse.json({ error: "Unsupported action." }, { status: 400 });
}
