"use client";

import { useState } from "react";

const VOTE_EMAIL = "jamesburge.mcm@gmail.com";

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
    accent: "#b45309",
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
];

export default function DesignChooser() {
  const [pick, setPick] = useState<string | null>(null);
  const chosen = designs.find((d) => d.key === pick);

  const mailto = chosen
    ? `mailto:${VOTE_EMAIL}?subject=${encodeURIComponent(
        `Denmark Water — we pick "${chosen.design}"`
      )}&body=${encodeURIComponent(
        `Hi James,\n\nThe board picked the "${chosen.design}" design (${price} build + ${hosting}).\n${chosen.url}\n\nLet's move forward.\n\nThanks,\nDenmark Water Association`
      )}`
    : "";

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800">
      <div className="mx-auto max-w-5xl px-5 py-12 md:py-16">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">For review · Denmark Water Association</p>
        <h1 className="mt-2 font-serif text-4xl font-semibold tracking-tight text-slate-900 md:text-5xl">
          One site, two looks
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-slate-600">
          Same build, same price — just pick the look that fits. Each design is a complete, working
          site you can open and click through — try <strong>Pay My Bill</strong>. <strong>{price}</strong> to
          build, <strong>{hosting}</strong> hosting &amp; care after that.
        </p>

        <div className="mt-10 space-y-8">
          {designs.map((d) => {
            const isPicked = pick === d.key;
            return (
              <div key={d.key} className={`relative overflow-hidden rounded-2xl border-2 bg-white shadow-sm transition ${isPicked ? "border-slate-900 shadow-lg" : "border-transparent"}`}>
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
                    <div className="mt-auto flex flex-wrap gap-3 pt-6">
                      <a href={d.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-700">View live site →</a>
                      <button onClick={() => setPick(d.key)} className={`inline-flex items-center gap-2 rounded-lg border-2 px-5 py-3 text-sm font-bold transition ${isPicked ? "border-slate-900 bg-slate-900 text-white" : "border-slate-300 text-slate-700 hover:border-slate-900"}`}>{isPicked ? "✓ This is our pick" : "Pick this one"}</button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-10 rounded-2xl bg-slate-900 p-8 text-white md:p-10">
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div>
              <p className="text-sm text-slate-400">Your pick</p>
              <p className="font-serif text-2xl font-semibold">
                {chosen ? `${chosen.design} · ${price}` : "Pick a design above"}
              </p>
              <p className="mt-1 text-slate-300">Choose the one you want, then send it over and we&apos;ll get started.</p>
            </div>
            <a
              href={mailto}
              className={`inline-flex items-center gap-2 rounded-lg px-7 py-4 text-lg font-bold transition ${chosen ? "bg-white text-slate-900 hover:bg-slate-100" : "pointer-events-none bg-slate-700 text-slate-400"}`}
            >
              Send our pick →
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
