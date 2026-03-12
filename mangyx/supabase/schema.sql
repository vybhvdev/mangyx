-- ── Run this in your Supabase SQL editor ──────────────────────

-- Users table (custom auth, not Supabase Auth)
create table if not exists public.users (
  id            uuid primary key default gen_random_uuid(),
  username      text not null unique,
  email         text not null unique,
  password_hash text not null,
  created_at    timestamptz default now()
);

-- Bookmarks
create table if not exists public.bookmarks (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.users(id) on delete cascade,
  manga_id    text not null,
  manga_title text not null,
  cover_url   text,
  status      text,
  created_at  timestamptz default now(),
  unique (user_id, manga_id)
);

-- Reading progress
create table if not exists public.read_progress (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.users(id) on delete cascade,
  manga_id    text not null,
  chapter_id  text not null,
  chapter_num text,
  updated_at  timestamptz default now(),
  unique (user_id, manga_id)
);

-- ── Row Level Security ──────────────────────────────────────────
alter table public.users       enable row level security;
alter table public.bookmarks   enable row level security;
alter table public.read_progress enable row level security;

-- Service role bypasses RLS (used in API routes) — no extra policies needed
-- for client-side access, add policies if you ever use the anon key directly.
