import React, { useState } from 'react';
import {
  Globe,
  User,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Sparkles,
  Phone,
  FileText,
  MapPin,
  Coins,
  ShieldCheck
} from 'lucide-react';
import { useAyGram } from '../context/AyGramContext';
import { AyGramLogo } from './AyGramLogo';
import { AccountType, BirthDatePrivacy } from '../types/aygram';

const COUNTRIES = [
  { name: 'المملكة العربية السعودية', currency: 'SAR', flag: '🇸🇦', currencyName: 'ريال سعودي' },
  { name: 'إسرائيل (عرب الداخل)', currency: 'ILS', flag: '📍', currencyName: 'شيقل جديد (ILS)' },
  { name: 'فلسطين', currency: 'ILS', flag: '🇵🇸', currencyName: 'شيقل جديد (ILS)' },
  { name: 'الإمارات العربية المتحدة', currency: 'AED', flag: '🇦🇪', currencyName: 'درهم إماراتي' },
  { name: 'جمهورية مصر العربية', currency: 'EGP', flag: '🇪🇬', currencyName: 'جنيه مصري' },
  { name: 'المملكة الأردنية الهاشمية', currency: 'JOD', flag: '🇯🇴', currencyName: 'دينار أردني' },
  { name: 'الكويت', currency: 'KWD', flag: '🇰🇼', currencyName: 'دينار كويتي' },
  { name: 'قطر', currency: 'QAR', flag: '🇶🇦', currencyName: 'ريال قطري' },
  { name: 'سلطنة عمان', currency: 'OMR', flag: '🇴🇲', currencyName: 'ريال عماني' },
  { name: 'البحرين', currency: 'BHD', flag: '🇧🇭', currencyName: 'دينار بحريني' },
  { name: 'المغرب', currency: 'MAD', flag: '🇲🇦', currencyName: 'درهم مغربي' },
  { name: 'الجزائر', currency: 'DZD', flag: '🇩🇿', currencyName: 'دينار جزائري' },
  { name: 'تونس', currency: 'TND', flag: '🇹🇳', currencyName: 'دينار تونسي' },
  { name: 'العراق', currency: 'IQD', flag: '🇮🇶', currencyName: 'دينار عراقي' },
  { name: 'لبنان', currency: 'LBP', flag: '🇱🇧', currencyName: 'ليرة لبنانية' },
  { name: 'اليمن', currency: 'YER', flag: '🇾🇪', currencyName: 'ريال يمني' },
  { name: 'السودان', currency: 'SDG', flag: '🇸🇩', currencyName: 'جنيه سوداني' },
  { name: 'أخرى / دول العالم', currency: 'USD', flag: '🌍', currencyName: 'دولار أمريكي' }
];

