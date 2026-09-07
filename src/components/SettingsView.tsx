import React, { useState } from 'react';
import {
  Settings,
  User,
  Shield,
  Star,
  EyeOff,
  Link as LinkIcon,
  Globe,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Lock,
  ArrowRight,
  Sparkles,
  MapPin,
  Check,
  UserX,
  LifeBuoy
} from 'lucide-react';
import { useAyGram } from '../context/AyGramContext';
import {
  AccountType,
  BirthDatePrivacy,
  ProfileLink,
  SocialLinks,
  VerificationBadgeType
} from '../types/aygram';
import { VerificationBadge } from './VerificationBadge';
import { DeactivateAccountModal } from './DeactivateAccountModal';
import { ProfileImageUploader } from './ProfileImageUploader';
import { ProfileColorPicker } from './ProfileColorPicker';

const NATIONALITY_OPTIONS = [
  { name: 'المملكة العربية السعودية', currency: 'SAR' },
  { name: 'إسرائيل (عرب الداخل)', currency: 'ILS' },
  { name: 'فلسطين', currency: 'ILS' },
  { name: 'الإمارات العربية المتحدة', currency: 'AED' },
  { name: 'جمهورية مصر العربية', currency: 'EGP' },
  { name: 'المملكة الأردنية الهاشمية', currency: 'JOD' },
  { name: 'الكويت', currency: 'KWD' },
  { name: 'قطر', currency: 'QAR' },
  { name: 'سلطنة عمان', currency: 'OMR' },
  { name: 'البحرين', currency: 'BHD' },
  { name: 'المغرب', currency: 'MAD' },
  { name: 'الجزائر', currency: 'DZD' },
  { name: 'تونس', currency: 'TND' },
  { name: 'العراق', currency: 'IQD' },
  { name: 'لبنان', currency: 'LBP' },
  { name: 'اليمن', currency: 'YER' },
  { name: 'السودان', currency: 'SDG' },
  { name: 'أخرى', currency: 'USD' }
];

