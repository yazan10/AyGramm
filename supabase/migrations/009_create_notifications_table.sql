create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete cascade not null,
  actor_id uuid references public.users(id),
  actor_name text,
  actor_avatar text,
  type text not null check (type in ('like', 'comment', 'follow', 'approval', 'rejection', 'report_action', 'admin_broadcast', 'verification', 'channel', 'closure', 'pending_approval', 'mention')),
  title text,
  text_content text not null, -- using text_content to avoid conflict with reserved word
  target_id uuid,
  is_read boolean default false,
  importance text check (importance in ('normal', 'urgent', 'guidance')),
  created_at timestamp with time zone default timezone('utc'::text, now())
);

alter table public.notifications enable row level security;

-- Users can view their own notifications
create policy "Users can view own notifications" on public.notifications
  for select using (user_id = auth.uid());

-- Users can mark notifications as read
create policy "Users can update own notifications" on public.notifications
  for update using (user_id = auth.uid());

-- Admins have full access
create policy "Admins have full access" on public.notifications
  for all using (exists (select 1 from public.users where id = auth.uid() and is_admin = true));