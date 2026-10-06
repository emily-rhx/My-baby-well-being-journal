import { createHash, randomBytes } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const CODE_COUNT = Number(process.argv[2] || 1000);
const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

if (!Number.isSafeInteger(CODE_COUNT) || CODE_COUNT < 1 || CODE_COUNT > 100000) {
  throw new Error("Code count must be a whole number between 1 and 100000.");
}

function randomBlock(length) {
  return [...randomBytes(length)].map((byte) => ALPHABET[byte & 31]).join("");
}

function makeCode() {
  return `MBWJ-${randomBlock(4)}-${randomBlock(4)}-${randomBlock(4)}`;
}

function fingerprint(code) {
  return createHash("sha256").update(code.replaceAll("-", ""), "utf8").digest("hex");
}

const codes = new Set();
while (codes.size < CODE_COUNT) codes.add(makeCode());

const rows = [...codes].map((code, index) => ({
  bookNumber: String(index + 1).padStart(4, "0"),
  code,
  hash: fingerprint(code),
  lastFour: code.slice(-4),
}));

const outputDirectory = resolve("activation-code-output");
await mkdir(outputDirectory, { recursive: true });

const csv = [
  "book_number,activation_code",
  ...rows.map((row) => `${row.bookNumber},${row.code}`),
].join("\n");

const sql = [
  "-- Generated activation-code fingerprints. Raw codes are intentionally not stored in the database.",
  "INSERT INTO journal_licences (activation_code_hash, code_last_four)",
  "VALUES",
  rows.map((row) => `  ('${row.hash}', '${row.lastFour}')`).join(",\n"),
  "ON CONFLICT (activation_code_hash) DO NOTHING;",
  "",
].join("\n");

await Promise.all([
  writeFile(resolve(outputDirectory, "book-activation-codes.csv"), csv, { encoding: "utf8", flag: "wx" }),
  writeFile(resolve(outputDirectory, "seed-activation-codes.sql"), sql, { encoding: "utf8", flag: "wx" }),
]);

console.log(`Generated ${rows.length} unique activation codes in ${outputDirectory}`);
