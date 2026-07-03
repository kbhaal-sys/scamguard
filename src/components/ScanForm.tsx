"use client";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { CATEGORIES, type InputType } from "@/lib/types";

const TABS: { id: InputType; label: string; hint: string }[] = [
  { id: "text", label: "Paste text", hint: "The message, email, or offer you received" },
  { id: "image", label: "Upload screenshot", hint: "PNG, JPG, or WEBP — up to 4 MB" },
  { id: "url", label: "Check a link", hint: "The web address you were sent" },
];

export default function ScanForm() {
  const router = useRouter();
  const [tab, setTab] = useState<InputType>("text");
  const [category, setCategory] = useState("unknown");
  const [text, setText] = useState("");
  const [url, setUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);

  function pickFile(f: File | null) {
    setFile(f);
    setPreview(null);
    if (f) {
      const r = new FileReader();
      r.onload = () => setPreview(r.result as string);
      r.readAsDataURL(f);
    }
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const payload: Record<string, unknown> = { input_type: tab, category };
    if (tab === "text") {
      if (!text.trim()) return setError("Paste the message you want to check.");
      payload.text = text;
    } else if (tab === "url") {
      if (!url.trim()) return setError("Enter the link you want to check.");
      payload.url = url.trim();
    } else {
      if (!file) return setError("Choose a screenshot or photo first.");
      if (file.size > 4 * 1024 * 1024) return setError("That file is over 4 MB. Try a smaller screenshot.");
      const dataUrl = await new Promise<string>((res, rej) => {
        const r = new FileReader();
        r.onload = () => res(r.result as string);
        r.onerror = () => rej(new Error("read failed"));
        r.readAsDataURL(file);
      });
      const [meta, b64] = dataUrl.split(",");
      payload.image_base64 = b64;
      payload.image_media_type = meta.match(/data:(.*?);/)?.[1] || "image/png";
    }

    setLoading(true);
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "The analysis failed. Please try again.");
        return;
      }
      router.push(`/result/${data.id}`);
    } catch {
      setError("Could not reach the server. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} className="glass fade-up rounded-3xl p-5 sm:p-7">
      {/* Tabs */}
      <div className="glass-soft mb-5 grid grid-cols-3 gap-2 rounded-2xl p-1.5" role="tablist" aria-label="Input type">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={tab === t.id}
            onClick={() => { setTab(t.id); setError(null); }}
            className={`rounded-lg px-3 py-2.5 text-[15px] font-semibold transition ${
              tab === t.id ? "btn-shine text-white" : "text-inkmut hover:bg-white/50 hover:text-ink"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
      <p className="mb-4 text-sm text-inkmut">{TABS.find((t) => t.id === tab)!.hint}</p>

      {/* Inputs */}
      {tab === "text" && (
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={7}
          placeholder={"Example:\n\"Your package is held at customs. Pay the 2.99 fee here: dhl-parcel-verify.top/pay\""}
          className="w-full rounded-2xl border border-white/70 bg-white/60 p-4 text-[16px] leading-relaxed outline-none backdrop-blur focus:border-guard focus:bg-white/80 transition"
        />
      )}
      {tab === "url" && (
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          inputMode="url"
          placeholder="https://the-link-you-received.example"
          className="w-full rounded-2xl border border-white/70 bg-white/60 p-4 font-mono text-[15px] outline-none backdrop-blur focus:border-guard focus:bg-white/80 transition"
        />
      )}
      {tab === "image" && (
        <div>
          <input
            ref={fileInput}
            type="file"
            accept="image/png,image/jpeg,image/webp,image/gif"
            className="hidden"
            onChange={(e) => pickFile(e.target.files?.[0] ?? null)}
          />
          <button
            type="button"
            onClick={() => fileInput.current?.click()}
            className="glass-hover flex w-full flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-guard/30 bg-white/40 p-8 text-inkmut backdrop-blur hover:border-guard hover:text-ink"
          >
            {preview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={preview} alt="Selected screenshot" className="max-h-56 rounded-lg" />
            ) : (
              <>
                <span className="text-3xl" aria-hidden>🖼️</span>
                <span className="font-semibold">Tap to choose a screenshot</span>
                <span className="text-sm">It is analyzed privately and not stored.</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* Category */}
      <label className="mt-5 block">
        <span className="mb-1.5 block text-[15px] font-semibold text-ink">What kind of situation is this?</span>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full rounded-2xl border border-white/70 bg-white/60 p-3.5 text-[16px] outline-none backdrop-blur focus:border-guard transition"
        >
          {CATEGORIES.map((c) => (
            <option key={c.id} value={c.id}>{c.label}</option>
          ))}
        </select>
      </label>

      {error && (
        <p role="alert" className="mt-4 rounded-xl border border-risk-high/20 bg-red-50/80 px-4 py-3 text-[15px] font-medium text-risk-high backdrop-blur">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="btn-shine mt-6 w-full rounded-2xl px-6 py-4 text-lg font-bold text-white disabled:opacity-60"
      >
        {loading ? "Checking… this takes a few seconds" : "Check risk"}
      </button>
      <p className="mt-3 text-center text-[13px] text-inkmut">
        Scam Guard provides risk guidance, not legal or financial advice.
      </p>
    </form>
  );
}
