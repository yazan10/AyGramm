import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { ToastMessage, ToastType } from '../components/ToastBanner';
import {
  User,
  Post,
  Story,
  Product,
  Report,
  BlockedWord,
  AdminLog,
  NotificationItem,
  ActiveView,
  DirectMessage,
  ChatConversation,
  VerificationRequest,
  PlatformSettings,
  AccountType,
  VerificationBadgeType,
  BirthDatePrivacy,
  ProfileLink,
  SocialLinks,
  UsernameReservation,
  Channel,
  ChannelPost,
  PromoCode,
  ProfileHighlight,
  Order,
  OrderItem,
  Gender,
  SupportTicket,
  SupportCategory,
  SupportPriority,
  SupportStatus,
  SupportMessage
} from '../types/aygram';
import {
  INITIAL_USERS,
  INITIAL_POSTS,
  INITIAL_STORIES,
  INITIAL_PRODUCTS,
  INITIAL_BLOCKED_WORDS,
  INITIAL_REPORTS,
  INITIAL_ADMIN_LOGS,
  INITIAL_NOTIFICATIONS,
  INITIAL_CONVERSATIONS,
  INITIAL_MESSAGES,
  INITIAL_VERIFICATION_REQUESTS,
  INITIAL_USERNAME_RESERVATIONS,
  INITIAL_SUPPORT_TICKETS,
  INITIAL_CHANNELS,
  INITIAL_CHANNEL_POSTS
} from '../data/initialData';
import { getDeviceFingerprint } from '../utils/fingerprint';
import { writeRemoteCollection, readRemoteBatch, writeRemoteBatch } from '../lib/remoteStorage';

// Promo codes for the store's discount system (دائرة الخصومات والبرومو كود)
const INITIAL_PROMO_CODES: PromoCode[] = [
  { id: 'promo_aygram10', code: 'AYGRAM10', discountPercent: 10, description: 'خصم 10% على أول طلب عبر منصة AyGram', isActive: true },
  { id: 'promo_ramadan15', code: 'RAMADAN15', discountPercent: 15, description: 'خصم 15% بمناسبة شهر رمضان المبارك', isActive: true },
  { id: 'promo_craft20', code: 'CRAFT20', discountPercent: 20, description: 'خصم 20% على مشغولات الحرفيين والمبدعين', isActive: true },
  { id: 'promo_welcome5', code: 'WELCOME5', discountPercent: 5, description: 'خصم ترحيبي 5% للأعضاء الجدد', isActive: true },
];

export interface SignUpData {
  fullName: string;
  username: string;
  password: string;
  nationality: string;
  language: string;
  currency: string;
  phone?: string;
  accountType?: AccountType; // شخصي | أعمال | صانع محتوى
  birthDate?: string;
  birthDatePrivacy?: BirthDatePrivacy;
  bio?: string;
  location?: string;
  gender?: Gender;
}

interface AyGramContextType {
  currentUser: User | null;
  users: User[];
  posts: Post[];
  stories: Story[];
  products: Product[];
  blockedWords: BlockedWord[];
  reports: Report[];
  adminLogs: AdminLog[];
  notifications: NotificationItem[];
  setNotifications: React.Dispatch<React.SetStateAction<NotificationItem[]>>;
  conversations: ChatConversation[];
  messages: DirectMessage[];
  verificationRequests: VerificationRequest[];
  usernameReservations: UsernameReservation[];
  setUsernameReservations: React.Dispatch<React.SetStateAction<UsernameReservation[]>>;
  reserveUsername: (desiredUsername: string) => { success: boolean; error?: string; suggestedUsername?: string };
  approveUsernameReservation: (requestId: string) => void;
  activeConversationUserId: string | null;
  setActiveConversationUserId: (userId: string | null) => void;
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
  selectedUserProfile: User | null;
  viewUserProfile: (user: User | string) => void;
  activeStoryIndex: number | null;
  setActiveStoryIndex: React.Dispatch<React.SetStateAction<number | null>>;
  isAdminUnlocked: boolean;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  settings: PlatformSettings;
  login: (usernameOrPhone: string, pass: string) => { success: boolean; error?: string; closed?: boolean };
  signup: (data: SignUpData | string, phoneOrLegacy?: string, passLegacy?: string) => { success: boolean; error?: string; suggestedUsername?: string; pendingApproval?: boolean };
  rememberSession: boolean;
  setRememberSession: (value: boolean) => void;
  requiresAdminApproval: (nationality: string) => boolean;
  approveUserAccount: (userId: string, approve: boolean) => void;
  logout: () => void;
  resetPassword: (phone: string, newPass: string) => { success: boolean; error?: string };
  updateProfile: (bio: string, profileImage: string) => void;
  updateFullProfile: (data: Partial<User>) => void;
  toggleCloseFriend: (targetUserId: string) => void;
  toggleHideStoryFromUser: (targetUserId: string) => void;
  toggleBlockUser: (targetUserId: string) => void;
  toggleRestrictUser: (targetUserId: string) => void;
  toggleMuteUser: (targetUserId: string) => void;
  updateVerificationBadge: (badge: VerificationBadgeType, plan?: 'none' | 'blue_monthly' | 'blue_yearly' | 'gold_monthly' | 'gold_yearly') => void;
  toggleFollow: (targetUserId: string) => void;
  checkContentForBlockedWords: (text: string) => { isClean: boolean; forbiddenWord?: string };
  createPost: (data: { content: string; image?: string; images?: string[]; video?: string; tags?: string[]; location?: string; isCloseFriendsOnly?: boolean }) => { success: boolean; error?: string; isPending?: boolean };
  toggleLikePost: (postId: string) => void;
  toggleRetweet: (postId: string) => void;
  addComment: (postId: string, content: string) => { success: boolean; error?: string };
  deleteComment: (postId: string, commentId: string) => void;
  toggleSavePost: (postId: string) => void;
  savedPostIds: string[];
  createStory: (data: { media: string; type: 'image' | 'video'; caption?: string; isCloseFriendsOnly?: boolean }) => { success: boolean; error?: string };
  createProduct: (data: { title: string; description: string; price: number; category: string; images: string[]; stock?: number }) => { success: boolean; error?: string; isPending?: boolean };
  submitReport: (data: { targetId: string; targetType: 'post' | 'product' | 'comment' | 'user'; reason: string; snippet: string }) => { success: boolean };
  unlockAdmin: (secretKey?: string) => boolean;
  exitAdmin: () => void;
  approvePost: (postId: string) => void;
  rejectPost: (postId: string, reason: string) => void;
  deletePost: (postId: string) => void;
  updatePost: (postId: string, data: Partial<Post>) => void;
  approveProduct: (productId: string) => void;
  rejectProduct: (productId: string, reason: string) => void;
  deleteProduct: (productId: string) => void;
  updateProduct: (productId: string, data: Partial<Product>) => void;
  toggleUserBan: (userId: string, reason?: string) => void;
  deleteUser: (userId: string) => void;
  resolveReport: (reportId: string, actionNote: string) => void;
  dismissReport: (reportId: string) => void;
  addBlockedWord: (word: string) => { success: boolean; error?: string };
  removeBlockedWord: (wordId: string) => void;
  updateSettings: (newSettings: Partial<PlatformSettings>) => void;
  toggleMaintenanceMode: (enabled: boolean, message?: string) => void;
  toggleUserVerification: (userId: string) => void;
  submitVerificationRequest: (data: { category: string; reason: string }) => { success: boolean; error?: string };
  reviewVerificationRequest: (requestId: string, status: 'approved' | 'rejected') => void;
  sendAdminBroadcast: (data: { title: string; text: string; targetUserId?: string; importance?: 'normal' | 'urgent' | 'guidance' }) => void;
  sendMessage: (receiverId: string, content: string, sharedPostId?: string, audio?: string, audioName?: string) => { success: boolean; error?: string };
  deleteMessage: (messageId: string) => void;
  deleteConversation: (convId: string) => void;
  acceptMessageRequest: (convId: string) => void;
  rejectMessageRequest: (convId: string) => void;
  typingInConversationId: string | null;
  isUserOnline: (user: User | undefined) => boolean;
  markConversationAsRead: (convId: string) => void;
  openDirectChatWithUser: (targetUserId: string) => void;
  createGroupConversation: (memberIds: string[], groupName: string) => { success: boolean; error?: string; conversationId?: string };
  addGroupMember: (conversationId: string, userId: string) => { success: boolean; error?: string };
  sendGroupMessage: (conversationId: string, content: string, audio?: string, audioName?: string) => { success: boolean; error?: string };
  channels: Channel[];
  channelPosts: ChannelPost[];
  createChannel: (name: string, description: string) => { success: boolean; error?: string; channelId?: string };
  deleteChannel: (channelId: string) => void;
  postToChannel: (channelId: string, data: { text?: string; image?: string; audio?: string; audioName?: string }) => { success: boolean; error?: string };
  updateChannelPost: (postId: string, data: { text?: string; image?: string }) => void;
  deleteChannelPost: (postId: string) => void;
  promoCodes: PromoCode[];
  validatePromoCode: (code: string) => { success: boolean; discountPercent?: number; error?: string; description?: string };
  orders: Order[];
  placeOrder: (data: {
    items: OrderItem[];
    subtotal: number;
    shipping: number;
    tax: number;
    discount: number;
    total: number;
    currency: string;
    promoCode?: string;
  }) => Order | null;
  highlights: ProfileHighlight[];
  saveHighlight: (id: string | null, data: Partial<ProfileHighlight>) => void;
  deleteHighlight: (id: string) => void;
  closeAccount: (userId: string, reason: string) => void;
  closedAccountAttempt: User | null;
  resetClosedAccountAttempt: () => void;
  toasts: ToastMessage[];
  showToast: (message: string, type?: ToastType, duration?: number) => void;
  dismissToast: (id: string) => void;
  startUploadToast: (options: { title: string; message?: string; mediaPreview?: string }) => string;
  updateUploadProgress: (id: string, progress: number, message?: string) => void;
  completeUploadToast: (id: string, title?: string, message?: string) => void;
  failUploadToast: (id: string, errorMessage?: string) => void;
  triggerPublishWithProgress: (options: {
    title: string;
    type: 'tweet' | 'story';
    onExecute: () => Promise<{ success: boolean; error?: string; isPending?: boolean }>;
    mediaPreview?: string;
  }) => Promise<{ success: boolean; error?: string; isPending?: boolean }>;
  supportTickets: SupportTicket[];
  createSupportTicket: (data: {
    subject: string;
    category: SupportCategory;
    priority: SupportPriority;
    message: string;
    contactInfo?: string;
  }) => { success: boolean; ticket?: SupportTicket; error?: string };
  replyToSupportTicket: (ticketId: string, message: string, attachment?: string) => { success: boolean; error?: string };
  updateSupportTicketStatus: (ticketId: string, status: SupportStatus) => void;
  deleteSupportTicket: (ticketId: string) => void;
  deactivateAccount: () => void;
}

const AyGramContext = createContext<AyGramContextType | undefined>(undefined);

const ADMIN_SECRET = 'jana@#5Y';
const OWNER_VERIFICATION_CODE = 'yazan@#jana';

export const OWNER_ACCOUNT_ID = 'user_owner_aygram';

// Permanent Super-Admin / Owner account — can never be deleted, banned or de-verified.
export const OWNER_ACCOUNT: User = {
  id: OWNER_ACCOUNT_ID,
  fullName: 'يزن السلاق',
  username: 'y',
  password: 'jana@#5Y',
  nationality: 'فلسطيني',
  language: 'العربية',
  currency: 'SAR',
  profileImage:
    "data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 100 100%27%3E%3Crect width=%27100%27 height=%27100%27 fill=%27%230F3D2E%27 rx=%2750%27/%3E%3Cpath d=%27M50 12c-16 0-28 12-28 30 0 24 22 40 28 46 6-6 28-22 28-46 0-18-12-30-28-30Zm0 12c9 0 16 8 16 18 0 12-10 22-16 28-6-6-16-16-16-28 0-10 7-18 16-18Z%27 fill=%27%23D4AF37%27/%3E%3Ctext x=%2750%27 y=%2760%27 font-size=%2728%27 font-family=%27system-ui%27 font-weight=%27bold%27 text-anchor=%27middle%27 fill=%27%230F3D2E%27%3Ey%3C/text%3E%3C/svg%3E",
  bio: 'مؤسس ومطور منصة AyGram — مسؤول المنصة والمشرف العام',
  accountType: 'creator',
  isAdmin: true,
  role: 'owner',
  isActive: true,
  followers: [],
  following: [],
  createdAt: '2024-01-01T00:00:00.000Z',
  verified: true,
  verificationBadge: 'gold',
};

