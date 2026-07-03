import type { ScanRow } from "@/lib/types";
import RiskBadge from "./RiskBadge";
import ResultActions from "./ResultActions";

const SCORE_COLOR: Record<string, string> = {
  Low: "text-risk-low",
  Medium: "text-risk-medium",
  High: "text-risk-high",
  Critical: "text-risk-critical",
};

export default function ResultCard({ scan }: { scan: ScanRow }) {
  return (
    <article className="glass fade-up rounded-3xl print:border-0 print:shadow-none">
      {/* Head */}
      <div className="flex flex-col gap-4 border-b border-white/60 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
        <div>
          <RiskBadge level={scan.risk_level} big />
          <p className="mt-3 max-w-xl text-lg font-semibold leading-snug text-ink">{scan.verdict}</p>
        </div>
        <div className="shrink-0 text-center">
          <div className={`font-display text-5xl font-bold ${SCORE_COLOR[scan.risk_level]}`}>
            {scan.risk_score}
            <span className="text-2xl text-inkmut">/100</span>
          </div>
          <div className="mt-1 text-sm text-inkmut">risk score · {scan.confidence_level} confidence</div>
        </div>
      </div>

      <div className="space-y-8 p-6 sm:p-8">
        {scan.summary && (
          <section>
            <h2 className="mb-2 font-display text-lg font-bold">What this looks like</h2>
            <p className="text-[16.5px] leading-relaxed text-ink/90">{scan.summary}</p>
          </section>
        )}

        {scan.red_flags?.length > 0 && (
          <section>
            <h2 className="mb-3 font-display text-lg font-bold">Red flags we found</h2>
            <ul className="space-y-3">
              {scan.red_flags.map((f, i) => (
                <li key={i} className="glass-soft rounded-2xl p-4">
                  <p className="font-semibold text-risk-high">⚑ {f.title}</p>
                  <p className="mt-1 text-[15.5px] leading-relaxed text-ink/85">{f.explanation}</p>
                </li>
              ))}
            </ul>
          </section>
        )}

        <div className="grid gap-6 sm:grid-cols-2">
          {scan.recommended_actions?.length > 0 && (
            <section className="glass-tint rounded-2xl p-5">
              <h2 className="mb-2 font-display text-lg font-bold text-guard-dark">Do this now</h2>
              <ul className="list-inside space-y-2 text-[15.5px] leading-relaxed">
                {scan.recommended_actions.map((a, i) => (
                  <li key={i} className="flex gap-2"><span aria-hidden>✓</span><span>{a}</span></li>
                ))}
              </ul>
            </section>
          )}
          {scan.what_not_to_do?.length > 0 && (
            <section className="rounded-2xl border border-risk-high/15 bg-red-50/70 p-5 backdrop-blur">
              <h2 className="mb-2 font-display text-lg font-bold text-risk-high">Do not</h2>
              <ul className="space-y-2 text-[15.5px] leading-relaxed">
                {scan.what_not_to_do.map((a, i) => (
                  <li key={i} className="flex gap-2"><span aria-hidden>✕</span><span>{a}</span></li>
                ))}
              </ul>
            </section>
          )}
        </div>

        {scan.safe_reply && (
          <section>
            <h2 className="mb-2 font-display text-lg font-bold">A safe reply you can send</h2>
            <blockquote className="glass-soft rounded-2xl border-l-4 border-l-guard p-4 text-[16px] italic leading-relaxed">
              “{scan.safe_reply}”
            </blockquote>
          </section>
        )}

        <ResultActions scan={scan} />

        <p className="border-t border-white/60 pt-4 text-[13px] leading-relaxed text-inkmut">
          This assessment is automated risk guidance based on patterns in the content you provided. It is
          not legal or financial advice, and no result means something is guaranteed safe. When money or
          personal data is involved, verify through an official channel first.
        </p>
      </div>
    </article>
  );
}
