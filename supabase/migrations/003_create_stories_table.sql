create table if not exists public.stories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete cascade not null,
  username text not null,
  media text not null, -- image or video URL
  type text check (type in ('image', 'video')) default 'image',
  caption text,
  expires_at timestamp with time zone not null,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  views_count integer default 0,
  seen_by jsonb default '[]' -- array of user IDs who viewed
);

alter table public.stories enable row level security;

-- Users can view stories of people they follow or who public
create policy "Users can view stories" on public.stories
  for select using (true);

-- Users can insert their own stories
create policy "Users can insert own stories" on public.stories
  for insert with check (user_id = auth.uid());

-- Users can update their own stories
create policy "Users can update own stories" on public.stories
  for update using (user_id = auth.uid());