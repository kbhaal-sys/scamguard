import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import ResultCard from "@/components/ResultCard";
import type { ScanRow } from "@/lib/types";

export const metadata = { title: "Scan result — Scam Guard" };

export default async function ResultPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  // RLS guarantees users can only read their own scans
  const { data: scan } = await supabase.from("scans").select("*").eq("id", id).single();
  if (!scan) notFound();

  return (
    <div className="mx-auto max-w-3xl px-5 py-10">
      <div className="mb-5 flex items-center justify-between print:hidden">
        <h1 className="font-display text-2xl font-bold">Scan result</h1>
        <Link href="/scan" className="font-semibold text-guard hover:underline">+ New scan</Link>
      </div>
      <ResultCard scan={scan as ScanRow} />
    </div>
  );
}
