import React, { useState } from 'react';
import {
  Ban,
  ShieldAlert,
  AlertTriangle,
  Search,
  Send,
  CheckCircle2,
  HelpCircle,
  ArrowRight,
  UserX,
  FileText
} from 'lucide-react';
import { useAyGram } from '../context/AyGramContext';

export const BannedAccountsView: React.FC = () => {
  const { users, submitReport, setActiveView, currentUser } = useAyGram();
  const [searchTerm, setSearchTerm] = useState('');
  const [appealUsername, setAppealUsername] = useState(currentUser?.username || '');
  const [appealReason, setAppealReason] = useState('');
  const [appealStatus, setAppealStatus] = useState<'idle' | 'submitted'>('idle');

  // Filter inactive/banned users
  const bannedUsers = users.filter((u) => !u.isActive);

  const filteredBanned = bannedUsers.filter(
    (u) =>
      u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (u.banReason && u.banReason.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleAppealSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!appealUsername.trim() || !appealReason.trim()) return;

    submitReport({
      targetId: appealUsername.trim(),
      targetType: 'user',
      reason: `طلب استئناف ورفع حظر الحساب: ${appealReason.trim()}`,
      snippet: `مقدم الطلب: @${appealUsername.trim()}`,
    });

    setAppealStatus('submitted');
  };

  return (
    <div id="banned-accounts-view" className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-red-950 via-neutral-900 to-stone-900 text-white p-6 md:p-8 rounded-2xl border border-red-800/40 shadow-xl relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-xl bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400">
              <Ban className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs uppercase tracking-wider text-red-400 font-semibold">قسم الأمان والامتثال</span>
              <h1 className="text-2xl md:text-3xl font-bold text-white">صفحة الحظر وسجل الحسابات الموقوفة</h1>
            </div>
          </div>
          <p className="text-sm md:text-base text-stone-300 leading-relaxed max-w-2xl">
            سجل شفاف للحسابات التي تم إيقافها بسبب انتهاك معايير وشروط استخدام منصة AyGram، مع إمكانية تقديم طلبات المراجعة والاستئناف.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3 pt-4 border-t border-white/10 text-xs text-stone-300">
            <button
              onClick={() => setActiveView('rules')}
              className="px-3 py-1.5 bg-white/10 hover:bg-white/15 rounded-lg border border-white/15 transition-colors flex items-center gap-1.5"
            >
              <FileText className="w-3.5 h-3.5 text-[#D4AF37]" />
              الاطلاع على شروط وقوانين المنصة
            </button>
            {currentUser && (
              <button
                onClick={() => setActiveView('home')}
                className="mr-auto text-xs text-[#D4AF37] hover:underline flex items-center gap-1"
              >
                العودة للرئيسية
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Grounds for Account Suspension */}
      <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-sm">
        <h2 className="text-base font-bold text-stone-900 mb-3 flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-red-600" />
          أسباب ودواعي إيقاف الحسابات في المنصة
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-stone-700">
          <div className="p-3 bg-stone-50 border border-stone-100 rounded-xl">
            <strong className="block text-stone-900 mb-1">1. الروابط المضللة والاحتيال</strong>
            نشر روابط تقود لمواقع ترويجية خبيثة أو محاولات تصيد وسرقة حسابات المستخدمين.
          </div>
          <div className="p-3 bg-stone-50 border border-stone-100 rounded-xl">
            <strong className="block text-stone-900 mb-1">2. الإزعاج والتكرار (Spam)</strong>
            الإرسال الآلي للردود والتغريدات العشوائية في حسابات الآخرين بصورة متكررة.
          </div>
          <div className="p-3 bg-stone-50 border border-stone-100 rounded-xl">
            <strong className="block text-stone-900 mb-1">3. انتحال الهوية والتشهير</strong>
            استخدام أسماء شخصيات عامة أو علامات تجارية بدون وجه حق أو الإساءة المتعمدة.
          </div>
          <div className="p-3 bg-stone-50 border border-stone-100 rounded-xl">
            <strong className="block text-stone-900 mb-1">4. انتهاك الملكية الفكرية</strong>
            سرقة أعمال وتصاميم ومنتجات الآخرين ونسبتها للنفس بدون تصريح من المالك.
          </div>
        </div>
      </div>

      {/* List of Suspended Accounts */}
      <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-stone-900">سجل الحسابات الموقوفة حالياً</h2>
            <p className="text-xs text-stone-500">إجمالي الحسابات الموقوفة: {bannedUsers.length}</p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-stone-400 absolute right-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="ابحث باسم المستخدم أو سبب الحظر..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-3 pr-9 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-[#0F3D2E]"
            />
          </div>
        </div>

        {filteredBanned.length === 0 ? (
          <div className="text-center py-10 text-stone-400 bg-stone-50 rounded-xl border border-dashed border-stone-200">
            <UserX className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm font-semibold">لا توجد حسابات موقوفة مطابقة للبحث</p>
          </div>
        ) : (
          <div className="divide-y divide-stone-100 border border-stone-100 rounded-xl overflow-hidden">
            {filteredBanned.map((u) => (
              <div key={u.id} className="p-4 bg-stone-50/50 hover:bg-stone-50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img
                      src={u.profileImage}
                      alt={u.fullName}
                      className="w-11 h-11 rounded-full object-cover grayscale opacity-70 border border-stone-300"
                    />
                    <span className="absolute -bottom-1 -right-1 bg-red-600 text-white rounded-full p-0.5">
                      <Ban className="w-3 h-3" />
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-stone-800">{u.fullName}</span>
                      <span className="text-xs text-stone-400 font-mono">@{u.username}</span>
                    </div>
                    <p className="text-xs text-red-700 mt-1 font-medium">
                      السبب: {u.banReason || 'مخالفة معايير وشروط الاستخدام'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-center">
                  <span className="px-2.5 py-1 bg-red-100 text-red-800 text-[11px] font-bold rounded-lg border border-red-200">
                    حساب موقوف نهائياً
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Appeal Form */}
      <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-sm">
        <h2 className="text-lg font-bold text-stone-900 mb-1 flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-[#0F3D2E]" />
          تقديم طلب مراجعة أو رفع الحظر
        </h2>
        <p className="text-xs text-stone-500 mb-4">
          إذا كنت تعتقد أن حسابك تم إيقافه عن طريق الخطأ أو قمت بتصحيح المخالفة، يمكنك رفع طلب استئناف رسمي لإدارة المنصة.
        </p>

        {appealStatus === 'submitted' ? (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-center space-y-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
            <h3 className="text-sm font-bold text-emerald-900">تم إرسال طلب المراجعة بنجاح</h3>
            <p className="text-xs text-emerald-700">
              تم تحويل طلبك لفريق الإشراف، وستتم مراجعته وفحص سجل الحساب خلال 24 ساعة.
            </p>
            <button
              onClick={() => {
                setAppealStatus('idle');
                setAppealReason('');
              }}
              className="text-xs text-emerald-800 underline font-semibold mt-2"
            >
              إرسال طلب استئناف آخر
            </button>
          </div>
        ) : (
          <form onSubmit={handleAppealSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">اسم المستخدم المحظور</label>
              <input
                type="text"
                required
                value={appealUsername}
                onChange={(e) => setAppealUsername(e.target.value)}
                placeholder="مثال: tareq_spam"
                className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-[#0F3D2E]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">توضيح أسباب الاستئناف والدلائل</label>
              <textarea
                required
                rows={4}
                value={appealReason}
                onChange={(e) => setAppealReason(e.target.value)}
                placeholder="اشرح بالتفصيل سبب اعتقادك بأن الحظر تم بالخطأ أو ما هي الخطوات التي اتخذتها للامتثال للقوانين..."
                className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-[#0F3D2E]"
              />
            </div>

            <button
              type="submit"
              className="px-5 py-2.5 bg-[#0F3D2E] hover:bg-[#144f3c] text-white text-xs font-bold rounded-xl transition-all shadow flex items-center gap-2"
            >
              <Send className="w-3.5 h-3.5" />
              إرسال طلب الاستئناف للإدارة
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
