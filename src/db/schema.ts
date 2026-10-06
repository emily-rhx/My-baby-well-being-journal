import {
  boolean,
  date,
  integer,
  jsonb,
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";

export const journalLicences = pgTable(
  "journal_licences",
  {
    id: serial("id").primaryKey(),
    activationCodeHash: text("activation_code_hash").notNull(),
    codeLastFour: text("code_last_four").notNull(),
    email: text("email"),
    passwordHash: text("password_hash"),
    activatedAt: timestamp("activated_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("journal_licences_activation_code_hash_idx").on(table.activationCodeHash),
    uniqueIndex("journal_licences_email_idx").on(table.email),
  ],
);

export const children = pgTable("children", {
  id: serial("id").primaryKey(),
  licenceId: integer("licence_id")
    .references(() => journalLicences.id, { onDelete: "cascade" })
    .notNull(),
  name: text("name").notNull(),
  nickname: text("nickname"),
  dateOfBirth: date("date_of_birth"),
  address: text("address"),
  allergies: text("allergies"),
  medicines: text("medicines"),
  conditions: text("conditions"),
  medicalNotes: text("medical_notes"),
  dietaryRequirements: text("dietary_requirements"),
  sensitivities: text("sensitivities"),
  preferredHospital: text("preferred_hospital"),
  gpSurgery: text("gp_surgery"),
  gpPhone: text("gp_phone"),
  emergencyContacts: jsonb("emergency_contacts").$type<Array<{ name: string; relationship: string; phone: string }>>(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const dailyLogs = pgTable(
  "daily_logs",
  {
    id: serial("id").primaryKey(),
    childId: integer("child_id")
      .references(() => children.id, { onDelete: "cascade" })
      .notNull(),
    logDate: date("log_date").notNull(),
    health: jsonb("health").$type<string[]>().default([]),
    healthNotes: text("health_notes"),
    totalSleep: text("total_sleep"),
    nightWakes: text("night_wakes"),
    napCount: text("nap_count"),
    napTime: text("nap_time"),
    mood: jsonb("mood").$type<string[]>().default([]),
    meals: text("meals"),
    snacks: text("snacks"),
    fruitVeg: text("fruit_veg"),
    junkFood: text("junk_food"),
    isDraft: boolean("is_draft").default(false).notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [uniqueIndex("daily_logs_child_date_idx").on(table.childId, table.logDate)],
);

export const journalEntries = pgTable("journal_entries", {
  id: serial("id").primaryKey(),
  childId: integer("child_id")
    .references(() => children.id, { onDelete: "cascade" })
    .notNull(),
  kind: text("kind").notNull(),
  entryDate: date("entry_date").notNull(),
  title: text("title").notNull(),
  details: jsonb("details").$type<Record<string, string | boolean | null>>().default({}),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const reportHistory = pgTable("report_history", {
  id: serial("id").primaryKey(),
  childId: integer("child_id")
    .references(() => children.id, { onDelete: "cascade" })
    .notNull(),
  reportType: text("report_type").notNull(),
  periodStart: date("period_start").notNull(),
  periodEnd: date("period_end").notNull(),
  snapshot: jsonb("snapshot").$type<Record<string, unknown>>().default({}),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});
