create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text unique not null,
  buyer_id uuid references public.users(id) not null,
  buyer_name text not null,
  subtotal integer default 0,
  shipping integer default 0,
  tax integer default 0,
  discount integer default 0,
  total integer default 0,
  currency text default 'SAR',
  promo_code text,
  status text default 'pending' check (status in ('pending', 'confirmed', 'delivered')),
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone
);

alter table public.orders enable row level security;

-- Users can view their own orders
create policy "Users can view own orders" on public.orders
  for select using (buyer_id = auth.uid());

-- Users can create orders
create policy "Users can create orders" on public.orders
  for insert with check (buyer_id = auth.uid());

-- Users can update their own orders
create policy "Users can update own orders" on public.orders
  for update using (buyer_id = auth.uid());

-- Admins can manage all orders
create policy "Admins can manage orders" on public.orders
  for all using (exists (select 1 from public.users where id = auth.uid() and is_admin = true));