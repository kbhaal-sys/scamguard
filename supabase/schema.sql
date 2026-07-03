-- =========================================================
-- Scam Guard — Supabase schema
-- Run in Supabase SQL Editor (or: supabase db push)
-- =========================================================

-- ---------- users (profile, mirrors auth.users) ----------
create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  created_at timestamptz not null default now(),
  subscription_status text not null default 'free'
    check (subscription_status in ('free','plus','family')),
  monthly_scan_limit int not null default 5,
  scans_used_this_month int not null default 0,
  usage_period_start date not null default date_trunc('month', now())::date
);

-- auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.users (id, email) values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------- scans ----------
create table if not exists public.scans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  input_type text not null check (input_type in ('text','image','url')),
  original_text text,
  uploaded_file_url text,
  checked_url text,
  category text not null default 'unknown',
  risk_level text not null check (risk_level in ('Low','Medium','High','Critical')),
  risk_score int not null check (risk_score between 0 and 100),
  verdict text not null,
  summary text,
  red_flags jsonb not null default '[]',
  recommended_actions jsonb not null default '[]',
  what_not_to_do jsonb not null default '[]',
  safe_reply text,
  confidence_level text not null default 'Medium'
    check (confidence_level in ('Low','Medium','High')),
  category_detected text,
  created_at timestamptz not null default now()
);
create index if not exists scans_user_created_idx on public.scans (user_id, created_at desc);

-- ---------- reports (PDF exports; MVP-ready) ----------
create table if not exists public.reports (
  id uuid primary key default gen_random_uuid(),
  scan_id uuid not null references public.scans(id) on delete cascade,
  user_id uuid not null references public.users(id) on delete cascade,
  exported_pdf_url text,
  created_at timestamptz not null default now()
);

-- ---------- Row Level Security ----------
alter table public.users enable row level security;
alter table public.scans enable row level security;
alter table public.reports enable row level security;

drop policy if exists "users read own profile" on public.users;
create policy "users read own profile" on public.users
  for select using (auth.uid() = id);

drop policy if exists "users read own scans" on public.scans;
create policy "users read own scans" on public.scans
  for select using (auth.uid() = user_id);

drop policy if exists "users read own reports" on public.reports;
create policy "users read own reports" on public.reports
  for select using (auth.uid() = user_id);

-- Inserts/updates happen server-side with the service-role key
-- (bypasses RLS), so no insert policies are required for MVP.
