import { Pool } from "pg";

// Works with the Vercel Postgres (Neon) integration's env var, or a raw
// DATABASE_URL if connecting to Neon directly.
const connectionString =
  process.env.DATABASE_URL ??
  process.env.POSTGRES_URL ??
  process.env.POSTGRES_URL_NON_POOLING;

export class DatabaseNotConfiguredError extends Error {
  constructor() {
    super("No database connected — add a Postgres integration in the Vercel dashboard (Storage tab) and redeploy.");
    this.name = "DatabaseNotConfiguredError";
  }
}

let pool: Pool | null | undefined;

export function getPool(): Pool {
  if (pool === undefined) {
    pool = connectionString
      ? new Pool({ connectionString, ssl: connectionString.includes("localhost") ? false : { rejectUnauthorized: false } })
      : null;
  }
  if (!pool) throw new DatabaseNotConfiguredError();
  return pool;
}

export async function query<T = unknown>(text: string, params?: unknown[]): Promise<T[]> {
  const res = await getPool().query(text, params);
  return res.rows as T[];
}
