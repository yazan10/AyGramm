import React from 'react';
import { Truck, RotateCcw, ShieldCheck, CreditCard, Sparkles, ArrowLeft, ArrowRight, Eye, Video, Volume2 } from 'lucide-react';
import { Language } from '../types';

interface HeroSectionProps {
  lang: Language;
  onExploreProducts: () => void;
  onConfigureGlasses: () => void;
  onConfigureQuest: () => void;
  onLearnMore: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  lang,
  onExploreProducts,
  onConfigureGlasses,
  onConfigureQuest,
  onLearnMore,
}) => {
  return (
    <section className="space-y-12 md:space-y-20 pb-12">
      
      {/* 1. Main Hero Stage - Full Bleed Photography with Overlaid Copy & Dual-CTA */}
      <div className="relative overflow-hidden rounded-[24px] sm:rounded-[32px] bg-[#0a1317] text-white min-h-[580px] md:min-h-[660px] flex items-end">
        {/* Background Showcase Photography */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=2000&q=85"
            alt="Ray-Ban Meta Smart Glasses"
            className="w-full h-full object-cover object-center opacity-75 scale-105 transition-transform duration-1000 ease-out hover:scale-100"
            referrerPolicy="no-referrer"
          />
          {/* Gradient overlay for superior text contrast */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a1317] via-[#0a1317]/60 to-transparent" />
        </div>

        {/* Hero Copy Content */}
        <div className="relative z-10 p-6 sm:p-10 md:p-16 max-w-3xl space-y-6">
          {/* Promo Tag */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#f7b928] text-[#0a1317] text-xs font-bold tracking-wide uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{lang === 'ar' ? 'الجيل الثاني المبتكر' : 'Next-Gen Wearables'}</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-medium tracking-tight leading-[1.12] text-white">
            {lang === 'ar' ? (
              <>نظارات <span className="text-[#0091ff]">Ray-Ban Meta</span> الجديدة كلياً</>
            ) : (
              <>All-New <span className="text-[#0091ff]">Ray-Ban Meta</span> Collection</>
            )}
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-stone-200 leading-relaxed font-normal max-w-2xl">
            {lang === 'ar'
              ? 'التقط صوراً وفيديوهات من منظور عينيك، استمع لصوتك المفضل دون عزل محيطك، وتحدث مع الذكاء الاصطناعي Meta AI بطلاقة تامة بدون استخدام اليدين.'
              : 'Capture, listen, and speak naturally with multimodal Meta AI. Built for all-day wear with crystal-clear 12 MP optics and open-ear acoustic fidelity.'}
          </p>

          {/* Dual-CTA Pair: Black Primary (Marketing) + Outlined Ghost (Secondary) */}
          <div className="flex flex-wrap items-center gap-3.5 pt-2">
            <button
              onClick={onConfigureGlasses}
              className="px-8 py-3.5 rounded-full bg-[#000000] text-white hover:bg-[#444950] active:bg-[#444950] text-sm font-bold tracking-tight border border-stone-600/40 shadow-lg transition-all duration-200 cursor-pointer flex items-center gap-2"
            >
              <span>{lang === 'ar' ? 'اكتشف النظارات وقم بتهيئتها' : 'Configure Your Frames'}</span>
              {lang === 'ar' ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
            </button>

            <button
              onClick={onExploreProducts}
              className="px-7 py-3 rounded-full bg-white/10 hover:bg-white/20 active:bg-white/30 text-white border-2 border-white text-sm font-bold transition-all duration-200 cursor-pointer backdrop-blur-sm"
            >
              {lang === 'ar' ? 'استعراض كافة الأجهزة' : 'Explore All Hardware'}
            </button>
          </div>
        </div>
      </div>

      {/* 2. Reassurance "Why Buy from Meta" 4-Up Grid (why-buy-tile) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl sm:text-3xl font-medium tracking-tight text-[#0a1317]">
            {lang === 'ar' ? 'لماذا تشتري مباشرة من Meta؟' : 'Why buy from Meta'}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          
          <div className="bg-white rounded-[16px] p-6 border border-[#dee3e9] hover:border-[#ced0d4] transition-all space-y-3">
            <div className="w-11 h-11 rounded-full bg-[#f1f4f7] flex items-center justify-center text-[#0064e0]">
              <Truck className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-[#0a1317]">
              {lang === 'ar' ? 'شحن سريع ومجاني' : 'Free 2-Day Delivery'}
            </h3>
            <p className="text-sm text-[#5d6c7b] leading-relaxed">
              {lang === 'ar'
                ? 'توصيل مجاني مباشر إلى باب منزلك مع تتبع رقمي فوري للشحنة.'
                : 'Free priority shipping on all hardware orders with real-time package tracking.'}
            </p>
          </div>

          <div className="bg-white rounded-[16px] p-6 border border-[#dee3e9] hover:border-[#ced0d4] transition-all space-y-3">
            <div className="w-11 h-11 rounded-full bg-[#f1f4f7] flex items-center justify-center text-[#0064e0]">
              <RotateCcw className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-[#0a1317]">
              {lang === 'ar' ? 'إرجاع مجاني لمدة 30 يوماً' : '30-Day Free Returns'}
            </h3>
            <p className="text-sm text-[#5d6c7b] leading-relaxed">
              {lang === 'ar'
                ? 'جرب منتجك بكل ثقة مع إمكانية استرجاع واسترداد كامل للأموال بدون تعقيدات.'
                : 'Love your new device or send it back within 30 days with prepaid shipping.'}
            </p>
          </div>

          <div className="bg-white rounded-[16px] p-6 border border-[#dee3e9] hover:border-[#ced0d4] transition-all space-y-3">
            <div className="w-11 h-11 rounded-full bg-[#f1f4f7] flex items-center justify-center text-[#0064e0]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-[#0a1317]">
              {lang === 'ar' ? 'ضمان رسمي لعامين' : '2-Year Full Warranty'}
            </h3>
            <p className="text-sm text-[#5d6c7b] leading-relaxed">
              {lang === 'ar'
                ? 'حماية شاملة ضد عيوب التصنيع مع دعم فني احترافي متواصل على مدار الساعة.'
                : 'Comprehensive factory protection and 24/7 dedicated device specialists.'}
            </p>
          </div>

          <div className="bg-white rounded-[16px] p-6 border border-[#dee3e9] hover:border-[#ced0d4] transition-all space-y-3">
            <div className="w-11 h-11 rounded-full bg-[#f1f4f7] flex items-center justify-center text-[#0064e0]">
              <CreditCard className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-[#0a1317]">
              {lang === 'ar' ? 'تقسيط مرن بفائدة 0%' : 'Buy Now, Pay Later'}
            </h3>
            <p className="text-sm text-[#5d6c7b] leading-relaxed">
              {lang === 'ar'
                ? 'قسّم قيمة مشترياتك على دفعات شهرية ميسرة وبدون أي فوائد أو رسوم مخفية.'
                : 'Spread your purchase into low, zero-interest monthly payments at checkout.'}
            </p>
          </div>

        </div>
      </div>

      {/* 3. Quest Mixed Reality Strip Card (card-promo-strip) */}
      <div className="relative overflow-hidden rounded-[24px] sm:rounded-[32px] bg-[#0a1317] text-white p-8 sm:p-12 md:p-16 border border-stone-800">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-5">
            <span className="inline-block px-3 py-1 rounded-full bg-[#a121ce]/20 border border-[#a121ce]/40 text-[#d48aff] text-xs font-bold tracking-wide">
              {lang === 'ar' ? 'الواقع المختلط الحقيقي' : 'Pure Mixed Reality'}
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight text-white leading-tight">
              {lang === 'ar'
                ? 'حوّل مساحتك الحقيقية إلى عالم من الإمكانيات غير المحدودة'
                : 'Transform your living room into an infinite workspace and playground'}
            </h2>
            <p className="text-stone-300 text-base leading-relaxed">
              {lang === 'ar'
                ? 'مع نظارة Meta Quest 3S، ادمج شاشات العمل العملاقة الافتراضية، الألعاب التفاعلية ثلاثية الأبعاد، وتجارب الترفيه الغامرة في غرفتك مباشرة بدقة ألوان فائقة وبسعر لا يقاوم.'
                : 'With Meta Quest 3S, blend massive floating screens, high-octane gaming, and lifelike physical passthrough right where you stand — starting at just $299.'}
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <button
                onClick={onConfigureQuest}
                className="px-7 py-3.5 rounded-full bg-white text-[#0a1317] hover:bg-stone-200 active:bg-stone-300 font-bold text-sm tracking-tight transition-all cursor-pointer flex items-center gap-2"
              >
                <span>{lang === 'ar' ? 'اطلب خوذة Quest 3S الآن' : 'Shop Meta Quest 3S'}</span>
                {lang === 'ar' ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
              </button>
              <button
                onClick={onLearnMore}
                className="px-6 py-3 rounded-full bg-transparent text-white border border-stone-500 hover:bg-white/10 font-bold text-sm transition-all cursor-pointer"
              >
                {lang === 'ar' ? 'المواصفات والتقنيات' : 'View Specifications'}
              </button>
            </div>
          </div>

          <div className="relative flex items-center justify-center">
            <img
              src="https://images.unsplash.com/photo-1622979135225-d2ba269bc1df?auto=format&fit=crop&w=1000&q=80"
              alt="Meta Quest 3S Headset"
              className="w-full max-w-md h-auto object-cover rounded-[24px] shadow-2xl transition-transform duration-500 hover:scale-105"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </div>

      {/* 4. Three-Up Feature Pillars Card (card-feature-photo & card-product-feature) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div className="bg-white rounded-[24px] sm:rounded-[32px] p-8 border border-[#dee3e9] flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-full bg-[#f1f4f7] flex items-center justify-center text-[#0064e0]">
              <Video className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-medium tracking-tight text-[#0a1317]">
              {lang === 'ar' ? 'تسجيل فوري من مستوى الرؤية' : 'Point-of-View Capture'}
            </h3>
            <p className="text-sm text-[#444950] leading-relaxed">
              {lang === 'ar'
                ? 'التقط أروع اللحظات العائلية والمغامرات دون الحاجة لإخراج هاتفك من جيبك بدقة 1080p مذهلة.'
                : 'Capture concerts, cook-offs, and mountain hikes without taking out your phone.'}
            </p>
          </div>
          <div className="pt-2">
            <span className="text-xs font-bold text-[#0064e0] inline-flex items-center gap-1">
              {lang === 'ar' ? 'كاميرا فائقة الاتساع 12MP' : '12 MP Ultra-Wide Sensor'}
            </span>
          </div>
        </div>

        <div className="bg-white rounded-[24px] sm:rounded-[32px] p-8 border border-[#dee3e9] flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-full bg-[#f1f4f7] flex items-center justify-center text-[#0064e0]">
              <Volume2 className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-medium tracking-tight text-[#0a1317]">
              {lang === 'ar' ? 'صوت مفتوح الأذن لا يعزلك' : 'Open-Ear Acoustic Power'}
            </h3>
            <p className="text-sm text-[#444950] leading-relaxed">
              {lang === 'ar'
                ? 'مكبرات صوتية موجهة تصب في أذنيك بجهير مضاعف مع الحفاظ على وعيك الكامل بما يدور حولك.'
                : 'Directional acoustic speakers provide deep rich bass while keeping you connected to surroundings.'}
            </p>
          </div>
          <div className="pt-2">
            <span className="text-xs font-bold text-[#0064e0] inline-flex items-center gap-1">
              {lang === 'ar' ? '5 ميكروفونات لتصفية الرياح' : '5-Mic Wind Noise Reduction'}
            </span>
          </div>
        </div>

        <div className="bg-white rounded-[24px] sm:rounded-[32px] p-8 border border-[#dee3e9] flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-full bg-[#f1f4f7] flex items-center justify-center text-[#0064e0]">
              <Eye className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-medium tracking-tight text-[#0a1317]">
              {lang === 'ar' ? 'مساعد ذكي يرى ما تراه' : 'Multimodal Vision AI'}
            </h3>
            <p className="text-sm text-[#444950] leading-relaxed">
              {lang === 'ar'
                ? 'قل "Hey Meta, look and tell me..." وسيقوم الذكاء الاصطناعي بتحليل الأشياء وقراءة اللافتات فورياً.'
                : 'Ask questions about landmark monuments, translate multilingual menus, and draft messages.'}
            </p>
          </div>
          <div className="pt-2">
            <span className="text-xs font-bold text-[#0064e0] inline-flex items-center gap-1">
              {lang === 'ar' ? 'مدعوم بنماذج Llama 3' : 'Powered by Meta AI Engine'}
            </span>
          </div>
        </div>

      </div>

    </section>
  );
};
