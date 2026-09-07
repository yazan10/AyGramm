create table if not exists public.support_tickets (
  id uuid primary key default gen_random_uuid(),
  ticket_number text unique not null,
  user_id uuid references public.users(id),
  user_name text,
  user_email_or_phone text,
  subject text not null,
  category text not null check (category in ('technical', 'account', 'billing', 'report_abuse', 'feature_request', 'other')),
  priority text default 'normal' check (priority in ('low', 'normal', 'high', 'urgent')),
  status text default 'open' check (status in ('open', 'in_progress', 'waiting_user', 'resolved', 'closed')),
  messages jsonb default '[]', -- array of message objects
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone
);

alter table public.support_tickets enable row level security;

-- Users can view their own tickets
create policy "Users can view own tickets" on public.support_tickets
  for select using (user_id = auth.uid());

-- Users can create tickets
create policy "Users can create tickets" on public.support_tickets
  for insert with check (true);

-- Users can update their own tickets
create policy "Users can update own tickets" on public.support_tickets
  for update using (user_id = auth.uid());

-- Admins can manage all tickets
create policy "Admins can manage tickets" on public.support_tickets
  for all using (exists (select 1 from public.users where id = auth.uid() and is_admin = true));