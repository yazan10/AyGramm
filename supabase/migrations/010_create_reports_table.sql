create table if not exists public.reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid references public.users(id) not null,
  reporter_name text not null,
  target_id uuid not null,
  target_type text not null check (target_type in ('post', 'product', 'comment', 'user')),
  reason text not null,
  target_snippet text,
  status text default 'pending' check (status in ('pending', 'resolved', 'dismissed')),
  created_at timestamp with time zone default timezone('utc'::text, now())
);

alter table public.reports enable row level security;

-- Users can view their own reports
create policy "Users can view own reports" on public.reports
  for select using (reporter_id = auth.uid());

-- Users can create reports
create policy "Users can create reports" on public.reports
  for insert with check (true);

-- Admins can manage all reports
create policy "Admins can manage reports" on public.reports
  for all using (exists (select 1 from public.users where id = auth.uid() and is_admin = true));