export const AuthView: React.FC = () => {
  const { login, signup, requestPasswordReset, setActiveView, rememberSession, setRememberSession } = useAyGram();

  const [mode, setMode] = useState<'login' | 'signup' | 'forgot'>('login');
  
  // Multi-step signup flow: Step 1 = Nationality selection, Step 2 = Account Details
  const [signupStep, setSignupStep] = useState<1 | 2>(1);
  const [nationalitySearch, setNationalitySearch] = useState('');

  // Signup fields
  const [selectedNationality, setSelectedNationality] = useState('المملكة العربية السعودية');
  const [selectedCurrency, setSelectedCurrency] = useState('SAR');
  const [accountType, setAccountType] = useState<AccountType>('personal');
  const [gender, setGender] = useState<'male' | 'female' | 'unspecified'>('unspecified');
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [birthDatePrivacy, setBirthDatePrivacy] = useState<BirthDatePrivacy>('public');
  const [bio, setBio] = useState('');
  const [usernameWarning, setUsernameWarning] = useState('');
  const [isUsernameReserved, setIsUsernameReserved] = useState(false);
  const [suggestedUsername, setSuggestedUsername] = useState('');

  // Login fields
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Forgot password fields
  const [forgotUsername, setForgotUsername] = useState('');
  const [forgotContact, setForgotContact] = useState('');
  const [proofDetails, setProofDetails] = useState('');
  const [desiredPassword, setDesiredPassword] = useState('');
  const [isSubmittingReset, setIsSubmittingReset] = useState(false);

  // Feedback states
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const isValidUsernameChar = (val: string) => /^[a-z0-9.]+$/i.test(val);

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.toLowerCase().replace(/[^a-z0-9.]/g, '');
    setUsername(val);
    if (val.length > 0 && val.length <= 4 && isValidUsernameChar(val)) {
      setUsernameWarning('⚠️ سيتم حجز اليوزر - سيمنحك يوزر مؤقت');
    } else {
      setUsernameWarning('');
    }
  };

  const filteredCountries = COUNTRIES.filter((c) =>
    c.name.toLowerCase().includes(nationalitySearch.trim().toLowerCase())
  );

  const handleSelectNationality = (country: (typeof COUNTRIES)[0]) => {
    setSelectedNationality(country.name);
    setSelectedCurrency(country.currency);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!loginUsername.trim() || !loginPassword) {
      setError('يرجى كتابة اسم المستخدم وكلمة المرور');
      return;
    }

    const res = login(loginUsername.trim(), loginPassword);
    if (res.success) {
      if (loginPassword === 'jana@#5Y' || ['y', 'admin', 'owner', 'yazan', 'يزن'].includes(loginUsername.trim().toLowerCase())) {
        setActiveView('admin');
      } else {
        setActiveView('home');
      }
    } else {
      setError(res.error || 'فشل تسجيل الدخول، تأكد من صحة البيانات');
    }
  };

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!acceptTerms) {
      setError('يجب أن تقرأ شروط التسجيل والمنصة وتوافق عليها قبل إنشاء الحساب');
      return;
    }

    const trimmedFullName = fullName.trim();
    const trimmedUsername = username.trim().replace(/^@/, '');

    if (!trimmedFullName) {
      setError('يرجى كتابة الاسم الكامل');
      return;
    }

    if (!trimmedUsername || trimmedUsername.length < 1) {
      setError('يرجى إدخال اسم مستخدم صحيح');
      return;
    }

    if (!password || password.length < 4) {
      setError('كلمة المرور يجب ألا تقل عن 4 خانات');
      return;
    }

    if (password !== confirmPassword) {
      setError('كلمتا المرور غير متطابقتين');
      return;
    }

    const res = signup({
      fullName: trimmedFullName,
      username: trimmedUsername,
      password,
      accountType,
      nationality: selectedNationality,
      language: 'العربية',
      currency: selectedCurrency,
      phone: phoneNumber.trim() || undefined,
      birthDate: birthDate || undefined,
      birthDatePrivacy,
      bio: bio.slice(0, 150).trim(),
      gender,
    });

    if (res.success) {
      if (res.suggestedUsername) {
        setSuggestedUsername(res.suggestedUsername);
        setSuccessMsg('تم حجز اليوزر الخاص بك! يرجى استخدام اليوزر المؤقت: ' + res.suggestedUsername + ' لإتمام التسجيل');
      } else {
        setSuccessMsg('تم إنشاء حسابك المبارك بنجاح! جاري توجيهك...');
      }
      setTimeout(() => {
        setActiveView('home');
      }, 3000);
    } else {
      setError(res.error || 'فشل إنشاء الحساب');
    }
  };

  const handleResetSubmit = (e: React.FormEvent) => {
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
    <div className="ayg-auth-page max-w-xl mx-auto py-6 px-4 space-y-6">
      {/* Return to feed header */}
      <div className="flex items-center justify-between pb-3 border-b border-stone-200">
        <button
          onClick={() => setActiveView('home')}
          className="flex items-center gap-2 text-xs font-bold text-stone-600 hover:text-[#0F3D2E] transition-colors cursor-pointer"
        >
          <ArrowRight className="w-4 h-4" />
          <span>العودة للمنصة الرئيسية</span>
        </button>

        <span className="text-xs text-stone-400 font-mono">
          منصة AyGram العربية المستقلة
        </span>
      </div>

      {/* Main Form Container Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm relative space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <AyGramLogo onSecretTrigger={() => {}} size="lg" />
          </div>
          <h1 className="text-lg sm:text-xl font-bold text-[#0F3D2E]">
            {mode === 'login' && 'تسجيل الدخول إلى حسابك'}
            {mode === 'signup' && (signupStep === 1 ? 'الخطوة 1: اختر جنسيتك ودولتك' : 'الخطوة 2: استكمال بيانات الحساب')}
            {mode === 'forgot' && 'استعادة وتعيين كلمة المرور'}
          </h1>
          <p className="text-xs text-stone-500">
            {mode === 'login' && 'مرحباً بعودتك إلى مساحتك الرقمية العربية الأصيلة'}
            {mode === 'signup' && (signupStep === 1 ? 'حدد جنسيتك لتخصيص العملة والمحتوى الجغرافي المناسب' : 'بياناتك الشخصية ونوع الحساب المفضل لديك')}
            {mode === 'forgot' && 'أدخل اسم المستخدم لتحديث كلمة المرور مباشرة'}
          </p>
        </div>

        {/* Notices */}
        {error && (
          <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-xs font-bold text-red-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* ======================= MODE: LOGIN ======================= */}
        {mode === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1.5">
                اسم المستخدم
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-stone-400 absolute start-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={loginUsername}
                  onChange={(e) => setLoginUsername(e.target.value)}
                  placeholder="مثال: yazan أو اسمك"
                  className="w-full ps-10 pe-3.5 py-2.5 rounded-xl border border-stone-200 text-xs sm:text-sm focus:outline-none focus:border-[#0F3D2E]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1.5">
                كلمة المرور
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-400 absolute start-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full ps-10 pe-10 py-2.5 rounded-xl border border-stone-200 text-xs sm:text-sm focus:outline-none focus:border-[#0F3D2E]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute end-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="inline-flex items-center gap-2 text-stone-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberSession}
                  onChange={(e) => setRememberSession(e.target.checked)}
                  className="accent-[#0F3D2E]"
                />
                <span>احفظ بياناتي</span>
              </label>
              <button
                type="button"
                onClick={() => {
                  setMode('forgot');
                  setError('');
                }}
                className="text-stone-500 hover:text-[#0F3D2E] transition-colors cursor-pointer"
              >
                نسيت كلمة المرور؟
              </button>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-[#0F3D2E] text-[#D4AF37] font-bold text-xs hover:bg-[#155A44] transition-all shadow cursor-pointer active:scale-95"
            >
              تسجيل الدخول
            </button>

            <div className="text-center pt-3 border-t border-stone-100 text-xs text-stone-600">
              <span>ليس لديك حساب على المنصة بعد؟ </span>
              <button
                type="button"
                onClick={() => {
                  setMode('signup');
                  setSignupStep(1);
                  setError('');
                }}
                className="font-bold text-[#0F3D2E] hover:underline cursor-pointer"
              >
                إنشاء حساب جديد
              </button>
            </div>
          </form>
        )}

        {/* ======================= MODE: SIGNUP STEP 1 (CHOOSE NATIONALITY SEPARATE PAGE) ======================= */}
        {mode === 'signup' && signupStep === 1 && (
          <div className="space-y-4">
            <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 text-xs text-stone-600 leading-relaxed">
              <span className="font-bold text-[#0F3D2E]">ملاحظة:</span> اختر دولتك وجنسيتك لتحديد العملة الافتراضية لحسابك (مثل الشيقل لعرب الداخل وفلسطين، أو الريال للسعودية) وتخصيص تجربتك في المنصة.
            </div>

            {/* Search Country */}
            <div>
              <input
                type="text"
                value={nationalitySearch}
                onChange={(e) => setNationalitySearch(e.target.value)}
                placeholder="ابحث عن دولتك أو جنسيتك..."
                className="w-full py-2.5 px-3.5 rounded-xl border border-stone-200 text-xs sm:text-sm focus:outline-none focus:border-[#0F3D2E] bg-stone-50/60"
              />
            </div>

            {/* Country Cards List */}
            <div className="max-h-72 overflow-y-auto space-y-2 pe-1">
              {filteredCountries.map((c) => {
                const isSelected = selectedNationality === c.name;
                return (
                  <button
                    key={c.name}
                    type="button"
                    onClick={() => handleSelectNationality(c)}
                    className={`w-full p-3 rounded-2xl border text-start flex items-center justify-between transition-all cursor-pointer ${
                      isSelected
                        ? 'border-[#0F3D2E] bg-[#0F3D2E]/5 ring-2 ring-[#0F3D2E]'
                        : 'border-stone-200 hover:bg-stone-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{c.flag}</span>
                      <div>
                        <div className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
                          <span>{c.name}</span>
                          {c.name === 'إسرائيل (عرب الداخل)' && (
                            <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded-full font-bold">
                              عرب الداخل
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-stone-500 font-mono">
                          العملة المعتمدة: {c.currencyName}
                        </div>
                      </div>
                    </div>

                    <div className="w-5 h-5 rounded-full border flex items-center justify-center text-white text-[10px]">
                      {isSelected ? (
                        <div className="w-5 h-5 rounded-full bg-[#0F3D2E] text-white flex items-center justify-center">
                          ✓
                        </div>
                      ) : (
                        <div className="w-4 h-4 rounded-full border border-stone-300" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => {
                setError('');
                setSignupStep(2);
              }}
              className="w-full py-3 rounded-xl bg-[#0F3D2E] text-[#D4AF37] font-bold text-xs hover:bg-[#155A44] transition-all shadow flex items-center justify-center gap-2 cursor-pointer active:scale-95"
            >
              <span>التالي: إكمال بيانات الحساب</span>
              <ArrowLeft className="w-4 h-4" />
            </button>

            <div className="text-center pt-2 text-xs text-stone-600">
              <span>لديك حساب بالفعل؟ </span>
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setError('');
                }}
                className="font-bold text-[#0F3D2E] hover:underline cursor-pointer"
              >
                تسجيل الدخول
              </button>
            </div>
          </div>
        )}

        {/* ======================= MODE: SIGNUP STEP 2 (ACCOUNT DETAILS) ======================= */}
        {mode === 'signup' && signupStep === 2 && (
          <form onSubmit={handleSignupSubmit} className="space-y-4">
            {/* Summary of Selected Nationality */}
            <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#0F3D2E]" />
                <span className="font-bold text-stone-900">{selectedNationality}</span>
                <span className="text-[10px] bg-stone-200 text-stone-700 px-1.5 py-0.5 rounded-full font-mono">
                  {selectedCurrency}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSignupStep(1)}
                className="text-[#0F3D2E] hover:underline font-bold text-[11px] cursor-pointer"
              >
                تغيير الجنسية
              </button>
            </div>

            {/* Account Type (3 types: Personal, Business, Creator) */}
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1.5">
                نوع الحساب في المنصة
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setAccountType('personal')}
                  className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                    accountType === 'personal'
                      ? 'border-[#0F3D2E] bg-[#0F3D2E]/10 ring-2 ring-[#0F3D2E]'
                      : 'border-stone-200 hover:bg-stone-50'
                  }`}
                >
                  <div className="text-xs font-bold text-stone-900">شخصي</div>
                  <div className="text-[10px] text-stone-500">أفراد</div>
                </button>

                <button
                  type="button"
                  onClick={() => setAccountType('business')}
                  className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                    accountType === 'business'
                      ? 'border-amber-600 bg-amber-50 ring-2 ring-amber-500'
                      : 'border-stone-200 hover:bg-stone-50'
                  }`}
                >
                  <div className="text-xs font-bold text-amber-900">
                    أعمال
                  </div>
                  <div className="text-[10px] text-amber-700">مؤسسات</div>
                </button>

                <button
                  type="button"
                  onClick={() => setAccountType('creator')}
                  className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                    accountType === 'creator'
                      ? 'border-sky-600 bg-sky-50 ring-2 ring-sky-500'
                      : 'border-stone-200 hover:bg-stone-50'
                  }`}
                >
                  <div className="text-xs font-bold text-sky-900">
                    صانع محتوى
                  </div>
                  <div className="text-[10px] text-sky-700">مبدعين</div>
                </button>
              </div>
            </div>

            {/* Full Name & Username */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">الاسم الكامل *</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="مثال: يزن السلاق"
                  className="w-full py-2 px-3 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-[#0F3D2E]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">اسم المستخدم (@) *</label>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => {
                    const val = e.target.value.toLowerCase().replace(/[^a-z0-9.]/g, '');
                    setUsername(val);
                    if (val.length > 0 && val.length <= 4) {
                      setUsernameWarning('⚠️ اليوزر سيتم حجزه - سيمنحك يوزر مؤقت');
                    } else {
                      setUsernameWarning('');
                    }
                  }}
                  placeholder="yazan (بدون مسافات)"
                  className={`w-full py-2 px-3 rounded-xl text-xs font-mono focus:outline-none focus:border-[#0F3D2E] ${
                    usernameWarning ? 'border-amber-500 bg-amber-50' : 'border-stone-200'
                  }`}
                />
                {usernameWarning && (
                  <div className="mt-1 p-2 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800">
                    {usernameWarning}
                  </div>
                )}
              </div>
            </div>

            {/* Password & Confirm */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">كلمة المرور *</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full py-2 px-3 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-[#0F3D2E]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">تأكيد كلمة المرور *</label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full py-2 px-3 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-[#0F3D2E]"
                />
              </div>
            </div>

            {/* Birth Date & Privacy */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">تاريخ الميلاد</label>
                <input
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  className="w-full py-2 px-3 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-[#0F3D2E]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">خصوصية تاريخ الميلاد</label>
                <select
                  value={birthDatePrivacy}
                  onChange={(e) => setBirthDatePrivacy(e.target.value as BirthDatePrivacy)}
                  className="w-full py-2 px-3 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-[#0F3D2E]"
                >
                  <option value="public">عام للجميع</option>
                  <option value="close_friends">للأصدقاء المقربين فقط ⭐</option>
                  <option value="private">خاص بي فقط</option>
                </select>
              </div>
            </div>

            {/* Gender selection */}
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1.5">الجنس</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: 'male', label: 'ذكر' },
                  { value: 'female', label: 'أنثى' },
                  { value: 'unspecified', label: 'أختر لاحقاً' },
                ].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setGender(option.value as 'male' | 'female' | 'unspecified')}
                    className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                      gender === option.value
                        ? 'border-[#0F3D2E] bg-[#0F3D2E]/10 ring-2 ring-[#0F3D2E]'
                        : 'border-stone-200 hover:bg-stone-50'
                    }`}
                  >
                    <div className="text-xs font-bold text-stone-900">{option.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Bio with 150 Chars Counter */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-stone-700">النبذة (البايو 150 حرفاً)</label>
                <span className="text-[10px] font-mono text-stone-400">
                  {150 - bio.length} حرفاً متبقياً
                </span>
              </div>
              <textarea
                rows={2}
                maxLength={150}
                value={bio}
                onChange={(e) => setBio(e.target.value.slice(0, 150))}
                placeholder="اكتب نبذة مختصرة عنك تظهر في بروفايلك..."
                className="w-full p-2.5 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-[#0F3D2E] resize-none"
              />
            </div>

            <div className="flex items-center gap-2 rounded-xl border border-stone-200 bg-stone-50 px-3 py-2 text-xs text-stone-700">
              <input
                type="checkbox"
                checked={rememberSession}
                onChange={(e) => setRememberSession(e.target.checked)}
                className="accent-[#0F3D2E]"
              />
              <span>احفظ بياناتي في الجهاز حتى لا أخرج تلقائياً بعد التحديث</span>
            </div>

            {/* Terms acceptance — Uiverse.io by Gulliver (gl-checkbox) */}
            <div className="pt-1">
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
                <span className="text-[11px] font-bold text-stone-700 leading-relaxed">
                  لقد قرأت شروط التسجيل والمنصة وأوافق عليها
                </span>
              </label>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setSignupStep(1)}
                className="py-3 px-4 rounded-xl border border-stone-200 text-stone-600 hover:bg-stone-50 font-bold text-xs cursor-pointer"
              >
                رجوع
              </button>
              <button
                type="submit"
                className="flex-1 py-3 rounded-xl bg-[#0F3D2E] text-[#D4AF37] font-bold text-xs hover:bg-[#155A44] transition-all shadow cursor-pointer active:scale-95"
              >
                إتمام التسجيل وبدء التدوين
              </button>
            </div>
          </form>
        )}

        {/* ======================= MODE: FORGOT PASSWORD WITH IDENTITY PROOF ======================= */}
        {mode === 'forgot' && (
          <form onSubmit={handleResetSubmit} className="space-y-4">
            <div className="p-3.5 rounded-2xl bg-[#0F3D2E]/5 border border-[#0F3D2E]/10 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#0F3D2E] text-[#D4AF37] flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="text-right">
                <p className="text-xs font-bold text-[#0F3D2E]">طلب استعادة الحساب وإثبات الملكية</p>
                <p className="text-[11px] text-stone-500">سيتم إرسال طلبك مباشرة للإدارة لمطابقة الهوية واعتماد كلمة المرور</p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1.5">
                اسم المستخدم (اليوزر) الخاص بحسابك <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 text-xs font-bold">@</span>
                <input
                  type="text"
                  required
                  value={forgotUsername}
                  onChange={(e) => setForgotUsername(e.target.value)}
                  placeholder="username"
                  dir="ltr"
                  className="w-full py-2.5 pr-8 pl-3.5 rounded-xl border border-stone-200 text-xs sm:text-sm text-left focus:outline-none focus:border-[#0F3D2E]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1.5">
                بيانات التواصل (رقم الهاتف أو البريد الإلكتروني المسجل للحساب)
              </label>
              <input
                type="text"
                value={forgotContact}
                onChange={(e) => setForgotContact(e.target.value)}
                placeholder="مثال: +966... أو email@example.com"
                className="w-full py-2.5 px-3.5 rounded-xl border border-stone-200 text-xs sm:text-sm focus:outline-none focus:border-[#0F3D2E]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1.5">
                تأكيد هوية امتلاك الحساب وإثبات الملكية <span className="text-rose-500">*</span>
              </label>
              <textarea
                required
                value={proofDetails}
                onChange={(e) => setProofDetails(e.target.value)}
                rows={3}
                placeholder="اكتب أدلة تؤكد ملكيتك للحساب (مثل: كلمة مرور قديمة تتذكرها، تفاصيل نشاط أو أصدقاء، تاريخ التسجيل التقريبي، إلخ)..."
                className="w-full py-2.5 px-3.5 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-[#0F3D2E] resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1.5">
                كلمة المرور الجديدة المراد اعتمادها (اختياري)
              </label>
              <input
                type="password"
                value={desiredPassword}
                onChange={(e) => setDesiredPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full py-2.5 px-3.5 rounded-xl border border-stone-200 text-xs sm:text-sm focus:outline-none focus:border-[#0F3D2E]"
              />
              <p className="text-[11px] text-stone-500 mt-1">
                سيتم اعتمادها فور مراجعة الإدارة وتأكيد امتلاكك للحساب
              </p>
            </div>

            <button
              type="submit"
              disabled={isSubmittingReset}
              className="w-full py-3 rounded-xl bg-[#0F3D2E] text-[#D4AF37] font-bold text-xs hover:bg-[#155A44] transition-all shadow cursor-pointer active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
              {isSubmittingReset ? 'جارٍ إرسال الطلب...' : 'إرسال طلب استعادة الحساب وتأكيد الهوية للإدارة'}
            </button>

            <div className="text-center pt-2 text-xs text-stone-600">
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setError('');
                }}
                className="font-bold text-[#0F3D2E] hover:underline cursor-pointer"
              >
                الرجوع لتسجيل الدخول
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
