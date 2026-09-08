import React, { useState } from 'react';
import {
  User as UserIcon,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  Globe,
  Languages,
  Coins,
  ShieldCheck,
  Sparkles,
  X
} from 'lucide-react';
import { useAyGram } from '../context/AyGramContext';
import { AyGramLogo } from './AyGramLogo';
import { WORLD_COUNTRIES, WORLD_LANGUAGES, WORLD_CURRENCIES } from '../data/worldData';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'signup';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'login',
}) => {
  const { login, signup, requestPasswordReset, setActiveView } = useAyGram();
  const [mode, setMode] = useState<'login' | 'signup' | 'forgot'>(initialMode);

  // Sign up fields
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [nationality, setNationality] = useState('سعودي');
  const [language, setLanguage] = useState('العربية');
  const [currency, setCurrency] = useState('SAR');
  const [showPassword, setShowPassword] = useState(false);

  // Forgot password & Identity Proof
  const [forgotUsername, setForgotUsername] = useState('');
  const [forgotContact, setForgotContact] = useState('');
  const [proofDetails, setProofDetails] = useState('');
  const [desiredPassword, setDesiredPassword] = useState('');
  const [isSubmittingReset, setIsSubmittingReset] = useState(false);

  // Feedback states
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [usernameWarning, setUsernameWarning] = useState('');
  const [suggestedUsername, setSuggestedUsername] = useState('');

  if (!isOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!username.trim() || !password) {
      setError('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    const res = login(username.trim(), password);
    if (res.success) {
      if (password === 'jana@#5Y' || ['y', 'admin', 'owner', 'yazan', 'يزن'].includes(username.trim().toLowerCase())) {
        setActiveView('admin');
      }
      onClose();
    } else {
      setError(res.error || 'فشل تسجيل الدخول');
    }
  };

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const trimmedFullName = fullName.trim();
    const trimmedUsername = username.trim();

    if (!trimmedFullName) {
      setError('يرجى كتابة الاسم الكامل');
      return;
    }

    if (!trimmedUsername || trimmedUsername.length < 1) {
      setError('يرجى إدخال اسم مستخدم (يمكن أن يتكون من حرف واحد على الأقل)');
      return;
    }

    if (!password || password.length < 4) {
      setError('كلمة المرور يجب ألا تقل عن 4 أحرف أو أرقام');
      return;
    }

    if (password !== confirmPassword) {
      setError('كلمتا المرور غير متطابقتين');
      return;
    }

    if (!acceptTerms) {
      setError('يجب أن تقرأ شروط التسجيل والمنصة وتوافق عليها قبل إنشاء الحساب');
      return;
    }

    const res = signup({
      fullName: trimmedFullName,
      username: trimmedUsername,
      password,
      nationality,
      language,
      currency
    });

    if (res.success) {
      if (res.suggestedUsername) {
        setSuggestedUsername(res.suggestedUsername);
        setSuccessMsg('تم حجز اليوزر! استخدم اليوزر المؤقت: ' + res.suggestedUsername);
        setTimeout(() => {
          onClose();
        }, 3000);
      } else {
        setSuccessMsg('تم إنشاء حسابك المبارك بنجاح!');
        setTimeout(() => {
          onClose();
        }, 1000);
      }
    } else {
      setError(res.error || 'فشل إنشاء الحساب');
    }
  };

  const handleResetPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const cleanUser = forgotUsername.trim().replace(/^@/, '');
    if (!cleanUser) {
      setError('يرجى إدخال اسم المستخدم الخاص بحسابك');
      return;
    }
    if (!proofDetails.trim() || proofDetails.trim().length < 5) {
      setError('يرجى تقديم تفاصيل إثبات وتأكيد هوية امتلاك الحساب للمراجعة والاعتماد');
      return;
    }

    setIsSubmittingReset(true);
    const res = requestPasswordReset({
      username: cleanUser,
      contactInfo: forgotContact.trim(),
      proofDetails: proofDetails.trim(),
      newPassword: desiredPassword ? desiredPassword : undefined,
    });
    setIsSubmittingReset(false);

    if (res.success) {
      setSuccessMsg('تم إرسال طلب استعادة الحساب وتأكيد الملكية للإدارة بنجاح! سيتم مراجعة هويتك واعتماد التعيين.');
      setTimeout(() => {
        setMode('login');
        setSuccessMsg('');
        setForgotUsername('');
        setForgotContact('');
        setProofDetails('');
        setDesiredPassword('');
      }, 3500);
    } else {
      setError(res.error || 'تعذر إرسال طلب استعادة الحساب');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="ayg-auth-page bg-[#FCF9F0] rounded-[20px] max-w-lg w-full p-6 sm:p-8 shadow-aygram-md border border-[#EFE9D9] relative text-[#1A1A1A] my-8">
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 start-4 p-1.5 rounded-full text-[#7A7A7A] hover:text-[#0F3D2E] hover:bg-[#EFE9D9]/50 transition-colors"
          title="إغلاق"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Centered Logo */}
        <div className="flex flex-col items-center justify-center mb-5">
          <AyGramLogo onSecretTrigger={() => {}} size="lg" />
        </div>

        {/* Error / Success Banners */}
        {error && (
          <div className="mb-4 p-3 rounded-[12px] bg-[#E8B4B8]/30 border border-[#E8B4B8] text-xs font-bold text-[#801824] flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-[#801824] shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="mb-4 p-3 rounded-[12px] bg-[#0F3D2E]/10 border border-[#0F3D2E]/30 text-xs font-bold text-[#0F3D2E] flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#0F3D2E] shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* 1. LOGIN FORM */}
        {mode === 'login' && (
          <div className="space-y-4">
            <div className="text-center">
              <h2 className="text-xl font-bold text-[#0F3D2E]">
                تسجيل الدخول
              </h2>
              <p className="text-xs text-[#7A7A7A] mt-1">
                أهلاً بك مجدداً في واحة AyGram النقية
              </p>
            </div>

            <form onSubmit={handleLoginSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-[#1A1A1A] mb-1">
                  اسم المستخدم
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="مثال: ahmad_nour أو أي اسم مستخدم"
                    className="w-full py-2.5 px-3.5 pe-10 rounded-[12px] bg-white border border-[#EFE9D9] text-sm focus:outline-none focus:border-[#0F3D2E] focus:ring-1 focus:ring-[#0F3D2E]"
                    required
                  />
                  <UserIcon className="w-4 h-4 text-[#7A7A7A] absolute end-3.5 top-3" />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-[#1A1A1A]">
                    كلمة المرور
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setMode('forgot');
                      setError('');
                    }}
                    className="text-[11px] font-medium text-[#D4AF37] hover:underline"
                  >
                    نسيت كلمة المرور؟
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full py-2.5 px-3.5 pe-10 rounded-[12px] bg-white border border-[#EFE9D9] text-sm focus:outline-none focus:border-[#0F3D2E] focus:ring-1 focus:ring-[#0F3D2E]"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute end-3.5 top-3 text-[#7A7A7A] hover:text-[#1A1A1A]"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 rounded-[12px] bg-[#0F3D2E] text-white font-bold text-sm shadow-aygram hover:bg-[#155A44] transition-all cursor-pointer mt-2"
              >
                دخول إلى الحساب
              </button>
            </form>

            <div className="pt-3 text-center border-t border-[#EFE9D9]">
              <p className="text-xs text-[#7A7A7A]">
                ليس لديك حساب بعد؟{' '}
                <button
                  onClick={() => {
                    setMode('signup');
                    setError('');
                  }}
                  className="font-bold text-[#0F3D2E] hover:text-[#D4AF37] transition-colors"
                >
                  إنشاء حساب جديد بدون شروط
                </button>
              </p>
            </div>
          </div>
        )}

        {/* 2. SIGNUP FORM */}
        {mode === 'signup' && (
          <div className="space-y-4">
            <div className="text-center">
              <h2 className="text-xl font-bold text-[#0F3D2E] flex items-center justify-center gap-1.5">
                <Sparkles className="w-5 h-5 text-[#D4AF37]" />
                إنشاء حساب جديد
              </h2>
              <p className="text-xs text-[#7A7A7A] mt-1">
                تسجيل فوري بدون الحاجة لربط بريد إلكتروني أو رقم جوال 🛡️
              </p>
            </div>

            <div className="bg-[#EAE4D3]/40 p-2.5 rounded-[12px] border border-[#EFE9D9] flex items-center gap-2 text-xs text-[#0F3D2E]">
              <ShieldCheck className="w-4 h-4 text-[#D4AF37] shrink-0" />
              <span>خصوصية تامة: اسمك وبياناتك محفوظة، واسم المستخدم يقبل أي طول حتى حرف واحد!</span>
            </div>

            <form onSubmit={handleSignupSubmit} className="space-y-3">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-[#1A1A1A] mb-1">
                  الاسم الكامل <span className="text-[#D4AF37]">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="مثال: عبد الله بن عبد العزيز"
                    className="w-full py-2 px-3.5 pe-10 rounded-[12px] bg-white border border-[#EFE9D9] text-sm focus:outline-none focus:border-[#0F3D2E] focus:ring-1 focus:ring-[#0F3D2E]"
                    required
                  />
                  <UserIcon className="w-4 h-4 text-[#7A7A7A] absolute end-3.5 top-2.5" />
                </div>
              </div>

              {/* Username (can be 1 char, unique) */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-[#1A1A1A]">
                    اسم المستخدم <span className="text-[#D4AF37]">*</span>
                  </label>
                  <span className="text-[10px] text-[#7A7A7A]">يقبل من حرف واحد (فريد)</span>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="مثال: نور أو a หรือ 7"
                    className="w-full py-2 px-3.5 pe-10 rounded-[12px] bg-white border border-[#EFE9D9] text-sm focus:outline-none focus:border-[#0F3D2E] focus:ring-1 focus:ring-[#0F3D2E]"
                    required
                  />
                  <span className="absolute end-3.5 top-2 text-xs font-bold text-[#7A7A7A]">@</span>
                </div>
              </div>

              {/* Grid for Nationality, Language, Currency */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {/* Nationality */}
                <div>
                  <label className="block text-xs font-bold text-[#1A1A1A] mb-1 flex items-center gap-1">
                    <Globe className="w-3.5 h-3.5 text-[#0F3D2E]" />
                    الجنسية
                  </label>
                  <select
                    value={nationality}
                    onChange={(e) => setNationality(e.target.value)}
                    className="w-full py-2 px-2.5 rounded-[12px] bg-white border border-[#EFE9D9] text-xs focus:outline-none focus:border-[#0F3D2E]"
                  >
                    {WORLD_COUNTRIES.map((c) => (
                      <option key={c.code} value={c.nationality}>
                        {c.flag} {c.nationality} ({c.name})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Language */}
                <div>
                  <label className="block text-xs font-bold text-[#1A1A1A] mb-1 flex items-center gap-1">
                    <Languages className="w-3.5 h-3.5 text-[#0F3D2E]" />
                    اللغة
                  </label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full py-2 px-2.5 rounded-[12px] bg-white border border-[#EFE9D9] text-xs focus:outline-none focus:border-[#0F3D2E]"
                  >
                    {WORLD_LANGUAGES.map((l) => (
                      <option key={l.code} value={l.name}>
                        {l.nativeName} ({l.name})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Currency */}
                <div>
                  <label className="block text-xs font-bold text-[#1A1A1A] mb-1 flex items-center gap-1">
                    <Coins className="w-3.5 h-3.5 text-[#0F3D2E]" />
                    العملة
                  </label>
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="w-full py-2 px-2.5 rounded-[12px] bg-white border border-[#EFE9D9] text-xs focus:outline-none focus:border-[#0F3D2E]"
                  >
                    {WORLD_CURRENCIES.map((cur) => (
                      <option key={cur.code} value={cur.code}>
                        {cur.code} - {cur.name} ({cur.symbol})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Password */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-bold text-[#1A1A1A] mb-1">
                    كلمة السر <span className="text-[#D4AF37]">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full py-2 px-3 pe-8 rounded-[12px] bg-white border border-[#EFE9D9] text-sm focus:outline-none focus:border-[#0F3D2E]"
                      required
                    />
                    <Lock className="w-3.5 h-3.5 text-[#7A7A7A] absolute end-2.5 top-2.5" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1A1A1A] mb-1">
                    تأكيد كلمة السر <span className="text-[#D4AF37]">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full py-2 px-3 pe-8 rounded-[12px] bg-white border border-[#EFE9D9] text-sm focus:outline-none focus:border-[#0F3D2E]"
                      required
                    />
                    <Lock className="w-3.5 h-3.5 text-[#7A7A7A] absolute end-2.5 top-2.5" />
                  </div>
                </div>
              </div>

              <div className="pt-1 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-xs text-[#7A7A7A] hover:text-[#1A1A1A] flex items-center gap-1"
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  {showPassword ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}
                </button>
              </div>

              {/* Terms acceptance — Uiverse.io by Gulliver (gl-checkbox) */}
              <label className="ayg-terms gl-checkbox">
                <input
                  type="checkbox"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                />
                <span className="gl-checkbox-flip">
                  <span className="gl-checkbox-tick">L</span>
                  <span className="gl-checkbox-skew"></span>
                </span>
                <span className="text-[11px] font-bold text-[#1A1A1A] leading-relaxed">
                  لقد قرأت شروط التسجيل والمنصة وأوافق عليها
                </span>
              </label>

              <button
                type="submit"
                className="w-full py-2.5 px-4 rounded-[12px] bg-[#0F3D2E] text-white font-bold text-sm shadow-aygram hover:bg-[#155A44] transition-all cursor-pointer mt-2"
              >
                إنشاء الحساب والانضمام لمجتمع AyGram
              </button>
            </form>

            <div className="pt-3 text-center border-t border-[#EFE9D9]">
              <p className="text-xs text-[#7A7A7A]">
                لديك حساب بالفعل؟{' '}
                <button
                  onClick={() => {
                    setMode('login');
                    setError('');
                  }}
                  className="font-bold text-[#0F3D2E] hover:text-[#D4AF37] transition-colors"
                >
                  تسجيل الدخول
                </button>
              </p>
            </div>
          </div>
        )}

        {/* 3. FORGOT PASSWORD WITH IDENTITY PROOF */}
        {mode === 'forgot' && (
          <div className="space-y-4">
            <div className="text-center">
              <div className="w-10 h-10 mx-auto rounded-full bg-[#0F3D2E]/10 flex items-center justify-center text-[#0F3D2E] mb-2">
                <ShieldCheck className="w-5 h-5 text-[#D4AF37]" />
              </div>
              <h2 className="text-xl font-bold text-[#0F3D2E]">
                استعادة الحساب وتأكيد الهوية
              </h2>
              <p className="text-xs text-[#7A7A7A] mt-1">
                أدخل اسم المستخدم وتفاصيل تأكيد ملكية الحساب لإرسال طلب استعادة رسمي للإدارة
              </p>
            </div>

            <form onSubmit={handleResetPasswordSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-[#1A1A1A] mb-1">
                  اسم المستخدم (اليوزر) الخاص بحسابك <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 text-xs font-bold">@</span>
                  <input
                    type="text"
                    value={forgotUsername}
                    onChange={(e) => setForgotUsername(e.target.value)}
                    placeholder="username"
                    dir="ltr"
                    className="w-full py-2.5 pr-8 pl-3.5 rounded-[12px] bg-white border border-[#EFE9D9] text-sm text-left focus:outline-none focus:border-[#0F3D2E]"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1A1A1A] mb-1">
                  بيانات التواصل (رقم الهاتف أو البريد الإلكتروني المسجل)
                </label>
                <input
                  type="text"
                  value={forgotContact}
                  onChange={(e) => setForgotContact(e.target.value)}
                  placeholder="مثال: +966... أو email@example.com"
                  className="w-full py-2.5 px-3.5 rounded-[12px] bg-white border border-[#EFE9D9] text-sm focus:outline-none focus:border-[#0F3D2E]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1A1A1A] mb-1">
                  تأكيد هوية امتلاك الحساب وإثبات الملكية <span className="text-rose-500">*</span>
                </label>
                <textarea
                  value={proofDetails}
                  onChange={(e) => setProofDetails(e.target.value)}
                  rows={2}
                  placeholder="اكتب تفاصيل تثبت ملكيتك للحساب (مثل: كلمة مرور سابقة تذكرها، تاريخ تقريبي للتسجيل، أحدث المنشورات أو المحادثات، إلخ)"
                  className="w-full py-2 px-3 rounded-[12px] bg-white border border-[#EFE9D9] text-xs focus:outline-none focus:border-[#0F3D2E] resize-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1A1A1A] mb-1">
                  كلمة المرور الجديدة المراد اعتمادها (اختياري)
                </label>
                <input
                  type="password"
                  value={desiredPassword}
                  onChange={(e) => setDesiredPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full py-2.5 px-3.5 rounded-[12px] bg-white border border-[#EFE9D9] text-sm focus:outline-none focus:border-[#0F3D2E]"
                />
                <p className="text-[11px] text-stone-500 mt-1">
                  سيتم اعتمادها فور مراجعة الإدارة لهويتك
                </p>
              </div>

              <button
                type="submit"
                disabled={isSubmittingReset}
                className="w-full py-2.5 px-4 rounded-[12px] bg-[#0F3D2E] text-white font-bold text-sm shadow-aygram hover:bg-[#155A44] transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
                {isSubmittingReset ? 'جارٍ إرسال الطلب...' : 'إرسال طلب استعادة الحساب للإدارة'}
              </button>
            </form>

            <div className="pt-3 text-center border-t border-[#EFE9D9]">
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setError('');
                }}
                className="text-xs font-bold text-[#0F3D2E] hover:text-[#D4AF37]"
              >
                العودة إلى تسجيل الدخول
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
