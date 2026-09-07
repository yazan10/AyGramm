create table if not exists public.verification_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete cascade not null,
  username text not null,
  full_name text not null,
  category text not null,
  reason text not null,
  status text default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone
);

alter table public.verification_requests enable row level security;

-- Users can view their own requests
create policy "Users can view own requests" on public.verification_requests
  for select using (user_id = auth.uid());

-- Users can create requests
create policy "Users can create requests" on public.verification_requests
  for insert with check (true);

-- Admins can manage all requests
create policy "Admins can manage requests" on public.verification_requests
  for all using (exists (select 1 from public.users where id = auth.uid() and is_admin = true));