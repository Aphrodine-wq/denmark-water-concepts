import { Redis } from "@upstash/redis";

export const DESIGNS = ["community", "modern"] as const;
export type DesignKey = (typeof DESIGNS)[number];

const TALLY_KEY = "dw:votes:tally";
const LOG_KEY = "dw:votes:log";
const LOG_MAX = 200;

export class VotingNotConfiguredError extends Error {
  constructor() {
    super("No Redis store connected — add a Redis integration in the Vercel dashboard (Storage tab) and redeploy.");
    this.name = "VotingNotConfiguredError";
  }
}

let client: Redis | null | undefined;

function getRedis(): Redis {
  if (client === undefined) {
    // Support both the Vercel KV integration's env names and raw Upstash names.
    const url = process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL;
    const token = process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN;
    client = url && token ? new Redis({ url, token }) : null;
  }
  if (!client) throw new VotingNotConfiguredError();
  return client;
}

export type Tally = Record<DesignKey, number>;

export async function getTally(): Promise<Tally> {
  const redis = getRedis();
  const raw = (await redis.hgetall<Record<string, number | string>>(TALLY_KEY)) ?? {};
  const tally = {} as Tally;
  for (const key of DESIGNS) {
    const value = raw[key];
    tally[key] = typeof value === "string" ? parseInt(value, 10) || 0 : value ?? 0;
  }
  return tally;
}

export interface VoteEntry {
  design: DesignKey;
  voter: string | null;
  ts: number;
}

export async function castVote(design: DesignKey, voter?: string): Promise<Tally> {
  const redis = getRedis();
  await redis.hincrby(TALLY_KEY, design, 1);
  const entry: VoteEntry = { design, voter: voter?.trim() || null, ts: Date.now() };
  await redis.lpush(LOG_KEY, JSON.stringify(entry));
  await redis.ltrim(LOG_KEY, 0, LOG_MAX - 1);
  return getTally();
}

export async function getRecentVotes(limit = 50): Promise<VoteEntry[]> {
  const redis = getRedis();
  const raw = await redis.lrange<string>(LOG_KEY, 0, limit - 1);
  return raw
    .map((item) => {
      try {
        return typeof item === "string" ? (JSON.parse(item) as VoteEntry) : (item as unknown as VoteEntry);
      } catch {
        return null;
      }
    })
    .filter((entry): entry is VoteEntry => entry !== null);
}
