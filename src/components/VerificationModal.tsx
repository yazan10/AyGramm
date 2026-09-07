import React, { useState } from 'react';
import { Award, ShieldCheck, X, CheckCircle2, AlertCircle, FileText } from 'lucide-react';
import { useAyGram } from '../context/AyGramContext';

interface VerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VerificationModal: React.FC<VerificationModalProps> = ({ isOpen, onClose }) => {
  const { currentUser, submitVerificationRequest } = useAyGram();
  const [category, setCategory] = useState('خطاط أو فنان إسلامي');
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!reason.trim()) {
      setError('يرجى كتابة نبذة عن نشاطك وسبب طلب شارة التوثيق');
      return;
    }

    const res = submitVerificationRequest({ category, reason: reason.trim() });
    if (res.success) {
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 1500);
    } else {
      setError(res.error || 'تعذر إرسال الطلب');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 font-['IBM_Plex_Sans_Arabic']" dir="rtl">
      <div className="bg-white rounded-[20px] max-w-md w-full p-6 border border-[#EFE9D9] shadow-aygram-md relative text-[#1A1A1A]">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 start-4 p-1.5 rounded-full text-[#7A7A7A] hover:text-[#0F3D2E] hover:bg-[#FCF9F0] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-5">
          <div className="w-12 h-12 rounded-[14px] bg-[#D4AF37]/15 text-[#0F3D2E] flex items-center justify-center mx-auto mb-2 border border-[#D4AF37]/30">
            <Award className="w-6 h-6 text-[#D4AF37]" />
          </div>
          <h3 className="text-lg font-bold text-[#0F3D2E]">طلب توثيق الحساب الرسمي</h3>
          <p className="text-xs text-[#7A7A7A] mt-1">
            شارة التوثيق الزرقاء/الذهبية تعزز المصداقية والأمانة في منصة AyGram 🛡️
          </p>
        </div>

        {error && (
          <div className="mb-4 p-2.5 rounded-[12px] bg-red-50 border border-red-200 text-xs font-bold text-red-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 rounded-[12px] bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-700 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>تم إرسال طلب التوثيق إلى الإدارة بنجاح، سيتم الرد عليك في الإشعارات قريباً.</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-xs font-bold text-[#1A1A1A] mb-1">
              اسم الحساب ومقدم الطلب
            </label>
            <input
              type="text"
              readOnly
              value={`${currentUser?.fullName || currentUser?.username} (@${currentUser?.username})`}
              className="w-full py-2 px-3 rounded-[12px] bg-[#FCF9F0] border border-[#EFE9D9] text-xs text-[#555555]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#1A1A1A] mb-1">
              تصنيف الحساب
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full py-2 px-3 rounded-[12px] bg-white border border-[#EFE9D9] text-xs focus:outline-none focus:border-[#0F3D2E]"
            >
              <option value="خطاط أو فنان إسلامي">خطاط أو فنان إسلامي</option>
              <option value="باحث أو طالب علم شرعي">باحث أو طالب علم شرعي</option>
              <option value="متجر وتجارة معتمدة (سجل تجاري/معروف)">متجر وتجارة معتمدة (سجل تجاري/معروف)</option>
              <option value="صانع محتوى وداعية هادف">صانع محتوى وداعية هادف</option>
              <option value="مؤسسة وقفية أو خيرية مرخصة">مؤسسة وقفية أو خيرية مرخصة</option>
              <option value="كاتب أو مؤلف إسلامي">كاتب أو مؤلف إسلامي</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#1A1A1A] mb-1">
              سبب الطلب وإثبات الهوية / النشاط <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="وضح مساهماتك، روابط أعمالك، أو رقم ترخيصك وسجلك التجاري..."
              className="w-full py-2 px-3 rounded-[12px] bg-white border border-[#EFE9D9] text-xs focus:outline-none focus:border-[#0F3D2E]"
              required
            />
          </div>

          <div className="bg-[#FCF9F0] p-3 rounded-[12px] border border-[#EFE9D9] text-[11px] text-[#7A7A7A] flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
            <span>تتم مراجعة الطلب يدوياً للتأكد من خلو الحساب من أي مخالفات شرعية أو سلوكية.</span>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-[12px] bg-[#0F3D2E] text-white font-bold text-xs hover:bg-[#155A44] transition-colors cursor-pointer"
          >
            إرسال طلب التوثيق للإدارة
          </button>
        </form>
      </div>
    </div>
  );
};
