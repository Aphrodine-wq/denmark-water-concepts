"use client";

import { useState } from "react";

const VOTE_EMAIL = "jamesburge.mcm@gmail.com";

const tiers = [
  {
    key: "civic",
    design: "Civic Blue",
    tier: "Starter",
    price: "$1,600",
    accent: "#2563eb",
    url: "https://denmark-water-civic-blue.vercel.app",
    shot: "/shots/civic-blue.png",
    look: "Trustworthy & municipal — the classic, dependable utility look.",
    why: "The essentials, done clean. Everything a resident needs to pay online and nothing they don't — a sharp, simple site that gets the job done.",
    features: [
      "Responsive website — home, services, water quality, contact",
      "Online bill-pay portal",
      "Report-a-leak & start/stop request forms",
      "Hosting, SSL, monitoring & support",
    ],
  },
  {
    key: "community",
    design: "Community Spring",
    tier: "Standard",
    price: "$2,200",
    accent: "#15803d",
    url: "https://denmark-water-community-spring.vercel.app",
    shot: "/shots/community-spring.png",
    look: "Warm & neighborly — soft, friendly, reads like a neighbor.",
    why: "A fuller site with self-service built in. Adds a rates page, a service-notice banner you control, autopay, and live card payments wired to your billing — more site, more value.",
    popular: true,
    features: [
      "Everything in Starter, plus —",
      "Rates page + service-notice banner",
      "Autopay enrollment for members",
      "Live payment processor + staff training",
    ],
  },
  {
    key: "modern",
    design: "Modern",
    tier: "Premium",
    price: "$3,000",
    accent: "#0e7490",
    url: "https://denmark-water-modern-slate.vercel.app",
    shot: "/shots/modern-slate.png",
    look: "Clean & editorial — bright, premium, magazine-style.",
    why: "The complete system, fully built out. A documents center, FAQ, two-way sync with your billing software, automatic reminders, and local SEO — the most site, and it looks it.",
    features: [
      "Everything in Standard, plus —",
      "Documents center (CCR, minutes) + FAQ",
      "Two-way billing sync — live balances",
      "Text & email reminders + local SEO",
    ],
  },
];

export default function TierChooser() {
  const [pick, setPick] = useState<string | null>(null);
  const chosen = tiers.find((t) => t.key === pick);

  const mailto = chosen
    ? `mailto:${VOTE_EMAIL}?subject=${encodeURIComponent(
        `Denmark Water — we pick the ${chosen.tier} (${chosen.design})`
      )}&body=${encodeURIComponent(
        `Hi James,\n\nThe board picked the ${chosen.tier} package — the "${chosen.design}" site (${chosen.price} build + $60/mo).\n${chosen.url}\n\nLet's move forward.\n\nThanks,\nDenmark Water Association`
      )}`
    : "";

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800">
      <div className="mx-auto max-w-5xl px-5 py-12 md:py-16">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">For review · Denmark Water Association</p>
        <h1 className="mt-2 font-serif text-4xl font-semibold tracking-tight text-slate-900 md:text-5xl">
          Three websites, three packages
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-slate-600">
          Each design is a complete, working site you can open and click through — try <strong>Pay My Bill</strong>.
          The more you choose, the more we build. Pick the one that fits, hit send, and we&apos;re off. All packages run on <strong>$60/mo</strong> hosting &amp; care.
        </p>

        <div className="mt-10 space-y-8">
          {tiers.map((t) => {
            const isPicked = pick === t.key;
            return (
              <div key={t.key} className={`relative overflow-hidden rounded-2xl border-2 bg-white shadow-sm transition ${isPicked ? "border-slate-900 shadow-lg" : "border-transparent"}`}>
                {t.popular && (
                  <span className="absolute left-5 top-5 z-10 rounded-full bg-slate-900 px-3 py-1 text-xs font-bold uppercase tracking-wide text-white shadow-lg">Most popular</span>
                )}
                <div className="grid md:grid-cols-2">
                  <a href={t.url} target="_blank" rel="noopener noreferrer" className="group relative block">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={t.shot} alt={`${t.design} preview`} className="h-full w-full object-cover object-top md:max-h-96" />
                    <span className="absolute inset-0 flex items-center justify-center bg-slate-900/0 text-lg font-bold text-white opacity-0 transition group-hover:bg-slate-900/40 group-hover:opacity-100">Open live site →</span>
                  </a>
                  <div className="flex flex-col p-7 md:p-8">
                    <div className="flex items-baseline justify-between gap-3">
                      <div>
                        <span className="text-xs font-bold uppercase tracking-wide" style={{ color: t.accent }}>{t.tier}</span>
                        <h2 className="font-serif text-3xl font-semibold text-slate-900">{t.design}</h2>
                      </div>
                      <div className="text-right">
                        <div className="font-serif text-3xl font-semibold text-slate-900">{t.price}</div>
                        <div className="text-xs text-slate-500">+ $60/mo</div>
                      </div>
                    </div>
                    <p className="mt-1 text-sm font-medium text-slate-500">{t.look}</p>
                    <p className="mt-3 text-sm text-slate-600">{t.why}</p>
                    <ul className="mt-4 space-y-1.5 text-sm text-slate-600">
                      {t.features.map((f) => (
                        <li key={f} className="flex gap-2"><span className="mt-0.5" style={{ color: t.accent }}>✓</span>{f}</li>
                      ))}
                    </ul>
                    <div className="mt-auto flex flex-wrap gap-3 pt-6">
                      <a href={t.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-700">View live site →</a>
                      <button onClick={() => setPick(t.key)} className={`inline-flex items-center gap-2 rounded-lg border-2 px-5 py-3 text-sm font-bold transition ${isPicked ? "border-slate-900 bg-slate-900 text-white" : "border-slate-300 text-slate-700 hover:border-slate-900"}`}>{isPicked ? "✓ This is our pick" : "Pick this one"}</button>
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
                {chosen ? `${chosen.tier} — ${chosen.design} · ${chosen.price}` : "Pick a package above"}
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
