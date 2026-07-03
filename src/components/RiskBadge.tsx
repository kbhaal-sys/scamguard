import type { RiskLevel } from "@/lib/types";

const STYLES: Record<RiskLevel, { bg: string; label: string }> = {
  Low: { bg: "from-emerald-500 to-green-600 shadow-emerald-600/30", label: "Low risk" },
  Medium: { bg: "from-amber-500 to-orange-600 shadow-orange-600/30", label: "Medium risk — verify first" },
  High: { bg: "from-red-500 to-rose-600 shadow-rose-600/30", label: "High risk — likely scam" },
  Critical: { bg: "from-red-800 to-red-950 shadow-red-900/40", label: "Critical risk — do not proceed" },
};

export default function RiskBadge({ level, big = false }: { level: RiskLevel; big?: boolean }) {
  const s = STYLES[level];
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full bg-gradient-to-br font-semibold text-white shadow-lg ring-1 ring-inset ring-white/30 ${s.bg} ${
        big ? "px-5 py-2 text-lg" : "px-3 py-1 text-sm"
      }`}
    >
      <span className="h-2.5 w-2.5 rounded-full bg-white/90 shadow-[0_0_6px_rgba(255,255,255,0.9)]" aria-hidden />
      {s.label}
    </span>
  );
}
