import React, { useState } from 'react';
import { Mail, MessageSquare, Phone, ChevronDown, CheckCircle2, AlertCircle, Send } from 'lucide-react';
import { Language } from '../types';
import { FAQS } from '../data/products';

interface ContactSectionProps {
  lang: Language;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ lang }) => {
  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    topic: 'sales',
    message: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // FAQ accordion state
  const [openFaqId, setOpenFaqId] = useState<string | null>('faq-1');

  const toggleFaq = (id: string) => {
    setOpenFaqId((prev) => (prev === id ? null : id));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.fullName.trim()) {
      newErrors.fullName = lang === 'ar' ? 'يرجى إدخال الاسم الكامل' : 'Full name is required';
    }
    if (!formData.email.trim()) {
      newErrors.email = lang === 'ar' ? 'يرجى إدخال البريد الإلكتروني' : 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = lang === 'ar' ? 'صيغة البريد الإلكتروني غير صحيحة' : 'Please enter a valid email';
    }
    if (!formData.message.trim() || formData.message.length < 10) {
      newErrors.message =
        lang === 'ar'
          ? 'يرجى كتابة رسالتك بحد أدنى 10 أحرف'
          : 'Please provide a message with at least 10 characters';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormData({ fullName: '', email: '', topic: 'sales', message: '' });
    }, 600);
  };

  return (
    <section className="space-y-16 pb-16">
      
      {/* Title & Introduction */}
      <div className="max-w-3xl space-y-3">
        <h2 className="text-3xl sm:text-4xl font-medium tracking-tight text-[#0a1317]">
          {lang === 'ar' ? 'تواصل مع فريق خبراء Meta' : 'Connect with Meta Hardware Support'}
        </h2>
        <p className="text-base text-[#5d6c7b] leading-relaxed">
          {lang === 'ar'
            ? 'سواء كنت تستفسر عن توفر المنتجات، المواصفات التقنية، أو تحتاج إلى مساعدة بخصوص طلبك، نحن هنا لمساعدتك.'
            : 'Whether you have questions regarding device specs, orders, or developer SDKs, our specialists are ready.'}
        </p>
      </div>

      {/* 3 Contact Direct Channels */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        
        <div className="bg-white rounded-[16px] p-6 border border-[#dee3e9] space-y-3">
          <div className="w-10 h-10 rounded-full bg-[#f1f4f7] flex items-center justify-center text-[#0064e0]">
            <MessageSquare className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-[#0a1317]">
            {lang === 'ar' ? 'المحادثة الحية المباشرة' : 'Live Chat Specialist'}
          </h3>
          <p className="text-xs text-[#5d6c7b]">
            {lang === 'ar'
              ? 'تحدث مع أخصائي مبيعات وتقنية متاح 24/7 للرد الفوري.'
              : 'Chat directly with our hardware experts 24 hours a day, 7 days a week.'}
          </p>
          <span className="inline-block text-xs font-bold text-[#0064e0]">
            {lang === 'ar' ? 'متوسط الرد: دقيقة واحدة' : 'Average wait: < 1 min'}
          </span>
        </div>

        <div className="bg-white rounded-[16px] p-6 border border-[#dee3e9] space-y-3">
          <div className="w-10 h-10 rounded-full bg-[#f1f4f7] flex items-center justify-center text-[#0064e0]">
            <Phone className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-[#0a1317]">
            {lang === 'ar' ? 'الدعم الهاتفي للطلبات' : 'Phone Order Inquiries'}
          </h3>
          <p className="text-xs text-[#5d6c7b]">
            {lang === 'ar'
              ? 'اتصل بفريق المبيعات للاستفسارات عن التوصيل والضمان.'
              : 'Call our device support desk for delivery status and corporate quotes.'}
          </p>
          <span className="inline-block text-xs font-bold text-[#0a1317] dir-ltr font-mono">
            +1 (800) 555-META
          </span>
        </div>

        <div className="bg-white rounded-[16px] p-6 border border-[#dee3e9] space-y-3">
          <div className="w-10 h-10 rounded-full bg-[#f1f4f7] flex items-center justify-center text-[#0064e0]">
            <Mail className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-[#0a1317]">
            {lang === 'ar' ? 'البريد الإلكتروني المباشر' : 'Direct Email Desk'}
          </h3>
          <p className="text-xs text-[#5d6c7b]">
            {lang === 'ar'
              ? 'أرسل لنا استفساراتك التفصيلية واستلم رداً خلال ساعات.'
              : 'Submit detailed inquiries and receive response within 4 hours.'}
          </p>
          <span className="inline-block text-xs font-bold text-[#0064e0] font-mono">
            support@meta-hardware.com
          </span>
        </div>

      </div>

      {/* Contact Form + Map/Info Split Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Form Container (lg:col-span-7) */}
        <div className="lg:col-span-7 bg-white rounded-[24px] sm:rounded-[32px] p-6 sm:p-10 border border-[#dee3e9] shadow-xs">
          
          {isSubmitted ? (
            <div className="text-center py-10 space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#31a24c]/15 text-[#31a24c] flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-[#0a1317]">
                {lang === 'ar' ? 'تم إرسال رسالتك بنجاح!' : 'Message Sent Successfully!'}
              </h3>
              <p className="text-sm text-[#5d6c7b] max-w-md mx-auto leading-relaxed">
                {lang === 'ar'
                  ? 'شكراً لتواصلك معنا. قام نظامنا بتسجيل تذكرتك وسيقوم أحد ممثلي الدعم بالتواصل معك على بريدك الإلكتروني قريباً.'
                  : 'Thank you for reaching out. A hardware specialist will follow up via your email within 4 hours.'}
              </p>
              <button
                onClick={() => setIsSubmitted(false)}
                className="mt-4 px-6 py-2.5 rounded-full bg-[#0a1317] text-white text-xs font-bold cursor-pointer hover:bg-[#444950]"
              >
                {lang === 'ar' ? 'إرسال استفسار آخر' : 'Send Another Inquiry'}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              <div>
                <h3 className="text-xl font-bold text-[#0a1317]">
                  {lang === 'ar' ? 'أرسل لنا رسالة مباشرة' : 'Send an Inquiry'}
                </h3>
                <p className="text-xs text-[#5d6c7b] mt-0.5">
                  {lang === 'ar'
                    ? 'املأ الحقول التالية وسيتولى فريقنا الرد عليك في أسرع وقت.'
                    : 'Fill in the fields below and our hardware team will reach out.'}
                </p>
              </div>

              {/* Full Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#0a1317] block">
                  {lang === 'ar' ? 'الاسم الكامل *' : 'Full Name *'}
                </label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => {
                    setFormData({ ...formData, fullName: e.target.value });
                    if (errors.fullName) setErrors({ ...errors, fullName: '' });
                  }}
                  placeholder={lang === 'ar' ? 'مثال: محمد عبدالله' : 'e.g. Alex Morgan'}
                  className={`w-full h-11 px-3.5 rounded-[8px] text-sm text-[#1c1e21] bg-white transition-all focus:outline-none ${
                    errors.fullName
                      ? 'border border-[#f0284a] focus:ring-1 focus:ring-[#f0284a]'
                      : 'border border-[#ced0d4] focus:border-[#1876f2] focus:ring-1 focus:ring-[#1876f2]'
                  }`}
                />
                {errors.fullName && (
                  <div className="flex items-center gap-1 text-[11px] text-[#f0284a] font-medium pt-0.5">
                    <AlertCircle className="w-3 h-3" />
                    <span>{errors.fullName}</span>
                  </div>
                )}
              </div>

              {/* Email Address */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#0a1317] block">
                  {lang === 'ar' ? 'البريد الإلكتروني *' : 'Email Address *'}
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => {
                    setFormData({ ...formData, email: e.target.value });
                    if (errors.email) setErrors({ ...errors, email: '' });
                  }}
                  placeholder="name@example.com"
                  className={`w-full h-11 px-3.5 rounded-[8px] text-sm text-[#1c1e21] bg-white transition-all focus:outline-none ${
                    errors.email
                      ? 'border border-[#f0284a] focus:ring-1 focus:ring-[#f0284a]'
                      : 'border border-[#ced0d4] focus:border-[#1876f2] focus:ring-1 focus:ring-[#1876f2]'
                  }`}
                />
                {errors.email && (
                  <div className="flex items-center gap-1 text-[11px] text-[#f0284a] font-medium pt-0.5">
                    <AlertCircle className="w-3 h-3" />
                    <span>{errors.email}</span>
                  </div>
                )}
              </div>

              {/* Topic Select */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#0a1317] block">
                  {lang === 'ar' ? 'نوع الاستفسار' : 'Inquiry Topic'}
                </label>
                <select
                  value={formData.topic}
                  onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                  className="w-full h-11 px-3.5 rounded-[8px] text-sm text-[#1c1e21] bg-white border border-[#ced0d4] focus:border-[#1876f2] focus:outline-none transition-all cursor-pointer"
                >
                  <option value="sales">
                    {lang === 'ar' ? 'استفسار عن الشراء والطلبات' : 'Sales & Orders'}
                  </option>
                  <option value="technical">
                    {lang === 'ar' ? 'الدعم الفني وتحديثات البرامج' : 'Technical & Firmware Support'}
                  </option>
                  <option value="warranty">
                    {lang === 'ar' ? 'الضمان والاستبدال' : 'Warranty & Replacements'}
                  </option>
                  <option value="business">
                    {lang === 'ar' ? 'طلبات الشركات والمؤسسات' : 'Enterprise & Bulk Inquiries'}
                  </option>
                </select>
              </div>

              {/* Message */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#0a1317] block">
                  {lang === 'ar' ? 'نص الرسالة *' : 'Your Message *'}
                </label>
                <textarea
                  rows={4}
                  value={formData.message}
                  onChange={(e) => {
                    setFormData({ ...formData, message: e.target.value });
                    if (errors.message) setErrors({ ...errors, message: '' });
                  }}
                  placeholder={
                    lang === 'ar'
                      ? 'اكتب استفسارك بالتفصيل وسنسعد بالإجابة عليك...'
                      : 'Please describe your request in detail...'
                  }
                  className={`w-full p-3.5 rounded-[8px] text-sm text-[#1c1e21] bg-white transition-all focus:outline-none resize-none ${
                    errors.message
                      ? 'border border-[#f0284a] focus:ring-1 focus:ring-[#f0284a]'
                      : 'border border-[#ced0d4] focus:border-[#1876f2] focus:ring-1 focus:ring-[#1876f2]'
                  }`}
                />
                {errors.message && (
                  <div className="flex items-center gap-1 text-[11px] text-[#f0284a] font-medium pt-0.5">
                    <AlertCircle className="w-3 h-3" />
                    <span>{errors.message}</span>
                  </div>
                )}
              </div>

              {/* Submit Button (button-primary in Black Pill) */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#000000] text-white hover:bg-[#444950] active:bg-[#444950] text-sm font-bold tracking-tight shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <span>{lang === 'ar' ? 'جاري الإرسال...' : 'Sending...'}</span>
                ) : (
                  <>
                    <span>{lang === 'ar' ? 'إرسال الرسالة الآن' : 'Submit Message'}</span>
                    <Send className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>
          )}

        </div>

        {/* FAQ Accordion Section (lg:col-span-5) */}
        <div className="lg:col-span-5 space-y-4">
          <div>
            <h3 className="text-2xl font-medium tracking-tight text-[#0a1317]">
              {lang === 'ar' ? 'الأسئلة الشائعة (FAQ)' : 'Frequently Asked Questions'}
            </h3>
            <p className="text-xs text-[#5d6c7b] mt-1">
              {lang === 'ar'
                ? 'إجابات مباشرة على أكثر الاستفسارات تكراراً حول الأجهزة'
                : 'Instant answers regarding compatibility, battery, and optics.'}
            </p>
          </div>

          <div className="space-y-3">
            {FAQS.map((faq) => {
              const isOpen = openFaqId === faq.id;
              return (
                <div
                  key={faq.id}
                  className="bg-white rounded-[16px] border border-[#dee3e9] overflow-hidden transition-all duration-200"
                >
                  <button
                    onClick={() => toggleFaq(faq.id)}
                    className="w-full p-4 sm:p-5 text-start flex items-center justify-between gap-3 cursor-pointer hover:bg-[#f1f4f7] transition-colors"
                  >
                    <span className="text-sm font-bold text-[#0a1317] leading-snug">
                      {lang === 'ar' ? faq.question : faq.questionEn}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-[#5d6c7b] shrink-0 transition-transform duration-300 ${
                        isOpen ? 'rotate-180 text-[#0064e0]' : ''
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-[#444950] leading-relaxed border-t border-[#dee3e9]/60">
                      {lang === 'ar' ? faq.answer : faq.answerEn}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>

    </section>
  );
};
