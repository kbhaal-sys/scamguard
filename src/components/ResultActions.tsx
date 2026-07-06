"use client";
import { useState } from "react";
import type { ScanRow } from "@/lib/types";

export default function ResultActions({ scan }: { scan: ScanRow }) {
  const [copied, setCopied] = useState(false);

  function asText(): string {
    const lines = [
      `SPeye result — ${scan.risk_level} risk (${scan.risk_score}/100)`,
      scan.verdict,
      "",
      "Red flags:",
      ...scan.red_flags.map((f) => `- ${f.title}: ${f.explanation}`),
      "",
      "Recommended actions:",
      ...scan.recommended_actions.map((a) => `- ${a}`),
      "",
      "Do not:",
      ...scan.what_not_to_do.map((a) => `- ${a}`),
    ];
    if (scan.safe_reply) lines.push("", `Safe reply: "${scan.safe_reply}"`);
    lines.push("", "Checked with SPeye — risk guidance, not legal or financial advice.");
    return lines.join("\n");
  }

  async function copy() {
    await navigator.clipboard.writeText(asText());
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  async function share() {
    const text = asText();
    if (navigator.share) {
      try { await navigator.share({ title: "SPeye warning", text }); } catch { /* cancelled */ }
    } else {
      await copy();
    }
  }

  return (
    <div className="flex flex-wrap gap-3 print:hidden">
      <button onClick={copy} className="glass-soft glass-hover rounded-full px-5 py-2.5 font-semibold">
        {copied ? "Copied ✓" : "Copy result"}
      </button>
      <button onClick={() => window.print()} className="glass-soft glass-hover rounded-full px-5 py-2.5 font-semibold">
        Download PDF
      </button>
      <button onClick={share} className="btn-shine rounded-full px-5 py-2.5 font-semibold text-white">
        Share warning with family
      </button>
    </div>
  );
}
