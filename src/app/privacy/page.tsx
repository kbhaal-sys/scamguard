export const metadata = { title: "Privacy policy — Scam Guard" };

export default function Privacy() {
  return (
    <div className="prose-custom mx-auto max-w-2xl px-5 py-12">
      <h1 className="font-display text-3xl font-bold">Privacy policy</h1>
      <p className="mt-2 text-sm text-inkmut">Template for the MVP — review with a legal professional before public launch.</p>
      <div className="mt-6 space-y-5 leading-relaxed">
        <section>
          <h2 className="font-display text-xl font-bold">What we collect</h2>
          <p>Your email address (for your account), the content you submit for scanning (text, links), and the analysis results we generate for you.</p>
        </section>
        <section>
          <h2 className="font-display text-xl font-bold">Screenshots</h2>
          <p>Uploaded screenshots are analyzed in memory and are <strong>not stored</strong> on our servers in the current version. Only the resulting risk assessment is saved to your history.</p>
        </section>
        <section>
          <h2 className="font-display text-xl font-bold">How content is processed</h2>
          <p>Submitted content is sent to an AI analysis provider to generate the risk assessment. Do not submit passwords, full card numbers, or other credentials — they are never needed for a check.</p>
        </section>
        <section>
          <h2 className="font-display text-xl font-bold">Your control</h2>
          <p>You can delete your scan history and your account at any time by contacting support. Deleting the account removes your profile and scans.</p>
        </section>
        <section>
          <h2 className="font-display text-xl font-bold">What we don't do</h2>
          <p>We don't sell your data, and we don't use your submitted content for advertising.</p>
        </section>
      </div>
    </div>
  );
}
