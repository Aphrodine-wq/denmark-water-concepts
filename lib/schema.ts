// Denmark Water Association — design voting schema.
// Kept as a TS string (not a .sql file read via fs) so it's reliably
// bundled into the serverless function — Next.js doesn't trace raw
// fs.readFileSync() path strings the way it traces imports.
export const SCHEMA_SQL = `
CREATE TABLE IF NOT EXISTS vote_tally (
  design TEXT PRIMARY KEY,
  count INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS vote_log (
  id SERIAL PRIMARY KEY,
  design TEXT NOT NULL,
  voter TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
`;
