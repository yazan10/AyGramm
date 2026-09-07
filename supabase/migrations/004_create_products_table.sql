create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete set null,
  seller_name text not null,
 seller_avatar text,
  title text not null,
  title_en text,
  description text,
  description_en text,
  price integer not null,
  currency text default 'SAR',
  images jsonb default '[]',
  category text not null,
  category_label text,
  category_label_en text,
  tagline text,
  tagline_en text,
  is_approved boolean default true,
  is_blocked boolean default false,
  rejection_reason text,
  sales_count integer default 0,
  rating numeric(3,2) default 0,
  stock integer,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

alter table public.products enable row level security;

-- Users can view approved products
create policy "Users can view approved products" on public.products
  for select using (is_approved = true);

-- Sellers can manage their own products
create policy "Sellers can manage own products" on public.products
  for all using (user_id = auth.uid());

-- Admins have full access
create policy "Admins have full access" on public.products
  for all using (exists (select 1 from public.users where id = auth.uid() and is_admin = true));