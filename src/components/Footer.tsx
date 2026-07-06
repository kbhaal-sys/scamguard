import Link from "next/link";

export default function Footer() {
  return (
    <footer className="glass-soft mt-auto border-t border-white/60">
      <div className="mx-auto flex max-w-5xl flex-col gap-3 px-5 py-8 text-sm text-inkmut sm:flex-row sm:items-center sm:justify-between">
        <p>
          SPeye provides <strong>risk guidance</strong>, not legal or financial advice. No result
          means something is guaranteed safe — when in doubt, verify through an official channel.
        </p>
        <nav className="flex shrink-0 gap-5">
          <Link href="/privacy" className="hover:text-ink">Privacy</Link>
          <Link href="/terms" className="hover:text-ink">Terms</Link>
          <Link href="/pricing" className="hover:text-ink">Pricing</Link>
        </nav>
      </div>
    </footer>
  );
}
