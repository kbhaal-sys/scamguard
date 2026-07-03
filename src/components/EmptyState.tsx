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
    <div className="rounded-xl2 border border-dashed border-line bg-white p-10 text-center">
      <p className="font-display text-xl font-bold">{title}</p>
      <p className="mx-auto mt-2 max-w-md text-inkmut">{body}</p>
      <Link
        href={href}
        className="mt-5 inline-block rounded-full bg-guard px-6 py-3 font-semibold text-white hover:bg-guard-dark"
      >
        {cta}
      </Link>
    </div>
  );
}
