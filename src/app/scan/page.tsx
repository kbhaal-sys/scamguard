import Link from "next/link";
import ScanForm from "@/components/ScanForm";
import { createClient, createServiceClient } from "@/lib/supabase/server";

export const metadata = { title: "New scan — Scam Guard" };

export default async function ScanPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let remaining: number | null = null;
  if (user) {
    const service = createServiceClient();
    const { data: p } = await service.from("users").select("*").eq("id", user.id).single();
    if (p && p.subscription_status === "free") {
      remaining = Math.max(0, p.monthly_scan_limit - p.scans_used_this_month);
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-5 py-10">
      <h1 className="font-display text-3xl font-bold">Check something suspicious</h1>
      <p className="mt-2 text-lg text-inkmut">
        A message, a link, an invoice, an offer — if it involves money or personal data, scan it first.
      </p>
      {user ? (
        remaining !== null && (
          <p className="mt-3 inline-block rounded-full bg-guard-soft px-4 py-1.5 text-sm font-semibold text-guard-dark">
            {remaining} free {remaining === 1 ? "scan" : "scans"} left this month
          </p>
        )
      ) : (
        <p className="mt-3 text-sm text-inkmut">
          No account needed — you get 3 free checks per day.{" "}
          <Link href="/login" className="font-semibold text-guard hover:underline">
            Create a free account
          </Link>{" "}
          for 5 scans per month plus saved history.
        </p>
      )}
      <div className="mt-6">
        <ScanForm />
      </div>
    </div>
  );
}
