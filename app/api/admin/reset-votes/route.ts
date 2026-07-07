import { NextRequest, NextResponse } from "next/server";
import { resetVotes, VotingNotConfiguredError } from "@/lib/votes";

export const dynamic = "force-dynamic";

// Zeroes out the tally and clears the vote log. Gated by ADMIN_SETUP_TOKEN,
// same as /api/admin/migrate.
export async function POST(req: NextRequest) {
  const token = req.headers.get("x-setup-token");
  const expected = process.env.ADMIN_SETUP_TOKEN;
  if (!expected || token !== expected) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    const tally = await resetVotes();
    return NextResponse.json({ ok: true, tally });
  } catch (err) {
    if (err instanceof VotingNotConfiguredError) {
      return NextResponse.json({ error: err.message }, { status: 503 });
    }
    return NextResponse.json({ error: err instanceof Error ? err.message : "Reset failed." }, { status: 500 });
  }
}
