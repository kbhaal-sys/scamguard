import Link from "next/link";

export default function EmptyState({
  title,
  body,
  cta,
  href,
}: {
  title: string;
  body: string;
  cta: string;
  href: string;
}) {
  return (
    <div className="glass fade-up rounded-3xl border-dashed p-10 text-center">
      <p className="font-display text-xl font-bold">{title}</p>
      <p className="mx-auto mt-2 max-w-md text-inkmut">{body}</p>
      <Link
        href={href}
        className="btn-shine mt-5 inline-block rounded-full px-6 py-3 font-semibold text-white"
      >
        {cta}
      </Link>
    </div>
  );
}