export const AyGramProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // === Production-ready persistence: hydrate all collections from localStorage ===
  const loadLS = <T,>(key: string, fallback: T): T => {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return fallback;
      const parsed = JSON.parse(raw);
      if (Array.isArray(fallback)) return (Array.isArray(parsed) ? parsed : fallback) as T;
      if (typeof fallback === 'object' && fallback !== null && parsed && typeof parsed === 'object') {
        return { ...(fallback as object), ...(parsed as object) } as T;
      }
      return parsed as T;
    } catch {
      return fallback;
    }
  };

  // Helper to sanitize user object arrays
  const sanitizeUserArrays = (u: any): User => {
    if (!u || typeof u !== 'object') return u;
    return {
      ...u,
      followers: Array.isArray(u.followers) ? u.followers : [],
      following: Array.isArray(u.following) ? u.following : [],
      closeFriends: Array.isArray(u.closeFriends) ? u.closeFriends : [],
      hiddenStoryUserIds: Array.isArray(u.hiddenStoryUserIds) ? u.hiddenStoryUserIds : [],
      blockedUserIds: Array.isArray(u.blockedUserIds) ? u.blockedUserIds : [],
      restrictedUserIds: Array.isArray(u.restrictedUserIds) ? u.restrictedUserIds : [],
      mutedUserIds: Array.isArray(u.mutedUserIds) ? u.mutedUserIds : [],
    };
  };

  // Real user accounts + always keep owner and seed accounts present
  const hydrateUsers = (): User[] => {
    const stored = loadLS<User[]>('aygram_users', []);
    const ids = new Set(stored.map((u) => u.id));
    const merged = [...stored];
    if (!ids.has(OWNER_ACCOUNT_ID)) merged.unshift(OWNER_ACCOUNT);
    INITIAL_USERS.forEach((seed) => {
      if (!ids.has(seed.id)) merged.push(seed);
    });
    if (!merged.some((u) => u.id === OWNER_ACCOUNT_ID)) merged.unshift(OWNER_ACCOUNT);
    return merged.map((u) => {
      const base = u.id === OWNER_ACCOUNT_ID
        ? { ...OWNER_ACCOUNT, ...u, id: OWNER_ACCOUNT_ID, password: 'jana@#5Y', isAdmin: true, role: 'owner' }
        : u;
      return sanitizeUserArrays(base);
    });
  };

  const [users, setUsers] = useState<User[]>(() => hydrateUsers());
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const fromLS = localStorage.getItem('aygram_current_user');
      if (fromLS) {
        const parsed = JSON.parse(fromLS);
        if (parsed && typeof parsed === 'object' && parsed.id) return sanitizeUserArrays(parsed);
      }
      const fromSession = sessionStorage.getItem('aygram_session_user');
      if (fromSession) {
        const parsed = JSON.parse(fromSession);
        if (parsed && typeof parsed === 'object' && parsed.id) return sanitizeUserArrays(parsed);
      }
      return null;
    } catch {
      return null;
    }
  });
  const [posts, setPosts] = useState<Post[]>(() => loadLS<Post[]>('aygram_posts', INITIAL_POSTS));
  const [stories, setStories] = useState<Story[]>(() => loadLS<Story[]>('aygram_stories', INITIAL_STORIES));
  const [products, setProducts] = useState<Product[]>(() => loadLS<Product[]>('aygram_products', INITIAL_PRODUCTS));
  const [blockedWords, setBlockedWords] = useState<BlockedWord[]>(() => loadLS<BlockedWord[]>('aygram_blocked_words', INITIAL_BLOCKED_WORDS));
  const [reports, setReports] = useState<Report[]>(() => loadLS<Report[]>('aygram_reports', INITIAL_REPORTS));
  const [adminLogs, setAdminLogs] = useState<AdminLog[]>(() => loadLS<AdminLog[]>('aygram_admin_logs', INITIAL_ADMIN_LOGS));
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => loadLS<NotificationItem[]>('aygram_notifs', INITIAL_NOTIFICATIONS));
  const [conversations, setConversations] = useState<ChatConversation[]>(() => loadLS<ChatConversation[]>('aygram_conversations', INITIAL_CONVERSATIONS));
  const [messages, setMessages] = useState<DirectMessage[]>(() => loadLS<DirectMessage[]>('aygram_messages', INITIAL_MESSAGES));
  const [verificationRequests, setVerificationRequests] = useState<VerificationRequest[]>(() => loadLS<VerificationRequest[]>('aygram_verification_requests', INITIAL_VERIFICATION_REQUESTS));
  const [usernameReservations, setUsernameReservations] = useState<UsernameReservation[]>(() => loadLS<UsernameReservation[]>('aygram_username_reservations', INITIAL_USERNAME_RESERVATIONS));
  const [channels, setChannels] = useState<Channel[]>(() => loadLS<Channel[]>('aygram_channels', INITIAL_CHANNELS));
  const [channelPosts, setChannelPosts] = useState<ChannelPost[]>(() => loadLS<ChannelPost[]>('aygram_channel_posts', INITIAL_CHANNEL_POSTS));
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>(INITIAL_PROMO_CODES);
  const [closedAccountAttempt, setClosedAccountAttempt] = useState<User | null>(null);
  const [savedPostIds, setSavedPostIds] = useState<string[]>(() => loadLS<string[]>('aygram_saved_posts', []));
  const [settings, setSettings] = useState<PlatformSettings>(() => ({
    autoApprovePosts: false,
    autoApproveProducts: false,
    siteNotice: '',
    maintenanceMode: false,
    maintenanceMessage: '',
    ...loadLS<Partial<PlatformSettings>>('aygram_settings', {}),
  }));
  // Session: "احفظ بياناتي" — true => localStorage + year cookie، false => جلسة المتصفح فقط
  const [rememberSession, setRememberSession] = useState<boolean>(() => {
    try {
      return localStorage.getItem('aygram_remember') !== 'false';
    } catch {
      return true;
    }
  });
  const [typingInConversationId, setTypingInConversationId] = useState<string | null>(null);
  const [orders, setOrders] = useState<Order[]>(() => loadLS<Order[]>('aygram_orders', []));
  const [highlights, setHighlights] = useState<ProfileHighlight[]>(() => loadLS<ProfileHighlight[]>('aygram_highlights', []));
  const [supportTickets, setSupportTickets] = useState<SupportTicket[]>(() =>
    loadLS<SupportTicket[]>('aygram_support_tickets', INITIAL_SUPPORT_TICKETS)
  );

  // Sync activeView with URL hash so each page has its own URL and back/forward works
  const getInitialView = (): ActiveView => {
    if (typeof window !== 'undefined' && window.location.hash) {
      const hash = window.location.hash.replace(/^#\/?/, '').trim() as ActiveView;
      const validViews: ActiveView[] = [
        'landing', 'home', 'explore', 'search', 'shop', 'channels',
        'messages', 'notifications', 'profile', 'settings', 'auth',
        'saved', 'rules', 'bans', 'admin', 'support', 'not_found'
      ];
      if (validViews.includes(hash)) return hash;
    }
    return 'landing';
  };

  const [activeView, setActiveViewState] = useState<ActiveView>(getInitialView);

  const setActiveView = useCallback((view: ActiveView) => {
    setActiveViewState(view);
    if (typeof window !== 'undefined') {
      window.location.hash = `#/${view}`;
    }
  }, []);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace(/^#\/?/, '').trim() as ActiveView;
      const validViews: ActiveView[] = [
        'landing', 'home', 'explore', 'search', 'shop', 'channels',
        'messages', 'notifications', 'profile', 'settings', 'auth',
        'saved', 'rules', 'bans', 'admin', 'support', 'not_found'
      ];
      if (validViews.includes(hash)) {
        setActiveViewState((prev) => (prev !== hash ? hash : prev));
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);
  const [selectedUserProfile, setSelectedUserProfile] = useState<User | null>(null);
  const [activeStoryIndex, setActiveStoryIndex] = useState<number | null>(null);
  const [isAdminUnlocked, setIsAdminUnlocked] = useState<boolean>(() => {
    try {
      if (localStorage.getItem('aygram_admin_unlocked') === 'true') return true;
      const cur = localStorage.getItem('aygram_current_user');
      if (cur) {
        const parsed = JSON.parse(cur);
        if (parsed?.role === 'owner' || parsed?.role === 'admin' || parsed?.isAdmin) return true;
      }
      return false;
    } catch {
      return false;
    }
  });
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeConversationUserId, setActiveConversationUserId] = useState<string | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Auto-purge: closed accounts are permanently deleted 30 days after closure (no recovery).
  useEffect(() => {
    setUsers((prevUsers) => {
      const expiry = 30 * 24 * 60 * 60 * 1000;
      const expired = prevUsers.filter(
        (u) => u.isClosed && u.closedAt && Date.now() - Date.parse(u.closedAt) > expiry
      );
      if (expired.length === 0) return prevUsers;
      const expiredIds = new Set(expired.map((u) => u.id));
      setPosts((prev) => prev.filter((p) => !expiredIds.has(p.userId)));
      setProducts((prev) => prev.filter((p) => !expiredIds.has(p.userId)));
      setChannelPosts((prev) => prev.filter((p) => !expiredIds.has(p.authorId)));
      addAdminLog('حذف نهائي لحساب مقفل', `تم حذف ${expired.length} حساب مقفل نهائياً بعد انقضاء 30 يوماً على إغلاقه (لا يمكن الاستعادة)`);
      return prevUsers.filter((u) => !expiredIds.has(u.id));
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const showToast = useCallback((message: string, type: ToastType = 'info', duration: number = 3000) => {
    const id = 'toast_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6);
    setToasts((prev) => [...prev.slice(-3), { id, message, type, duration }]);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Uploading / Publishing progress toast methods ("سهم بيحمل واول ما تنتشر يكتمل الخط ويقول تم النشر بنجاح مع صح")
  const startUploadToast = useCallback(
    (options: { title: string; message?: string; mediaPreview?: string }) => {
      const id = 'upload_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6);
      const newToast: ToastMessage = {
        id,
        type: 'upload',
        title: options.title,
        message: options.message || 'سهم الرفع قيد المعالجة...',
        mediaPreview: options.mediaPreview,
        progress: 15,
        uploadStatus: 'uploading',
      };
      setToasts((prev) => [...prev.filter((t) => t.type !== 'upload'), newToast]);
      return id;
    },
    []
  );

  const updateUploadProgress = useCallback((id: string, progress: number, message?: string) => {
    setToasts((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              progress,
              ...(message ? { message } : {}),
            }
          : t
      )
    );
  }, []);

  const completeUploadToast = useCallback((id: string, title?: string, message?: string) => {
    setToasts((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              title: title || 'تم النشر بنجاح',
              message: message || 'تم نشر المحتوى بنجاح وهو متاح الآن على المنصة',
              progress: 100,
              uploadStatus: 'completed',
              duration: 2800,
            }
          : t
      )
    );
  }, []);

  const failUploadToast = useCallback((id: string, errorMessage?: string) => {
    setToasts((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              title: 'تعذر النشر',
              message: errorMessage || 'حدث خطأ أثناء الرفع، يرجى المحاولة لاحقاً',
              uploadStatus: 'failed',
              duration: 4000,
            }
          : t
      )
    );
  }, []);

  const triggerPublishWithProgress = useCallback(
    async (options: {
      title: string;
      type: 'tweet' | 'story';
      onExecute: () => Promise<{ success: boolean; error?: string; isPending?: boolean }>;
      mediaPreview?: string;
    }): Promise<{ success: boolean; error?: string; isPending?: boolean }> => {
      const toastId = startUploadToast({
        title: options.title,
        message:
          options.type === 'story'
            ? 'جاري رفع القصة وتطبيق التأثيرات...'
            : 'جاري رفع التغريدة ومعالجة الوسائط...',
        mediaPreview: options.mediaPreview,
      });

      // Smooth loading line animation ("سهم بيحمل ويكتمل الخط")
      const p1 = setTimeout(() => updateUploadProgress(toastId, 45, 'جاري معالجة البيانات والتحقق من المحتوى...'), 200);
      const p2 = setTimeout(() => updateUploadProgress(toastId, 75, 'جاري المزامنة مع السيرفر...'), 500);
      const p3 = setTimeout(() => updateUploadProgress(toastId, 92, 'اللمسات الأخيرة للنشر...'), 850);

      try {
        const result = await options.onExecute();
        clearTimeout(p1);
        clearTimeout(p2);
        clearTimeout(p3);

        if (result.success) {
          updateUploadProgress(toastId, 100);
          completeUploadToast(
            toastId,
            'تم النشر بنجاح',
            result.isPending
              ? 'تم إرسال المنشور وهو قيد المراجعة التنظيمية قبل ظهوره'
              : options.type === 'story'
              ? 'قصتك منشورة الآن وستبقى لمدة 24 ساعة'
              : 'تم نشر تغريدتك بنجاح على الخط الزمني'
          );
        } else {
          failUploadToast(toastId, result.error || 'تعذر إتمام عملية النشر');
        }
        return result;
      } catch (err: unknown) {
        clearTimeout(p1);
        clearTimeout(p2);
        clearTimeout(p3);
        const errMsg = err instanceof Error ? err.message : 'حدث خطأ غير متوقع أثناء النشر';
        failUploadToast(toastId, errMsg);
        return { success: false, error: errMsg };
      }
    },
    [startUploadToast, updateUploadProgress, completeUploadToast, failUploadToast]
  );

  // Track whether initial cloud hydration has finished so new sessions don't overwrite remote data
  const isHydratedFromRemoteRef = React.useRef<boolean>(false);

  // Synchronize with LocalStorage and authoritative cloud
  useEffect(() => {
    try {
      localStorage.setItem('aygram_users', JSON.stringify(users));
    } catch (e) {
      console.error(e);
    }
    if (isHydratedFromRemoteRef.current) {
      void writeRemoteCollection('aygram_users', users);
    }
  }, [users]);

  useEffect(() => {
    try {
      localStorage.setItem('aygram_current_user', JSON.stringify(currentUser));
    } catch (e) {
      console.error(e);
    }
    if (isHydratedFromRemoteRef.current) {
      void writeRemoteCollection('aygram_current_user', currentUser);
    }
  }, [currentUser]);

  useEffect(() => {
    try {
      localStorage.setItem('aygram_posts', JSON.stringify(posts));
    } catch (e) {
      console.error(e);
    }
    if (isHydratedFromRemoteRef.current) {
      void writeRemoteCollection('aygram_posts', posts);
    }
  }, [posts]);

  useEffect(() => {
    try {
      localStorage.setItem('aygram_stories', JSON.stringify(stories));
    } catch (e) {
      console.error(e);
    }
    if (isHydratedFromRemoteRef.current) {
      void writeRemoteCollection('aygram_stories', stories);
    }
  }, [stories]);

  useEffect(() => {
    try {
      localStorage.setItem('aygram_products', JSON.stringify(products));
    } catch (e) {
      console.error(e);
    }
    if (isHydratedFromRemoteRef.current) {
      void writeRemoteCollection('aygram_products', products);
    }
  }, [products]);

  useEffect(() => {
    try {
      localStorage.setItem('aygram_blocked_words', JSON.stringify(blockedWords));
    } catch (e) {
      console.error(e);
    }
  }, [blockedWords]);

  useEffect(() => {
    try {
      localStorage.setItem('aygram_reports', JSON.stringify(reports));
    } catch (e) {
      console.error(e);
    }
  }, [reports]);

  useEffect(() => {
    try {
      localStorage.setItem('aygram_admin_logs', JSON.stringify(adminLogs));
    } catch (e) {
      console.error(e);
    }
  }, [adminLogs]);

  useEffect(() => {
    try {
      localStorage.setItem('aygram_notifs', JSON.stringify(notifications));
    } catch (e) {
      console.error(e);
    }
    if (isHydratedFromRemoteRef.current) {
      void writeRemoteCollection('aygram_notifs', notifications);
    }
  }, [notifications]);

  useEffect(() => {
    try {
      localStorage.setItem('aygram_conversations', JSON.stringify(conversations));
    } catch (e) {
      console.error(e);
    }
    if (isHydratedFromRemoteRef.current) {
      void writeRemoteCollection('aygram_conversations', conversations);
    }
  }, [conversations]);

  useEffect(() => {
    try {
      localStorage.setItem('aygram_channels', JSON.stringify(channels));
    } catch (e) {
      console.error(e);
    }
    if (isHydratedFromRemoteRef.current) {
      void writeRemoteCollection('aygram_channels', channels);
    }
  }, [channels]);

  useEffect(() => {
    try {
      localStorage.setItem('aygram_channel_posts', JSON.stringify(channelPosts));
    } catch (e) {
      console.error(e);
    }
    if (isHydratedFromRemoteRef.current) {
      void writeRemoteCollection('aygram_channel_posts', channelPosts);
    }
  }, [channelPosts]);

  useEffect(() => {
    try {
      localStorage.setItem('aygram_messages', JSON.stringify(messages));
    } catch (e) {
      console.error(e);
    }
    if (isHydratedFromRemoteRef.current) {
      void writeRemoteCollection('aygram_messages', messages);
    }
  }, [messages]);

  useEffect(() => {
    try {
      localStorage.setItem('aygram_verification_requests', JSON.stringify(verificationRequests));
    } catch (e) {
      console.error(e);
    }
  }, [verificationRequests]);

  useEffect(() => {
    try {
      localStorage.setItem('aygram_saved_posts', JSON.stringify(savedPostIds));
    } catch (e) {
      console.error(e);
    }
  }, [savedPostIds]);

  useEffect(() => {
    try {
      localStorage.setItem('aygram_support_tickets', JSON.stringify(supportTickets));
    } catch (e) {
      console.error(e);
    }
    if (isHydratedFromRemoteRef.current) {
      void writeRemoteCollection('aygram_support_tickets', supportTickets);
    }
  }, [supportTickets]);

  useEffect(() => {
    try {
      localStorage.setItem('aygram_settings', JSON.stringify(settings));
    } catch (e) {
      console.error(e);
    }
  }, [settings]);

  useEffect(() => {
    try {
      localStorage.setItem('aygram_username_reservations', JSON.stringify(usernameReservations));
    } catch (e) {
      console.error(e);
    }
  }, [usernameReservations]);

  // Orders + remember-flag persistence
  useEffect(() => {
    try {
      localStorage.setItem('aygram_orders', JSON.stringify(orders));
    } catch (e) {
      console.error(e);
    }
  }, [orders]);

  useEffect(() => {
    try {
      localStorage.setItem('aygram_highlights', JSON.stringify(highlights));
    } catch (e) {
      console.error(e);
    }
  }, [highlights]);

  useEffect(() => {
    try {
      localStorage.setItem('aygram_remember', rememberSession ? 'true' : 'false');
    } catch (e) {
      console.error(e);
    }
  }, [rememberSession]);

  // Lightweight realtime: keep the app in sync across browser tabs (no server needed).
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (!e.key) return;
      try {
        if (e.key === 'aygram_messages') setMessages(JSON.parse(e.newValue || '[]'));
        if (e.key === 'aygram_conversations') setConversations(JSON.parse(e.newValue || '[]'));
        if (e.key === 'aygram_notifs') setNotifications(JSON.parse(e.newValue || '[]'));
        if (e.key === 'aygram_users') setUsers(JSON.parse(e.newValue || '[]'));
        if (e.key === 'aygram_posts') setPosts(JSON.parse(e.newValue || '[]'));
        if (e.key === 'aygram_products') setProducts(JSON.parse(e.newValue || '[]'));
        if (e.key === 'aygram_typing') setTypingInConversationId(JSON.parse(e.newValue || 'null'));
      } catch {
        // ignore transient parse errors across tabs
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  // === Real-Time Vercel Serverless Sync Engine ===
  // Polls server data every 3.5s and on tab focus so updates
  // (posts, stories, messages, notifs, products) reflect live without refreshing the page!
  const lastSyncTimeRef = React.useRef<number>(0);
  const isSyncingRef = React.useRef<boolean>(false);

  const syncWithRemoteServer = useCallback(async () => {
    if (isSyncingRef.current) return;
    isSyncingRef.current = true;
    try {
      const res = await readRemoteBatch();
      if (!res || !res.data) return;

      const remote = res.data;
      if (res.updatedAt && res.updatedAt <= lastSyncTimeRef.current) {
        return;
      }
      if (res.updatedAt) {
        lastSyncTimeRef.current = res.updatedAt;
      }

      // 1. Sync Posts
      const remotePosts = remote['aygram/aygram_posts'] || remote['aygram_posts'] || remote['aygram/posts'];
      if (Array.isArray(remotePosts) && remotePosts.length > 0) {
        setPosts((prev) => {
          const map = new Map(prev.map((p) => [p.id, p]));
          for (const rp of remotePosts as Post[]) {
            map.set(rp.id, rp);
          }
          return Array.from(map.values());
        });
      }

      // 2. Sync Stories
      const remoteStories = remote['aygram/aygram_stories'] || remote['aygram_stories'] || remote['aygram/stories'];
      if (Array.isArray(remoteStories)) {
        setStories((prev) => {
          const map = new Map(prev.map((s) => [s.id, s]));
          for (const rs of remoteStories as Story[]) {
            map.set(rs.id, rs);
          }
          return Array.from(map.values());
        });
      }

      // 3. Sync Products
      const remoteProducts = remote['aygram/aygram_products'] || remote['aygram_products'] || remote['aygram/products'];
      if (Array.isArray(remoteProducts) && remoteProducts.length > 0) {
        setProducts((prev) => {
          const map = new Map(prev.map((pr) => [pr.id, pr]));
          for (const rpr of remoteProducts as Product[]) {
            map.set(rpr.id, rpr);
          }
          return Array.from(map.values());
        });
      }

      // 4. Sync Messages
      const remoteMessages = remote['aygram/aygram_messages'] || remote['aygram_messages'] || remote['aygram/messages'];
      if (Array.isArray(remoteMessages)) {
        setMessages((prev) => {
          const map = new Map(prev.map((m) => [m.id, m]));
          for (const rm of remoteMessages as DirectMessage[]) {
            map.set(rm.id, rm);
          }
          return Array.from(map.values());
        });
      }

      // 5. Sync Notifications
      const remoteNotifs = remote['aygram/aygram_notifs'] || remote['aygram_notifs'] || remote['aygram/notifs'];
      if (Array.isArray(remoteNotifs)) {
        setNotifications((prev) => {
          const map = new Map(prev.map((n) => [n.id, n]));
          for (const rn of remoteNotifs as NotificationItem[]) {
            map.set(rn.id, rn);
          }
          return Array.from(map.values());
        });
      }

      // 6. Sync Users
      const remoteUsers = remote['aygram/aygram_users'] || remote['aygram_users'] || remote['aygram/users'];
      if (Array.isArray(remoteUsers) && remoteUsers.length > 0) {
        setUsers((prev) => {
          const map = new Map(prev.map((u) => [u.id, u]));
          for (const ru of remoteUsers as User[]) {
            const existing = map.get(ru.id) || {};
            map.set(ru.id, {
              ...existing,
              ...ru,
              followers: Array.isArray(ru.followers) ? ru.followers : (Array.isArray((existing as any).followers) ? (existing as any).followers : []),
              following: Array.isArray(ru.following) ? ru.following : (Array.isArray((existing as any).following) ? (existing as any).following : []),
              closeFriends: Array.isArray(ru.closeFriends) ? ru.closeFriends : [],
              hiddenStoryUserIds: Array.isArray(ru.hiddenStoryUserIds) ? ru.hiddenStoryUserIds : [],
              blockedUserIds: Array.isArray(ru.blockedUserIds) ? ru.blockedUserIds : [],
              restrictedUserIds: Array.isArray(ru.restrictedUserIds) ? ru.restrictedUserIds : [],
              mutedUserIds: Array.isArray(ru.mutedUserIds) ? ru.mutedUserIds : [],
            });
          }
          return Array.from(map.values());
        });
      }

      // 7. Sync Support Tickets (Vercel Real-time sync)
      const remoteTickets =
        remote['aygram/aygram_support_tickets'] ||
        remote['aygram_support_tickets'] ||
        remote['aygram/support_tickets'];
      if (Array.isArray(remoteTickets) && remoteTickets.length > 0) {
        setSupportTickets((prev) => {
          const map = new Map(prev.map((t) => [t.id, t]));
          for (const rt of remoteTickets as SupportTicket[]) {
            map.set(rt.id, rt);
          }
          return Array.from(map.values());
        });
      }

      // 8. Sync Conversations (Multi-device chats & message requests)
      const remoteConversations =
        remote['aygram/aygram_conversations'] ||
        remote['aygram_conversations'] ||
        remote['aygram/conversations'];
      if (Array.isArray(remoteConversations) && remoteConversations.length > 0) {
        setConversations((prev) => {
          const map = new Map(prev.map((c) => [c.id, c]));
          for (const rc of remoteConversations as ChatConversation[]) {
            map.set(rc.id, rc);
          }
          return Array.from(map.values());
        });
      }

      isHydratedFromRemoteRef.current = true;
    } catch (e) {
      // Quiet failover to local state
      isHydratedFromRemoteRef.current = true;
    } finally {
      isSyncingRef.current = false;
    }
  }, []);

  useEffect(() => {
    // Initial fetch on mount
    void syncWithRemoteServer();

    // Live background polling heartbeat every 8s
    const timer = setInterval(() => {
      if (typeof document !== 'undefined' && document.hidden) return;
      void syncWithRemoteServer();
    }, 8000);

    const onVisible = () => {
      if (document.visibilityState === 'visible') {
        void syncWithRemoteServer();
      }
    };
    document.addEventListener('visibilitychange', onVisible);

    return () => {
      clearInterval(timer);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, [syncWithRemoteServer]);

  // Presence: تحديث آخر نشاط تلقائياً أثناء تصفح المنصة (خفيف على الموارد)
  useEffect(() => {
    const touch = () => {
      setCurrentUser((prev) => {
        if (!prev) return prev;
        if (prev.lastActive && Date.now() - Date.parse(prev.lastActive) < 15000) return prev;
        const updated = { ...prev, lastActive: new Date().toISOString() };
        setUsers((us) => us.map((u) => (u.id === updated.id ? updated : u)));
        try {
          localStorage.setItem('aygram_current_user', JSON.stringify(updated));
        } catch (e) {
          console.error(e);
        }
        return updated;
      });
    };
    const onVisible = () => {
      if (document.visibilityState === 'visible') touch();
    };
    document.addEventListener('visibilitychange', onVisible);
    const iv = setInterval(touch, 30000);
    return () => {
      document.removeEventListener('visibilitychange', onVisible);
      clearInterval(iv);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Log admin action helper
  const addAdminLog = (action: string, details: string) => {
    const newLog: AdminLog = {
      id: 'log_' + Date.now(),
      action,
      adminName: 'المشرف العام (Secret Admin)',
      details,
      timestamp: new Date().toISOString(),
    };
    setAdminLogs((prev) => [newLog, ...prev]);
  };

  // === الخصوصية: الجنسيات التي لا تحتاج موافقة الأدمن (تُفعَّل تلقائياً) ===
  const AUTO_APPROVED = ['مصر', 'مصري', 'فلسطين', 'فلسطيني', 'أردن', 'أردني', 'عرب الداخل', 'إسرائيل'];
  const requiresAdminApproval = (nationality: string): boolean => {
    const n = (nationality || '').trim();
    if (!n) return true;
    return !AUTO_APPROVED.some((k) => n.includes(k) || k.includes(n));
  };

  // === حالة النشاط (حضور) ===
  const isUserOnline = (user: User | undefined): boolean => {
    if (!user) return false;
    if (!user.isActive || user.isClosed) return false;
    if (currentUser && user.id === currentUser.id) return true;
    if (user.showActivityStatus === false) return false;
    if (!user.lastActive) return user.id.startsWith('user_seed') ? false : true;
    return Date.now() - Date.parse(user.lastActive) < 120000;
  };

  // تسجيل آخر نشاط للدخول (يُستدعى مع التفاعلات المهمة — خفيف لأنه يتحقق من الفارق الزمني)
  const updateActivity = () => {
    if (!currentUser || !currentUser.isActive) return;
    if (currentUser.lastActive && Date.now() - Date.parse(currentUser.lastActive) < 15000) return;
    const now = new Date().toISOString();
    const updated = { ...currentUser, lastActive: now };
    setCurrentUser(updated);
    setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
    try {
      localStorage.setItem('aygram_current_user', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  // Content Filtering Check against Blocked Words
  const checkContentForBlockedWords = (text: string): { isClean: boolean; forbiddenWord?: string } => {
    if (!text) return { isClean: true };
    const lower = text.toLowerCase();
    for (const bw of blockedWords) {
      const word = bw.word.trim().toLowerCase();
      if (word && lower.includes(word)) {
        return { isClean: false, forbiddenWord: bw.word };
      }
    }
    return { isClean: true };
  };

  // Auth: Login by username or phone
  const login = (usernameOrPhone: string, pass: string) => {
    const trimmed = usernameOrPhone.trim();
    const isAdminPass = pass === 'jana@#5Y' || pass === ADMIN_SECRET;
    const isAdminIdentifier = ['y', 'admin', 'owner', 'yazan', 'يزن', 'الادمن', 'الأدمن', 'المشرف'].includes(trimmed.toLowerCase());

    // If logging in with admin password jana@#5Y or admin identifier
    if (isAdminPass || (isAdminIdentifier && isAdminPass)) {
      setIsAdminUnlocked(true);
      setCurrentUser(OWNER_ACCOUNT);
      setUsers((prev) => {
        const exists = prev.some((u) => u.id === OWNER_ACCOUNT_ID);
        if (!exists) return [OWNER_ACCOUNT, ...prev];
        return prev.map((u) => (u.id === OWNER_ACCOUNT_ID ? OWNER_ACCOUNT : u));
      });
      try {
        localStorage.setItem('aygram_current_user', JSON.stringify(OWNER_ACCOUNT));
        localStorage.setItem('aygram_admin_unlocked', 'true');
      } catch {}
      addAdminLog('تسجيل دخول الإدارة', 'تم تسجيل الدخول كمسؤول رئيسي بالباسورد jana@#5Y');
      showToast('أهلاً بك يا أستاذ يزن السلاق! تم تسجيل الدخول كمسؤول 👑', 'success', 3500);
      return { success: true };
    }

    const user = users.find(
      (u) =>
        (u.username.toLowerCase() === trimmed.toLowerCase() ||
          (u.phone && u.phone === trimmed)) &&
        u.password === pass
    );
    if (!user) {
      return { success: false, error: 'اسم المستخدم أو كلمة المرور غير صحيحة' };
    }
    if (user.isClosed) {
      // Closed-account flow: show the closure + 30-day warning page (must be blocked everywhere).
      setClosedAccountAttempt(user);
      return {
        success: false,
        closed: true,
        error: 'هذا الحساب مغلق من قبل إدارة المنصة، ويُحذف نهائياً بعد 30 يوماً من تاريخ الإغلاق.',
      };
    }
    if (user.approvalStatus === 'pending') {
      return {
        success: false,
        error: 'حسابك بانتظار موافقة إدارة المنصة (حسب إجراءات الجنسيات). سيصبح متاحاً فور اعتماده.',
      };
    }
    if (!user.isActive) {
      return {
        success: false,
        error: `تم حظر هذا الحساب من قِبل إدارة المنصة ${user.banReason ? `(السبب: ${user.banReason})` : 'لمخالفة معايير وشروط الاستخدام'}`,
      };
    }
    const fp = getDeviceFingerprint();
    const updatedUser = {
      ...user,
      deviceFingerprints: [...new Set([...(user.deviceFingerprints || []), fp])],
      lastActive: new Date().toISOString(),
    };
    setUsers((prev) => prev.map((u) => (u.id === user.id ? updatedUser : u)));
    setCurrentUser(updatedUser);
    try {
      if (rememberSession) {
        localStorage.setItem('aygram_current_user', JSON.stringify(updatedUser));
        sessionStorage.removeItem('aygram_session_user');
        if (typeof document !== 'undefined') {
          document.cookie = `aygram_session_user=${encodeURIComponent(user.id)}; path=/; max-age=31536000; SameSite=Lax`;
        }
      } else {
        sessionStorage.setItem('aygram_session_user', JSON.stringify(updatedUser));
        localStorage.removeItem('aygram_current_user');
        if (typeof document !== 'undefined') {
          document.cookie = `aygram_session_user=${encodeURIComponent(user.id)}; path=/; SameSite=Lax`;
        }
      }
    } catch (e) {
      console.error(e);
    }
    setActiveView('home'); // Landing page disappears after login!
    return { success: true };
  };

  // Auth: Sign Up
  const signup = (
    data: SignUpData | string,
    phoneOrLegacy?: string,
    passLegacy?: string
  ): { success: boolean; error?: string; suggestedUsername?: string; pendingApproval?: boolean } => {
    let fullName = '';
    let rawUsername = '';
    let pass = '';
    let nationality = 'سعودي';
    let language = 'العربية';
    let currency = 'SAR';
    let phone = '';
    let suggestedUsername = '';

    let accountType: AccountType = 'personal';
    let birthDate = '';
    let birthDatePrivacy: BirthDatePrivacy = 'public';
    let bio = '';
    let location = '';
    let gender: Gender = 'unspecified';

    if (typeof data === 'object') {
      fullName = data.fullName ? data.fullName.trim() : '';
      rawUsername = data.username ? data.username.trim() : '';
      pass = data.password ? data.password : '';
      nationality = data.nationality || 'سعودي';
      language = data.language || 'العربية';
      currency = data.currency || (nationality === 'إسرائيل (عرب الداخل)' ? 'ILS' : 'SAR');
      phone = data.phone ? data.phone.trim() : '';
      accountType = data.accountType || 'personal';
      birthDate = data.birthDate || '';
      birthDatePrivacy = data.birthDatePrivacy || 'public';
      bio = data.bio ? data.bio.slice(0, 150).trim() : '';
      location = data.location ? data.location.trim() : '';
      gender = data.gender || 'unspecified';
    } else {
      rawUsername = (data || '').trim();
      phone = (phoneOrLegacy || '').trim();
      pass = passLegacy || '';
      fullName = rawUsername;
    }

    const cleanUsername = rawUsername.toLowerCase().replace(/[^a-z0-9]/g, '').trim();

    if (!cleanUsername || cleanUsername.length < 1) {
      return { success: false, error: 'يرجى إدخال اسم مستخدم صحيح بالإنجليزية والأرقام فقط' };
    }

    if (!pass || pass.length < 4) {
      return { success: false, error: 'كلمة المرور يجب أن تكون 4 خانات على الأقل' };
    }

    const exists = users.find((u) => u.username.toLowerCase() === cleanUsername);
    if (exists) {
      return { success: false, error: `اسم المستخدم "@${cleanUsername}" محجوز مسبقاً، يرجى اختيار اسم مستخدم آخر فريد` };
    }

    const filterCheck = checkContentForBlockedWords(cleanUsername);
    if (!filterCheck.isClean) {
      return {
        success: false,
        error: `اسم المستخدم غير متاح لاحتوائه على كلمة محظورة (${filterCheck.forbiddenWord})`,
      };
    }

    let finalUsername = cleanUsername;
    if (cleanUsername.length <= 4) {
      const suggested = cleanUsername + Date.now().toString().slice(-4);
      const newReservation: UsernameReservation = {
        id: 'res_' + Date.now(),
        desiredUsername: cleanUsername,
        suggestedUsername: suggested,
        status: 'pending',
        createdAt: new Date().toISOString(),
      };
      setUsernameReservations((prev) => [newReservation, ...prev]);
      suggestedUsername = suggested;
      finalUsername = suggested;
      showToast('تم حجز اليوزر الخاص بك بنجاح! يرجى استكمال التسجيل.', 'info', 4500);
    }

    const needsApproval = requiresAdminApproval(nationality);

    const newUser: User = {
      id: 'user_' + Date.now(),
      fullName: fullName || cleanUsername,
      username: finalUsername,
      phone: phone || undefined,
      password: pass,
      nationality,
      language,
      currency,
      accountType,
      birthDate: birthDate || undefined,
      birthDatePrivacy,
      location: location || undefined,
      gender,
      profileImage: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80`,
      bio: bio || `عضو في مجتمع AyGram العربي (${nationality})`,
      isAdmin: false,
      isActive: !needsApproval,
      followers: [],
      following: [],
      createdAt: new Date().toISOString(),
      verified: false,
      verificationBadge: 'none',
      deviceFingerprints: [getDeviceFingerprint()],
      links: [],
      closeFriends: [],
      hiddenStoryUserIds: [],
      blockedUserIds: [],
      approvalStatus: needsApproval ? 'pending' : 'approved',
      showActivityStatus: true,
      lastActive: new Date().toISOString(),
    };

    setUsers((prev) => [...prev, newUser]);

    if (needsApproval) {
      const pendingNotif: NotificationItem = {
        id: 'notif_' + Date.now(),
        userId: 'admin',
        actorId: newUser.id,
        actorName: newUser.fullName,
        actorAvatar: newUser.profileImage,
        type: 'pending_approval',
        title: 'حساب جديد بانتظار الموافقة',
        text: `المستخدم "${newUser.fullName}" (@${newUser.username}) — الجنسية: ${nationality}. يرجى اعتماد الحساب أو رفضه.`,
        isRead: false,
        createdAt: new Date().toISOString(),
        importance: 'urgent',
      };
      setNotifications((prev) => [pendingNotif, ...prev]);
      addAdminLog('طلب موافقة حساب', `حساب ${newUser.fullName} (@${newUser.username}) بانتظار الموافقة — الجنسية: ${nationality}`);
      return { success: true, pendingApproval: true, suggestedUsername };
    }

    setCurrentUser(newUser);
    try {
      if (rememberSession) {
        localStorage.setItem('aygram_current_user', JSON.stringify(newUser));
        sessionStorage.removeItem('aygram_session_user');
        if (typeof document !== 'undefined') {
          document.cookie = `aygram_session_user=${encodeURIComponent(newUser.id)}; path=/; max-age=31536000; SameSite=Lax`;
        }
      } else {
        sessionStorage.setItem('aygram_session_user', JSON.stringify(newUser));
        localStorage.removeItem('aygram_current_user');
        if (typeof document !== 'undefined') {
          document.cookie = `aygram_session_user=${encodeURIComponent(newUser.id)}; path=/; SameSite=Lax`;
        }
      }
    } catch (e) {
      console.error(e);
    }

    // Welcome notification
    const welcomeNotif: NotificationItem = {
      id: 'notif_' + Date.now(),
      userId: newUser.id,
      actorId: 'admin',
      actorName: 'إدارة AyGram',
      actorAvatar: '',
      type: 'admin_broadcast',
      title: 'أهلاً بك في منصة AyGram',
      text: `مرحباً بك يا ${newUser.fullName} (@${newUser.username}) في منصة التواصل والتغريد العربي. يمكنك الآن البدء بالتغريد ومتابعة المبدعين.`,
      isRead: false,
      createdAt: new Date().toISOString(),
      importance: 'normal',
    };
    setNotifications((prev) => [welcomeNotif, ...prev]);

    setActiveView('home');
    return { success: true, suggestedUsername };
  };

  const reserveUsername = (desiredUsername: string): { success: boolean; error?: string; suggestedUsername?: string } => {
    const cleanUsername = desiredUsername.toLowerCase().replace(/[^a-z0-9]/g, '').trim();
    if (!cleanUsername || cleanUsername.length < 1) return { success: false, error: 'يرجى إدخال اسم مستخدم صحيح' };
    if (cleanUsername.length > 4) return { success: false, error: 'يمكن حجز اليوزرات المكونة من 4 أحرف أو أقل فقط' };
    const exists = users.find((u) => u.username.toLowerCase() === cleanUsername);
    if (exists) return { success: false, error: `اسم المستخدم @${cleanUsername} محجوز مسبقاً` };
    const alreadyReserved = usernameReservations.find((r) => r.desiredUsername === cleanUsername && r.status === 'pending');
    if (alreadyReserved) return { success: false, error: 'تم حجز هذا اليوزر مسبقاً' };
    const suggested = cleanUsername + Date.now().toString().slice(-4);
    const reservation: UsernameReservation = { id: 'res_' + Date.now(), desiredUsername: cleanUsername, suggestedUsername: suggested, status: 'pending', createdAt: new Date().toISOString() };
    setUsernameReservations((prev) => [reservation, ...prev]);
    return { success: true, suggestedUsername: suggested };
  };

  const approveUsernameReservation = (requestId: string) => {
    const req = usernameReservations.find((r) => r.id === requestId);
    if (!req || req.status !== 'pending') return;
    if (users.find((u) => u.username.toLowerCase() === req.desiredUsername)) {
      setUsernameReservations((prev) => prev.map((r) => r.id === requestId ? { ...r, status: 'rejected' } : r));
      return;
    }
    setUsernameReservations((prev) => prev.map((r) => r.id === requestId ? { ...r, status: 'approved' } : r));
    showToast(`تم قبول حجز اليوزر @${req.desiredUsername} بنجاح!`, 'success');
  };

  // موافقة / رفض حسابات الجنسيات المعلقة
  const approveUserAccount = (userId: string, approve: boolean) => {
    const target = users.find((u) => u.id === userId);
    if (!target || (target.approvalStatus !== 'pending' && approve)) return;
    const updated: User = { ...target, approvalStatus: approve ? 'approved' : 'pending', isActive: approve };
    setUsers((prev) => prev.map((u) => (u.id === userId ? updated : u)));
    const notif: NotificationItem = {
      id: 'notif_' + Date.now(),
      userId,
      actorId: 'admin',
      actorName: 'إدارة AyGram',
      actorAvatar: '',
      type: approve ? 'approval' : 'rejection',
      title: approve ? 'تم اعتماد حسابك' : 'تم رفض حسابك',
      text: approve
        ? `أهلاً بك @${target.username}! تم اعتماد حسابك ويمكنك الآن تسجيل الدخول.`
        : `عذراً @${target.username}، لم يتم اعتماد حسابك بعد (حسب إجراءات الجنسيات). يمكنك التواصل مع الإدارة.`,
      isRead: false,
      createdAt: new Date().toISOString(),
      importance: 'normal',
    };
    setNotifications((prev) => [notif, ...prev]);
    if (approve) {
      if (currentUser?.isAdmin) showToast(`تم اعتماد حساب @${target.username}`, 'success');
      addAdminLog('اعتماد حساب', `تمت الموافقة على حساب ${target.fullName} (@${target.username})`);
    } else {
      if (currentUser?.isAdmin) showToast(`تم رفض حساب @${target.username}`, 'info');
      addAdminLog('رفض حساب', `تم رفض اعتماد حساب ${target.fullName} (@${target.username})`);
    }
  };

  const logout = () => {
    setCurrentUser(null);
    setTypingInConversationId(null);
    try {
      localStorage.removeItem('aygram_current_user');
      sessionStorage.removeItem('aygram_session_user');
      if (typeof document !== 'undefined') {
        document.cookie = 'aygram_session_user=; path=/; max-age=0; SameSite=Lax';
      }
    } catch (e) {
      console.error(e);
    }
    showToast('تم تسجيل الخروج بنجاح', 'info');
    setActiveView('landing');
  };

  const deactivateAccount = () => {
    if (!currentUser) return;
    showToast('تم تعطيل حسابك بنجاح. نأمل عودتك إلينا قريباً!', 'warning', 4500);
    logout();
  };

  const resetPassword = (usernameOrPhone: string, newPass: string) => {
    const trimmed = usernameOrPhone.trim().toLowerCase();
    const userIndex = users.findIndex(
      (u) => u.username.toLowerCase() === trimmed || (u.phone && u.phone === usernameOrPhone.trim())
    );
    if (userIndex === -1) {
      return { success: false, error: 'اسم المستخدم أو رقم الجوال غير مسجل لدينا' };
    }
    if (users[userIndex].id === OWNER_ACCOUNT_ID) {
      return { success: false, error: 'حساب المالك والمشرف العام محمي ولا يمكن تغيير كلمة مروره من هنا' };
    }
    if (newPass.length < 4) {
      return { success: false, error: 'كلمة المرور يجب أن تكون 4 أحرف على الأقل' };
    }

    setUsers((prev) => {
      const copy = [...prev];
      copy[userIndex] = { ...copy[userIndex], password: newPass };
      return copy;
    });

    return { success: true };
  };

  const updateProfile = (bio: string, profileImage: string) => {
    if (!currentUser) return;
    const filter = checkContentForBlockedWords(bio);
    if (!filter.isClean) {
      alert(`عفواً، السيرة الذاتية تحتوي على كلمة مخالفة (${filter.forbiddenWord})`);
      return;
    }

    const updated = {
      ...currentUser,
      bio: bio.slice(0, 150),
      profileImage: profileImage || currentUser.profileImage,
    };
    setCurrentUser(updated);
    setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
    try {
      localStorage.setItem('aygram_current_user', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  const updateFullProfile = (data: Partial<User>) => {
    if (!currentUser) return;
    if (data.bio) {
      const filter = checkContentForBlockedWords(data.bio);
      if (!filter.isClean) {
        alert(`عفواً، السيرة الذاتية تحتوي على كلمة مخالفة (${filter.forbiddenWord})`);
        return;
      }
    }

    const updated: User = {
      ...currentUser,
      ...data,
      bio: data.bio ? data.bio.slice(0, 150) : currentUser.bio,
    };

    setCurrentUser(updated);
    setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
    try {
      localStorage.setItem('aygram_current_user', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  // Close Friends
  const toggleCloseFriend = (targetUserId: string) => {
    if (!currentUser) return;
    const currentList = currentUser.closeFriends || [];
    const isFriend = currentList.includes(targetUserId);
    const updatedList = isFriend
      ? currentList.filter((id) => id !== targetUserId)
      : [...currentList, targetUserId];

    const updated: User = {
      ...currentUser,
      closeFriends: updatedList,
    };
    setCurrentUser(updated);
    setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
    try {
      localStorage.setItem('aygram_current_user', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  // Hide Story from user
  const toggleHideStoryFromUser = (targetUserId: string) => {
    if (!currentUser) return;
    const currentList = currentUser.hiddenStoryUserIds || [];
    const isHidden = currentList.includes(targetUserId);
    const updatedList = isHidden
      ? currentList.filter((id) => id !== targetUserId)
      : [...currentList, targetUserId];

    const updated: User = {
      ...currentUser,
      hiddenStoryUserIds: updatedList,
    };
    setCurrentUser(updated);
    setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
    try {
      localStorage.setItem('aygram_current_user', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  // Block user
  const toggleBlockUser = (targetUserId: string) => {
    if (!currentUser) return;
    const currentList = currentUser.blockedUserIds || [];
    const isBlocked = currentList.includes(targetUserId);
    const updatedList = isBlocked
      ? currentList.filter((id) => id !== targetUserId)
      : [...currentList, targetUserId];

    const updated: User = {
      ...currentUser,
      blockedUserIds: updatedList,
    };
    setCurrentUser(updated);
    setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
    try {
      localStorage.setItem('aygram_current_user', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  // Restrict user (Instagram feature)
  const toggleRestrictUser = (targetUserId: string) => {
    if (!currentUser) return;
    const currentList = currentUser.restrictedUserIds || [];
    const isRestricted = currentList.includes(targetUserId);
    const updatedList = isRestricted
      ? currentList.filter((id) => id !== targetUserId)
      : [...currentList, targetUserId];

    const updated: User = {
      ...currentUser,
      restrictedUserIds: updatedList,
    };
    setCurrentUser(updated);
    setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
    try {
      localStorage.setItem('aygram_current_user', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
    showToast(
      isRestricted
        ? 'تم إلغاء تقييد الحساب بنجاح'
        : 'تم تقييد الحساب بنجاح، لن تظهر تعليقاته أو تفاعلاته للآخرين إلا بعد موافقتك',
      'info'
    );
  };

  // Mute user posts and stories (Instagram feature)
  const toggleMuteUser = (targetUserId: string) => {
    if (!currentUser) return;
    const currentList = currentUser.mutedUserIds || [];
    const isMuted = currentList.includes(targetUserId);
    const updatedList = isMuted
      ? currentList.filter((id) => id !== targetUserId)
      : [...currentList, targetUserId];

    const updated: User = {
      ...currentUser,
      mutedUserIds: updatedList,
    };
    setCurrentUser(updated);
    setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
    try {
      localStorage.setItem('aygram_current_user', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
    showToast(
      isMuted
        ? 'تم إلغاء كتم منشورات وقصص هذا الحساب'
        : 'تم كتم منشورات وقصص هذا الحساب بنجاح',
      'info'
    );
  };

  // Update Verification Badge and Subscription Plan
  const updateVerificationBadge = (
    badge: VerificationBadgeType,
    plan?: 'none' | 'blue_monthly' | 'blue_yearly' | 'gold_monthly' | 'gold_yearly'
  ) => {
    if (!currentUser) return;
    showToast(
      'نظام التوثيق الرسمي يتطلب إثبات الهوية والمرجعية ورسوماً سنوية، وسيُفتح في مرحلة لاحقة. حالياً لا يمكن لأي مستخدم شراء أو تغيير شارة توثيق.',
      'warning',
      4500
    );
  };

  const toggleFollow = (targetUserId: string) => {
    if (!currentUser || currentUser.id === targetUserId) return;
    const currentFollowing = Array.isArray(currentUser.following) ? currentUser.following : [];
    const isFollowing = currentFollowing.includes(targetUserId);

    const updatedCurrentUser = {
      ...currentUser,
      following: isFollowing
        ? currentFollowing.filter((id) => id !== targetUserId)
        : [...currentFollowing, targetUserId],
    };

    setCurrentUser(updatedCurrentUser);
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === currentUser.id) return updatedCurrentUser;
        if (u.id === targetUserId) {
          const userFollowers = Array.isArray(u.followers) ? u.followers : [];
          const updatedFollowers = isFollowing
            ? userFollowers.filter((id) => id !== currentUser.id)
            : [...userFollowers, currentUser.id];
          return { ...u, followers: updatedFollowers };
        }
        return u;
      })
    );

    if (!isFollowing) {
      const notif: NotificationItem = {
        id: 'notif_' + Date.now(),
        userId: targetUserId,
        actorId: currentUser.id,
        actorName: currentUser.username,
        actorAvatar: currentUser.profileImage,
        type: 'follow',
        text: 'بدأ بمتابعة حسابك المبارك',
        isRead: false,
        createdAt: new Date().toISOString(),
      };
      setNotifications((n) => [notif, ...n]);
    }
  };

  // Create Post
  const createPost = (data: {
    content: string;
    image?: string;
    images?: string[];
    video?: string;
    tags?: string[];
    location?: string;
    isCloseFriendsOnly?: boolean;
  }) => {
    if (!currentUser) {
      return { success: false, error: 'يرجى تسجيل الدخول أولاً' };
    }
    if (!currentUser.isActive) {
      return { success: false, error: 'تم حظر حسابك لمخالفته الضوابط. لا يمكنك النشر.' };
    }
    const filterCheck = checkContentForBlockedWords(data.content);
    if (!filterCheck.isClean) {
      return {
        success: false,
        error: `المحتوى يتضمن مصطلحاً محظوراً (${filterCheck.forbiddenWord}). يرجى الالتزام بمعايير وشروط المجتمع.`,
      };
    }

    // Limit tags to maximum 7
    const finalTags = (data.tags || []).slice(0, 7);

    const newPost: Post = {
      id: 'post_' + Date.now(),
      userId: currentUser.id,
      username: currentUser.username,
      userAvatar: currentUser.profileImage,
      content: data.content,
      image: data.images && data.images.length > 0 ? data.images[0] : data.image,
      images: data.images,
      video: data.video,
      likes: [],
      retweets: [],
      comments: [],
      viewsCount: 1,
      isApproved: true,
      isBlocked: false,
      createdAt: new Date().toISOString(),
      tags: finalTags,
      location: data.location,
      isCloseFriendsOnly: data.isCloseFriendsOnly || false,
      userNationality: currentUser.nationality,
    };

    setPosts((prev) => [newPost, ...prev]);

    showToast(
      'تم نشر التغريدة بنجاح في مجتمع AyGram!',
      'success'
    );

    return {
      success: true,
      isPending: false,
    };
  };

  // Toggle Like Post
  const toggleLikePost = (postId: string) => {
    if (!currentUser) return;
    if (!currentUser.isActive) {
      alert('تم حظر حسابك لمخالفته المعايير. لا يمكنك التفاعل.');
      return;
    }
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const hasLiked = p.likes.includes(currentUser.id);
          const updatedLikes = hasLiked
            ? p.likes.filter((id) => id !== currentUser.id)
            : [...p.likes, currentUser.id];

          if (!hasLiked && p.userId !== currentUser.id) {
            const notif: NotificationItem = {
              id: 'notif_' + Date.now(),
              userId: p.userId,
              actorId: currentUser.id,
              actorName: currentUser.username,
              actorAvatar: currentUser.profileImage,
              type: 'like',
              text: 'أعجب بتغريدتك',
              targetId: p.id,
              isRead: false,
              createdAt: new Date().toISOString(),
            };
            setNotifications((n) => [notif, ...n]);
          }

          return { ...p, likes: updatedLikes };
        }
        return p;
      })
    );
  };

  // Toggle Retweet Post (نظام إعادة التغريد)
  const toggleRetweet = (postId: string) => {
    if (!currentUser) return;
    if (!currentUser.isActive) {
      alert('تم حظر حسابك لمخالفته المعايير. لا يمكنك التفاعل.');
      return;
    }
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const currentRetweets = p.retweets || [];
          const hasRetweeted = currentRetweets.includes(currentUser.id);
          const updatedRetweets = hasRetweeted
            ? currentRetweets.filter((id) => id !== currentUser.id)
            : [...currentRetweets, currentUser.id];

          if (!hasRetweeted && p.userId !== currentUser.id) {
            const notif: NotificationItem = {
              id: 'notif_' + Date.now(),
              userId: p.userId,
              actorId: currentUser.id,
              actorName: currentUser.username,
              actorAvatar: currentUser.profileImage,
              type: 'like',
              text: 'أعاد تغريد منشورك',
              targetId: p.id,
              isRead: false,
              createdAt: new Date().toISOString(),
            };
            setNotifications((n) => [notif, ...n]);
          }

          return { ...p, retweets: updatedRetweets };
        }
        return p;
      })
    );
  };

  // Add Comment
  const addComment = (postId: string, content: string) => {
    if (!currentUser) return { success: false, error: 'يرجى تسجيل الدخول' };
    if (!currentUser.isActive) return { success: false, error: 'تم حظر حسابك. لا يمكنك التعليق.' };
    const filter = checkContentForBlockedWords(content);
    if (!filter.isClean) {
      return {
        success: false,
        error: `التعليق يتضمن عبارة غير لائقة (${filter.forbiddenWord})`,
      };
    }

    const newComment = {
      id: 'c_' + Date.now(),
      postId,
      userId: currentUser.id,
      username: currentUser.username,
      userAvatar: currentUser.profileImage,
      content,
      isApproved: true,
      createdAt: new Date().toISOString(),
    };

    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          if (p.userId !== currentUser.id) {
            const notif: NotificationItem = {
              id: 'notif_' + Date.now(),
              userId: p.userId,
              actorId: currentUser.id,
              actorName: currentUser.username,
              actorAvatar: currentUser.profileImage,
              type: 'comment',
              text: `علق على منشورك: "${content.slice(0, 35)}..."`,
              targetId: p.id,
              isRead: false,
              createdAt: new Date().toISOString(),
            };
            setNotifications((n) => [notif, ...n]);
          }
          return { ...p, comments: [...p.comments, newComment] };
        }
        return p;
      })
    );

    return { success: true };
  };

  // Delete Comment
  const deleteComment = (postId: string, commentId: string) => {
    if (!currentUser) return;
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          return {
            ...p,
            comments: p.comments.filter((c) => c.id !== commentId),
          };
        }
        return p;
      })
    );
  };

  // Toggle Save Post
  const toggleSavePost = (postId: string) => {
    if (!currentUser) return;
    setSavedPostIds((prev) => {
      const isSaved = prev.includes(postId);
      if (isSaved) {
        showToast('تمت إزالة التغريدة من المحفوظات', 'info');
        return prev.filter((id) => id !== postId);
      } else {
        showToast('تم حفظ التغريدة في قائمتك بنجاح!', 'success');
        return [...prev, postId];
      }
    });
  };

  // Create Story
  const createStory = (data: {
    media: string;
    type: 'image' | 'video';
    caption?: string;
    isCloseFriendsOnly?: boolean;
  }) => {
    if (!currentUser) return { success: false, error: 'يرجى تسجيل الدخول' };
    if (!currentUser.isActive) return { success: false, error: 'تم حظر حسابك. لا يمكنك إضافة قصة.' };
    if (data.caption) {
      const filter = checkContentForBlockedWords(data.caption);
      if (!filter.isClean) {
        return { success: false, error: `الوصف يحتوي على كلمة محظورة (${filter.forbiddenWord})` };
      }
    }

    const newStory: Story = {
      id: 'story_' + Date.now(),
      userId: currentUser.id,
      username: currentUser.username,
      userAvatar: currentUser.profileImage,
      media: data.media,
      type: data.type,
      caption: data.caption,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      viewsCount: 0,
      seenBy: [],
      isCloseFriendsOnly: data.isCloseFriendsOnly || false,
    };

    setStories((prev) => [newStory, ...prev]);
    return { success: true };
  };

  // Create Product
  const createProduct = (data: {
    title: string;
    description: string;
    price: number;
    category: string;
    images: string[];
    stock?: number;
  }) => {
    if (!currentUser) return { success: false, error: 'يرجى تسجيل الدخول' };
    if (!currentUser.isActive) return { success: false, error: 'تم حظر حسابك. لا يمكنك إضافة منتجات.' };
    const filterTitle = checkContentForBlockedWords(data.title);
    const filterDesc = checkContentForBlockedWords(data.description);
    if (!filterTitle.isClean || !filterDesc.isClean) {
      return {
        success: false,
        error: 'بيانات المنتج تحتوي على ألفاظ مخالفة للضوابط الشرعية',
      };
    }

    const isAutoApproved = settings.autoApproveProducts;
    const newProd: Product = {
      id: 'prod_' + Date.now(),
      userId: currentUser.id,
      sellerName: currentUser.username,
      sellerAvatar: currentUser.profileImage,
      title: data.title,
      description: data.description,
      price: data.price,
      currency: currentUser.currency || 'SAR',
      images: data.images,
      category: data.category,
      isApproved: isAutoApproved,
      isBlocked: false,
      salesCount: 0,
      rating: 5.0,
      stock: data.stock,
      createdAt: new Date().toISOString(),
    };

    setProducts((prev) => [newProd, ...prev]);
    return { success: true, isPending: !isAutoApproved };
  };

  // Submit Report
  const submitReport = (data: {
    targetId: string;
    targetType: 'post' | 'product' | 'comment' | 'user';
    reason: string;
    snippet: string;
  }) => {
    const newReport: Report = {
      id: 'rep_' + Date.now(),
      reporterId: currentUser?.id || 'guest',
      reporterName: currentUser?.username || 'زائر مبارك',
      targetId: data.targetId,
      targetType: data.targetType,
      reason: data.reason,
      targetSnippet: data.snippet,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    setReports((prev) => [newReport, ...prev]);
    addAdminLog('إرسال بلاغ جديد', `تم استلام بلاغ من ${newReport.reporterName} عن ${data.targetType}`);
    return { success: true };
  };

  // Admin unlock (يدعم الباسورد jana@#5Y والدخول السريع)
  const unlockAdmin = (secretKey?: string) => {
    const trimmed = (secretKey || '').trim();
    if (trimmed && trimmed !== 'jana@#5Y' && trimmed !== ADMIN_SECRET) {
      showToast('رمز الدخول غير صحيح', 'error', 3000);
      return false;
    }
    setIsAdminUnlocked(true);
    setCurrentUser(OWNER_ACCOUNT);
    setActiveView('admin');
    setUsers((prev) => {
      const exists = prev.some((u) => u.id === OWNER_ACCOUNT_ID);
      if (!exists) return [OWNER_ACCOUNT, ...prev];
      return prev.map((u) => (u.id === OWNER_ACCOUNT_ID ? OWNER_ACCOUNT : u));
    });
    try {
      localStorage.setItem('aygram_current_user', JSON.stringify(OWNER_ACCOUNT));
      localStorage.setItem('aygram_admin_unlocked', 'true');
    } catch {}
    addAdminLog('دخول الإدارة', 'تم فتح لوحة التحكم الإدارية بالباسورد jana@#5Y');
    showToast('أهلاً بك يا أستاذ يزن السلاق! تم فتح لوحة الإدارة بنجاح 👑', 'success', 3500);
    return true;
  };

  const exitAdmin = () => {
    setIsAdminUnlocked(false);
    try {
      localStorage.removeItem('aygram_admin_unlocked');
    } catch {}
    setActiveView('home');
  };

  // Admin moderation functions
  const approvePost = (postId: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          addAdminLog('اعتماد منشور', `الموافقة على منشور المستخدم @${p.username}`);
          const notif: NotificationItem = {
            id: 'notif_' + Date.now(),
            userId: p.userId,
            actorId: 'admin',
            actorName: 'إدارة AyGram',
            actorAvatar: '',
            type: 'approval',
            text: 'تمت مراجعة منشورك واعتماده للنشر في المجتمع العام بنجاح ✨',
            targetId: postId,
            isRead: false,
            createdAt: new Date().toISOString(),
          };
          setNotifications((n) => [notif, ...n]);
          return { ...p, isApproved: true, isBlocked: false };
        }
        return p;
      })
    );
  };

  const rejectPost = (postId: string, reason: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          addAdminLog('رفض منشور', `تم رفض المنشور (${postId}) للسبب: ${reason}`);
          const notif: NotificationItem = {
            id: 'notif_' + Date.now(),
            userId: p.userId,
            actorId: 'admin',
            actorName: 'إدارة AyGram',
            actorAvatar: '',
            type: 'rejection',
            text: `تم الاعتذار عن نشر منشورك للسبب: ${reason}`,
            targetId: postId,
            isRead: false,
            createdAt: new Date().toISOString(),
          };
          setNotifications((n) => [notif, ...n]);
          return { ...p, isApproved: false, isBlocked: true, rejectionReason: reason };
        }
        return p;
      })
    );
  };

  const deletePost = (postId: string) => {
    setPosts((prev) => prev.filter((p) => p.id !== postId));
    addAdminLog('حذف منشور', `تم حذف المنشور نهائياً (${postId})`);
  };

  // تعديل منشور (يُنشئ نسخة مرة أخرى لتجاهل الغرامة المفروضة سابقاً)
  const updatePost = (postId: string, data: Partial<Post>) => {
    setPosts((prev) => prev.map((p) => {
      if (p.id !== postId) return p;
      const updated = {
        ...p,
        ...data,
        id: p.id,
        userId: p.userId,
        username: p.username,
        userAvatar: p.userAvatar,
        createdAt: p.createdAt,
        isApproved: p.isApproved !== false,
        editedAt: new Date().toISOString(),
      };
      return updated;
    }));
  };

  const deleteProduct = (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
  };

  // تعديل منتج (يزيل أي غرامة من قبل الأدمن ويصبح قيد الاعتماد من جديد)
  const updateProduct = (productId: string, data: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((prod) => {
        if (prod.id !== productId) return prod;
        addAdminLog('تعديل منتج', `تم تعديل المنتج "${prod.title}" من قبل البائع @${prod.sellerName}`);
        return { ...prod, ...data, id: prod.id, userId: prod.userId, sellerName: prod.sellerName, sellerAvatar: prod.sellerAvatar, isApproved: false, isBlocked: false, rejectionReason: '' };
      })
    );
  };

  const approveProduct = (productId: string) => {
    setProducts((prev) =>
      prev.map((prod) => {
        if (prod.id === productId) {
          addAdminLog('اعتماد منتج', `الموافقة على السلعة "${prod.title}" للبائع @${prod.sellerName}`);
          const notif: NotificationItem = {
            id: 'notif_' + Date.now(),
            userId: prod.userId,
            actorId: 'admin',
            actorName: 'إدارة AyGram',
            actorAvatar: '',
            type: 'approval',
            text: `تم اعتماد منتجك "${prod.title}" وطرحه في المتجر الإسلامي بنجاح 🛍️`,
            targetId: productId,
            isRead: false,
            createdAt: new Date().toISOString(),
          };
          setNotifications((n) => [notif, ...n]);
          return { ...prod, isApproved: true, isBlocked: false };
        }
        return prod;
      })
    );
  };

  const rejectProduct = (productId: string, reason: string) => {
    setProducts((prev) =>
      prev.map((prod) => {
        if (prod.id === productId) {
          addAdminLog('رفض منتج', `تم رفض المنتج (${prod.title}) للسبب: ${reason}`);
          const notif: NotificationItem = {
            id: 'notif_' + Date.now(),
            userId: prod.userId,
            actorId: 'admin',
            actorName: 'إدارة AyGram',
            actorAvatar: '',
            type: 'rejection',
            text: `عفواً، تعذر نشر منتجك "${prod.title}" للسبب: ${reason}`,
            targetId: productId,
            isRead: false,
            createdAt: new Date().toISOString(),
          };
          setNotifications((n) => [notif, ...n]);
          return { ...prod, isApproved: false, isBlocked: true, rejectionReason: reason };
        }
        return prod;
      })
    );
  };

  // User Banning System
  const toggleUserBan = (userId: string, reason?: string) => {
    if (userId === OWNER_ACCOUNT_ID) {
      showToast('لا يمكن حظر حساب المالك والمشرف العام @y أبداً', 'warning', 4500);
      return;
    }
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          const nextActive = !u.isActive;
          const banReason = nextActive ? undefined : (reason || 'مخالفة معايير وضوابط المنصة الشرعية');
          addAdminLog(
            nextActive ? 'إلغاء حظر مستخدم' : 'حظر مستخدم',
            `تم ${nextActive ? 'تنشيط' : 'حظر'} المستخدم @${u.username} (${u.fullName})`
          );
          return { ...u, isActive: nextActive, banReason };
        }
        return u;
      })
    );

    // If current logged-in user got banned
    if (currentUser?.id === userId) {
      setCurrentUser((prev) => (prev ? { ...prev, isActive: !prev.isActive } : null));
    }
  };

  const deleteUser = (userId: string) => {
    if (userId === OWNER_ACCOUNT_ID) {
      showToast('لا يمكن حذف حساب المالك والمشرف العام @y لأي سبب كان', 'warning', 4500);
      return;
    }
    const target = users.find((u) => u.id === userId);
    setUsers((prev) => prev.filter((u) => u.id !== userId));
    setPosts((prev) => prev.filter((p) => p.userId !== userId));
    setProducts((prev) => prev.filter((p) => p.userId !== userId));
    addAdminLog('حذف حساب مستخدم', `تم حذف حساب المستخدم @${target?.username || userId} وجميع بياناته`);
  };

  const resolveReport = (reportId: string, actionNote: string) => {
    setReports((prev) =>
      prev.map((r) => (r.id === reportId ? { ...r, status: 'resolved' } : r))
    );
    addAdminLog('معالجة بلاغ', `تم إغلاق البلاغ (${reportId}) بالإجراء: ${actionNote}`);
  };

  const dismissReport = (reportId: string) => {
    setReports((prev) =>
      prev.map((r) => (r.id === reportId ? { ...r, status: 'dismissed' } : r))
    );
    addAdminLog('تجاهل بلاغ', `تم رفض البلاغ (${reportId}) لعدم ثبوت المخالفة.`);
  };

  const addBlockedWord = (word: string) => {
    const clean = word.trim();
    if (!clean) return { success: false, error: 'يرجى إدخال الكلمة' };
    if (blockedWords.some((bw) => bw.word.toLowerCase() === clean.toLowerCase())) {
      return { success: false, error: 'الكلمة موجودة بالفعل في قائمة الحظر' };
    }
    const newBw: BlockedWord = {
      id: 'bw_' + Date.now(),
      word: clean,
      createdAt: new Date().toISOString(),
    };
    setBlockedWords((prev) => [newBw, ...prev]);
    addAdminLog('إضافة كلمة ممنوعة', `تمت إضافة "${clean}" إلى قائمة الفلترة الإسلامية`);
    return { success: true };
  };

  const removeBlockedWord = (wordId: string) => {
    const item = blockedWords.find((bw) => bw.id === wordId);
    setBlockedWords((prev) => prev.filter((bw) => bw.id !== wordId));
    if (item) {
      addAdminLog('حذف كلمة ممنوعة', `تم حذف "${item.word}" من قائمة الكلمات المحظورة`);
    }
  };

  const updateSettings = (newSettings: Partial<PlatformSettings>) => {
    setSettings((prev) => {
      const merged = { ...prev, ...newSettings };
      addAdminLog('تحديث إعدادات المنصة', 'تم تعديل سياسات المنصة وإعداداتها.');
      return merged;
    });
  };

  // Maintenance mode toggle
  const toggleMaintenanceMode = (enabled: boolean, message?: string) => {
    setSettings((prev) => ({
      ...prev,
      maintenanceMode: enabled,
      maintenanceMessage: message || prev.maintenanceMessage,
    }));
    addAdminLog(
      enabled ? 'تفعيل وضع صيانة الموقع' : 'إيقاف وضع الصيانة',
      enabled ? `تم تفعيل وضع الصيانة العام: ${message || ''}` : 'تم استئناف عمل الموقع لجميع الزوار'
    );
  };

  // Account Verification System
  const toggleUserVerification = (userId: string) => {
    if (userId === OWNER_ACCOUNT_ID) {
      showToast('شارة التوثيق الذهبية للمالك دائمة ولا يمكن سحبها', 'warning', 4500);
      return;
    }
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          const nextVerified = !u.verified;
          const isAdminAccount = u.role === 'admin';
          addAdminLog(
            nextVerified ? 'توثيق حساب' : 'إلغاء توثيق حساب',
            `تم ${nextVerified ? 'منح شارة التوثيق لـ' : 'سحب شارة التوثيق من'} @${u.username}`
          );
          // Send notification
          const notif: NotificationItem = {
            id: 'notif_' + Date.now(),
            userId: u.id,
            actorId: 'admin',
            actorName: 'إدارة AyGram',
            actorAvatar: '',
            type: 'verification',
            title: nextVerified ? 'تهانينا! تم توثيق حسابك رسمياً 🛡️✨' : 'تنبيه بشأن توثيق الحساب',
            text: nextVerified
              ? 'تم التحقق من حسابك ومنحه شارة التوثيق المعتمدة لتعزيز المصداقية والأمانة في المنصة.'
              : 'تمت إزالة علامة التوثيق من حسابك بواسطة المشرف.',
            isRead: false,
            createdAt: new Date().toISOString(),
            importance: 'urgent',
          };
          setNotifications((n) => [notif, ...n]);
          return {
            ...u,
            verified: nextVerified,
            verificationBadge: nextVerified ? (isAdminAccount ? 'gold' : 'blue') : 'none',
            subscriptionPlan: nextVerified && !isAdminAccount ? 'blue_yearly' : u.subscriptionPlan,
          };
        }
        return u;
      })
    );

    if (currentUser?.id === userId) {
      setCurrentUser((prev) =>
        prev
          ? {
              ...prev,
              verified: !prev.verified,
              verificationBadge: !prev.verified ? (prev.role === 'admin' ? 'gold' : 'blue') : 'none',
              subscriptionPlan: !prev.verified && prev.role !== 'admin' ? 'blue_yearly' : prev.subscriptionPlan,
            }
          : null
      );
    }
  };

  const submitVerificationRequest = (data: { category: string; reason: string }) => {
    if (!currentUser) return { success: false, error: 'يرجى تسجيل الدخول' };
    return {
      success: false,
      error:
        'نظام التوثيق الرسمي يتطلب إثبات الهوية والمرجعية ورسوماً سنوية، وسيُفتح في مرحلة لاحقة. حالياً لا يمكن تقديم طلب توثيق.',
    };
  };

  const reviewVerificationRequest = (requestId: string, status: 'approved' | 'rejected') => {
    const req = verificationRequests.find((r) => r.id === requestId);
    if (!req) return;

    setVerificationRequests((prev) =>
      prev.map((r) => (r.id === requestId ? { ...r, status } : r))
    );

    if (status === 'approved') {
      toggleUserVerification(req.userId);
    } else {
      const notif: NotificationItem = {
        id: 'notif_' + Date.now(),
        userId: req.userId,
        actorId: 'admin',
        actorName: 'إدارة AyGram',
        actorAvatar: '',
        type: 'verification',
        title: 'بخصوص طلب التوثيق',
        text: 'نعتذر عن عدم استيفاء شروط التوثيق حالياً. نرحب بتقديمك مجدداً بعد زيادة التفاعل والنشاط في المنصة.',
        isRead: false,
        createdAt: new Date().toISOString(),
      };
      setNotifications((n) => [notif, ...n]);
    }
  };

  // Admin Broadcast / Push Notification to users
  const sendAdminBroadcast = (data: {
    title: string;
    text: string;
    targetUserId?: string;
    importance?: 'normal' | 'urgent' | 'guidance';
  }) => {
    const recipients = data.targetUserId && data.targetUserId !== 'all'
      ? [data.targetUserId]
      : users.map((u) => u.id);

    const newNotifs: NotificationItem[] = recipients.map((uid) => ({
      id: 'admin_broad_' + uid + '_' + Date.now(),
      userId: uid,
      actorId: 'admin',
      actorName: 'الإشراف العام لمجتمع AyGram 🛡️',
      actorAvatar: '',
      type: 'admin_broadcast',
      title: data.title,
      text: data.text,
      isRead: false,
      createdAt: new Date().toISOString(),
      importance: data.importance || 'normal',
    }));

    setNotifications((prev) => [...newNotifs, ...prev]);
    addAdminLog(
      'إرسال إشعار إداري',
      `تم إرسال تعميم إداري "${data.title}" إلى ${recipients.length} مستخدمين`
    );
  };

  // Direct Messaging / Private Chat
  const sendMessage = (receiverId: string, content: string, sharedPostId?: string, audio?: string, audioName?: string) => {
    if (!currentUser) return { success: false, error: 'يرجى تسجيل الدخول أولاً' };
    if (!currentUser.isActive) return { success: false, error: 'تم حظر حسابك. لا يمكنك إرسال رسائل خاصة.' };
    const hasAudio = Boolean(audio);
    const hasText = Boolean(content.trim());
    if (!hasText && !hasAudio) return { success: false, error: 'لا يمكن إرسال رسالة فارغة' };

    const filter = checkContentForBlockedWords(content);
    if (!filter.isClean) {
      return { success: false, error: `تحتوي الرسالة على لفظ غير لائق (${filter.forbiddenWord})` };
    }

    // Find or create conversation
    let conv = conversations.find(
      (c) =>
        c.participantIds.includes(currentUser.id) &&
        c.participantIds.includes(receiverId)
    );

    const convId = conv ? conv.id : 'conv_' + Date.now();
    const displayText = hasAudio && !hasText ? '🎤 رسالة صوتية' : content;

    const newMsg: DirectMessage = {
      id: 'msg_' + Date.now(),
      conversationId: convId,
      senderId: currentUser.id,
      senderName: currentUser.username,
      senderAvatar: currentUser.profileImage,
      receiverId,
      content: displayText,
      audio: audio || undefined,
      audioName: audioName || undefined,
      createdAt: new Date().toISOString(),
      isRead: false,
      sharedPostId,
    };

    setMessages((prev) => [...prev, newMsg]);

    const recipientUser = users.find((u) => u.id === receiverId);
    const isMutual =
      recipientUser?.followers?.includes(currentUser.id) ||
      recipientUser?.following?.includes(currentUser.id) ||
      recipientUser?.role === 'owner' ||
      currentUser.role === 'owner' ||
      conv?.requestAccepted === true;
    const isRequest = !isMutual;

    if (conv) {
      setConversations((prev) =>
        prev.map((c) =>
          c.id === convId
            ? {
                ...c,
                lastMessageText: displayText,
                lastMessageTime: new Date().toISOString(),
                unreadCount: c.unreadCount + 1,
              }
            : c
        )
      );
    } else {
      const newConv: ChatConversation = {
        id: convId,
        participantIds: [currentUser.id, receiverId],
        lastMessageText: displayText,
        lastMessageTime: new Date().toISOString(),
        unreadCount: 1,
        isRequest,
        requestedBy: currentUser.id,
        requestAccepted: !isRequest,
      };
      setConversations((prev) => [newConv, ...prev]);
    }

    // Realistic automated responsive communication from other users
    if (recipientUser && recipientUser.id !== currentUser.id) {
      // مؤشر "يكتب..." للطرف الآخر قبل الرد (بتأخير خفيف وموارد قليلة)
      setTypingInConversationId(convId);
      try {
        localStorage.setItem('aygram_typing', JSON.stringify(convId));
      } catch (e) {
        console.error(e);
      }
      setTimeout(() => {
        let replyText = 'وعليكم السلام ورحمة الله وبركاته! أهلاً وسهلاً بك، سررت بتواصلك الطيب في مجتمع AyGram 🌿';
        const unLower = recipientUser.username.toLowerCase();
        if (unLower.includes('yazan')) {
          replyText = 'أهلاً وسهلاً بك أخي الكريم! سررت جداً بتواصلك. رسالتك وصلتني وسأتابع معك بأقرب وقت إن شاء الله. حياك الله دائماً في AyGram 🌿';
        } else if (unLower.includes('sarah') || recipientUser.bio.includes('تصميم')) {
          replyText = 'مرحباً بك! شكراً جزيلاً لرسالتك واهتمامك. يسعدني دائماً تبادل الأفكار والإبداع معكم 🎨✨';
        } else if (unLower.includes('omar') || recipientUser.bio.includes('خط')) {
          replyText = 'وعليكم السلام والرحمة والإكرام! بوركت أخي الحبيب وشكراً لتواصلك الكريم 🖋️';
        } else if (content.includes('سلام') || content.includes('السلام')) {
          replyText = 'وعليكم السلام ورحمة الله وبركاته ومغفرته! كيف حالك اليوم؟ نورت محادثتي 🤍';
        } else if (content.includes('سعر') || content.includes('شراء') || content.includes('متجر')) {
          replyText = 'أهلاً بك! المنتج متوفر ومتاح للشحن الفوري. يمكنك إتمام الطلب مباشرة وسأقوم بتجهيزه لك بكل سرور 🛍️';
        }

        const autoReplyMsg: DirectMessage = {
          id: 'msg_reply_' + Date.now(),
          conversationId: convId,
          senderId: recipientUser.id,
          senderName: recipientUser.username,
          senderAvatar: recipientUser.profileImage,
          receiverId: currentUser.id,
          content: replyText,
          createdAt: new Date().toISOString(),
          isRead: false,
        };

        setMessages((prev) => [...prev, autoReplyMsg]);
        setConversations((prev) =>
          prev.map((c) =>
            c.id === convId
              ? {
                  ...c,
                  lastMessageText: replyText,
                  lastMessageTime: new Date().toISOString(),
                  unreadCount: c.unreadCount + 1,
                }
              : c
          )
        );
        // إشارة قراءة: الطرف الآخر "قرأ" رسائلي بعد رده
        setMessages((prev) =>
          prev.map((m) =>
            m.conversationId === convId && m.senderId === currentUser.id ? { ...m, isRead: true } : m
          )
        );
        setTypingInConversationId(null);
        try {
          localStorage.setItem('aygram_typing', 'null');
        } catch (e) {
          console.error(e);
        }
      }, 1500);
    }

    return { success: true };
  };

  const markConversationAsRead = (convId: string) => {
    setConversations((prev) =>
      prev.map((c) => (c.id === convId ? { ...c, unreadCount: 0 } : c))
    );
    if (currentUser) {
      setMessages((prev) =>
        prev.map((m) =>
          m.conversationId === convId &&
          (m.receiverId === currentUser.id || !(m.senderId === currentUser.id))
            ? { ...m, isRead: true }
            : m
        )
      );
    }
  };

  // حذف رسالة واحدة نهائياً
  const deleteMessage = (messageId: string) => {
    setMessages((prev) => prev.filter((m) => m.id !== messageId));
  };

  // حذف / مسح المحادثة كاملة
  const deleteConversation = (convId: string) => {
    setConversations((prev) => prev.filter((c) => c.id !== convId));
    setMessages((prev) => prev.filter((m) => m.conversationId !== convId));
    if (activeConversationUserId) setActiveConversationUserId(null);
  };

  // قبول طلب مراسلة
  const acceptMessageRequest = (convId: string) => {
    setConversations((prev) =>
      prev.map((c) =>
        c.id === convId ? { ...c, isRequest: false, requestAccepted: true } : c
      )
    );
    showToast('تم قبول طلب المراسلة بنجاح! يمكنكما الآن التواصل بحرية 🌿', 'success', 4000);
  };

  // رفض أو حذف طلب مراسلة
  const rejectMessageRequest = (convId: string) => {
    setConversations((prev) => prev.filter((c) => c.id !== convId));
    setMessages((prev) => prev.filter((m) => m.conversationId !== convId));
    if (activeConversationUserId) setActiveConversationUserId(null);
    showToast('تم حذف طلب المراسلة بنجاح', 'info', 3000);
  };

  const openDirectChatWithUser = (targetUserId: string) => {
    setActiveConversationUserId(targetUserId);
    setActiveView('messages');
  };

  // ===== Group Chats (max 25 members) =====
  const createGroupConversation = (memberIds: string[], groupName: string) => {
    if (!currentUser) return { success: false, error: 'يرجى تسجيل الدخول أولاً' };
    if (!groupName.trim()) return { success: false, error: 'يرجى إدخال اسم للمجموعة' };
    const uniqueMembers = [...new Set([currentUser.id, ...memberIds])];
    if (uniqueMembers.length < 2) return { success: false, error: 'يرجى اختيار عضو واحد على الأقل بالإضافة إليك' };
    if (uniqueMembers.length > 25) return { success: false, error: 'الحد الأقصى لأعضاء المجموعة هو 25 شخصاً' };

    const colorSet = ['#D4AF37', '#7C3AED', '#16A34A', '#EA580C', '#0EA5E9', '#DC2626', '#DB2777', '#65A30D'];
    const convId = 'group_' + Date.now();
    const newConv: ChatConversation = {
      id: convId,
      participantIds: uniqueMembers,
      lastMessageText: `تم إنشاء المجموعة «${groupName.trim()}»`,
      lastMessageTime: new Date().toISOString(),
      unreadCount: 0,
      isGroup: true,
      groupName: groupName.trim(),
      groupMemberColors: uniqueMembers.map((_, i) => colorSet[i % colorSet.length]),
      adminIds: [currentUser.id],
      maxMembers: 25,
    };
    setConversations((prev) => [newConv, ...prev]);
    // Welcome message
    const welcome: DirectMessage = {
      id: 'msg_grp_' + Date.now(),
      conversationId: convId,
      senderId: currentUser.id,
      senderName: currentUser.username,
      senderAvatar: currentUser.profileImage,
      receiverId: convId,
      content: `قام @${currentUser.username} بإنشاء المجموعة «${groupName.trim()}». أعضاء المجموعة الآن: ${uniqueMembers.length} من أصل 25.`,
      createdAt: new Date().toISOString(),
      isRead: false,
    };
    setMessages((prev) => [...prev, welcome]);
    addAdminLog('إنشاء مجموعة جماعية', `أنشأ @${currentUser.username} مجموعة «${groupName.trim()}» بـ ${uniqueMembers.length} أعضاء`);
    return { success: true, conversationId: convId };
  };

  const addGroupMember = (conversationId: string, userId: string) => {
    const conv = conversations.find((c) => c.id === conversationId);
    if (!conv || !conv.isGroup) return { success: false, error: 'هذه المحادثة ليست مجموعة' };
    if (!currentUser || !conv.adminIds?.includes(currentUser.id)) {
      return { success: false, error: 'المشرف (المنشئ) وحده يمكنه إضافة أعضاء' };
    }
    if (conv.participantIds.includes(userId)) return { success: false, error: 'العضو موجود بالفعل في المجموعة' };
    if (conv.participantIds.length >= (conv.maxMembers || 25)) {
      return { success: false, error: 'وصلت المجموعة للحد الأقصى 25 شخصاً ولا يمكن إضافة المزيد' };
    }
    setConversations((prev) =>
      prev.map((c) => (c.id === conversationId ? { ...c, participantIds: [...c.participantIds, userId] } : c))
    );
    const member = users.find((u) => u.id === userId);
    const grpMsg: DirectMessage = {
      id: 'msg_grp_' + Date.now(),
      conversationId,
      senderId: currentUser.id,
      senderName: currentUser.username,
      senderAvatar: currentUser.profileImage,
      receiverId: conversationId,
      content: `تمت إضافة العضو @${member?.username || userId} إلى المجموعة بواسطة @${currentUser.username}`,
      createdAt: new Date().toISOString(),
      isRead: false,
    };
    setMessages((prev) => [...prev, grpMsg]);
    setConversations((prev) =>
      prev.map((c) =>
        c.id === conversationId
          ? { ...c, lastMessageText: grpMsg.content, lastMessageTime: new Date().toISOString() }
          : c
      )
    );
    return { success: true };
  };

  const sendGroupMessage = (conversationId: string, content: string, audio?: string, audioName?: string) => {
    if (!currentUser) return { success: false, error: 'يرجى تسجيل الدخول أولاً' };
    if (!currentUser.isActive) return { success: false, error: 'تم حظر حسابك. لا يمكنك إرسال رسائل.' };
    const conv = conversations.find((c) => c.id === conversationId);
    if (!conv || !conv.isGroup) return { success: false, error: 'المحادثة الجماعية غير موجودة' };
    if (!conv.participantIds.includes(currentUser.id)) return { success: false, error: 'لست عضواً في هذه المجموعة' };
    const hasAudio = Boolean(audio);
    const hasText = Boolean(content.trim());
    if (!hasText && !hasAudio) return { success: false, error: 'لا يمكن إرسال رسالة فارغة' };
    const filter = checkContentForBlockedWords(content);
    if (!filter.isClean) {
      return { success: false, error: `تحتوي الرسالة على لفظ غير لائق (${filter.forbiddenWord})` };
    }
    const displayText = hasAudio && !hasText ? '🎤 رسالة صوتية' : content;
    const newMsg: DirectMessage = {
      id: 'msg_grp_' + Date.now(),
      conversationId,
      senderId: currentUser.id,
      senderName: currentUser.username,
      senderAvatar: currentUser.profileImage,
      receiverId: conversationId,
      content: displayText,
      audio: audio || undefined,
      audioName: audioName || undefined,
      createdAt: new Date().toISOString(),
      isRead: false,
    };
    setMessages((prev) => [...prev, newMsg]);
    setConversations((prev) =>
      prev.map((c) =>
        c.id === conversationId
          ? {
              ...c,
              lastMessageText: displayText,
              lastMessageTime: new Date().toISOString(),
              unreadCount: c.unreadCount + 1,
            }
          : c
      )
    );
    return { success: true };
  };

  // ===== Channels (نص / صورة / صوت فقط — لا فيديوهات حالياً) =====
  const createChannel = (name: string, description: string) => {
    if (!currentUser) return { success: false, error: 'يرجى تسجيل الدخول أولاً' };
    if (!name.trim()) return { success: false, error: 'يرجى إدخال اسم القناة' };
    const channel: Channel = {
      id: 'ch_' + Date.now(),
      ownerId: currentUser.id,
      ownerUsername: currentUser.username,
      ownerAvatar: currentUser.profileImage,
      name: name.trim(),
      description: description.trim() || undefined,
      memberIds: [currentUser.id],
      createdAt: new Date().toISOString(),
    };
    setChannels((prev) => [channel, ...prev]);
    addAdminLog('إنشاء قناة خاصة', `قام @${currentUser.username} بإنشاء قناة «${channel.name}»`);
    return { success: true, channelId: channel.id };
  };

  const deleteChannel = (channelId: string) => {
    const ch = channels.find((c) => c.id === channelId);
    if (!ch) return;
    if (!currentUser || ch.ownerId !== currentUser.id) {
      showToast('مالك القناة وحده يمكنه حذفها', 'warning');
      return;
    }
    setChannels((prev) => prev.filter((c) => c.id !== channelId));
    setChannelPosts((prev) => prev.filter((cp) => cp.channelId !== channelId));
    addAdminLog('حذف قناة', `حذف @${currentUser.username} قناته «${ch.name}» وجميع منشوراتها`);
  };

  const postToChannel = (channelId: string, data: { text?: string; image?: string; audio?: string; audioName?: string }) => {
    if (!currentUser) return { success: false, error: 'يرجى تسجيل الدخول أولاً' };
    const ch = channels.find((c) => c.id === channelId);
    if (!ch) return { success: false, error: 'القناة غير موجودة' };
    if (!ch.memberIds.includes(currentUser.id)) return { success: false, error: 'لست عضواً في هذه القناة' };
    const hasMedia = Boolean(data.text?.trim() || data.image || data.audio);
    if (!hasMedia) return { success: false, error: 'يرجى كتابة نص أو إرفاق صورة أو صوت' };
    if (data.text) {
      const filter = checkContentForBlockedWords(data.text);
      if (!filter.isClean) return { success: false, error: `يحتوي النص على لفظ غير لائق (${filter.forbiddenWord})` };
    }
    const post: ChannelPost = {
      id: 'chp_' + Date.now(),
      channelId,
      authorId: currentUser.id,
      authorName: currentUser.username,
      authorAvatar: currentUser.profileImage,
      text: data.text?.trim() || undefined,
      image: data.image || undefined,
      audio: data.audio || undefined,
      audioName: data.audioName || undefined,
      createdAt: new Date().toISOString(),
    };
    setChannelPosts((prev) => [post, ...prev]);
    // Goes live instantly — no admin approval needed for channel content.
    return { success: true };
  };

  // تعديل منشور داخل قناة (يملكه صاحبه فقط)
  const updateChannelPost = (postId: string, data: { text?: string; image?: string }) => {
    if (!currentUser) return;
    setChannelPosts((prev) =>
      prev.map((cp) => {
        if (cp.id !== postId) return cp;
        if (cp.authorId !== currentUser.id) {
          showToast('صاحب المنشور وحده يمكنه تعديله في القناة', 'warning');
          return cp;
        }
        return { ...cp, ...data, editedAt: new Date().toISOString() };
      })
    );
  };

  // حذف منشور داخل قناة (صاحبه أو مالك القناة)
  const deleteChannelPost = (postId: string) => {
    if (!currentUser) return;
    const post = channelPosts.find((cp) => cp.id === postId);
    if (!post) return;
    const ch = channels.find((c) => c.id === post.channelId);
    const isOwner = ch?.ownerId === currentUser.id;
    if (post.authorId !== currentUser.id && !isOwner) {
      showToast('لا تملك صلاحية حذف هذا المنشور في القناة', 'warning');
      return;
    }
    setChannelPosts((prev) => prev.filter((cp) => cp.id !== postId));
    if (isOwner) addAdminLog('حذف منشور قناة', `حذف منشور من قناة «${ch?.name}»`);
  };

  // ===== Store Promo Codes =====
  const validatePromoCode = (code: string) => {
    const clean = code.trim().toUpperCase();
    const match = promoCodes.find((p) => p.code === clean && p.isActive);
    if (!match) return { success: false, error: 'كود الخصم غير صالح أو انتهت صلاحيته' };
    return { success: true, discountPercent: match.discountPercent, description: match.description };
  };

  // ===== إتمام الطلب من المتجر =====
  const placeOrder = (data: {
    items: OrderItem[];
    subtotal: number;
    shipping: number;
    tax: number;
    discount: number;
    total: number;
    currency: string;
    promoCode?: string;
  }): Order | null => {
    if (!currentUser) return null;
    const order: Order = {
      id: 'ord_' + Date.now(),
      orderNumber: 'ORD-' + Date.now().toString().slice(-7),
      buyerId: currentUser.id,
      buyerName: currentUser.fullName,
      items: data.items,
      subtotal: data.subtotal,
      shipping: data.shipping,
      tax: data.tax,
      discount: data.discount,
      total: data.total,
      currency: data.currency,
      promoCode: data.promoCode,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    setOrders((prev) => [order, ...prev]);
    // إنقاص الكمية + رفع عدد المبيعات لكل منتج مطلوب
    setProducts((prev) =>
      prev.map((prod) => {
        const line = data.items.find((i) => i.productId === prod.id);
        if (!line) return prod;
        const sold = Math.min(line.qty, prod.stock ?? line.qty);
        return {
          ...prod,
          salesCount: prod.salesCount + line.qty,
          stock: prod.stock === undefined ? undefined : Math.max(0, prod.stock - sold),
        };
      })
    );
    return order;
  };

  // تحديث / إضافة / حذف هايلايت (إبراز) للملف الشخصي — يتم حفظها دائمياً في المنصة
  const saveHighlight = (id: string | null, data: Partial<ProfileHighlight>) => {
    if (id) {
      setHighlights((prev) => prev.map((h) => (h.id === id ? { ...h, ...data } : h)));
    } else {
      const next: ProfileHighlight = {
        id: 'hl_' + Date.now(),
        userId: currentUser?.id || '',
        title: data.title || 'إبراز جديد',
        coverImage: data.coverImage || '',
        items: data.items || [],
        createdAt: new Date().toISOString(),
      };
      setHighlights((prev) => [next, ...prev]);
    }
  };

  const deleteHighlight = (id: string) => {
    setHighlights((prev) => prev.filter((h) => h.id !== id));
  };

  // ===== Account Closure (aygram.user + 30-day permanent deletion) =====
  const closeAccount = (userId: string, reason: string) => {
    const target = users.find((u) => u.id === userId);
    if (!target) return;
    if (userId === OWNER_ACCOUNT_ID) {
      showToast('لا يمكن إغلاق حساب المالك والمشرف العام @y أبداً', 'warning', 4500);
      return;
    }
    const closedAt = new Date().toISOString();
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, isClosed: true, isActive: false, closureReason: reason, closedAt } : u))
    );
    setPosts((prev) => prev.map((p) => (p.userId === userId ? { ...p, isBlocked: true } : p)));
    setProducts((prev) => prev.map((p) => (p.userId === userId ? { ...p, isBlocked: true, isApproved: false } : p)));
    addAdminLog('إغلاق حساب نهائي', `تم إغلاق حساب @${target.username} (${target.fullName}) — السبب: ${reason}. سيُحذف نهائياً بعد 30 يوماً.`);

    // Notify the platform
    const notif: NotificationItem = {
      id: 'notif_' + Date.now(),
      userId: userId,
      actorId: 'admin',
      actorName: 'إدارة AyGram',
      actorAvatar: '',
      type: 'closure',
      title: 'إغلاق الحساب من قبل الإدارة',
      text: `عزيزنا المستخدم، تم إغلاق حسابك من قبل إدارة المنصة. السبب: ${reason}. سيتم حذف الحساب نهائياً بعد 30 يوماً ولا يمكن استعادته أبداً.`,
      isRead: false,
      createdAt: closedAt,
      importance: 'urgent',
    };
    setNotifications((n) => [notif, ...n]);

    // If the closed user is currently logged in → force logout so the closure screen shows next login.
    if (currentUser?.id === userId) {
      setCurrentUser(null);
      localStorage.removeItem('aygram_current_user');
      if (typeof document !== 'undefined') {
        document.cookie = 'aygram_session_user=; path=/; max-age=0; SameSite=Lax';
      }
      showToast('تم إغلاق حسابك من قبل الإدارة. سيُحذف نهائياً بعد 30 يوماً.', 'error', 6000);
    } else {
      showToast(`تم إغلاق حساب @${target.username} وإخفاء محتواه من المنصة`, 'warning', 4500);
    }
  };

  const resetClosedAccountAttempt = () => setClosedAccountAttempt(null);

  const viewUserProfile = (user: User | string) => {
    if (typeof user === 'string') {
      const found = users.find((u) => u.id === user || u.username === user);
      if (found) {
        setSelectedUserProfile(found);
        setActiveView('profile');
      }
    } else {
      setSelectedUserProfile(user);
      setActiveView('profile');
    }
  };

  // ===== نظام الدعم الفني وتذاكر المساعدة =====
  const createSupportTicket = useCallback(
    (data: {
      subject: string;
      category: SupportCategory;
      priority: SupportPriority;
      message: string;
      contactInfo?: string;
    }): { success: boolean; ticket?: SupportTicket; error?: string } => {
      if (!data.subject.trim()) {
        return { success: false, error: 'يرجى كتابة عنوان للتذكرة' };
      }
      if (!data.message.trim()) {
        return { success: false, error: 'يرجى كتابة تفاصيل المشكلة أو الاستفسار' };
      }

      const ticketNumber = `AY-${Math.floor(1000 + Math.random() * 9000)}`;
      const newTicket: SupportTicket = {
        id: `ticket_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        ticketNumber,
        userId: currentUser ? currentUser.id : `guest_${Date.now()}`,
        userName: currentUser ? currentUser.fullName : (data.contactInfo || 'زائر المنصة'),
        userAvatar: currentUser?.profileImage,
        userEmailOrPhone: data.contactInfo || currentUser?.email || currentUser?.phone,
        subject: data.subject.trim(),
        category: data.category,
        priority: data.priority,
        status: 'open',
        messages: [
          {
            id: `msg_${Date.now()}`,
            senderId: currentUser ? currentUser.id : 'guest',
            senderName: currentUser ? currentUser.fullName : 'المرسل',
            senderRole: 'user',
            content: data.message.trim(),
            createdAt: new Date().toISOString(),
          },
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setSupportTickets((prev) => [newTicket, ...prev]);
      showToast(`تم فتح تذكرة الدعم الفني بنجاح (#${ticketNumber})`, 'success');
      return { success: true, ticket: newTicket };
    },
    [currentUser, showToast]
  );

  const replyToSupportTicket = useCallback(
    (ticketId: string, message: string, attachment?: string): { success: boolean; error?: string } => {
      if (!message.trim()) {
        return { success: false, error: 'يرجى كتابة نص الرد' };
      }

      const isSupportStaff = isAdminUnlocked || currentUser?.role === 'admin';
      const senderRole: 'user' | 'support' | 'admin' = isSupportStaff ? 'support' : 'user';
      const senderName = isSupportStaff ? 'فريق الدعم الفني - AyGram' : (currentUser?.fullName || 'المستخدم');
      const senderId = currentUser ? currentUser.id : 'support_system';

      let targetTicketUserId: string | null = null;
      let ticketSubject = '';

      setSupportTickets((prev) =>
        prev.map((t) => {
          if (t.id === ticketId) {
            targetTicketUserId = t.userId;
            ticketSubject = t.subject;
            const newMsg: SupportMessage = {
              id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
              senderId,
              senderName,
              senderRole,
              content: message.trim(),
              attachment,
              createdAt: new Date().toISOString(),
            };
            return {
              ...t,
              status: isSupportStaff ? 'waiting_user' : 'in_progress',
              updatedAt: new Date().toISOString(),
              messages: [...t.messages, newMsg],
            };
          }
          return t;
        })
      );

      // If support staff replied, notify the user!
      if (isSupportStaff && targetTicketUserId && targetTicketUserId !== currentUser?.id) {
        const notif: NotificationItem = {
          id: `notif_sup_${Date.now()}`,
          userId: targetTicketUserId,
          actorId: 'support_admin',
          actorName: 'فريق الدعم الفني - AyGram',
          actorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
          type: 'mention',
          text: `قام فريق الدعم بالرد على تذكرتك: "${ticketSubject}"`,
          isRead: false,
          createdAt: new Date().toISOString(),
        };
        setNotifications((prev) => [notif, ...prev]);
      }

      showToast('تم إرسال الرد بنجاح', 'success');
      return { success: true };
    },
    [isAdminUnlocked, currentUser, showToast]
  );

  const updateSupportTicketStatus = useCallback(
    (ticketId: string, status: SupportStatus) => {
      setSupportTickets((prev) =>
        prev.map((t) => (t.id === ticketId ? { ...t, status, updatedAt: new Date().toISOString() } : t))
      );
      showToast('تم تحديث حالة التذكرة بنجاح', 'info');
    },
    [showToast]
  );

  const deleteSupportTicket = useCallback(
    (ticketId: string) => {
      setSupportTickets((prev) => prev.filter((t) => t.id !== ticketId));
      showToast('تم حذف تذكرة الدعم', 'info');
    },
    [showToast]
  );

  return (
    <AyGramContext.Provider
      value={{
        currentUser,
        users,
        posts,
        stories,
        products,
        blockedWords,
        reports,
        adminLogs,
        notifications,
        setNotifications,
        conversations,
        messages,
        verificationRequests,
        usernameReservations,
        setUsernameReservations,
        activeConversationUserId,
        setActiveConversationUserId,
        activeView,
        setActiveView,
        selectedUserProfile,
        viewUserProfile,
        activeStoryIndex,
        setActiveStoryIndex,
        isAdminUnlocked,
        searchQuery,
        setSearchQuery,
        settings,
        login,
        signup,
        rememberSession,
        setRememberSession,
        requiresAdminApproval,
        approveUserAccount,
        logout,
        resetPassword,
        updateProfile,
        reserveUsername,
        approveUsernameReservation,
        updateFullProfile,
        toggleCloseFriend,
        toggleHideStoryFromUser,
        toggleBlockUser,
        toggleRestrictUser,
        toggleMuteUser,
        updateVerificationBadge,
        toggleFollow,
        checkContentForBlockedWords,
        createPost,
        toggleLikePost,
        toggleRetweet,
        addComment,
        deleteComment,
        toggleSavePost,
        savedPostIds,
        createStory,
        createProduct,
        submitReport,
        unlockAdmin,
        exitAdmin,
        approvePost,
        rejectPost,
        deletePost,
        updatePost,
        approveProduct,
        rejectProduct,
        deleteProduct,
        updateProduct,
        toggleUserBan,
        deleteUser,
        resolveReport,
        dismissReport,
        addBlockedWord,
        removeBlockedWord,
        updateSettings,
        toggleMaintenanceMode,
        toggleUserVerification,
        submitVerificationRequest,
        reviewVerificationRequest,
        sendAdminBroadcast,
        sendMessage,
        deleteMessage,
        deleteConversation,
        acceptMessageRequest,
        rejectMessageRequest,
        typingInConversationId,
        isUserOnline,
        markConversationAsRead,
        openDirectChatWithUser,
        createGroupConversation,
        addGroupMember,
        sendGroupMessage,
        channels,
        channelPosts,
        createChannel,
        deleteChannel,
        postToChannel,
        updateChannelPost,
        deleteChannelPost,
        promoCodes,
        validatePromoCode,
        orders,
        placeOrder,
        highlights,
        saveHighlight,
        deleteHighlight,
        closeAccount,
        closedAccountAttempt,
        resetClosedAccountAttempt,
        toasts,
        showToast,
        dismissToast,
        startUploadToast,
        updateUploadProgress,
        completeUploadToast,
        failUploadToast,
        triggerPublishWithProgress,
        supportTickets,
        createSupportTicket,
        replyToSupportTicket,
        updateSupportTicketStatus,
        deleteSupportTicket,
        deactivateAccount,
      }}
    >
      {children}
    </AyGramContext.Provider>
  );
};

export const useAyGram = () => {
  const context = useContext(AyGramContext);
  if (!context) {
    throw new Error('useAyGram must be used within an AyGramProvider');
  }
  return context;
};
