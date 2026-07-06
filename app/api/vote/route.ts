import { NextRequest, NextResponse } from "next/server";
import { castVote, getTally, DESIGNS, VotingNotConfiguredError, type DesignKey } from "@/lib/votes";

export const dynamic = "force-dynamic";

function isDesignKey(value: unknown): value is DesignKey {
  return typeof value === "string" && (DESIGNS as readonly string[]).includes(value);
}

export async function GET() {
  try {
    const tally = await getTally();
    return NextResponse.json({ tally });
  } catch (err) {
    if (err instanceof VotingNotConfiguredError) {
      return NextResponse.json({ tally: null, error: err.message }, { status: 503 });
    }
    return NextResponse.json({ tally: null, error: "Unexpected error reading votes." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const { design, voter } = (body ?? {}) as { design?: unknown; voter?: unknown };
  if (!isDesignKey(design)) {
    return NextResponse.json({ error: `design must be one of: ${DESIGNS.join(", ")}` }, { status: 400 });
  }
  if (voter !== undefined && typeof voter !== "string") {
    return NextResponse.json({ error: "voter must be a string." }, { status: 400 });
  }

  try {
    const tally = await castVote(design, voter);
    return NextResponse.json({ tally });
  } catch (err) {
    if (err instanceof VotingNotConfiguredError) {
      return NextResponse.json({ tally: null, error: err.message }, { status: 503 });
    }
    return NextResponse.json({ tally: null, error: "Unexpected error casting vote." }, { status: 500 });
  }
}
