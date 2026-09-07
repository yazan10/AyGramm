import React from 'react';
import { Ban } from 'lucide-react';
import { useAyGram } from '../context/AyGramContext';
import { BannedAccountsView } from '../components/BannedAccountsView';

export const BansPage: React.FC = () => {
  const { currentUser, isAdminUnlocked, setActiveView } = useAyGram();

  const isAuthorized = isAdminUnlocked || currentUser?.role === 'admin' || currentUser?.role === 'owner' || currentUser?.isAdmin;

  if (!isAuthorized) {
    return (
      <div className="bg-white rounded-3xl p-10 text-center border border-stone-200 shadow-sm space-y-3 max-w-lg mx-auto my-6">
        <Ban className="w-10 h-10 text-red-500 mx-auto" />
        <h2 className="text-base font-bold text-stone-900">سجل الموقوفين وقوائم الحظر للإدارة فقط</h2>
        <p className="text-xs text-stone-500 max-w-md mx-auto leading-relaxed">
          بناءً على خصوصية المنصة وضوابط الأمان، تقتصر صلاحية الاطلاع على سجلات الحظر والموقوفين على مشرفي وإدارة المنصة فقط.
        </p>
        <button
          onClick={() => setActiveView(currentUser ? 'home' : 'explore')}
          className="px-5 py-2 bg-[#0F3D2E] text-[#D4AF37] font-bold text-xs rounded-xl hover:bg-[#155A44] transition-colors cursor-pointer"
        >
          العودة للرئيسية
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <BannedAccountsView />
    </div>
  );
};
