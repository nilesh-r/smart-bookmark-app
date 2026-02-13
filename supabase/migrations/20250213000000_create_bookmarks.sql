-- Bookmarks table: private per user
create table public.bookmarks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  url text not null,
  title text not null,
  created_at timestamptz not null default now()
);

-- Index for fast lookups by user
create index bookmarks_user_id_idx on public.bookmarks (user_id);

-- Enable Realtime for bookmarks (so multiple tabs get live updates)
alter publication supabase_realtime add table public.bookmarks;

-- RLS: users can only see and manage their own bookmarks
alter table public.bookmarks enable row level security;

create policy "Users can read own bookmarks"
  on public.bookmarks for select
  using (auth.uid() = user_id);

create policy "Users can insert own bookmarks"
  on public.bookmarks for insert
  with check (auth.uid() = user_id);

-- Set user_id automatically on insert so client does not need to send it
create or replace function public.set_bookmark_user_id()
returns trigger as $$
begin
  new.user_id := auth.uid();
  return new;
end;
$$ language plpgsql security definer;

create trigger set_bookmark_user_id
  before insert on public.bookmarks
  for each row execute function public.set_bookmark_user_id();

create policy "Users can delete own bookmarks"
  on public.bookmarks for delete
  using (auth.uid() = user_id);
