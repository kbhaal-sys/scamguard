"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") || "/dashboard";
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null); setMsg(null); setLoading(true);
    const supabase = createClient();
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setMsg("Account created. If email confirmation is enabled, check your inbox — otherwise you can sign in now.");
        setMode("signin");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        router.push(next);
        router.refresh();
      }
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} className="glass fade-up mt-6 rounded-3xl p-6">
      <div className="glass-soft mb-5 grid grid-cols-2 gap-2 rounded-2xl p-1.5">
        {(["signin", "signup"] as const).map((m) => (
          <button key={m} type="button" onClick={() => setMode(m)}
            className={`rounded-lg px-3 py-2.5 font-semibold ${mode === m ? "btn-shine text-white" : "text-inkmut hover:bg-white/50"}`}>
            {m === "signin" ? "Sign in" : "Create account"}
          </button>
        ))}
      </div>
      <label className="block">
        <span className="mb-1 block font-semibold">Email</span>
        <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-2xl border border-white/70 bg-white/60 p-3.5 outline-none backdrop-blur transition focus:border-guard focus:bg-white/80" />
      </label>
      <label className="mt-4 block">
        <span className="mb-1 block font-semibold">Password</span>
        <input type="password" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-2xl border border-white/70 bg-white/60 p-3.5 outline-none backdrop-blur transition focus:border-guard focus:bg-white/80" />
        {mode === "signup" && <span className="mt-1 block text-sm text-inkmut">At least 8 characters.</span>}
      </label>
      {err && <p role="alert" className="mt-4 rounded-xl border border-risk-high/20 bg-red-50/80 px-4 py-3 font-medium text-risk-high backdrop-blur">{err}</p>}
      {msg && <p className="glass-tint mt-4 rounded-xl px-4 py-3 font-medium text-guard-dark">{msg}</p>}
      <button disabled={loading} className="btn-shine mt-6 w-full rounded-2xl px-6 py-3.5 text-lg font-bold text-white disabled:opacity-60">
        {loading ? "Please wait…" : mode === "signin" ? "Sign in" : "Create free account"}
      </button>
    </form>
  );
}
