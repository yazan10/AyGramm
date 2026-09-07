import React from 'react';
import {
  Globe,
  FileText,
  Shield,
  Phone,
  Mail,
  Clock,
  BookOpen,
  Scale,
  Home,
  Compass,
  Search,
  ShoppingBag,
  MessageCircle,
  User,
  Ban,
  LifeBuoy
} from 'lucide-react';
import { useAyGram } from '../context/AyGramContext';
import { AppDownloadCard } from './AppDownloadCard';

export const Footer: React.FC = () => {
  const { currentUser, setActiveView, showToast } = useAyGram();
  const isAdmin = currentUser?.role === 'admin' || currentUser?.isAdmin;

  const goTo = (view: Parameters<typeof setActiveView>[0]) => {
    setActiveView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer
      className="bg-[#0F3D2E] text-white pt-10 pb-16 font-['IBM_Plex_Sans_Arabic'] mt-8 border-t border-[#D4AF37]/30"
      dir="rtl"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Mobile Download Card (Moved to footer at the bottom of the site on mobile) */}
        <div className="block lg:hidden max-w-lg mx-auto">
          <AppDownloadCard
            onNotifySoon={() =>
              showToast(
                'تطبيق AyGram للهواتف الذكية قيد التطوير والعمل وسيتوفر قريباً على Google Play و App Store!',
                'info'
              )
            }
          />
        </div>

        {/* Brand & Social */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#D4AF37] text-[#0F3D2E] flex items-center justify-center font-bold text-sm">
              A
            </div>
            <span className="text-xl font-bold tracking-tight text-white">AyGram</span>
            <span className="text-[10px] font-bold text-[#D4AF37] bg-[#D4AF37]/15 border border-[#D4AF37]/40 px-2 py-0.5 rounded-full">
              منصة عربية أصيلة
            </span>
          </div>
          <p className="text-xs text-white/70 text-center sm:text-end">
            منصة التواصل الاجتماعي العربية الأولى — ملك المطور يزن السلاق حصرياً
          </p>
        </div>

        {/* 4-Column Platform Sections Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Column 1: المنصة والمعلومات */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-[#D4AF37] flex items-center gap-1.5">
              <BookOpen className="w-4 h-4" />
              المنصة
            </h4>
            <ul className="space-y-2 text-xs text-white/70">
              <li>
                <button onClick={() => goTo('rules')} className="hover:text-[#D4AF37] transition-colors cursor-pointer text-start">
                  <span className="flex items-center gap-1.5">
                    <FileText className="w-3 h-3 text-[#D4AF37]/70" />
                    شروط استخدام المنصة
                  </span>
                </button>
              </li>
              <li>
                <button onClick={() => goTo('rules')} className="hover:text-[#D4AF37] transition-colors cursor-pointer text-start">
                  <span className="flex items-center gap-1.5">
                    <Scale className="w-3 h-3 text-[#D4AF37]/70" />
                    معايير المنصة وقوانينها
                  </span>
                </button>
              </li>
              <li>
                <button onClick={() => goTo('rules')} className="hover:text-[#D4AF37] transition-colors cursor-pointer text-start">
                  <span className="flex items-center gap-1.5">
                    <Shield className="w-3 h-3 text-[#D4AF37]/70" />
                    سياسة الخصوصية والأمان
                  </span>
                </button>
              </li>
              <li>
                <button onClick={() => goTo('home')} className="hover:text-[#D4AF37] transition-colors cursor-pointer text-start">
                  <span className="flex items-center gap-1.5">
                    <Globe className="w-3 h-3 text-[#D4AF37]/70" />
                    عن المنصة والمطور يزن السلاق
                  </span>
                </button>
              </li>
            </ul>
          </div>

          {/* Column 2: القوانين والمعايير */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-[#D4AF37] flex items-center gap-1.5">
              <Scale className="w-4 h-4" />
              القوانين والمعايير
            </h4>
            <ul className="space-y-2 text-xs text-white/70">
              <li>
                <button onClick={() => goTo('rules')} className="hover:text-[#D4AF37] transition-colors cursor-pointer text-start">
                  سياسات الحظر والمحتوى المخالف
                </button>
              </li>
              <li>
                <button onClick={() => goTo('rules')} className="hover:text-[#D4AF37] transition-colors cursor-pointer text-start">
                  إرشادات المجتمع والسلوك
                </button>
              </li>
              <li>
                <button onClick={() => goTo('rules')} className="hover:text-[#D4AF37] transition-colors cursor-pointer text-start">
                  تقديم بلاغ أو شكوى
                </button>
              </li>
              {isAdmin && (
                <li>
                  <button
                    onClick={() => goTo('bans')}
                    className="hover:text-red-400 transition-colors cursor-pointer text-start flex items-center gap-1.5 text-red-300"
                  >
                    <Ban className="w-3 h-3" />
                    سجل الحظر (بإشراف)
                  </button>
                </li>
              )}
            </ul>
          </div>

          {/* Column 3: تصفح المنصة */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-[#D4AF37] flex items-center gap-1.5">
              <Compass className="w-4 h-4" />
              تصفح المنصة
            </h4>
            <ul className="space-y-2 text-xs text-white/70">
              <li>
                <button onClick={() => goTo('home')} className="hover:text-[#D4AF37] transition-colors cursor-pointer text-start flex items-center gap-1.5">
                  <Home className="w-3 h-3 text-[#D4AF37]/70" />
                  الرئيسية (الخط الزمني)
                </button>
              </li>
              <li>
                <button onClick={() => goTo('explore')} className="hover:text-[#D4AF37] transition-colors cursor-pointer text-start flex items-center gap-1.5">
                  <Compass className="w-3 h-3 text-[#D4AF37]/70" />
                  الاكسبلور والتغريدات الشائعة
                </button>
              </li>
              <li>
                <button onClick={() => goTo('search')} className="hover:text-[#D4AF37] transition-colors cursor-pointer text-start flex items-center gap-1.5">
                  <Search className="w-3 h-3 text-[#D4AF37]/70" />
                  البحث المتقدم
                </button>
              </li>
              <li>
                <button onClick={() => goTo('shop')} className="hover:text-[#D4AF37] transition-colors cursor-pointer text-start flex items-center gap-1.5">
                  <ShoppingBag className="w-3 h-3 text-[#D4AF37]/70" />
                  سوق المبدعين
                </button>
              </li>
              <li>
                <button onClick={() => goTo('messages')} className="hover:text-[#D4AF37] transition-colors cursor-pointer text-start flex items-center gap-1.5">
                  <MessageCircle className="w-3 h-3 text-[#D4AF37]/70" />
                  الرسائل الخاصة
                </button>
              </li>
              <li>
                <button onClick={() => goTo('profile')} className="hover:text-[#D4AF37] transition-colors cursor-pointer text-start flex items-center gap-1.5">
                  <User className="w-3 h-3 text-[#D4AF37]/70" />
                  الملف الشخصي
                </button>
              </li>
              <li>
                <button onClick={() => goTo('settings')} className="hover:text-[#D4AF37] transition-colors cursor-pointer text-start flex items-center gap-1.5">
                  <Shield className="w-3 h-3 text-[#D4AF37]/70" />
                  إعدادات الحساب والخصوصية
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: الدعم وجهات الاتصال */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-[#D4AF37] flex items-center gap-1.5">
              <LifeBuoy className="w-4 h-4" />
              مركز الدعم الفني
            </h4>
            <ul className="space-y-2 text-xs text-white/70">
              <li>
                <button
                  onClick={() => goTo('support')}
                  className="w-full text-center py-2 px-3 bg-[#D4AF37] text-[#0F3D2E] rounded-xl font-bold text-xs hover:bg-white transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <LifeBuoy className="w-3.5 h-3.5" />
                  <span>فتح تذكرة دعم ومساعدة</span>
                </button>
              </li>
              <li>
                <span className="flex items-center gap-1.5">
                  <Mail className="w-3 h-3" />
                  yazan@aygram.app
                </span>
              </li>
              <li>
                <span className="flex items-center gap-1.5">
                  <Phone className="w-3 h-3" />
                  +962790000000
                </span>
              </li>
              <li>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3 h-3" />
                  الاثنين - الجمعة: 9ص - 6م
                </span>
              </li>
              <li>
                <span className="text-[#D4AF37]/80 cursor-pointer hover:text-[#D4AF37]">
                  تطبيق AyGram (قريباً)
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Legal */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-white/50">
          <p>© {new Date().getFullYear()} AyGram — جميع الحقوق محفوظة — المالك والمطور: يزن السلاق</p>
          <div className="flex items-center gap-3 flex-wrap">
            <button onClick={() => goTo('rules')} className="hover:text-white cursor-pointer">الشروط والأحكام</button>
            <span>•</span>
            <button onClick={() => goTo('rules')} className="hover:text-white cursor-pointer">سياسة الخصوصية</button>
            <span>•</span>
            <button onClick={() => goTo('rules')} className="hover:text-white cursor-pointer">معايير المنصة</button>
            <span>•</span>
            <button onClick={() => goTo('home')} className="hover:text-white cursor-pointer">إتصل بنا</button>
          </div>
        </div>
      </div>
    </footer>
  );
};