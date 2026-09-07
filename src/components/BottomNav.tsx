import React from 'react';
import { Home, Compass, Search, MessageCircle, User, SquarePlus, Store } from 'lucide-react';
import { useAyGram } from '../context/AyGramContext';
import { ActiveView } from '../types/aygram';

interface BottomNavProps {
  onOpenAuth: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ onOpenAuth }) => {
  const {
    currentUser,
    activeView,
    setActiveView,
    conversations,
    viewUserProfile
  } = useAyGram();

  // Hide the bottom navigation bar completely on mobile if user is not logged in
  if (!currentUser) {
    return null;
  }

  const unreadMessagesCount = currentUser
    ? conversations.reduce((acc, c) => {
        if (c.participantIds.includes(currentUser.id)) {
          return acc + (c.unreadCount || 0);
        }
        return acc;
      }, 0)
    : 0;

  const handleAddPost = () => {
    if (!currentUser) {
      onOpenAuth();
      return;
    }
    setActiveView('home');
    setTimeout(() => {
      document.getElementById('create-tweet-card')?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }, 150);
  };

  const tabs: {
    id: ActiveView;
    label: string;
    icon: React.ReactNode;
    badge?: number;
    onClick: () => void;
    isAdd?: boolean;
  }[] = [
    {
      id: 'home',
      label: 'الرئيسية',
      icon: <Home className="size-6" />,
      onClick: () => setActiveView('home'),
    },
    {
      id: 'explore',
      label: 'الاكسبلور',
      icon: <Compass className="size-6" />,
      onClick: () => setActiveView('explore'),
    },
    {
      id: 'shop',
      label: 'المتجر',
      icon: <Store className="size-6" />,
      onClick: () => setActiveView('shop'),
    },
    {
      id: 'home',
      label: 'إضافة',
      icon: <SquarePlus className="size-6" />,
      onClick: handleAddPost,
      isAdd: true,
    },
    {
      id: 'search',
      label: 'البحث',
      icon: <Search className="size-6" />,
      onClick: () => setActiveView('search'),
    },
    {
      id: 'messages',
      label: 'الرسائل',
      icon: <MessageCircle className="size-6" />,
      badge: unreadMessagesCount,
      onClick: () => {
        if (currentUser) setActiveView('messages');
        else onOpenAuth();
      },
    },
    {
      id: 'profile',
      label: 'حسابي',
      icon: currentUser ? (
        <img
          src={currentUser.profileImage}
          alt={currentUser.username}
          className="size-6 rounded-full object-cover border border-[#D4AF37]"
        />
      ) : (
        <User className="size-6" />
      ),
      onClick: () => {
        if (currentUser) viewUserProfile(currentUser);
        else onOpenAuth();
      },
    },
  ];

  return (
    <nav
      id="aygram-mobile-bottom-nav"
      aria-label="Mobile Navigation"
      className="lg:hidden fixed bottom-0 inset-x-0 z-[60] flex justify-center pointer-events-none font-['IBM_Plex_Sans_Arabic']"
      dir="rtl"
      style={{
        position: 'fixed',
        bottom: '0px',
        top: 'auto',
        left: '0px',
        right: '0px',
        zIndex: 60,
        paddingBottom: 'max(10px, env(safe-area-inset-bottom, 10px))',
      }}
    >
      <style>{`
        .ay-menu {
          position: relative;
          width: calc(100% - 20px);
          max-width: 560px;
          margin-bottom: 2px;
          pointer-events: auto;
          backdrop-filter: blur(14px) saturate(160%) contrast(120%);
          -webkit-backdrop-filter: blur(14px) saturate(160%) contrast(120%);
          background: rgba(15, 61, 46, 0.55);
          border: 1px solid rgba(212, 175, 55, 0.4);
          box-shadow: 0 12px 36px rgba(0, 0, 0, 0.25);
          padding: 6px;
          border-radius: 99rem;
          display: flex;
          justify-content: center;
          gap: 2px;
          z-index: 60;
        }

        .ay-menu::after {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: inherit;
          box-shadow:
            inset 2px 2px 5px -2px rgba(255, 255, 255, 0.35),
            inset -2px -2px 5px 2px rgba(255, 255, 255, 0.25),
            inset 0 -2px 0 rgba(255, 255, 255, 0.15);
          pointer-events: none;
          z-index: -1;
        }

        .ay-link {
          display: flex;
          flex-direction: column;
          align-items: center;
          flex: 1 1 0;
          min-width: 0;
          color: rgba(255, 255, 255, 0.85);
          text-decoration: none;
          padding: 8px 4px;
          border-radius: 999rem;
          -webkit-tap-highlight-color: transparent;
          transition:
            background 0.18s,
            color 0.18s,
            transform 0.18s,
            box-shadow 0.3s ease-in-out;
        }

        .ay-link:hover {
          background-color: rgba(255, 255, 255, 0.12);
          box-shadow:
            inset 2px 2px 5px -2px rgba(255, 255, 255, 0.35),
            inset -2px -1px 5px 0 rgba(255, 255, 255, 0.3),
            inset 0 -2px 0 rgba(255, 255, 255, 0.15);
          transform: rotate(2deg);
          color: #D4AF37;
        }

        .ay-link svg {
          width: 1.25rem;
          height: 1.25rem;
        }

        .ay-link span {
          font-size: 0.58rem;
          font-weight: 700;
          line-height: 1;
          margin-top: 3px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 100%;
          text-align: center;
        }

        .ay-link.active {
          background: rgba(255, 255, 255, 0.16);
          color: #D4AF37;
        }

        .ay-link:active {
          transform: scale(0.98);
        }

        .ay-link.ay-add {
          background: #D4AF37;
          color: #0F3D2E;
          box-shadow: 0 4px 14px rgba(212, 175, 55, 0.45);
          transform: translateY(-2px);
        }

        .ay-link.ay-add:hover,
        .ay-link.ay-add.active {
          background: #E5C358;
          color: #0F3D2E;
          transform: rotate(2deg) translateY(-2px);
        }
      `}</style>

      <div className="ay-menu">
        {tabs.map((tab, index) => {
          const isActive = activeView === tab.id && !tab.isAdd;

          return (
            <button
              key={index}
              onClick={tab.onClick}
              className={`ay-link relative cursor-pointer ${
                isActive ? 'active' : ''
              } ${tab.isAdd ? 'ay-add' : ''}`}
              title={tab.label}
            >
              <div className="relative">
                {tab.icon}
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span className="absolute -top-1 -end-2 w-4 h-4 bg-[#D4AF37] text-[#0F3D2E] text-[9px] font-bold rounded-full flex items-center justify-center font-mono">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};