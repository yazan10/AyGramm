create table if not exists public.channel_posts (
  id uuid primary key default gen_random_uuid(),
  channel_id uuid references public.channels(id) on delete cascade not null,
  author_id uuid references public.users(id) not null,
  author_username text not null,
  text text,
  image text,
  audio text,
  audio_name text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

alter table public.channel_posts enable row level security;

-- Channel members can view posts
create policy "Channel members can view posts" on public.channel_posts
  for select using (true);

-- Channel owner can manage posts
create policy "Channel owner can manage posts" on public.channel_posts
  for all using (exists (select 1 from public.channels where id = channel_id and owner_id = auth.uid()));

-- Admins have full access
create policy "Admins have full access" on public.channel_posts
  for all using (exists (select 1 from public.users where id = auth.uid() and is_admin = true));