import React from 'react';
import {
  Home,
  Compass,
  Search,
  ShoppingBag,
  Bell,
  Bookmark,
  User,
  Settings,
  LogOut,
  Sparkles,
  PlusCircle,
  MessageCircle,
  Shield,
  FileText,
  Ban,
  Award,
  LifeBuoy,
  ShieldCheck,
  Radio
} from 'lucide-react';
import { useAyGram } from '../context/AyGramContext';
import { ActiveView } from '../types/aygram';

interface SidebarProps {
  onOpenAuth: () => void;
  onOpenAddProduct: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onOpenAuth, onOpenAddProduct }) => {
  const {
    currentUser,
    activeView,
    setActiveView,
    notifications,
    conversations,
    isAdminUnlocked,
    logout,
    viewUserProfile
  } = useAyGram();

  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const unreadMessagesCount = currentUser
    ? conversations.reduce((acc, c) => {
        if (c.participantIds.includes(currentUser.id)) {
          return acc + (c.unreadCount || 0);
        }
        return acc;
      }, 0)
    : 0;

  const isUserAdmin = isAdminUnlocked || currentUser?.role === 'admin' || currentUser?.role === 'owner';

  // Navigation items
  const navItems: { id: ActiveView; label: string; icon: React.ReactNode; badge?: number }[] = [
    ...(!currentUser
      ? [
          {
            id: 'landing' as ActiveView,
            label: 'دليل ومميزات المنصة',
            icon: <Sparkles className="w-4 h-4 text-[#D4AF37]" />
          }
        ]
      : []),
    {
      id: 'home',
      label: 'الخط الزمني والتغريدات',
      icon: <Home className="w-4 h-4" />
    },
    {
      id: 'explore',
      label: 'قسم الاكسبلور',
      icon: <Compass className="w-4 h-4" />
    },
    {
      id: 'search',
      label: 'قسم البحث المتقدم',
      icon: <Search className="w-4 h-4" />
    },
    {
      id: 'shop',
      label: 'سوق المبدعين والمتجر',
      icon: <ShoppingBag className="w-4 h-4" />
    },
    {
      id: 'channels',
      label: 'القنوات والمجتمعات',
      icon: <Radio className="w-4 h-4 text-emerald-600" />
    },
    {
      id: 'messages',
      label: 'الرسائل والمحادثات',
      icon: <MessageCircle className="w-4 h-4" />,
      badge: unreadMessagesCount
    },
    {
      id: 'notifications',
      label: 'الإشعارات والتعاميم',
      icon: <Bell className="w-4 h-4" />,
      badge: unreadCount
    },
    {
      id: 'saved',
      label: 'التغريدات المحفوظة',
      icon: <Bookmark className="w-4 h-4" />
    },
    {
      id: 'rules',
      label: 'شروط وقوانين المنصة',
      icon: <FileText className="w-4 h-4" />
    },
    // Only show Banned Accounts to Admin ("صفحة الحظر و سجل الموقوفين فقط للادمن تظهر")
    ...(isUserAdmin
      ? [
          {
            id: 'bans' as ActiveView,
            label: 'سجل الموقوفين والحظر (للإدارة)',
            icon: <Ban className="w-4 h-4 text-red-500" />
          }
        ]
      : []),
    {
      id: 'profile',
      label: 'الملف الشخصي',
      icon: <User className="w-4 h-4" />
    },
    {
      id: 'settings',
      label: 'إعدادات الحساب',
      icon: <Settings className="w-4 h-4" />
    },
    {
      id: 'support' as ActiveView,
      label: 'الدعم الفني والمساعدة',
      icon: <LifeBuoy className="w-4 h-4 text-[#D4AF37]" />
    }
  ];

  return (
    <aside className="hidden lg:flex flex-col justify-between w-64 shrink-0 sticky top-20 h-[calc(100vh-6rem)] pb-6 select-none font-['IBM_Plex_Sans_Arabic']" dir="rtl">
      <div className="space-y-4 overflow-y-auto pe-1 no-scrollbar">
        
        {/* Navigation list */}
        <nav className="space-y-1 bg-white p-3 rounded-2xl border border-stone-200 shadow-sm">
          {navItems.map((item) => {
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  if (item.id === 'profile') {
                    if (currentUser) {
                      viewUserProfile(currentUser);
                    } else {
                      onOpenAuth();
                    }
                  } else if (item.id === 'messages' || item.id === 'settings') {
                    if (currentUser) {
                      setActiveView(item.id);
                    } else {
                      onOpenAuth();
                    }
                  } else {
                    setActiveView(item.id);
                  }
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#0F3D2E] text-[#D4AF37] shadow'
                    : 'text-stone-800 hover:bg-stone-50 hover:text-[#0F3D2E]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className={isActive ? 'text-[#D4AF37]' : 'text-stone-500'}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>

                {item.badge !== undefined && item.badge > 0 && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-[#D4AF37] text-[#0F3D2E]">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Sell on AyGram CTA */}
        <div className="p-4 rounded-2xl bg-[#0F3D2E] text-white shadow-sm border border-[#D4AF37]/30 space-y-2.5">
          <div className="flex items-center gap-2 text-[#D4AF37]">
            <ShoppingBag className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider">سوق AyGram للمبدعين</span>
          </div>
          <p className="text-[11px] text-stone-200 leading-relaxed">
            اعرض أعمالك، تصاميمك، ومنتجاتك الإبداعية لتصل إلى آلاف المتابعين والمهتمين.
          </p>
          <button
            onClick={() => {
              if (!currentUser) {
                onOpenAuth();
              } else {
                onOpenAddProduct();
              }
            }}
            className="w-full py-2 px-3 rounded-xl bg-[#D4AF37] text-[#0F3D2E] font-bold text-xs hover:bg-[#e0be4e] transition-colors flex items-center justify-center gap-1.5 shadow cursor-pointer active:scale-95"
          >
            <PlusCircle className="w-4 h-4" />
            <span>عرض منتج جديد للبيع</span>
          </button>
        </div>

        {/* Developer & Ownership badge */}
        <div className="px-3 py-2 bg-stone-50 rounded-xl border border-stone-200 text-center">
          <div className="flex items-center justify-center gap-1.5 text-[11px] text-stone-600 font-semibold">
            <Award className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>المطور والمالك: <strong>يزن السلاق</strong></span>
          </div>
        </div>
      </div>

      {/* User Logout or Quick Profile */}
      {currentUser && (
        <div className="bg-white p-3 rounded-2xl border border-stone-200 flex items-center justify-between shadow-sm mt-3">
          <div
            onClick={() => viewUserProfile(currentUser)}
            className="flex items-center gap-2.5 cursor-pointer min-w-0 flex-1"
          >
            <img
              src={currentUser.profileImage}
              alt={currentUser.username}
              className="w-9 h-9 rounded-full object-cover border border-[#D4AF37]"
            />
            <div className="truncate">
              <div className="text-xs font-bold text-[#0F3D2E] truncate">
                {currentUser.fullName || currentUser.username}
              </div>
              <div className="text-[10px] text-stone-400 truncate font-mono">
                @{currentUser.username}
              </div>
            </div>
          </div>

          <button
            onClick={logout}
            className="p-1.5 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
            title="تسجيل الخروج"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      )}
    </aside>
  );
};
