-- ==============================
-- Create table (only if not exists)
-- ==============================
create table if not exists public.bookmarks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  url text not null,
  title text not null,
  created_at timestamptz not null default now()
);

-- ==============================
-- Index for performance
-- ==============================
create index if not exists bookmarks_user_id_idx
on public.bookmarks (user_id);

-- ==============================
-- Enable Realtime (safe if already added)
-- ==============================
do $$
begin
  alter publication supabase_realtime add table public.bookmarks;
exception
  when duplicate_object then null;
end $$;

-- ==============================
-- Enable Row Level Security
-- ==============================
alter table public.bookmarks enable row level security;

-- ==============================
-- Drop old policies
-- ==============================
drop policy if exists "Users can read own bookmarks" on public.bookmarks;
drop policy if exists "Users can insert own bookmarks" on public.bookmarks;
drop policy if exists "Users can insert bookmarks" on public.bookmarks;
drop policy if exists "Users can delete own bookmarks" on public.bookmarks;

-- ==============================
-- SELECT: Only owner can read
-- ==============================
create policy "Users can read own bookmarks"
on public.bookmarks
for select
using (auth.uid() = user_id);

-- ==============================
-- INSERT: Only owner can insert their own rows
-- Trigger sets user_id to auth.uid(), and server action also sends user_id
-- ==============================
create policy "Users can insert bookmarks"
on public.bookmarks
for insert
with check (auth.uid() = user_id);

-- ==============================
-- DELETE: Only owner can delete
-- ==============================
create policy "Users can delete own bookmarks"
on public.bookmarks
for delete
using (auth.uid() = user_id);

-- ==============================
-- Trigger function to auto-set user_id
-- ==============================
create or replace function public.set_bookmark_user_id()
returns trigger as $$
begin
  new.user_id := auth.uid();
  return new;
end;
$$ language plpgsql security definer set search_path = public;

-- ==============================
-- Recreate trigger
-- ==============================
drop trigger if exists set_bookmark_user_id on public.bookmarks;

create trigger set_bookmark_user_id
before insert on public.bookmarks
for each row
execute function public.set_bookmark_user_id();
