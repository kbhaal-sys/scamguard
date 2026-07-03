import Link from "next/link";
import RiskBadge from "@/components/RiskBadge";
import { ShieldMark } from "@/components/Header";

export default function Landing() {
  return (
    <>
      {/* HERO */}
      <section className="border-b border-line bg-white">
        <div className="mx-auto grid max-w-5xl gap-10 px-5 py-16 md:grid-cols-2 md:items-center md:py-24">
          <div>
            <p className="mb-4 inline-flex items-center gap-2 rounded-full bg-guard-soft px-4 py-1.5 text-sm font-semibold text-guard-dark">
              <ShieldMark className="h-4 w-4" /> Before you pay, scan it.
            </p>
            <h1 className="font-display text-4xl font-bold leading-tight sm:text-[44px]">
              Check if a message, link, invoice, or offer is a scam — before you pay.
            </h1>
            <p className="mt-4 text-lg leading-relaxed text-inkmut">
              Upload a screenshot, paste a message, or enter a link. Scam Guard will explain the risk in
              plain language — what the red flags are, why they matter, and exactly what to do next.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/scan" className="rounded-full bg-guard px-7 py-3.5 text-lg font-bold text-white hover:bg-guard-dark">
                Check something now
              </Link>
              <Link href="/pricing" className="rounded-full border border-line bg-white px-7 py-3.5 text-lg font-semibold hover:border-guard">
                See pricing
              </Link>
            </div>
            <p className="mt-4 text-sm text-inkmut">
              Free plan: 5 checks per month. No card required.
            </p>
          </div>

          {/* Example result preview */}
          <div className="rounded-xl2 border border-line bg-paper p-6 shadow-sm" aria-label="Example result">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-inkmut">Example result</p>
            <RiskBadge level="High" />
            <p className="mt-3 font-semibold">
              “This looks like a fake courier payment scam. Do not enter your card details.”
            </p>
            <div className="mt-3 font-display text-3xl font-bold text-risk-high">82<span className="text-lg text-inkmut">/100</span></div>
            <ul className="mt-4 space-y-2 text-[15px] text-ink/85">
              <li>⚑ The message creates urgency</li>
              <li>⚑ The link doesn’t match the official courier domain</li>
              <li>⚑ It asks for card details for a small “delivery fee”</li>
            </ul>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="mx-auto max-w-5xl px-5 py-16">
        <h2 className="font-display text-2xl font-bold sm:text-3xl">How it works</h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-3">
          {[
            ["1. Add what you received", "Paste the message, upload a screenshot, or enter the link. Tell us what kind of situation it is."],
            ["2. We check for scam patterns", "Urgency, impersonation, look-alike domains, unusual payment requests, and dozens of other indicators."],
            ["3. Get a plain-language answer", "A risk level, the red flags explained, what to do, what not to do — and a safe reply you can send."],
          ].map(([t, b]) => (
            <div key={t} className="rounded-xl2 border border-line bg-white p-6">
              <h3 className="font-display text-lg font-bold">{t}</h3>
              <p className="mt-2 leading-relaxed text-inkmut">{b}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAMILY */}
      <section className="border-t border-line bg-white">
        <div className="mx-auto max-w-5xl px-5 py-16">
          <div className="rounded-xl2 bg-guard-soft p-8 sm:p-10">
            <h2 className="font-display text-2xl font-bold text-guard-dark sm:text-3xl">
              Protect your parents, too.
            </h2>
            <p className="mt-3 max-w-2xl text-lg leading-relaxed text-ink/85">
              Help your parents check suspicious messages before they pay, click, or share personal data.
              The Family plan adds a shared protection circle — so a “is this real?” question is one tap away.
            </p>
            <Link href="/pricing" className="mt-6 inline-block rounded-full bg-guard px-6 py-3 font-bold text-white hover:bg-guard-dark">
              See the Family plan
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
