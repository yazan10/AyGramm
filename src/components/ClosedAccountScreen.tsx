import React from 'react';
import { AlertTriangle, ShieldAlert, Lock, CalendarClock, LogIn } from 'lucide-react';
import { User } from '../types/aygram';

interface ClosedAccountScreenProps {
  user: User;
  onBackToLogin: () => void;
}

export const ClosedAccountScreen: React.FC<ClosedAccountScreenProps> = ({ user, onBackToLogin }) => {
  const remainingDays = (() => {
    if (!user.closedAt) return 30;
    const el = 30 - Math.floor((Date.now() - Date.parse(user.closedAt)) / 86400000);
    return Math.max(0, el);
  })();

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#FCF9F0] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-[20px] border border-[#E8B4B8] shadow-aygram-md overflow-hidden">
        {/* Warning header */}
        <div className="bg-gradient-to-l from-[#801824] to-[#a81f2e] text-white p-6 text-center relative overflow-hidden">
          <div className="w-16 h-16 mx-auto rounded-full bg-white/15 border border-white/30 flex items-center justify-center mb-3">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h2 className="text-lg font-black">هذا الحساب مغلق من قبل الإدارة</h2>
          <p className="text-xs text-white/80 mt-1 font-medium">
            تم إيقاف الحساب بشكل نهائي وفق سياسات المنصة
          </p>
        </div>

        <div className="p-6 space-y-4 text-[#1A1A1A]">
          {/* Identity now hidden */}
          <div className="p-3.5 rounded-[14px] bg-[#FCF9F0] border border-[#EFE9D9] flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-[#333] text-white flex items-center justify-center font-black text-ay">
              <span className="text-sm">U</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span dir="ltr" className="text-sm font-black text-[#333]">@aygram.user</span>
                <Lock className="w-3.5 h-3.5 text-[#7A7A7A]" />
              </div>
              <p className="text-[11px] text-[#7A7A7A]">
                هوية المستخدم مخفية الآن عن بقية المنصة
              </p>
            </div>
          </div>

          {/* Closure reason */}
          {user.closureReason && (
            <div className="p-3.5 rounded-[14px] bg-white border border-[#EFE9D9]">
              <p className="text-[11px] font-bold text-[#7A7A7A] mb-1 flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5 text-[#a81f2e]" />
                سبب الإغلاق:
              </p>
              <p className="text-xs font-semibold text-[#1A1A1A] leading-relaxed">{user.closureReason}</p>
            </div>
          )}

          {/* 30-day countdown */}
          <div className="p-3.5 rounded-[14px] bg-[#D4AF37]/10 border border-[#D4AF37]/40 flex items-center gap-3">
            <CalendarClock className="w-6 h-6 text-[#D4AF37] shrink-0" />
            <div>
              <p className="text-xs font-black text-[#0F3D2E]">
                {remainingDays > 0 ? `${remainingDays} يوماً متبقياً` : 'سيتم الحذف النهائي قريباً'}
              </p>
              <p className="text-[11px] text-[#7A7A7A] mt-0.5">
                سيتم حذف حسابك وكل محتواه نهائياً بعد مرور 30 يوماً من الإغلاق. لا يمكن استعادته بعدها.
              </p>
            </div>
          </div>

          <button
            onClick={onBackToLogin}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-[12px] bg-[#0F3D2E] text-[#D4AF37] font-bold text-xs hover:bg-[#16503c] transition-colors shadow-aygram cursor-pointer"
          >
            <LogIn className="w-4 h-4" />
            العودة إلى شاشة تسجيل الدخول
          </button>

          <p className="text-[10px] text-center text-[#a8a29e]">
            بالتعاون مع إدارة AyGram للحفاظ على بيئة المنصة نقية وآمنة
          </p>
        </div>
      </div>
    </div>
  );
};