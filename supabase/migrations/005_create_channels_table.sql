create table if not exists public.channels (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references public.users(id) on delete cascade not null,
  owner_username text not null,
  name text not null,
  description text,
  member_ids jsonb default '[]', -- array of user IDs
  created_at timestamp with time zone default timezone('utc'::text, now())
);

alter table public.channels enable row level security;

-- Channel members can view
create policy "Channel members can view" on public.channels
  for select using (true);

-- Channel owner can manage
create policy "Channel owner can manage" on public.channels
  for all using (owner_id = auth.uid());

-- Admins have full access
create policy "Admins have full access" on public.channels
  for all using (exists (select 1 from public.users where id = auth.uid() and is_admin = true));