import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  Home,
  Compass,
  Search,
  ShoppingBag,
  Bell,
  Bookmark,
  User,
  Settings,
  FileText,
  Ban,
  Sparkles,
  PlusCircle,
  MessageCircle,
  Shield,
  LogOut,
  Award,
  LifeBuoy,
  X,
  LogIn,
  Menu,
  ShieldCheck
} from 'lucide-react';
import { useAyGram } from '../context/AyGramContext';
import { ActiveView } from '../types/aygram';
import { AyGramLogo } from './AyGramLogo';

interface MobileSidebarProps {
  onOpenAuth: () => void;
  onOpenAddProduct: () => void;
  onSecretTrigger: () => void;
}

export const MobileSidebar: React.FC<MobileSidebarProps> = ({
  onOpenAuth,
  onOpenAddProduct,
  onSecretTrigger
}) => {
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

  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

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

  const navItems: { id: ActiveView; label: string; icon: React.ReactNode; badge?: number }[] = [
    ...(!currentUser
      ? [
          {
            id: 'landing' as ActiveView,
            label: 'دليل المنصة ومميزاتها',
            icon: <Sparkles className="w-4 h-4 text-[#D4AF37]" />
          }
        ]
      : []),
    {
      id: 'home',
      label: 'الرئيسية (الخط الزمني)',
      icon: <Home className="w-4 h-4" />
    },
    {
      id: 'explore',
      label: 'قسم الاكسبلور',
      icon: <Compass className="w-4 h-4" />
    },
    {
      id: 'search',
      label: 'البحث والوسوم',
      icon: <Search className="w-4 h-4" />
    },
    {
      id: 'shop',
      label: 'سوق المبدعين والمتجر',
      icon: <ShoppingBag className="w-4 h-4" />
    },
    {
      id: 'messages',
      label: 'الرسائل والمحادثات',
      icon: <MessageCircle className="w-4 h-4" />,
      badge: unreadMessagesCount
    },
    {
      id: 'notifications',
      label: 'الإشعارات والتنبيهات',
      icon: <Bell className="w-4 h-4" />,
      badge: unreadCount
    },
    {
      id: 'saved',
      label: 'التغريدات المحفوظة',
      icon: <Bookmark className="w-4 h-4" />
    },
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
      id: 'rules',
      label: 'شروط وقوانين المنصة',
      icon: <FileText className="w-4 h-4" />
    },
    {
      id: 'support' as ActiveView,
      label: 'الدعم الفني والمساعدة',
      icon: <LifeBuoy className="w-4 h-4 text-[#D4AF37]" />
    },
    ...(isUserAdmin
      ? [
          {
            id: 'bans' as ActiveView,
            label: 'سجل الحظر (للإدارة فقط)',
            icon: <Ban className="w-4 h-4 text-red-500" />
          }
        ]
      : [])
  ];

  const handleNav = (id: ActiveView) => {
    if (id === 'profile') {
      if (currentUser) {
        viewUserProfile(currentUser);
      } else {
        onOpenAuth();
      }
    } else if (id === 'messages' || id === 'settings') {
      if (currentUser) {
        setActiveView(id);
      } else {
        onOpenAuth();
      }
    } else {
      setActiveView(id);
    }
    setIsOpen(false);
  };

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflowY = 'hidden';
    } else {
      const scrollY = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflowY = '';
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0', 10) * -1);
      }
    }

    return () => {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflowY = '';
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', onEsc);
    return () => window.removeEventListener('keydown', onEsc);
  }, [isOpen]);

  const drawerPortal = isMounted ? (
    createPortal(
      <div
        className={`fixed inset-0 z-[999] lg:hidden transition-all duration-300 ${
          isOpen ? 'visible pointer-events-auto' : 'invisible pointer-events-none'
        }`}
        dir="rtl"
      >
        {/* Backdrop */}
        <div
          onClick={() => setIsOpen(false)}
          className={`fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300 cursor-pointer ${
            isOpen ? 'opacity-100' : 'opacity-0'
          }`}
          aria-hidden="true"
        />

        {/* Drawer Panel: Pinned to right in RTL */}
        <aside
          className={`fixed inset-y-0 right-0 z-[1000] w-[310px] max-w-[85vw] h-full bg-[#FCF9F0] text-[#1A1A1A] border-s border-[#D4AF37]/30 shadow-2xl flex flex-col transition-transform duration-300 ease-out font-['IBM_Plex_Sans_Arabic'] ${
            isOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
          aria-label="القائمة الجانبية للتنقل"
          aria-hidden={!isOpen}
        >
          {/* Drawer Top Header */}
          <div className="flex items-center justify-between px-4 py-3.5 border-b border-stone-200/90 bg-white shrink-0">
            <div className="flex items-center gap-2">
              <AyGramLogo onSecretTrigger={onSecretTrigger} size="sm" />
              <span className="text-[10px] font-bold text-[#D4AF37] bg-[#0F3D2E] px-2 py-0.5 rounded-full">
                عربي أصيل
              </span>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="إغلاق القائمة الجانبية"
              className="w-9 h-9 rounded-xl flex items-center justify-center text-stone-600 hover:text-[#0F3D2E] hover:bg-stone-100 transition-colors cursor-pointer border border-stone-200 active:scale-95"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Nav Items Scrollable Body */}
          <nav className="flex-1 overflow-y-auto p-3.5 space-y-2 overscroll-contain no-scrollbar">
            <div className="px-2 pt-1 pb-1 text-[11px] font-bold text-[#0F3D2E]/70 uppercase tracking-wider">
              أقسام المنصة
            </div>

            {navItems.map((item) => {
              const isActive = activeView === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleNav(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#0F3D2E] text-[#D4AF37] shadow-sm'
                      : 'text-stone-700 hover:bg-white hover:shadow-xs hover:text-[#0F3D2E]'
                  }`}
                >
                  <div className="flex items-center gap-3">
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

            {/* Admin shortcut if unlocked */}
            {isAdminUnlocked && (
              <button
                type="button"
                onClick={() => {
                  setActiveView('admin');
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer mt-1 ${
                  activeView === 'admin'
                    ? 'bg-[#0F3D2E] text-[#D4AF37]'
                    : 'text-[#0F3D2E] bg-[#D4AF37]/15 hover:bg-[#D4AF37]/25'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Shield className="w-4 h-4 text-[#D4AF37]" />
                  <span>لوحة الإشراف والإدارة</span>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#0F3D2E] text-white">
                  نشط
                </span>
              </button>
            )}

            {/* Creator Shop Callout */}
            <div className="p-4 rounded-2xl bg-[#0F3D2E] text-white shadow-sm border border-[#D4AF37]/30 space-y-2.5 mt-2">
              <div className="flex items-center gap-2 text-[#D4AF37]">
                <ShoppingBag className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">سوق AyGram للمبدعين</span>
              </div>
              <p className="text-[11px] text-stone-200 leading-relaxed">
                اعرض أعمالك، تصاميمك، ومنتجاتك الإبداعية لتصل إلى آلاف المتابعين والمهتمين.
              </p>
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  if (!currentUser) {
                    onOpenAuth();
                  } else {
                    onOpenAddProduct();
                  }
                }}
                className="w-full py-2.5 px-3 rounded-xl bg-[#D4AF37] text-[#0F3D2E] font-bold text-xs hover:bg-[#e0be4e] transition-colors flex items-center justify-center gap-1.5 shadow cursor-pointer active:scale-95"
              >
                <PlusCircle className="w-4 h-4" />
                <span>إضافة منتج جديد للمتجر</span>
              </button>
            </div>

            {/* Ownership & Dev Badge */}
            <div className="px-3 py-2.5 bg-white rounded-xl border border-stone-200/80 text-center shadow-2xs mt-2">
              <div className="flex items-center justify-center gap-1.5 text-[11px] text-stone-600 font-semibold">
                <Award className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>
                  المطور والمالك: <strong className="text-[#0F3D2E]">يزن السلاق</strong>
                </span>
              </div>
            </div>
          </nav>

          {/* User Footer Action */}
          {currentUser ? (
            <div className="p-3.5 border-t border-stone-200/90 bg-white shrink-0 flex items-center justify-between gap-2">
              <div
                onClick={() => {
                  viewUserProfile(currentUser);
                  setIsOpen(false);
                }}
                className="flex items-center gap-2.5 cursor-pointer min-w-0 flex-1 rounded-xl hover:bg-stone-50 p-1.5 transition-colors"
              >
                <img
                  src={currentUser.profileImage}
                  alt={currentUser.username}
                  className="w-9 h-9 rounded-full object-cover border border-[#D4AF37] shrink-0"
                />
                <div className="truncate">
                  <div className="text-xs font-bold text-[#0F3D2E] truncate">
                    {currentUser.fullName || currentUser.username}
                  </div>
                  <div className="text-[10px] text-stone-400 truncate font-mono">@{currentUser.username}</div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  logout();
                  setIsOpen(false);
                }}
                className="p-2 rounded-xl text-stone-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                title="تسجيل الخروج"
                aria-label="تسجيل الخروج"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <div className="p-3.5 border-t border-stone-200/90 bg-white shrink-0">
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  onOpenAuth();
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-[#0F3D2E] text-[#D4AF37] font-bold text-xs hover:bg-[#16503c] transition-colors shadow-sm flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                <LogIn className="w-4 h-4" />
                <span>دخول / إنشاء حساب جديد</span>
              </button>
            </div>
          )}
        </aside>
      </div>,
      document.body
    )
  ) : null;

  return (
    <>
      {/* Reliable, Beautiful Mobile Hamburger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-label="فتح القائمة الجانبية"
        aria-expanded={isOpen}
        className="lg:hidden flex items-center justify-center w-10 h-10 rounded-xl bg-white border border-stone-200 text-[#0F3D2E] hover:text-[#D4AF37] hover:bg-[#0F3D2E] hover:border-[#0F3D2E] transition-all cursor-pointer shadow-xs active:scale-95"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Portaled Drawer to document.body */}
      {drawerPortal}
    </>
  );
};