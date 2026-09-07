import React, { useEffect, useState } from 'react';
import { X, CheckCircle2, MapPin } from 'lucide-react';
import { useAyGram } from '../context/AyGramContext';
import { User } from '../types/aygram';
import { ProfileImageUploader } from './ProfileImageUploader';
import { ProfileColorPicker } from './ProfileColorPicker';

interface EditProfileModalProps {
  isOpen: boolean;
  user: User;
  onClose: () => void;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({ isOpen, user, onClose }) => {
  const { updateFullProfile } = useAyGram();

  const [fullName, setFullName] = useState('');
  const [bio, setBio] = useState('');
  const [profileImage, setProfileImage] = useState('');
  const [location, setLocation] = useState('');
  const [profileColor, setProfileColor] = useState('#0F3D2E');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (isOpen) {
      setFullName(user.fullName || '');
      setBio(user.bio || '');
      setProfileImage(user.profileImage || '');
      setLocation(user.location || '');
      setProfileColor(user.profileColor || '#0F3D2E');
      setError('');
      setSuccess('');
    }
  }, [isOpen, user]);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!fullName.trim()) {
      setError('الاسم الكامل مطلوب');
      return;
    }

    updateFullProfile({
      fullName: fullName.trim(),
      bio: bio.slice(0, 150).trim(),
      profileImage: profileImage.trim() || user.profileImage,
      location: location.trim() || undefined,
      profileColor: profileColor || undefined,
    });

    setSuccess('تم حفظ تعديلات الملف الشخصي بنجاح');
    setTimeout(onClose, 900);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200 font-['IBM_Plex_Sans_Arabic']"
      dir="rtl"
    >
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative z-10 bg-white rounded-2xl max-w-[720px] w-full shadow-2xl border border-stone-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-center px-5 py-3.5 border-b border-stone-100">
          <h2 className="text-sm font-bold text-stone-900">تعديل الملف الشخصي</h2>
          <button
            type="button"
            onClick={onClose}
            className="absolute end-4 p-1.5 rounded-full hover:bg-stone-100 text-stone-500 cursor-pointer"
            title="إغلاق"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {error && (
          <div className="mx-5 mt-4 p-2.5 rounded-xl bg-red-50 border border-red-200 text-xs font-bold text-red-700">
            {error}
          </div>
        )}
        {success && (
          <div className="mx-5 mt-4 p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            {success}
          </div>
        )}

        <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-6 p-6">
          {/* Avatar column (Instagram style) */}
          <div className="flex flex-col items-center gap-3">
            <ProfileImageUploader value={profileImage} onChange={setProfileImage} />

            <p className="text-[11px] text-stone-400 text-center leading-relaxed">
              يمكنك رفع صورة من جهازك مباشرة، وسيتم ضغطها تلقائياً لتناسب الملف الشخصي.
            </p>
          </div>

          {/* Fields column */}
          <div className="space-y-4">
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
              <label className="block text-xs font-bold text-stone-700 mb-1.5">
                اسم المستخدم (معرف الحساب)
              </label>
              <input
                type="text"
                disabled
                value={`@${user.username}`}
                className="w-full py-2.5 px-3.5 rounded-xl border border-stone-200 bg-stone-100 text-xs sm:text-sm text-stone-500 font-mono"
              />
              <p className="text-[11px] text-stone-400 mt-1">
                اسم المستخدم محمي ولا يمكن تغييره لضمان هوية الحساب.
              </p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-stone-700">النبذة التعريفية (البايو):</label>
                <span
                  className={`text-[11px] font-mono font-bold ${
                    150 - bio.length < 15 ? 'text-amber-600' : 'text-stone-400'
                  }`}
                >
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

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1.5">الموقع الجغرافي</label>
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

            <ProfileColorPicker
              value={profileColor}
              onChange={setProfileColor}
              className="pt-1"
            />
          </div>

          {/* Submit */}
          <div className="md:col-span-2 flex items-center justify-between gap-3 pt-4 border-t border-stone-100">
            <p className="text-[11px] text-stone-400">
              يمكنك التحكم ببقية الإعدادات (الروابط، نوع الحساب، الخصوصية...) من صفحة الإعدادات الكاملة.
            </p>
            <button
              type="submit"
              className="px-8 py-2.5 rounded-xl bg-[#0F3D2E] text-white font-bold text-xs hover:bg-[#155A44] transition-all shadow cursor-pointer active:scale-95"
            >
              إرسال
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};