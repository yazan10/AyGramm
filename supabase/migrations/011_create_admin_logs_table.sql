create table if not exists public.admin_logs (
  id uuid primary key default gen_random_uuid(),
  action text not null,
  admin_name text not null,
  details text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

alter table public.admin_logs enable row level security;

-- Admins can manage logs
create policy "Admins have full access" on public.admin_logs
  for all using (exists (select 1 from public.users where id = auth.uid() and is_admin = true));