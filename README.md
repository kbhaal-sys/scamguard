# SPeye — MVP

**Before you pay, scan it.** A web app that checks whether a message, screenshot, email,
link, invoice, payment request, listing, contract, or investment offer is safe, suspicious,
or likely a scam — and explains the risk in plain language.

## Stack

- **Next.js 16 (App Router) + TypeScript + Tailwind CSS**
- **Supabase** — authentication + Postgres (with RLS)
- **LLM analysis** — OpenAI *or* Anthropic (switch via `LLM_PROVIDER`), vision-capable so
  screenshots are read directly by the model (see `src/lib/ocr.ts` for the standalone-OCR placeholder)
- Server-side API route for all LLM calls (`src/app/api/analyze/route.ts`) — keys never reach the browser

## Project structure

```
supabase/schema.sql            Database schema + RLS + signup trigger
src/
  middleware.ts                Session refresh + protected routes
  app/
    page.tsx                   Landing
    scan/                      Scan page (tabs: text / screenshot / URL)
    result/[id]/               Result page
    login/                     Sign in / sign up
    dashboard/                 Plan, usage, recent scans, family-circle placeholder
    history/                   Full scan history
    pricing/  privacy/  terms/
    api/analyze/route.ts       Auth → limits → validate → URL inspect → LLM → persist
  components/                  Header, Footer, ScanForm, ResultCard, RiskBadge, ...
  lib/
    ai.ts                      System prompt, provider clients, strict-JSON parser
    url-check.ts               URL heuristics + metadata fetch
    ocr.ts                     OCR placeholder (vision LLM covers MVP)
    limits.ts → in route       Monthly scan-limit logic (reset per calendar month)
    supabase/                  Browser / server / service-role clients
```

## Local setup

1. **Install**
   ```bash
   npm install
   ```
2. **Create a Supabase project** → SQL Editor → run `supabase/schema.sql`.
3. **Configure env** — copy `.env.example` to `.env.local` and fill in:
   - `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
   - `LLM_PROVIDER` = `openai` or `anthropic`, plus the matching API key/model
4. **(Optional)** In Supabase → Authentication → Providers → Email, disable
   "Confirm email" for frictionless local testing.
5. **Run**
   ```bash
   npm run dev
   ```
   Open http://localhost:3000, create an account, scan something.

## Deployment (Vercel)

1. Push the repo to GitHub and import it in Vercel.
2. Add all environment variables from `.env.local` in Vercel → Project → Settings → Environment Variables.
3. Deploy. The analyze route runs on the Node.js runtime with `maxDuration = 60`.
4. In Supabase → Authentication → URL Configuration, set your production URL as the Site URL.

## Product notes

- **Scan limits**: free = 5/month (column-driven, so per-user overrides are trivial);
  `plus`/`family` = unlimited. Usage resets on the 1st of each month (UTC), lazily on first scan.
- **Subscriptions**: schema and UI are subscription-ready (`subscription_status`), payment
  processing intentionally not wired — add Stripe webhooks that update `users.subscription_status`.
- **Privacy**: screenshots are analyzed in memory and not stored; only results are saved.
- **Safety wording**: the system prompt forbids "definitely safe"/"guaranteed" language and
  always pushes verification through official channels. The UI repeats the disclaimer.
- **PDF reports**: "Download PDF" uses the print stylesheet (browser → Save as PDF). The
  `reports` table exists for server-generated PDFs later.
- **Family mode**: UI placeholder + product copy only, per MVP scope.
