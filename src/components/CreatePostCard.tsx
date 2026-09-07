import React, { useState } from 'react';
import { Image, Tag, Send, AlertCircle, CheckCircle2, MessageSquare, X, Hash, MapPin, Star, AtSign } from 'lucide-react';
import { useAyGram } from '../context/AyGramContext';
import { HandLoadingScreen } from './HandLoadingScreen';

interface CreatePostCardProps {
  onOpenAuth: () => void;
}

const PRESET_TWEET_IMAGES = [
  { label: 'مساحة عمل وتقنية', url: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1000&q=80' },
  { label: 'تصميم وخطوط', url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1000&q=80' },
  { label: 'كتب وقراءة', url: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=1000&q=80' },
  { label: 'أعمال واستثمار', url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1000&q=80' },
];

const PRESET_LOCATIONS = [
  'الرياض، السعودية',
  'الناصرة، إسرائيل (عرب الداخل)',
  'القدس، فلسطين',
  'عكا، إسرائيل (عرب الداخل)',
  'دبي، الإمارات',
  'القاهرة، مصر',
  'عمان، الأردن',
  'الكويت',
  'الدوحة، قطر'
];

const MAX_TWEET_LENGTH = 250;
const MAX_HASHTAGS = 7;
const MAX_IMAGES = 5;

export const CreatePostCard: React.FC<CreatePostCardProps> = ({ onOpenAuth }) => {
  const { currentUser, users, createPost, checkContentForBlockedWords, triggerPublishWithProgress } = useAyGram();
  const [content, setContent] = useState('');
  const [showMediaPicker, setShowMediaPicker] = useState(false);
  const [showTagPicker, setShowTagPicker] = useState(false);
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [showMentionHelper, setShowMentionHelper] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [customImageUrl, setCustomImageUrl] = useState('');
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>(['محتوى_عربي', 'تغريد']);
  const [location, setLocation] = useState('');
  const [isCloseFriendsOnly, setIsCloseFriendsOnly] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isPublishing, setIsPublishing] = useState(false);

  if (!currentUser) {
    return (
      <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-sm text-center space-y-3">
        <div className="w-12 h-12 rounded-xl bg-[#0F3D2E]/10 text-[#0F3D2E] flex items-center justify-center mx-auto">
          <MessageSquare className="w-6 h-6" />
        </div>
        <h3 className="text-base font-bold text-[#0F3D2E]">
          شارك أفكارك وتغريداتك في مجتمع AyGram
        </h3>
        <p className="text-xs text-stone-500 max-w-md mx-auto">
          سجل دخولك بنقرة واحدة لتنشر تغريداتك، تتفاعل مع المبدعين، وتشارك في النقاشات الرقمية.
        </p>
        <button
          onClick={onOpenAuth}
          className="py-2.5 px-6 rounded-xl bg-[#0F3D2E] text-[#D4AF37] font-bold text-xs hover:bg-[#16503c] transition-colors shadow cursor-pointer active:scale-95"
        >
          تسجيل الدخول / إنشاء حساب
        </button>
      </div>
    );
  }

  // Real-time checking as user types
  const liveCheck = checkContentForBlockedWords(content);
  const remainingChars = MAX_TWEET_LENGTH - content.length;
  const isOverLimit = remainingChars < 0;

  const handleAddTag = () => {
    if (tags.length >= MAX_HASHTAGS) {
      setError(`الحد الأقصى المسموح به هو ${MAX_HASHTAGS} هاشتاغات فقط في المنشور الواحد`);
      return;
    }
    const clean = tagInput.trim().replace(/^#/, '');
    if (clean && !tags.includes(clean)) {
      setTags([...tags, clean]);
      setTagInput('');
      setError('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const insertMention = (usernameToInsert: string) => {
    setContent((prev) => (prev ? `${prev} @${usernameToInsert} ` : `@${usernameToInsert} `));
    setShowMentionHelper(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

const allImages = [customImageUrl.trim() ? customImageUrl.trim() : '', selectedImage || ''].filter(Boolean).slice(0, MAX_IMAGES);
    const finalImage = allImages.length > 0 ? allImages[0] : undefined;

    if (!content.trim()) {
      setError('يرجى كتابة نص التغريدة');
      return;
    }

    if (isOverLimit) {
      setError(`تجاوزت الحد الأقصى للأحرف بمقدار ${Math.abs(remainingChars)} حرفاً`);
      return;
    }

    if (tags.length > MAX_HASHTAGS) {
      setError(`مسموح بإضافة حتى ${MAX_HASHTAGS} هاشتاغات كحد أقصى`);
      return;
    }

    if (allImages.length > MAX_IMAGES) {
      setError(`مسموح بإرفاق حتى ${MAX_IMAGES} صورة فقط`);
      return;
    }

    setIsPublishing(true);
    triggerPublishWithProgress({
      title: 'جاري نشر التغريدة...',
      type: 'tweet',
      mediaPreview: finalImage,
      onExecute: async () => {
        return createPost({
          content: content.trim(),
          image: finalImage,
          images: allImages.length > 1 ? allImages : undefined,
          tags: tags.slice(0, MAX_HASHTAGS),
          location: location.trim() || undefined,
          isCloseFriendsOnly,
        });
      },
    }).then((res) => {
      setIsPublishing(false);

      if (res.success) {
        setContent('');
        setSelectedImage(null);
        setCustomImageUrl('');
        setShowMediaPicker(false);
        setShowTagPicker(false);
        setShowLocationPicker(false);
        setLocation('');
        setIsCloseFriendsOnly(false);
        if (res.isPending) {
          setSuccessMsg('تم إرسال التغريدة بنجاح، وهي قيد المراجعة التنظيمية قبل ظهورها.');
        } else {
          setSuccessMsg(isCloseFriendsOnly ? 'تم نشر التغريدة حصرياً للأصدقاء المقربين ⭐' : 'تم نشر تغريدتك بنجاح على الخط الزمني');
        }
        setTimeout(() => setSuccessMsg(''), 3500);
      } else {
        setError(res.error || 'تعذر نشر التغريدة');
      }
    }).catch(() => {
      setIsPublishing(false);
      setError('حدث خطأ أثناء محاولة نشر التغريدة');
    });
  };

  return (
    <div id="create-tweet-card" className="bg-white rounded-2xl p-4 sm:p-5 border border-stone-200 shadow-sm space-y-4">
      {/* Header Label */}
      <div className="flex items-center justify-between pb-2 border-b border-stone-100">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-[#0F3D2E] flex items-center gap-1.5">
            <MessageSquare className="w-3.5 h-3.5 text-[#D4AF37]" />
            غرّد الآن
          </span>

          {/* Close Friends Toggle Indicator */}
          <button
            type="button"
            onClick={() => setIsCloseFriendsOnly(!isCloseFriendsOnly)}
            className={`inline-flex items-center gap-1 text-[11px] px-2.5 py-0.5 rounded-full font-bold transition-all cursor-pointer ${
              isCloseFriendsOnly
                ? 'bg-emerald-600 text-white shadow-sm ring-2 ring-emerald-300'
                : 'bg-stone-100 text-stone-500 hover:bg-emerald-50 hover:text-emerald-700'
            }`}
            title="حصر التغريدة للأصدقاء المقربين فقط"
          >
            <Star className={`w-3 h-3 ${isCloseFriendsOnly ? 'fill-white text-white' : 'text-emerald-600'}`} />
            <span>{isCloseFriendsOnly ? 'أصدقاء مقربون فقط' : 'الجمهور العام'}</span>
          </button>
        </div>

        <span
          className={`text-xs font-mono font-bold ${
            remainingChars < 0
              ? 'text-red-600'
              : remainingChars < 20
              ? 'text-amber-600'
              : 'text-stone-400'
          }`}
        >
          {remainingChars}
        </span>
      </div>

      <div className="flex gap-3 items-start">
        <img
          src={currentUser.profileImage}
          alt={currentUser.username}
          className="w-10 h-10 rounded-full object-cover border border-[#D4AF37] shrink-0"
        />
        <div className="flex-1">
          <textarea
            rows={3}
            value={content}
            onChange={(e) => {
              setContent(e.target.value);
              if (error) setError('');
            }}
            placeholder="ماذا يخطر في بالك؟ شارك أفكارك في 250 حرفاً... (يدعم @منشن و #هاشتاغ، حتى 5 صور)"
            className="w-full p-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs sm:text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:border-[#0F3D2E] focus:bg-white resize-none transition-all"
          />

          {/* Real-time Content Warning */}
          {!liveCheck.isClean && (
            <div className="mt-2 p-2.5 rounded-xl bg-red-50 border border-red-200 text-xs font-bold text-red-800 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>
                تنبيه: يحتوي النص على كلمة محظورة في المنصة ({liveCheck.forbiddenWord}). يرجى الالتزام بمعايير المجتمع.
              </span>
            </div>
          )}

          {isPublishing && (
            <HandLoadingScreen
              isLoading={isPublishing}
              label="جاري نشر وبث التغريدة في مجتمع AyGram..."
            />
          )}

          {error && (
            <div className="mt-2 p-2.5 rounded-xl bg-red-50 border border-red-200 text-xs font-medium text-red-800 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="mt-2 p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-medium text-emerald-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}
        </div>
      </div>

      {/* Selected Location Pill */}
      {location && (
        <div className="flex items-center gap-1.5 bg-stone-100 text-stone-700 text-xs px-3 py-1.5 rounded-xl w-fit">
          <MapPin className="w-3.5 h-3.5 text-[#0F3D2E]" />
          <span className="font-medium">{location}</span>
          <button
            type="button"
            onClick={() => setLocation('')}
            className="hover:text-red-600 mr-1 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Selected Image Preview */}
      {(selectedImage || customImageUrl) && (
        <div className="relative rounded-xl overflow-hidden border border-stone-200 max-h-60 bg-stone-50">
          <img
            src={customImageUrl || selectedImage || ''}
            alt="معاينة المرفق"
            className="w-full h-full max-h-60 object-cover"
          />
          <button
            type="button"
            onClick={() => {
              setSelectedImage(null);
              setCustomImageUrl('');
            }}
            className="absolute top-2 end-2 p-1.5 rounded-full bg-black/70 text-white hover:bg-black/90 text-xs flex items-center gap-1 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
            <span>إزالة</span>
          </button>
        </div>
      )}

      {/* Media Picker Drawer */}
      {showMediaPicker && (
        <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 space-y-2.5">
          <div className="text-xs font-bold text-stone-700">اختر صورة معبّرة للتغريدة:</div>
          <div className="grid grid-cols-4 gap-2">
            {PRESET_TWEET_IMAGES.map((img, i) => (
              <div
                key={i}
                onClick={() => {
                  setSelectedImage(img.url);
                  setCustomImageUrl('');
                }}
                className={`aspect-video rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${
                  selectedImage === img.url
                    ? 'border-[#0F3D2E] ring-2 ring-[#D4AF37]'
                    : 'border-transparent hover:opacity-80'
                }`}
              >
                <img src={img.url} alt={img.label} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>

          <div className="pt-1">
            <input
              type="url"
              value={customImageUrl}
              onChange={(e) => {
                setCustomImageUrl(e.target.value);
                setSelectedImage(null);
              }}
              placeholder="أو الصق رابط صورة خارجية (URL)..."
              className="w-full py-1.5 px-3 rounded-lg bg-white border border-stone-200 text-xs focus:outline-none focus:border-[#0F3D2E]"
            />
          </div>
        </div>
      )}

      {/* Tag Picker Drawer (Max 7 limit with indicator) */}
      {showTagPicker && (
        <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-700">أضف وسوم التصنيف (الحد الأقصى 7):</span>
            <span className={`text-xs font-bold font-mono ${tags.length >= MAX_HASHTAGS ? 'text-amber-600' : 'text-stone-500'}`}>
              {tags.length} / {MAX_HASHTAGS}
            </span>
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={tagInput}
              disabled={tags.length >= MAX_HASHTAGS}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddTag();
                }
              }}
              placeholder={tags.length >= MAX_HASHTAGS ? 'وصلت للحد الأقصى (7 وسوم)' : 'اكتب الوسم بدون # واضغط إضافة...'}
              className="flex-1 py-1.5 px-3 rounded-lg bg-white border border-stone-200 text-xs focus:outline-none focus:border-[#0F3D2E] disabled:bg-stone-100"
            />
            <button
              type="button"
              disabled={tags.length >= MAX_HASHTAGS || !tagInput.trim()}
              onClick={handleAddTag}
              className="px-3 py-1.5 bg-[#0F3D2E] text-white rounded-lg text-xs font-bold hover:bg-[#155A44] disabled:bg-stone-200 disabled:text-stone-400 cursor-pointer"
            >
              إضافة
            </button>
          </div>
        </div>
      )}

      {/* Location Picker Drawer */}
      {showLocationPicker && (
        <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 space-y-2.5">
          <div className="text-xs font-bold text-stone-700">إضافة الموقع الجغرافي للمنشور:</div>
          <div className="flex flex-wrap gap-1.5">
            {PRESET_LOCATIONS.map((loc) => (
              <button
                key={loc}
                type="button"
                onClick={() => {
                  setLocation(loc);
                  setShowLocationPicker(false);
                }}
                className={`text-[11px] px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                  location === loc
                    ? 'bg-[#0F3D2E] text-white border-[#0F3D2E]'
                    : 'bg-white text-stone-700 border-stone-200 hover:border-[#0F3D2E]'
                }`}
              >
                {loc}
              </button>
            ))}
          </div>
          <div className="pt-1">
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="أو اكتب اسم المدينة/الدولة المخصصة..."
              className="w-full py-1.5 px-3 rounded-lg bg-white border border-stone-200 text-xs focus:outline-none focus:border-[#0F3D2E]"
            />
          </div>
        </div>
      )}

      {/* Mention helper list */}
      {showMentionHelper && (
        <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-2">
          <div className="text-xs font-bold text-stone-700">اختر مستخدماً للإشارة إليه (@منشن):</div>
          <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
            {users
              .filter((u) => u.id !== currentUser.id)
              .slice(0, 8)
              .map((u) => (
                <button
                  key={u.id}
                  type="button"
                  onClick={() => insertMention(u.username)}
                  className="flex items-center gap-1.5 bg-white border border-stone-200 hover:border-[#0F3D2E] px-2.5 py-1 rounded-lg text-xs transition-colors cursor-pointer"
                >
                  <img src={u.profileImage} alt={u.username} className="w-4 h-4 rounded-full object-cover" />
                  <span className="font-semibold text-stone-800">@{u.username}</span>
                </button>
              ))}
          </div>
        </div>
      )}

      {/* Active Tags list */}
      {tags.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] text-stone-400 font-mono font-medium">الهاشتاغات ({tags.length}/7):</span>
          {tags.map((t) => (
            <span
              key={t}
              className="inline-flex items-center gap-1 text-[11px] font-medium bg-[#0F3D2E]/10 text-[#0F3D2E] px-2.5 py-1 rounded-lg"
            >
              <Hash className="w-3 h-3 text-[#D4AF37]" />
              {t}
              <button
                type="button"
                onClick={() => handleRemoveTag(t)}
                className="hover:text-red-600 mr-0.5 cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Action Bar */}
      <div className="flex items-center justify-between pt-2 border-t border-stone-100">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setShowMediaPicker(!showMediaPicker)}
            className={`p-2 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
              showMediaPicker || selectedImage || customImageUrl
                ? 'bg-[#0F3D2E]/10 text-[#0F3D2E] font-bold'
                : 'text-stone-500 hover:bg-stone-100 hover:text-stone-800'
            }`}
            title="إرفاق صورة (حتى 5)"
          >
            <Image className="w-4 h-4 text-[#D4AF37]" />
            <span className="hidden sm:inline">صورة</span>
          </button>

          <button
            type="button"
            onClick={() => setShowTagPicker(!showTagPicker)}
            className={`p-2 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
              showTagPicker || tags.length > 0
                ? 'bg-[#0F3D2E]/10 text-[#0F3D2E] font-bold'
                : 'text-stone-500 hover:bg-stone-100 hover:text-stone-800'
            }`}
            title="هاشتاغات (حتى 7)"
          >
            <Tag className="w-4 h-4 text-[#D4AF37]" />
            <span className="hidden sm:inline">وسوم ({tags.length}/7)</span>
          </button>

          <button
            type="button"
            onClick={() => setShowLocationPicker(!showLocationPicker)}
            className={`p-2 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
              showLocationPicker || location
                ? 'bg-[#0F3D2E]/10 text-[#0F3D2E] font-bold'
                : 'text-stone-500 hover:bg-stone-100 hover:text-stone-800'
            }`}
            title="إضافة موقع"
          >
            <MapPin className="w-4 h-4 text-[#D4AF37]" />
            <span className="hidden sm:inline">الموقع</span>
          </button>

          <button
            type="button"
            onClick={() => setShowMentionHelper(!showMentionHelper)}
            className={`p-2 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
              showMentionHelper
                ? 'bg-[#0F3D2E]/10 text-[#0F3D2E] font-bold'
                : 'text-stone-500 hover:bg-stone-100 hover:text-stone-800'
            }`}
            title="إشارة لمستخدم @منشن"
          >
            <AtSign className="w-4 h-4 text-[#D4AF37]" />
            <span className="hidden sm:inline">منشن</span>
          </button>
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={!content.trim() || !liveCheck.isClean || isOverLimit}
          className={`px-5 py-2 rounded-xl font-bold text-xs flex items-center gap-2 transition-all ${
            !content.trim() || !liveCheck.isClean || isOverLimit
              ? 'bg-stone-200 text-stone-400 cursor-not-allowed'
              : 'bg-[#0F3D2E] hover:bg-[#155A44] text-white shadow active:scale-95 cursor-pointer'
          }`}
        >
          <Send className="w-3.5 h-3.5" />
          <span>تغريد</span>
        </button>
      </div>
    </div>
  );
};

