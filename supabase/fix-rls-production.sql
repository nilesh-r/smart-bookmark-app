-- Run this in Supabase Dashboard → SQL Editor (production project)
-- Fixes: "new row violates row-level security policy for table bookmarks"
-- Cause: the trigger that sets user_id on insert is missing; this creates it.

-- 1. Recreate the function that sets user_id from the logged-in user
create or replace function public.set_bookmark_user_id()
returns trigger as $$
begin
  new.user_id := auth.uid();
  return new;
end;
$$ language plpgsql security definer;

-- 2. Drop the trigger if it exists, then create it
drop trigger if exists set_bookmark_user_id on public.bookmarks;
create trigger set_bookmark_user_id
  before insert on public.bookmarks
  for each row execute function public.set_bookmark_user_id();

-- 3. Ensure RLS is enabled
alter table public.bookmarks enable row level security;

-- 4. Ensure insert policy exists (drop + create so it’s correct)
drop policy if exists "Users can insert own bookmarks" on public.bookmarks;
create policy "Users can insert own bookmarks"
  on public.bookmarks for insert
  with check (auth.uid() = user_id);
