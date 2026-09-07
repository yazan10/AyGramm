create table if not exists public.faqs (
  id uuid primary key default gen_random_uuid(),
  category text not null,
  question text not null,
  question_en text,
  answer text not null,
  answer_en text,
  sort_order integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

alter table public.faqs enable row level security;

-- Everyone can view FAQs
create policy "Everyone can view FAQs" on public.faqs
  for select using (true);