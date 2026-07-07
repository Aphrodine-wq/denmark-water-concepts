"use client";

import { useEffect, useState } from "react";

const VOTE_EMAIL = "jamesburge.mcm@gmail.com";
const VOTED_KEY = "dw-vote-choice";
const TALLY_KEY = "dw-vote-tally";

const price = "$2,000 flat";
const hosting = "$200/mo";

const designs = [
  {
    key: "community",
    design: "Community Spring",
    accent: "#62472f",
    url: "https://denmark-water-community-spring.vercel.app",
    shot: "/shots/community-spring.png",
    look: "Warm & neighborly",
  },
  {
    key: "modern",
    design: "Modern",
    accent: "#0e7490",
    url: "https://denmark-water-modern-slate.vercel.app",
    shot: "/shots/modern-slate.png",
    look: "Clean & editorial",
  },
] as const;

type Tally = Record<string, number>;

const EMPTY_TALLY: Tally = { community: 0, modern: 0 };

function loadTally(): Tally {
  try {
    const raw = localStorage.getItem(TALLY_KEY);
    if (raw) return { ...EMPTY_TALLY, ...JSON.parse(raw) };
  } catch {
    // ignore malformed storage
  }
  return { ...EMPTY_TALLY };
}

export default function DesignChooser() {
  const [voted, setVoted] = useState<string | null>(null);
  const [tally, setTally] = useState<Tally | null>(null);

  useEffect(() => {
    setVoted(localStorage.getItem(VOTED_KEY));
    setTally(loadTally());
  }, []);

  const totalVotes = tally ? Object.values(tally).reduce((a, b) => a + b, 0) : 0;

  function castVote(key: string) {
    if (voted) return;
    const next = { ...(tally ?? EMPTY_TALLY), [key]: (tally?.[key] ?? 0) + 1 };
    localStorage.setItem(TALLY_KEY, JSON.stringify(next));
    localStorage.setItem(VOTED_KEY, key);
    setTally(next);
    setVoted(key);
  }

  function clearVote() {
    localStorage.removeItem(VOTED_KEY);
    setVoted(null);
  }

  function resetAllVotes() {
    if (!confirm("Reset the vote count back to zero on this device? This can't be undone.")) return;
    localStorage.setItem(TALLY_KEY, JSON.stringify(EMPTY_TALLY));
    localStorage.removeItem(VOTED_KEY);
    setTally({ ...EMPTY_TALLY });
    setVoted(null);
  }

  const votedDesign = designs.find((d) => d.key === voted);
  const mailto = `mailto:${VOTE_EMAIL}?subject=${encodeURIComponent(
    "Denmark Water — website vote results"
  )}&body=${encodeURIComponent(
    tally
      ? `Hi James,\n\nCurrent vote count:\n${designs
          .map((d) => `${d.design}: ${tally[d.key] ?? 0}`)
          .join("\n")}\n\nThanks,\nDenmark Water Association`
      : "Hi James,\n\n"
  )}`;

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800">
      <div className="mx-auto max-w-4xl px-5 py-12 md:py-16">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">For review · Denmark Water Association</p>
          {tally && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-900 px-3.5 py-1.5 text-xs font-bold text-white">
              {totalVotes} vote{totalVotes === 1 ? "" : "s"} so far
            </span>
          )}
        </div>
        <h1 className="mt-2 font-serif text-4xl font-semibold tracking-tight text-slate-900 md:text-5xl">
          Which look fits us better?
        </h1>

        {tally && totalVotes > 0 && (
          <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5 text-sm">
            {designs.map((d) => {
              const votes = tally[d.key] ?? 0;
              const pct = totalVotes ? Math.round((votes / totalVotes) * 100) : 0;
              return (
                <span key={d.key} className="inline-flex items-center gap-1.5 font-semibold text-slate-700">
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: d.accent }} />
                  {d.design}: {votes} ({pct}%)
                </span>
              );
            })}
          </div>
        )}

        {voted && (
          <div className="mt-6 rounded-xl border border-emerald-300 bg-emerald-50 p-4 text-sm text-emerald-900">
            ✓ Your vote for <strong>{votedDesign?.design}</strong> is recorded. Thanks!{" "}
            <button onClick={clearVote} className="font-semibold underline underline-offset-2 hover:text-emerald-700">
              Not you? Clear this device →
            </button>
          </div>
        )}

        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          {designs.map((d) => {
            const votes = tally?.[d.key] ?? 0;
            const pct = totalVotes ? Math.round((votes / totalVotes) * 100) : 0;
            const isMyVote = voted === d.key;
            return (
              <div key={d.key} className={`overflow-hidden rounded-2xl border-2 bg-white shadow-sm transition ${isMyVote ? "border-slate-900 shadow-lg" : "border-transparent"}`}>
                <a href={d.url} target="_blank" rel="noopener noreferrer" className="group relative block">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={d.shot} alt={`${d.design} preview`} className="aspect-[4/3] w-full object-cover object-top" />
                  <span className="absolute inset-0 flex items-center justify-center bg-slate-900/0 text-base font-bold text-white opacity-0 transition group-hover:bg-slate-900/40 group-hover:opacity-100">Open live site →</span>
                  {tally && totalVotes > 0 && (
                    <span className="absolute right-3 top-3 rounded-full bg-white/95 px-3 py-1 text-xs font-bold text-slate-900 shadow">
                      {pct}% · {votes} vote{votes === 1 ? "" : "s"}
                    </span>
                  )}
                </a>
                <div className="flex items-center justify-between gap-3 p-5">
                  <div>
                    <h2 className="font-serif text-2xl font-semibold text-slate-900">{d.design}</h2>
                    <p className="text-sm font-medium" style={{ color: d.accent }}>{d.look}</p>
                  </div>
                  <button
                    onClick={() => castVote(d.key)}
                    disabled={!!voted}
                    className={`shrink-0 rounded-lg px-5 py-3 text-sm font-bold transition disabled:cursor-not-allowed ${isMyVote ? "bg-slate-900 text-white" : "border-2 border-slate-300 text-slate-700 hover:border-slate-900 disabled:opacity-40"}`}
                  >
                    {isMyVote ? "✓ Voted" : "Vote"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <p className="mt-8 text-base font-bold text-slate-800">Same either way: {price} to build, {hosting} hosting &amp; care.</p>

        <footer className="mt-6 flex flex-col items-center justify-between gap-2 border-t border-slate-300 pt-6 text-sm text-slate-500 md:flex-row">
          <span>Prepared by <strong className="text-slate-700">Walt Builds</strong></span>
          <span className="flex items-center gap-4">
            <a href={mailto} className="hover:text-slate-700">Email me the results →</a>
            <button onClick={resetAllVotes} className="text-slate-400 hover:text-slate-600">Reset count</button>
          </span>
        </footer>
      </div>
    </div>
  );
}
