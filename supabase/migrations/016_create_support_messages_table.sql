create table if not exists public.support_messages (
  id uuid primary key default gen_random_uuid(),
  ticket_id uuid references public.support_tickets(id) on delete cascade not null,
  sender_id uuid references public.users(id),
  sender_name text,
  sender_role text check (sender_role in ('user', 'support', 'admin')),
  content text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  attachment text
);

alter table public.support_messages enable row level security;

-- Users can view messages in their tickets
create policy "Users can view ticket messages" on public.support_messages
  for select using (exists (select 1 from public.support_tickets where id = ticket_id and user_id = auth.uid()));

-- Support team can manage messages
create policy "Support can manage messages" on public.support_messages
  for all using (exists (select 1 from public.users where id = auth.uid() and is_admin = true));

-- Admins can manage all messages
create policy "Admins can manage all messages" on public.support_messages
  for all using (exists (select 1 from public.users where id = auth.uid() and is_admin = true));