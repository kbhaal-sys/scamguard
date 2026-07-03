import type { RiskLevel } from "@/lib/types";

const STYLES: Record<RiskLevel, { bg: string; label: string }> = {
  Low: { bg: "bg-risk-low", label: "Low risk" },
  Medium: { bg: "bg-risk-medium", label: "Medium risk — verify first" },
  High: { bg: "bg-risk-high", label: "High risk — likely scam" },
  Critical: { bg: "bg-risk-critical", label: "Critical risk — do not proceed" },
};

export default function RiskBadge({ level, big = false }: { level: RiskLevel; big?: boolean }) {
  const s = STYLES[level];
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full font-semibold text-white ${s.bg} ${
        big ? "px-5 py-2 text-lg" : "px-3 py-1 text-sm"
      }`}
    >
      <span className="h-2.5 w-2.5 rounded-full bg-white/80" aria-hidden />
      {s.label}
    </span>
  );
}
