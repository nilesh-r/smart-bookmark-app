-- Run this if "relation bookmarks already exists" — it only adds trigger and policies.

-- Drop existing policies so we can re-create them (safe to run multiple times)
drop policy if exists "Users can read own bookmarks" on public.bookmarks;
drop policy if exists "Users can insert own bookmarks" on public.bookmarks;
drop policy if exists "Users can delete own bookmarks" on public.bookmarks;

create policy "Users can read own bookmarks"
  on public.bookmarks for select
  using (auth.uid() = user_id);

create policy "Users can insert own bookmarks"
  on public.bookmarks for insert
  with check (auth.uid() = user_id);

create policy "Users can delete own bookmarks"
  on public.bookmarks for delete
  using (auth.uid() = user_id);

-- Function that sets user_id on insert (safe to replace)
create or replace function public.set_bookmark_user_id()
returns trigger as $$
begin
  new.user_id := auth.uid();
  return new;
end;
$$ language plpgsql security definer;

-- Trigger so client doesn't need to send user_id
drop trigger if exists set_bookmark_user_id on public.bookmarks;
create trigger set_bookmark_user_id
  before insert on public.bookmarks
  for each row execute function public.set_bookmark_user_id();

-- Ensure RLS is on
alter table public.bookmarks enable row level security;

-- Add to Realtime publication (ignore error if already added)
do $$
begin
  alter publication supabase_realtime add table public.bookmarks;
exception
  when duplicate_object then null;
end $$;
