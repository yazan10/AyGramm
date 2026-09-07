import React, { useState, useEffect, useCallback } from 'react';
import { X, ChevronRight, ChevronLeft, Heart, Send, Eye } from 'lucide-react';
import { useAyGram } from '../context/AyGramContext';

export const StoryViewer: React.FC = () => {
  const { stories, activeStoryIndex, setActiveStoryIndex } = useAyGram();
  const [progress, setProgress] = useState(0);
  const [liked, setLiked] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [sentReply, setSentReply] = useState(false);

  const isValidIndex = activeStoryIndex !== null && activeStoryIndex >= 0 && activeStoryIndex < stories.length;
  const currentStory = isValidIndex ? stories[activeStoryIndex] : null;

  // Next story handler safely wrapped in useCallback
  const handleNext = useCallback(() => {
    setActiveStoryIndex((prev) => {
      if (prev === null) return null;
      if (prev < stories.length - 1) {
        return prev + 1;
      }
      return null;
    });
  }, [stories.length, setActiveStoryIndex]);

  // Previous story handler safely wrapped in useCallback
  const handlePrev = useCallback(() => {
    setActiveStoryIndex((prev) => {
      if (prev === null) return null;
      if (prev > 0) {
        return prev - 1;
      }
      return prev;
    });
  }, [setActiveStoryIndex]);

  // If index is invalid while viewer is requested, safely reset index via effect
  useEffect(() => {
    if (activeStoryIndex !== null && !currentStory) {
      setActiveStoryIndex(null);
    }
  }, [activeStoryIndex, currentStory, setActiveStoryIndex]);

  // Reset timer and states when story changes
  useEffect(() => {
    if (!currentStory) return;
    setProgress(0);
    setLiked(false);
    setSentReply(false);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          return 100;
        }
        return prev + 2;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [activeStoryIndex, currentStory]);

  // Advance to next story when progress reaches 100% in a separate clean effect
  useEffect(() => {
    if (progress >= 100 && currentStory) {
      handleNext();
    }
  }, [progress, currentStory, handleNext]);

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    setSentReply(true);
    setReplyText('');
    setTimeout(() => {
      setSentReply(false);
    }, 2000);
  };

  if (activeStoryIndex === null || !currentStory) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center select-none font-['IBM_Plex_Sans_Arabic']" dir="rtl">
      
      {/* Background Dim Backdrop */}
      <div
        className="relative w-full max-w-md h-full sm:h-[90vh] sm:rounded-[24px] overflow-hidden bg-black flex flex-col justify-between shadow-2xl"
      >
        
        {/* Top Progress Bars */}
        <div className="absolute top-0 inset-x-0 z-30 p-3 bg-gradient-to-b from-black/70 to-transparent space-y-2.5">
          <div className="flex gap-1.5 w-full">
            {stories.map((s, idx) => {
              let fillWidth = '0%';
              if (idx < activeStoryIndex) fillWidth = '100%';
              else if (idx === activeStoryIndex) fillWidth = `${progress}%`;

              return (
                <div key={s.id || `story_bar_${idx}`} className="h-1 flex-1 bg-white/30 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#D4AF37] transition-all duration-100 ease-linear"
                    style={{ width: fillWidth }}
                  />
                </div>
              );
            })}
          </div>

          {/* User Info Header */}
          <div className="flex items-center justify-between text-white pt-1">
            <div className="flex items-center gap-2.5">
              <img
                src={currentStory.userAvatar}
                alt={currentStory.username}
                className="w-9 h-9 rounded-full object-cover border-2 border-[#D4AF37]"
              />
              <div>
                <h4 className="text-xs font-bold">{currentStory.username}</h4>
                <div className="flex items-center gap-2 text-[10px] text-white/80">
                  <span>منذ عدة ساعات</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Eye className="w-3 h-3 text-[#D4AF37]" />
                    <span>{currentStory.viewsCount} مشاهدة</span>
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setActiveStoryIndex(null)}
              className="p-1.5 rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Story Media (Image or Video) */}
        <div className="relative flex-1 w-full h-full flex items-center justify-center bg-black">
          <img
            src={currentStory.media}
            alt="القصة"
            className="w-full h-full object-cover"
          />

          {/* Touch navigation zones */}
          <div
            onClick={handlePrev}
            className="absolute start-0 inset-y-0 w-1/3 z-20 cursor-pointer"
            title="السابق"
          />
          <div
            onClick={handleNext}
            className="absolute end-0 inset-y-0 w-1/3 z-20 cursor-pointer"
            title="التالي"
          />
        </div>

        {/* Bottom Caption and Reply Bar */}
        <div className="absolute bottom-0 inset-x-0 z-30 p-4 bg-gradient-to-t from-black/80 via-black/50 to-transparent space-y-3">
          
          {currentStory.caption && (
            <p className="text-xs text-white bg-black/40 p-2.5 rounded-[12px] backdrop-blur-xs leading-relaxed">
              {currentStory.caption}
            </p>
          )}

          <div className="flex items-center gap-2">
            <form onSubmit={handleSendReply} className="flex-1 flex gap-2">
              <input
                type="text"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="إرسال رد على القصة..."
                className="flex-1 py-2 px-3.5 rounded-full bg-white/20 text-white placeholder-white/70 text-xs border border-white/20 focus:outline-none focus:border-[#D4AF37] backdrop-blur-xs"
              />
              <button
                type="submit"
                className="p-2 rounded-full bg-[#0F3D2E] text-[#D4AF37] hover:bg-[#16503c] transition-colors cursor-pointer"
              >
                <Send className="w-4 h-4 rotate-180" />
              </button>
            </form>

            <button
              onClick={() => setLiked(!liked)}
              className={`p-2 rounded-full backdrop-blur-xs transition-colors cursor-pointer ${
                liked ? 'bg-[#D4AF37] text-[#0F3D2E]' : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              <Heart className={`w-5 h-5 ${liked ? 'fill-[#0F3D2E]' : ''}`} />
            </button>
          </div>

          {sentReply && (
            <div className="text-[11px] text-center text-[#D4AF37] font-bold">
              تم إرسال ردك الخاص بنجاح ✨
            </div>
          )}

        </div>

      </div>

      {/* Desktop Prev/Next floating buttons */}
      {activeStoryIndex > 0 && (
        <button
          onClick={handlePrev}
          className="hidden sm:flex absolute start-10 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 text-white hover:bg-white/25 cursor-pointer z-40 transition-colors"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      )}

      {activeStoryIndex < stories.length - 1 && (
        <button
          onClick={handleNext}
          className="hidden sm:flex absolute end-10 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 text-white hover:bg-white/25 cursor-pointer z-40 transition-colors"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      )}

    </div>
  );
};
