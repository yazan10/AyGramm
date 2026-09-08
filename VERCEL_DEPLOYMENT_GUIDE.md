# 🚀 دليل رفع وتشغيل منصة AyGram على Vercel و Supabase

تم تجهيز وبرمجة منصة **AyGram** بالكامل لتكون جاهزة 100% للرفع والتشغيل والتخزين الدائم على **Vercel** مع ربط قاعدة بيانات **Supabase**.

---

## ⚡ الخطوة 1: تشغيل قاعدة البيانات على Supabase (خطوة واحدة فقط!)

1. ادخل إلى لوحة تحكم **Supabase**: [supabase.com/dashboard](https://supabase.com/dashboard)
2. اختر مشروعك (المشروع الحالي المرتبط بالمنصة هو `uuksljwepytkbggbbrkz`).
3. من القائمة الجانبية في Supabase اضغط على **SQL Editor**.
4. افتح الملف المجهز لك في المشروع:
   👉 **`supabase/schema_complete.sql`**
5. انسخ محتواه بالكامل والصقه في الـ **SQL Editor** في Supabase، ثم اضغط زر **Run** (أو `Ctrl + Enter`).
6. **مبروك!** تم إنشاء كافة الجداول الـ 19:
   - `users` (المستخدمون، مع إنشاء حساب المالك يزن السلاق `@y` مع شارة التوثيق الذهبية وحسابات المبدعين)
   - `posts` (التغريدات والمنشورات مع الصور والتفاعل)
   - `stories` (القصص واليوميات مع انتهاء الصلاحية)
   - `products` (متجر المبدعين والمنتجات الرقمية والحرفية)
   - `channels` & `channel_posts` (القنوات التقنية والمجتمعية)
   - `conversations` & `messages` (المحادثات الخاصة والرسائل الصوتية)
   - `notifications` (الإشعارات الحية)
   - `reports` & `admin_logs` & `blocked_words` (أدوات الإشراف والتحكم)
   - `verification_requests` & `username_reservations` (طلبات التوثيق وحجز الأسماء)
   - `support_tickets` & `support_messages` (نظام الدعم الفني)
   - `orders` & `faqs` (سجل الطلبات والأسئلة الشائعة)
   - `aygram_storage` (محرك المزامنة اللحظية السحابية السريعة)
   - تفعيل الـ **Realtime** للبث اللحظي.

---

## 🌐 الخطوة 2: رفع المشروع على Vercel

1. ادخل إلى **Vercel**: [vercel.com/new](https://vercel.com/new)
2. اختر مستودع الجيت هب الخاص بك: `yazan10/AyGramm`.
3. سيتعرف Vercel تلقائياً على إعدادات المشروع عبر ملف `vercel.json`:
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
4. في قسم **Environment Variables** (متغيرات البيئة)، أضف المتغيرات التالية:
   ```env
   SUPABASE_URL=https://uuksljwepytkbggbbrkz.supabase.co
   SUPABASE_PUBLISHABLE_KEY=sb_publishable_YE74x_Krw2RCtSUCOsdSKg_j548uO2D
   SUPABASE_ANON_KEY=sb_publishable_YE74x_Krw2RCtSUCOsdSKg_j548uO2D
   SUPABASE_SECRET_KEY=your_supabase_secret_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_secret_key
   SUPABASE_JWKS_URL=https://uuksljwepytkbggbbrkz.supabase.co/auth/v1/.well-known/jwks.json
   VITE_SUPABASE_URL=https://uuksljwepytkbggbbrkz.supabase.co
   VITE_SUPABASE_ANON_KEY=sb_publishable_YE74x_Krw2RCtSUCOsdSKg_j548uO2D
   VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_YE74x_Krw2RCtSUCOsdSKg_j548uO2D
   VITE_API_BASE_URL=/api
   VITE_USE_REMOTE_STORAGE=true
   ```
5. اضغط على زر **Deploy** 🚀.

---

## 🔐 بيانات تسجيل دخول حساب المسؤول والمطور
- **اسم المستخدم**: `y`
- **كلمة المرور**: `jana@#5Y`
- **نوع الحساب**: المالك والمؤسس (شاملاً لوحة الإدارة الكاملة والشارة الذهبية التوثيقية).

---

## 💾 كيف يعمل التخزين على Vercel؟
- تم برمجة الدالة السحابية `/api/data.ts` لتعمل كـ **Serverless Controller** على Vercel.
- تقوم بقراءة وتخزين ومزامنة كافة التعديلات والتغريدات والرسائل والحسابات لحظياً مع قاعدة بيانات **Supabase** (جدول `aygram_storage`).
- يوجد أيضاً مخزن احتياطي تلقائي للذاكرة السريعة (High-speed Cache) لضمان سرعة فائقة في التصفح واستجابة فورية بدون أي تأخير.
