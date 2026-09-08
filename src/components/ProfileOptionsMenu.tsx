import React, { useState } from 'react';
import {
  X,
  Share2,
  Bookmark,
  Settings,
  Edit3,
  QrCode,
  Star,
  EyeOff,
  Flag,
  UserX,
  UserCheck,
  UserMinus,
  MessageCircle,
  Link as LinkIcon,
  Check,
  Copy,
  Info,
  TrendingUp,
  Activity,
  LogOut,
  ShieldAlert,
  BellOff,
  LifeBuoy,
  FileText,
  Calendar,
  MapPin,
  Shield,
  Heart,
  Grid,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useAyGram } from '../context/AyGramContext';
import { User } from '../types/aygram';
import { VerificationBadge } from './VerificationBadge';

interface ProfileOptionsMenuProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  onOpenReport?: (targetId: string, snippet: string) => void;
  onOpenAuth?: () => void;
}

export const ProfileOptionsMenu: React.FC<ProfileOptionsMenuProps> = ({
  isOpen,
  onClose,
  user,
  onOpenReport,
  onOpenAuth,
}) => {
  const {
    currentUser,
    users,
    posts,
    products,
    toggleFollow,
    toggleCloseFriend,
    toggleHideStoryFromUser,
    toggleBlockUser,
    toggleRestrictUser,
    toggleMuteUser,
    openDirectChatWithUser,
    setActiveView,
    logout,
    showToast,
  } = useAyGram();

  // Sub-modal states
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const [showInsightsModal, setShowInsightsModal] = useState(false);
  const [showActivityModal, setShowActivityModal] = useState(false);
  const [showCloseFriendsModal, setShowCloseFriendsModal] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showBlockConfirm, setShowBlockConfirm] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  if (!isOpen) return null;

  const isOwnProfile = currentUser && currentUser.id === user.id;
  const isFollowing = currentUser ? currentUser.following?.includes(user.id) || false : false;
  const isBlocked = currentUser?.blockedUserIds?.includes(user.id);
  const isCloseFriend = currentUser?.closeFriends?.includes(user.id);
  const isStoryHidden = currentUser?.hiddenStoryUserIds?.includes(user.id);
  const isRestricted = currentUser?.restrictedUserIds?.includes(user.id);
  const isMuted = currentUser?.mutedUserIds?.includes(user.id);

  // Statistics
  const userPosts = posts.filter((p) => p.userId === user.id && (!p.isBlocked || isOwnProfile));
  const userProducts = products.filter((p) => p.userId === user.id && (!p.isBlocked || isOwnProfile));
  const totalLikesReceived = userPosts.reduce((acc, p) => acc + (p.likes?.length || 0), 0);

  const profileUrl = `${window.location.origin}/?profile=@${user.username}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(profileUrl);
    setCopiedLink(true);
    showToast('تم نسخ رابط الملف الشخصي إلى الحافظة!', 'success');
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleNativeShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: `ملف @${user.username} في AyGram`,
          text: user.fullName ? `${user.fullName} (@${user.username}) على AyGram` : `@${user.username} على AyGram`,
          url: profileUrl,
        })
        .catch(() => {});
    } else {
      handleCopyLink();
    }
  };

  const handleStartDM = () => {
    if (!currentUser) {
      if (onOpenAuth) onOpenAuth();
      return;
    }
    onClose();
    openDirectChatWithUser(user.id);
  };

  const handleExecuteLogout = () => {
    setShowLogoutConfirm(false);
    onClose();
    logout();
    showToast('تم تسجيل الخروج بنجاح', 'info');
  };

  const handleExecuteBlock = () => {
    setShowBlockConfirm(false);
    toggleBlockUser(user.id);
    onClose();
  };

  return (
    <>
      {/* Main Instagram-Style Action Sheet / Centered Modal */}
      <div
        className="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex items-end md:items-center justify-center p-0 md:p-4 font-['IBM_Plex_Sans_Arabic'] animate-in fade-in duration-200"
        dir="rtl"
      >
        {/* Backdrop click to close */}
        <div className="absolute inset-0" onClick={onClose} />

        {/* Action Sheet (Bottom sheet on mobile, rounded card on desktop) */}
        <div className="relative z-10 w-full md:max-w-md bg-white rounded-t-[28px] md:rounded-3xl shadow-2xl border border-stone-200 overflow-hidden max-h-[85vh] flex flex-col animate-in slide-in-from-bottom-4 md:zoom-in-95 duration-200">
          
          {/* Mobile Drag Pill */}
          <div className="md:hidden pt-3 pb-1 flex justify-center shrink-0">
            <div className="w-10 h-1.5 rounded-full bg-stone-300" />
          </div>

          {/* Sheet Header */}
          <div className="px-5 py-3.5 border-b border-stone-100 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5">
              <img
                src={user.profileImage}
                alt={user.username}
                className="w-8 h-8 rounded-full object-cover border border-[#D4AF37]"
              />
              <div>
                <h3 className="text-xs font-bold text-stone-900 leading-tight">
                  {user.fullName || user.username}
                </h3>
                <p className="text-[11px] text-stone-400 font-mono">
                  @{user.username}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-stone-100 text-stone-400 hover:text-stone-700 transition-colors cursor-pointer"
              title="إغلاق"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Options List (Scrollable) */}
          <div className="overflow-y-auto divide-y divide-stone-100 text-xs text-stone-800">
            
            {/* OWN PROFILE OPTIONS */}
            {isOwnProfile ? (
              <>
                {/* 1. Edit Profile */}
                <button
                  onClick={() => {
                    onClose();
                    setActiveView('edit_profile');
                  }}
                  className="w-full px-5 py-3.5 flex items-center justify-between hover:bg-stone-50 transition-colors cursor-pointer text-start group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#0F3D2E]/10 text-[#0F3D2E] flex items-center justify-center group-hover:bg-[#0F3D2E] group-hover:text-[#D4AF37] transition-colors">
                      <Edit3 className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-bold block text-stone-900">تعديل الملف الشخصي</span>
                      <span className="text-[11px] text-stone-400">تعديل الاسم، البايو، الصورة، الروابط، والثيم</span>
                    </div>
                  </div>
                  <span className="text-[11px] font-bold text-[#0F3D2E] bg-[#0F3D2E]/5 px-2 py-0.5 rounded-md">صفحة مستقلة</span>
                </button>

                {/* 2. Settings & Privacy */}
                <button
                  onClick={() => {
                    onClose();
                    setActiveView('settings');
                  }}
                  className="w-full px-5 py-3.5 flex items-center gap-3 hover:bg-stone-50 transition-colors cursor-pointer text-start group"
                >
                  <div className="w-8 h-8 rounded-full bg-stone-100 text-stone-700 flex items-center justify-center group-hover:bg-stone-200 transition-colors">
                    <Settings className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold block text-stone-900">الإعدادات والخصوصية</span>
                    <span className="text-[11px] text-stone-400">أمان الحساب، كلمة المرور، والإشعارات</span>
                  </div>
                </button>

                {/* 3. QR Code */}
                <button
                  onClick={() => setShowQrModal(true)}
                  className="w-full px-5 py-3.5 flex items-center gap-3 hover:bg-stone-50 transition-colors cursor-pointer text-start group"
                >
                  <div className="w-8 h-8 rounded-full bg-[#D4AF37]/15 text-[#0F3D2E] flex items-center justify-center group-hover:bg-[#D4AF37] group-hover:text-[#0F3D2E] transition-colors">
                    <QrCode className="w-4 h-4 text-[#D4AF37]" />
                  </div>
                  <div>
                    <span className="font-bold block text-stone-900">رمز الاستجابة السريعة (QR Code)</span>
                    <span className="text-[11px] text-stone-400">بطاقة حسابك الرقمية للمشاركة السريعة</span>
                  </div>
                </button>

                {/* 4. Saved Posts */}
                <button
                  onClick={() => {
                    onClose();
                    setActiveView('saved');
                  }}
                  className="w-full px-5 py-3.5 flex items-center gap-3 hover:bg-stone-50 transition-colors cursor-pointer text-start group"
                >
                  <div className="w-8 h-8 rounded-full bg-stone-100 text-stone-700 flex items-center justify-center group-hover:bg-stone-200 transition-colors">
                    <Bookmark className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold block text-stone-900">العناصر المحفوظة</span>
                    <span className="text-[11px] text-stone-400">المنشورات والتغريدات التي قمت بحفظها</span>
                  </div>
                </button>

                {/* 5. Close Friends */}
                <button
                  onClick={() => setShowCloseFriendsModal(true)}
                  className="w-full px-5 py-3.5 flex items-center justify-between hover:bg-stone-50 transition-colors cursor-pointer text-start group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                      <Star className="w-4 h-4 fill-current" />
                    </div>
                    <div>
                      <span className="font-bold block text-stone-900">الأصدقاء المقربون ⭐</span>
                      <span className="text-[11px] text-stone-400">تحديد من يمكنه مشاهدة قصصك الخاصة</span>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    {currentUser?.closeFriends?.length || 0}
                  </span>
                </button>

                {/* 6. Insights & Analytics */}
                <button
                  onClick={() => setShowInsightsModal(true)}
                  className="w-full px-5 py-3.5 flex items-center gap-3 hover:bg-stone-50 transition-colors cursor-pointer text-start group"
                >
                  <div className="w-8 h-8 rounded-full bg-amber-50 text-amber-700 flex items-center justify-center group-hover:bg-amber-600 group-hover:text-white transition-colors">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold block text-stone-900">إحصائيات ورؤى الحساب (Insights)</span>
                    <span className="text-[11px] text-stone-400">تفاعل المنشورات، المتابعون، والوصول</span>
                  </div>
                </button>

                {/* 7. Your Activity */}
                <button
                  onClick={() => setShowActivityModal(true)}
                  className="w-full px-5 py-3.5 flex items-center gap-3 hover:bg-stone-50 transition-colors cursor-pointer text-start group"
                >
                  <div className="w-8 h-8 rounded-full bg-stone-100 text-stone-700 flex items-center justify-center group-hover:bg-stone-200 transition-colors">
                    <Activity className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold block text-stone-900">سجل النشاطات والتفاعلات</span>
                    <span className="text-[11px] text-stone-400">تاريخ الإعجابات، المنشورات، والتعليقات</span>
                  </div>
                </button>

                {/* 8. Share Profile */}
                <button
                  onClick={handleNativeShare}
                  className="w-full px-5 py-3.5 flex items-center justify-between hover:bg-stone-50 transition-colors cursor-pointer text-start group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-stone-100 text-stone-700 flex items-center justify-center group-hover:bg-stone-200 transition-colors">
                      <Share2 className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-bold block text-stone-900">مشاركة الملف الشخصي</span>
                      <span className="text-[11px] text-stone-400">نسخ الرابط ومشاركته عبر التطبيقات</span>
                    </div>
                  </div>
                  {copiedLink && (
                    <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-1">
                      <Check className="w-3 h-3" /> تم النسخ
                    </span>
                  )}
                </button>

                {/* 9. Rules & Guidelines */}
                <button
                  onClick={() => {
                    onClose();
                    setActiveView('rules');
                  }}
                  className="w-full px-5 py-3.5 flex items-center gap-3 hover:bg-stone-50 transition-colors cursor-pointer text-start group"
                >
                  <div className="w-8 h-8 rounded-full bg-stone-100 text-stone-700 flex items-center justify-center group-hover:bg-stone-200 transition-colors">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold block text-stone-900">شروط وقوانين المنصة</span>
                    <span className="text-[11px] text-stone-400">معايير المجتمع وحقوق الملكية للمطور يزن السلاق</span>
                  </div>
                </button>

                {/* 10. Help & Support */}
                <button
                  onClick={() => {
                    onClose();
                    setActiveView('support');
                  }}
                  className="w-full px-5 py-3.5 flex items-center gap-3 hover:bg-stone-50 transition-colors cursor-pointer text-start group"
                >
                  <div className="w-8 h-8 rounded-full bg-stone-100 text-stone-700 flex items-center justify-center group-hover:bg-stone-200 transition-colors">
                    <LifeBuoy className="w-4 h-4 text-[#D4AF37]" />
                  </div>
                  <div>
                    <span className="font-bold block text-stone-900">مركز المساعدة والدعم الفني</span>
                    <span className="text-[11px] text-stone-400">تذاكر الدعم المباشر ومساعدة فريق المنصة</span>
                  </div>
                </button>

                {/* 11. Logout (Destructive) */}
                <button
                  onClick={() => setShowLogoutConfirm(true)}
                  className="w-full px-5 py-3.5 flex items-center gap-3 text-red-600 hover:bg-red-50 transition-colors cursor-pointer text-start group"
                >
                  <div className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center group-hover:bg-red-200 transition-colors">
                    <LogOut className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold block text-red-600">تسجيل الخروج</span>
                    <span className="text-[11px] text-red-400">الخروج الآمن من الحساب على هذا الجهاز</span>
                  </div>
                </button>
              </>
            ) : (
              /* OTHER USER'S PROFILE OPTIONS */
              <>
                {/* 1. Report Account (Red - Instagram exact top item) */}
                <button
                  onClick={() => {
                    onClose();
                    if (onOpenReport) {
                      onOpenReport(user.id, user.fullName || user.username);
                    }
                  }}
                  className="w-full px-5 py-3.5 flex items-center gap-3 text-red-600 hover:bg-red-50 transition-colors cursor-pointer text-start group"
                >
                  <div className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center group-hover:bg-red-200 transition-colors">
                    <Flag className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold block text-red-600">إبلاغ عن هذا الحساب</span>
                    <span className="text-[11px] text-red-400">محتوى غير لائق، انتحال، مضايقة أو سبام</span>
                  </div>
                </button>

                {/* 2. Block / Unblock (Red) */}
                <button
                  onClick={() => {
                    if (isBlocked) {
                      toggleBlockUser(user.id);
                      onClose();
                    } else {
                      setShowBlockConfirm(true);
                    }
                  }}
                  className="w-full px-5 py-3.5 flex items-center gap-3 text-red-600 hover:bg-red-50 transition-colors cursor-pointer text-start group"
                >
                  <div className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center group-hover:bg-red-200 transition-colors">
                    <UserX className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold block text-red-600">
                      {isBlocked ? 'إلغاء حظر هذا المستخدم' : 'حظر هذا المستخدم'}
                    </span>
                    <span className="text-[11px] text-red-400">
                      {isBlocked ? 'إعادة السماح بالتفاعل' : 'منعه من رؤية ملفك ومراسلتك نهائياً'}
                    </span>
                  </div>
                </button>

                {/* 3. Restrict Account (Instagram feature) */}
                <button
                  onClick={() => {
                    toggleRestrictUser(user.id);
                    onClose();
                  }}
                  className="w-full px-5 py-3.5 flex items-center gap-3 hover:bg-stone-50 transition-colors cursor-pointer text-start group"
                >
                  <div className="w-8 h-8 rounded-full bg-amber-50 text-amber-700 flex items-center justify-center group-hover:bg-amber-100 transition-colors">
                    <ShieldAlert className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold block text-stone-900">
                      {isRestricted ? 'إلغاء تقييد الحساب' : 'تقييد الحساب (Restrict)'}
                    </span>
                    <span className="text-[11px] text-stone-400">
                      حماية محادثاتك دون أن يعلم المستخدم أنه تم تقييده
                    </span>
                  </div>
                </button>

                {/* 4. Hide Story */}
                <button
                  onClick={() => {
                    toggleHideStoryFromUser(user.id);
                    onClose();
                  }}
                  className="w-full px-5 py-3.5 flex items-center gap-3 hover:bg-stone-50 transition-colors cursor-pointer text-start group"
                >
                  <div className="w-8 h-8 rounded-full bg-stone-100 text-stone-700 flex items-center justify-center group-hover:bg-stone-200 transition-colors">
                    <EyeOff className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold block text-stone-900">
                      {isStoryHidden ? 'إلغاء إخفاء الستوري عنه' : 'إخفاء قصتك عن هذا المستخدم'}
                    </span>
                    <span className="text-[11px] text-stone-400">
                      منع ظهور قصصك اليومية في شريطه
                    </span>
                  </div>
                </button>

                {/* 5. Close Friends */}
                <button
                  onClick={() => {
                    toggleCloseFriend(user.id);
                    onClose();
                  }}
                  className="w-full px-5 py-3.5 flex items-center gap-3 hover:bg-stone-50 transition-colors cursor-pointer text-start group"
                >
                  <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                    <Star className={`w-4 h-4 ${isCloseFriend ? 'fill-emerald-600 text-emerald-600' : ''}`} />
                  </div>
                  <div>
                    <span className="font-bold block text-stone-900">
                      {isCloseFriend ? 'إزالة من الأصدقاء المقربين' : 'إضافة للأصدقاء المقربين ⭐'}
                    </span>
                    <span className="text-[11px] text-stone-400">
                      مشاركة القصص الخاصة بالحلقة الضيقة
                    </span>
                  </div>
                </button>

                {/* 6. Mute posts & stories */}
                <button
                  onClick={() => {
                    toggleMuteUser(user.id);
                    onClose();
                  }}
                  className="w-full px-5 py-3.5 flex items-center gap-3 hover:bg-stone-50 transition-colors cursor-pointer text-start group"
                >
                  <div className="w-8 h-8 rounded-full bg-stone-100 text-stone-700 flex items-center justify-center group-hover:bg-stone-200 transition-colors">
                    <BellOff className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold block text-stone-900">
                      {isMuted ? 'إلغاء كتم هذا الحساب' : 'كتم المنشورات والقصص'}
                    </span>
                    <span className="text-[11px] text-stone-400">
                      عدم إظهار تغريداته في خلاصتك دون إلغاء المتابعة
                    </span>
                  </div>
                </button>

                {/* 7. About This Account (Instagram signature feature) */}
                <button
                  onClick={() => setShowAboutModal(true)}
                  className="w-full px-5 py-3.5 flex items-center gap-3 hover:bg-stone-50 transition-colors cursor-pointer text-start group"
                >
                  <div className="w-8 h-8 rounded-full bg-sky-50 text-sky-700 flex items-center justify-center group-hover:bg-sky-600 group-hover:text-white transition-colors">
                    <Info className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold block text-stone-900">معلومات حول هذا الحساب</span>
                    <span className="text-[11px] text-stone-400">
                      تاريخ الانضمام، البلد، والأسماء السابقة
                    </span>
                  </div>
                </button>

                {/* 8. QR Code */}
                <button
                  onClick={() => setShowQrModal(true)}
                  className="w-full px-5 py-3.5 flex items-center gap-3 hover:bg-stone-50 transition-colors cursor-pointer text-start group"
                >
                  <div className="w-8 h-8 rounded-full bg-[#D4AF37]/15 text-[#0F3D2E] flex items-center justify-center group-hover:bg-[#D4AF37] group-hover:text-[#0F3D2E] transition-colors">
                    <QrCode className="w-4 h-4 text-[#D4AF37]" />
                  </div>
                  <div>
                    <span className="font-bold block text-stone-900">رمز QR لهذا الحساب</span>
                    <span className="text-[11px] text-stone-400">مسح ضوئي ومشاركة سريعة</span>
                  </div>
                </button>

                {/* 9. Copy Profile Link */}
                <button
                  onClick={handleCopyLink}
                  className="w-full px-5 py-3.5 flex items-center justify-between hover:bg-stone-50 transition-colors cursor-pointer text-start group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-stone-100 text-stone-700 flex items-center justify-center group-hover:bg-stone-200 transition-colors">
                      <LinkIcon className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-bold block text-stone-900">نسخ رابط الملف الشخصي</span>
                      <span className="text-[11px] text-stone-400">حفظ رابط الحساب للمشاركة</span>
                    </div>
                  </div>
                  {copiedLink && (
                    <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-1">
                      <Check className="w-3 h-3" /> تم النسخ
                    </span>
                  )}
                </button>

                {/* 10. Share this Profile */}
                <button
                  onClick={handleNativeShare}
                  className="w-full px-5 py-3.5 flex items-center gap-3 hover:bg-stone-50 transition-colors cursor-pointer text-start group"
                >
                  <div className="w-8 h-8 rounded-full bg-stone-100 text-stone-700 flex items-center justify-center group-hover:bg-stone-200 transition-colors">
                    <Share2 className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold block text-stone-900">مشاركة هذا الملف الشخصي</span>
                    <span className="text-[11px] text-stone-400">إرسال رابط الحساب عبر التطبيقات</span>
                  </div>
                </button>

                {/* 11. Send Direct Message */}
                <button
                  onClick={handleStartDM}
                  className="w-full px-5 py-3.5 flex items-center gap-3 hover:bg-stone-50 transition-colors cursor-pointer text-start group"
                >
                  <div className="w-8 h-8 rounded-full bg-[#0F3D2E]/10 text-[#0F3D2E] flex items-center justify-center group-hover:bg-[#0F3D2E] group-hover:text-[#D4AF37] transition-colors">
                    <MessageCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold block text-stone-900">إرسال رسالة مباشرة</span>
                    <span className="text-[11px] text-stone-400">بدء محادثة خاصة في قسم الرسائل</span>
                  </div>
                </button>

                {/* 12. Unfollow (if following) */}
                {isFollowing && (
                  <button
                    onClick={() => {
                      toggleFollow(user.id);
                      onClose();
                    }}
                    className="w-full px-5 py-3.5 flex items-center gap-3 text-stone-700 hover:bg-stone-50 transition-colors cursor-pointer text-start group"
                  >
                    <div className="w-8 h-8 rounded-full bg-stone-100 text-stone-600 flex items-center justify-center group-hover:bg-stone-200 transition-colors">
                      <UserMinus className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-bold block text-stone-900">إلغاء المتابعة</span>
                      <span className="text-[11px] text-stone-400">التوقف عن متابعة منشورات هذا الحساب</span>
                    </div>
                  </button>
                )}
              </>
            )}

          </div>

          {/* Bottom Cancel Button (Instagram exact look) */}
          <div className="p-3 bg-stone-50 border-t border-stone-100 shrink-0">
            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-2xl bg-white hover:bg-stone-100 text-stone-800 font-bold text-xs border border-stone-200 transition-colors cursor-pointer"
            >
              إلغاء
            </button>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* SUB-MODAL 1: Instagram "About This Account" Modal */}
      {/* ======================================================== */}
      {showAboutModal && (
        <div
          className="fixed inset-0 z-60 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 font-['IBM_Plex_Sans_Arabic'] animate-in fade-in duration-200"
          dir="rtl"
        >
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 border border-stone-200 shadow-2xl space-y-5 text-center relative">
            <button
              onClick={() => setShowAboutModal(false)}
              className="absolute end-4 top-4 p-1.5 rounded-full hover:bg-stone-100 text-stone-400 hover:text-stone-700 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex flex-col items-center gap-2 pt-2">
              <div className="w-16 h-16 rounded-full p-[2px] bg-gradient-to-tr from-[#D4AF37] to-[#0F3D2E]">
                <img
                  src={user.profileImage}
                  alt={user.username}
                  className="w-full h-full rounded-full object-cover bg-white"
                />
              </div>
              <h3 className="font-bold text-sm text-stone-900">
                {user.fullName || user.username}
              </h3>
              <p className="text-xs text-stone-400 font-mono">@{user.username}</p>
            </div>

            <p className="text-[11px] text-stone-500 leading-relaxed bg-stone-50 p-3 rounded-2xl border border-stone-200">
              للمساعدة في الحفاظ على أمان مجتمعنا ومصداقية منصة AyGram، نعرض معلومات حقيقية وموثقة حول الحسابات.
            </p>

            <div className="space-y-3 text-start divide-y divide-stone-100 text-xs">
              {/* Date Joined */}
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-2 text-stone-600">
                  <Calendar className="w-4 h-4 text-[#0F3D2E]" />
                  <span>تاريخ الانضمام</span>
                </div>
                <span className="font-bold text-stone-900 font-mono text-[11px]">
                  {user.createdAt ? new Date(user.createdAt).toLocaleDateString('ar-SA', { year: 'numeric', month: 'long' }) : 'يناير 2024'}
                </span>
              </div>

              {/* Based in */}
              <div className="flex items-center justify-between pt-3">
                <div className="flex items-center gap-2 text-stone-600">
                  <MapPin className="w-4 h-4 text-[#0F3D2E]" />
                  <span>الحساب مستقر في</span>
                </div>
                <span className="font-bold text-stone-900">
                  {user.nationality || 'المملكة العربية السعودية'} {user.location ? `(${user.location})` : ''}
                </span>
              </div>

              {/* Account Type */}
              <div className="flex items-center justify-between pt-3">
                <div className="flex items-center gap-2 text-stone-600">
                  <Shield className="w-4 h-4 text-[#0F3D2E]" />
                  <span>فئة ونوع الحساب</span>
                </div>
                <span className="font-bold text-stone-900">
                  {user.accountType === 'business'
                    ? 'نشاط تجاري وأعمال'
                    : user.accountType === 'creator'
                    ? 'صانع محتوى'
                    : 'حساب شخصي'}
                </span>
              </div>

              {/* Former Usernames */}
              <div className="flex items-center justify-between pt-3">
                <div className="flex items-center gap-2 text-stone-600">
                  <Activity className="w-4 h-4 text-[#0F3D2E]" />
                  <span>تغييرات اسم المستخدم</span>
                </div>
                <span className="font-bold text-stone-500 text-[11px]">
                  لم يتم تغييره (0)
                </span>
              </div>

              {/* Verification status */}
              <div className="flex items-center justify-between pt-3">
                <div className="flex items-center gap-2 text-stone-600">
                  <CheckCircle2 className="w-4 h-4 text-[#0F3D2E]" />
                  <span>شارة التوثيق</span>
                </div>
                <span>
                  {user.verificationBadge === 'gold' ? (
                    <span className="text-[11px] font-bold text-amber-600 flex items-center gap-1">
                      موثق ذهبي ⭐
                    </span>
                  ) : user.verificationBadge === 'blue' || user.verified ? (
                    <span className="text-[11px] font-bold text-sky-600 flex items-center gap-1">
                      موثق رسمي 🔷
                    </span>
                  ) : (
                    <span className="text-[11px] text-stone-400">غير موثق</span>
                  )}
                </span>
              </div>
            </div>

            <button
              onClick={() => setShowAboutModal(false)}
              className="w-full py-2.5 rounded-2xl bg-[#0F3D2E] text-white font-bold text-xs hover:bg-[#155A44] transition-colors cursor-pointer"
            >
              إغلاق
            </button>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* SUB-MODAL 2: Instagram-Style QR Code Badge Modal */}
      {/* ======================================================== */}
      {showQrModal && (
        <div
          className="fixed inset-0 z-60 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 font-['IBM_Plex_Sans_Arabic'] animate-in fade-in duration-200"
          dir="rtl"
        >
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 border border-[#D4AF37]/40 shadow-2xl text-center relative overflow-hidden space-y-5">
            {/* Top decorative gradient strip */}
            <div className="-mt-6 -mx-6 mb-2 h-2 bg-gradient-to-l from-[#D4AF37] via-[#0F3D2E] to-[#D4AF37]" />

            <button
              onClick={() => setShowQrModal(false)}
              className="absolute end-4 top-4 p-1.5 rounded-full hover:bg-stone-100 text-stone-400 hover:text-stone-700 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div>
              <span className="inline-block px-3 py-1 rounded-full bg-[#0F3D2E] text-[#D4AF37] text-[10px] font-bold mb-2">
                بطاقة حساب AyGram الرقمية
              </span>
              <h3 className="font-black text-base text-stone-900">
                @{user.username}
              </h3>
            </div>

            {/* QR Card Frame */}
            <div className="p-5 rounded-2xl bg-[#FCF9F0] border border-[#D4AF37]/50 shadow-inner flex flex-col items-center gap-3">
              <div className="relative">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(
                    profileUrl
                  )}&color=0F3D2E&bgcolor=FCF9F0`}
                  alt={`QR Code for @${user.username}`}
                  className="w-44 h-44 rounded-xl border border-stone-200 shadow-xs"
                />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-10 h-10 rounded-full p-0.5 bg-white shadow-md">
                    <img
                      src={user.profileImage}
                      alt={user.username}
                      className="w-full h-full rounded-full object-cover"
                    />
                  </div>
                </div>
              </div>

              <div className="text-center">
                <span className="text-xs font-bold text-stone-800 block">
                  {user.fullName || user.username}
                </span>
                <span className="text-[10px] text-stone-500 font-mono">
                  امسح الرمز لفتح الملف الشخصي مباشرة
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-2.5 pt-1">
              <button
                onClick={handleCopyLink}
                className="py-2.5 px-3 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedLink ? 'تم النسخ!' : 'نسخ الرابط'}</span>
              </button>

              <button
                onClick={handleNativeShare}
                className="py-2.5 px-3 rounded-2xl bg-[#0F3D2E] hover:bg-[#155A44] text-[#D4AF37] font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>مشاركة الرمز</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* SUB-MODAL 3: Instagram Account Insights Modal */}
      {/* ======================================================== */}
      {showInsightsModal && (
        <div
          className="fixed inset-0 z-60 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 font-['IBM_Plex_Sans_Arabic'] animate-in fade-in duration-200"
          dir="rtl"
        >
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 border border-stone-200 shadow-2xl space-y-5 text-center relative">
            <button
              onClick={() => setShowInsightsModal(false)}
              className="absolute end-4 top-4 p-1.5 rounded-full hover:bg-stone-100 text-stone-400 hover:text-stone-700 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-center gap-2 text-[#0F3D2E] pt-1">
              <TrendingUp className="w-5 h-5 text-[#D4AF37]" />
              <h3 className="font-bold text-sm text-stone-900">
                إحصائيات ورؤى الحساب
              </h3>
            </div>

            <p className="text-[11px] text-stone-500 leading-relaxed">
              نظرة عامة على نشاطك وتفاعل المتابعين مع محتواك على منصة AyGram في آخر 30 يوماً.
            </p>

            <div className="grid grid-cols-2 gap-3 text-start">
              <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200">
                <span className="text-[10px] text-stone-400 block mb-1">عدد المتابعين</span>
                <span className="text-lg font-black text-stone-900 font-mono">
                  {user.followers?.length || 0}
                </span>
              </div>

              <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200">
                <span className="text-[10px] text-stone-400 block mb-1">المنشورات والتغريدات</span>
                <span className="text-lg font-black text-stone-900 font-mono">
                  {userPosts.length}
                </span>
              </div>

              <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200">
                <span className="text-[10px] text-stone-400 block mb-1">إجمالي الإعجابات</span>
                <span className="text-lg font-black text-red-600 font-mono flex items-center gap-1">
                  <Heart className="w-4 h-4 fill-red-500" />
                  {totalLikesReceived}
                </span>
              </div>

              <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200">
                <span className="text-[10px] text-stone-400 block mb-1">نسبة التفاعل المقدرة</span>
                <span className="text-lg font-black text-[#0F3D2E] font-mono">
                  {userPosts.length > 0 ? ((totalLikesReceived / (userPosts.length * 10)) * 100).toFixed(1) : '0'}%
                </span>
              </div>
            </div>

            {userProducts.length > 0 && (
              <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-xs flex items-center justify-between">
                <span className="font-bold text-amber-800">منتجات نشطة بالمتجر</span>
                <span className="font-bold text-amber-900 font-mono">{userProducts.length} منتج</span>
              </div>
            )}

            <button
              onClick={() => setShowInsightsModal(false)}
              className="w-full py-2.5 rounded-2xl bg-[#0F3D2E] text-white font-bold text-xs hover:bg-[#155A44] transition-colors cursor-pointer"
            >
              تم
            </button>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* SUB-MODAL 4: Your Activity Modal */}
      {/* ======================================================== */}
      {showActivityModal && (
        <div
          className="fixed inset-0 z-60 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 font-['IBM_Plex_Sans_Arabic'] animate-in fade-in duration-200"
          dir="rtl"
        >
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 border border-stone-200 shadow-2xl space-y-4 text-center relative">
            <button
              onClick={() => setShowActivityModal(false)}
              className="absolute end-4 top-4 p-1.5 rounded-full hover:bg-stone-100 text-stone-400 hover:text-stone-700 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-center gap-2 text-[#0F3D2E] pt-1">
              <Activity className="w-5 h-5 text-[#D4AF37]" />
              <h3 className="font-bold text-sm text-stone-900">
                سجل النشاطات والتفاعلات
              </h3>
            </div>

            <div className="space-y-2 text-start text-xs pt-2">
              <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 flex items-center justify-between">
                <span className="text-stone-700 font-medium">المنشورات التي نشرتها</span>
                <span className="font-bold text-stone-900 font-mono">{userPosts.length}</span>
              </div>
              <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 flex items-center justify-between">
                <span className="text-stone-700 font-medium">العناصر المحفوظة</span>
                <button
                  onClick={() => {
                    setShowActivityModal(false);
                    onClose();
                    setActiveView('saved');
                  }}
                  className="font-bold text-[#0F3D2E] hover:underline cursor-pointer"
                >
                  فتح المحفوظات ↗
                </button>
              </div>
              <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 flex items-center justify-between">
                <span className="text-stone-700 font-medium">قائمة الأصدقاء المقربين</span>
                <span className="font-bold text-emerald-700 font-mono">
                  {currentUser?.closeFriends?.length || 0} أصدقاء
                </span>
              </div>
            </div>

            <button
              onClick={() => setShowActivityModal(false)}
              className="w-full py-2.5 rounded-2xl bg-[#0F3D2E] text-white font-bold text-xs hover:bg-[#155A44] transition-colors cursor-pointer"
            >
              إغلاق
            </button>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* SUB-MODAL 5: Close Friends Manager Modal */}
      {/* ======================================================== */}
      {showCloseFriendsModal && (
        <div
          className="fixed inset-0 z-60 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 font-['IBM_Plex_Sans_Arabic'] animate-in fade-in duration-200"
          dir="rtl"
        >
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 border border-stone-200 shadow-2xl space-y-4 text-center relative max-h-[85vh] flex flex-col">
            <button
              onClick={() => setShowCloseFriendsModal(false)}
              className="absolute end-4 top-4 p-1.5 rounded-full hover:bg-stone-100 text-stone-400 hover:text-stone-700 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-center gap-2 text-emerald-700 pt-1 shrink-0">
              <Star className="w-5 h-5 fill-emerald-600 text-emerald-600" />
              <h3 className="font-bold text-sm text-stone-900">
                الأصدقاء المقربون ⭐
              </h3>
            </div>

            <p className="text-[11px] text-stone-500 shrink-0 leading-relaxed">
              لن نخبر الأشخاص عند إضافتهم أو إزالتهم من قائمتك. يمكنك مشاركة القصص الخاصة معهم فقط.
            </p>

            <div className="overflow-y-auto space-y-2 text-start text-xs flex-1">
              {(!currentUser?.closeFriends || currentUser.closeFriends.length === 0) ? (
                <p className="text-center py-6 text-stone-400 text-xs">
                  لا يوجد أصدقاء مقربون في قائمتك حالياً.
                </p>
              ) : (
                currentUser.closeFriends.map((friendId) => {
                  const friend = users.find((u) => u.id === friendId);
                  if (!friend) return null;
                  return (
                    <div
                      key={friend.id}
                      className="flex items-center justify-between p-2.5 bg-stone-50 rounded-2xl border border-stone-200"
                    >
                      <div className="flex items-center gap-2">
                        <img
                          src={friend.profileImage}
                          alt={friend.username}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <div>
                          <span className="font-bold block text-stone-900 text-xs">
                            {friend.fullName || friend.username}
                          </span>
                          <span className="text-[10px] text-stone-400 font-mono">
                            @{friend.username}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => toggleCloseFriend(friend.id)}
                        className="text-xs text-red-600 hover:text-red-700 font-bold px-2 py-1 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                      >
                        إزالة
                      </button>
                    </div>
                  );
                })
              )}
            </div>

            <button
              onClick={() => setShowCloseFriendsModal(false)}
              className="w-full py-2.5 rounded-2xl bg-[#0F3D2E] text-white font-bold text-xs hover:bg-[#155A44] transition-colors cursor-pointer shrink-0"
            >
              تم
            </button>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* SUB-MODAL 6: Block Confirmation Dialog */}
      {/* ======================================================== */}
      {showBlockConfirm && (
        <div
          className="fixed inset-0 z-60 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 font-['IBM_Plex_Sans_Arabic'] animate-in fade-in duration-200"
          dir="rtl"
        >
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 border border-stone-200 shadow-2xl text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <UserX className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h3 className="font-bold text-sm text-stone-900">
                حظر @{user.username}؟
              </h3>
              <p className="text-xs text-stone-500 leading-relaxed">
                لن يتمكن هذا المستخدم من العثور على ملفك الشخصي أو منشوراتك أو مراسلتك على AyGram. ولن يتم إشعاره بأنك قمت بحظره.
              </p>
            </div>

            <div className="space-y-2 pt-2">
              <button
                onClick={handleExecuteBlock}
                className="w-full py-2.5 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs transition-colors cursor-pointer"
              >
                تأكيد الحظر
              </button>
              <button
                onClick={() => setShowBlockConfirm(false)}
                className="w-full py-2.5 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs transition-colors cursor-pointer"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* SUB-MODAL 7: Logout Confirmation Dialog */}
      {/* ======================================================== */}
      {showLogoutConfirm && (
        <div
          className="fixed inset-0 z-60 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 font-['IBM_Plex_Sans_Arabic'] animate-in fade-in duration-200"
          dir="rtl"
        >
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 border border-stone-200 shadow-2xl text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <LogOut className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h3 className="font-bold text-sm text-stone-900">
                تسجيل الخروج من الحساب؟
              </h3>
              <p className="text-xs text-stone-500 leading-relaxed">
                هل أنت متأكد من رغبتك في تسجيل الخروج؟ يمكنك إعادة تسجيل الدخول في أي وقت.
              </p>
            </div>

            <div className="space-y-2 pt-2">
              <button
                onClick={handleExecuteLogout}
                className="w-full py-2.5 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs transition-colors cursor-pointer"
              >
                تسجيل الخروج
              </button>
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="w-full py-2.5 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs transition-colors cursor-pointer"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
