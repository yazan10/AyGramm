import React from 'react';
import { Lock } from 'lucide-react';
import { useAyGram } from '../context/AyGramContext';

interface AuthRequiredCardProps {
  title?: string;
  description?: string;
  badge?: string;
}

export const AuthRequiredCard: React.FC<AuthRequiredCardProps> = ({
  title = 'عشان يصير الشي حقيقي، يلزمك حساب مسجل',
  description = 'بدون تسجيل الدخول لا يمكنك الوصول إلى هذه الميزة. يرجى تسجيل الدخول أو إنشاء حسابك الجديد للمتابعة بأمان.',
  badge = 'تسجيل الدخول إلزامي'
}) => {
  const { setActiveView } = useAyGram();

  return (
    <div className="bg-white rounded-3xl p-8 sm:p-12 text-center border border-stone-200 shadow-sm space-y-4 max-w-lg mx-auto my-6">
      <div className="w-16 h-16 rounded-2xl bg-[#0F3D2E]/10 text-[#0F3D2E] flex items-center justify-center mx-auto">
        <Lock className="w-8 h-8 text-[#0F3D2E]" />
      </div>
      <span className="inline-block text-[11px] font-bold px-3 py-1 rounded-full bg-[#D4AF37]/20 text-[#0F3D2E]">
        {badge}
      </span>
      <h2 className="text-lg font-black text-stone-900">
        {title}
      </h2>
      <p className="text-xs text-stone-600 leading-relaxed max-w-md mx-auto">
        {description}
      </p>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-2 pt-2">
        <button
          onClick={() => setActiveView('auth')}
          className="w-full sm:w-auto px-6 py-2.5 bg-[#0F3D2E] text-[#D4AF37] font-bold text-xs rounded-xl hover:bg-[#155A44] transition-colors cursor-pointer"
        >
          تسجيل الدخول
        </button>
        <button
          onClick={() => setActiveView('auth')}
          className="w-full sm:w-auto px-6 py-2.5 bg-stone-100 text-stone-800 font-bold text-xs rounded-xl hover:bg-stone-200 transition-colors cursor-pointer"
        >
          إنشاء حساب جديد
        </button>
        <button
          onClick={() => setActiveView('explore')}
          className="w-full sm:w-auto px-4 py-2.5 text-stone-500 hover:text-[#0F3D2E] text-xs font-bold transition-colors cursor-pointer"
        >
          الرجوع للإكسبلور
        </button>
      </div>
    </div>
  );
};
