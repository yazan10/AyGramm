-- ==============================================================================
-- AyGram Complete Production Database Schema & Seed
-- منصة AyGram - البنية المتكاملة لقواعد البيانات للرفع والتشغيل على Vercel و Supabase
-- ==============================================================================

-- 0. تمكين ملحقات PostgreSQL الأساسية
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==============================================================================
-- 1. جدول التخزين العام السريع للمزامنة الحية عبر Vercel Serverless (aygram_storage)
-- يتيح مزامنة لحظية فورية لكافة المجموعات والبيانات من أي متصفح وجهاز
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.aygram_storage (
  key text PRIMARY KEY,
  data jsonb NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.aygram_storage ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "aygram_storage_select" ON public.aygram_storage;
CREATE POLICY "aygram_storage_select" ON public.aygram_storage FOR SELECT USING (true);

DROP POLICY IF EXISTS "aygram_storage_insert" ON public.aygram_storage;
CREATE POLICY "aygram_storage_insert" ON public.aygram_storage FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "aygram_storage_update" ON public.aygram_storage;
CREATE POLICY "aygram_storage_update" ON public.aygram_storage FOR UPDATE USING (true);

DROP POLICY IF EXISTS "aygram_storage_delete" ON public.aygram_storage;
CREATE POLICY "aygram_storage_delete" ON public.aygram_storage FOR DELETE USING (true);

-- ==============================================================================
-- 2. جدول المستخدمين (users)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.users (
  id text PRIMARY KEY DEFAULT gen_random_uuid()::text,
  full_name text NOT NULL,
  username text UNIQUE NOT NULL,
  email text,
  password text,
  nationality text DEFAULT 'سعودي',
  language text DEFAULT 'العربية',
  currency text DEFAULT 'SAR',
  profile_image text,
  bio text DEFAULT '',
  account_type text DEFAULT 'creator',
  is_admin boolean DEFAULT false,
  role text DEFAULT 'member',
  is_active boolean DEFAULT true,
  ban_reason text,
  followers jsonb DEFAULT '[]',
  following jsonb DEFAULT '[]',
  verified boolean DEFAULT false,
  verification_badge text DEFAULT 'none',
  show_activity_status boolean DEFAULT true,
  last_active timestamp with time zone,
  is_closed boolean DEFAULT false,
  closure_reason text,
  closed_at timestamp with time zone,
  gender text DEFAULT 'unspecified',
  approval_status text DEFAULT 'approved',
  birth_date text,
  birth_date_privacy text DEFAULT 'public',
  location text DEFAULT '',
  device_fingerprints jsonb DEFAULT '[]',
  close_friends jsonb DEFAULT '[]',
  hidden_story_user_ids jsonb DEFAULT '[]',
  blocked_user_ids jsonb DEFAULT '[]',
  restricted_user_ids jsonb DEFAULT '[]',
  muted_user_ids jsonb DEFAULT '[]',
  subscription_plan text DEFAULT 'none',
  links jsonb DEFAULT '[]',
  social_links jsonb DEFAULT '{}',
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_users_username ON public.users(username);
CREATE INDEX IF NOT EXISTS idx_users_active ON public.users(is_active);

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "users_public_select" ON public.users;
CREATE POLICY "users_public_select" ON public.users FOR SELECT USING (true);

DROP POLICY IF EXISTS "users_insert" ON public.users;
CREATE POLICY "users_insert" ON public.users FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "users_update" ON public.users;
CREATE POLICY "users_update" ON public.users FOR UPDATE USING (true);

-- ==============================================================================
-- 3. جدول المنشورات والتغريدات (posts)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.posts (
  id text PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id text NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  username text NOT NULL,
  user_avatar text,
  content text,
  image text,
  images jsonb DEFAULT '[]',
  video text,
  likes jsonb DEFAULT '[]',
  retweets jsonb DEFAULT '[]',
  comments jsonb DEFAULT '[]',
  views_count integer DEFAULT 1,
  is_approved boolean DEFAULT true,
  is_blocked boolean DEFAULT false,
  rejection_reason text,
  tags jsonb DEFAULT '[]',
  location text,
  is_close_friends_only boolean DEFAULT false,
  user_nationality text,
  saved_by jsonb DEFAULT '[]',
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_posts_user_id ON public.posts(user_id);
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON public.posts(created_at DESC);

ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "posts_select" ON public.posts;
CREATE POLICY "posts_select" ON public.posts FOR SELECT USING (true);

DROP POLICY IF EXISTS "posts_insert" ON public.posts;
CREATE POLICY "posts_insert" ON public.posts FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "posts_update" ON public.posts;
CREATE POLICY "posts_update" ON public.posts FOR UPDATE USING (true);

DROP POLICY IF EXISTS "posts_delete" ON public.posts;
CREATE POLICY "posts_delete" ON public.posts FOR DELETE USING (true);

-- ==============================================================================
-- 4. جدول القصص واليوميات (stories)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.stories (
  id text PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id text NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  username text NOT NULL,
  user_avatar text,
  media text NOT NULL,
  type text DEFAULT 'image',
  caption text,
  is_close_friends_only boolean DEFAULT false,
  views_count integer DEFAULT 0,
  seen_by jsonb DEFAULT '[]',
  expires_at timestamp with time zone NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_stories_expires_at ON public.stories(expires_at);

ALTER TABLE public.stories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "stories_select" ON public.stories;
CREATE POLICY "stories_select" ON public.stories FOR SELECT USING (true);

DROP POLICY IF EXISTS "stories_insert" ON public.stories;
CREATE POLICY "stories_insert" ON public.stories FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "stories_update" ON public.stories;
CREATE POLICY "stories_update" ON public.stories FOR UPDATE USING (true);

DROP POLICY IF EXISTS "stories_delete" ON public.stories;
CREATE POLICY "stories_delete" ON public.stories FOR DELETE USING (true);

-- ==============================================================================
-- 5. جدول متجر المبدعين والمنتجات (products)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.products (
  id text PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id text REFERENCES public.users(id) ON DELETE SET NULL,
  seller_name text NOT NULL,
  seller_avatar text,
  title text NOT NULL,
  title_en text,
  description text,
  description_en text,
  price numeric NOT NULL DEFAULT 0,
  currency text DEFAULT 'SAR',
  images jsonb DEFAULT '[]',
  category text NOT NULL DEFAULT 'عام',
  category_label text,
  category_label_en text,
  tagline text,
  tagline_en text,
  is_approved boolean DEFAULT true,
  is_blocked boolean DEFAULT false,
  rejection_reason text,
  sales_count integer DEFAULT 0,
  rating numeric(3,2) DEFAULT 5.0,
  stock integer DEFAULT 99,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "products_select" ON public.products;
CREATE POLICY "products_select" ON public.products FOR SELECT USING (true);

DROP POLICY IF EXISTS "products_insert" ON public.products;
CREATE POLICY "products_insert" ON public.products FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "products_update" ON public.products;
CREATE POLICY "products_update" ON public.products FOR UPDATE USING (true);

DROP POLICY IF EXISTS "products_delete" ON public.products;
CREATE POLICY "products_delete" ON public.products FOR DELETE USING (true);

-- ==============================================================================
-- 6. جدول القنوات الجماعية (channels)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.channels (
  id text PRIMARY KEY DEFAULT gen_random_uuid()::text,
  owner_id text NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  owner_username text NOT NULL,
  name text NOT NULL,
  description text,
  member_ids jsonb DEFAULT '[]',
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.channels ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "channels_select" ON public.channels;
CREATE POLICY "channels_select" ON public.channels FOR SELECT USING (true);

DROP POLICY IF EXISTS "channels_all" ON public.channels;
CREATE POLICY "channels_all" ON public.channels FOR ALL USING (true);

-- ==============================================================================
-- 7. جدول منشورات القنوات (channel_posts)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.channel_posts (
  id text PRIMARY KEY DEFAULT gen_random_uuid()::text,
  channel_id text NOT NULL REFERENCES public.channels(id) ON DELETE CASCADE,
  author_id text NOT NULL,
  author_name text NOT NULL,
  author_avatar text,
  text text,
  image text,
  audio text,
  audio_name text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.channel_posts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "channel_posts_select" ON public.channel_posts;
CREATE POLICY "channel_posts_select" ON public.channel_posts FOR SELECT USING (true);

DROP POLICY IF EXISTS "channel_posts_all" ON public.channel_posts;
CREATE POLICY "channel_posts_all" ON public.channel_posts FOR ALL USING (true);

-- ==============================================================================
-- 8. جدول المحادثات الخاصة (conversations)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.conversations (
  id text PRIMARY KEY DEFAULT gen_random_uuid()::text,
  participant_ids jsonb DEFAULT '[]',
  last_message_text text,
  last_message_time timestamp with time zone,
  unread_count integer DEFAULT 0,
  is_group boolean DEFAULT false,
  group_name text,
  group_avatar text,
  max_members integer DEFAULT 25,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "conversations_all" ON public.conversations;
CREATE POLICY "conversations_all" ON public.conversations FOR ALL USING (true);

-- ==============================================================================
-- 9. جدول الرسائل الفورية والملاحظات الصوتية (messages)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.messages (
  id text PRIMARY KEY DEFAULT gen_random_uuid()::text,
  conversation_id text,
  sender_id text NOT NULL,
  sender_username text NOT NULL,
  receiver_id text,
  content text,
  audio text,
  audio_name text,
  shared_post_id text,
  is_read boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_messages_conversation ON public.messages(conversation_id);

ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "messages_all" ON public.messages;
CREATE POLICY "messages_all" ON public.messages FOR ALL USING (true);

-- ==============================================================================
-- 10. جدول الإشعارات والتنبيهات (notifications)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.notifications (
  id text PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id text NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  actor_id text,
  actor_name text,
  actor_avatar text,
  type text NOT NULL,
  title text,
  text_content text NOT NULL,
  target_id text,
  is_read boolean DEFAULT false,
  importance text DEFAULT 'normal',
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_notifications_user ON public.notifications(user_id, is_read);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "notifications_all" ON public.notifications;
CREATE POLICY "notifications_all" ON public.notifications FOR ALL USING (true);

-- ==============================================================================
-- 11. جدول البلاغات (reports)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.reports (
  id text PRIMARY KEY DEFAULT gen_random_uuid()::text,
  reporter_id text NOT NULL,
  reporter_name text NOT NULL,
  target_id text NOT NULL,
  target_type text NOT NULL,
  reason text NOT NULL,
  target_snippet text,
  status text DEFAULT 'pending',
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "reports_all" ON public.reports;
CREATE POLICY "reports_all" ON public.reports FOR ALL USING (true);

-- ==============================================================================
-- 12. جدول سجل الإشراف والإدارة (admin_logs)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.admin_logs (
  id text PRIMARY KEY DEFAULT gen_random_uuid()::text,
  action text NOT NULL,
  admin_name text NOT NULL,
  details text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.admin_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "admin_logs_all" ON public.admin_logs;
CREATE POLICY "admin_logs_all" ON public.admin_logs FOR ALL USING (true);

-- ==============================================================================
-- 13. جدول الكلمات والعبارات المحظورة (blocked_words)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.blocked_words (
  id text PRIMARY KEY DEFAULT gen_random_uuid()::text,
  word text NOT NULL UNIQUE,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.blocked_words ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "blocked_words_all" ON public.blocked_words;
CREATE POLICY "blocked_words_all" ON public.blocked_words FOR ALL USING (true);

-- ==============================================================================
-- 14. جدول حجز أسماء المستخدمين (username_reservations)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.username_reservations (
  id text PRIMARY KEY DEFAULT gen_random_uuid()::text,
  desired_username text NOT NULL,
  suggested_username text,
  phone_or_email text,
  status text DEFAULT 'pending',
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.username_reservations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "username_reservations_all" ON public.username_reservations;
CREATE POLICY "username_reservations_all" ON public.username_reservations FOR ALL USING (true);

-- ==============================================================================
-- 15. جدول طلبات التوثيق بالشارة الزرقاء والذهبية (verification_requests)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.verification_requests (
  id text PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id text NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  username text NOT NULL,
  full_name text NOT NULL,
  category text NOT NULL,
  reason text NOT NULL,
  status text DEFAULT 'pending',
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
  updated_at timestamp with time zone
);

ALTER TABLE public.verification_requests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "verification_requests_all" ON public.verification_requests;
CREATE POLICY "verification_requests_all" ON public.verification_requests FOR ALL USING (true);

-- ==============================================================================
-- 16. جدول تذاكر الدعم الفني (support_tickets)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.support_tickets (
  id text PRIMARY KEY DEFAULT gen_random_uuid()::text,
  ticket_number text UNIQUE NOT NULL,
  user_id text,
  user_name text,
  user_email_or_phone text,
  subject text NOT NULL,
  category text NOT NULL,
  priority text DEFAULT 'normal',
  status text DEFAULT 'open',
  messages jsonb DEFAULT '[]',
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
  updated_at timestamp with time zone
);

ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "support_tickets_all" ON public.support_tickets;
CREATE POLICY "support_tickets_all" ON public.support_tickets FOR ALL USING (true);

-- ==============================================================================
-- 17. جدول طلبات الشراء والمتجر (orders)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.orders (
  id text PRIMARY KEY DEFAULT gen_random_uuid()::text,
  order_number text UNIQUE NOT NULL,
  buyer_id text NOT NULL,
  buyer_name text NOT NULL,
  items jsonb DEFAULT '[]',
  subtotal numeric DEFAULT 0,
  shipping numeric DEFAULT 0,
  tax numeric DEFAULT 0,
  discount numeric DEFAULT 0,
  total numeric DEFAULT 0,
  currency text DEFAULT 'SAR',
  promo_code text,
  status text DEFAULT 'pending',
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
  updated_at timestamp with time zone
);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "orders_all" ON public.orders;
CREATE POLICY "orders_all" ON public.orders FOR ALL USING (true);

-- ==============================================================================
-- 18. جدول الأسئلة الشائعة (faqs)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.faqs (
  id text PRIMARY KEY DEFAULT gen_random_uuid()::text,
  category text NOT NULL,
  question text NOT NULL,
  question_en text,
  answer text NOT NULL,
  answer_en text,
  sort_order integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "faqs_all" ON public.faqs;
CREATE POLICY "faqs_all" ON public.faqs FOR ALL USING (true);

-- ==============================================================================
-- تفعيل التحديث اللحظي (Supabase Realtime)
-- ==============================================================================
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime'
  ) THEN
    CREATE PUBLICATION supabase_realtime;
  END IF;
END $$;

ALTER PUBLICATION supabase_realtime ADD TABLE 
  public.aygram_storage,
  public.posts,
  public.messages,
  public.notifications,
  public.stories,
  public.channels,
  public.channel_posts,
  public.products;

-- ==============================================================================
-- البيانات الأولية (Seed Data)
-- حساب المطور والمالك يزن السلاق (@y) وحسابات المبدعين
-- ==============================================================================
INSERT INTO public.users (
  id, full_name, username, password, nationality, language, currency,
  profile_image, bio, account_type, is_admin, role, is_active, verified, verification_badge
) VALUES
(
  'user_owner_aygram',
  'يزن السلاق',
  'y',
  'jana@#5Y',
  'فلسطيني',
  'العربية',
  'SAR',
  'data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 100 100%27%3E%3Crect width=%27100%27 height=%27100%27 fill=%27%230F3D2E%27 rx=%2750%27/%3E%3Cpath d=%27M50 12c-16 0-28 12-28 30 0 24 22 40 28 46 6-6 28-22 28-46 0-18-12-30-28-30Zm0 12c9 0 16 8 16 18 0 12-10 22-16 28-6-6-16-16-16-28 0-10 7-18 16-18Z%27 fill=%27%23D4AF37%27/%3E%3Ctext x=%2750%27 y=%2760%27 font-size=%2728%27 font-family=%27system-ui%27 font-weight=%27bold%27 text-anchor=%27middle%27 fill=%27%230F3D2E%27%3Ey%3C/text%3E%3C/svg%3E',
  'مؤسس ومطور منصة AyGram — مسؤول المنصة والمشرف العام',
  'creator',
  true,
  'owner',
  true,
  true,
  'gold'
),
(
  'user_sarah',
  'سارة المهندس',
  'sarah_design',
  'password123',
  'سعودي',
  'العربية',
  'SAR',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
  'مصممة واجهات وتجارب مستخدم UI/UX ومبتكرة هوية رقمية. مهتمة بالخط العربي والتصميم الحديث.',
  'creator',
  false,
  'member',
  true,
  true,
  'blue'
),
(
  'user_tareq',
  'طارق العلي',
  'tareq_tech',
  'password123',
  'أردني',
  'العربية',
  'JOD',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
  'مهندس برمجيات ومهتم بتقنيات الويب والذكاء الاصطناعي. أشارك تجاربي البرمجية يومياً.',
  'creator',
  false,
  'member',
  true,
  true,
  'blue'
),
(
  'user_ahmad',
  'أحمد الخطاط',
  'ahmad_calligraphy',
  'password123',
  'إماراتي',
  'العربية',
  'AED',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
  'فنان وخطاط عربي، مهتم باللوحات الحروفية والمخطوطات التراثية الأصلية.',
  'creator',
  false,
  'member',
  true,
  true,
  'blue'
)
ON CONFLICT (id) DO NOTHING;

-- المنشورات الترحيبية الأولى
INSERT INTO public.posts (
  id, user_id, username, user_avatar, content, tags, location, user_nationality, is_approved
) VALUES
(
  'post_welcome_1',
  'user_owner_aygram',
  'y',
  'data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 100 100%27%3E%3Crect width=%27100%27 height=%27100%27 fill=%27%230F3D2E%27 rx=%2750%27/%3E%3Cpath d=%27M50 12c-16 0-28 12-28 30 0 24 22 40 28 46 6-6 28-22 28-46 0-18-12-30-28-30Zm0 12c9 0 16 8 16 18 0 12-10 22-16 28-6-6-16-16-16-28 0-10 7-18 16-18Z%27 fill=%27%23D4AF37%27/%3E%3Ctext x=%2750%27 y=%2760%27 font-size=%2728%27 font-family=%27system-ui%27 font-weight=%27bold%27 text-anchor=%27middle%27 fill=%27%230F3D2E%27%3Ey%3C/text%3E%3C/svg%3E',
  'أهلاً بكم في منصة AyGram! ✨ واحة التغريد والتواصل العربي الحديثة، المصممة بحب لخدمة المبدعين والمبرمجين والمجتمع العربي بكافة أطيافه. شاركونا أفكاركم ومشاريعكم!',
  '["aygram", "ترحيب", "تطوير_عربي"]'::jsonb,
  'القدس، فلسطين',
  'فلسطيني',
  true
),
(
  'post_design_2',
  'user_sarah',
  'sarah_design',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
  'التناسق اللوني بين الأخضر الزمردي والذهبي يمنح شعوراً بالفخامة والأصالة العربية 🌿✨ ما رأيكم في تجربة واجهات الاستخدام في التطبيق الجديد؟',
  '["تصميم", "واجهات", "ألوان"]'::jsonb,
  'الرياض، السعودية',
  'سعودي',
  true
)
ON CONFLICT (id) DO NOTHING;

-- منتجات المتجر الأولية
INSERT INTO public.products (
  id, user_id, seller_name, seller_avatar, title, description, price, currency, images, category, stock
) VALUES
(
  'prod_calligraphy_art',
  'user_ahmad',
  'أحمد الخطاط',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
  'لوحة خط ثلث أصلية مذهبة يدوياً',
  'لوحة كانفاس فاخرة قياس 70x50 سم مكتوبة بحبر الشينوا الأسود الأصلي مع تفاصيل مذهبة بورق الذهب عيار 24.',
  350,
  'SAR',
  '["https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1000&q=80"]'::jsonb,
  'فن وتصميم',
  5
),
(
  'prod_ui_kit',
  'user_sarah',
  'سارة المهندس',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
  'حزمة تصميم واجهات عربية Figma UI Kit (أكثر من 300 شاشة)',
  'حزمة تصميم كاملة تدعم اللغة العربية واتجاه RTL بنسبة 100% مع نظام رموز ومكونات تفاعلية جاهزة.',
  120,
  'SAR',
  '["https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1000&q=80"]'::jsonb,
  'منتجات رقمية',
  999
)
ON CONFLICT (id) DO NOTHING;

-- القنوات التقنية الأولية
INSERT INTO public.channels (
  id, owner_id, owner_username, name, description, member_ids
) VALUES
(
  'channel_developers',
  'user_owner_aygram',
  'y',
  'ملتقى المطورين والمبرمجين',
  'قناة تقنية لمناقشة أحدث تقنيات الويب، الذكاء الاصطناعي، وتبادل الخبرات البرمجية.',
  '["user_owner_aygram", "user_sarah", "user_tareq", "user_ahmad"]'::jsonb
),
(
  'channel_creators',
  'user_sarah',
  'sarah_design',
  'سوق المبدعين وتجارب التصميم',
  'مساحة لمصممي الجرافيك وصناع المحتوى لعرض أعمالهم ومشاركة فرص التعاون.',
  '["user_sarah", "user_owner_aygram", "user_ahmad"]'::jsonb
),
(
  'channel_announcements',
  'user_owner_aygram',
  'y',
  'تحديثات منصة AyGram الرسمية',
  'الإعلانات والتعاميم والخصائص الجديدة الصادرة من إدارة وتطوير المنصة.',
  '["user_owner_aygram", "user_sarah", "user_tareq", "user_ahmad"]'::jsonb
)
ON CONFLICT (id) DO NOTHING;
