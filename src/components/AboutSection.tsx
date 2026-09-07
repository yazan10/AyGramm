import React, { useState } from 'react';
import { Shield, Sparkles, Star, Cpu, Eye, Radio, Lock } from 'lucide-react';
import { Language } from '../types';
import { TESTIMONIALS, PRODUCTS } from '../data/products';

interface AboutSectionProps {
  lang: Language;
  onExploreProducts: () => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ lang, onExploreProducts }) => {
  const [activeSpecProduct, setActiveSpecProduct] = useState<'glasses' | 'vr'>('glasses');

  const selectedSpecProduct = activeSpecProduct === 'glasses' ? PRODUCTS[0] : PRODUCTS[1];

  return (
    <section className="space-y-16 pb-16">
      
      {/* 1. Meta Hardware Vision Header */}
      <div className="max-w-4xl space-y-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#f1f4f7] border border-[#dee3e9] text-xs font-bold text-[#0064e0]">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{lang === 'ar' ? 'مستقبل التفاعل البشري الرقمي' : 'The Future of Spatial Computing'}</span>
        </div>

        <h2 className="text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight text-[#0a1317] leading-tight">
          {lang === 'ar' ? (
            <>نبني تقنيات تقرب بين الناس ولا تبعدهم عن العالم الواقعي</>
          ) : (
            <>Hardware engineered to keep you connected to your physical world</>
          )}
        </h2>

        <p className="text-base sm:text-lg text-[#444950] leading-relaxed">
          {lang === 'ar'
            ? 'في Meta، نؤمن بأن الأجهزة الذكية يجب أن تكون سلسة وغير مرئية قدر الإمكان. من نظارات Ray-Ban الذكية التي تتيح لك توثيق لحظاتك دون حواجز الشاشات الزجاجية، إلى خوذات Meta Quest التي تمزج الواقع الافتراضي بغرفتك الحقيقية — نحن نبتكر أدوات المستقبل اليوم.'
            : 'We envision a reality where technology disappears into everyday objects. From Ray-Ban Meta glasses that keep you immersed in real conversations to Quest 3S mixed reality headsets that bring expansive virtual monitors into physical rooms.'}
        </p>
      </div>

      {/* 2. Core Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div className="bg-white rounded-[24px] p-8 border border-[#dee3e9] space-y-4">
          <div className="w-12 h-12 rounded-full bg-[#0064e0]/10 flex items-center justify-center text-[#0064e0]">
            <Cpu className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-[#0a1317]">
            {lang === 'ar' ? 'معالجة ذكية على الجهاز' : 'On-Device Intelligence'}
          </h3>
          <p className="text-sm text-[#5d6c7b] leading-relaxed">
            {lang === 'ar'
              ? 'معالجات Snapdragon الرائدة المصممة خصيصاً للحوسبة المكانية والنظارات الذكية تقدم سرعة فائقة مع استهلاك طاقة بالغ الضآلة.'
              : 'Dedicated Qualcomm Snapdragon platforms engineered specifically for real-time spatial computing and ultra-low power consumption.'}
          </p>
        </div>

        <div className="bg-white rounded-[24px] p-8 border border-[#dee3e9] space-y-4">
          <div className="w-12 h-12 rounded-full bg-[#0064e0]/10 flex items-center justify-center text-[#0064e0]">
            <Lock className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-[#0a1317]">
            {lang === 'ar' ? 'الخصوصية والأمان المدمج' : 'Privacy by Design'}
          </h3>
          <p className="text-sm text-[#5d6c7b] leading-relaxed">
            {lang === 'ar'
              ? 'مؤشرات LED خارجية ساطعة ومستشعرات أمان مشفرة تضمن إشعار المحيطين بك دائماً عند تشغيل الكاميرا وحماية بياناتك الحيوية.'
              : 'Hardware-level, tamper-proof privacy capture LEDs and encrypted biometric telemetry ensure transparency and personal data safety.'}
          </p>
        </div>

        <div className="bg-white rounded-[24px] p-8 border border-[#dee3e9] space-y-4">
          <div className="w-12 h-12 rounded-full bg-[#0064e0]/10 flex items-center justify-center text-[#0064e0]">
            <Radio className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-[#0a1317]">
            {lang === 'ar' ? 'صوت مكاني وبصريات طبيعية' : 'Natural Spatial Audio'}
          </h3>
          <p className="text-sm text-[#5d6c7b] leading-relaxed">
            {lang === 'ar'
              ? 'مكبرات صوتية اتجاهية مفتوحة الأذن تتيح لك الاستماع إلى المكالمات والموسيقى وتوجيهات الذكاء الاصطناعي مع بقاء أذنيك مفتوحتين تماماً.'
              : 'Open-ear directional acoustics project high-fidelity sound directly into your ear canals without physically blocking the ambient world.'}
          </p>
        </div>

      </div>

      {/* 3. Tech Specs Table (tech-specs-table) */}
      <div className="bg-white rounded-[24px] sm:rounded-[32px] p-6 sm:p-10 border border-[#dee3e9] space-y-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-2xl font-medium tracking-tight text-[#0a1317]">
              {lang === 'ar' ? 'المواصفات التقنية التفصيلية' : 'Technical Specifications'}
            </h3>
            <p className="text-sm text-[#5d6c7b] mt-1">
              {lang === 'ar'
                ? 'استعرض تفاصيل العتاد والمكونات الدقيقة لكل فئة من أجهزتنا'
                : 'Examine detailed hardware components, sensors, and platform standards.'}
            </p>
          </div>

          {/* Device Toggle Tabs */}
          <div className="inline-flex p-1 rounded-full bg-[#f1f4f7] border border-[#ced0d4]">
            <button
              onClick={() => setActiveSpecProduct('glasses')}
              className={`px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeSpecProduct === 'glasses'
                  ? 'bg-[#0a1317] text-white shadow-xs'
                  : 'text-[#1c1e21] hover:text-[#0064e0]'
              }`}
            >
              Ray-Ban Meta
            </button>
            <button
              onClick={() => setActiveSpecProduct('vr')}
              className={`px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeSpecProduct === 'vr'
                  ? 'bg-[#0a1317] text-white shadow-xs'
                  : 'text-[#1c1e21] hover:text-[#0064e0]'
              }`}
            >
              Meta Quest 3S
            </button>
          </div>
        </div>

        {/* Two-Column Key/Value Specs Table */}
        <div className="divide-y divide-[#dee3e9] border-y border-[#dee3e9]">
          {selectedSpecProduct.specs.map((spec, index) => (
            <div key={index} className="py-4.5 grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4 items-center">
              <span className="text-xs sm:text-sm font-bold text-[#0a1317]">
                {lang === 'ar' ? spec.label : spec.labelEn}
              </span>
              <span className="sm:col-span-2 text-xs sm:text-sm text-[#444950] leading-relaxed">
                {lang === 'ar' ? spec.value : spec.valueEn}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Customer Testimonials (testimonial-customer-card) */}
      <div className="space-y-6">
        <div>
          <h3 className="text-2xl sm:text-3xl font-medium tracking-tight text-[#0a1317]">
            {lang === 'ar' ? 'ماذا يقول مجتمع مستخدمي أجهزة Meta؟' : 'Stories from the Meta Community'}
          </h3>
          <p className="text-sm text-[#5d6c7b] mt-1">
            {lang === 'ar'
              ? 'تجارب واقعية من صناع محتوى، باحثين، وعشاق التكنولوجيا حول العالم'
              : 'Real experiences from creators, gamers, and researchers living with our hardware.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t) => (
            <div
              key={t.id}
              className="bg-white rounded-[16px] p-6 sm:p-8 border border-[#dee3e9] flex flex-col justify-between space-y-6 shadow-xs hover:border-[#ced0d4] transition-all"
            >
              <div className="space-y-4">
                {/* 5-Star Rating */}
                <div className="flex items-center gap-1 text-[#f7b928]">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>

                <p className="text-sm text-[#1c1e21] leading-relaxed italic">
                  "{lang === 'ar' ? t.quote : t.quoteEn}"
                </p>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-[#dee3e9]">
                <img
                  src={t.avatar}
                  alt={lang === 'ar' ? t.name : t.nameEn}
                  className="w-10 h-10 rounded-full object-cover border border-[#dee3e9]"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <h4 className="text-sm font-bold text-[#0a1317]">
                    {lang === 'ar' ? t.name : t.nameEn}
                  </h4>
                  <span className="text-xs text-[#5d6c7b]">
                    {lang === 'ar' ? t.role : t.roleEn}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Warranty & Peace of Mind Card (warranty-card) */}
      <div className="bg-[#f1f4f7] rounded-[24px] p-8 sm:p-10 border border-[#dee3e9] flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 rounded-full bg-[#0064e0] text-white flex items-center justify-center shrink-0 shadow-md">
            <Shield className="w-7 h-7" />
          </div>
          <div>
            <h4 className="text-xl font-bold text-[#0a1317]">
              {lang === 'ar' ? 'ضمان رسمي شامل لمدة عامين ودعم فني مخصص' : '2-Year Official Warranty & Dedicated Care'}
            </h4>
            <p className="text-xs sm:text-sm text-[#5d6c7b] mt-1 max-w-2xl leading-relaxed">
              {lang === 'ar'
                ? 'كل جهاز تشتريه يشمل ضماناً رسمياً يغطي العيوب الفنية واستبدالاً فورياً عند الحاجة، مع تحديثات برمجية مجانية مستمرة تضيف مميزات ذكاء اصطناعي جديدة شهرياً.'
                : 'Every hardware device includes a comprehensive 2-year warranty, priority hardware swaps, and regular over-the-air firmware updates.'}
            </p>
          </div>
        </div>

        <button
          onClick={onExploreProducts}
          className="px-6 py-3 rounded-full bg-[#0a1317] text-white hover:bg-[#444950] font-bold text-xs sm:text-sm whitespace-nowrap cursor-pointer transition-all shrink-0"
        >
          {lang === 'ar' ? 'تسوق الأجهزة المضمونة' : 'Browse Guaranteed Devices'}
        </button>
      </div>

    </section>
  );
};
