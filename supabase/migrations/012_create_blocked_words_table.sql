create table if not exists public.blocked_words (
  id uuid primary key default gen_random_uuid(),
  word text not null unique,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

alter table public.blocked_words enable row level security;

-- Everyone can view blocked words (for content filtering)
create policy "Everyone can view blocked words" on public.blocked_words
  for select using (true);

-- Admins can manage blocked words
create policy "Admins can manage blocked words" on public.blocked_words
  for all using (exists (select 1 from public.users where id = auth.uid() and is_admin = true));