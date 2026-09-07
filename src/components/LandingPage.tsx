import React from 'react';
import { motion } from 'motion/react';
import {
  MessageSquare,
  Repeat2,
  Share2,
  Sparkles,
  ShieldCheck,
  ShoppingBag,
  Send,
  Lock,
  CheckCircle2,
  ArrowLeft,
  Users,
  Award,
  Store,
  FileText,
  Ban,
  Check,
  Radio,
  Image as ImageIcon
} from 'lucide-react';
import { useAyGram } from '../context/AyGramContext';
import { AppDownloadCard } from './AppDownloadCard';

interface LandingPageProps {
  onOpenAuth: (mode: 'login' | 'signup') => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onOpenAuth }) => {
  const { setActiveView, currentUser, showToast } = useAyGram();

  return (
    <div id="landing-page-root" className="min-h-screen bg-[#FDFBF7] text-[#1A1A1A] pb-24 font-['IBM_Plex_Sans_Arabic']" dir="rtl">
      {/* 1. HERO SECTION WITH STUNNING TOP & BOTTOM ENTRANCE ANIMATIONS */}
      <section className="relative overflow-hidden pt-10 pb-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="relative z-10 text-center max-w-3xl mx-auto">
          {/* Tag animating from above */}
          <motion.div
            initial={{ opacity: 0, y: -35 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0F3D2E]/10 border border-[#0F3D2E]/20 text-[#0F3D2E] text-xs font-bold mb-6 shadow-xs"
          >
            <Radio className="w-3.5 h-3.5 text-[#D4AF37] animate-pulse" />
            <span>منصة التواصل الاجتماعي والتغريد العربي الحديث</span>
          </motion.div>

          {/* Title animating with elegant staggered motion from top */}
          <motion.h1
            initial={{ opacity: 0, y: -45 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="text-3xl sm:text-5xl lg:text-6xl font-black text-[#0F3D2E] tracking-tight leading-[1.25] mb-6"
          >
            مساحتك للتغريد، التواصل، <br />
            <span className="text-[#D4AF37] inline-block drop-shadow-xs">واكتشاف إبداعات المجتمع العربي</span>
          </motion.h1>

          {/* Subtitle smoothly rising from bottom */}
          <motion.p
            initial={{ opacity: 0, y: 35 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="text-base sm:text-lg text-stone-600 leading-relaxed mb-8 max-w-2xl mx-auto"
          >
            منصة <strong className="text-[#0F3D2E]">AyGram</strong> تجمع بين نظام تدوين وتغريد سريع، قصص يومية، محادثات خاصة فورية، وسوق متكامل للمبدعين والمستقلين. تجربة مرنة بدون اشتراط بريد أو هاتف إلزامي، ودعم لكافة لغات وعملات العالم.
          </motion.p>

          {/* Action Buttons animating from bottom */}
          <motion.div
            initial={{ opacity: 0, y: 45 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-wrap items-center justify-center gap-3.5"
          >
            {!currentUser ? (
              <>
                <button
                  id="landing-signup-btn"
                  onClick={() => onOpenAuth('signup')}
                  className="px-7 py-3.5 rounded-xl bg-[#0F3D2E] text-white font-bold text-sm sm:text-base shadow-md hover:bg-[#155A44] transition-all flex items-center gap-2 cursor-pointer group active:scale-95 border border-[#0F3D2E]"
                >
                  <span>إنشاء حساب والبدء بالتغريد</span>
                  <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1.5 transition-transform" />
                </button>

                <button
                  id="landing-login-btn"
                  onClick={() => onOpenAuth('login')}
                  className="px-7 py-3.5 rounded-xl bg-[#D4AF37] text-[#0F3D2E] font-bold text-sm sm:text-base shadow-md hover:bg-[#C29E2E] transition-all cursor-pointer active:scale-95 border border-[#D4AF37]"
                >
                  تسجيل الدخول
                </button>
              </>
            ) : (
              <button
                id="landing-enter-home-btn"
                onClick={() => setActiveView('home')}
                className="px-7 py-3.5 rounded-xl bg-[#0F3D2E] text-white font-bold text-sm sm:text-base shadow-md hover:bg-[#155A44] transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>الانتقال إلى الخط الزمني والتغريدات</span>
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
          </motion.div>

          {/* Official Ownership & Developer Highlight Box */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 25 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="mt-8 p-4 bg-white border border-[#D4AF37]/40 rounded-2xl shadow-sm max-w-2xl mx-auto flex items-center justify-center gap-3 text-xs sm:text-sm text-stone-700"
          >
            <Award className="w-5 h-5 text-[#D4AF37] shrink-0" />
            <span>
              تم إطلاق المنصة وتطويرها بواسطة المطور <strong className="text-[#0F3D2E] font-bold">يزن السلاق</strong>، وهي مملوكة له بالكامل وحصرياً.
            </span>
          </motion.div>

          {/* Quick Metrics */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.75, ease: [0.22, 1, 0.36, 1] }}
            className="mt-10 pt-8 border-t border-stone-200 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center"
          >
            <div className="p-3 bg-white rounded-xl border border-stone-200 shadow-xs">
              <div className="text-xl sm:text-2xl font-bold text-[#0F3D2E]">280</div>
              <div className="text-xs text-stone-500 mt-0.5">حرف لكل تغريدة سريعة</div>
            </div>
            <div className="p-3 bg-white rounded-xl border border-stone-200 shadow-xs">
              <div className="text-xl sm:text-2xl font-bold text-[#0F3D2E]">100%</div>
              <div className="text-xs text-stone-500 mt-0.5">خصوصية وبدون إعلانات إجبارية</div>
            </div>
            <div className="p-3 bg-white rounded-xl border border-stone-200 shadow-xs">
              <div className="text-xl sm:text-2xl font-bold text-[#0F3D2E]">120+</div>
              <div className="text-xs text-stone-500 mt-0.5">جنسية ولغة وعملة مدعومة</div>
            </div>
            <div className="p-3 bg-white rounded-xl border border-stone-200 shadow-xs">
              <div className="text-xl sm:text-2xl font-bold text-[#0F3D2E]">0 إجبار</div>
              <div className="text-xs text-stone-500 mt-0.5">تسجيل باسم مستخدم فقط</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. CORE PLATFORM FEATURES */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#0F3D2E]">
            مميزات المنصة الشاملة
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 mt-2">
            بنية برمجية متطورة صُممت لتقديم أفضل تجربة تواصل رقمية للمستخدم العربي.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Feature 1: Tweeting & Retweeting */}
          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm hover:border-[#0F3D2E]/30 transition-all flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#0F3D2E]/10 text-[#0F3D2E] flex items-center justify-center mb-4">
                <Repeat2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#0F3D2E] mb-2">
                نظام التغريد وإعادة التغريد (Retweets)
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                انشر تغريداتك حتى 280 حرفاً، أرفق الصور والمقاطع والوسوم، وأعد تغريد منشورات المبدعين لمتابعيك بنقرة واحدة مع احتساب فوري للتفاعل.
              </p>
            </div>
            <div className="mt-4 pt-4 border-t border-stone-100 flex items-center gap-1.5 text-xs font-bold text-[#D4AF37]">
              <Check className="w-4 h-4 text-[#0F3D2E]" />
              <span>تفاعل فوري، تعليقات، وإعادة تغريد</span>
            </div>
          </div>

          {/* Feature 2: Daily Stories */}
          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm hover:border-[#0F3D2E]/30 transition-all flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#D4AF37]/15 text-[#D4AF37] flex items-center justify-center mb-4">
                <ImageIcon className="w-6 h-6 text-[#0F3D2E]" />
              </div>
              <h3 className="text-lg font-bold text-[#0F3D2E] mb-2">
                القصص اليومية التفاعلية
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                شارك لحظات يومك ومسودات أعمالك وتصاميمك عبر شريط القصص المرئية مع عداد مشاهدات فوري وتجربة استعراض بصرية سلسة.
              </p>
            </div>
            <div className="mt-4 pt-4 border-t border-stone-100 flex items-center gap-1.5 text-xs font-bold text-[#D4AF37]">
              <Check className="w-4 h-4 text-[#0F3D2E]" />
              <span>وسائط مرئية متجددة على مدار 24 ساعة</span>
            </div>
          </div>

          {/* Feature 3: Direct Messages */}
          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm hover:border-[#0F3D2E]/30 transition-all flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#0F3D2E]/10 text-[#0F3D2E] flex items-center justify-center mb-4">
                <Send className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#0F3D2E] mb-2">
                الرسائل الخاصة والمحادثات الفورية
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                غرف محادثة خاصة ومباشرة بين المستخدمين والتجار تتيح تبادل الرسائل، ومشاركة التغريدات والمنتجات في المحادثة مباشرة.
              </p>
            </div>
            <div className="mt-4 pt-4 border-t border-stone-100 flex items-center gap-1.5 text-xs font-bold text-[#D4AF37]">
              <Check className="w-4 h-4 text-[#0F3D2E]" />
              <span>محادثات فورية ومشاركة روابط التغريدات</span>
            </div>
          </div>

          {/* Feature 4: Creator Marketplace */}
          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm hover:border-[#0F3D2E]/30 transition-all flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#D4AF37]/15 text-[#D4AF37] flex items-center justify-center mb-4">
                <ShoppingBag className="w-6 h-6 text-[#0F3D2E]" />
              </div>
              <h3 className="text-lg font-bold text-[#0F3D2E] mb-2">
                سوق المبدعين والمتجر المستقل
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                سوق إلكتروني متكامل يتيح للمصممين والحرفيين والناشرين عرض وبيع منتجاتهم، مع فلترة حسب التصنيفات ودعم لكافة عملات العالم.
              </p>
            </div>
            <div className="mt-4 pt-4 border-t border-stone-100 flex items-center gap-1.5 text-xs font-bold text-[#D4AF37]">
              <Check className="w-4 h-4 text-[#0F3D2E]" />
              <span>دعم كافة عملات العالم والتحويلات</span>
            </div>
          </div>

          {/* Feature 5: Account Verification */}
          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm hover:border-[#0F3D2E]/30 transition-all flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#0F3D2E]/10 text-[#0F3D2E] flex items-center justify-center mb-4">
                <Award className="w-6 h-6 text-[#D4AF37]" />
              </div>
              <h3 className="text-lg font-bold text-[#0F3D2E] mb-2">
                شارة توثيق الحسابات الرسمية
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                نظام توثيق متكامل يمنح الحسابات الموثوقة شارة التوثيق الذهبية، مع إمكانية تقديم طلب التوثيق مباشرة من الملف الشخصي ومراجعته من الإدارة.
              </p>
            </div>
            <div className="mt-4 pt-4 border-t border-stone-100 flex items-center gap-1.5 text-xs font-bold text-[#D4AF37]">
              <Check className="w-4 h-4 text-[#0F3D2E]" />
              <span>شارة توثيق معتمدة للمبدعين</span>
            </div>
          </div>

          {/* Feature 6: Moderation & Transparent Bans */}
          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm hover:border-[#0F3D2E]/30 transition-all flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center mb-4">
                <Ban className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#0F3D2E] mb-2">
                نظام حظر شفاف وسياسات صارمة
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                حماية شاملة ضد الاحتيال والرسائل المزعجة، مع صفحة عامة شفافة تستعرض الحسابات الموقوفة وأسباب الحظر مع نموذج لتقديم طلبات الاستئناف.
              </p>
            </div>
            <div className="mt-4 pt-4 border-t border-stone-100 flex items-center gap-1.5 text-xs font-bold text-[#D4AF37]">
              <Check className="w-4 h-4 text-[#0F3D2E]" />
              <span>فلترة فورية ومكافحة الحسابات الوهمية</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. PLATFORM POLICIES & QUICK ACCESS */}
      <section className="py-10 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="bg-[#0F3D2E] text-white rounded-3xl p-6 sm:p-10 shadow-xl relative overflow-hidden">
          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="max-w-xl">
              <span className="inline-block px-3 py-1 bg-white/10 text-xs font-bold text-[#D4AF37] rounded-full mb-3">
                الشفافية والحقوق
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold mb-3 text-[#F4E8C1]">
                شروط الاستخدام، سياسات الحظر، وحقوق الملكية
              </h3>
              <p className="text-white/80 text-xs sm:text-sm leading-relaxed mb-6">
                نلتزم بأعلى معايير الشفافية والأمان. اطلع على وثيقة شروط المنصة التي تم إطلاقها وتطويرها بواسطة المطور يزن السلاق، أو تصفح سجل الحسابات الموقوفة.
              </p>
              <div className="flex flex-wrap gap-3">
                <button
                  id="landing-rules-btn"
                  onClick={() => setActiveView('rules')}
                  className="px-5 py-2.5 rounded-xl bg-[#D4AF37] text-[#0F3D2E] font-bold text-sm shadow hover:bg-[#C29E2E] transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <FileText className="w-4 h-4" />
                  <span>شروط وقوانين المنصة</span>
                </button>

                <button
                  id="landing-bans-btn"
                  onClick={() => setActiveView('bans')}
                  className="px-5 py-2.5 rounded-xl bg-white/10 text-white font-bold text-sm hover:bg-white/20 transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Ban className="w-4 h-4 text-red-400" />
                  <span>صفحة الحظر وسجل الموقوفين</span>
                </button>
              </div>
            </div>

            <div className="p-5 bg-white/10 rounded-2xl border border-white/15 w-full lg:w-72 text-center text-xs space-y-2">
              <div className="font-bold text-[#F4E8C1] text-sm">حفظ الجلسة والكوكيز</div>
              <p className="text-white/70 leading-relaxed">
                تحفظ المنصة تسجيل دخولك بصورة دائمة وآمنة حتى تتمكن من التصفح بدون تسجيل دخول متكرر.
              </p>
              <div className="pt-2 text-[11px] text-[#D4AF37]">
                ملك للمطور يزن السلاق
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3.5 APP DOWNLOAD CARD (Desktop display; on mobile, it is positioned down in the footer at the end of the site) */}
      <section className="hidden md:block px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto pb-12">
        <AppDownloadCard
          onNotifySoon={() => {
            showToast(
              'تطبيق AyGram للهواتف الذكية قيد التطوير والعمل وسيتوفر قريباً على Google Play و App Store!',
              'info'
            );
          }}
        />
      </section>

      {/* 4. FOOTER NOTE */}
      <footer className="pt-8 px-4 text-center text-xs text-stone-500 border-t border-stone-200 max-w-4xl mx-auto">
        <p>
          منصة AyGram للتواصل والتغريد — تم إطلاق وتطوير المنصة وتصميمها بالكامل وهي ملكية حصرية للمطور <strong>يزن السلاق</strong> فقط.
        </p>
      </footer>
    </div>
  );
};
