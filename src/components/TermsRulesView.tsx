import React from 'react';
import {
  ShieldAlert,
  FileText,
  UserCheck,
  Scale,
  Award,
  Lock,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  Layers,
  Ban
} from 'lucide-react';
import { useAyGram } from '../context/AyGramContext';

export const TermsRulesView: React.FC = () => {
  const { setActiveView, currentUser } = useAyGram();

  return (
    <div id="terms-rules-view" className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Top Header Card */}
      <div className="bg-gradient-to-br from-[#0F3D2E] via-[#0d3427] to-[#082018] text-white p-6 md:p-8 rounded-2xl border border-[#D4AF37]/30 shadow-xl relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-xl bg-[#D4AF37]/20 border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37]">
              <Scale className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs uppercase tracking-wider text-[#D4AF37] font-semibold">الوثيقة الرسمية</span>
              <h1 className="text-2xl md:text-3xl font-bold text-[#F4E8C1]">شروط وقوانين المنصة</h1>
            </div>
          </div>
          <p className="text-sm md:text-base text-stone-200 leading-relaxed max-w-2xl">
            ميثاق الاستخدام، معايير التغريد والنشر، حقوق الملكية الفكرية، وسياسات حظر الحسابات لحماية جميع مستخدمي المنصة.
          </p>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3 pt-4 border-t border-white/10 text-xs text-stone-300">
          <span className="flex items-center gap-1.5 bg-black/25 px-3 py-1.5 rounded-lg border border-white/10">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#D4AF37]" />
            سارية المفعول
          </span>
          <span className="flex items-center gap-1.5 bg-black/25 px-3 py-1.5 rounded-lg border border-white/10">
            <Lock className="w-3.5 h-3.5 text-[#D4AF37]" />
            ملزمة لجميع الحسابات المسجلة
          </span>
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

      {/* Prominent Ownership & Launch Notice Card as requested */}
      <div className="bg-[#FFFDF7] border-2 border-[#D4AF37] p-6 md:p-7 rounded-2xl shadow-md">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#0F3D2E] text-[#D4AF37] flex items-center justify-center shrink-0 shadow">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <span className="inline-block px-3 py-1 bg-[#D4AF37]/15 text-[#0F3D2E] text-xs font-bold rounded-full mb-2">
              إشعار الملكية والحقوق الحصرية
            </span>
            <h2 className="text-lg md:text-xl font-bold text-[#0F3D2E] mb-2">
              إطلاق المنصة وحقوق المطور يزن السلاق
            </h2>
            <p className="text-stone-700 text-sm md:text-base leading-relaxed mb-3">
              تم إطلاق هذه المنصة وتطويرها بالكامل بواسطة المطور <strong className="text-[#0F3D2E] font-extrabold underline decoration-[#D4AF37] decoration-2">يزن السلاق</strong>، وهي مملوكة له حصرياً وبشكل كامل ومطلق.
            </p>
            <p className="text-stone-600 text-xs md:text-sm leading-relaxed">
              جميع حقوق الملكية الفكرية، التصاميم، البنية البرمجية، العلامة التجارية، والواجهات البرمجية محفوظة حصرياً للمطور يزن السلاق، ولا يجوز نسخها أو نقلها أو إعادة استغلالها دون إذن خطي مسبق منه شخصياً.
            </p>
          </div>
        </div>
      </div>

      {/* Section 1: Community Guidelines & Tweeting Rules */}
      <div className="bg-white border border-stone-200 rounded-2xl p-6 md:p-7 shadow-sm space-y-4">
        <div className="flex items-center gap-3 border-b border-stone-100 pb-3">
          <div className="w-9 h-9 rounded-lg bg-emerald-50 text-[#0F3D2E] flex items-center justify-center font-bold">
            1
          </div>
          <h2 className="text-lg font-bold text-stone-900">معايير التغريد والمشاركة الرقمية</h2>
        </div>
        <ul className="space-y-3 text-sm text-stone-700 leading-relaxed list-disc list-inside">
          <li>
            <strong>حرية الرأي المسؤولة:</strong> يُتاح لكل مستخدم التعبير عن أفكاره وآرائه باحترام متبادل دون تجريح أو إساءة للآخرين.
          </li>
          <li>
            <strong>منع المحتوى المضلل:</strong> يُحظر نشر الأخبار المزيفة، أو الروابط الاحتيالية، أو الإعلانات المضللة التي تستهدف سرقة بيانات المستخدمين.
          </li>
          <li>
            <strong>منع الرسائل المزعجة (Spam):</strong> يُمنع إرسال تعليقات مكررة أو رسائل ترويجية عشوائية في المحادثات المباشرة والتغريدات.
          </li>
          <li>
            <strong>احترام الخصوصية:</strong> يُمنع منعاً باتاً نشر أرقام الهواتف أو الصور الشخصية أو معلومات خاصة بأي فرد دون موافقته الصريحة.
          </li>
        </ul>
      </div>

      {/* Section 2: Account Rules & Verification */}
      <div className="bg-white border border-stone-200 rounded-2xl p-6 md:p-7 shadow-sm space-y-4">
        <div className="flex items-center gap-3 border-b border-stone-100 pb-3">
          <div className="w-9 h-9 rounded-lg bg-emerald-50 text-[#0F3D2E] flex items-center justify-center font-bold">
            2
          </div>
          <h2 className="text-lg font-bold text-stone-900">شروط الحسابات والتوثيق</h2>
        </div>
        <ul className="space-y-3 text-sm text-stone-700 leading-relaxed list-disc list-inside">
          <li>
            <strong>فرادة اسم المستخدم:</strong> كل اسم مستخدم في المنصة فريد ومستقل، ويُمنع انتحال شخصيات عامة أو علامات تجارية قائمة.
          </li>
          <li>
            <strong>شارة التوثيق الرسمية:</strong> تُمنح شارة التوثيق لحسابات المبدعين، وصناع المحتوى، والشركات بعد مراجعة دقيقة من فريق الإشراف لضمان المصداقية.
          </li>
          <li>
            <strong>أمان كلمة المرور:</strong> المستخدم هو المسؤول الأول عن الحفاظ على سرية كلمة المرور الخاصة بحسابه ونشاطاته على المنصة.
          </li>
        </ul>
      </div>

      {/* Section 3: Banning & Suspension Policies */}
      <div className="bg-white border border-stone-200 rounded-2xl p-6 md:p-7 shadow-sm space-y-4">
        <div className="flex items-center gap-3 border-b border-stone-100 pb-3">
          <div className="w-9 h-9 rounded-lg bg-red-50 text-red-700 flex items-center justify-center font-bold">
            3
          </div>
          <h2 className="text-lg font-bold text-stone-900">سياسات وإجراءات الحظر والعقوبات</h2>
        </div>
        <p className="text-sm text-stone-600 leading-relaxed">
          تحتفظ إدارة المنصة بحق اتخاذ الإجراءات التأديبية الفورية لحماية المجتمع، والتي تشمل:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="p-3.5 bg-stone-50 border border-stone-200 rounded-xl">
            <span className="text-xs font-bold text-stone-800 block mb-1">الإنذار الرسمي</span>
            <p className="text-xs text-stone-600">توجيه إشعار تنبيهي للحساب بخصوص المنشور أو السلوك المخالف.</p>
          </div>
          <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl">
            <span className="text-xs font-bold text-amber-900 block mb-1">التقييد المؤقت</span>
            <p className="text-xs text-amber-800">تعطيل القدرة على التغريد أو إرسال الرسائل لفترة محددة.</p>
          </div>
          <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl">
            <span className="text-xs font-bold text-red-900 block mb-1">الحظر الدائم</span>
            <p className="text-xs text-red-800">إيقاف الحساب كلياً ومنعه من الدخول للمنصة للانتهاكات الجسيمة.</p>
          </div>
        </div>
        <div className="pt-2">
          <button
            onClick={() => setActiveView('bans')}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0F3D2E] hover:text-[#D4AF37] transition-colors"
          >
            <Ban className="w-4 h-4 text-red-600" />
            استعراض صفحة الحظر وقائمة الحسابات الموقوفة
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Section 4: Cookies & Login Retention */}
      <div className="bg-white border border-stone-200 rounded-2xl p-6 md:p-7 shadow-sm space-y-4">
        <div className="flex items-center gap-3 border-b border-stone-100 pb-3">
          <div className="w-9 h-9 rounded-lg bg-emerald-50 text-[#0F3D2E] flex items-center justify-center font-bold">
            4
          </div>
          <h2 className="text-lg font-bold text-stone-900">سياسة ملفات تعريف الارتباط (Cookies) وحفظ الجلسة</h2>
        </div>
        <p className="text-sm text-stone-700 leading-relaxed">
          تستخدم المنصة تقنيات التخزين المحلي (LocalStorage) وملفات تعريف الارتباط المشفرة لحفظ حالة تسجيل الدخول، بحيث لا يضطر المستخدم لإعادة كتابة بياناته في كل مرة يتنقل فيها بين الأقسام أو عند إعادة فتح المتصفح. يمكنك في أي وقت مسح الجلسة بتسجيل الخروج من الحساب.
        </p>
      </div>

      {/* Footer Navigation */}
      <div className="flex items-center justify-between pt-4 border-t border-stone-200 text-xs text-stone-500">
        <span>آخر تحديث للقوانين: 2026</span>
        <span>منصة AyGram — جميع الحقوق محفوظة للمطور يزن السلاق</span>
      </div>
    </div>
  );
};
