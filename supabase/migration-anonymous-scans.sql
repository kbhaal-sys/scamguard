-- =========================================================
-- Migration: allow scanning WITHOUT an account
-- Run this in the Supabase SQL Editor on your existing project.
-- =========================================================

-- 1. Scans no longer require a user
alter table public.scans alter column user_id drop not null;

-- 2. Anonymous scans are readable by anyone who has the (unguessable) UUID link
drop policy if exists "anonymous scans readable by link" on public.scans;
create policy "anonymous scans readable by link" on public.scans
  for select using (user_id is null);

-- 3. Daily rate limit for anonymous usage (per hashed IP)
create table if not exists public.anon_usage (
  ip_hash text not null,
  day date not null default current_date,
  count int not null default 0,
  primary key (ip_hash, day)
);
alter table public.anon_usage enable row level security;
-- no public policies: only the service-role key touches this table
