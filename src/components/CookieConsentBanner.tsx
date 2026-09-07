import React, { useState, useEffect } from 'react';
import { ShieldCheck, Cookie, ChevronRight, X } from 'lucide-react';
import { useAyGram } from '../context/AyGramContext';

export const CookieConsentBanner: React.FC = () => {
  const { setActiveView } = useAyGram();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    try {
      const consent = localStorage.getItem('aygram_cookies_accepted');
      if (!consent) {
        // Show after a brief delay for smooth entrance
        const timer = setTimeout(() => setIsVisible(true), 800);
        return () => clearTimeout(timer);
      }
    } catch {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    try {
      localStorage.setItem('aygram_cookies_accepted', 'true');
      if (typeof document !== 'undefined') {
        document.cookie = 'aygram_cookies_accepted=true; path=/; max-age=31536000; SameSite=Lax';
      }
    } catch (e) {
      console.error(e);
    }
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <aside
      id="cookie-consent-banner"
      role="region"
      aria-label="إشعار ملفات تعريف الارتباط"
      className="fixed bottom-4 inset-x-4 md:inset-x-auto md:left-8 md:max-w-xl z-50 bg-[#0A261D] text-white border border-[#D4AF37]/30 rounded-2xl shadow-2xl p-5 backdrop-blur-md"
    >
      <div className="flex items-start gap-3.5">
        <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/15 border border-[#D4AF37]/30 flex items-center justify-center shrink-0 text-[#D4AF37]">
          <Cookie className="w-5 h-5" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1">
            <h2 className="text-sm font-bold text-[#F4E8C1] flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
              حفظ تسجيل الدخول وملفات تعريف الارتباط
            </h2>
            <button
              id="close-cookie-banner-btn"
              onClick={handleAccept}
              aria-label="إغلاق إشعار الكوكيز"
              className="text-stone-400 hover:text-white transition-colors p-1 rounded-lg"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-xs text-stone-300 leading-relaxed mb-3.5">
            تستخدم المنصة ملفات تعريف الارتباط (Cookies) وتخزين الجلسة لحفظ تسجيل دخولك وإبقائك متصلاً بحسابك في كل مرة تتنقل فيها بين الصفحات أو تعيد فتح المتصفح، وضمان أفضل أداء آمن.
          </p>

          <div className="flex flex-wrap items-center gap-2">
            <button
              id="accept-cookies-btn"
              onClick={handleAccept}
              className="px-4 py-2 bg-[#D4AF37] hover:bg-[#c49f2e] text-[#0F3D2E] text-xs font-bold rounded-xl transition-all shadow-md active:scale-95"
            >
              قبول وحفظ تسجيل الدخول
            </button>

            <button
              id="view-cookie-terms-btn"
              onClick={() => {
                handleAccept();
                setActiveView('rules');
              }}
              className="px-3 py-2 text-xs text-[#D4AF37] hover:text-[#F4E8C1] font-semibold rounded-xl hover:bg-white/5 transition-colors flex items-center gap-1"
            >
              قوانين وشروط المنصة
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};
