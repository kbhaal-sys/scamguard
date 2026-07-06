export const metadata = { title: "Terms of service — SPeye" };

export default function Terms() {
  return (
    <div className="mx-auto max-w-2xl px-5 py-12">
      <h1 className="font-display text-3xl font-bold">Terms of service</h1>
      <p className="mt-2 text-sm text-inkmut">Template for the MVP — review with a legal professional before public launch.</p>
      <div className="mt-6 space-y-5 leading-relaxed">
        <section>
          <h2 className="font-display text-xl font-bold">What SPeye is</h2>
          <p>SPeye provides automated risk guidance about potentially fraudulent messages, links, documents, and offers. It highlights patterns and explains risks in plain language.</p>
        </section>
        <section>
          <h2 className="font-display text-xl font-bold">What SPeye is not</h2>
          <p>It is not legal advice, financial advice, or a guarantee. No result means something is definitely safe or definitely a scam. Final decisions — and verification through official channels — remain your responsibility.</p>
        </section>
        <section>
          <h2 className="font-display text-xl font-bold">Acceptable use</h2>
          <p>Use the service to protect yourself and people you help. Don't use it to test, improve, or craft fraudulent content, and don't submit content you have no right to share.</p>
        </section>
        <section>
          <h2 className="font-display text-xl font-bold">Plans and limits</h2>
          <p>The free plan includes a monthly scan limit. Paid plans are billed monthly and can be cancelled anytime, effective at the end of the billing period.</p>
        </section>
        <section>
          <h2 className="font-display text-xl font-bold">Liability</h2>
          <p>The service is provided "as is". To the maximum extent permitted by law, we are not liable for losses resulting from decisions made based on the guidance provided.</p>
        </section>
      </div>
    </div>
  );
}
