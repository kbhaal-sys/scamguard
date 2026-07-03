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
    <form onSubmit={submit} className="mt-6 rounded-xl2 border border-line bg-white p-6">
      <div className="mb-5 grid grid-cols-2 gap-2 rounded-xl bg-paper p-1.5">
        {(["signin", "signup"] as const).map((m) => (
          <button key={m} type="button" onClick={() => setMode(m)}
            className={`rounded-lg px-3 py-2.5 font-semibold ${mode === m ? "bg-guard text-white" : "text-inkmut"}`}>
            {m === "signin" ? "Sign in" : "Create account"}
          </button>
        ))}
      </div>
      <label className="block">
        <span className="mb-1 block font-semibold">Email</span>
        <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-xl border border-line bg-paper p-3.5 outline-none focus:border-guard" />
      </label>
      <label className="mt-4 block">
        <span className="mb-1 block font-semibold">Password</span>
        <input type="password" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-xl border border-line bg-paper p-3.5 outline-none focus:border-guard" />
        {mode === "signup" && <span className="mt-1 block text-sm text-inkmut">At least 8 characters.</span>}
      </label>
      {err && <p role="alert" className="mt-4 rounded-lg bg-red-50 px-4 py-3 font-medium text-risk-high">{err}</p>}
      {msg && <p className="mt-4 rounded-lg bg-guard-soft px-4 py-3 font-medium text-guard-dark">{msg}</p>}
      <button disabled={loading} className="mt-6 w-full rounded-xl bg-guard px-6 py-3.5 text-lg font-bold text-white hover:bg-guard-dark disabled:opacity-60">
        {loading ? "Please wait…" : mode === "signin" ? "Sign in" : "Create free account"}
      </button>
    </form>
  );
}
