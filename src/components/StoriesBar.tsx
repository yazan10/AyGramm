import React, { useState } from 'react';
import { Plus, Sparkles } from 'lucide-react';
import { useAyGram } from '../context/AyGramContext';
import { Story } from '../types/aygram';

interface StoriesBarProps {
  onOpenAddStory: () => void;
}

export const StoriesBar: React.FC<StoriesBarProps> = ({ onOpenAddStory }) => {
  const { stories, currentUser, setActiveStoryIndex } = useAyGram();

  return (
    <div className="bg-white rounded-[16px] p-3.5 border border-[#EFE9D9] shadow-aygram">
      <div className="flex items-center gap-3.5 overflow-x-auto no-scrollbar pb-1">
        
        {/* Add Story Circle */}
        <div
          onClick={onOpenAddStory}
          className="flex flex-col items-center gap-1.5 cursor-pointer shrink-0 group"
        >
          <div className="relative w-16 h-16 rounded-full p-0.5 border-2 border-dashed border-[#D4AF37] group-hover:border-[#0F3D2E] transition-all flex items-center justify-center bg-[#FCF9F0]">
            <img
              src={currentUser?.profileImage || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80'}
              alt="قصتي"
              className="w-13 h-13 rounded-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
            />
            <div className="absolute bottom-0 end-0 w-5 h-5 rounded-full bg-[#0F3D2E] text-[#D4AF37] flex items-center justify-center ring-2 ring-white shadow-aygram">
              <Plus className="w-3.5 h-3.5" />
            </div>
          </div>
          <span className="text-[11px] font-bold text-[#1A1A1A] max-w-[68px] truncate">
            إضافة قصة
          </span>
        </div>

        {/* Active Stories with Gold Rings */}
        {stories.map((story, index) => {
          return (
            <div
              key={story.id}
              onClick={() => setActiveStoryIndex(index)}
              className="flex flex-col items-center gap-1.5 cursor-pointer shrink-0 group"
            >
              {/* Golden Ring #D4AF37 */}
              <div className="w-16 h-16 rounded-full p-[2.5px] bg-gradient-to-tr from-[#D4AF37] via-[#f7e4a1] to-[#D4AF37] group-hover:scale-105 transition-transform shadow-gold">
                <div className="w-full h-full rounded-full p-[2px] bg-white">
                  <img
                    src={story.userAvatar}
                    alt={story.username}
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>
              </div>
              <span className="text-[11px] font-medium text-[#1A1A1A] max-w-[68px] truncate">
                {story.username}
              </span>
            </div>
          );
        })}

      </div>
    </div>
  );
};
