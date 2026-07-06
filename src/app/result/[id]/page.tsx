import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import ResultCard from "@/components/ResultCard";
import type { ScanRow } from "@/lib/types";

export const metadata = { title: "Scan result — SPeye" };
export const dynamic = "force-dynamic";

export default async function ResultPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  // basic UUID sanity check to avoid pointless DB round-trips
  if (!/^[0-9a-f-]{36}$/i.test(id)) notFound();

  // Fetch with the service client (not dependent on the visitor's JWT freshness),
  // then enforce access rules explicitly:
  //  - anonymous scans (user_id null) are viewable by anyone with the link
  //  - owned scans are viewable only by their owner
  const service = createServiceClient();
  const { data: scan } = await service.from("scans").select("*").eq("id", id).single();
  if (!scan) notFound();

  if (scan.user_id) {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user || user.id !== scan.user_id) notFound();
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-5 sm:py-10">
      <div className="mb-5 flex items-center justify-between print:hidden">
        <h1 className="font-display text-2xl font-bold">Scan result</h1>
        <Link href="/scan" className="font-semibold text-guard hover:underline">+ New scan</Link>
      </div>
      <ResultCard scan={scan as ScanRow} />
    </div>
  );
}
