create table if not exists public.conversations (
  id uuid primary key default gen_random_uuid(),
  participant_ids jsonb default '[]', -- array of user IDs
  last_message_text text,
  last_message_time timestamp with time zone,
  unread_count integer default 0,
  is_group boolean default false,
  group_name text,
  group_avatar text,
  max_members integer default 25,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

alter table public.conversations enable row level security;

-- Users can view conversations they participate in
create policy "Users can view own conversations" on public.conversations
  for select using (exists (select 1 from jsonb_array_elements_text(participant_ids) as pid) where pid = auth::text::uuid::text));

-- Users can create conversations
create policy "Users can create conversations" on public.conversations
  for insert with check (true);

-- Admins have full access
create policy "Admins have full access" on public.conversations
  for all using (exists (select 1 from public.users where id = auth.uid() and is_admin = true));