create table if not exists public.username_reservations (
  id uuid primary key default gen_random_uuid(),
  desired_username text not null,
  suggested_username text,
  phone_or_email text,
  status text default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at timestamp with time zone default timezone('utc'::text, now())
);

alter table public.username_reservations enable row level security;

-- Everyone can view reservations (for signup flow)
create policy "Everyone can view reservations" on public.username_reservations
  for select using (true);

-- Auth system can manage reservations
create policy "Auth can manage reservations" on public.username_reservations
  for all using (true);