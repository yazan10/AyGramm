import React, { useState, useEffect } from 'react';
import {
  ArrowRight,
  Check,
  CheckCircle2,
  AlertCircle,
  Camera,
  Trash2,
  Plus,
  Link as LinkIcon,
  Globe,
  MapPin,
  Calendar,
  Sparkles,
  Shield,
  Palette,
  ExternalLink,
  MessageCircle,
  Briefcase,
  User as UserIcon,
  Smartphone,
  Eye,
  EyeOff
} from 'lucide-react';
import { useAyGram } from '../context/AyGramContext';
import {
  AccountType,
  BirthDatePrivacy,
  Gender,
  ProfileLink,
  SocialLinks
} from '../types/aygram';
import { ProfileImageUploader } from './ProfileImageUploader';
import { ProfileColorPicker } from './ProfileColorPicker';
import { DeactivateAccountModal } from './DeactivateAccountModal';

const NATIONALITY_OPTIONS = [
  { name: 'المملكة العربية السعودية', currency: 'SAR', flag: '🇸🇦' },
  { name: 'إسرائيل (عرب الداخل)', currency: 'ILS', flag: '🇮🇱' },
  { name: 'فلسطين', currency: 'ILS', flag: '🇵🇸' },
  { name: 'الإمارات العربية المتحدة', currency: 'AED', flag: '🇦🇪' },
  { name: 'جمهورية مصر العربية', currency: 'EGP', flag: '🇪🇬' },
  { name: 'المملكة الأردنية الهاشمية', currency: 'JOD', flag: '🇯🇴' },
  { name: 'الكويت', currency: 'KWD', flag: '🇰🇼' },
  { name: 'قطر', currency: 'QAR', flag: '🇶🇦' },
  { name: 'سلطنة عمان', currency: 'OMR', flag: '🇴🇲' },
  { name: 'البحرين', currency: 'BHD', flag: '🇧🇭' },
  { name: 'المغرب', currency: 'MAD', flag: '🇲🇦' },
  { name: 'الجزائر', currency: 'DZD', flag: '🇩🇿' },
  { name: 'تونس', currency: 'TND', flag: '🇹🇳' },
  { name: 'العراق', currency: 'IQD', flag: '🇮🇶' },
  { name: 'لبنان', currency: 'LBP', flag: '🇱🇧' },
  { name: 'اليمن', currency: 'YER', flag: '🇾🇪' },
  { name: 'السودان', currency: 'SDG', flag: '🇸🇩' },
  { name: 'أخرى', currency: 'USD', flag: '🌐' }
];

