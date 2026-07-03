import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import SignOutButton from "./SignOutButton";

export default async function Header() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <header className="sticky top-0 z-40 glass-soft border-b border-white/60">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4">
        <Link href="/" className="flex items-center gap-2 font-display text-xl font-bold text-ink">
          <ShieldMark />
          Scam Guard
        </Link>
        <nav className="flex items-center gap-5 text-[15px]">
          <Link href="/pricing" className="hidden text-inkmut hover:text-ink sm:block">
            Pricing
          </Link>
          {user ? (
            <>
              <Link href="/dashboard" className="text-inkmut hover:text-ink">
                Dashboard
              </Link>
              <Link
                href="/scan"
                className="btn-shine rounded-full px-5 py-2 font-semibold text-white"
              >
                New scan
              </Link>
              <SignOutButton />
            </>
          ) : (
            <>
              <Link href="/login" className="text-inkmut hover:text-ink">
                Sign in
              </Link>
              <Link
                href="/scan"
                className="btn-shine rounded-full px-5 py-2 font-semibold text-white"
              >
                Check a message
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

export function ShieldMark({ className = "h-7 w-7" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden>
      <path
        d="M12 2.5 4.5 5.5v6c0 4.6 3.2 8.4 7.5 10 4.3-1.6 7.5-5.4 7.5-10v-6L12 2.5Z"
        fill="#0F6B5C"
      />
      <path d="m8.6 12 2.3 2.3 4.5-4.6" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
