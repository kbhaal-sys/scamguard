import Link from "next/link";
import ScanForm from "@/components/ScanForm";
import { createClient, createServiceClient } from "@/lib/supabase/server";

export default async function Home() {
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
    <>
      {/* ============ TOOL-FIRST HERO ============ */}
      <section className="px-4 pb-14 pt-8 sm:px-5 sm:pt-12">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="fade-up font-display text-[26px] font-bold leading-tight sm:text-4xl">
            Check if a message, link, invoice, or offer is a scam — <span className="text-guard">before you pay</span>.
          </h1>
          <p className="fade-up d1 mx-auto mt-3 max-w-xl text-[15.5px] leading-relaxed text-inkmut sm:text-lg">
            Paste a message, upload a screenshot, or enter a link. SPeye explains the risk in plain language.
          </p>
        </div>

        <div id="scan" className="mx-auto mt-7 max-w-2xl scroll-mt-24">
          <ScanForm />
          <p className="mt-3 text-center text-[13.5px] text-inkmut">
            {user ? (
              remaining !== null
                ? <>{remaining} free {remaining === 1 ? "scan" : "scans"} left this month · <Link href="/pricing" className="font-semibold text-guard hover:underline">Upgrade</Link></>
                : <>Unlimited scans on your plan</>
            ) : (
              <>No account needed — 3 free checks per day.{" "}
                <Link href="/login" className="font-semibold text-guard hover:underline">Create a free account</Link>{" "}
                for 5/month + saved history.</>
            )}
          </p>
        </div>

        {/* trust strip */}
        <div className="fade-up d3 mx-auto mt-8 grid max-w-2xl grid-cols-1 gap-2 sm:grid-cols-3 sm:gap-3">
          {[
            ["🔒", "Private", "Screenshots are analyzed, never stored"],
            ["🗣️", "Plain language", "No jargon — clear verdicts and next steps"],
            ["⚡", "Seconds, not hours", "Risk level, red flags, and a safe reply"],
          ].map(([icon, t, b]) => (
            <div key={t as string} className="glass-soft flex items-center gap-3 rounded-2xl px-4 py-3 text-left sm:block sm:text-center">
              <span className="text-xl sm:mb-1 sm:block" aria-hidden>{icon}</span>
              <div>
                <p className="text-[14px] font-bold">{t}</p>
                <p className="text-[13px] leading-snug text-inkmut">{b}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ============ HOW IT WORKS ============ */}
      <section className="px-4 py-12 sm:px-5">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-center font-display text-2xl font-bold sm:text-3xl">How it works</h2>
          <div className="mt-7 grid gap-4 sm:grid-cols-3">
            {[
              ["1. Add what you received", "The suspicious message, screenshot, or link — and what kind of situation it is."],
              ["2. SPeye checks scam patterns", "Urgency, impersonation, look-alike domains, unusual payment requests, and more."],
              ["3. Get a clear answer", "Risk level, the red flags explained, what to do, what not to do — and a safe reply."],
            ].map(([t, b]) => (
              <div key={t} className="glass glass-hover rounded-3xl p-5 sm:p-6">
                <h3 className="font-display text-[16.5px] font-bold">{t}</h3>
                <p className="mt-1.5 text-[14.5px] leading-relaxed text-inkmut">{b}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ WHAT IT CATCHES ============ */}
      <section className="px-4 py-12 sm:px-5">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-center font-display text-2xl font-bold sm:text-3xl">Built for the scams people actually get</h2>
          <div className="mt-7 grid gap-4 sm:grid-cols-3">
            {[
              ["🎣", "Phishing & clone sites", "Fake bank, courier, or government pages built to steal your card and passwords."],
              ["🧬", "Malware in files", "\u201Cinvoice.pdf.exe\u201D attachments, tampered installers, infected archives."],
              ["🪤", "Scams & bait messages", "Blocked parcels, prizes you \u201Cwon\u201D, miracle investments, marketplace tricks."],
            ].map(([icon, t, b]) => (
              <div key={t} className="glass glass-hover rounded-3xl p-5 sm:p-6">
                <div className="glass-tint mb-3 grid h-11 w-11 place-items-center rounded-xl text-xl" aria-hidden>{icon}</div>
                <h3 className="font-display text-[16.5px] font-bold">{t}</h3>
                <p className="mt-1.5 text-[14.5px] leading-relaxed text-inkmut">{b}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ FAMILY ============ */}
      <section className="px-4 py-12 sm:px-5">
        <div className="mx-auto max-w-4xl">
          <div className="glass-tint rounded-3xl p-6 sm:p-9">
            <h2 className="font-display text-xl font-bold text-guard-dark sm:text-2xl">Protect your parents, too.</h2>
            <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-ink/85 sm:text-[16px]">
              Help your parents check suspicious messages before they pay, click, or share personal data.
              The Family plan adds a shared protection circle — a “is this real?” answer, one tap away.
            </p>
            <Link href="/pricing" className="btn-shine mt-5 inline-block rounded-full px-6 py-3 font-bold text-white">
              See the Family plan
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