export const EditProfileView: React.FC = () => {
  const {
    currentUser,
    users,
    updateFullProfile,
    setActiveView,
    viewUserProfile,
    deactivateAccount,
    showToast
  } = useAyGram();

  if (!currentUser) return null;

  // Profile Form States
  const [fullName, setFullName] = useState(currentUser.fullName || '');
  const [username, setUsername] = useState(currentUser.username || '');
  const [bio, setBio] = useState(currentUser.bio || '');
  const [profileImage, setProfileImage] = useState(currentUser.profileImage || '');
  const [profileColor, setProfileColor] = useState(currentUser.profileColor || '#0F3D2E');
  const [accountType, setAccountType] = useState<AccountType>(currentUser.accountType || 'personal');
  const [nationality, setNationality] = useState(currentUser.nationality || 'المملكة العربية السعودية');
  const [currency, setCurrency] = useState(currentUser.currency || 'SAR');
  const [location, setLocation] = useState(currentUser.location || '');
  const [gender, setGender] = useState<Gender>(currentUser.gender || 'unspecified');
  const [birthDate, setBirthDate] = useState(currentUser.birthDate || '');
  const [birthDatePrivacy, setBirthDatePrivacy] = useState<BirthDatePrivacy>(
    currentUser.birthDatePrivacy || 'public'
  );
  const [showActivityStatus, setShowActivityStatus] = useState<boolean>(
    currentUser.showActivityStatus ?? true
  );

  // Links State (Up to 6 links like Instagram)
  const [links, setLinks] = useState<ProfileLink[]>(currentUser.links || []);
  const [newLinkTitle, setNewLinkTitle] = useState('');
  const [newLinkUrl, setNewLinkUrl] = useState('');
  const [isAddingLink, setIsAddingLink] = useState(false);

  // Social Links State
  const [socialLinks, setSocialLinks] = useState<SocialLinks>(currentUser.socialLinks || {});

  // UI status
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setFullName(currentUser.fullName || '');
      setUsername(currentUser.username || '');
      setBio(currentUser.bio || '');
      setProfileImage(currentUser.profileImage || '');
      setProfileColor(currentUser.profileColor || '#0F3D2E');
      setAccountType(currentUser.accountType || 'personal');
      setNationality(currentUser.nationality || 'المملكة العربية السعودية');
      setCurrency(currentUser.currency || 'SAR');
      setLocation(currentUser.location || '');
      setGender(currentUser.gender || 'unspecified');
      setBirthDate(currentUser.birthDate || '');
      setBirthDatePrivacy(currentUser.birthDatePrivacy || 'public');
      setShowActivityStatus(currentUser.showActivityStatus ?? true);
      setLinks(currentUser.links || []);
      setSocialLinks(currentUser.socialLinks || {});
    }
  }, [currentUser]);

  const handleBackToProfile = () => {
    if (currentUser) {
      viewUserProfile(currentUser);
    } else {
      setActiveView('profile');
    }
  };

  const handleNationalityChange = (val: string) => {
    setNationality(val);
    const item = NATIONALITY_OPTIONS.find((n) => n.name === val);
    if (item) setCurrency(item.currency);
  };

  const handleAddLink = () => {
    if (!newLinkTitle.trim() || !newLinkUrl.trim()) return;
    if (links.length >= 6) {
      showToast('الحد الأقصى للروابط هو 6 روابط', 'warning');
      return;
    }
    let formattedUrl = newLinkUrl.trim();
    if (!/^https?:\/\//i.test(formattedUrl)) {
      formattedUrl = 'https://' + formattedUrl;
    }
    const newEntry: ProfileLink = {
      id: Date.now().toString(),
      title: newLinkTitle.trim(),
      url: formattedUrl
    };
    setLinks([...links, newEntry]);
    setNewLinkTitle('');
    setNewLinkUrl('');
    setIsAddingLink(false);
  };

  const handleRemoveLink = (id: string) => {
    setLinks(links.filter((l) => l.id !== id));
  };

  const handleSave = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError('');
    setSuccess('');

    // Full name check
    if (!fullName.trim()) {
      setError('الاسم الكامل مطلوب');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // Username validation
    const cleanUsername = username.trim().toLowerCase().replace(/^@/, '');
    if (!cleanUsername) {
      setError('اسم المستخدم مطلوب');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const usernameRegex = /^[a-zA-Z0-9_.]+$/;
    if (!usernameRegex.test(cleanUsername)) {
      setError('اسم المستخدم يجب أن يحتوي فقط على أحرف إنجليزية، أرقام، شرطة سفلية (_) أو نقطة (.)');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (cleanUsername.length < 2 || cleanUsername.length > 30) {
      setError('اسم المستخدم يجب أن يكون بين حرفين و 30 حرفاً');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    // Check if taken by another user
    const isTaken = users.some(
      (u) => u.id !== currentUser.id && u.username.toLowerCase() === cleanUsername
    );
    if (isTaken) {
      setError('اسم المستخدم هذا محجوز ومستخدم من قبل حساب آخر، اختر اسماً آخر');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setIsSaving(true);

    try {
      updateFullProfile({
        fullName: fullName.trim(),
        username: cleanUsername,
        bio: bio.slice(0, 150).trim(),
        profileImage: profileImage.trim() || currentUser.profileImage,
        profileColor: profileColor || '#0F3D2E',
        accountType,
        nationality,
        currency,
        location: location.trim() || undefined,
        gender,
        birthDate: birthDate || undefined,
        birthDatePrivacy,
        links,
        socialLinks,
        showActivityStatus
      });

      setSuccess('تم حفظ جميع تعديلات الملف الشخصي بنجاح!');
      showToast('تم تحديث ملفك الشخصي بنجاح!', 'success');

      setTimeout(() => {
        setIsSaving(false);
        handleBackToProfile();
      }, 750);
    } catch (err: any) {
      setIsSaving(false);
      setError(err?.message || 'حدث خطأ أثناء الحفظ، يرجى المحاولة مرة أخرى.');
    }
  };

  return (
    <div
      className="max-w-2xl mx-auto space-y-6 font-['IBM_Plex_Sans_Arabic']"
      dir="rtl"
      style={{ '--pv-primary': profileColor } as React.CSSProperties}
    >
      {/* Instagram-Style Top Navigation Bar */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-stone-200 shadow-sm flex items-center justify-between gap-4 sticky top-18 z-20 backdrop-blur-md bg-white/95">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleBackToProfile}
            className="p-2 rounded-xl hover:bg-stone-100 text-stone-700 transition-colors cursor-pointer active:scale-95 flex items-center gap-1 text-xs font-bold"
            title="العودة للملف الشخصي"
          >
            <ArrowRight className="w-5 h-5 text-stone-700" />
            <span className="hidden sm:inline">إلغاء</span>
          </button>
          <div>
            <h1 className="text-base sm:text-lg font-black text-stone-900 leading-tight">
              تعديل الملف الشخصي
            </h1>
            <p className="text-[11px] text-stone-400 font-mono">
              @{currentUser.username}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="px-5 py-2 rounded-xl bg-[#0F3D2E] text-[#D4AF37] hover:bg-[#155A44] font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer flex items-center gap-2 active:scale-95 disabled:opacity-50"
          >
            {isSaving ? (
              <span className="inline-block w-4 h-4 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
            ) : (
              <Check className="w-4 h-4 text-[#D4AF37]" />
            )}
            <span>تم / حفظ</span>
          </button>
        </div>
      </div>

      {/* Feedback Alerts */}
      {error && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-xs font-bold text-red-700 flex items-center gap-2 animate-in fade-in">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800 flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {/* Card 1: Avatar & Cover Color Strip (Instagram Style) */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden">
        <div className="h-2.5 bg-gradient-to-l from-[#D4AF37] via-[var(--pv-primary)] to-[#D4AF37]" />
        <div className="p-6 sm:p-8 flex flex-col items-center text-center gap-4 bg-gradient-to-b from-stone-50/70 to-white">
          <div className="relative">
            <ProfileImageUploader
              value={profileImage}
              onChange={setProfileImage}
              size={110}
              ring={true}
            />
          </div>

          <div className="space-y-1">
            <h3 className="font-bold text-sm text-stone-800">
              صورة الملف الشخصي
            </h3>
            <p className="text-xs text-stone-400 max-w-sm leading-relaxed">
              انقر على أيقونة الكاميرا لاختيار صورة من جهازك، وسيتم تطبيق القص الدائري المميز مثل انستغرام تلقائياً.
            </p>
          </div>

          {profileImage && profileImage !== currentUser.profileImage && (
            <button
              type="button"
              onClick={() => setProfileImage(currentUser.profileImage)}
              className="text-xs text-stone-500 hover:text-red-600 underline cursor-pointer transition-colors"
            >
              استعادة الصورة الأصلية
            </button>
          )}
        </div>
      </div>

      {/* Card 2: Basic Identity Information */}
      <div className="bg-white rounded-3xl p-5 sm:p-7 border border-stone-200 shadow-sm space-y-5">
        <div className="flex items-center gap-2 text-xs font-bold text-[#0F3D2E] pb-2 border-b border-stone-100">
          <UserIcon className="w-4 h-4 text-[#D4AF37]" />
          <span>المعلومات الأساسية والهوية</span>
        </div>

        {/* Full Name */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-stone-800">
            الاسم الكامل
          </label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="الاسم الذي يظهر للجميع..."
            className="w-full py-2.5 px-4 rounded-xl border border-stone-200 text-xs sm:text-sm focus:outline-none focus:border-[#0F3D2E] transition-colors"
          />
          <p className="text-[11px] text-stone-400">
            ساعد الأشخاص في اكتشاف حسابك باستخدام اسمك الكامل أو لقبك أو اسم نشاطك التجاري.
          </p>
        </div>

        {/* Username */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-stone-800">
            اسم المستخدم (المعرف الفريد)
          </label>
          <div className="relative">
            <span className="absolute start-3.5 top-1/2 -translate-y-1/2 text-stone-400 font-mono text-sm font-bold select-none">
              @
            </span>
            <input
              type="text"
              dir="ltr"
              value={username}
              onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-zA-Z0-9_.]/g, ''))}
              placeholder="username"
              className="w-full ps-8 pe-4 py-2.5 rounded-xl border border-stone-200 text-xs sm:text-sm font-mono focus:outline-none focus:border-[#0F3D2E] transition-colors text-start"
            />
          </div>
          <p className="text-[11px] text-stone-400">
            معرف حسابك الفريد في الروابط والإشارات. مسموح بالأحرف الإنجليزية، الأرقام، الشرطة السفلية (_) والنقاط.
          </p>
        </div>

        {/* Bio */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-bold text-stone-800">
              السيرة الذاتية (النبذة التعريفية - البايو)
            </label>
            <span
              className={`text-[11px] font-mono font-bold ${
                150 - bio.length < 15 ? 'text-amber-600' : 'text-stone-400'
              }`}
            >
              {150 - bio.length} / 150 حرفاً
            </span>
          </div>
          <textarea
            rows={3}
            maxLength={150}
            value={bio}
            onChange={(e) => setBio(e.target.value.slice(0, 150))}
            placeholder="اكتب نبذة مختصرة عنك، اهتماماتك، أو نشاطك..."
            className="w-full p-3.5 rounded-xl border border-stone-200 text-xs sm:text-sm focus:outline-none focus:border-[#0F3D2E] resize-none leading-relaxed transition-colors"
          />
          <p className="text-[11px] text-stone-400">
            تظهر النبذة في أعلى ملفك الشخصي تحت الاسم مباشرة.
          </p>
        </div>
      </div>

      {/* Card 3: Links (Instagram dedicated Links Section) */}
      <div className="bg-white rounded-3xl p-5 sm:p-7 border border-stone-200 shadow-sm space-y-5">
        <div className="flex items-center justify-between pb-2 border-b border-stone-100">
          <div className="flex items-center gap-2 text-xs font-bold text-[#0F3D2E]">
            <LinkIcon className="w-4 h-4 text-[#D4AF37]" />
            <span>الروابط والشبكات الاجتماعية ({links.length}/6)</span>
          </div>
          {links.length < 6 && !isAddingLink && (
            <button
              type="button"
              onClick={() => setIsAddingLink(true)}
              className="text-xs font-bold text-[#0F3D2E] hover:text-[#155A44] flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>إضافة رابط</span>
            </button>
          )}
        </div>

        {/* Existing Links List */}
        <div className="space-y-2.5">
          {links.length === 0 && !isAddingLink && (
            <p className="text-xs text-stone-400 text-center py-4 bg-stone-50 rounded-2xl border border-dashed border-stone-200">
              لم تقم بإضافة روابط خارجية لملفك الشخصي بعد.
            </p>
          )}

          {links.map((link) => (
            <div
              key={link.id}
              className="flex items-center justify-between gap-3 p-3 bg-stone-50 rounded-2xl border border-stone-200"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <ExternalLink className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <div className="truncate">
                  <p className="text-xs font-bold text-stone-800 truncate">
                    {link.title}
                  </p>
                  <p className="text-[11px] text-stone-400 truncate font-mono" dir="ltr">
                    {link.url}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleRemoveLink(link.id)}
                className="p-1.5 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer shrink-0"
                title="حذف الرابط"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        {/* Add Link Inline Form */}
        {isAddingLink && (
          <div className="p-4 bg-stone-50 rounded-2xl border border-[#0F3D2E]/20 space-y-3 animate-in fade-in">
            <h4 className="text-xs font-bold text-stone-800">إضافة رابط جديد</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <input
                type="text"
                value={newLinkTitle}
                onChange={(e) => setNewLinkTitle(e.target.value)}
                placeholder="عنوان الرابط (مثال: متجري، قناتي...)"
                className="py-2 px-3 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-[#0F3D2E] bg-white"
              />
              <input
                type="text"
                dir="ltr"
                value={newLinkUrl}
                onChange={(e) => setNewLinkUrl(e.target.value)}
                placeholder="https://example.com"
                className="py-2 px-3 rounded-xl border border-stone-200 text-xs font-mono focus:outline-none focus:border-[#0F3D2E] bg-white text-start"
              />
            </div>
            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setIsAddingLink(false)}
                className="px-3 py-1.5 text-xs text-stone-600 hover:bg-stone-200 rounded-xl cursor-pointer"
              >
                إلغاء
              </button>
              <button
                type="button"
                onClick={handleAddLink}
                disabled={!newLinkTitle.trim() || !newLinkUrl.trim()}
                className="px-4 py-1.5 bg-[#0F3D2E] text-white text-xs font-bold rounded-xl hover:bg-[#155A44] disabled:opacity-50 cursor-pointer"
              >
                تأكيد الإضافة
              </button>
            </div>
          </div>
        )}

        {/* Social Accounts Handles */}
        <div className="pt-3 border-t border-stone-100 space-y-3">
          <label className="block text-xs font-bold text-stone-700">
            حسابات التواصل الاجتماعي (اختياري)
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <span className="text-[11px] text-stone-500 block mb-1">واتساب (رقم أو رابط):</span>
              <input
                type="text"
                dir="ltr"
                value={socialLinks.whatsapp || ''}
                onChange={(e) => setSocialLinks({ ...socialLinks, whatsapp: e.target.value })}
                placeholder="+966xxxxxxxxx"
                className="w-full py-2 px-3 rounded-xl border border-stone-200 text-xs font-mono focus:outline-none focus:border-[#0F3D2E]"
              />
            </div>
            <div>
              <span className="text-[11px] text-stone-500 block mb-1">منصة X (تويتر سابقاً):</span>
              <input
                type="text"
                dir="ltr"
                value={socialLinks.x || ''}
                onChange={(e) => setSocialLinks({ ...socialLinks, x: e.target.value })}
                placeholder="@username"
                className="w-full py-2 px-3 rounded-xl border border-stone-200 text-xs font-mono focus:outline-none focus:border-[#0F3D2E]"
              />
            </div>
            <div>
              <span className="text-[11px] text-stone-500 block mb-1">لينكد إن (LinkedIn):</span>
              <input
                type="text"
                dir="ltr"
                value={socialLinks.linkedin || ''}
                onChange={(e) => setSocialLinks({ ...socialLinks, linkedin: e.target.value })}
                placeholder="https://linkedin.com/in/..."
                className="w-full py-2 px-3 rounded-xl border border-stone-200 text-xs font-mono focus:outline-none focus:border-[#0F3D2E]"
              />
            </div>
            <div>
              <span className="text-[11px] text-stone-500 block mb-1">جيت هاب (GitHub):</span>
              <input
                type="text"
                dir="ltr"
                value={socialLinks.github || ''}
                onChange={(e) => setSocialLinks({ ...socialLinks, github: e.target.value })}
                placeholder="username"
                className="w-full py-2 px-3 rounded-xl border border-stone-200 text-xs font-mono focus:outline-none focus:border-[#0F3D2E]"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Card 4: Demographics, Nationality, Location & Birthdate */}
      <div className="bg-white rounded-3xl p-5 sm:p-7 border border-stone-200 shadow-sm space-y-5">
        <div className="flex items-center gap-2 text-xs font-bold text-[#0F3D2E] pb-2 border-b border-stone-100">
          <Globe className="w-4 h-4 text-[#D4AF37]" />
          <span>المعلومات الشخصية والديموغرافية</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Nationality */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-stone-800">
              الجنسية والدولة
            </label>
            <select
              value={nationality}
              onChange={(e) => handleNationalityChange(e.target.value)}
              className="w-full py-2.5 px-3.5 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-[#0F3D2E] bg-white"
            >
              {NATIONALITY_OPTIONS.map((item) => (
                <option key={item.name} value={item.name}>
                  {item.flag} {item.name} ({item.currency})
                </option>
              ))}
            </select>
          </div>

          {/* Location */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-stone-800">
              الموقع الجغرافي (المدينة)
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-stone-400 absolute start-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="مثال: الرياض، دبي، القدس..."
                className="w-full ps-10 pe-3.5 py-2.5 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-[#0F3D2E]"
              />
            </div>
          </div>

          {/* Gender */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-stone-800">
              الجنس
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'male', label: 'ذكر 👨' },
                { id: 'female', label: 'أنثى 👩' },
                { id: 'unspecified', label: 'غير محدد' }
              ].map((g) => (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => setGender(g.id as Gender)}
                  className={`py-2 px-2 text-xs rounded-xl font-bold border transition-all cursor-pointer ${
                    gender === g.id
                      ? 'bg-[#0F3D2E] text-[#D4AF37] border-[#0F3D2E] shadow-xs'
                      : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                  }`}
                >
                  {g.label}
                </button>
              ))}
            </div>
          </div>

          {/* Preferred Currency */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-stone-800">
              عملة الحساب المفضلة
            </label>
            <input
              type="text"
              disabled
              value={currency}
              className="w-full py-2.5 px-3.5 rounded-xl border border-stone-200 bg-stone-100 text-xs font-mono text-stone-600"
            />
          </div>
        </div>

        {/* Birthdate & Privacy */}
        <div className="pt-3 border-t border-stone-100 space-y-2">
          <label className="block text-xs font-bold text-stone-800">
            تاريخ الميلاد ومستوى الخصوصية
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="relative">
              <Calendar className="w-4 h-4 text-stone-400 absolute start-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                className="w-full ps-10 pe-3.5 py-2.5 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-[#0F3D2E] bg-white font-mono"
              />
            </div>
            <select
              value={birthDatePrivacy}
              onChange={(e) => setBirthDatePrivacy(e.target.value as BirthDatePrivacy)}
              className="w-full py-2.5 px-3.5 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-[#0F3D2E] bg-white"
            >
              <option value="public">🌐 إظهار للجميع بالملف الشخصي</option>
              <option value="close_friends">⭐ للأصدقاء المقربين فقط</option>
              <option value="private">🔒 خاص (إخفاء تماماً)</option>
            </select>
          </div>
          <p className="text-[11px] text-stone-400">
            لن يتم مشاركة تاريخ ميلادك الكامل علناً إذا اخترت مستوى الخصوصية المقيد.
          </p>
        </div>
      </div>

      {/* Card 5: Profile Theme Color Customizer */}
      <div className="bg-white rounded-3xl p-5 sm:p-7 border border-stone-200 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-xs font-bold text-[#0F3D2E] pb-2 border-b border-stone-100">
          <Palette className="w-4 h-4 text-[#D4AF37]" />
          <span>تخصيص ثيم وألوان الملف الشخصي</span>
        </div>

        <p className="text-xs text-stone-500 leading-relaxed">
          اختر اللون المميز الذي يعكس هويتك، وسيتم تلوين شريط البروفايل، الأزرار، والهايلايت به تلقائياً.
        </p>

        <ProfileColorPicker
          value={profileColor}
          onChange={setProfileColor}
        />
      </div>

      {/* Card 6: Account Type (Instagram Professional Account switcher) */}
      <div className="bg-white rounded-3xl p-5 sm:p-7 border border-stone-200 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-xs font-bold text-[#0F3D2E] pb-2 border-b border-stone-100">
          <Briefcase className="w-4 h-4 text-[#D4AF37]" />
          <span>نوع وفئة الحساب (شخصي / أعمال / صانع محتوى)</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            {
              id: 'personal',
              title: 'شخصي',
              badge: 'افتراضي',
              desc: 'للأفراد والأصدقاء ومشاركة اللحظات اليومية.'
            },
            {
              id: 'creator',
              title: 'صانع محتوى',
              badge: 'مميز',
              desc: 'للمصممين، المبرمجين، الكتاب، والمؤثرين.'
            },
            {
              id: 'business',
              title: 'أعمال وتجاري',
              badge: 'احترافي',
              desc: 'للمتاجر، الشركات، والعلامات التجارية لربط المنتجات.'
            }
          ].map((type) => {
            const isSelected = accountType === type.id;
            return (
              <div
                key={type.id}
                onClick={() => setAccountType(type.id as AccountType)}
                className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between text-start ${
                  isSelected
                    ? 'border-[#0F3D2E] bg-[#0F3D2E]/5 shadow-xs'
                    : 'border-stone-200 hover:border-stone-300 bg-stone-50/50'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-bold text-xs text-stone-900">{type.title}</span>
                    <span
                      className={`text-[9px] px-2 py-0.5 rounded-full font-bold ${
                        isSelected
                          ? 'bg-[#0F3D2E] text-[#D4AF37]'
                          : 'bg-stone-200 text-stone-600'
                      }`}
                    >
                      {type.badge}
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-500 leading-relaxed">
                    {type.desc}
                  </p>
                </div>
                <div className="pt-3 flex items-center justify-end">
                  <div
                    className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                      isSelected
                        ? 'border-[#0F3D2E] bg-[#0F3D2E] text-white'
                        : 'border-stone-300'
                    }`}
                  >
                    {isSelected && <Check className="w-2.5 h-2.5" />}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Card 7: Activity Status & Privacy Toggle */}
      <div className="bg-white rounded-3xl p-5 sm:p-7 border border-stone-200 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-xs font-bold text-[#0F3D2E] pb-2 border-b border-stone-100">
          <Eye className="w-4 h-4 text-[#D4AF37]" />
          <span>حالة النشاط والخصوصية (Instagram Activity Status)</span>
        </div>

        <div className="flex items-center justify-between gap-4 p-3.5 bg-stone-50 rounded-2xl border border-stone-200">
          <div className="space-y-1">
            <span className="text-xs font-bold text-stone-800 block">
              إظهار حالة النشاط (متصل الآن)
            </span>
            <p className="text-[11px] text-stone-500 leading-relaxed">
              السماح للحسابات التي تتابعها ولمن تراسلهم برؤية وقت آخر نشاط لك أو متى كنت متصلاً على المنصة.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowActivityStatus(!showActivityStatus)}
            className={`w-12 h-6.5 rounded-full transition-colors relative cursor-pointer shrink-0 ${
              showActivityStatus ? 'bg-[#0F3D2E]' : 'bg-stone-300'
            }`}
          >
            <span
              className={`block w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${
                showActivityStatus ? '-translate-x-6' : '-translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Sticky Bottom Actions */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-stone-200 shadow-sm flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => setShowDeactivateModal(true)}
          className="text-xs font-bold text-red-600 hover:text-red-700 hover:underline cursor-pointer"
        >
          تعطيل أو إغلاق الحساب...
        </button>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleBackToProfile}
            className="px-5 py-2.5 rounded-xl border border-stone-200 hover:bg-stone-100 text-stone-700 font-bold text-xs transition-colors cursor-pointer"
          >
            إلغاء
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="px-7 py-2.5 rounded-xl bg-[#0F3D2E] text-[#D4AF37] hover:bg-[#155A44] font-bold text-xs shadow-md transition-all cursor-pointer flex items-center gap-2 active:scale-95 disabled:opacity-50"
          >
            {isSaving ? (
              <span className="inline-block w-3.5 h-3.5 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
            ) : (
              <Check className="w-4 h-4 text-[#D4AF37]" />
            )}
            <span>حفظ جميع التغييرات</span>
          </button>
        </div>
      </div>

      {/* Deactivation Modal */}
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
