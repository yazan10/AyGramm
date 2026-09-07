import React, { useState } from 'react';
import { Plus, X, ChevronRight, ChevronLeft, Sparkles, Image, BookOpen, Heart, Compass } from 'lucide-react';
import { User, ProfileHighlight } from '../types/aygram';
import { useAyGram } from '../context/AyGramContext';

interface ProfileHighlightsProps {
  user: User;
  isCurrentUser: boolean;
}

export const ProfileHighlights: React.FC<ProfileHighlightsProps> = ({ user, isCurrentUser }) => {
  const { showToast } = useAyGram();
  const [highlights, setHighlights] = useState<ProfileHighlight[]>(
    user.highlights && user.highlights.length > 0 ? user.highlights : []
  );

  // Active Highlight Viewer Modal
  const [activeHighlight, setActiveHighlight] = useState<ProfileHighlight | null>(null);
  const [activeItemIndex, setActiveItemIndex] = useState(0);

  // Create Highlight Modal
  const [isCreating, setIsCreating] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCover, setNewCover] = useState('');
  const [newCaption, setNewCaption] = useState('');

  const handleOpenHighlight = (hl: ProfileHighlight) => {
    setActiveHighlight(hl);
    setActiveItemIndex(0);
  };

  const handleNextItem = () => {
    if (!activeHighlight) return;
    if (activeItemIndex < activeHighlight.items.length - 1) {
      setActiveItemIndex((prev) => prev + 1);
    } else {
      setActiveHighlight(null);
    }
  };

  const handlePrevItem = () => {
    if (activeItemIndex > 0) {
      setActiveItemIndex((prev) => prev - 1);
    }
  };

  const handleCreateHighlight = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      showToast('يرجى تحديد عنوان لمجموعة الهايلايت', 'warning');
      return;
    }

    const defaultCover = newCover.trim() || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=300&auto=format&fit=crop&q=80';

    const newHl: ProfileHighlight = {
      id: 'hl_' + Date.now(),
      userId: user.id,
      title: newTitle.trim(),
      coverImage: defaultCover,
      createdAt: new Date().toISOString(),
      items: [
        {
          id: 'item_' + Date.now(),
          media: defaultCover,
          caption: newCaption.trim() || newTitle.trim(),
          createdAt: new Date().toISOString(),
        },
      ],
    };

    setHighlights((prev) => [...prev, newHl]);
    setIsCreating(false);
    setNewTitle('');
    setNewCover('');
    setNewCaption('');
    showToast('تمت إضافة الهايلايت بنجاح إلى ملفك الشخصي ✨', 'success');
  };

  return (
    <div className="py-3 border-b border-[#EFE9D9]">
      {/* Highlights List Header & Horizontal Scroll */}
      <div className="flex items-center gap-4 overflow-x-auto pb-2 scrollbar-none px-1">
        {/* Add Highlight Button (only for current user) */}
        {isCurrentUser && (
          <button
            onClick={() => setIsCreating(true)}
            className="flex flex-col items-center gap-1.5 shrink-0 group cursor-pointer"
          >
            <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-full border-2 border-dashed border-[#D4AF37] hover:border-[#0F3D2E] bg-stone-50 flex items-center justify-center transition-all group-hover:scale-105 group-hover:bg-[#0F3D2E]/5">
              <Plus className="w-6 h-6 text-[#0F3D2E] group-hover:rotate-90 transition-transform duration-300" />
            </div>
            <span className="text-[11px] font-bold text-stone-700 max-w-[70px] truncate text-center">
              جديد +
            </span>
          </button>
        )}

        {/* Highlight Items */}
        {highlights.map((hl) => (
          <button
            key={hl.id}
            onClick={() => handleOpenHighlight(hl)}
            className="flex flex-col items-center gap-1.5 shrink-0 group cursor-pointer"
          >
            <div className="relative p-0.5 rounded-full bg-linear-to-tr from-[#D4AF37] to-[#0F3D2E] group-hover:scale-105 transition-transform duration-200">
              <div className="p-0.5 bg-white rounded-full">
                <img
                  src={hl.coverImage}
                  alt={hl.title}
                  className="w-15 h-15 sm:w-17 sm:h-17 rounded-full object-cover"
                />
              </div>
            </div>
            <span className="text-[11px] font-medium text-stone-800 max-w-[75px] truncate text-center group-hover:text-[#0F3D2E] transition-colors">
              {hl.title}
            </span>
          </button>
        ))}
      </div>

      {/* Highlight Story Viewer Modal */}
      {activeHighlight && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-2 sm:p-4">
          <div className="relative w-full max-w-sm h-[85vh] max-h-[700px] bg-stone-950 rounded-3xl overflow-hidden shadow-2xl flex flex-col justify-between border border-stone-800">
            {/* Top Progress Bars */}
            <div className="absolute top-3 inset-x-3 z-30 flex gap-1.5">
              {activeHighlight.items.map((_, idx) => (
                <div
                  key={idx}
                  className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                    idx === activeItemIndex
                      ? 'bg-white'
                      : idx < activeItemIndex
                      ? 'bg-white/70'
                      : 'bg-white/25'
                  }`}
                />
              ))}
            </div>

            {/* Header info */}
            <div className="absolute top-6 inset-x-4 z-30 flex items-center justify-between text-white">
              <div className="flex items-center gap-2">
                <img
                  src={user.profileImage}
                  alt={user.username}
                  className="w-8 h-8 rounded-full border border-white/40 object-cover"
                />
                <div>
                  <div className="text-xs font-bold">{activeHighlight.title}</div>
                  <div className="text-[10px] text-white/70">@{user.username}</div>
                </div>
              </div>
              <button
                onClick={() => setActiveHighlight(null)}
                className="p-1 rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Main Media View */}
            <div className="w-full h-full relative flex items-center justify-center bg-black">
              <img
                src={activeHighlight.items[activeItemIndex]?.media}
                alt="Highlight content"
                className="w-full h-full object-cover"
              />

              {/* Tap Left / Right Controls */}
              <div
                onClick={handlePrevItem}
                className="absolute inset-y-0 start-0 w-1/3 cursor-pointer z-20"
              />
              <div
                onClick={handleNextItem}
                className="absolute inset-y-0 end-0 w-2/3 cursor-pointer z-20"
              />
            </div>

            {/* Bottom Caption */}
            {activeHighlight.items[activeItemIndex]?.caption && (
              <div className="absolute bottom-4 inset-x-4 z-30 bg-black/60 backdrop-blur-xs p-3 rounded-2xl text-white text-xs text-center border border-white/10">
                <p className="leading-relaxed">{activeHighlight.items[activeItemIndex].caption}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Create New Highlight Modal */}
      {isCreating && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-stone-200 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-sm font-bold text-[#0F3D2E] flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                إنشاء هايلايت جديد في البروفايل
              </h3>
              <button
                onClick={() => setIsCreating(false)}
                className="text-stone-400 hover:text-stone-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateHighlight} className="space-y-3">
              <div>
                <label className="text-xs font-medium text-stone-700 block mb-1">عنوان الهايلايت</label>
                <input
                  type="text"
                  required
                  placeholder="مثلاً: ذكريات 2026، تصاميم، مقالات..."
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-[#0F3D2E]"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-stone-700 block mb-1">رابط صورة الغلاف (اختياري)</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={newCover}
                  onChange={(e) => setNewCover(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-[#0F3D2E]"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-stone-700 block mb-1">ملاحظة أو وصف مبدئي</label>
                <textarea
                  placeholder="اكتب وصفاً أو مقولة تظهر مع الهايلايت..."
                  rows={2}
                  value={newCaption}
                  onChange={(e) => setNewCaption(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-[#0F3D2E] resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="px-4 py-2 text-xs font-medium text-stone-600 hover:bg-stone-100 rounded-xl cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold bg-[#0F3D2E] text-[#D4AF37] rounded-xl hover:bg-[#155A44] transition-colors cursor-pointer"
                >
                  حفظ الهايلايت
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
