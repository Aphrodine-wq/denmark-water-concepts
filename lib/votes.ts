import { query, DatabaseNotConfiguredError } from "@/lib/db";

export const DESIGNS = ["community", "modern"] as const;
export type DesignKey = (typeof DESIGNS)[number];

export class VotingNotConfiguredError extends Error {
  constructor() {
    super("No database connected — add a Postgres integration in the Vercel dashboard (Storage tab) and redeploy.");
    this.name = "VotingNotConfiguredError";
  }
}

export type Tally = Record<DesignKey, number>;

function wrap<T>(fn: () => Promise<T>): Promise<T> {
  return fn().catch((err) => {
    if (err instanceof DatabaseNotConfiguredError) throw new VotingNotConfiguredError();
    throw err;
  });
}

export async function getTally(): Promise<Tally> {
  return wrap(async () => {
    const rows = await query<{ design: string; count: number }>("SELECT design, count FROM vote_tally");
    const tally = {} as Tally;
    for (const key of DESIGNS) {
      const row = rows.find((r) => r.design === key);
      tally[key] = row?.count ?? 0;
    }
    return tally;
  });
}

export interface VoteEntry {
  design: DesignKey;
  voter: string | null;
  ts: number;
}

export async function castVote(design: DesignKey, voter?: string): Promise<Tally> {
  return wrap(async () => {
    await query(
      `INSERT INTO vote_tally (design, count) VALUES ($1, 1)
       ON CONFLICT (design) DO UPDATE SET count = vote_tally.count + 1`,
      [design]
    );
    await query(`INSERT INTO vote_log (design, voter) VALUES ($1, $2)`, [design, voter?.trim() || null]);
    return getTally();
  });
}

export async function getRecentVotes(limit = 50): Promise<VoteEntry[]> {
  return wrap(async () => {
    const rows = await query<{ design: DesignKey; voter: string | null; created_at: string }>(
      `SELECT design, voter, created_at FROM vote_log ORDER BY created_at DESC LIMIT $1`,
      [limit]
    );
    return rows.map((row) => ({ design: row.design, voter: row.voter, ts: new Date(row.created_at).getTime() }));
  });
}

export async function resetVotes(): Promise<Tally> {
  return wrap(async () => {
    await query(`DELETE FROM vote_log`);
    await query(`UPDATE vote_tally SET count = 0`);
    return getTally();
  });
}
