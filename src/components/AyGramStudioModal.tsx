import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Camera,
  Image as ImageIcon,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Sliders,
  Send,
  Clock,
  Plus,
  Trash2
} from 'lucide-react';
import { useAyGram } from '../context/AyGramContext';

interface AyGramStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  target?: 'story' | 'post';
}

interface StudioMediaItem {
  id: string;
  dataUrl: string;
  name: string;
  timestamp: number;
}

const FILTER_PRESETS = [
  { id: 'none', label: 'عادي', css: 'none' },
  { id: 'gold', label: 'ذهبي أصيل', css: 'sepia(30%) saturate(140%) contrast(105%) hue-rotate(-10deg)' },
  { id: 'emerald', label: 'زمردي وقور', css: 'saturate(120%) hue-rotate(20deg) contrast(110%)' },
  { id: 'warm', label: 'دافئ', css: 'sepia(20%) saturate(130%) brightness(105%)' },
  { id: 'vivid', label: 'مشرق', css: 'saturate(160%) contrast(110%)' },
  { id: 'bw', label: 'أبيض وأسود', css: 'grayscale(100%) contrast(120%)' },
];

export const AyGramStudioModal: React.FC<AyGramStudioModalProps> = ({
  isOpen,
  onClose,
  target = 'story',
}) => {
  const { createStory, showToast, triggerPublishWithProgress } = useAyGram();

  // Permission state
  const [permissionGranted, setPermissionGranted] = useState<boolean>(() => {
    try {
      return localStorage.getItem('aygram_studio_permission') === 'granted';
    } catch {
      return false;
    }
  });

  // Media items stored in local studio cache
  const [mediaList, setMediaList] = useState<StudioMediaItem[]>([]);
  const [selectedMedia, setSelectedMedia] = useState<StudioMediaItem | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>('none');
  const [caption, setCaption] = useState<string>('');
  const [publishing, setPublishing] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const galleryInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  // Reset when opened
  useEffect(() => {
    if (isOpen) {
      setError('');
      setCaption('');
      setActiveFilter('none');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Handle granting permission
  const handleGrantPermission = async () => {
    try {
      // Try asking for camera permission if available
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true });
          // release stream immediately
          stream.getTracks().forEach((t) => t.stop());
        } catch {
          // Fall back gracefully; user may prefer file picking
        }
      }
      setPermissionGranted(true);
      try {
        localStorage.setItem('aygram_studio_permission', 'granted');
      } catch {
        // ignore
      }
      showToast('تم تفعيل صلاحيات استديو وكاميرا الهاتف بنجاح', 'success');
      // Automatically trigger file selector right away!
      setTimeout(() => {
        galleryInputRef.current?.click();
      }, 300);
    } catch {
      setPermissionGranted(true);
      galleryInputRef.current?.click();
    }
  };

  // Read files picked from phone
  const handleFilesChosen = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newItems: StudioMediaItem[] = [];
    const readPromises: Promise<void>[] = [];

    Array.from(files).forEach((file) => {
      if (!file.type.startsWith('image/')) return;
      const p = new Promise<void>((resolve) => {
        const reader = new FileReader();
        reader.onload = () => {
          const dataUrl = reader.result as string;
          newItems.push({
            id: `media_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
            dataUrl,
            name: file.name,
            timestamp: Date.now(),
          });
          resolve();
        };
        reader.onerror = () => resolve();
        reader.readAsDataURL(file);
      });
      readPromises.push(p);
    });

    Promise.all(readPromises).then(() => {
      if (newItems.length > 0) {
        setMediaList((prev) => [...newItems, ...prev]);
        setSelectedMedia(newItems[0]);
      }
    });

    e.target.value = '';
  };

  // Bake filter onto image canvas before publishing
  const applyFilterToCanvas = (dataUrl: string, filterCss: string): Promise<string> => {
    return new Promise((resolve) => {
      if (filterCss === 'none') {
        resolve(dataUrl);
        return;
      }
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth || 720;
        canvas.height = img.naturalHeight || 1280;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(dataUrl);
          return;
        }
        ctx.filter = filterCss;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', 0.9));
      };
      img.onerror = () => resolve(dataUrl);
      img.src = dataUrl;
    });
  };

  // Publish Story
  const handlePublishStory = async () => {
    if (!selectedMedia) {
      setError('يرجى اختيار صورة من استديو الهاتف');
      return;
    }

    setPublishing(true);
    setError('');

    try {
      const selectedFilterObj = FILTER_PRESETS.find((f) => f.id === activeFilter);
      const finalImage = await applyFilterToCanvas(
        selectedMedia.dataUrl,
        selectedFilterObj?.css || 'none'
      );

      // Close modal smoothly so user returns to feed and watches the upload progress toast
      onClose();

      await triggerPublishWithProgress({
        title: 'جاري نشر الستوري...',
        type: 'story',
        mediaPreview: finalImage,
        onExecute: async () => {
          return createStory({
            media: finalImage,
            type: 'image',
            caption: caption.trim() || undefined,
          });
        },
      });
    } catch {
      setError('حدث خطأ أثناء معالجة ونشر القصة');
      showToast('تعذر نشر القصة، حاول مرة أخرى', 'error');
    } finally {
      setPublishing(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md font-['IBM_Plex_Sans_Arabic']"
      dir="rtl"
    >
      <div className="relative w-full max-w-lg bg-stone-950 border border-stone-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh] text-white">
        
        {/* Top Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-stone-800 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#0F3D2E] text-[#D4AF37] flex items-center justify-center border border-[#D4AF37]/30">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">استديو وسائط AyGram للهاتف</h3>
              <p className="text-[10px] text-stone-400">إضافة القصص مباشرة من صور جهازك بدون روابط</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-stone-800 text-stone-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Hidden inputs for native phone gallery & camera */}
        <input
          ref={galleryInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleFilesChosen}
        />
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={handleFilesChosen}
        />

        {/* CONTENT AREA */}
        {!permissionGranted ? (
          /* Permission Request View */
          <div className="p-8 text-center space-y-5 my-auto">
            <div className="w-16 h-16 rounded-3xl bg-[#0F3D2E]/40 border border-[#D4AF37]/40 flex items-center justify-center mx-auto text-[#D4AF37] shadow-lg shadow-[#0F3D2E]/20">
              <ShieldCheck className="w-9 h-9" />
            </div>

            <div className="space-y-2 max-w-sm mx-auto">
              <h4 className="text-base font-black text-white">
                إذن الوصول إلى استديو وصور الهاتف
              </h4>
              <p className="text-xs text-stone-400 leading-relaxed">
                تطلب منصة <strong className="text-[#D4AF37]">AyGram</strong> الإذن بالوصول إلى ألبوم الصور والكاميرا في هاتفك لاختيار وتعديل الصور ونشر القصص اليومية بخصوصية وأمان تام.
              </p>
            </div>

            <div className="pt-2 flex flex-col gap-2 max-w-xs mx-auto">
              <button
                type="button"
                onClick={handleGrantPermission}
                className="w-full py-3.5 px-5 bg-[#0F3D2E] hover:bg-[#155A44] text-[#D4AF37] border border-[#D4AF37]/50 rounded-2xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all active:scale-95"
              >
                <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                <span>منح الصلاحية وفتح الاستديو الآن</span>
              </button>
              <button
                type="button"
                onClick={onClose}
                className="w-full py-2.5 text-xs text-stone-500 hover:text-stone-300 font-bold transition-colors cursor-pointer"
              >
                إلغاء
              </button>
            </div>
          </div>
        ) : (
          /* Studio Active View */
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {error && (
              <div className="p-3 rounded-xl bg-red-950/60 border border-red-800 text-xs font-bold text-red-200 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Quick action buttons to pick from gallery or take camera shot */}
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => galleryInputRef.current?.click()}
                className="py-3 px-4 bg-stone-900 hover:bg-stone-800 border border-stone-700 rounded-2xl flex items-center justify-center gap-2 text-xs font-bold text-stone-200 transition-all cursor-pointer group active:scale-98"
              >
                <ImageIcon className="w-4 h-4 text-[#D4AF37] group-hover:scale-110 transition-transform" />
                <span>فتح ألبوم الهاتف</span>
              </button>

              <button
                type="button"
                onClick={() => cameraInputRef.current?.click()}
                className="py-3 px-4 bg-stone-900 hover:bg-stone-800 border border-stone-700 rounded-2xl flex items-center justify-center gap-2 text-xs font-bold text-stone-200 transition-all cursor-pointer group active:scale-98"
              >
                <Camera className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
                <span>التقاط بالكاميرا</span>
              </button>
            </div>

            {/* If no image selected yet */}
            {!selectedMedia && mediaList.length === 0 ? (
              <div
                onClick={() => galleryInputRef.current?.click()}
                className="border-2 border-dashed border-stone-800 rounded-3xl p-10 text-center space-y-3 cursor-pointer hover:border-[#D4AF37]/50 hover:bg-stone-900/40 transition-all"
              >
                <div className="w-12 h-12 rounded-2xl bg-stone-900 text-[#D4AF37] flex items-center justify-center mx-auto border border-stone-800">
                  <Plus className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-bold text-stone-300">اضغط لاختيار صورة من هاتفك</p>
                  <p className="text-[10px] text-stone-500 mt-1">الصور تبقى على جهازك وتُنشر مباشرة في قصتك</p>
                </div>
              </div>
            ) : null}

            {/* Selected Image Editor Preview */}
            {selectedMedia && (
              <div className="space-y-3">
                <div className="relative aspect-[9/14] sm:aspect-[9/13] max-h-[340px] w-full mx-auto bg-black rounded-3xl overflow-hidden border border-stone-800 flex items-center justify-center shadow-inner">
                  <img
                    src={selectedMedia.dataUrl}
                    alt="معاينة الستوري"
                    style={{
                      filter: FILTER_PRESETS.find((f) => f.id === activeFilter)?.css || 'none',
                    }}
                    className="w-full h-full object-cover transition-all duration-200"
                  />

                  {/* 24-Hour Timer Badge */}
                  <div className="absolute top-3 start-3 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-xs text-[10px] font-bold text-[#D4AF37] flex items-center gap-1 border border-white/10">
                    <Clock className="w-3 h-3" />
                    <span>تختفي بعد 24 ساعة</span>
                  </div>

                  {/* Delete / remove selected */}
                  <button
                    type="button"
                    onClick={() => {
                      setMediaList((prev) => prev.filter((m) => m.id !== selectedMedia.id));
                      setSelectedMedia(null);
                    }}
                    className="absolute top-3 end-3 p-2 rounded-full bg-black/60 hover:bg-red-900 text-stone-300 hover:text-white transition-colors cursor-pointer"
                    title="حذف هذه الصورة"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Filter Selector */}
                <div className="space-y-1.5">
                  <div className="flex items-center gap-1.5 text-xs text-stone-400 font-bold px-1">
                    <Sliders className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>تأثيرات وفلاتر الاستديو:</span>
                  </div>
                  <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                    {FILTER_PRESETS.map((f) => (
                      <button
                        key={f.id}
                        type="button"
                        onClick={() => setActiveFilter(f.id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer border ${
                          activeFilter === f.id
                            ? 'bg-[#D4AF37] text-[#0F3D2E] border-[#D4AF37] shadow-sm'
                            : 'bg-stone-900 hover:bg-stone-800 text-stone-300 border-stone-800'
                        }`}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Caption Input */}
                <div>
                  <input
                    type="text"
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    placeholder="أضف عبارة، دعاء، أو لمحة طيبة مع القصة... (اختياري)"
                    maxLength={140}
                    className="w-full px-4 py-2.5 bg-stone-900 border border-stone-800 rounded-2xl text-xs text-white placeholder:text-stone-500 focus:outline-none focus:border-[#D4AF37] transition-colors"
                  />
                </div>
              </div>
            )}

            {/* Media Gallery Strip (Loaded from Phone) */}
            {mediaList.length > 1 && (
              <div className="space-y-1.5 pt-1">
                <div className="text-[11px] text-stone-400 font-bold px-1">
                  صور أخرى تم استيرادها من هاتفك:
                </div>
                <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                  {mediaList.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => setSelectedMedia(item)}
                      className={`relative w-14 h-14 rounded-xl overflow-hidden cursor-pointer shrink-0 border-2 transition-all ${
                        selectedMedia?.id === item.id
                          ? 'border-[#D4AF37] ring-2 ring-[#0F3D2E]'
                          : 'border-stone-800 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={item.dataUrl} alt="صورة" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Footer actions */}
        {permissionGranted && (
          <div className="px-5 py-3.5 border-t border-stone-800 flex items-center justify-between shrink-0 bg-stone-950">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-stone-400 hover:text-white transition-colors cursor-pointer"
            >
              إلغاء
            </button>

            <button
              type="button"
              onClick={handlePublishStory}
              disabled={!selectedMedia || publishing}
              className="px-6 py-2.5 rounded-xl bg-[#D4AF37] hover:bg-[#E5C358] text-[#0F3D2E] font-black text-xs transition-all flex items-center gap-2 cursor-pointer shadow-md active:scale-95 disabled:opacity-40 disabled:pointer-events-none"
            >
              <Send className="w-4 h-4" />
              <span>{publishing ? 'جارٍ النشر...' : 'نشر في قصتي الآن (24 ساعة)'}</span>
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
