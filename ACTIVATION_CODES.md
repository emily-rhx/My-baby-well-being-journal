# Journal activation codes

The app now uses pre-issued, single-use activation codes. A code creates one account, is permanently marked as activated, and cannot create a second account. Returning purchasers sign in with their email and password. Authenticated requests use a signed, HTTP-only session cookie.

## Files produced

Run `pnpm codes:generate` once for each print batch. The command creates:

- `activation-code-output/book-activation-codes.csv` — send this private file to the printer or fulfilment process. `book_number` maps each physical book to its printed code.
- `activation-code-output/seed-activation-codes.sql` — import this file into the production PostgreSQL database before the books are distributed.

The output directory is ignored by Git because the raw codes are equivalent to product keys. Keep the CSV private and backed up securely. The database receives only SHA-256 fingerprints, never the printable codes.

## Production setup

1. Copy `.env.example` to `.env.local` for local development, or set the same variables in the hosting platform.
2. Set `DATABASE_URL` to the production PostgreSQL connection string.
3. Set `AUTH_SECRET` to a cryptographically random value of at least 32 characters.
4. Apply the Drizzle schema with `pnpm db:push`.
5. Import `activation-code-output/seed-activation-codes.sql` into that same database.
6. Test one code from the CSV before sending the print batch.

Never regenerate a replacement CSV for a batch that has already been printed. A new run creates a completely different set of codes.
