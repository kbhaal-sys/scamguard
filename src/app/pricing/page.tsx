import Link from "next/link";

export const metadata = { title: "Pricing — Scam Guard" };

const PLANS = [
  {
    name: "Free",
    price: "€0",
    tagline: "Try it on your next suspicious message.",
    features: ["5 scans per month", "Text and URL checks", "Basic risk analysis"],
    cta: { label: "Start free", href: "/login" },
    featured: false,
  },
  {
    name: "Plus",
    price: "€4.99",
    tagline: "For people who get scam attempts weekly.",
    features: ["Unlimited scans", "Screenshot analysis", "Saved scan history", "Safe reply generator"],
    cta: { label: "Get Plus", href: "/login" },
    featured: true,
  },
  {
    name: "Family",
    price: "€9.99",
    tagline: "Protect the people who get targeted most.",
    features: ["Everything in Plus", "Family sharing", "Elderly parent protection mode", "PDF reports", "Priority analysis"],
    cta: { label: "Get Family", href: "/login" },
    featured: false,
  },
];

export default function Pricing() {
  return (
    <div className="mx-auto max-w-5xl px-5 py-14">
      <h1 className="text-center font-display text-3xl font-bold sm:text-4xl">Simple pricing</h1>
      <p className="mx-auto mt-3 max-w-xl text-center text-lg text-inkmut">
        One scam avoided pays for years of Scam Guard.
      </p>
      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {PLANS.map((p) => (
          <div key={p.name}
            className={`glass glass-hover flex flex-col rounded-3xl p-7 ${p.featured ? "ring-2 ring-guard/40" : ""}`}>
            {p.featured && <p className="mb-2 text-xs font-bold uppercase tracking-wider text-guard">Most popular</p>}
            <h2 className="font-display text-2xl font-bold">{p.name}</h2>
            <p className="mt-1 text-inkmut">{p.tagline}</p>
            <p className="mt-4 font-display text-4xl font-bold">
              {p.price}<span className="text-base font-normal text-inkmut">/month</span>
            </p>
            <ul className="mt-5 flex-1 space-y-2.5">
              {p.features.map((f) => (
                <li key={f} className="flex gap-2 text-[15.5px]"><span className="text-guard" aria-hidden>✓</span>{f}</li>
              ))}
            </ul>
            <Link href={p.cta.href}
              className={`mt-6 rounded-full px-6 py-3 text-center font-bold ${p.featured ? "btn-shine text-white" : "glass-soft glass-hover"}`}>
              {p.cta.label}
            </Link>
          </div>
        ))}
      </div>
      <div className="glass-tint mt-12 rounded-3xl p-8">
        <h2 className="font-display text-xl font-bold text-guard-dark">Elderly parent protection mode</h2>
        <p className="mt-2 max-w-3xl leading-relaxed text-ink/85">
          Help your parents check suspicious messages before they pay, click, or share personal data.
          Create a family protection circle: they scan (or forward to you), everyone in the circle sees the
          warning. Planned features: family alerts, shared scam reports, an emergency warning button, and
          trusted-contact review.
        </p>
      </div>
      <p className="mt-8 text-center text-sm text-inkmut">
        Payments are not wired up in this MVP — the subscription structure (plans, limits, statuses) is
        ready for Stripe or another provider.
      </p>
    </div>
  );
}
