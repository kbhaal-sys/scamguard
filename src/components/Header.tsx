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
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3 sm:px-5">
        <Link href="/" className="flex min-w-0 items-center gap-2 font-display text-lg font-bold text-ink sm:text-xl">
          <EyeMark />
          <span className="truncate">
            SPeye
            <span className="ml-2 hidden text-[12px] font-semibold uppercase tracking-widest text-inkmut md:inline">
              Scam Protection Eye
            </span>
          </span>
        </Link>
        <nav className="flex shrink-0 items-center gap-3 text-[15px] sm:gap-5">
          <Link href="/pricing" className="hidden text-inkmut hover:text-ink sm:block">
            Pricing
          </Link>
          {user ? (
            <>
              <Link href="/dashboard" className="text-inkmut hover:text-ink">
                Dashboard
              </Link>
              <Link href="/#scan" className="btn-shine rounded-full px-4 py-2 text-sm font-semibold text-white sm:px-5 sm:text-[15px]">
                New scan
              </Link>
              <span className="hidden sm:block"><SignOutButton /></span>
            </>
          ) : (
            <>
              <Link href="/login" className="text-inkmut hover:text-ink">
                Sign in
              </Link>
              <Link href="/#scan" className="btn-shine rounded-full px-4 py-2 text-sm font-semibold text-white sm:px-5 sm:text-[15px]">
                Scan now
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

export function EyeMark({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden>
      <path
        d="M12 2.5 4.5 5.5v6c0 4.6 3.2 8.4 7.5 10 4.3-1.6 7.5-5.4 7.5-10v-6L12 2.5Z"
        fill="#0F6B5C"
      />
      <path
        d="M12 8.2c-2.9 0-5 2.2-5.8 3.6.8 1.4 2.9 3.6 5.8 3.6s5-2.2 5.8-3.6c-.8-1.4-2.9-3.6-5.8-3.6Z"
        fill="#fff"
      />
      <circle cx="12" cy="11.8" r="1.9" fill="#0F6B5C" />
      <circle cx="12.7" cy="11.1" r="0.6" fill="#fff" />
    </svg>
  );
}
