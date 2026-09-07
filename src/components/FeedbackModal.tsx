import React, { useState } from 'react';
import { X, CheckCircle2, Star } from 'lucide-react';
import { useAyGram } from '../context/AyGramContext';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const RATING_LABELS: Record<number, string> = {
  1: 'ضعيف',
  2: 'يحتاج تحسين',
  3: 'متوسط',
  4: 'جيد جداً',
  5: 'ممتاز',
};

const RATING_TEXT: Record<number, string> = {
  1: 'تجربتي مع المنصة كانت صعبة',
  2: 'هناك أمور تحتاج تطويراً',
  3: 'تجربة متوسطة نسبياً',
  4: 'منصة جيدة وتستحق التطوير',
  5: 'تجربة ممتازة وأنصح بها',
};

export const FeedbackModal: React.FC<FeedbackModalProps> = ({ isOpen, onClose }) => {
  const { currentUser, showToast } = useAyGram();
  const [feedbackText, setFeedbackText] = useState('');
  const [sentiment, setSentiment] = useState<'happy' | 'sad' | null>(null);
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!feedbackText.trim() && !sentiment) {
      showToast('يرجى كتابة ملاحظاتك أو اختيار انطباعك قبل الإرسال', 'warning');
      return;
    }

    setIsSubmitted(true);
    showToast(`شكراً لتقييمك ${RATING_LABELS[rating]}! نقدر مساهمتك في تطوير AyGram 🌟`, 'success', 4500);

    setTimeout(() => {
      setIsSubmitted(false);
      setFeedbackText('');
      setSentiment(null);
      setRating(5);
      setHoverRating(null);
      onClose();
    }, 1800);
  };

  const activeRating = hoverRating ?? rating;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs font-['IBM_Plex_Sans_Arabic']" dir="rtl">
      <div className="relative w-full max-w-md bg-white rounded-2xl p-5 shadow-2xl border border-stone-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 start-4 p-1.5 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {isSubmitted ? (
          <div className="py-10 text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-[#0F3D2E]/10 text-[#0F3D2E] flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-base font-bold text-stone-900">تم استلام ملاحظاتك بنجاح!</h3>
            <p className="text-xs text-stone-500 max-w-xs mx-auto">
              آراؤك وملاحظاتك تساهم بشكل مباشر في تحسين تجربة مجتمع AyGram.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-center pt-2">
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#0F3D2E]/10 text-[#0F3D2E] mb-2 inline-block">
                صوتك يهمنا 💬
              </span>
              <p className="text-xs text-stone-500 mt-1">
                شاركنا تجربتك واقتراحاتك لتطوير المنصة للأفضل
              </p>
            </div>

            {/* From Uiverse.io by catraco: Send Feedback Card */}
            <div className="bg-white border border-slate-200 grid grid-cols-6 gap-2 rounded-xl p-2 text-sm shadow-xs">
              <h1 className="text-center text-slate-400 text-sm font-bold col-span-6 py-1">
                Send Feedback | إرسال الملاحظات
              </h1>

              {/* Organized Star Rating Row */}
              <div className="col-span-6 flex items-center justify-center gap-3 rounded-lg bg-white border border-slate-200 p-2.5">
                <div className="flex items-center gap-1" dir="ltr">
                  {[5, 4, 3, 2, 1].map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setRating(n)}
                      onMouseEnter={() => setHoverRating(n)}
                      onMouseLeave={() => setHoverRating(null)}
                      title={`${RATING_LABELS[n]} ${n}/5`}
                      className="cursor-pointer p-0.5 transition-transform duration-150 hover:scale-125 active:scale-95"
                    >
                      <Star
                        className={`w-6 h-6 transition-colors ${
                          n <= activeRating
                            ? 'fill-[#D4AF37] text-[#D4AF37] drop-shadow-sm'
                            : 'fill-slate-200 text-slate-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>

                <div className="border-s border-slate-200 ps-3">
                  <span className="block text-base font-black text-[#0F3D2E] font-mono">
                    {activeRating}/5
                  </span>
                  <span className="block text-[10px] font-bold text-stone-400">
                    {RATING_LABELS[activeRating]}
                  </span>
                </div>
              </div>

              {activeRating !== 5 && (
                <p className="col-span-6 text-center text-xs text-stone-500">
                  {RATING_TEXT[activeRating]}
                </p>
              )}

              <textarea
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                placeholder="اكتب ملاحظاتك، ما الذي يعجبك في AyGram؟ وما الذي تتمنى تحسينه؟..."
                className="bg-slate-100 text-slate-700 h-28 placeholder:text-slate-400 border border-slate-200 col-span-6 resize-none outline-none rounded-lg p-2.5 text-xs duration-300 focus:border-slate-600 focus:bg-white"
              ></textarea>

              {/* Happy Smile Button */}
              <button
                type="button"
                onClick={() => setSentiment('happy')}
                title="راضي وسعيد بالتجربة"
                className={`col-span-1 flex justify-center items-center rounded-lg p-2 duration-300 border cursor-pointer ${
                  sentiment === 'happy'
                    ? 'bg-emerald-500 fill-white border-emerald-600 shadow-xs'
                    : 'bg-slate-100 fill-slate-600 hover:border-slate-600 focus:fill-blue-200 focus:bg-blue-400 border-slate-200'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 0 512 512">
                  <path d="M464 256A208 208 0 1 0 48 256a208 208 0 1 0 416 0zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zm177.6 62.1C192.8 334.5 218.8 352 256 352s63.2-17.5 78.4-33.9c9-9.7 24.2-10.4 33.9-1.4s10.4 24.2 1.4 33.9c-22 23.8-60 49.4-113.6 49.4s-91.7-25.5-113.6-49.4c-9-9.7-8.4-24.9 1.4-33.9s24.9-8.4 33.9 1.4zM144.4 208a32 32 0 1 1 64 0 32 32 0 1 1 -64 0zm192-32a32 32 0 1 1 0 64 32 32 0 1 1 0-64z"></path>
                </svg>
              </button>

              {/* Sad/Need Improvement Button */}
              <button
                type="button"
                onClick={() => setSentiment('sad')}
                title="توجد مشكلة أو يحتاج تطوير"
                className={`col-span-1 flex justify-center items-center rounded-lg p-2 duration-300 border cursor-pointer ${
                  sentiment === 'sad'
                    ? 'bg-amber-500 fill-white border-amber-600 shadow-xs'
                    : 'bg-slate-100 fill-slate-600 hover:border-slate-600 focus:fill-blue-200 focus:bg-blue-400 border-slate-200'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 0 512 512">
                  <path d="M464 256A208 208 0 1 0 48 256a208 208 0 1 0 416 0zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zM174.6 384.1c-4.5 12.5-18.2 18.9-30.7 14.4s-18.9-18.2-14.4-30.7C146.9 319.4 198.9 288 256 288s109.1 31.4 126.6 79.9c4.5 12.5-2 26.2-14.4 30.7s-26.2-2-30.7-14.4C328.2 358.5 297.2 336 256 336s-72.2 22.5-81.4 48.1zM144.4 208a32 32 0 1 1 64 0 32 32 0 1 1 -64 0zm192-32a32 32 0 1 1 0 64 32 32 0 1 1 0-64z"></path>
                </svg>
              </button>

              <span className="col-span-2"></span>

              {/* Submit / Airplane Button */}
              <button
                type="button"
                onClick={() => handleSubmit()}
                className="bg-slate-100 stroke-slate-600 border border-slate-200 col-span-2 flex justify-center items-center rounded-lg p-2 duration-300 hover:border-slate-600 hover:bg-[#0F3D2E] hover:stroke-white focus:stroke-blue-200 focus:bg-blue-400 cursor-pointer"
                title="إرسال الملاحظات الآن"
              >
                <svg fill="none" viewBox="0 0 24 24" height="24px" width="24px" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinejoin="round" strokeLinecap="round" strokeWidth="1.5" d="M7.39999 6.32003L15.89 3.49003C19.7 2.22003 21.77 4.30003 20.51 8.11003L17.68 16.6C15.78 22.31 12.66 22.31 10.76 16.6L9.91999 14.08L7.39999 13.24C1.68999 11.34 1.68999 8.23003 7.39999 6.32003Z"></path>
                  <path strokeLinejoin="round" strokeLinecap="round" strokeWidth="1.5" d="M10.11 13.6501L13.69 10.0601"></path>
                </svg>
              </button>
            </div>

            <p className="text-[11px] text-center text-stone-400">
              {currentUser ? `يتم الإرسال بواسطة: @${currentUser.username}` : 'يتم الإرسال بشكل مجهول وآمن'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};