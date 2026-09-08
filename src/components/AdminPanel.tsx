import React, { useState } from 'react';
import {
  Shield,
  CheckCircle,
  XCircle,
  Trash2,
  Ban,
  UserCheck,
  AlertTriangle,
  FileText,
  ShoppingBag,
  Users,
  ListOrdered,
  Plus,
  ArrowRight,
  LogOut,
  Search,
  Eye,
  Sliders,
  Sparkles,
  History,
  Lock,
  ExternalLink,
  Award,
  BellRing,
  Wrench,
  Send,
  Check,
  Globe,
  Smartphone,
  UserX,
  X,
  LifeBuoy,
  MessageSquare,
  Clock,
  Inbox,
  ChevronRight,
  ChevronLeft,
  Heart,
  Repeat2,
  TrendingUp,
  BarChart3,
  Database,
  Radio,
  Layers,
  DollarSign,
  MessageCircle,
  Copy,
  KeyRound,
  ShieldCheck
} from 'lucide-react';
import { AYGRAM_SUPABASE_SQL } from '../utils/supabaseSchema';
import { useAyGram } from '../context/AyGramContext';
import { OWNER_ACCOUNT_ID } from '../context/AyGramContext';
import { BaubleToggle } from './BaubleToggle';
import { formatFingerprint } from '../utils/fingerprint';
import { User, SupportStatus, SupportTicket } from '../types/aygram';

const CLOSURE_REASONS = [
  'الإرهاب والتطرف',
  'الحسابات المزيفة والانتحال',
  'المحتوى الإباحي',
  'شتم الذات الإلهية',
  'الاستهانة بالدين والرموز الدينية',
  'نشر محتوى غير لائق',
  'نشر صور متبرجات',
  'انتحال شخصية آخرين',
  'مضايقة شخص آخر',
  'التهديد والتشهير بشخص آخر',
];

