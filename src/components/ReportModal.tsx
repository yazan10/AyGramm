import React, { useState } from 'react';
import { X, Flag, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAyGram } from '../context/AyGramContext';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetId: string;
  targetSnippet: string;
  targetType?: 'post' | 'product' | 'comment' | 'user';
}

const REPORT_REASONS = [
  'الإرهاب والتطرف',
  'الحسابات المزيفة والانتحال',
  'المحتوى الإباحي',
  'شتم الذات الإلهية',
  'الاستهانة بالدين والرموز الدينية',
  'نشر محتوى غير لائق',
  'نشر صور متبرجات',
  'انتحال شخصية آخرين',
  'مضايقة شخص آخر',
  'التهديد والتشهير بشخص آخر',
];

export const ReportModal: React.FC<ReportModalProps> = ({
  isOpen,
  onClose,
  targetId,
  targetSnippet,
  targetType = 'post',
}) => {
  const { submitReport } = useAyGram();
  const [reason, setReason] = useState(REPORT_REASONS[0]);
  const [details, setDetails] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitReport({
      targetId,
      targetType,
      reason: details.trim() ? `${reason}: ${details.trim()}` : reason,
      snippet: targetSnippet,
    });
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[#FCF9F0] rounded-[16px] max-w-md w-full p-6 shadow-aygram-md border border-[#EFE9D9] relative text-[#1A1A1A]">
        
        <button
          onClick={onClose}
          className="absolute top-4 start-4 p-1.5 rounded-[8px] text-[#7A7A7A] hover:text-[#0F3D2E] hover:bg-black/5 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-4">
          <div className="w-12 h-12 rounded-full bg-[#E8B4B8]/30 text-[#0F3D2E] flex items-center justify-center mx-auto mb-2 border border-[#E8B4B8]">
            <Flag className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-[#0F3D2E]">
            إرسال بلاغ رقابي لإدارة AyGram
          </h3>
          <p className="text-xs text-[#7A7A7A] mt-1">
            نحرص على صيانة بيئة المنصة لتبقى واحة نقية وآمنة للجميع
          </p>
        </div>

        {targetSnippet && (
          <div className="p-3 bg-white rounded-[12px] border border-[#EFE9D9] text-xs text-[#7A7A7A] italic mb-4 line-clamp-2">
            "{targetSnippet}"
          </div>
        )}

        {submitted ? (
          <div className="p-4 rounded-[12px] bg-[#0F3D2E]/10 border border-[#0F3D2E]/30 text-xs font-bold text-[#0F3D2E] flex items-center justify-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-[#0F3D2E]" />
            <span>تم استلام بلاغك بنجاح، وستتم مراجعته فوراً من قبل المشرفين جزاك الله خيراً.</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <label className="block text-xs font-bold text-[#1A1A1A] mb-1.5">
                اختر سبب البلاغ:
              </label>
              <div className="space-y-1.5 max-h-48 overflow-y-auto pe-1">
                {REPORT_REASONS.map((r) => (
                  <label
                    key={r}
                    className={`flex items-center gap-2.5 p-2 rounded-[10px] text-xs cursor-pointer border transition-all ${
                      reason === r
                        ? 'bg-[#0F3D2E] text-white border-[#0F3D2E]'
                        : 'bg-white border-[#EFE9D9] text-[#1A1A1A] hover:bg-[#FCF9F0]'
                    }`}
                  >
                    <input
                      type="radio"
                      name="reportReason"
                      value={r}
                      checked={reason === r}
                      onChange={(e) => setReason(e.target.value)}
                      className="hidden"
                    />
                    <span className="truncate">{r}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1A1A1A] mb-1">
                ملاحظات إضافية (اختياري):
              </label>
              <textarea
                rows={2}
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="توضيح مختصر للمخالفة لمساعدة المشرفين..."
                className="w-full py-2 px-3 rounded-[12px] bg-white border border-[#EFE9D9] text-xs focus:outline-none focus:border-[#0F3D2E] resize-none"
              />
            </div>

            <div className="flex gap-2 pt-1">
              <button
                type="submit"
                className="flex-1 py-2.5 px-4 rounded-[12px] bg-[#0F3D2E] text-[#D4AF37] font-bold text-xs hover:bg-[#16503c] transition-colors shadow-aygram cursor-pointer"
              >
                إرسال البلاغ
              </button>
              <button
                type="button"
                onClick={onClose}
                className="py-2.5 px-4 rounded-[12px] bg-white border border-[#EFE9D9] text-[#7A7A7A] font-medium text-xs hover:bg-black/5 transition-colors cursor-pointer"
              >
                إلغاء
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
