create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete cascade not null,
  username text not null,
  content text,
  image text,
  images jsonb default '[]', -- array of image URLs
  video text,
  likes jsonb default '[]', -- array of user IDs who liked
  retweets jsonb default '[]', -- array of user IDs who retweeted
  comments jsonb default '[]', -- array of comment objects
  views_count integer default 0,
  is_approved boolean default true,
  is_blocked boolean default false,
  rejection_reason text,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  saved_by jsonb default '[]', -- array of user IDs who saved
  tags text array default '{}',
  location text,
  is_close_friends_only boolean default false,
  user_nationality text
);

alter table public.posts enable row level security;

-- Users can view their own posts and approved posts
create policy "Users can view own and approved posts" on public.posts
  for select using (is_approved = true or user_id = auth.uid());

-- Users can insert their own posts
create policy "Users can insert own posts" on public.posts
  for insert with check (user_id = auth.uid());

-- Users can update their own posts
create policy "Users can update own posts" on public.posts
  for update using (user_id = auth.uid());

-- Admins have full access
create policy "Admins have full access" on public.posts
  for all using (exists (select 1 from public.users where id = auth.uid() and is_admin = true));