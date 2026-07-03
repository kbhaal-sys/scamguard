import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import RiskBadge from "@/components/RiskBadge";
import EmptyState from "@/components/EmptyState";
import type { ScanRow } from "@/lib/types";

export const metadata = { title: "Scan history — Scam Guard" };

export default async function History() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/history");

  const { data } = await supabase
    .from("scans")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100);
  const scans = (data ?? []) as ScanRow[];

  return (
    <div className="mx-auto max-w-4xl px-5 py-10">
      <h1 className="font-display text-3xl font-bold">Scan history</h1>
      <p className="mt-2 text-inkmut">Everything you've checked, most recent first.</p>
      <div className="mt-6">
        {scans.length === 0 ? (
          <EmptyState title="Nothing here yet" body="Your past scans will appear here so you can revisit any verdict." cta="Run a scan" href="/scan" />
        ) : (
          <ul className="glass fade-up divide-y divide-white/60 overflow-hidden rounded-3xl">
            {scans.map((s) => (
              <li key={s.id}>
                <Link href={`/result/${s.id}`} className="flex items-center justify-between gap-4 p-4 transition hover:bg-white/60">
                  <div className="min-w-0">
                    <p className="truncate font-semibold">{s.verdict || s.category_detected}</p>
                    <p className="text-sm text-inkmut">
                      {new Date(s.created_at).toLocaleString()} · {s.input_type}
                      {s.checked_url ? ` · ${s.checked_url.slice(0, 60)}` : ""}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-3">
                    <span className="hidden font-display font-bold text-inkmut sm:block">{s.risk_score}/100</span>
                    <RiskBadge level={s.risk_level} />
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
