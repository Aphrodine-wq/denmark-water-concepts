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

const packages = [
  {
    key: "starter",
    name: "Starter",
    price: "$1,600",
    blurb: "The essentials to get online and take payments.",
    features: [
      "Responsive website — home, services, water quality, contact",
      "Online bill-pay portal",
      "Report-a-leak & start/stop request forms",
      "Hosting, SSL, monitoring & support",
    ],
  },
  {
    key: "standard",
    name: "Standard",
    price: "$2,200",
    blurb: "Everything in Starter, plus live payments and self-service.",
    popular: true,
    features: [
      "Autopay enrollment for members",
      "Live payment processor — wired to your billing",
      "Service-notice manager (post outages yourself)",
      "Go-live setup + staff training",
    ],
  },
  {
    key: "premium",
    name: "Premium",
    price: "$3,000",
    blurb: "The full system, fully integrated.",
    features: [
      "Two-way sync with your billing software (live balances)",
      "Text & email bill reminders",
      "Document center — CCR reports, board minutes, agendas",
      "Get-found local SEO setup + priority support",
    ],
  },
];

export default function ConceptChooser() {
  const [design, setDesign] = useState<string | null>(null);
  const [pkg, setPkg] = useState<string | null>(null);

  const chosenDesign = concepts.find((c) => c.key === design);
  const chosenPkg = packages.find((p) => p.key === pkg);

  const lines = [
    chosenDesign ? `Design: ${chosenDesign.name} (${chosenDesign.url})` : "Design: (still deciding)",
    chosenPkg ? `Package: ${chosenPkg.name} — ${chosenPkg.price} build + $60/mo` : "Package: (still deciding)",
  ].join("\n");

  const mailto = `mailto:${VOTE_EMAIL}?subject=${encodeURIComponent(
    "Denmark Water — our pick"
  )}&body=${encodeURIComponent(`Hi James,\n\nHere's what the board picked:\n\n${lines}\n\nLet's move forward.\n\nThanks,\nDenmark Water Association`)}`;

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800">
      <div className="mx-auto max-w-5xl px-5 py-12 md:py-16">
        {/* Header */}
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">For review · Denmark Water Association</p>
        <h1 className="mt-2 font-serif text-4xl font-semibold tracking-tight text-slate-900 md:text-5xl">
          Your new website — pick a look &amp; a package
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-slate-600">
          Three complete, working design directions and three packages. Open each design live, click around —
          try <strong>Pay My Bill</strong> — then pick the look and the package you want. Hit send and we&apos;re off.
        </p>

        {/* Step 1: design */}
        <h2 className="mt-12 font-serif text-2xl font-semibold text-slate-900">1 · Pick your look</h2>
        <div className="mt-6 space-y-8">
          {concepts.map((c, i) => {
            const isPicked = design === c.key;
            return (
              <div key={c.key} className={`overflow-hidden rounded-2xl border-2 bg-white shadow-sm transition ${isPicked ? "border-slate-900 shadow-lg" : "border-transparent"}`}>
                <div className="grid md:grid-cols-2">
                  <a href={c.url} target="_blank" rel="noopener noreferrer" className="group relative block">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={c.shot} alt={`${c.name} preview`} className="h-full w-full object-cover object-top md:max-h-80" />
                    <span className="absolute inset-0 flex items-center justify-center bg-slate-900/0 text-lg font-bold text-white opacity-0 transition group-hover:bg-slate-900/40 group-hover:opacity-100">Open live site →</span>
                  </a>
                  <div className="flex flex-col p-7 md:p-8">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold uppercase tracking-wide text-slate-400">Option {i + 1}</span>
                      <span className="h-2.5 w-2.5 rounded-full" style={{ background: c.accent }} />
                    </div>
                    <h3 className="mt-2 font-serif text-3xl font-semibold text-slate-900">{c.name}</h3>
                    <p className="text-sm font-semibold" style={{ color: c.accent }}>{c.tag}</p>
                    <p className="mt-3 text-slate-600">{c.desc}</p>
                    <div className="mt-auto flex flex-wrap gap-3 pt-6">
                      <a href={c.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-700">View live site →</a>
                      <button onClick={() => setDesign(c.key)} className={`inline-flex items-center gap-2 rounded-lg border-2 px-5 py-3 text-sm font-bold transition ${isPicked ? "border-slate-900 bg-slate-900 text-white" : "border-slate-300 text-slate-700 hover:border-slate-900"}`}>{isPicked ? "✓ This is our look" : "Pick this look"}</button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Step 2: package */}
        <h2 className="mt-14 font-serif text-2xl font-semibold text-slate-900">2 · Pick your package</h2>
        <p className="mt-2 text-slate-600">Each package includes everything in the one before it. All run on <strong>$60/mo</strong> hosting &amp; care.</p>
        <div className="mt-6 grid gap-6 md:grid-cols-3">
          {packages.map((p) => {
            const isPicked = pkg === p.key;
            return (
              <button
                key={p.key}
                onClick={() => setPkg(p.key)}
                className={`relative flex flex-col rounded-2xl border-2 bg-white p-7 text-left shadow-sm transition ${isPicked ? "border-slate-900 shadow-lg" : "border-transparent hover:border-slate-300"}`}
              >
                {p.popular && (
                  <span className="absolute -top-3 left-7 rounded-full bg-slate-900 px-3 py-1 text-xs font-bold uppercase tracking-wide text-white">Most popular</span>
                )}
                <span className="font-serif text-xl font-semibold text-slate-900">{p.name}</span>
                <span className="mt-2 font-serif text-4xl font-semibold text-slate-900">{p.price}</span>
                <span className="text-sm text-slate-500">build · + $60/mo</span>
                <span className="mt-3 text-sm text-slate-600">{p.blurb}</span>
                <ul className="mt-4 space-y-2 text-sm text-slate-600">
                  {p.features.map((f) => (
                    <li key={f} className="flex gap-2"><span className="mt-0.5 text-green-600">✓</span>{f}</li>
                  ))}
                </ul>
                <span className={`mt-6 inline-flex items-center justify-center gap-2 rounded-lg border-2 px-4 py-2.5 text-sm font-bold transition ${isPicked ? "border-slate-900 bg-slate-900 text-white" : "border-slate-300 text-slate-700"}`}>
                  {isPicked ? "✓ Our package" : "Choose " + p.name}
                </span>
              </button>
            );
          })}
        </div>

        {/* Send */}
        <div className="mt-12 rounded-2xl bg-slate-900 p-8 text-white md:p-10">
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div>
              <p className="text-sm text-slate-400">Your pick</p>
              <p className="font-serif text-2xl font-semibold">
                {chosenDesign ? chosenDesign.name : "Choose a look"}
                <span className="text-slate-500"> · </span>
                {chosenPkg ? `${chosenPkg.name} (${chosenPkg.price})` : "choose a package"}
              </p>
              <p className="mt-1 text-slate-300">Pick a look and a package above, then send it over.</p>
            </div>
            <a
              href={mailto}
              className={`inline-flex items-center gap-2 rounded-lg px-7 py-4 text-lg font-bold transition ${design || pkg ? "bg-white text-slate-900 hover:bg-slate-100" : "pointer-events-none bg-slate-700 text-slate-400"}`}
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
