"use client";

import { useEffect, useState } from "react";

const VOTE_EMAIL = "jamesburge.mcm@gmail.com";
const VOTED_KEY = "dw-vote-choice";

const price = "$2,000 flat";
const hosting = "$200/mo";
const sharedFeatures = [
  "Association site — home, about, service area, board and office info",
  "Water quality reports — CCR posting section",
  "Outage & notice board — boil-water advisories, front and center",
  "Bill pay & contact — payment instructions, office hours, contact form",
  "Found on Google — local SEO and structured data",
];

const designs = [
  {
    key: "community",
    design: "Community Spring",
    accent: "#62472f",
    url: "https://denmark-water-community-spring.vercel.app",
    shot: "/shots/community-spring.png",
    look: "Warm & neighborly — soft, friendly, reads like a neighbor.",
  },
  {
    key: "modern",
    design: "Modern",
    accent: "#0e7490",
    url: "https://denmark-water-modern-slate.vercel.app",
    shot: "/shots/modern-slate.png",
    look: "Clean & editorial — bright, premium, magazine-style.",
  },
] as const;

type Tally = Record<string, number>;

export default function DesignChooser() {
  const [voted, setVoted] = useState<string | null>(null);
  const [voterName, setVoterName] = useState("");
  const [tally, setTally] = useState<Tally | null>(null);
  const [votingDisabled, setVotingDisabled] = useState(false);
  const [castingKey, setCastingKey] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setVoted(localStorage.getItem(VOTED_KEY));
    fetch("/api/vote")
      .then((res) => res.json().then((data) => ({ ok: res.ok, data })))
      .then(({ ok, data }) => {
        if (!ok) {
          setVotingDisabled(true);
          setError(data.error ?? "Voting isn't connected yet.");
          return;
        }
        setTally(data.tally);
      })
      .catch(() => {
        setVotingDisabled(true);
        setError("Couldn't reach the vote count.");
      });
  }, []);

  const totalVotes = tally ? Object.values(tally).reduce((a, b) => a + b, 0) : 0;

  async function castVote(key: string) {
    setCastingKey(key);
    setError(null);
    try {
      const res = await fetch("/api/vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ design: key, voter: voterName || undefined }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Couldn't cast your vote.");
        return;
      }
      setTally(data.tally);
      setVoted(key);
      localStorage.setItem(VOTED_KEY, key);
    } catch {
      setError("Couldn't reach the vote count — check your connection and try again.");
    } finally {
      setCastingKey(null);
    }
  }

  function clearVote() {
    localStorage.removeItem(VOTED_KEY);
    setVoted(null);
    setVoterName("");
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
      <div className="mx-auto max-w-5xl px-5 py-12 md:py-16">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">For review · Denmark Water Association</p>
          {!votingDisabled && tally && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-900 px-3.5 py-1.5 text-xs font-bold text-white">
              {totalVotes} vote{totalVotes === 1 ? "" : "s"} so far
            </span>
          )}
        </div>
        <h1 className="mt-2 font-serif text-4xl font-semibold tracking-tight text-slate-900 md:text-5xl">
          One site, two looks
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-slate-600">
          Same build, same price — just vote for the look that fits. Each design is a complete, working
          site you can open and click through — try <strong>Pay My Bill</strong>. <strong>{price}</strong> to
          build, <strong>{hosting}</strong> hosting &amp; care after that.
        </p>

        {!voted && !votingDisabled && (
          <label className="mt-6 block max-w-sm">
            <span className="text-sm font-semibold text-slate-600">Your name (optional, for the record)</span>
            <input
              type="text"
              value={voterName}
              onChange={(e) => setVoterName(e.target.value)}
              placeholder="e.g. Board member name"
              className="mt-1.5 w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-slate-900 outline-none focus:border-slate-900"
            />
          </label>
        )}

        {votingDisabled && (
          <div className="mt-6 rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
            Voting isn&apos;t connected yet — {error} You can still open each site and pick with the buttons below;
            votes just won&apos;t be counted until storage is connected.
          </div>
        )}

        {voted && (
          <div className="mt-6 rounded-xl border border-emerald-300 bg-emerald-50 p-4 text-sm text-emerald-900">
            ✓ Your vote for <strong>{votedDesign?.design}</strong> is recorded. Thanks!{" "}
            <button onClick={clearVote} className="font-semibold underline underline-offset-2 hover:text-emerald-700">
              Not you? Clear this device so someone else can vote →
            </button>
          </div>
        )}

        <div className="mt-10 space-y-8">
          {designs.map((d) => {
            const votes = tally?.[d.key] ?? 0;
            const pct = totalVotes ? Math.round((votes / totalVotes) * 100) : 0;
            const isMyVote = voted === d.key;
            const isCasting = castingKey === d.key;
            return (
              <div key={d.key} className={`relative overflow-hidden rounded-2xl border-2 bg-white shadow-sm transition ${isMyVote ? "border-slate-900 shadow-lg" : "border-transparent"}`}>
                <div className="grid md:grid-cols-2">
                  <a href={d.url} target="_blank" rel="noopener noreferrer" className="group relative block">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={d.shot} alt={`${d.design} preview`} className="h-full w-full object-cover object-top md:max-h-96" />
                    <span className="absolute inset-0 flex items-center justify-center bg-slate-900/0 text-lg font-bold text-white opacity-0 transition group-hover:bg-slate-900/40 group-hover:opacity-100">Open live site →</span>
                  </a>
                  <div className="flex flex-col p-7 md:p-8">
                    <div className="flex items-baseline justify-between gap-3">
                      <h2 className="font-serif text-3xl font-semibold text-slate-900">{d.design}</h2>
                      <div className="text-right">
                        <div className="font-serif text-3xl font-semibold text-slate-900">{price}</div>
                        <div className="text-xs text-slate-500">+ {hosting}</div>
                      </div>
                    </div>
                    <p className="mt-1 text-sm font-medium text-slate-500">{d.look}</p>
                    <ul className="mt-4 space-y-1.5 text-sm text-slate-600">
                      {sharedFeatures.map((f) => (
                        <li key={f} className="flex gap-2"><span className="mt-0.5" style={{ color: d.accent }}>✓</span>{f}</li>
                      ))}
                    </ul>

                    {!votingDisabled && tally && (
                      <div className="mt-5">
                        <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
                          <span>{votes} vote{votes === 1 ? "" : "s"}</span>
                          <span>{pct}%</span>
                        </div>
                        <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-slate-100">
                          <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: d.accent }} />
                        </div>
                      </div>
                    )}

                    <div className="mt-auto flex flex-wrap gap-3 pt-6">
                      <a href={d.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-700">View live site →</a>
                      <button
                        onClick={() => castVote(d.key)}
                        disabled={!!voted || votingDisabled || isCasting}
                        className={`inline-flex items-center gap-2 rounded-lg border-2 px-5 py-3 text-sm font-bold transition disabled:cursor-not-allowed ${isMyVote ? "border-slate-900 bg-slate-900 text-white" : "border-slate-300 text-slate-700 hover:border-slate-900 disabled:opacity-40"}`}
                      >
                        {isCasting ? "Voting…" : isMyVote ? "✓ Your vote" : "Vote for this design"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {error && !votingDisabled && (
          <p className="mt-4 text-sm font-semibold text-red-600">{error}</p>
        )}

        <div className="mt-10 rounded-2xl bg-slate-900 p-8 text-white md:p-10">
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div>
              <p className="text-sm text-slate-400">Live results</p>
              <p className="font-serif text-2xl font-semibold">
                {tally ? `${totalVotes} vote${totalVotes === 1 ? "" : "s"} so far` : votingDisabled ? "Voting not connected" : "Loading…"}
              </p>
              <p className="mt-1 text-slate-300">Everyone who opens this page can vote once. Results update live for all viewers.</p>
            </div>
            <a
              href={mailto}
              className="inline-flex items-center gap-2 rounded-lg bg-white px-7 py-4 text-lg font-bold text-slate-900 transition hover:bg-slate-100"
            >
              Email me the results →
            </a>
          </div>
        </div>

        <footer className="mt-10 flex flex-col items-center justify-between gap-2 border-t border-slate-300 pt-6 text-sm text-slate-500 md:flex-row">
          <span>Prepared by <strong className="text-slate-700">Walt Builds</strong></span>
          <a href={`mailto:${VOTE_EMAIL}`} className="hover:text-slate-700">{VOTE_EMAIL}</a>
        </footer>
      </div>
    </div>
  );
}