export const SettingsView: React.FC = () => {
  const {
    currentUser,
    users,
    updateFullProfile,
    toggleCloseFriend,
    toggleHideStoryFromUser,
    toggleBlockUser,
    updateVerificationBadge,
    setActiveView,
    deactivateAccount,
    setRememberSession,
    rememberSession,
  } = useAyGram();

  const [activeSection, setActiveSection] = useState<
    'profile' | 'privacy' | 'links' | 'social' | 'closeFriends' | 'verification' | 'blocks'
  >('profile');
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);

  // Profile Form States
  const [fullName, setFullName] = useState(currentUser?.fullName || '');
  const [bio, setBio] = useState(currentUser?.bio || '');
  const [profileImage, setProfileImage] = useState(currentUser?.profileImage || '');
  const [profileColor, setProfileColor] = useState(currentUser?.profileColor || '#0F3D2E');
  const [accountType, setAccountType] = useState<AccountType>(currentUser?.accountType || 'personal');
  const [nationality, setNationality] = useState(currentUser?.nationality || 'المملكة العربية السعودية');
  const [currency, setCurrency] = useState(currentUser?.currency || 'SAR');
  const [location, setLocation] = useState(currentUser?.location || '');
  const [gender, setGender] = useState<'male' | 'female' | 'unspecified'>(currentUser?.gender || 'unspecified');
  const [birthDate, setBirthDate] = useState(currentUser?.birthDate || '');
  const [birthDatePrivacy, setBirthDatePrivacy] = useState<BirthDatePrivacy>(
    currentUser?.birthDatePrivacy || 'public'
  );

  // Links State (Up to 6 links)
  const [links, setLinks] = useState<ProfileLink[]>(currentUser?.links || []);
  const [newLinkTitle, setNewLinkTitle] = useState('');
  const [newLinkUrl, setNewLinkUrl] = useState('');

  // Social Links State
  const [socialLinks, setSocialLinks] = useState<SocialLinks>(
    currentUser?.socialLinks || {}
  );

  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  if (!currentUser) {
    return (
      <div className="bg-white rounded-3xl p-10 text-center border border-stone-200 shadow-sm space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-[#0F3D2E]/10 text-[#0F3D2E] flex items-center justify-center mx-auto">
          <Lock className="w-6 h-6" />
        </div>
        <h2 className="text-lg font-bold text-stone-900">يرجى تسجيل الدخول للوصول إلى الإعدادات</h2>
        <button
          onClick={() => setActiveView('auth')}
          className="px-6 py-2.5 rounded-xl bg-[#0F3D2E] text-[#D4AF37] font-bold text-xs hover:bg-[#155A44] transition-colors cursor-pointer"
        >
          تسجيل الدخول / إنشاء حساب
        </button>
      </div>
    );
  }

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage('');
    setErrorMessage('');

    if (!fullName.trim()) {
      setErrorMessage('الاسم الكامل مطلوب');
      return;
    }

    updateFullProfile({
      fullName: fullName.trim(),
      bio: bio.slice(0, 150).trim(),
      profileImage: profileImage.trim() || currentUser.profileImage,
      profileColor: profileColor || undefined,
      accountType,
      nationality,
      currency,
      gender,
      location: location.trim() || undefined,
      birthDate: birthDate || undefined,
      birthDatePrivacy,
      links,
      socialLinks,
    });

    setSuccessMessage('تم حفظ إعدادات الحساب بنجاح');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleAddLink = () => {
    if (links.length >= 6) {
      setErrorMessage('الحد الأقصى المسموح به هو 6 روابط فقط في البانر');
      return;
    }
    if (!newLinkTitle.trim() || !newLinkUrl.trim()) {
      setErrorMessage('يرجى كتابة عنوان ورابط صحيحين');
      return;
    }

    const updated = [
      ...links,
      {
        id: 'link_' + Date.now(),
        title: newLinkTitle.trim(),
        url: newLinkUrl.trim().startsWith('http') ? newLinkUrl.trim() : `https://${newLinkUrl.trim()}`,
      },
    ];

    setLinks(updated);
    updateFullProfile({ links: updated });
    setNewLinkTitle('');
    setNewLinkUrl('');
    setSuccessMessage('تمت إضافة الرابط للبانر بنجاح');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleRemoveLink = (linkId: string) => {
    const updated = links.filter((l) => l.id !== linkId);
    setLinks(updated);
    updateFullProfile({ links: updated });
  };

  const handleSaveSocial = () => {
    updateFullProfile({ socialLinks });
    setSuccessMessage('تم حفظ روابط التواصل الاجتماعي بنجاح');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  // Other users list for close friends and hide story
  const otherUsers = users.filter((u) => u.id !== currentUser.id);

  return (
    <div className="space-y-6 pb-20">
      {/* Settings Top Bar */}
      <div className="flex items-center justify-between pb-2 border-b border-stone-200">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-[#0F3D2E]/10 text-[#0F3D2E] flex items-center justify-center">
            <Settings className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-stone-900">إعدادات الحساب والمنصة</h1>
            <p className="text-xs text-stone-500">تحكم ببياناتك، الخصوصية، شارات التوثيق، والأصدقاء المقربين</p>
          </div>
        </div>

        <button
          onClick={() => setActiveView('profile')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-stone-200 hover:bg-stone-50 text-xs font-bold text-stone-700 transition-colors cursor-pointer"
        >
          <span>العودة للملف الشخصي</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Alert Notices */}
      {successMessage && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-xs font-bold text-red-800 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Grid: Nav Tabs on Left, Content on Right */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 sm:gap-6">
        {/* Navigation Sidebar (Scrollable on mobile, vertical on desktop) */}
        <div className="bg-white rounded-2xl p-2 sm:p-2.5 border border-stone-200 shadow-sm flex md:flex-col overflow-x-auto no-scrollbar gap-1.5 h-fit">
          {/* Category 1: Accounts Centre & Personal Info */}
          <div className="text-[10px] font-bold text-stone-400 uppercase tracking-wide px-3 pt-2 pb-1 hidden md:block">
            مركز الحسابات والملف الشخصي
          </div>

          <button
            onClick={() => setActiveSection('profile')}
            className={`flex items-center gap-2 px-3 py-2 sm:py-2.5 rounded-xl text-xs font-bold transition-all text-start whitespace-nowrap shrink-0 md:w-full cursor-pointer ${
              activeSection === 'profile'
                ? 'bg-[#0F3D2E] text-[#D4AF37]'
                : 'text-stone-600 hover:bg-stone-50'
            }`}
          >
            <User className="w-4 h-4 shrink-0" />
            <span>تعديل الملف الشخصي والنوع</span>
          </button>

          <button
            onClick={() => setActiveSection('privacy')}
            className={`flex items-center gap-2 px-3 py-2 sm:py-2.5 rounded-xl text-xs font-bold transition-all text-start whitespace-nowrap shrink-0 md:w-full cursor-pointer ${
              activeSection === 'privacy'
                ? 'bg-[#0F3D2E] text-[#D4AF37]'
                : 'text-stone-600 hover:bg-stone-50'
            }`}
          >
            <Calendar className="w-4 h-4 shrink-0" />
            <span>تاريخ الميلاد والخصوصية</span>
          </button>

          <button
            onClick={() => setActiveSection('social')}
            className={`flex items-center gap-2 px-3 py-2 sm:py-2.5 rounded-xl text-xs font-bold transition-all text-start whitespace-nowrap shrink-0 md:w-full cursor-pointer ${
              activeSection === 'social'
                ? 'bg-[#0F3D2E] text-[#D4AF37]'
                : 'text-stone-600 hover:bg-stone-50'
            }`}
          >
            <Globe className="w-4 h-4 shrink-0" />
            <span>أيقونات التواصل</span>
          </button>

          <button
            onClick={() => setActiveSection('links')}
            className={`flex items-center gap-2 px-3 py-2 sm:py-2.5 rounded-xl text-xs font-bold transition-all text-start whitespace-nowrap shrink-0 md:w-full cursor-pointer ${
              activeSection === 'links'
                ? 'bg-[#0F3D2E] text-[#D4AF37]'
                : 'text-stone-600 hover:bg-stone-50'
            }`}
          >
            <LinkIcon className="w-4 h-4 shrink-0" />
            <span>بانر الروابط (حتى 6)</span>
          </button>

          <button
            onClick={() => setActiveSection('verification')}
            className={`flex items-center gap-2 px-3 py-2 sm:py-2.5 rounded-xl text-xs font-bold transition-all text-start whitespace-nowrap shrink-0 md:w-full cursor-pointer ${
              activeSection === 'verification'
                ? 'bg-[#0F3D2E] text-[#D4AF37]'
                : 'text-stone-600 hover:bg-stone-50'
            }`}
          >
            <Sparkles className="w-4 h-4 shrink-0" />
            <span>شارات التوثيق</span>
          </button>

          {/* Category 2: Who can see your content */}
          <div className="text-[10px] font-bold text-stone-400 uppercase tracking-wide px-3 pt-3 pb-1 border-t border-stone-100 hidden md:block">
            من يرى محتواك
          </div>

          <button
            onClick={() => setActiveSection('closeFriends')}
            className={`flex items-center gap-2 px-3 py-2 sm:py-2.5 rounded-xl text-xs font-bold transition-all text-start whitespace-nowrap shrink-0 md:w-full cursor-pointer ${
              activeSection === 'closeFriends'
                ? 'bg-[#0F3D2E] text-[#D4AF37]'
                : 'text-stone-600 hover:bg-stone-50'
            }`}
          >
            <Star className="w-4 h-4 shrink-0" />
            <span>الأصدقاء المقربون وإخفاء الستوري</span>
          </button>

          {/* Category 3: Privacy & Security */}
          <div className="text-[10px] font-bold text-stone-400 uppercase tracking-wide px-3 pt-3 pb-1 border-t border-stone-100 hidden md:block">
            الخصوصية والأمان
          </div>

          <button
            onClick={() => setActiveSection('blocks')}
            className={`flex items-center gap-2 px-3 py-2 sm:py-2.5 rounded-xl text-xs font-bold transition-all text-start whitespace-nowrap shrink-0 md:w-full cursor-pointer ${
              activeSection === 'blocks'
                ? 'bg-[#0F3D2E] text-[#D4AF37]'
                : 'text-stone-600 hover:bg-stone-50'
            }`}
          >
            <UserX className="w-4 h-4 shrink-0" />
            <span>قائمة الحظر</span>
          </button>

          {/* Category 4: Support & Help */}
          <div className="text-[10px] font-bold text-stone-400 uppercase tracking-wide px-3 pt-3 pb-1 border-t border-stone-100 hidden md:block">
            الدعم والمساعدة
          </div>

          <button
            onClick={() => setActiveView('support')}
            className="flex items-center gap-2 px-3 py-2 sm:py-2.5 rounded-xl text-xs font-bold transition-all text-start whitespace-nowrap shrink-0 md:w-full cursor-pointer text-[#0F3D2E] hover:bg-[#0F3D2E]/5"
          >
            <LifeBuoy className="w-4 h-4 shrink-0 text-[#D4AF37]" />
            <span>مركز وتذاكر الدعم الفني</span>
          </button>

          <button
            onClick={() => setShowDeactivateModal(true)}
            className="flex items-center gap-2 px-3 py-2 sm:py-2.5 rounded-xl text-xs font-bold transition-all text-start whitespace-nowrap shrink-0 md:w-full cursor-pointer text-red-600 hover:bg-red-50"
          >
            <Trash2 className="w-4 h-4 shrink-0" />
            <span>تعطيل أو حذف حسابي</span>
          </button>
        </div>

        {/* Form Body on Right */}
        <div className="md:col-span-3">
          {/* 1. Profile Section */}
          {activeSection === 'profile' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-6">
              <h2 className="text-sm font-bold text-[#0F3D2E] pb-2 border-b border-stone-100">
                تعديل الملف الشخصي ونوع الحساب
              </h2>

              <form onSubmit={handleSaveProfile} className="space-y-5">
                {/* Account Type Selection (3 types) */}
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-2">
                    نوع الحساب (حدد تصنيف ملفك في المنصة):
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    <button
                      type="button"
                      onClick={() => setAccountType('personal')}
                      className={`p-3.5 rounded-2xl border text-center transition-all cursor-pointer ${
                        accountType === 'personal'
                          ? 'border-[#0F3D2E] bg-[#0F3D2E]/5 ring-2 ring-[#0F3D2E]'
                          : 'border-stone-200 hover:bg-stone-50'
                      }`}
                    >
                      <div className="text-xs font-bold text-stone-900">حساب شخصي</div>
                      <div className="text-[10px] text-stone-500 mt-1">للأفراد والتواصل الاجتماعي</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setAccountType('business')}
                      className={`p-3.5 rounded-2xl border text-center transition-all cursor-pointer ${
                        accountType === 'business'
                          ? 'border-amber-600 bg-amber-50 ring-2 ring-amber-500'
                          : 'border-stone-200 hover:bg-stone-50'
                      }`}
                    >
                      <div className="text-xs font-bold text-amber-900">
                        حساب أعمال
                      </div>
                      <div className="text-[10px] text-amber-700 mt-1">للشركات والمتاجر والمؤسسات</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setAccountType('creator')}
                      className={`p-3.5 rounded-2xl border text-center transition-all cursor-pointer ${
                        accountType === 'creator'
                          ? 'border-sky-600 bg-sky-50 ring-2 ring-sky-500'
                          : 'border-stone-200 hover:bg-stone-50'
                      }`}
                    >
                      <div className="text-xs font-bold text-sky-900">
                        صانع محتوى
                      </div>
                      <div className="text-[10px] text-sky-700 mt-1">للكتّاب، المصممين والمبدعين</div>
                    </button>
                  </div>
                </div>

                {/* Full Name & Username */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1.5">الاسم الكامل</label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full py-2.5 px-3.5 rounded-xl border border-stone-200 text-xs sm:text-sm focus:outline-none focus:border-[#0F3D2E]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1.5">اسم المستخدم (معرف الحساب)</label>
                    <input
                      type="text"
                      disabled
                      value={`@${currentUser.username}`}
                      className="w-full py-2.5 px-3.5 rounded-xl border border-stone-200 bg-stone-100 text-xs sm:text-sm text-stone-500 font-mono"
                    />
                  </div>
                </div>

                {/* Bio with 150 Chars Limit */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold text-stone-700">
                      النبذة التعريفية (البايو):
                    </label>
                    <span className={`text-[11px] font-mono font-bold ${150 - bio.length < 15 ? 'text-amber-600' : 'text-stone-400'}`}>
                      {150 - bio.length} / 150 حرفاً متبقياً
                    </span>
                  </div>
                  <textarea
                    rows={3}
                    maxLength={150}
                    value={bio}
                    onChange={(e) => setBio(e.target.value.slice(0, 150))}
                    placeholder="نبذة مختصرة عنك أو عن نشاطك (بحد أقصى 150 حرفاً)..."
                    className="w-full p-3 rounded-xl border border-stone-200 text-xs sm:text-sm focus:outline-none focus:border-[#0F3D2E] resize-none"
                  />
                </div>

                {/* Nationality & Currency (Includes عرب الداخل و عملة الشيقل) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1.5">الجنسية / المنطقة</label>
                    <select
                      value={nationality}
                      onChange={(e) => {
                        const selected = e.target.value;
                        setNationality(selected);
                        const opt = NATIONALITY_OPTIONS.find((n) => n.name === selected);
                        if (opt) setCurrency(opt.currency);
                      }}
                      className="w-full py-2.5 px-3.5 rounded-xl border border-stone-200 text-xs sm:text-sm focus:outline-none focus:border-[#0F3D2E]"
                    >
                      {NATIONALITY_OPTIONS.map((opt) => (
                        <option key={opt.name} value={opt.name}>
                          {opt.name} {opt.name === 'إسرائيل (عرب الداخل)' ? '⭐' : ''}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1.5">عملة الحساب والتسوق</label>
                    <select
                      value={currency}
                      onChange={(e) => setCurrency(e.target.value)}
                      className="w-full py-2.5 px-3.5 rounded-xl border border-stone-200 text-xs sm:text-sm focus:outline-none focus:border-[#0F3D2E]"
                    >
                      <option value="SAR">ريال سعودي (SAR)</option>
                      <option value="ILS">شيقل إسرائيلي جديد (ILS - عرب الداخل وفلسطين)</option>
                      <option value="AED">درهم إماراتي (AED)</option>
                      <option value="EGP">جنيه مصري (EGP)</option>
                      <option value="JOD">دينار أردني (JOD)</option>
                      <option value="KWD">دينار كويتي (KWD)</option>
                      <option value="USD">دولار أمريكي (USD)</option>
                    </select>
                  </div>
                </div>

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

                <div className="flex items-center justify-between gap-3 rounded-xl border border-stone-200 bg-stone-50 px-3 py-2.5">
                  <div>
                    <div className="text-xs font-bold text-stone-800">حالة النشاط</div>
                    <div className="text-[10px] text-stone-500">إظهار أنك متصل الآن للآخرين</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => updateFullProfile({ showActivityStatus: !(currentUser.showActivityStatus ?? true) })}
                    className={`px-3 py-1.5 rounded-full text-[11px] font-bold cursor-pointer transition-colors ${
                      currentUser.showActivityStatus === false ? 'bg-stone-200 text-stone-700' : 'bg-[#0F3D2E] text-[#D4AF37]'
                    }`}
                  >
                    {currentUser.showActivityStatus === false ? 'مغلق' : 'مفتوح'}
                  </button>
                </div>

                <label className="flex items-center gap-2 justify-between rounded-xl border border-stone-200 bg-stone-50 px-3 py-2.5 text-xs text-stone-700 cursor-pointer">
                  <span>حفظ بياناتي تلقائياً في المتصفح</span>
                  <input
                    type="checkbox"
                    checked={rememberSession}
                    onChange={(e) => setRememberSession(e.target.checked)}
                    className="accent-[#0F3D2E]"
                  />
                </label>

                {/* Location Input */}
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1.5">
                    الموقع الجغرافي الظاهر في الملف (مثل: الناصرة، إسرائيل (عرب الداخل) أو الرياض، السعودية)
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-stone-400 absolute start-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="اكتب المدينة والدولة..."
                      className="w-full ps-10 pe-3.5 py-2.5 rounded-xl border border-stone-200 text-xs sm:text-sm focus:outline-none focus:border-[#0F3D2E]"
                    />
                  </div>
                </div>

                {/* Profile Image Upload (from device) */}
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-2">
                    صورة الملف الشخصي (ارفعها من جهازك مباشرة):
                  </label>
                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    <ProfileImageUploader value={profileImage} onChange={setProfileImage} size={96} />
                    <p className="text-[11px] text-stone-400 leading-relaxed sm:max-w-xs">
                      يتم ضغط الصورة تلقائياً لتظهر بشكل مثالي في ملفك الشخصي وفي كل التفاعلات والرسائل.
                    </p>
                  </div>
                </div>

                {/* Profile Color Picker */}
                <ProfileColorPicker value={profileColor} onChange={setProfileColor} />

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-[#0F3D2E] text-white font-bold text-xs hover:bg-[#155A44] transition-all shadow cursor-pointer active:scale-95 w-fit"
                  >
                    حفظ التعديلات
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowDeactivateModal(true)}
                    className="text-xs text-red-600 hover:text-red-700 hover:underline cursor-pointer font-bold flex items-center gap-1 self-end sm:self-center"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>تعطيل أو حذف حسابي</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* 2. BirthDate and Privacy Section */}
          {activeSection === 'privacy' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-6">
              <h2 className="text-sm font-bold text-[#0F3D2E] pb-2 border-b border-stone-100 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#D4AF37]" />
                <span>تسجيل تاريخ الميلاد والخصوصية</span>
              </h2>

              <p className="text-xs text-stone-500 leading-relaxed">
                وفقاً لطلبك، يمكنك تسجيل تاريخ ميلادك مع ضبط مستوى الخصوصية الدقيق لمن يملك صلاحية رؤيته.
              </p>

              <form onSubmit={handleSaveProfile} className="space-y-5 max-w-lg">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1.5">تاريخ الميلاد</label>
                  <input
                    type="date"
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    className="w-full py-2.5 px-3.5 rounded-xl border border-stone-200 text-xs sm:text-sm focus:outline-none focus:border-[#0F3D2E]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-2">من يمكنه رؤية تاريخ ميلادك؟</label>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2.5 p-3 rounded-xl border border-stone-200 hover:bg-stone-50 cursor-pointer text-xs">
                      <input
                        type="radio"
                        name="birthDatePrivacy"
                        value="public"
                        checked={birthDatePrivacy === 'public'}
                        onChange={() => setBirthDatePrivacy('public')}
                        className="accent-[#0F3D2E]"
                      />
                      <div>
                        <span className="font-bold text-stone-900 block">عام للجميع</span>
                        <span className="text-[11px] text-stone-500">يظهر تاريخ الميلاد لكل زوار ملفك الشخصي</span>
                      </div>
                    </label>

                    <label className="flex items-center gap-2.5 p-3 rounded-xl border border-stone-200 hover:bg-stone-50 cursor-pointer text-xs">
                      <input
                        type="radio"
                        name="birthDatePrivacy"
                        value="close_friends"
                        checked={birthDatePrivacy === 'close_friends'}
                        onChange={() => setBirthDatePrivacy('close_friends')}
                        className="accent-[#0F3D2E]"
                      />
                      <div>
                        <span className="font-bold text-emerald-800 flex items-center gap-1">
                          <Star className="w-3.5 h-3.5 fill-emerald-600 text-emerald-600" />
                          <span>للأصدقاء المقربين فقط</span>
                        </span>
                        <span className="text-[11px] text-stone-500">يظهر فقط للأشخاص المضافين في قائمة Close Friends</span>
                      </div>
                    </label>

                    <label className="flex items-center gap-2.5 p-3 rounded-xl border border-stone-200 hover:bg-stone-50 cursor-pointer text-xs">
                      <input
                        type="radio"
                        name="birthDatePrivacy"
                        value="private"
                        checked={birthDatePrivacy === 'private'}
                        onChange={() => setBirthDatePrivacy('private')}
                        className="accent-[#0F3D2E]"
                      />
                      <div>
                        <span className="font-bold text-stone-900 block">خاص بي فقط</span>
                        <span className="text-[11px] text-stone-500">مخفي تماماً عن الجميع في صفحة البروفايل</span>
                      </div>
                    </label>
                  </div>
                </div>

                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#0F3D2E] text-white font-bold text-xs hover:bg-[#155A44] transition-all shadow cursor-pointer active:scale-95"
                >
                  حفظ إعدادات تاريخ الميلاد
                </button>
              </form>
            </div>
          )}

          {/* 3. Links Banner (Up to 6 links) */}
          {activeSection === 'links' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-6">
              <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                <h2 className="text-sm font-bold text-[#0F3D2E] flex items-center gap-2">
                  <LinkIcon className="w-4 h-4 text-[#D4AF37]" />
                  <span>بانر إضافة روابط للملف الشخصي</span>
                </h2>
                <span className="text-xs font-mono font-bold text-stone-500">
                  {links.length} من 6 روابط
                </span>
              </div>

              <p className="text-xs text-stone-500">
                أضف حتى 6 روابط خارجية معنونة تظهر في بانر بارز أعلى ملفك الشخصي لزيادة التفاعل وزيارة مشاريعك ومواقعك.
              </p>

              {/* Add New Link Form */}
              {links.length < 6 && (
                <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-3">
                  <div className="text-xs font-bold text-stone-700">إضافة رابط جديد:</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      value={newLinkTitle}
                      onChange={(e) => setNewLinkTitle(e.target.value)}
                      placeholder="عنوان الرابط (مثل: معرض أعمالي، متجري...)"
                      className="py-2 px-3 rounded-xl bg-white border border-stone-200 text-xs focus:outline-none focus:border-[#0F3D2E]"
                    />
                    <input
                      type="text"
                      value={newLinkUrl}
                      onChange={(e) => setNewLinkUrl(e.target.value)}
                      placeholder="الرابط URL (مثل: https://example.com)..."
                      className="py-2 px-3 rounded-xl bg-white border border-stone-200 text-xs focus:outline-none focus:border-[#0F3D2E]"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleAddLink}
                    className="px-4 py-2 bg-[#0F3D2E] text-white rounded-xl text-xs font-bold hover:bg-[#155A44] flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>إضافة الرابط للبانر</span>
                  </button>
                </div>
              )}

              {/* Existing Links List */}
              <div className="space-y-2 pt-2">
                <div className="text-xs font-bold text-stone-700">الروابط المضافة حالياً ({links.length}):</div>
                {links.length === 0 ? (
                  <div className="p-6 text-center text-xs text-stone-400 bg-stone-50 rounded-2xl border border-dashed border-stone-200">
                    لم تقم بإضافة روابط بعد. يمكنك إضافة حتى 6 روابط.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {links.map((link, idx) => (
                      <div
                        key={link.id || idx}
                        className="flex items-center justify-between p-3 rounded-xl border border-stone-200 bg-white"
                      >
                        <div className="flex items-center gap-2 overflow-hidden">
                          <LinkIcon className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                          <div className="overflow-hidden">
                            <span className="text-xs font-bold text-stone-900 block truncate">
                              {link.title}
                            </span>
                            <span className="text-[11px] text-stone-400 font-mono block truncate">
                              {link.url}
                            </span>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleRemoveLink(link.id)}
                          className="p-1.5 text-stone-400 hover:text-red-600 transition-colors cursor-pointer"
                          title="حذف الرابط"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 4. Social Links Icons (WhatsApp, LinkedIn, X, GitHub) */}
          {activeSection === 'social' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-6">
              <h2 className="text-sm font-bold text-[#0F3D2E] pb-2 border-b border-stone-100 flex items-center gap-2">
                <Globe className="w-4 h-4 text-[#D4AF37]" />
                <span>أيقونات التواصل الاجتماعي في الملف الشخصي</span>
              </h2>

              <p className="text-xs text-stone-500">
                أدخل روابط أو أرقام حساباتك لتظهر كأيقونات تفاعلية أنيقة في واجهة ملفك الشخصي:
              </p>

              <div className="space-y-4 max-w-lg">
                {/* WhatsApp */}
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1.5">
                    رقم واتساب (مع مفتاح الدولة، مثل 966501234567 أو 972501234567)
                  </label>
                  <input
                    type="text"
                    value={socialLinks.whatsapp || ''}
                    onChange={(e) => setSocialLinks({ ...socialLinks, whatsapp: e.target.value })}
                    placeholder="مثال: 966500000000"
                    className="w-full py-2.5 px-3.5 rounded-xl border border-stone-200 text-xs sm:text-sm focus:outline-none focus:border-[#0F3D2E]"
                  />
                </div>

                {/* LinkedIn */}
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1.5">رابط حساب لينكد إن (LinkedIn)</label>
                  <input
                    type="url"
                    value={socialLinks.linkedin || ''}
                    onChange={(e) => setSocialLinks({ ...socialLinks, linkedin: e.target.value })}
                    placeholder="https://linkedin.com/in/username"
                    className="w-full py-2.5 px-3.5 rounded-xl border border-stone-200 text-xs sm:text-sm focus:outline-none focus:border-[#0F3D2E]"
                  />
                </div>

                {/* X (Twitter) */}
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1.5">رابط أو معرف منصة X (تويتر)</label>
                  <input
                    type="text"
                    value={socialLinks.x || ''}
                    onChange={(e) => setSocialLinks({ ...socialLinks, x: e.target.value })}
                    placeholder="https://x.com/username أو @username"
                    className="w-full py-2.5 px-3.5 rounded-xl border border-stone-200 text-xs sm:text-sm focus:outline-none focus:border-[#0F3D2E]"
                  />
                </div>

                {/* GitHub */}
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1.5">رابط حساب جيت هب (GitHub)</label>
                  <input
                    type="url"
                    value={socialLinks.github || ''}
                    onChange={(e) => setSocialLinks({ ...socialLinks, github: e.target.value })}
                    placeholder="https://github.com/username"
                    className="w-full py-2.5 px-3.5 rounded-xl border border-stone-200 text-xs sm:text-sm focus:outline-none focus:border-[#0F3D2E]"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleSaveSocial}
                  className="px-6 py-2.5 rounded-xl bg-[#0F3D2E] text-white font-bold text-xs hover:bg-[#155A44] transition-all shadow cursor-pointer active:scale-95"
                >
                  حفظ أيقونات التواصل
                </button>
              </div>
            </div>
          )}

          {/* 5. Close Friends & Hide Story */}
          {activeSection === 'closeFriends' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-6">
              <h2 className="text-sm font-bold text-[#0F3D2E] pb-2 border-b border-stone-100 flex items-center gap-2">
                <Star className="w-4 h-4 text-emerald-600" />
                <span>إدارة الأصدقاء المقربين (Close Friends) وإخفاء الستوري</span>
              </h2>

              <p className="text-xs text-stone-500 leading-relaxed">
                يمكنك هنا إضافة أو إزالة المستخدمين من قائمة الأصدقاء المقربين لتخصيص تغريدات وقصص لا يراها سواهم، كما يمكنك تحديد من تريد إخفاء قصصك عنه كلياً.
              </p>

              <div className="space-y-3 pt-2">
                <div className="text-xs font-bold text-stone-700">قائمة مستخدمي المنصة:</div>
                <div className="space-y-2">
                  {otherUsers.map((u) => {
                    const isCloseFriend = (currentUser.closeFriends || []).includes(u.id);
                    const isStoryHidden = (currentUser.hiddenStoryUserIds || []).includes(u.id);

                    return (
                      <div
                        key={u.id}
                        className="flex items-center justify-between p-3.5 rounded-2xl border border-stone-200 bg-white hover:bg-stone-50/50 transition-all"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={u.profileImage}
                            alt={u.username}
                            className="w-10 h-10 rounded-full object-cover border border-[#D4AF37]"
                          />
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-bold text-stone-900">{u.fullName}</span>
                              <VerificationBadge type={u.verificationBadge || (u.verified ? 'blue' : 'none')} size="xs" />
                            </div>
                            <span className="text-[11px] text-stone-400 font-mono">@{u.username}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {/* Close Friend Button */}
                          <button
                            type="button"
                            onClick={() => toggleCloseFriend(u.id)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                              isCloseFriend
                                ? 'bg-emerald-600 text-white shadow-sm'
                                : 'bg-stone-100 text-stone-700 hover:bg-emerald-50 hover:text-emerald-700'
                            }`}
                          >
                            <Star className={`w-3.5 h-3.5 ${isCloseFriend ? 'fill-white' : ''}`} />
                            <span>{isCloseFriend ? 'صديق مقرب ⭐' : 'إضافة للأصدقاء المقربين'}</span>
                          </button>

                          {/* Hide Story Button */}
                          <button
                            type="button"
                            onClick={() => toggleHideStoryFromUser(u.id)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                              isStoryHidden
                                ? 'bg-amber-600 text-white shadow-sm'
                                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                            }`}
                            title="إخفاء القصص والستوري عن هذا المستخدم"
                          >
                            <EyeOff className="w-3.5 h-3.5" />
                            <span>{isStoryHidden ? 'الستوري مخفي عنه' : 'إخفاء الستوري'}</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* 6. Verification Badges & Subscriptions */}
          {activeSection === 'verification' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-6">
              <div className="pb-2 border-b border-stone-100">
                <h2 className="text-sm font-bold text-[#0F3D2E] flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                  <span>نظام التوثيق الرسمي</span>
                </h2>
                <p className="text-xs text-stone-500 mt-1">
                  توثيق الهوية والمرجعية يتم عبر إثباتات رسمية ورسوم سنوية، ويُمنح عبر إدارة المنصة فقط — لا يمكن شراؤه أو طلبه ذاتياً.
                </p>
              </div>

              {/* Locked Notice */}
              <div className="flex items-center gap-3 p-4 rounded-2xl border border-stone-200 bg-stone-50">
                <div className="w-10 h-10 shrink-0 rounded-xl bg-[#0F3D2E]/10 text-[#0F3D2E] flex items-center justify-center">
                  <Lock className="w-5 h-5" />
                </div>
                <p className="text-xs font-bold text-stone-700 leading-relaxed">
                  نظام التوثيق مُغلق حالياً في كل المنصة. لا يمكن لأي مستخدم تقديم طلب أو شراء شارة توثيق، وسيُفتح بعد تجهيز شروط الإثبات والرسوم في مرحلة لاحقة.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Blue Badge Card */}
                <div className="p-5 rounded-2xl border-2 border-sky-300 bg-sky-50/40 space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <VerificationBadge type="blue" size="md" />
                      <h3 className="text-sm font-bold text-sky-950">الشارة الزرقاء</h3>
                    </div>
                    <span className="text-[10px] font-bold text-sky-600 bg-sky-100 rounded-full px-2 py-0.5">قريباً</span>
                  </div>
                  <p className="text-xs text-sky-800 leading-relaxed">
                    للمؤثرين، الكتّاب والمبدعين والجمهور العام. تتطلب إثبات الهوية والمرجعية ورسوم اشتراك سنوية تُعلن لاحقاً.
                  </p>
                </div>

                {/* Gold Badge Card */}
                <div className="p-5 rounded-2xl border-2 border-amber-300 bg-amber-50/40 space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <VerificationBadge type="gold" size="md" />
                      <h3 className="text-sm font-bold text-amber-950">الشارة الذهبية</h3>
                    </div>
                    <span className="text-[10px] font-bold text-amber-600 bg-amber-100 rounded-full px-2 py-0.5">للإدارة فقط</span>
                  </div>
                  <p className="text-xs text-amber-800 leading-relaxed">
                    حصرية لمشرفي المنصة والحساب الرسمي للمالك @y فقط، ولا تُمنح لأي حساب آخر.
                  </p>
                </div>
              </div>

              {/* Current Badge Display */}
              {currentUser.verificationBadge && currentUser.verificationBadge !== 'none' && (
                <div className="p-4 rounded-2xl border border-[#D4AF37]/40 bg-gradient-to-l from-[#0F3D2E]/5 to-[#D4AF37]/10 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-[#0F3D2E]" />
                    <span className="text-xs font-bold text-stone-800">شارتك الحالية:</span>
                    <VerificationBadge type={currentUser.verificationBadge as VerificationBadgeType} size="sm" />
                  </div>
                  <span className="text-[10px] font-bold text-stone-500">
                    تُمنح عبر إدارة المنصة فقط ولا يمكن تغييرها من الإعدادات
                  </span>
                </div>
              )}
            </div>
          )}

          {/* 7. Blocked Users Section */}
          {activeSection === 'blocks' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-6">
              <h2 className="text-sm font-bold text-[#0F3D2E] pb-2 border-b border-stone-100 flex items-center gap-2">
                <UserX className="w-4 h-4 text-red-600" />
                <span>قائمة المستخدمين المحظورين</span>
              </h2>

              <p className="text-xs text-stone-500">
                المستخدمون في هذه القائمة لن يتمكنوا من التفاعل معك أو مراسلتك ولن تظهر منشوراتهم في خطك الزمني.
              </p>

              <div className="space-y-3 pt-2">
                {(currentUser.blockedUserIds || []).length === 0 ? (
                  <div className="p-8 text-center text-xs text-stone-400 bg-stone-50 rounded-2xl border border-stone-200">
                    لا يوجد مستخدمون في قائمة الحظر حالياً.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {(currentUser.blockedUserIds || []).map((bUserId) => {
                      const bUser = users.find((u) => u.id === bUserId);
                      return (
                        <div
                          key={bUserId}
                          className="flex items-center justify-between p-3.5 rounded-2xl border border-stone-200 bg-white"
                        >
                          <div className="flex items-center gap-3">
                            <img
                              src={bUser?.profileImage || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80'}
                              alt="محظور"
                              className="w-10 h-10 rounded-full object-cover grayscale"
                            />
                            <div>
                              <span className="text-xs font-bold text-stone-900 block">
                                {bUser?.fullName || 'مستخدم'}
                              </span>
                              <span className="text-[11px] text-stone-400 font-mono">
                                @{bUser?.username || bUserId}
                              </span>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => toggleBlockUser(bUserId)}
                            className="px-3.5 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold transition-colors cursor-pointer"
                          >
                            إلغاء الحظر
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <DeactivateAccountModal
        isOpen={showDeactivateModal}
        onClose={() => setShowDeactivateModal(false)}
        onConfirmDeactivate={() => {
          setShowDeactivateModal(false);
          deactivateAccount();
        }}
      />
    </div>
  );
};
