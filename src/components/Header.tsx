import React from 'react';
import { Bell, Bookmark, LogIn, Compass } from 'lucide-react';
import { useAyGram } from '../context/AyGramContext';
import { AyGramLogo } from './AyGramLogo';
import { MobileSidebar } from './MobileSidebar';

interface HeaderProps {
  onOpenSecretAdmin: () => void;
  onOpenAuth: () => void;
  onOpenAddProduct: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenSecretAdmin, onOpenAuth, onOpenAddProduct }) => {
  const {
    currentUser,
    notifications,
    activeView,
    setActiveView,
    viewUserProfile
  } = useAyGram();

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <header className="sticky top-0 z-30 bg-[#FCF9F0]/90 backdrop-blur-xl border-b border-stone-200/90 shadow-[0_1px_0_rgba(15,61,46,0.04)]">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">

        {/* Mobile Hamburger Sidebar (visible only on mobile) */}
        <div className="lg:hidden">
          <MobileSidebar
            onOpenAuth={onOpenAuth}
            onOpenAddProduct={onOpenAddProduct}
            onSecretTrigger={onOpenSecretAdmin}
          />
        </div>

        {/* AyGram Logo with 6-click secret detection */}
        <AyGramLogo onSecretTrigger={onOpenSecretAdmin} size="md" />

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">

          {/* Explore Shortcut */}
          <button
            onClick={() => setActiveView('explore')}
            className={`hidden sm:flex p-2 rounded-xl transition-colors cursor-pointer ${
              activeView === 'explore'
                ? 'bg-[#0F3D2E] text-[#D4AF37]'
                : 'text-stone-600 hover:text-[#0F3D2E] hover:bg-black/5'
            }`}
            title="اكسبلور"
          >
            <Compass className="w-5 h-5" />
          </button>

          {/* Saved Posts Shortcut */}
          <button
            onClick={() => setActiveView('saved')}
            className={`hidden sm:flex p-2 rounded-xl transition-colors cursor-pointer ${
              activeView === 'saved'
                ? 'bg-[#0F3D2E] text-[#D4AF37]'
                : 'text-stone-600 hover:text-[#0F3D2E] hover:bg-black/5'
            }`}
            title="التغريدات المحفوظة"
          >
            <Bookmark className="w-5 h-5" />
          </button>

          {/* Notifications Bell */}
          <button
            onClick={() => setActiveView('notifications')}
            className={`p-2 rounded-xl relative transition-colors cursor-pointer ${
              activeView === 'notifications'
                ? 'bg-[#0F3D2E] text-[#D4AF37]'
                : 'text-stone-600 hover:text-[#0F3D2E] hover:bg-black/5'
            }`}
            title="الإشعارات"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 end-1.5 w-4 h-4 rounded-full bg-[#D4AF37] text-[#0F3D2E] text-[10px] font-bold flex items-center justify-center ring-2 ring-[#FCF9F0]">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Current User Pill or Login Button */}
          {currentUser ? (
            <button
              onClick={() => viewUserProfile(currentUser)}
              className="flex items-center gap-2 p-1 pe-1 sm:pe-2.5 rounded-xl bg-white border border-stone-200 hover:border-[#0F3D2E] transition-all cursor-pointer shadow-sm shrink-0"
              title="ملفي الشخصي"
            >
              <img
                src={currentUser.profileImage}
                alt={currentUser.username}
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover border border-[#D4AF37]"
              />
              <span className="text-xs font-bold text-[#0F3D2E] hidden sm:inline truncate max-w-[90px]">
                {currentUser.username}
              </span>
            </button>
          ) : (
            <button
              onClick={() => onOpenAuth ? onOpenAuth() : setActiveView('auth')}
              className="flex items-center gap-1.5 py-1.5 px-3 sm:py-2 sm:px-3.5 rounded-xl bg-[#0F3D2E] text-[#D4AF37] font-bold text-xs hover:bg-[#16503c] transition-colors shadow-sm cursor-pointer shrink-0"
            >
              <LogIn className="w-4 h-4" />
              <span className="hidden sm:inline">دخول / تسجيل</span>
              <span className="sm:hidden">دخول</span>
            </button>
          )}

        </div>

      </div>
    </header>
  );
};