export const AdminPanel: React.FC = () => {
  const {
    users,
    posts,
    products,
    reports,
    blockedWords,
    adminLogs,
    settings,
    verificationRequests,
    notifications,
    usernameReservations,
    setUsernameReservations,
    approveUsernameReservation,
    exitAdmin,
    approvePost,
    rejectPost,
    deletePost,
    approveProduct,
    rejectProduct,
    deleteProduct,
    toggleUserBan,
    deleteUser,
    resolveReport,
    dismissReport,
    addBlockedWord,
    removeBlockedWord,
    updateSettings,
    toggleMaintenanceMode,
    toggleUserVerification,
    reviewVerificationRequest,
    sendAdminBroadcast,
    closeAccount,
    supportTickets,
    replyToSupportTicket,
    updateSupportTicketStatus,
    deleteSupportTicket,
    passwordResetRequests,
    approvePasswordReset,
    rejectPasswordReset,
    channels,
    channelPosts,
    conversations,
    messages,
    stories,
  } = useAyGram();

  const [activeAdminTab, setActiveAdminTab] = useState<
    'overview' | 'posts' | 'products' | 'users' | 'verifications' | 'broadcasts' | 'maintenance' | 'reports' | 'blacklist' | 'logs' | 'settings' | 'usernameReservations' | 'support' | 'passwordResets'
  >('overview');

  // Support tickets state in admin
  const [selectedAdminTicketId, setSelectedAdminTicketId] = useState<string | null>(null);
  const [adminReplyText, setAdminReplyText] = useState('');
  const [adminTicketFilter, setAdminTicketFilter] = useState<'all' | 'open' | 'in_progress' | 'waiting_user' | 'resolved' | 'closed'>('all');

  // New blocked word input
  const [newWord, setNewWord] = useState('');
  const [blacklistMsg, setBlacklistMsg] = useState('');

  // Rejection modal state
  const [rejectingTarget, setRejectingTarget] = useState<{
    type: 'post' | 'product' | 'password_reset';
    id: string;
  } | null>(null);
  const [rejectionReason, setRejectionReason] = useState('مخالفة لسياسات وشروط الاستخدام للمنصة');

  // User search in admin
  const [userSearch, setUserSearch] = useState('');

  // Admin Broadcast form state
  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [broadcastText, setBroadcastText] = useState('');
  const [broadcastTarget, setBroadcastTarget] = useState('all');
  const [broadcastImportance, setBroadcastImportance] = useState<'normal' | 'urgent' | 'guidance'>('normal');
  const [broadcastSuccess, setBroadcastSuccess] = useState('');

  // Maintenance form state
  const [maintEnabled, setMaintEnabled] = useState(settings.maintenanceMode);
  const [maintMessage, setMaintMessage] = useState(settings.maintenanceMessage);
  const [maintSuccess, setMaintSuccess] = useState('');

  // Supabase SQL helper state
  const [copiedSql, setCopiedSql] = useState(false);
  const [showSqlModal, setShowSqlModal] = useState(false);

  // Tabs horizontal scroll navigation
  const tabsContainerRef = React.useRef<HTMLDivElement>(null);

  const handleScrollTabs = (direction: 'left' | 'right') => {
    if (!tabsContainerRef.current) return;
    const scrollAmount = 260;
    tabsContainerRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  // Counts
  const pendingPosts = posts.filter((p) => !p.isApproved && !p.isBlocked);
  const pendingProducts = products.filter((p) => !p.isApproved && !p.isBlocked);
  const pendingReports = reports.filter((r) => r.status === 'pending');
  const pendingVerifications = verificationRequests.filter((v) => v.status === 'pending');
  const openTicketsCount = supportTickets.filter((t) => t.status === 'open' || t.status === 'in_progress').length;

  // Detailed platform statistics
  const totalUsersCount = users.length;
  const verifiedUsersCount = users.filter((u) => u.verified).length;
  const goldBadgesCount = users.filter((u) => u.verificationBadge === 'gold').length;
  const blueBadgesCount = users.filter((u) => u.verificationBadge === 'blue' || (u.verified && !u.verificationBadge)).length;
  const creatorAccountsCount = users.filter((u) => u.accountType === 'creator').length;
  const businessAccountsCount = users.filter((u) => u.accountType === 'business').length;
  const personalAccountsCount = users.filter((u) => !u.accountType || u.accountType === 'personal').length;
  const bannedUsersCount = users.filter((u) => !u.isActive).length;
  const closedUsersCount = users.filter((u) => u.isClosed).length;

  // Nationalities breakdown
  const nationalityMap = users.reduce((acc, u) => {
    const nat = u.nationality || 'غير محدد';
    acc[nat] = (acc[nat] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Posts & Engagement
  const totalPostsCount = posts.length;
  const approvedPostsCount = posts.filter((p) => p.isApproved).length;
  const pendingPostsCount = posts.filter((p) => !p.isApproved && !p.isBlocked).length;
  const blockedPostsCount = posts.filter((p) => p.isBlocked).length;
  const totalViewsCount = posts.reduce((sum, p) => sum + (p.viewsCount || 0), 0);
  const totalLikesCount = posts.reduce((sum, p) => sum + (p.likes?.length || 0), 0);
  const totalRetweetsCount = posts.reduce((sum, p) => sum + (p.retweets?.length || 0), 0);
  const totalCommentsCount = posts.reduce((sum, p) => sum + (p.comments?.length || 0), 0);
  const closeFriendsPostsCount = posts.filter((p) => p.isCloseFriendsOnly).length;

  // Messaging & Conversations
  const totalMessagesCount = messages?.length || 0;
  const totalConversationsCount = conversations?.length || 0;
  const mediaMessagesCount = messages?.filter((m) => m.audio || m.sharedPostId)?.length || 0;

  // Marketplace & Products
  const totalProductsCount = products.length;
  const approvedProductsCount = products.filter((p) => p.isApproved).length;
  const pendingProductsCount = products.filter((p) => !p.isApproved && !p.isBlocked).length;
  const totalSalesCount = products.reduce((sum, p) => sum + (p.salesCount || 0), 0);
  const totalCatalogValue = products.reduce((sum, p) => sum + ((p.price || 0) * (p.stock || 1)), 0);

  // Stories & Reels
  const totalStoriesCount = stories?.length || 0;
  const totalStoryViewsCount = stories?.reduce((sum, s) => sum + (s.viewsCount || 0), 0) || 0;

  // Channels & Community
  const totalChannelsCount = channels?.length || 0;
  const totalChannelPostsCount = channelPosts?.length || 0;
  const totalChannelSubscriptions = channels?.reduce((sum, c) => sum + (c.memberIds?.length || 0), 0) || 0;

  // Moderation & Support
  const totalTicketsCount = supportTickets?.length || 0;
  const openTicketsCountTotal = supportTickets?.filter((t) => t.status === 'open' || t.status === 'in_progress')?.length || 0;
  const resolvedTicketsCount = supportTickets?.filter((t) => t.status === 'resolved' || t.status === 'closed')?.length || 0;
  const totalReportsCount = reports.length;
  const pendingReportsCount = reports.filter((r) => r.status === 'pending').length;
  const blockedWordsCount = blockedWords.length;
  const verificationsCount = verificationRequests.length;
  const reservationsCount = usernameReservations.length;
  const adminLogsCount = adminLogs.length;

  const handleAddWordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWord.trim()) return;
    const res = addBlockedWord(newWord.trim());
    if (res.success) {
      setNewWord('');
      setBlacklistMsg('تمت إضافة الكلمة بنجاح إلى قائمة الفلترة الرقمية');
      setTimeout(() => setBlacklistMsg(''), 3000);
    } else {
      setBlacklistMsg(res.error || 'حدث خطأ');
    }
  };

  const handleConfirmReject = () => {
    if (!rejectingTarget) return;
    if (rejectingTarget.type === 'post') {
      rejectPost(rejectingTarget.id, rejectionReason);
    } else if (rejectingTarget.type === 'product') {
      rejectProduct(rejectingTarget.id, rejectionReason);
    } else if (rejectingTarget.type === 'password_reset') {
      rejectPasswordReset(rejectingTarget.id, rejectionReason);
    }
    setRejectingTarget(null);
    setRejectionReason('مخالفة لسياسات وشروط الاستخدام للمنصة');
  };

  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastTitle.trim() || !broadcastText.trim()) return;

    sendAdminBroadcast({
      title: broadcastTitle.trim(),
      text: broadcastText.trim(),
      targetUserId: broadcastTarget,
      importance: broadcastImportance,
    });

    setBroadcastSuccess('تم إرسال التعميم الإداري بنجاح إلى الإشعارات!');
    setBroadcastTitle('');
    setBroadcastText('');
    setTimeout(() => setBroadcastSuccess(''), 3000);
  };

  const handleSaveMaintenance = (e: React.FormEvent) => {
    e.preventDefault();
    toggleMaintenanceMode(maintEnabled, maintMessage);
    setMaintSuccess(
      maintEnabled
        ? 'تم تفعيل وضع الصيانة بنجاح، سيظهر للزوار فقط شاشة الصيانة.'
        : 'تم تعطيل وضع الصيانة واستئناف تشغيل المنصة للجميع.'
    );
    setTimeout(() => setMaintSuccess(''), 3000);
  };

  const filteredUsers = users.filter(
    (u) =>
      u.username.toLowerCase().includes(userSearch.toLowerCase()) ||
      (u.fullName && u.fullName.toLowerCase().includes(userSearch.toLowerCase())) ||
      (u.nationality && u.nationality.toLowerCase().includes(userSearch.toLowerCase()))
  );

  // Account closure + device fingerprints
  const [closureTarget, setClosureTarget] = useState<User | null>(null);
  const [closureReason, setClosureReason] = useState(CLOSURE_REASONS[0]);
  const [expandedDevices, setExpandedDevices] = useState<string | null>(null);

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6 font-['IBM_Plex_Sans_Arabic']" dir="rtl">
      
      {/* Top Admin Header */}
      <div className="bg-[#0F3D2E] text-white p-5 sm:p-6 rounded-[20px] shadow-aygram-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-[14px] bg-[#D4AF37] text-[#0F3D2E] flex items-center justify-center font-bold text-xl shadow-gold shrink-0">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-bold">لوحة الإشراف والرقابة العامة على المنصة</h1>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#D4AF37] text-[#0F3D2E] font-bold">
                حساب سري مُعتمد
              </span>
            </div>
            <p className="text-xs text-[#FCF9F0]/80 mt-0.5">
              متابعة المحتوى، التوثيق، الصيانة، البلاغات، وإشعارات الإدارة المباشرة
            </p>
          </div>
        </div>

        {/* Exit Admin Button */}
        <button
          onClick={exitAdmin}
          className="flex items-center gap-2 py-2.5 px-4 rounded-[12px] bg-white/10 hover:bg-white/20 text-[#FCF9F0] border border-white/20 text-xs font-bold transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4 rotate-180" />
          <span>الخروج من وضع المشرف</span>
        </button>
      </div>

      {/* Admin Navigation Tabs with Scroll Arrows */}
      <div className="relative flex items-center gap-2 bg-white p-2 rounded-[16px] border border-[#EFE9D9] shadow-xs">
        {/* Right Scroll Arrow (In RTL, scrolls toward previous/start) */}
        <button
          onClick={() => handleScrollTabs('right')}
          className="shrink-0 w-8 h-8 rounded-[10px] bg-[#0F3D2E]/10 hover:bg-[#0F3D2E] text-[#0F3D2E] hover:text-[#D4AF37] flex items-center justify-center transition-all cursor-pointer border border-[#0F3D2E]/10 shadow-xs active:scale-95"
          title="تمرير لليمين"
          aria-label="تمرير لليمين"
        >
          <ChevronRight className="w-4 h-4" />
        </button>

        {/* Scrollable Tabs Container */}
        <div
          ref={tabsContainerRef}
          className="flex-1 flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth py-1"
        >
          {[
            { id: 'overview', label: 'لوحة الإحصائيات الشاملة', icon: <BarChart3 className="w-4 h-4" /> },
            {
              id: 'posts',
              label: 'المنشورات المعلقة',
              icon: <FileText className="w-4 h-4" />,
              badge: pendingPosts.length,
            },
            {
              id: 'products',
              label: 'المنتجات المعلقة',
              icon: <ShoppingBag className="w-4 h-4" />,
              badge: pendingProducts.length,
            },
            { id: 'users', label: 'إدارة وحظر الحسابات', icon: <Users className="w-4 h-4" /> },
            {
              id: 'verifications',
              label: 'طلبات التوثيق',
              icon: <Award className="w-4 h-4" />,
              badge: pendingVerifications.length,
            },
            { id: 'broadcasts', label: 'إشعارات وتعاميم الإدارة', icon: <BellRing className="w-4 h-4" /> },
            { id: 'maintenance', label: 'نظام صيانة الموقع', icon: <Wrench className="w-4 h-4" /> },
            {
              id: 'reports',
              label: 'البلاغات والشكاوى',
              icon: <AlertTriangle className="w-4 h-4" />,
              badge: pendingReports.length,
            },
            { id: 'blacklist', label: 'الكلمات الممنوعة', icon: <Ban className="w-4 h-4" /> },
            { id: 'logs', label: 'سجل العمليات (Logs)', icon: <History className="w-4 h-4" /> },
            { id: 'settings', label: 'سياسات النشر', icon: <Lock className="w-4 h-4" /> },
            { id: 'usernameReservations', label: 'حجوزات اليوزر', icon: <CheckCircle className="w-4 h-4" /> },
            {
              id: 'support',
              label: 'تذاكر الدعم الفني',
              icon: <LifeBuoy className="w-4 h-4 text-[#D4AF37]" />,
              badge: openTicketsCount,
            },
            {
              id: 'passwordResets',
              label: 'استعادة الحسابات وتأكيد الهوية',
              icon: <KeyRound className="w-4 h-4 text-[#D4AF37]" />,
              badge: passwordResetRequests.filter((r) => r.status === 'pending').length,
            },
          ].map((tab) => {
            const isActive = activeAdminTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveAdminTab(tab.id as any)}
                className={`flex items-center gap-2 px-3.5 py-2.5 rounded-[12px] text-xs font-bold transition-all whitespace-nowrap cursor-pointer shrink-0 ${
                  isActive
                    ? 'bg-[#0F3D2E] text-[#D4AF37] shadow-aygram'
                    : 'bg-stone-50 text-[#7A7A7A] hover:text-[#1A1A1A] hover:bg-stone-100 border border-[#EFE9D9]'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-[#D4AF37] text-[#0F3D2E]">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Left Scroll Arrow (In RTL, scrolls toward next/end) */}
        <button
          onClick={() => handleScrollTabs('left')}
          className="shrink-0 w-8 h-8 rounded-[10px] bg-[#0F3D2E]/10 hover:bg-[#0F3D2E] text-[#0F3D2E] hover:text-[#D4AF37] flex items-center justify-center transition-all cursor-pointer border border-[#0F3D2E]/10 shadow-xs active:scale-95"
          title="تمرير لليسار"
          aria-label="تمرير لليسار"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
      </div>

      {/* 1. OVERVIEW DASHBOARD (COMPREHENSIVE STATISTICS) */}
      {activeAdminTab === 'overview' && (
        <div className="space-y-6">
          {/* Top Main 4 Summary Metrics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Users Metric */}
            <div className="bg-white p-5 rounded-[18px] border border-[#EFE9D9] shadow-aygram hover:border-[#0F3D2E]/30 transition-all">
              <div className="flex items-center justify-between text-xs text-[#7A7A7A] font-bold">
                <span>إجمالي المستخدمين</span>
                <Users className="w-4 h-4 text-[#0F3D2E]" />
              </div>
              <div className="text-3xl font-black text-[#0F3D2E] mt-2 font-mono">{totalUsersCount}</div>
              <div className="flex items-center gap-1.5 text-[11px] text-emerald-700 mt-2 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span>{verifiedUsersCount} حسابات موثقة</span>
                <span className="text-stone-400">•</span>
                <span>{users.filter(u => u.isActive).length} نشط</span>
              </div>
            </div>

            {/* Posts Metric */}
            <div className="bg-white p-5 rounded-[18px] border border-[#EFE9D9] shadow-aygram hover:border-[#0F3D2E]/30 transition-all">
              <div className="flex items-center justify-between text-xs text-[#7A7A7A] font-bold">
                <span>التغريدات والمنشورات</span>
                <FileText className="w-4 h-4 text-[#D4AF37]" />
              </div>
              <div className="text-3xl font-black text-[#0F3D2E] mt-2 font-mono">{totalPostsCount}</div>
              <div className="flex items-center gap-1.5 text-[11px] text-stone-600 mt-2 font-medium">
                <span className="text-emerald-600 font-bold">{approvedPostsCount} معتمد</span>
                <span className="text-stone-400">•</span>
                <span className="text-amber-600 font-bold">{pendingPostsCount} معلق</span>
              </div>
            </div>

            {/* Messages Metric */}
            <div className="bg-white p-5 rounded-[18px] border border-[#EFE9D9] shadow-aygram hover:border-[#0F3D2E]/30 transition-all">
              <div className="flex items-center justify-between text-xs text-[#7A7A7A] font-bold">
                <span>الرسائل والمحادثات</span>
                <MessageSquare className="w-4 h-4 text-sky-600" />
              </div>
              <div className="text-3xl font-black text-[#0F3D2E] mt-2 font-mono">{totalMessagesCount}</div>
              <div className="flex items-center gap-1.5 text-[11px] text-stone-600 mt-2 font-medium">
                <span className="text-sky-700 font-bold">{totalConversationsCount} محادثات نشطة</span>
                <span className="text-stone-400">•</span>
                <span>{mediaMessagesCount} وسائط</span>
              </div>
            </div>

            {/* Store & Products Metric */}
            <div className="bg-white p-5 rounded-[18px] border border-[#EFE9D9] shadow-aygram hover:border-[#0F3D2E]/30 transition-all">
              <div className="flex items-center justify-between text-xs text-[#7A7A7A] font-bold">
                <span>سوق المبدعين</span>
                <ShoppingBag className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-3xl font-black text-[#D4AF37] mt-2 font-mono">{totalProductsCount}</div>
              <div className="flex items-center gap-1.5 text-[11px] text-stone-600 mt-2 font-medium">
                <span className="text-emerald-700 font-bold">{totalSalesCount} مبيعات</span>
                <span className="text-stone-400">•</span>
                <span>{totalCatalogValue.toLocaleString('ar-SA')} ر.س قيمة</span>
              </div>
            </div>
          </div>

          {/* Detailed Statistics Grids */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            {/* 1. Users & Accounts Deep Dive */}
            <div className="bg-white p-5 rounded-[20px] border border-[#EFE9D9] shadow-aygram space-y-4">
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-[#0F3D2E]/10 flex items-center justify-center text-[#0F3D2E]">
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#0F3D2E]">تفاصيل الحسابات والمستخدمين</h3>
                    <p className="text-[11px] text-[#7A7A7A]">توزيع الفئات، التوثيق، والجنسيات</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-[#0F3D2E] text-[#D4AF37] text-xs font-mono font-bold">
                  {totalUsersCount} عضو
                </span>
              </div>

              {/* Sub-metrics grid */}
              <div className="grid grid-cols-3 gap-2.5 text-center">
                <div className="bg-[#FCF9F0] p-3 rounded-xl border border-[#EFE9D9]">
                  <span className="text-[10px] text-stone-500 block font-medium">صناع محتوى</span>
                  <span className="text-lg font-bold text-[#0F3D2E] font-mono">{creatorAccountsCount}</span>
                </div>
                <div className="bg-[#FCF9F0] p-3 rounded-xl border border-[#EFE9D9]">
                  <span className="text-[10px] text-stone-500 block font-medium">حسابات أعمال</span>
                  <span className="text-lg font-bold text-amber-700 font-mono">{businessAccountsCount}</span>
                </div>
                <div className="bg-[#FCF9F0] p-3 rounded-xl border border-[#EFE9D9]">
                  <span className="text-[10px] text-stone-500 block font-medium">شخصي</span>
                  <span className="text-lg font-bold text-stone-700 font-mono">{personalAccountsCount}</span>
                </div>
              </div>

              {/* Verification & Status Rows */}
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between p-2 rounded-xl bg-stone-50">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#D4AF37]"></span>
                    <span className="text-stone-700">شارة التوثيق الذهبية (رسمي وأعمال)</span>
                  </div>
                  <span className="font-bold font-mono text-[#0F3D2E]">{goldBadgesCount}</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-xl bg-stone-50">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-sky-500"></span>
                    <span className="text-stone-700">شارة التوثيق الزرقاء (مبدعين وصناع)</span>
                  </div>
                  <span className="font-bold font-mono text-[#0F3D2E]">{blueBadgesCount}</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-xl bg-stone-50">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-red-500"></span>
                    <span className="text-stone-700">حسابات محظورة أو معطلة</span>
                  </div>
                  <span className="font-bold font-mono text-red-600">{bannedUsersCount + closedUsersCount}</span>
                </div>
              </div>

              {/* Nationalities Breakdown */}
              <div className="pt-2 border-t border-stone-100">
                <span className="text-xs font-bold text-[#0F3D2E] block mb-2">توزيع الجنسيات المسجلة:</span>
                <div className="flex flex-wrap gap-1.5">
                  {Object.entries(nationalityMap).map(([nat, count]) => (
                    <span
                      key={nat}
                      className="px-2.5 py-1 rounded-lg bg-[#0F3D2E]/5 text-[#0F3D2E] text-[11px] font-bold border border-[#0F3D2E]/10 flex items-center gap-1.5"
                    >
                      {nat === 'فلسطيني' ? '🇵🇸' : nat === 'أردني' ? '🇯🇴' : nat === 'سعودي' ? '🇸🇦' : nat === 'إماراتي' ? '🇦🇪' : '🌐'}
                      <span>{nat}</span>
                      <span className="font-mono text-stone-500">({count})</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* 2. Posts & Content Engagement */}
            <div className="bg-white p-5 rounded-[20px] border border-[#EFE9D9] shadow-aygram space-y-4">
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-[#D4AF37]/15 flex items-center justify-center text-[#D4AF37]">
                    <TrendingUp className="w-4 h-4 text-[#0F3D2E]" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#0F3D2E]">المحتوى والتفاعل الجماهيري</h3>
                    <p className="text-[11px] text-[#7A7A7A]">المشاهدات، الإعجابات، التعليقات، والريتويت</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-[#D4AF37] text-[#0F3D2E] text-xs font-mono font-bold">
                  {totalViewsCount} مشاهدة
                </span>
              </div>

              {/* 4 Interaction Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center">
                <div className="bg-[#FCF9F0] p-3 rounded-xl border border-[#EFE9D9]">
                  <Eye className="w-4 h-4 mx-auto text-[#0F3D2E] mb-1" />
                  <span className="text-[10px] text-stone-500 block">المشاهدات</span>
                  <span className="text-base font-bold text-[#0F3D2E] font-mono">{totalViewsCount}</span>
                </div>
                <div className="bg-[#FCF9F0] p-3 rounded-xl border border-[#EFE9D9]">
                  <Heart className="w-4 h-4 mx-auto text-rose-500 mb-1" />
                  <span className="text-[10px] text-stone-500 block">الإعجابات</span>
                  <span className="text-base font-bold text-rose-600 font-mono">{totalLikesCount}</span>
                </div>
                <div className="bg-[#FCF9F0] p-3 rounded-xl border border-[#EFE9D9]">
                  <Repeat2 className="w-4 h-4 mx-auto text-emerald-600 mb-1" />
                  <span className="text-[10px] text-stone-500 block">إعادة تغريد</span>
                  <span className="text-base font-bold text-emerald-700 font-mono">{totalRetweetsCount}</span>
                </div>
                <div className="bg-[#FCF9F0] p-3 rounded-xl border border-[#EFE9D9]">
                  <MessageCircle className="w-4 h-4 mx-auto text-sky-600 mb-1" />
                  <span className="text-[10px] text-stone-500 block">التعليقات</span>
                  <span className="text-base font-bold text-sky-700 font-mono">{totalCommentsCount}</span>
                </div>
              </div>

              {/* Status List */}
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between p-2 rounded-xl bg-stone-50">
                  <span className="text-stone-700">تغريدات معتمدة ومنشورة للعامة</span>
                  <span className="font-bold font-mono text-emerald-700">{approvedPostsCount}</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-xl bg-stone-50">
                  <span className="text-stone-700">تغريدات قيد المراجعة والتدقيق</span>
                  <span className="font-bold font-mono text-amber-700">{pendingPostsCount}</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-xl bg-stone-50">
                  <span className="text-stone-700">تغريدات حصرية للأصدقاء المقربين ⭐</span>
                  <span className="font-bold font-mono text-emerald-600">{closeFriendsPostsCount}</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-xl bg-stone-50">
                  <span className="text-stone-700">تغريدات محظورة أو مرفوضة</span>
                  <span className="font-bold font-mono text-red-600">{blockedPostsCount}</span>
                </div>
              </div>
            </div>

            {/* 3. Community Channels & Stories */}
            <div className="bg-white p-5 rounded-[20px] border border-[#EFE9D9] shadow-aygram space-y-4">
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center text-[#0F3D2E]">
                    <Radio className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#0F3D2E]">القنوات التفاعلية والقصص</h3>
                    <p className="text-[11px] text-[#7A7A7A]">المجتمعات العامة وقصص الستوري اليومية</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-mono font-bold">
                  {totalChannelsCount} قنوات
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-[#FCF9F0] rounded-xl border border-[#EFE9D9]">
                  <span className="text-stone-500 text-[11px] block">إجمالي منشورات القنوات</span>
                  <span className="text-xl font-black text-[#0F3D2E] font-mono mt-1 block">{totalChannelPostsCount}</span>
                  <span className="text-[10px] text-stone-400 mt-1 block">{totalChannelSubscriptions} اشتراك عضو بالقنوات</span>
                </div>
                <div className="p-3 bg-[#FCF9F0] rounded-xl border border-[#EFE9D9]">
                  <span className="text-stone-500 text-[11px] block">القصص النشطة (Stories)</span>
                  <span className="text-xl font-black text-[#D4AF37] font-mono mt-1 block">{totalStoriesCount}</span>
                  <span className="text-[10px] text-stone-400 mt-1 block">{totalStoryViewsCount} مشاهدات القصص الإجمالية</span>
                </div>
              </div>

              {/* Direct Messages Detail */}
              <div className="p-3 rounded-xl bg-sky-50/70 border border-sky-100 space-y-2 text-xs">
                <div className="flex items-center justify-between font-bold text-sky-900">
                  <span>المراسلة الفورية المشفرة:</span>
                  <span className="font-mono">{totalMessagesCount} رسالة</span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-sky-700">
                  <span>المحادثات الخاصة القائمة بين الأعضاء:</span>
                  <span className="font-bold font-mono">{totalConversationsCount} محادثة</span>
                </div>
              </div>
            </div>

            {/* 4. Support, Moderation & System Security */}
            <div className="bg-white p-5 rounded-[20px] border border-[#EFE9D9] shadow-aygram space-y-4">
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-rose-50 flex items-center justify-center text-rose-700">
                    <Shield className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#0F3D2E]">الرقابة، الدعم الفني، والأمان</h3>
                    <p className="text-[11px] text-[#7A7A7A]">حالة البلاغات، التذاكر، وفلترة المحتوى</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-stone-100 text-stone-800 text-xs font-mono font-bold">
                  {totalTicketsCount} تذكرة
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2.5 text-center text-xs">
                <div className="p-2.5 bg-stone-50 rounded-xl border border-stone-200">
                  <span className="text-[10px] text-stone-500 block">تذاكر مفتوحة</span>
                  <span className="text-base font-bold text-amber-700 font-mono">{openTicketsCountTotal}</span>
                </div>
                <div className="p-2.5 bg-stone-50 rounded-xl border border-stone-200">
                  <span className="text-[10px] text-stone-500 block">تذاكر تم حلها</span>
                  <span className="text-base font-bold text-emerald-700 font-mono">{resolvedTicketsCount}</span>
                </div>
                <div className="p-2.5 bg-stone-50 rounded-xl border border-stone-200">
                  <span className="text-[10px] text-stone-500 block">بلاغات معلقة</span>
                  <span className="text-base font-bold text-rose-700 font-mono">{pendingReportsCount}</span>
                </div>
              </div>

              <div className="space-y-1.5 text-xs text-stone-700">
                <div className="flex items-center justify-between py-1.5 px-2 rounded-lg bg-stone-50">
                  <span>الكلمات المحظورة بالفلتر التلقائي:</span>
                  <span className="font-bold font-mono text-[#0F3D2E]">{blockedWordsCount} كلمة</span>
                </div>
                <div className="flex items-center justify-between py-1.5 px-2 rounded-lg bg-stone-50">
                  <span>طلبات التوثيق وحجوزات المعرفات:</span>
                  <span className="font-bold font-mono text-[#0F3D2E]">{verificationsCount + reservationsCount} طلب</span>
                </div>
                <div className="flex items-center justify-between py-1.5 px-2 rounded-lg bg-stone-50">
                  <span>سجل العمليات الإدارية المسجلة (Audit Logs):</span>
                  <span className="font-bold font-mono text-stone-600">{adminLogsCount} عملية</span>
                </div>
              </div>

              {/* System Infrastructure Status */}
              <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs font-medium">
                <span className="text-stone-500 flex items-center gap-1.5">
                  <Database className="w-3.5 h-3.5 text-emerald-600" />
                  <span>المزامنة السحابية وقاعدة البيانات:</span>
                </span>
                <span className="text-emerald-700 font-bold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>متصل ونشط 100%</span>
                </span>
              </div>
            </div>

            {/* Supabase SQL Fast Action Card */}
            <div className="bg-gradient-to-r from-emerald-900 to-[#0F3D2E] text-white p-5 rounded-[20px] shadow-sm space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/20 border border-[#D4AF37]/30 flex items-center justify-center shrink-0">
                    <Database className="w-5 h-5 text-[#D4AF37]" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      كود إعداد قاعدة بيانات Supabase (SQL Script)
                    </h4>
                    <p className="text-xs text-emerald-200/80">
                      عند فتح نافذة الـ SQL Editor في Supabase وتجدها فارغة، انسخ هذا الكود والصقه هناك ثم اضغط Run
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(AYGRAM_SUPABASE_SQL);
                      setCopiedSql(true);
                      setTimeout(() => setCopiedSql(false), 3500);
                    }}
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-[#D4AF37] hover:bg-[#c49f2e] text-[#0F3D2E] transition-all flex items-center gap-2 shadow-md hover:scale-[1.02] active:scale-[0.98]"
                  >
                    {copiedSql ? <Check className="w-4 h-4 text-[#0F3D2E]" /> : <Copy className="w-4 h-4 text-[#0F3D2E]" />}
                    <span>{copiedSql ? 'تم النسخ بنجاح! 📋' : 'نسخ كود الـ SQL بالكامل'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowSqlModal(true)}
                    className="px-3 py-2 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all flex items-center gap-1.5"
                  >
                    <Eye className="w-4 h-4" />
                    <span>معاينة الكود</span>
                  </button>
                </div>
              </div>
            </div>

          </div>

          {/* SQL Preview Modal */}
          {showSqlModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
              <div className="bg-white w-full max-w-2xl rounded-2xl p-6 shadow-2xl border border-stone-200 flex flex-col max-h-[85vh] space-y-4">
                <div className="flex items-center justify-between border-b pb-3 border-stone-100">
                  <div className="flex items-center gap-2">
                    <Database className="w-5 h-5 text-[#0F3D2E]" />
                    <h3 className="text-base font-bold text-[#0F3D2E]">كود تهيئة قاعدة بيانات Supabase</h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowSqlModal(false)}
                    className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100 transition"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="text-xs text-stone-600 bg-amber-50 p-3 rounded-xl border border-amber-200">
                  <p className="font-bold text-amber-900 mb-1">📌 خطوات التشغيل السريعة:</p>
                  <ol className="list-decimal list-inside space-y-0.5 text-amber-800">
                    <li>اضغط على زر <strong>نسخ الكود بالكامل</strong> أدناه.</li>
                    <li>افتح لوحة تحكم <strong>Supabase</strong> ثم اضغط على <strong>SQL Editor</strong>.</li>
                    <li>الصق الكود في الصفحة الفارغة واضغط الزر الأخضر <strong>Run</strong> أسفل الشاشة.</li>
                  </ol>
                </div>

                <div className="flex-1 overflow-auto rounded-xl bg-stone-900 p-4 border border-stone-800">
                  <pre className="text-[11px] font-mono text-emerald-400 whitespace-pre-wrap dir-ltr text-left">
                    {AYGRAM_SUPABASE_SQL}
                  </pre>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-100">
                  <button
                    type="button"
                    onClick={() => setShowSqlModal(false)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-stone-600 hover:bg-stone-100 transition"
                  >
                    إغلاق
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(AYGRAM_SUPABASE_SQL);
                      setCopiedSql(true);
                      setTimeout(() => setCopiedSql(false), 3500);
                    }}
                    className="px-5 py-2 rounded-xl text-xs font-bold bg-[#0F3D2E] text-white hover:bg-[#14533D] transition flex items-center gap-2 shadow-sm"
                  >
                    {copiedSql ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedSql ? 'تم النسخ بنجاح!' : 'نسخ الكود بالكامل'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 2. PENDING POSTS */}
      {activeAdminTab === 'posts' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-white p-4 rounded-[16px] border border-[#EFE9D9]">
            <div>
              <h2 className="text-sm font-bold text-[#0F3D2E]">قائمة التغريدات المعلقة للمراجعة</h2>
              <p className="text-xs text-[#7A7A7A]">
                مراجعة التغريدات والتأكد من توافقها مع سياسات المجتمع ومكافحة التضليل
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-[#D4AF37] bg-[#0F3D2E] px-3 py-1 rounded-full">
              {pendingPosts.length} بانتظار الموافقة
            </span>
          </div>

          {pendingPosts.length === 0 ? (
            <div className="bg-white rounded-[16px] p-8 text-center border border-[#EFE9D9] text-xs text-[#7A7A7A]">
              لا توجد منشورات معلقة حالياً، جميع المنشورات معتمدة بنجاح ✨
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pendingPosts.map((post) => (
                <div
                  key={post.id}
                  className="bg-white rounded-[16px] p-4 border border-[#EFE9D9] shadow-aygram space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <img
                          src={post.userAvatar}
                          alt={post.username}
                          className="w-8 h-8 rounded-full object-cover border border-[#D4AF37]"
                        />
                        <span className="text-xs font-bold text-[#0F3D2E]">@{post.username}</span>
                      </div>
                      <span className="text-[10px] text-[#7A7A7A]">
                        {new Date(post.createdAt).toLocaleDateString('ar-SA')}
                      </span>
                    </div>

                    <p className="text-xs text-[#1A1A1A] leading-relaxed bg-[#FCF9F0] p-3 rounded-[10px]">
                      {post.content}
                    </p>

                    {post.image && (
                      <img
                        src={post.image}
                        alt="Post media"
                        className="w-full h-36 object-cover rounded-[10px]"
                      />
                    )}
                  </div>

                  <div className="flex items-center gap-2 pt-3 border-t border-[#FCF9F0]">
                    <button
                      onClick={() => approvePost(post.id)}
                      className="flex-1 py-1.5 px-3 rounded-[8px] bg-[#0F3D2E] text-[#D4AF37] font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-[#16503c] transition-colors cursor-pointer"
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>اعتماد للنشر</span>
                    </button>
                    <button
                      onClick={() => setRejectingTarget({ type: 'post', id: post.id })}
                      className="py-1.5 px-3 rounded-[8px] bg-[#E8B4B8]/40 text-[#0F3D2E] font-bold text-xs flex items-center justify-center gap-1 hover:bg-[#E8B4B8]/70 transition-colors cursor-pointer"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>رفض مع سبب</span>
                    </button>
                    <button
                      onClick={() => deletePost(post.id)}
                      className="p-1.5 rounded-[8px] text-red-500 hover:bg-red-50 cursor-pointer"
                      title="حذف نهائي"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 3. PENDING PRODUCTS */}
      {activeAdminTab === 'products' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-white p-4 rounded-[16px] border border-[#EFE9D9]">
            <div>
              <h2 className="text-sm font-bold text-[#0F3D2E]">السلع المعلقة لسوق المبدعين</h2>
              <p className="text-xs text-[#7A7A7A]">
                التأكد من جودة المنتجات ومطابقتها للمواصفات والأمانة التجارية
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-[#D4AF37] bg-[#0F3D2E] px-3 py-1 rounded-full">
              {pendingProducts.length} سلع معلقة
            </span>
          </div>

          {pendingProducts.length === 0 ? (
            <div className="bg-white rounded-[16px] p-8 text-center border border-[#EFE9D9] text-xs text-[#7A7A7A]">
              لا توجد منتجات جديدة بانتظار الفحص، جميع المعروضات مرخصة ومطروحة 🛍️
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pendingProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-[16px] p-4 border border-[#EFE9D9] shadow-aygram space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#0F3D2E]">البائع: @{product.sellerName}</span>
                      <span className="text-xs font-bold text-[#D4AF37] font-mono">
                        {product.price} {product.currency}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-[#1A1A1A]">{product.title}</h3>
                    <p className="text-xs text-[#7A7A7A] line-clamp-2">{product.description}</p>

                    {product.images[0] && (
                      <img
                        src={product.images[0]}
                        alt={product.title}
                        className="w-full h-36 object-cover rounded-[10px]"
                      />
                    )}
                  </div>

                  <div className="flex items-center gap-2 pt-3 border-t border-[#FCF9F0]">
                    <button
                      onClick={() => approveProduct(product.id)}
                      className="flex-1 py-1.5 px-3 rounded-[8px] bg-[#0F3D2E] text-[#D4AF37] font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-[#16503c] transition-colors cursor-pointer"
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>اعتماد وطرح في المتجر</span>
                    </button>
                    <button
                      onClick={() => setRejectingTarget({ type: 'product', id: product.id })}
                      className="py-1.5 px-3 rounded-[8px] bg-[#E8B4B8]/40 text-[#0F3D2E] font-bold text-xs flex items-center justify-center gap-1 hover:bg-[#E8B4B8]/70 transition-colors cursor-pointer"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>رفض مع إشعار</span>
                    </button>
                    <button
                      onClick={() => deleteProduct(product.id)}
                      className="p-1.5 rounded-[8px] text-red-500 hover:bg-red-50 cursor-pointer"
                      title="حذف نهائي"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 4. USER MANAGEMENT & BANNING */}
      {activeAdminTab === 'users' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-[16px] border border-[#EFE9D9]">
            <div>
              <h2 className="text-sm font-bold text-[#0F3D2E]">إدارة وحظر وتوثيق المستخدمين</h2>
              <p className="text-xs text-[#7A7A7A]">
                نظام حظر الحسابات المخالفة وتوثيق الأعضاء المعتمدين وتتبع الجنسيات والعملات
              </p>
            </div>

            <div className="relative w-full sm:w-64">
              <input
                type="text"
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                placeholder="بحث باسم المستخدم أو الجنسية..."
                className="w-full py-1.5 px-3 pe-8 rounded-[10px] bg-[#FCF9F0] border border-[#EFE9D9] text-xs focus:outline-none focus:border-[#0F3D2E]"
              />
              <Search className="w-3.5 h-3.5 text-[#7A7A7A] absolute end-2.5 top-2.5" />
            </div>
          </div>

          <div className="bg-white rounded-[16px] border border-[#EFE9D9] overflow-hidden shadow-aygram">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-start">
                <thead className="bg-[#FCF9F0] text-[#0F3D2E] font-bold border-b border-[#EFE9D9]">
                  <tr>
                    <th className="p-3 text-start">المستخدم والاسم الكامل</th>
                    <th className="p-3 text-start">الجنسية واللغة والعملة</th>
                    <th className="p-3 text-start">التوثيق</th>
                    <th className="p-3 text-start">الحالة</th>
                    <th className="p-3 text-center">الإجراءات الرقابية</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EFE9D9]">
                  {filteredUsers.map((u) => (
                    <React.Fragment key={u.id}>
                    <tr className="hover:bg-[#FCF9F0]/50 transition-colors">
                      <td className="p-3 flex items-center gap-2.5">
                        <img
                          src={u.profileImage}
                          alt={u.username}
                          className="w-9 h-9 rounded-full object-cover border border-[#D4AF37]"
                        />
                        <div>
                          <div className="font-bold text-[#0F3D2E] flex items-center gap-1">
                        <span>{u.fullName || u.username}</span>
                        {u.role === 'owner' && (
                          <span className="text-[10px] text-[#0F3D2E] bg-[#D4AF37]/20 border border-[#D4AF37]/50 px-1.5 py-0.2 rounded-full font-bold" title="حساب المالك لا يمكن حذفه أو حظره">
                            👑 المالك
                          </span>
                        )}
                        {u.verified && (
                          <span className="text-[10px] text-[#0F3D2E] bg-[#0F3D2E]/10 px-1.5 py-0.2 rounded-full font-bold">
                            ✓ موثّق
                          </span>
                        )}
                      </div>
                          <div className="text-[11px] text-[#7A7A7A]">@{u.username}</div>
                        </div>
                      </td>

                      <td className="p-3">
                        <div className="font-bold text-[#1A1A1A]">{u.nationality || 'غير محدد'}</div>
                        <div className="text-[10px] text-[#7A7A7A]">
                          اللغة: {u.language || 'العربية'} • العملة: {u.currency || 'SAR'}
                        </div>
                      </td>

                      <td className="p-3">
                        <button
                          onClick={() => toggleUserVerification(u.id)}
                          disabled={u.id === OWNER_ACCOUNT_ID}
                          className={`px-2.5 py-1 rounded-[8px] font-bold text-[10px] transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed ${
                            u.verified
                              ? 'bg-[#0F3D2E] text-white hover:bg-[#155A44]'
                              : 'bg-white border border-[#EFE9D9] text-[#7A7A7A] hover:border-[#0F3D2E]'
                          }`}
                        >
                          {u.id === OWNER_ACCOUNT_ID
                            ? 'الشارة الذهبية الدائمة 👑'
                            : u.verified
                              ? 'شارة موثقة ✓'
                              : '+ منح التوثيق'}
                        </button>
                      </td>

                      <td className="p-3">
                        {u.isClosed ? (
                          <span className="px-2 py-0.5 rounded-full bg-[#333] text-white font-bold text-[10px] border border-[#801824]" title={u.closureReason}>
                            مغلق 🔒
                          </span>
                        ) : u.isActive ? (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold text-[10px] border border-emerald-200">
                            حساب نشط
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 font-bold text-[10px] border border-rose-200" title={u.banReason}>
                            محظور 🚫
                          </span>
                        )}
                      </td>

                      <td className="p-3 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => toggleUserBan(u.id)}
                            disabled={u.id === OWNER_ACCOUNT_ID}
                            className={`px-3 py-1 rounded-[8px] font-bold text-[11px] transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed ${
                              u.id === OWNER_ACCOUNT_ID
                                ? 'bg-gray-100 text-[#7A7A7A]'
                                : u.isActive
                                  ? 'bg-[#E8B4B8]/40 text-[#801824] hover:bg-[#E8B4B8]/80'
                                  : 'bg-emerald-600 text-white hover:bg-emerald-700'
                            }`}
                          >
                            {u.id === OWNER_ACCOUNT_ID ? 'محمي من الحظر' : u.isActive ? 'حظر الحساب' : 'فك الحظر'}
                          </button>

                          {/* Devices fingerprints */}
                          <button
                            onClick={() => setExpandedDevices(expandedDevices === u.id ? null : u.id)}
                            className="p-1.5 rounded-[8px] bg-white border border-[#EFE9D9] text-[#7A7A7A] hover:text-[#0F3D2E] hover:border-[#0F3D2E] transition-colors cursor-pointer"
                            title={`بصمات الأجهزة: ${(u.deviceFingerprints || []).length}`}
                          >
                            <Smartphone className="w-3.5 h-3.5" />
                            <span className="sr-only">الأجهزة</span>
                          </button>

                          {/* Close account */}
                          <button
                            onClick={() => {
                              setClosureTarget(u);
                              setClosureReason(CLOSURE_REASONS[0]);
                            }}
                            disabled={u.id === OWNER_ACCOUNT_ID}
                            className="p-1.5 rounded-[8px] bg-[#801824]/10 text-[#801824] hover:bg-[#801824]/25 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                            title={u.id === OWNER_ACCOUNT_ID ? 'لا يمكن إغلاق حساب المالك أبداً' : u.isClosed ? 'الحساب مغلق بالفعل' : 'إغلاق الحساب نهائياً (aygram.user)'}
                          >
                            <UserX className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => {
                              if (confirm(`هل أنت متأكد من رغبتك في حذف حساب @${u.username} نهائياً؟`)) {
                                deleteUser(u.id);
                              }
                            }}
                            disabled={u.id === OWNER_ACCOUNT_ID}
                            className="p-1 text-red-500 hover:bg-red-50 rounded-[6px] cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                            title={u.id === OWNER_ACCOUNT_ID ? 'لا يمكن حذف حساب المالك أبداً' : 'حذف الحساب نهائياً'}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                    {expandedDevices === u.id && (
                      <tr key={`${u.id}-devices`} className="bg-[#FCF9F0]">
                        <td colSpan={5} className="p-3">
                          <div className="rounded-[10px] bg-white border border-[#EFE9D9] p-3 flex flex-wrap gap-2">
                            <span className="text-[11px] font-bold text-[#0F3D2E] w-full flex items-center gap-1">
                              <Smartphone className="w-3.5 h-3.5" />
                              بصمات الأجهزة المعروفة ({u.isClosed ? 'مغلقة' : (u.deviceFingerprints || []).length}):
                            </span>
                            {(u.deviceFingerprints && u.deviceFingerprints.length > 0) ? (
                              u.deviceFingerprints.map((fp, i) => (
                                <span key={i} dir="ltr" className="text-[10px] font-mono bg-[#EAE4D3]/50 border border-[#EFE9D9] px-2 py-1 rounded-[8px] text-[#7A7A7A]" title={fp}>
                                  {formatFingerprint(fp)}
                                </span>
                              ))
                            ) : (
                              <span className="text-[11px] text-[#7A7A7A]">لم يُسجل أي بصمة جهاز.</span>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Account Closure Modal */}
          {closureTarget && (
            <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-[#FCF9F0] rounded-[16px] max-w-md w-full p-6 shadow-aygram-md border border-[#EFE9D9] relative text-[#1A1A1A]">
                <button
                  onClick={() => setClosureTarget(null)}
                  className="absolute top-4 start-4 p-1.5 rounded-[8px] text-[#7A7A7A] hover:text-[#0F3D2E] hover:bg-black/5 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="text-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-[#801824]/15 text-[#801824] flex items-center justify-center mx-auto mb-2 border border-[#801824]/40">
                    <UserX className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-[#0F3D2E]">إغلاق حساب نهائياً</h3>
                  <p className="text-xs text-[#7A7A7A] mt-1">
                    سيظهر الحساب بشكل مخفي {''}<span dir="ltr">@aygram.user</span> وسيُحذف نهائياً بعد 30 يوماً
                  </p>
                </div>

                <div className="p-3 bg-white rounded-[12px] border border-[#EFE9D9] flex items-center gap-3 mb-4">
                  <img src={closureTarget.profileImage} alt={closureTarget.username} className="w-10 h-10 rounded-full object-cover border border-[#D4AF37]" />
                  <div>
                    <div className="text-xs font-bold text-[#0F3D2E]">{closureTarget.fullName}</div>
                    <div className="text-[11px] text-[#7A7A7A]">@{closureTarget.username}</div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1A1A1A] mb-1.5">سبب الإغلاق (سيظهر للمستخدم):</label>
                  <select
                    value={closureReason}
                    onChange={(e) => setClosureReason(e.target.value)}
                    className="w-full py-2 px-3 rounded-[10px] bg-white border border-[#EFE9D9] text-xs focus:outline-none focus:border-[#0F3D2E]"
                  >
                    {CLOSURE_REASONS.map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>

                <div className="flex gap-2 pt-4">
                  <button
                    onClick={() => {
                      closeAccount(closureTarget.id, closureReason);
                      setClosureTarget(null);
                    }}
                    disabled={closureTarget.id === OWNER_ACCOUNT_ID}
                    className="flex-1 py-2.5 px-4 rounded-[12px] bg-[#801824] text-white font-bold text-xs hover:bg-[#a81f2e] transition-colors shadow cursor-pointer disabled:opacity-50"
                  >
                    تأكيد الإغلاق النهائي
                  </button>
                  <button
                    onClick={() => setClosureTarget(null)}
                    className="py-2.5 px-4 rounded-[12px] bg-white border border-[#EFE9D9] text-[#7A7A7A] font-medium text-xs hover:bg-black/5 transition-colors cursor-pointer"
                  >
                    إلغاء
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 5. ACCOUNT VERIFICATION REQUESTS */}
      {activeAdminTab === 'verifications' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-white p-4 rounded-[16px] border border-[#EFE9D9]">
            <div>
              <h2 className="text-sm font-bold text-[#0F3D2E]">نظام توثيق الحسابات الرسمي</h2>
              <p className="text-xs text-[#7A7A7A]">
                مراجعة طلبات التوثيق الواردة من العلماء والخطاطين والمتاجر المرخصة
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-[#0F3D2E] bg-[#D4AF37]/20 px-3 py-1 rounded-full">
              {pendingVerifications.length} طلبات جديدة
            </span>
          </div>

          {verificationRequests.length === 0 ? (
            <div className="bg-white rounded-[16px] p-8 text-center border border-[#EFE9D9] text-xs text-[#7A7A7A]">
              لا توجد طلبات توثيق مسجلة حالياً.
            </div>
          ) : (
            <div className="space-y-3">
              {verificationRequests.map((req) => (
                <div
                  key={req.id}
                  className={`bg-white rounded-[16px] p-4 sm:p-5 border shadow-aygram space-y-3 ${
                    req.status === 'pending' ? 'border-[#D4AF37]' : 'border-[#EFE9D9] opacity-80'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-[#0F3D2E] flex items-center gap-1.5">
                        <Award className="w-4 h-4 text-[#D4AF37]" />
                        <span>{req.fullName} (@{req.username})</span>
                        <span className="text-[10px] text-[#7A7A7A] px-2 py-0.5 rounded-full bg-[#FCF9F0] border border-[#EFE9D9]">
                          {req.category}
                        </span>
                      </div>
                      <div className="text-[10px] text-[#7A7A7A] mt-0.5">
                        تاريخ التقديم: {new Date(req.createdAt).toLocaleDateString('ar-SA')}
                      </div>
                    </div>

                    <span
                      className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                        req.status === 'pending'
                          ? 'bg-amber-100 text-amber-800'
                          : req.status === 'approved'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {req.status === 'pending'
                        ? 'قيد الدراسة'
                        : req.status === 'approved'
                        ? 'تم التوثيق ✓'
                        : 'تم الرفض'}
                    </span>
                  </div>

                  <div className="p-3 bg-[#FCF9F0] rounded-[10px] border border-[#EFE9D9] text-xs text-[#1A1A1A] leading-relaxed">
                    <strong className="block text-[#0F3D2E] mb-1">سبب الطلب وإثبات النشاط:</strong>
                    {req.reason}
                  </div>

                  {req.status === 'pending' && (
                    <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#FCF9F0]">
                      <button
                        onClick={() => reviewVerificationRequest(req.id, 'approved')}
                        className="py-1.5 px-4 rounded-[8px] bg-[#0F3D2E] text-[#D4AF37] font-bold text-xs hover:bg-[#16503c] transition-colors cursor-pointer flex items-center gap-1"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>الموافقة وتوثيق الحساب</span>
                      </button>
                      <button
                        onClick={() => reviewVerificationRequest(req.id, 'rejected')}
                        className="py-1.5 px-3 rounded-[8px] bg-gray-100 text-[#7A7A7A] text-xs hover:bg-gray-200 transition-colors cursor-pointer"
                      >
                        رفض الطلب
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 6. ADMIN BROADCASTS & NOTIFICATIONS */}
      {activeAdminTab === 'broadcasts' && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-[16px] border border-[#EFE9D9] shadow-aygram space-y-4">
            <div>
              <h2 className="text-sm font-bold text-[#0F3D2E] flex items-center gap-2">
                <BellRing className="w-4 h-4 text-[#D4AF37]" />
                نظام إشعارات وتعاميم الإدارة للمستخدمين
              </h2>
              <p className="text-xs text-[#7A7A7A] mt-1">
                إرسال إشعار رسمي فوري لجميع المستخدمين أو لمستخدم محدد بشارة الإدارة 🛡️
              </p>
            </div>

            {broadcastSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-[12px] text-xs font-bold text-emerald-700 flex items-center gap-2">
                <Check className="w-4 h-4" />
                <span>{broadcastSuccess}</span>
              </div>
            )}

            <form onSubmit={handleSendBroadcast} className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#1A1A1A] mb-1">
                    عنوان التعميم الإداري <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={broadcastTitle}
                    onChange={(e) => setBroadcastTitle(e.target.value)}
                    placeholder="مثال: تنبيه هام بخصوص آداب المعاملات أو تحديث المنصة"
                    className="w-full py-2 px-3 rounded-[10px] bg-[#FCF9F0] border border-[#EFE9D9] text-xs focus:outline-none focus:border-[#0F3D2E]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1A1A1A] mb-1">
                    المستهدفون بالإشعار
                  </label>
                  <select
                    value={broadcastTarget}
                    onChange={(e) => setBroadcastTarget(e.target.value)}
                    className="w-full py-2 px-3 rounded-[10px] bg-[#FCF9F0] border border-[#EFE9D9] text-xs focus:outline-none focus:border-[#0F3D2E]"
                  >
                    <option value="all">الجميع (جميع مستخدمي المنصة)</option>
                    {users.map((u) => (
                      <option key={u.id} value={u.id}>
                        مخصص: @{u.username} ({u.fullName || u.username})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1A1A1A] mb-1">
                  درجة أهمية الإشعار
                </label>
                <div className="flex gap-3">
                  <label className="flex items-center gap-1.5 text-xs cursor-pointer">
                    <input
                      type="radio"
                      name="importance"
                      checked={broadcastImportance === 'normal'}
                      onChange={() => setBroadcastImportance('normal')}
                      className="accent-[#0F3D2E]"
                    />
                    <span>إشعار عام عادي</span>
                  </label>
                  <label className="flex items-center gap-1.5 text-xs cursor-pointer">
                    <input
                      type="radio"
                      name="importance"
                      checked={broadcastImportance === 'urgent'}
                      onChange={() => setBroadcastImportance('urgent')}
                      className="accent-[#0F3D2E]"
                    />
                    <span className="text-red-700 font-bold">عاجل وهام</span>
                  </label>
                  <label className="flex items-center gap-1.5 text-xs cursor-pointer">
                    <input
                      type="radio"
                      name="importance"
                      checked={broadcastImportance === 'guidance'}
                      onChange={() => setBroadcastImportance('guidance')}
                      className="accent-[#0F3D2E]"
                    />
                    <span className="text-[#0F3D2E] font-bold">توجيه إداري وتوعوي</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1A1A1A] mb-1">
                  نص البيان / التعميم <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={3}
                  value={broadcastText}
                  onChange={(e) => setBroadcastText(e.target.value)}
                  placeholder="اكتب التوجيه أو التنبيه الإداري هنا..."
                  className="w-full py-2 px-3 rounded-[10px] bg-[#FCF9F0] border border-[#EFE9D9] text-xs focus:outline-none focus:border-[#0F3D2E]"
                  required
                />
              </div>

              <button
                type="submit"
                className="py-2.5 px-6 rounded-[10px] bg-[#0F3D2E] text-[#D4AF37] font-bold text-xs hover:bg-[#155A44] transition-colors cursor-pointer flex items-center gap-2"
              >
                <Send className="w-3.5 h-3.5 rotate-180" />
                <span>إرسال التعميم الآن لجميع الأجهزة</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 7. SITE MAINTENANCE MODE SYSTEM */}
      {activeAdminTab === 'maintenance' && (
        <div className="space-y-4">
          <div className="bg-white p-5 sm:p-6 rounded-[16px] border border-[#EFE9D9] shadow-aygram space-y-4">
            <div>
              <h2 className="text-sm font-bold text-[#0F3D2E] flex items-center gap-2">
                <Wrench className="w-4 h-4 text-[#D4AF37]" />
                نظام صيانة وتحديث الموقع (Maintenance Mode)
              </h2>
              <p className="text-xs text-[#7A7A7A] mt-1">
                عند تفعيل وضع الصيانة، سيتم توجيه جميع الزوار إلى شاشة صيانة أنيقة، بينما يظل بإمكان المشرفين الدخول.
              </p>
            </div>

            {maintSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-[12px] text-xs font-bold text-emerald-700 flex items-center gap-2">
                <Check className="w-4 h-4" />
                <span>{maintSuccess}</span>
              </div>
            )}

            <form onSubmit={handleSaveMaintenance} className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-[14px] bg-[#FCF9F0] border border-[#EFE9D9]">
                <div>
                  <div className="text-xs font-bold text-[#0F3D2E]">حالة وضع الصيانة</div>
                  <div className="text-[11px] text-[#7A7A7A]">
                    {maintEnabled ? 'الموقع حالياً مغلق للصيانة أمام الزوار' : 'الموقع متاح ويعمل لجميع الزوار'}
                  </div>
                </div>

                <BaubleToggle
                  checked={maintEnabled}
                  onChange={setMaintEnabled}
                  ariaLabel="حالة وضع الصيانة"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1A1A1A] mb-1">
                  رسالة الصيانة المعروضة للجمهور
                </label>
                <textarea
                  rows={3}
                  value={maintMessage}
                  onChange={(e) => setMaintMessage(e.target.value)}
                  placeholder="مثال: نقوم حالياً بأعمال صيانة وتحديثات مجدولة لتحسين تجربتكم المباركة في منصة AyGram..."
                  className="w-full py-2 px-3 rounded-[10px] bg-[#FCF9F0] border border-[#EFE9D9] text-xs focus:outline-none focus:border-[#0F3D2E]"
                />
              </div>

              <button
                type="submit"
                className="py-2.5 px-6 rounded-[10px] bg-[#0F3D2E] text-[#D4AF37] font-bold text-xs hover:bg-[#155A44] transition-colors cursor-pointer"
              >
                حفظ وتطبيق إعدادات الصيانة
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 8. REPORTS MODERATION */}
      {activeAdminTab === 'reports' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-white p-4 rounded-[16px] border border-[#EFE9D9]">
            <div>
              <h2 className="text-sm font-bold text-[#0F3D2E]">سجل بلاغات المستخدمين</h2>
              <p className="text-xs text-[#7A7A7A]">
                مراجعة البلاغات الواردة من أعضاء المجتمع والتحقق من صحتها
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-red-600 bg-red-50 px-3 py-1 rounded-full border border-red-200">
              {pendingReports.length} بلاغات معلقة
            </span>
          </div>

          {reports.length === 0 ? (
            <div className="bg-white rounded-[16px] p-8 text-center border border-[#EFE9D9] text-xs text-[#7A7A7A]">
              لا توجد أي بلاغات مسجلة حتى الآن.
            </div>
          ) : (
            <div className="space-y-3">
              {reports.map((rep) => (
                <div
                  key={rep.id}
                  className={`bg-white rounded-[16px] p-4 sm:p-5 border transition-all shadow-aygram space-y-3 ${
                    rep.status === 'pending' ? 'border-red-300' : 'border-[#EFE9D9] opacity-75'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[#0F3D2E]">المُبلِغ: {rep.reporterName}</span>
                      <span>•</span>
                      <span className="text-[#7A7A7A]">النوع: {rep.targetType}</span>
                    </div>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        rep.status === 'pending'
                          ? 'bg-red-100 text-red-700'
                          : rep.status === 'resolved'
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {rep.status === 'pending'
                        ? 'قيد النظر'
                        : rep.status === 'resolved'
                        ? 'تم اتخاذ إجراء'
                        : 'تم التجاهل'}
                    </span>
                  </div>

                  <div className="p-3 bg-[#FCF9F0] rounded-[10px] border border-[#EFE9D9] text-xs space-y-1">
                    <div className="font-bold text-[#1A1A1A]">سبب البلاغ: {rep.reason}</div>
                    {rep.targetSnippet && (
                      <div className="text-[#7A7A7A] italic">المحتوى: "{rep.targetSnippet}"</div>
                    )}
                  </div>

                  {rep.status === 'pending' && (
                    <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#FCF9F0]">
                      <button
                        onClick={() => {
                          if (rep.targetType === 'post') {
                            deletePost(rep.targetId);
                          } else if (rep.targetType === 'product') {
                            deleteProduct(rep.targetId);
                          }
                          resolveReport(rep.id, 'تم حذف المحتوى المخالف فوراً بناءً على البلاغ.');
                        }}
                        className="py-1.5 px-3 rounded-[8px] bg-red-600 text-white font-bold text-xs hover:bg-red-700 transition-colors cursor-pointer"
                      >
                        حذف المحتوى المخالف فوراً
                      </button>

                      <button
                        onClick={() => dismissReport(rep.id)}
                        className="py-1.5 px-3 rounded-[8px] bg-gray-100 text-[#7A7A7A] font-bold text-xs hover:bg-gray-200 transition-colors cursor-pointer"
                      >
                        تجاهل البلاغ
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 9. BLACKLISTED WORDS */}
      {activeAdminTab === 'blacklist' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-[16px] border border-[#EFE9D9] space-y-4">
            <div>
              <h2 className="text-sm font-bold text-[#0F3D2E]">إدارة قائمة الفلترة الآلية للمحتوى الممنوع</h2>
              <p className="text-xs text-[#7A7A7A]">
                يتم فحص التغريدات والتعليقات والمنتجات والرسائل آلياً ضد هذه الكلمات لمنع نشر أي إساءة أو احتيال
              </p>
            </div>

            {blacklistMsg && (
              <div className="p-2.5 rounded-[10px] bg-[#FCF9F0] border border-[#D4AF37] text-xs text-[#0F3D2E] font-bold">
                {blacklistMsg}
              </div>
            )}

            <form onSubmit={handleAddWordSubmit} className="flex gap-2">
              <input
                type="text"
                value={newWord}
                onChange={(e) => setNewWord(e.target.value)}
                placeholder="أضف كلمة أو عبارة محظورة في المنصة..."
                className="flex-1 py-2 px-3 rounded-[10px] bg-[#FCF9F0] border border-[#EFE9D9] text-xs focus:outline-none focus:border-[#0F3D2E]"
              />
              <button
                type="submit"
                className="py-2 px-4 rounded-[10px] bg-[#0F3D2E] text-[#D4AF37] font-bold text-xs flex items-center gap-1.5 hover:bg-[#16503c] transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>إضافة للقائمة</span>
              </button>
            </form>
          </div>

          <div className="bg-white p-4 rounded-[16px] border border-[#EFE9D9]">
            <h3 className="text-xs font-bold text-[#7A7A7A] mb-3">
              الكلمات المحظورة حالياً ({blockedWords.length}):
            </h3>
            <div className="flex flex-wrap gap-2">
              {blockedWords.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FCF9F0] border border-[#EFE9D9] text-xs text-[#0F3D2E] font-bold"
                >
                  <span>{item.word}</span>
                  <button
                    onClick={() => removeBlockedWord(item.id)}
                    className="text-[#7A7A7A] hover:text-red-500 cursor-pointer"
                    title="إزالة الكلمة"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 10. SYSTEM LOGS */}
      {activeAdminTab === 'logs' && (
        <div className="bg-white p-4 rounded-[16px] border border-[#EFE9D9] shadow-aygram space-y-4">
          <div>
            <h2 className="text-sm font-bold text-[#0F3D2E]">سجل العمليات الإدارية والرقابية</h2>
            <p className="text-xs text-[#7A7A7A]">
              سجل تفصيلي لجميع قرارات الإشراف والحظر والتوثيق والاعتمادات
            </p>
          </div>

          <div className="divide-y divide-[#EFE9D9]">
            {adminLogs.map((log) => (
              <div key={log.id} className="py-3 flex items-start justify-between gap-4 text-xs">
                <div className="space-y-0.5">
                  <div className="font-bold text-[#0F3D2E]">{log.action}</div>
                  <div className="text-[#555555]">{log.details}</div>
                  <div className="text-[10px] text-[#7A7A7A]">المشرف: {log.adminName}</div>
                </div>
                <div className="text-[10px] text-[#7A7A7A] whitespace-nowrap">
                  {new Date(log.timestamp).toLocaleString('ar-SA')}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 11. POLICIES & SETTINGS */}
      {activeAdminTab === 'settings' && (
        <div className="bg-white p-5 rounded-[16px] border border-[#EFE9D9] shadow-aygram space-y-5">
          <div>
            <h2 className="text-sm font-bold text-[#0F3D2E]">إعدادات وسياسات النشر التلقائي</h2>
            <p className="text-xs text-[#7A7A7A]">
              التحكم في اعتماد المنشورات والمنتجات تلقائياً أو اشتراط الفحص المسبق
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-[12px] bg-[#FCF9F0] border border-[#EFE9D9]">
              <div>
                <div className="text-xs font-bold text-[#0F3D2E]">نشر المنشورات تلقائياً</div>
                <div className="text-[10px] text-[#7A7A7A]">
                  عند التفعيل، تُنشر المنشورات فوراً ما لم تحتوي على كلمات ممنوعة
                </div>
              </div>
              <BaubleToggle
                checked={settings.autoApprovePosts}
                onChange={(v) => updateSettings({ autoApprovePosts: v })}
                ariaLabel="تفعيل نشر المنشورات تلقائياً"
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-[12px] bg-[#FCF9F0] border border-[#EFE9D9]">
              <div>
                <div className="text-xs font-bold text-[#0F3D2E]">طرح المنتجات في المتجر تلقائياً</div>
                <div className="text-[10px] text-[#7A7A7A]">
                  عند التعطيل، يتطلب كل منتج جديد مراجعة المشرف أولاً
                </div>
              </div>
              <BaubleToggle
                checked={settings.autoApproveProducts}
                onChange={(v) => updateSettings({ autoApproveProducts: v })}
                ariaLabel="تفعيل طرح المنتجات تلقائياً"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#0F3D2E] mb-1">
                رسالة الترحيب والضوابط العامة للمنصة
              </label>
              <textarea
                rows={2}
                value={settings.siteNotice}
                onChange={(e) => updateSettings({ siteNotice: e.target.value })}
                className="w-full py-2 px-3 rounded-[10px] bg-[#FCF9F0] border border-[#EFE9D9] text-xs focus:outline-none focus:border-[#0F3D2E]"
              />
            </div>
          </div>
        </div>
      )}

      {/* 12. USERNAME RESERVATIONS */}
      {activeAdminTab === 'usernameReservations' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-[16px] border border-[#EFE9D9]">
            <h2 className="text-sm font-bold text-[#0F3D2E] flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-[#D4AF37]" />
              حجوزات أسماء المستخدمين (1-4 أحرف)
            </h2>
            <p className="text-xs text-[#7A7A7A] mt-1">
              مراجعة حجوزات أسماء المستخدمين القصيرة ومنحها للموافقة أو الرفض
            </p>
          </div>

          {usernameReservations.length === 0 ? (
            <div className="bg-white rounded-[16px] p-8 text-center border border-[#EFE9D9] text-xs text-[#7A7A7A]">
              لا توجد حجوزات مسجلة حالياً.
            </div>
          ) : (
            <div className="space-y-3">
              {usernameReservations.map((res) => (
                <div
                  key={res.id}
                  className={`bg-white rounded-[16px] p-4 border shadow-aygram space-y-3 ${
                    res.status === 'pending' ? 'border-[#D4AF37]' : 'border-[#EFE9D9] opacity-75'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-[#0F3D2E]">@{res.desiredUsername}</span>
                        <span className="text-[10px] text-[#7A7A7A] px-2 py-0.5 rounded-full bg-[#FCF9F0] border border-[#EFE9D9]">
                          {res.status === 'pending' ? 'قيد الانتظار' : res.status === 'approved' ? 'تمت الموافقة ✅' : 'تم الرفض ❌'}
                        </span>
                      </div>
                      <div className="text-[10px] text-[#7A7A7A] mt-0.5">
                        اليوزر المؤقت: @{res.suggestedUsername} • تم الحجز: {new Date(res.createdAt).toLocaleDateString('ar-SA')}
                      </div>
                    </div>
                  </div>

                  {res.status === 'pending' && (
                    <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#FCF9F0]">
                      <button
                        onClick={() => approveUsernameReservation(res.id)}
                        className="py-1.5 px-4 rounded-[8px] bg-[#0F3D2E] text-[#D4AF37] font-bold text-xs hover:bg-[#16503c] transition-colors cursor-pointer"
                      >
                        قبول الحجز
                      </button>
                      <button
                        onClick={() => {
                          setUsernameReservations((prev) => prev.map((r) => r.id === res.id ? { ...r, status: 'rejected' } : r));
                        }}
                        className="py-1.5 px-3 rounded-[8px] bg-gray-100 text-[#7A7A7A] font-bold text-xs hover:bg-gray-200 transition-colors cursor-pointer"
                      >
                        رفض
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 13. SUPPORT TICKETS MANAGEMENT */}
      {activeAdminTab === 'support' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-[16px] border border-[#EFE9D9] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-aygram">
            <div>
              <h2 className="text-sm font-bold text-[#0F3D2E] flex items-center gap-2">
                <LifeBuoy className="w-4 h-4 text-[#D4AF37]" />
                إدارة تذاكر الدعم الفني والاستفسارات
              </h2>
              <p className="text-xs text-[#7A7A7A] mt-0.5">
                متابعة تذاكر المستخدمين، الرد الرسمي، وحل المشكلات الفنية والحسابات
              </p>
            </div>
            <div className="flex items-center gap-1.5 flex-wrap">
              {[
                { id: 'all', label: 'الكل' },
                { id: 'open', label: 'جديدة' },
                { id: 'in_progress', label: 'قيد المعالجة' },
                { id: 'resolved', label: 'تم الحل' },
                { id: 'closed', label: 'مغلقة' },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setAdminTicketFilter(f.id as any)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                    adminTicketFilter === f.id
                      ? 'bg-[#0F3D2E] text-[#D4AF37]'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tickets List or Details */}
          {supportTickets.length === 0 ? (
            <div className="bg-white p-12 text-center rounded-[16px] border border-[#EFE9D9] text-[#7A7A7A] space-y-2">
              <Inbox className="w-8 h-8 text-stone-300 mx-auto" />
              <p className="text-xs">لا توجد أي تذاكر دعم فني حالياً في النظام.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {supportTickets
                .filter((t) => (adminTicketFilter === 'all' ? true : t.status === adminTicketFilter))
                .map((ticket) => {
                  const isExpanded = selectedAdminTicketId === ticket.id;
                  return (
                    <div
                      key={ticket.id}
                      className="bg-white rounded-[16px] border border-[#EFE9D9] p-4 sm:p-5 shadow-sm space-y-3 transition-all"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-3">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-mono text-xs font-black text-[#0F3D2E] bg-stone-100 px-2 py-0.5 rounded-md border border-stone-200">
                            {ticket.ticketNumber}
                          </span>
                          <span className="text-xs font-bold text-stone-800">
                            {ticket.subject}
                          </span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            ticket.status === 'open' ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                            ticket.status === 'in_progress' ? 'bg-blue-100 text-blue-800 border border-blue-200' :
                            ticket.status === 'resolved' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' :
                            'bg-stone-100 text-stone-600 border border-stone-200'
                          }`}>
                            {ticket.status === 'open' ? 'تذكرة جديدة' :
                             ticket.status === 'in_progress' ? 'قيد المتابعة' :
                             ticket.status === 'resolved' ? 'تم الحل' : 'مغلقة'}
                          </span>
                        </div>
                        <div className="text-[11px] text-stone-400 flex items-center gap-2">
                          <span>{ticket.userName} {ticket.userEmailOrPhone ? `(${ticket.userEmailOrPhone})` : ''}</span>
                          <span>•</span>
                          <span>{new Date(ticket.createdAt).toLocaleDateString('ar-EG')}</span>
                        </div>
                      </div>

                      {/* Ticket Summary */}
                      <p className="text-xs text-stone-600 leading-relaxed">
                        {ticket.messages[0]?.content || 'لا يوجد محتوى في التذكرة'}
                      </p>

                      {/* Actions row */}
                      <div className="flex items-center justify-between gap-2 pt-1 flex-wrap">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <button
                            onClick={() => setSelectedAdminTicketId(isExpanded ? null : ticket.id)}
                            className="px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
                          >
                            <MessageSquare className="w-3.5 h-3.5 text-[#0F3D2E]" />
                            <span>{isExpanded ? 'إخفاء الردود' : `عرض الردود (${ticket.messages.length})`}</span>
                          </button>
                          
                          {ticket.status !== 'in_progress' && (
                            <button
                              onClick={() => updateSupportTicketStatus(ticket.id, 'in_progress')}
                              className="px-2.5 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 text-[11px] font-bold transition-colors cursor-pointer"
                            >
                              تعيين: قيد المتابعة
                            </button>
                          )}

                          {ticket.status !== 'resolved' && (
                            <button
                              onClick={() => updateSupportTicketStatus(ticket.id, 'resolved')}
                              className="px-2.5 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-[11px] font-bold transition-colors cursor-pointer"
                            >
                              تعيين: تم الحل
                            </button>
                          )}

                          {ticket.status !== 'closed' && (
                            <button
                              onClick={() => updateSupportTicketStatus(ticket.id, 'closed')}
                              className="px-2.5 py-1.5 rounded-lg bg-stone-100 text-stone-600 hover:bg-stone-200 text-[11px] font-bold transition-colors cursor-pointer"
                            >
                              إغلاق
                            </button>
                          )}
                        </div>

                        <button
                          onClick={() => {
                            if (window.confirm('هل أنت متأكد من حذف هذه التذكرة نهائياً من النظام؟')) {
                              deleteSupportTicket(ticket.id);
                            }
                          }}
                          className="p-1.5 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                          title="حذف التذكرة"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Expanded Messages and Reply input */}
                      {isExpanded && (
                        <div className="pt-3 border-t border-stone-100 space-y-3">
                          <div className="space-y-2 max-h-72 overflow-y-auto p-2 bg-stone-50 rounded-xl">
                            {ticket.messages.map((m) => (
                              <div
                                key={m.id}
                                className={`p-3 rounded-xl text-xs space-y-1 ${
                                  m.senderRole === 'admin'
                                    ? 'bg-[#0F3D2E] text-white ms-4'
                                    : 'bg-white text-stone-800 border border-stone-200 me-4'
                                }`}
                              >
                                <div className="flex items-center justify-between text-[10px] opacity-75 font-bold">
                                  <span>{m.senderName} {m.senderRole === 'admin' && '⭐ (فريق الدعم)'}</span>
                                  <span>{new Date(m.createdAt).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}</span>
                                </div>
                                <p className="leading-relaxed whitespace-pre-wrap">{m.content}</p>
                              </div>
                            ))}
                          </div>

                          {/* Reply form */}
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={adminReplyText}
                              onChange={(e) => setAdminReplyText(e.target.value)}
                              placeholder="اكتب رد الدعم الفني الرسمي على العضو..."
                              className="flex-1 py-2 px-3 rounded-xl bg-white border border-stone-200 text-xs focus:outline-none focus:border-[#0F3D2E]"
                              onKeyDown={(e) => {
                                if (e.key === 'Enter' && adminReplyText.trim()) {
                                  replyToSupportTicket(ticket.id, adminReplyText);
                                  setAdminReplyText('');
                                }
                              }}
                            />
                            <button
                              onClick={() => {
                                if (!adminReplyText.trim()) return;
                                replyToSupportTicket(ticket.id, adminReplyText);
                                setAdminReplyText('');
                              }}
                              className="px-4 py-2 bg-[#0F3D2E] text-[#D4AF37] font-bold text-xs rounded-xl hover:bg-[#155A44] transition-colors cursor-pointer flex items-center gap-1.5"
                            >
                              <Send className="w-3.5 h-3.5" />
                              <span>إرسال الرد</span>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
            </div>
          )}
        </div>
      )}

      {/* 14. PASSWORD RESETS & IDENTITY PROOF */}
      {activeAdminTab === 'passwordResets' && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-[16px] border border-[#EFE9D9] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-bold text-[#0F3D2E] flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#D4AF37]" />
                طلبات استعادة الحساب وتأكيد الهوية ({passwordResetRequests.length})
              </h2>
              <p className="text-xs text-[#7A7A7A] mt-1">
                مراجعة الأدلة وتأكيدات الملكية المقدمة من أصحاب الحسابات لاعتماد تعيين كلمة المرور الجديدة
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="px-3 py-1.5 rounded-xl bg-amber-50 text-amber-800 border border-amber-200 font-bold flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                {passwordResetRequests.filter((r) => r.status === 'pending').length} بانتظار المراجعة
              </span>
            </div>
          </div>

          {passwordResetRequests.length === 0 ? (
            <div className="bg-white rounded-[16px] p-10 text-center border border-[#EFE9D9] text-xs text-[#7A7A7A] space-y-2">
              <KeyRound className="w-8 h-8 text-stone-300 mx-auto" />
              <p className="font-bold text-stone-600">لا توجد طلبات استعادة كلمة مرور حالياً.</p>
              <p className="text-[11px] text-stone-400">أي طلب يتم إرساله من شاشة "نسيت كلمة المرور" سيظهر هنا فوراً مع أدلة إثبات الملكية.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {passwordResetRequests.map((req) => (
                <div
                  key={req.id}
                  className={`bg-white rounded-[16px] p-5 border shadow-aygram space-y-4 ${
                    req.status === 'pending'
                      ? 'border-[#D4AF37] bg-amber-50/20'
                      : req.status === 'approved'
                      ? 'border-emerald-200 bg-emerald-50/10'
                      : 'border-stone-200 opacity-75'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-stone-100">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#0F3D2E] text-[#D4AF37] flex items-center justify-center font-bold text-sm">
                        @{req.username.slice(0, 1).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-[#0F3D2E] text-sm">@{req.username}</span>
                          {req.fullName && (
                            <span className="text-xs text-stone-600 font-medium">({req.fullName})</span>
                          )}
                        </div>
                        <div className="text-[11px] text-stone-400 mt-0.5 flex items-center gap-2">
                          <span>تاريخ الطلب: {new Date(req.createdAt).toLocaleString('ar-SA')}</span>
                          {req.contactInfo && <span>• بيانات التواصل: <strong className="text-stone-700">{req.contactInfo}</strong></span>}
                        </div>
                      </div>
                    </div>

                    <div>
                      {req.status === 'pending' && (
                        <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200 flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" /> بانتظار المراجعة
                        </span>
                      )}
                      {req.status === 'approved' && (
                        <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" /> تمت الموافقة والاعتماد
                        </span>
                      )}
                      {req.status === 'rejected' && (
                        <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-200 flex items-center gap-1">
                          <X className="w-3.5 h-3.5" /> تم الرفض
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Proof details box */}
                  <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 space-y-1.5">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-[#0F3D2E]">
                      <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
                      <span>تفاصيل إثبات وتأكيد هوية امتلاك الحساب:</span>
                    </div>
                    <p className="text-xs text-stone-800 leading-relaxed whitespace-pre-wrap font-sans">
                      {req.proofDetails}
                    </p>
                  </div>

                  {/* New password requested */}
                  {req.newPassword && (
                    <div className="flex items-center gap-2 text-xs">
                      <span className="font-bold text-stone-600">كلمة المرور المطلوب اعتمادها:</span>
                      <span className="font-mono bg-stone-100 px-2.5 py-1 rounded-md border border-stone-200 text-stone-900 font-bold">
                        {req.newPassword}
                      </span>
                    </div>
                  )}

                  {req.rejectionReason && (
                    <div className="text-xs text-rose-700 bg-rose-50 p-2.5 rounded-lg border border-rose-200">
                      <strong>سبب الرفض:</strong> {req.rejectionReason}
                    </div>
                  )}

                  {/* Actions for pending requests */}
                  {req.status === 'pending' && (
                    <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-100">
                      <button
                        onClick={() => {
                          setRejectionReason('لم يتم تأكيد هوية الملكية بشكل كافٍ');
                          setRejectingTarget({ type: 'password_reset', id: req.id });
                        }}
                        className="py-2 px-4 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs transition-colors cursor-pointer"
                      >
                        رفض الطلب
                      </button>

                      <button
                        onClick={() => {
                          approvePasswordReset(req.id);
                        }}
                        className="py-2 px-5 rounded-xl bg-[#0F3D2E] hover:bg-[#155A44] text-[#D4AF37] font-bold text-xs transition-colors shadow-aygram cursor-pointer flex items-center gap-1.5"
                      >
                        <Check className="w-4 h-4" />
                        اعتماد وتعيين كلمة المرور
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Rejection Modal with reason */}
      {rejectingTarget && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FCF9F0] rounded-[16px] max-w-sm w-full p-5 border border-[#EFE9D9] shadow-aygram-md space-y-4">
            <h3 className="text-sm font-bold text-[#0F3D2E]">
              سبب رفض {rejectingTarget.type === 'post' ? 'المنشور' : rejectingTarget.type === 'product' ? 'المنتج' : 'طلب استعادة كلمة المرور'}
            </h3>
            <p className="text-xs text-[#7A7A7A]">
              {rejectingTarget.type === 'password_reset'
                ? 'يرجى كتابة سبب رفض الطلب للعضو.'
                : 'سيتم إشعار العضو بسبب الرفض لتمكينه من تعديل المحتوى وفق الضوابط.'}
            </p>

            <textarea
              rows={3}
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="w-full py-2 px-3 rounded-[10px] bg-white border border-[#EFE9D9] text-xs focus:outline-none focus:border-[#0F3D2E]"
            />

            <div className="flex gap-2">
              <button
                onClick={handleConfirmReject}
                className="flex-1 py-2 px-3 rounded-[10px] bg-[#0F3D2E] text-[#D4AF37] font-bold text-xs cursor-pointer"
              >
                تأكيد الرفض
              </button>
              <button
                onClick={() => setRejectingTarget(null)}
                className="py-2 px-3 rounded-[10px] bg-white border border-[#EFE9D9] text-[#7A7A7A] text-xs cursor-pointer"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
