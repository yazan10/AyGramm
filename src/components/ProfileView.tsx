import React, { useState } from 'react';
import {
  User as UserIcon,
  CheckCircle2,
  Calendar,
  Phone,
  Grid,
  ShoppingBag,
  Bookmark,
  Sparkles,
  Edit3,
  UserPlus,
  UserCheck,
  Check,
  Award,
  MessageCircle,
  Globe2,
  AlertCircle,
  Settings,
  MoreVertical,
  Share2,
  Flag,
  UserX,
  EyeOff,
  Star,
  ExternalLink,
  MapPin,
  Link as LinkIcon,
  Shield,
  Heart,
  List,
  MessageSquare
} from 'lucide-react';
import { useAyGram } from '../context/AyGramContext';
import { User } from '../types/aygram';
import { PostCard } from './PostCard';
import { VerificationBadge } from './VerificationBadge';
import { ProfileHighlights } from './ProfileHighlights';
import { ProfileOptionsMenu } from './ProfileOptionsMenu';

interface ProfileViewProps {
  user: User;
  onOpenReport: (targetId: string, snippet: string) => void;
  onOpenAuth: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ user, onOpenReport, onOpenAuth }) => {
  const {
    currentUser,
    posts,
    products,
    stories,
    savedPostIds,
    toggleFollow,
    toggleBlockUser,
    openDirectChatWithUser,
    setActiveView
  } = useAyGram();

  const [activeTab, setActiveTab] = useState<'posts' | 'shop' | 'stories' | 'saved'>('posts');
  const [postLayout, setPostLayout] = useState<'grid' | 'feed'>('grid');
  const [selectedPostModal, setSelectedPostModal] = useState<any | null>(null);
  const [showOptionsMenu, setShowOptionsMenu] = useState(false);

  const isOwnProfile = currentUser && currentUser.id === user.id;
  const isFollowing = currentUser ? currentUser.following?.includes(user.id) || false : false;
  const isBlocked = currentUser?.blockedUserIds?.includes(user.id);
  const isCloseFriend = currentUser?.closeFriends?.includes(user.id);
  const isStoryHidden = currentUser?.hiddenStoryUserIds?.includes(user.id);

  // Filter items
  const userPosts = posts.filter((p) => p.userId === user.id && (!p.isBlocked || isOwnProfile));
  const userProducts = products.filter((p) => p.userId === user.id && (!p.isBlocked || isOwnProfile));
  const userStories = stories.filter((s) => s.userId === user.id);
  const savedPosts = posts.filter((p) => savedPostIds.includes(p.id));

  const handleStartDM = () => {
    if (!currentUser) {
      onOpenAuth();
      return;
    }
    openDirectChatWithUser(user.id);
  };

  // Birth Date Privacy check
  const shouldShowBirthDate = () => {
    if (!user.birthDate) return false;
    if (isOwnProfile) return true;
    if (user.birthDatePrivacy === 'public') return true;
    if (user.birthDatePrivacy === 'close_friends') {
      return currentUser && user.closeFriends?.includes(currentUser.id);
    }
    return false; // private
  };

  return (
    <div
      className="space-y-6 font-['IBM_Plex_Sans_Arabic']"
      dir="rtl"
      style={{ '--pv-primary': user.profileColor || '#0F3D2E' } as React.CSSProperties}
    >
      
      {/* Closed account alert */}
      {user.isClosed && (
        <div className="p-3.5 bg-[#801824]/10 border border-[#a81f2e]/40 rounded-2xl text-xs font-bold text-[#801824] flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span className="leading-relaxed">
            هذا الحساب مغلق من قبل الإدارة.{' '}
            {user.closureReason ? `السبب: ${user.closureReason}.` : ''}
            <span dir="ltr"> (@aygram.user)</span>
          </span>
        </div>
      )}

      {/* Banned Alert if user is banned */}
      {!user.isActive && !user.isClosed && (
        <div className="p-3.5 bg-red-50 border border-red-200 rounded-2xl text-xs font-bold text-red-700 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>هذا الحساب موقوف حالياً من قِبل الإدارة لمخالفته شروط وقوانين المنصة.</span>
        </div>
      )}

      {/* Blocked alert if current user blocked this user */}
      {isBlocked && (
        <div className="p-3.5 bg-stone-100 border border-stone-300 rounded-2xl text-xs font-bold text-stone-700 flex items-center justify-between">
          <span>لقد قمت بحظر هذا المستخدم. لن تظهر منشوراته أو رسائله لك.</span>
          <button
            onClick={() => toggleBlockUser(user.id)}
            className="text-red-600 hover:underline text-xs cursor-pointer"
          >
            إلغاء الحظر
          </button>
        </div>
      )}

      {/* Instagram-Style Profile Header Card */}
      <div className="bg-white rounded-3xl p-5 sm:p-8 border border-stone-200 shadow-sm space-y-6">
        
        {/* Profile Color Theme Strip */}
        <div className="-m-5 sm:-m-8 mb-0 h-1.5 bg-gradient-to-l from-[#D4AF37] via-[var(--pv-primary)] to-[#D4AF37] rounded-t-3xl" />

        {/* Desktop & Tablet Layout */}
        <div className="hidden md:flex items-start gap-8 lg:gap-12">
          {/* Avatar with Instagram-Style Story Gradient Ring */}
          <div className="relative shrink-0">
            <div className="w-32 h-32 lg:w-36 lg:h-36 rounded-full p-[3px] bg-gradient-to-tr from-[#D4AF37] via-[var(--pv-primary)] to-[#D4AF37] shadow-md flex items-center justify-center">
              <div className="w-full h-full rounded-full p-1 bg-white flex items-center justify-center overflow-hidden">
                {user.isClosed ? (
                  <div className="w-full h-full rounded-full bg-[#333] text-white flex items-center justify-center text-4xl font-black">
                    <span className="text-[#d8d8d8]">#</span>
                  </div>
                ) : (
                  <img
                    src={user.profileImage}
                    alt={user.username}
                    className="w-full h-full rounded-full object-cover"
                  />
                )}
              </div>
            </div>
            
            {/* Account Type Icon pill on avatar */}
            {user.isClosed && (
              <span className="absolute bottom-1 start-1 bg-[#333] text-white text-[9px] px-1.5 py-0.5 rounded-full font-bold shadow">
                مغلق
              </span>
            )}
            {user.accountType === 'business' && (
              <span className="absolute bottom-1 start-1 bg-amber-600 text-white text-[9px] px-2 py-0.5 rounded-full font-bold shadow">
                أعمال
              </span>
            )}
            {user.accountType === 'creator' && (
              <span className="absolute bottom-1 start-1 bg-sky-600 text-white text-[9px] px-2 py-0.5 rounded-full font-bold shadow">
                صانع
              </span>
            )}
          </div>

          {/* User Information Column */}
          <div className="flex-1 space-y-4 text-start">
            {/* Row 1: Username + Verification Badge + مسؤول المنصة + Action Buttons */}
            <div className="flex items-center gap-3 flex-wrap">
              <h2 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight font-mono">
                {user.isClosed ? <span dir="ltr">@aygram.user</span> : `@${user.username}`}
              </h2>

              {/* Instagram-style Verification Badge */}
              {!user.isClosed && user.verificationBadge && user.verificationBadge !== 'none' ? (
                <VerificationBadge type={user.verificationBadge} size="md" />
              ) : !user.isClosed && user.verified ? (
                <VerificationBadge type="blue" size="md" />
              ) : null}

              {/* Admin Banner (مسؤول المنصة) beside user y's name */}
              {(user.username === 'y' || user.id === 'user_owner_aygram' || user.role === 'owner') && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0F3D2E] text-[#D4AF37] border border-[#D4AF37]/60 shadow-xs text-xs font-bold select-none">
                  <Shield className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>مسؤول المنصة</span>
                  <Sparkles className="w-3 h-3 text-[#D4AF37]" />
                </div>
              )}

              {/* Action Buttons (Instagram exact layout) */}
              <div className="flex items-center gap-2 me-auto">
                {isOwnProfile ? (
                  <>
                    <button
                      onClick={() => setActiveView('edit_profile')}
                      className="py-1.5 px-4 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs transition-colors cursor-pointer active:scale-95"
                    >
                      تعديل الملف الشخصي
                    </button>
                    <button
                      onClick={() => setActiveView('settings')}
                      className="p-2 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors cursor-pointer"
                      title="الإعدادات"
                    >
                      <Settings className="w-4 h-4" />
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        if (!currentUser) onOpenAuth();
                        else toggleFollow(user.id);
                      }}
                      className={`py-1.5 px-5 rounded-lg font-bold text-xs transition-all shadow-xs cursor-pointer ${
                        isFollowing
                          ? 'bg-stone-100 text-stone-800 hover:bg-stone-200'
                          : 'bg-[#0F3D2E] text-[#D4AF37] hover:bg-[#16503c]'
                      }`}
                    >
                      {isFollowing ? (
                        <span className="flex items-center gap-1">
                          <UserCheck className="w-3.5 h-3.5 text-[#0F3D2E]" />
                          <span>متابع</span>
                        </span>
                      ) : (
                        <span className="flex items-center gap-1">
                          <UserPlus className="w-3.5 h-3.5" />
                          <span>متابعة</span>
                        </span>
                      )}
                    </button>

                    <button
                      onClick={handleStartDM}
                      className="py-1.5 px-4 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs transition-colors cursor-pointer"
                    >
                      مراسلة
                    </button>
                  </>
                )}

                {/* 3-Dots Options Menu (Instagram Style) */}
                <button
                  onClick={() => setShowOptionsMenu(true)}
                  className="p-2 rounded-lg text-stone-600 hover:bg-stone-100 transition-colors cursor-pointer"
                  title="خيارات الحساب (مثل الانستغرام)"
                >
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Row 2: Instagram Stats Row (منشورات • متابعين • يتابعهم) */}
            <div className="flex items-center gap-8 text-sm">
              <div>
                <span className="font-bold text-stone-900 font-mono text-base ms-1">{userPosts.length}</span>
                <span className="text-stone-600">منشورات</span>
              </div>
              <div>
                <span className="font-bold text-stone-900 font-mono text-base ms-1">{user.followers?.length || 0}</span>
                <span className="text-stone-600">متابعين</span>
              </div>
              <div>
                <span className="font-bold text-stone-900 font-mono text-base ms-1">{user.following?.length || 0}</span>
                <span className="text-stone-600">يتابعهم</span>
              </div>
              {userProducts.length > 0 && (
                <div>
                  <span className="font-bold text-[#D4AF37] font-mono text-base ms-1">{userProducts.length}</span>
                  <span className="text-stone-600">منتجات بالمتجر</span>
                </div>
              )}
            </div>

            {/* Row 3: Name, Category, Nationality & Bio */}
            <div className="space-y-2 text-xs pt-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-sm text-stone-900">
                  {user.isClosed ? 'حساب مغلق' : user.fullName || user.username}
                </span>
                {user.accountType && (
                  <span className="text-[11px] text-stone-500 font-medium">
                    {user.accountType === 'business' && '• حساب أعمال'}
                    {user.accountType === 'creator' && '• صانع محتوى'}
                    {user.accountType === 'personal' && '• شخصي'}
                  </span>
                )}
                {user.nationality && (
                  <span className="inline-flex items-center gap-1 text-[11px] text-stone-700 font-bold bg-stone-100 px-2.5 py-0.5 rounded-full border border-stone-200">
                    {user.nationality === 'فلسطيني' ? '🇵🇸' : user.nationality === 'أردني' ? '🇯🇴' : user.nationality === 'سعودي' ? '🇸🇦' : user.nationality === 'إماراتي' ? '🇦🇪' : '🌐'}
                    <span>{user.nationality}</span>
                    {user.location && <span className="font-normal text-stone-500">• {user.location}</span>}
                  </span>
                )}
              </div>

              {/* Bio lines */}
              <p className="text-stone-800 leading-relaxed whitespace-pre-line text-xs sm:text-sm">
                {user.bio}
              </p>

              {/* Custom Links (Instagram style with 🔗) */}
              {user.links && user.links.length > 0 && (
                <div className="pt-1 flex flex-wrap gap-2">
                  {user.links.slice(0, 4).map((link, idx) => (
                    <a
                      key={link.id || idx}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0F3D2E] hover:underline"
                    >
                      <LinkIcon className="w-3 h-3 text-[#D4AF37]" />
                      <span>{link.title || link.url}</span>
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Instagram Layout */}
        <div className="md:hidden space-y-4">
          {/* Top: Avatar + Stats Row Side-by-Side */}
          <div className="flex items-center gap-5 justify-between">
            {/* Avatar */}
            <div className="w-20 h-20 rounded-full p-[2.5px] bg-gradient-to-tr from-[#D4AF37] via-[var(--pv-primary)] to-[#D4AF37] shadow-sm shrink-0 flex items-center justify-center">
              <div className="w-full h-full rounded-full p-0.5 bg-white flex items-center justify-center overflow-hidden">
                {user.isClosed ? (
                  <span className="text-2xl font-black text-stone-500">#</span>
                ) : (
                  <img
                    src={user.profileImage}
                    alt={user.username}
                    className="w-full h-full rounded-full object-cover"
                  />
                )}
              </div>
            </div>

            {/* Stats (Instagram mobile 3 counters) */}
            <div className="flex-1 flex items-center justify-around text-center">
              <div>
                <span className="font-bold text-stone-900 font-mono text-base block">{userPosts.length}</span>
                <span className="text-[11px] text-stone-500">منشورات</span>
              </div>
              <div>
                <span className="font-bold text-stone-900 font-mono text-base block">{user.followers?.length || 0}</span>
                <span className="text-[11px] text-stone-500">متابعين</span>
              </div>
              <div>
                <span className="font-bold text-stone-900 font-mono text-base block">{user.following?.length || 0}</span>
                <span className="text-[11px] text-stone-500">يتابعهم</span>
              </div>
            </div>
          </div>

          {/* User Bio & Meta (Mobile) */}
          <div className="space-y-1.5 text-xs text-start">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-bold text-sm text-stone-900">
                {user.isClosed ? 'حساب مغلق' : user.fullName || user.username}
              </span>
              <span className="text-stone-400 font-mono">@{user.username}</span>

              {/* Verification Badge */}
              {!user.isClosed && user.verificationBadge && user.verificationBadge !== 'none' ? (
                <VerificationBadge type={user.verificationBadge} size="sm" />
              ) : !user.isClosed && user.verified ? (
                <VerificationBadge type="blue" size="sm" />
              ) : null}
            </div>

            {/* Admin Banner for y on mobile */}
            {(user.username === 'y' || user.id === 'user_owner_aygram' || user.role === 'owner') && (
              <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#0F3D2E] text-[#D4AF37] border border-[#D4AF37]/50 text-[10px] font-bold shadow-xs">
                <Shield className="w-3 h-3 text-[#D4AF37]" />
                <span>مسؤول المنصة</span>
              </div>
            )}

            {user.nationality && (
              <div className="flex items-center gap-1 text-[11px] text-stone-600 font-medium">
                <span>{user.nationality === 'فلسطيني' ? '🇵🇸 فلسطيني' : user.nationality === 'أردني' ? '🇯🇴 أردني' : user.nationality === 'سعودي' ? '🇸🇦 سعودي' : `🌐 ${user.nationality}`}</span>
                {user.location && <span>• {user.location}</span>}
              </div>
            )}

            <p className="text-stone-800 leading-relaxed whitespace-pre-line text-xs">
              {user.bio}
            </p>

            {user.links && user.links.length > 0 && (
              <div className="pt-1 flex flex-wrap gap-2">
                {user.links.slice(0, 3).map((link, idx) => (
                  <a
                    key={link.id || idx}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-[#0F3D2E] hover:underline"
                  >
                    <LinkIcon className="w-3 h-3 text-[#D4AF37]" />
                    <span>{link.title || link.url}</span>
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Full-width Action Buttons Row on Mobile */}
          <div className="flex items-center gap-2 pt-1">
            {isOwnProfile ? (
              <>
                <button
                  onClick={() => setActiveView('edit_profile')}
                  className="flex-1 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs text-center transition-colors cursor-pointer active:scale-95"
                >
                  تعديل الملف الشخصي
                </button>
                <button
                  onClick={() => setActiveView('settings')}
                  className="p-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors cursor-pointer"
                  title="الإعدادات"
                >
                  <Settings className="w-4 h-4" />
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => {
                    if (!currentUser) onOpenAuth();
                    else toggleFollow(user.id);
                  }}
                  className={`flex-1 py-1.5 rounded-lg font-bold text-xs text-center transition-all cursor-pointer ${
                    isFollowing
                      ? 'bg-stone-100 text-stone-800'
                      : 'bg-[#0F3D2E] text-[#D4AF37]'
                  }`}
                >
                  {isFollowing ? 'متابع' : 'متابعة'}
                </button>
                <button
                  onClick={handleStartDM}
                  className="flex-1 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs text-center transition-colors cursor-pointer"
                >
                  مراسلة
                </button>
              </>
            )}

            <button
              onClick={() => setShowOptionsMenu(true)}
              className="p-1.5 rounded-lg bg-stone-100 text-stone-600 hover:bg-stone-200 transition-colors cursor-pointer"
              title="خيارات الحساب (مثل الانستغرام)"
            >
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>

      {/* Profile Highlights Reel & Stories */}
      <ProfileHighlights user={user} isCurrentUser={Boolean(isOwnProfile)} />

      {/* Instagram Navigation Tabs Bar */}
      <div className="flex items-center justify-center border-t border-stone-200 pt-1">
        <button
          onClick={() => setActiveTab('posts')}
          className={`flex items-center gap-2 py-3 px-6 text-xs font-bold transition-all border-t-2 -mt-[5px] cursor-pointer ${
            activeTab === 'posts'
              ? 'border-[#0F3D2E] text-[#0F3D2E]'
              : 'border-transparent text-stone-400 hover:text-stone-700'
          }`}
        >
          <Grid className="w-4 h-4" />
          <span>المنشورات ({userPosts.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('shop')}
          className={`flex items-center gap-2 py-3 px-6 text-xs font-bold transition-all border-t-2 -mt-[5px] cursor-pointer ${
            activeTab === 'shop'
              ? 'border-[#0F3D2E] text-[#0F3D2E]'
              : 'border-transparent text-stone-400 hover:text-stone-700'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>المتجر ({userProducts.length})</span>
        </button>

        {isOwnProfile && (
          <button
            onClick={() => setActiveTab('saved')}
            className={`flex items-center gap-2 py-3 px-6 text-xs font-bold transition-all border-t-2 -mt-[5px] cursor-pointer ${
              activeTab === 'saved'
                ? 'border-[#0F3D2E] text-[#0F3D2E]'
                : 'border-transparent text-stone-400 hover:text-stone-700'
            }`}
          >
            <Bookmark className="w-4 h-4" />
            <span>المحفوظات ({savedPosts.length})</span>
          </button>
        )}
      </div>

      {/* Tab Content */}
      <div className="space-y-4">
        {activeTab === 'posts' && (
          <div className="space-y-4">
            {/* Instagram Grid / Feed Toggle */}
            {userPosts.length > 0 && (
              <div className="flex items-center justify-end gap-1.5 pb-1">
                <button
                  onClick={() => setPostLayout('grid')}
                  className={`p-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
                    postLayout === 'grid'
                      ? 'bg-[#0F3D2E] text-[#D4AF37]'
                      : 'bg-white text-stone-500 border border-stone-200 hover:bg-stone-50'
                  }`}
                  title="عرض شبكة انستغرام (3 أعمدة)"
                >
                  <Grid className="w-3.5 h-3.5" />
                  <span className="text-[11px]">شبكة صور</span>
                </button>
                <button
                  onClick={() => setPostLayout('feed')}
                  className={`p-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
                    postLayout === 'feed'
                      ? 'bg-[#0F3D2E] text-[#D4AF37]'
                      : 'bg-white text-stone-500 border border-stone-200 hover:bg-stone-50'
                  }`}
                  title="عرض بطاقات كاملة"
                >
                  <List className="w-3.5 h-3.5" />
                  <span className="text-[11px]">بطاقات</span>
                </button>
              </div>
            )}

            {userPosts.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-stone-200 text-stone-500 text-xs space-y-2">
                <Grid className="w-8 h-8 text-stone-300 mx-auto" />
                <p className="font-bold text-stone-700">لا توجد منشورات حتى الآن</p>
                <p className="text-stone-400">عندما يقوم المستخدم بنشر أي تغريدة أو صورة ستظهر هنا مباشرة.</p>
              </div>
            ) : postLayout === 'grid' ? (
              /* Instagram 3-Column Square Photo Grid */
              <div className="grid grid-cols-3 gap-1 sm:gap-3">
                {userPosts.map((post) => {
                  const mediaImage = post.image || post.images?.[0];
                  return (
                    <div
                      key={post.id}
                      onClick={() => setSelectedPostModal(post)}
                      className="aspect-square bg-[#0F3D2E]/5 rounded-lg sm:rounded-xl overflow-hidden relative group cursor-pointer border border-stone-200/80"
                    >
                      {mediaImage ? (
                        <img
                          src={mediaImage}
                          alt="post"
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full p-2.5 sm:p-4 bg-gradient-to-b from-[#FCF9F0] to-[#EFE9D9] flex flex-col justify-between text-start select-none">
                          <span className="text-xs text-[#D4AF37] font-bold">AyGram</span>
                          <p className="text-[11px] sm:text-xs text-stone-800 line-clamp-3 leading-relaxed font-medium">
                            {post.content}
                          </p>
                          <span className="text-[9px] text-stone-400 font-mono">
                            {new Date(post.createdAt).toLocaleDateString('ar-SA')}
                          </span>
                        </div>
                      )}

                      {/* Instagram Hover Overlay with Like & Comment Counts */}
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-3 sm:gap-6 text-white font-bold text-xs sm:text-sm transition-opacity duration-200">
                        <div className="flex items-center gap-1">
                          <Heart className="w-4 h-4 fill-white text-white" />
                          <span className="font-mono">{post.likes?.length || 0}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageSquare className="w-4 h-4 fill-white text-white" />
                          <span className="font-mono">{post.comments?.length || 0}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* Full Feed View */
              userPosts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  onOpenReport={onOpenReport}
                  onOpenAuth={onOpenAuth}
                />
              ))
            )}
          </div>
        )}

        {activeTab === 'shop' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {userProducts.length === 0 ? (
              <div className="col-span-full bg-white rounded-3xl p-10 text-center border border-stone-200 text-stone-500 text-xs">
                لا توجد سلع معروضة في متجر هذا الحساب حالياً.
              </div>
            ) : (
              userProducts.map((prod) => (
                <div
                  key={prod.id}
                  className="bg-white rounded-2xl p-4 border border-stone-200 shadow-sm space-y-3"
                >
                  {prod.images && prod.images[0] && (
                    <img
                      src={prod.images[0]}
                      alt={prod.title}
                      className="w-full h-44 rounded-xl object-cover"
                    />
                  )}
                  <h3 className="text-sm font-bold text-stone-900">{prod.title}</h3>
                  <p className="text-xs text-stone-500 line-clamp-2">{prod.description}</p>
                  <div className="flex items-center justify-between pt-2 border-t border-stone-100 text-xs font-bold text-[#0F3D2E]">
                    <span>{prod.price} {user.currency || 'SAR'}</span>
                    <span className="text-[11px] text-stone-400 font-normal">
                      {prod.category}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'saved' && isOwnProfile && (
          <div className="space-y-4">
            {savedPosts.length === 0 ? (
              <div className="bg-white rounded-3xl p-10 text-center border border-stone-200 text-stone-500 text-xs">
                لا توجد تغريدات محفوظة في قائمتك.
              </div>
            ) : (
              savedPosts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  onOpenReport={onOpenReport}
                  onOpenAuth={onOpenAuth}
                />
              ))
            )}
          </div>
        )}
      </div>

      {/* Selected Post Modal from Instagram Grid View */}
      {selectedPostModal && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto cursor-pointer"
          onClick={() => setSelectedPostModal(null)}
        >
          <div
            className="w-full max-w-lg cursor-default"
            onClick={(e) => e.stopPropagation()}
          >
            <PostCard
              post={selectedPostModal}
              onOpenReport={onOpenReport}
              onOpenAuth={onOpenAuth}
            />
          </div>
        </div>
      )}

      <ProfileOptionsMenu
        isOpen={showOptionsMenu}
        onClose={() => setShowOptionsMenu(false)}
        user={user}
        onOpenReport={onOpenReport}
        onOpenAuth={onOpenAuth}
      />
    </div>
  );
};
