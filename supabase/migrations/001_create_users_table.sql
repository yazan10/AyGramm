create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  username text unique not null,
  email text unique,
  password text, -- hashed password
  nationality text,
  language text default 'العربية',
  currency text default 'SAR',
  profile_image text,
  account_type text check (account_type in ('personal', 'business', 'creator')),
  is_admin boolean default false,
  role text check (role in ('owner', 'admin', 'member')),
  is_active boolean default true,
  ban_reason text,
  followers integer default 0,
  following integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now()),
  verified boolean default false,
  verification_badge text check (verification_badge in ('none', 'blue', 'gold')),
  show_activity_status boolean default true,
  last_active timestamp with time zone,
  is_closed boolean default false,
  closure_reason text,
  closed_at timestamp with time zone,
  gender text check (gender in ('male', 'female', 'unspecified')),
  approval_status text check (approval_status in ('pending', 'approved')),
  birth_date timestamptz,
  birth_date_privacy text check (birth_date_privacy in ('public', 'close_friends', 'private')),
  location text,
  device_fingerprints jsonb default '[]',
  close_friends jsonb default '[]',
  hidden_story_user_ids jsonb default '[]',
  blocked_user_ids jsonb default '[]',
  restricted_user_ids jsonb default '[]',
  muted_user_ids jsonb default '[]',
  subscription_plan text check (subscription_plan in ('none', 'blue_monthly', 'blue_yearly', 'gold_monthly', 'gold_yearly')),
  links jsonb default '[]',
  social_links jsonb default '{}'
);

-- Enable RLS
alter table public.users enable row level security;

-- Create policy for public read (select own profile)
create policy "Users can view own profile" on public.users
  for select using (auth.uid() = id);

-- Create policy for authenticated users to update own profile
create policy "Users can update own profile" on public.users
  for update using (auth.uid() = id);

-- Create policy for admin full access
create policy "Admins have full access" on public.users
  for all using (exists (select 1 from public.users where id = auth.uid() and is_admin = true));