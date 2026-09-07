create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null,
  sender_id uuid references public.users(id) not null,
  sender_username text not null,
  receiver_id uuid,
  content text,
  audio text,
  audio_name text,
  shared_post_id uuid,
  is_read boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

alter table public.messages enable row level security;

-- Users can view messages in conversations they participate in
create policy "Users can view own messages" on public.messages
  for select using (sender_id = auth.uid() or receiver_id = auth.uid());

-- Users can insert messages
create policy "Users can insert messages" on public.messages
  for insert with check (sender_id = auth.uid());

-- Admins have full access
create policy "Admins have full access" on public.messages
  for all using (exists (select 1 from public.users where id = auth.uid() and is_admin = true));