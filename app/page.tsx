"use client";

import { useState } from "react";

const VOTE_EMAIL = "jamesburge.mcm@gmail.com";

const concepts = [
  {
    key: "civic",
    name: "Civic Blue",
    tag: "Trustworthy & municipal",
    desc: "The classic, dependable utility look — clean blue, big readable type, the safe choice most residents expect.",
    url: "https://denmark-water-civic-blue.vercel.app",
    shot: "/shots/civic-blue.png",
    accent: "#2563eb",
  },
  {
    key: "modern",
    name: "Modern",
    tag: "Clean & editorial",
    desc: "Bright, premium, magazine-style with a split layout. Stands apart from every other water-utility site.",
    url: "https://denmark-water-modern-slate.vercel.app",
    shot: "/shots/modern-slate.png",
    accent: "#0e7490",
  },
  {
    key: "community",
    name: "Community Spring",
    tag: "Warm & neighborly",
    desc: "Friendly and approachable — soft greens, rounded shapes. Reads like a neighbor, not a bureaucracy.",
    url: "https://denmark-water-community-spring.vercel.app",
    shot: "/shots/community-spring.png",
    accent: "#15803d",
  },
];

export default function ConceptChooser() {
  const [picked, setPicked] = useState<string | null>(null);
  const chosen = concepts.find((c) => c.key === picked);

  const mailto = chosen
    ? `mailto:${VOTE_EMAIL}?subject=${encodeURIComponent(
        `Denmark Water — we pick: ${chosen.name}`
      )}&body=${encodeURIComponent(
        `Hi James,\n\nThe board picked the "${chosen.name}" concept (${chosen.url}).\n\nLet's move forward.\n\nThanks,\nDenmark Water Association`
      )}`
    : "";

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800">
      <div className="mx-auto max-w-5xl px-5 py-12 md:py-16">
        {/* Header */}
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">For review · Denmark Water Association</p>
        <h1 className="mt-2 font-serif text-4xl font-semibold tracking-tight text-slate-900 md:text-5xl">
          Pick your website design
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-slate-600">
          Three complete, working directions for your new website and online bill-pay portal. Open each one
          live, click around — try <strong>Pay My Bill</strong> — then pick the look you like best. We build that one out.
        </p>
        <p className="mt-3 inline-flex items-center gap-2 rounded-lg bg-white px-3 py-1.5 text-sm text-slate-600 shadow-sm">
          One price — <strong className="text-slate-900">$2,000 build + $60/mo hosting</strong>. Same price whichever you choose.
        </p>

        {/* Concept cards */}
        <div className="mt-10 space-y-8">
          {concepts.map((c, i) => {
            const isPicked = picked === c.key;
            return (
              <div
                key={c.key}
                className={`overflow-hidden rounded-2xl border-2 bg-white shadow-sm transition ${
                  isPicked ? "border-slate-900 shadow-lg" : "border-transparent"
                }`}
              >
                <div className="grid md:grid-cols-2">
                  <a href={c.url} target="_blank" rel="noopener noreferrer" className="group relative block">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={c.shot} alt={`${c.name} preview`} className="h-full w-full object-cover object-top md:max-h-80" />
                    <span className="absolute inset-0 flex items-center justify-center bg-slate-900/0 text-lg font-bold text-white opacity-0 transition group-hover:bg-slate-900/40 group-hover:opacity-100">
                      Open live site →
                    </span>
                  </a>
                  <div className="flex flex-col p-7 md:p-8">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold uppercase tracking-wide text-slate-400">Option {i + 1}</span>
                      <span className="h-2.5 w-2.5 rounded-full" style={{ background: c.accent }} />
                    </div>
                    <h2 className="mt-2 font-serif text-3xl font-semibold text-slate-900">{c.name}</h2>
                    <p className="text-sm font-semibold" style={{ color: c.accent }}>{c.tag}</p>
                    <p className="mt-3 text-slate-600">{c.desc}</p>
                    <div className="mt-auto flex flex-wrap gap-3 pt-6">
                      <a
                        href={c.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-700"
                      >
                        View live site →
                      </a>
                      <button
                        onClick={() => setPicked(c.key)}
                        className={`inline-flex items-center gap-2 rounded-lg border-2 px-5 py-3 text-sm font-bold transition ${
                          isPicked
                            ? "border-slate-900 bg-slate-900 text-white"
                            : "border-slate-300 text-slate-700 hover:border-slate-900"
                        }`}
                      >
                        {isPicked ? "✓ This is our pick" : "Pick this one"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Vote / send */}
        <div className="mt-10 rounded-2xl bg-slate-900 p-8 text-white md:p-10">
          {chosen ? (
            <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
              <div>
                <p className="text-sm text-slate-400">Your pick</p>
                <p className="font-serif text-3xl font-semibold">{chosen.name}</p>
                <p className="mt-1 text-slate-300">Send it over and we&apos;ll get started.</p>
              </div>
              <a
                href={mailto}
                className="inline-flex items-center gap-2 rounded-lg bg-white px-7 py-4 text-lg font-bold text-slate-900 transition hover:bg-slate-100"
              >
                Send our pick →
              </a>
            </div>
          ) : (
            <p className="text-lg text-slate-300">
              Take a look at all three, then hit <strong className="text-white">Pick this one</strong> on your favorite — a send button shows up here.
            </p>
          )}
        </div>

        <footer className="mt-10 flex flex-col items-center justify-between gap-2 border-t border-slate-300 pt-6 text-sm text-slate-500 md:flex-row">
          <span>Prepared by <strong className="text-slate-700">Walt Builds</strong></span>
          <a href={`mailto:${VOTE_EMAIL}`} className="hover:text-slate-700">{VOTE_EMAIL}</a>
        </footer>
      </div>
    </div>
  );
}
