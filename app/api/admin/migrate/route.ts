import { NextRequest, NextResponse } from "next/server";
import { getPool, DatabaseNotConfiguredError } from "@/lib/db";
import { SCHEMA_SQL } from "@/lib/schema";

export const dynamic = "force-dynamic";

// One-time (idempotent) schema setup. Gated by ADMIN_SETUP_TOKEN so this
// can't be triggered by anyone browsing the public repo — set that env var
// in the Vercel dashboard, call this once, then rotate/remove the token.
export async function POST(req: NextRequest) {
  const token = req.headers.get("x-setup-token");
  const expected = process.env.ADMIN_SETUP_TOKEN;
  if (!expected || token !== expected) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    await getPool().query(SCHEMA_SQL);
    return NextResponse.json({ ok: true });
  } catch (err) {
    if (err instanceof DatabaseNotConfiguredError) {
      return NextResponse.json({ error: err.message }, { status: 503 });
    }
    return NextResponse.json({ error: err instanceof Error ? err.message : "Migration failed." }, { status: 500 });
  }
}
