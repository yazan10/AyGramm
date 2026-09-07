import React from 'react';
import { Sparkles, X, ArrowRight, ArrowLeft } from 'lucide-react';
import { Language } from '../types';

interface PromoBannerProps {
  lang: Language;
  onExploreOffer: () => void;
}

export const PromoBanner: React.FC<PromoBannerProps> = ({ lang, onExploreOffer }) => {
  const [visible, setVisible] = React.useState(true);

  if (!visible) return null;

  return (
    <aside aria-label="Special Offer Banner" className="relative bg-[#0a1317] text-white py-3 px-4 sm:px-6 transition-all duration-300">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 text-xs sm:text-sm font-bold">
        <div className="flex items-center gap-2.5 mx-auto text-center flex-wrap justify-center">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#f7b928] text-[#0a1317] text-[11px] font-bold tracking-tight">
            <Sparkles className="w-3 h-3" />
            {lang === 'ar' ? 'عرض خاص محدود' : 'Limited Offer'}
          </span>
          <span className="text-stone-200">
            {lang === 'ar' 
              ? 'احصل على خصم 25% وشحن مجاني سريع على نظارات الذكاء الاصطناعي Ray-Ban Meta'
              : 'Get 25% off + free 2-day delivery on Ray-Ban Meta AI smart glasses'}
          </span>
          <button
            onClick={onExploreOffer}
            className="inline-flex items-center gap-1 underline hover:text-[#0091ff] font-bold transition-colors cursor-pointer text-xs"
          >
            {lang === 'ar' ? 'تسوق العرض الآن' : 'Shop Offer'}
            {lang === 'ar' ? <ArrowLeft className="w-3 h-3" /> : <ArrowRight className="w-3 h-3" />}
          </button>
        </div>
        <button
          onClick={() => setVisible(false)}
          className="text-stone-400 hover:text-white p-1 rounded-full transition-colors cursor-pointer shrink-0"
          aria-label={lang === 'ar' ? 'إغلاق الإشعار' : 'Dismiss banner'}
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
};
