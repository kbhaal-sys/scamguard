import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import RiskBadge from "@/components/RiskBadge";
import EmptyState from "@/components/EmptyState";
import type { ScanRow, UserProfile } from "@/lib/types";

export const metadata = { title: "Dashboard — Scam Guard" };

const PLAN_LABEL = { free: "Free", plus: "Plus", family: "Family" } as const;

export default async function Dashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/dashboard");

  const service = createServiceClient();
  const [{ data: profile }, { data: scans }] = await Promise.all([
    service.from("users").select("*").eq("id", user.id).single(),
    supabase.from("scans").select("*").order("created_at", { ascending: false }).limit(5),
  ]);
  const p = profile as UserProfile | null;
  const recent = (scans ?? []) as ScanRow[];

  return (
    <div className="mx-auto max-w-4xl px-5 py-10">
      <h1 className="font-display text-3xl font-bold">Your dashboard</h1>

      {/* Stats */}
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl2 border border-line bg-white p-5">
          <p className="text-sm text-inkmut">Plan</p>
          <p className="font-display text-2xl font-bold">{p ? PLAN_LABEL[p.subscription_status] : "—"}</p>
          {p?.subscription_status === "free" && (
            <Link href="/pricing" className="mt-1 inline-block text-sm font-semibold text-guard hover:underline">Upgrade →</Link>
          )}
        </div>
        <div className="rounded-xl2 border border-line bg-white p-5">
          <p className="text-sm text-inkmut">Scans this month</p>
          <p className="font-display text-2xl font-bold">
            {p ? (p.subscription_status === "free" ? `${p.scans_used_this_month} / ${p.monthly_scan_limit}` : `${p.scans_used_this_month} · unlimited`) : "—"}
          </p>
        </div>
        <div className="flex items-center justify-center rounded-xl2 bg-guard p-5">
          <Link href="/scan" className="text-center font-display text-xl font-bold text-white">+ New scan</Link>
        </div>
      </div>

      {/* Recent scans */}
      <div className="mt-10 flex items-center justify-between">
        <h2 className="font-display text-xl font-bold">Recent scans</h2>
        <Link href="/history" className="font-semibold text-guard hover:underline">Full history →</Link>
      </div>
      <div className="mt-4">
        {recent.length === 0 ? (
          <EmptyState
            title="No scans yet"
            body="Received something that smells off? A courier SMS, a too-good marketplace deal, an urgent invoice — check it before you act."
            cta="Run your first scan"
            href="/scan"
          />
        ) : (
          <ul className="divide-y divide-line overflow-hidden rounded-xl2 border border-line bg-white">
            {recent.map((s) => (
              <li key={s.id}>
                <Link href={`/result/${s.id}`} className="flex items-center justify-between gap-4 p-4 hover:bg-paper">
                  <div className="min-w-0">
                    <p className="truncate font-semibold">{s.verdict || s.category_detected}</p>
                    <p className="text-sm text-inkmut">{new Date(s.created_at).toLocaleString()} · {s.input_type}</p>
                  </div>
                  <RiskBadge level={s.risk_level} />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Family circle placeholder */}
      <div className="mt-10 rounded-xl2 bg-guard-soft p-7">
        <p className="text-xs font-bold uppercase tracking-wider text-guard-dark">Family plan · coming soon</p>
        <h2 className="mt-1 font-display text-2xl font-bold text-guard-dark">Family protection circle</h2>
        <p className="mt-2 max-w-2xl leading-relaxed text-ink/85">
          Help your parents check suspicious messages before they pay, click, or share personal data.
          Planned: family alerts, shared scam reports, an emergency warning button, and trusted-contact review.
        </p>
        <button disabled className="mt-4 cursor-not-allowed rounded-full bg-guard/50 px-6 py-3 font-bold text-white">
          Create your circle (soon)
        </button>
      </div>
    </div>
  );
}
