export type AccountType = 'personal' | 'business' | 'creator';
export type VerificationBadgeType = 'none' | 'blue' | 'gold';
export type BirthDatePrivacy = 'public' | 'close_friends' | 'private';
export type Gender = 'male' | 'female' | 'unspecified';

export interface ProfileLink {
  id: string;
  title: string;
  url: string;
}

export interface SocialLinks {
  whatsapp?: string;
  linkedin?: string;
  x?: string;
  github?: string;
}

export interface User {
  id: string;
  fullName: string;
  username: string;
  phone?: string;
  email?: string;
  password?: string;
  nationality?: string; // الجنسية
  language?: string; // لغة الحساب
  currency?: string; // العملة المفضلة (SAR, ILS, AED, USD, etc.)
  profileImage: string;
  profileColor?: string; // لون ثيم الملف الشخصي المختار من صندوق الألوان
  bio: string; // بحد أقصى 150 حرف
  accountType?: AccountType; // شخصي | أعمال | صانع محتوى
  isAdmin: boolean;
  role?: string;
  isActive: boolean; // false means account is banned
  banReason?: string;
  followers: string[]; // user IDs
  following: string[]; // user IDs
  createdAt: string;
  verified?: boolean; // علامة التوثيق المعتمدة
  verificationBadge?: VerificationBadgeType; // 'none' | 'blue' | 'gold'
  verificationRequested?: boolean;
  verificationDetails?: string;
  birthDate?: string; // تاريخ الميلاد
  birthDatePrivacy?: BirthDatePrivacy; // إظهار للجميع | للأصدقاء المقربين فقط | إخفاء
  location?: string; // الموقع الجغرافي
  links?: ProfileLink[]; // حتى 6 روابط خارجية
  socialLinks?: SocialLinks; // واتساب، لينكد إن، X، جيت هاب
  closeFriends?: string[]; // قائمة الأصدقاء المقربين
  hiddenStoryUserIds?: string[]; // مستخدمون مخفي عنهم الستوري
  blockedUserIds?: string[]; // مستخدمون محظورون من قبل هذا الحساب
  restrictedUserIds?: string[]; // مستخدمون مقيدون
  mutedUserIds?: string[]; // مستخدمون مكتومون (إشعارات وقصص)
  subscriptionPlan?: 'none' | 'blue_monthly' | 'blue_yearly' | 'gold_monthly' | 'gold_yearly';
  highlights?: ProfileHighlight[]; // قصص ومجموعات الهايلايت المحفوظة في البروفايل
  deviceFingerprints?: string[]; // البصمة الرقمية لكل جهاز سجل دخول أو أنشأ حساباً
  isClosed?: boolean; // الحساب مغلق نهائياً من قبل الإدارة (يعرض باسم aygram.user)
  closureReason?: string; // سبب الإغلاق من نماذج البلاغات
  closedAt?: string; // تاريخ الإغلاق — بعد 30 يوماً يُحذف نهائياً
  gender?: Gender; // الجنس: ذكر / أنثى (يُختار من الإعدادات)
  approvalStatus?: 'pending' | 'approved'; // 'pending' = بانتظار موافقة المشرف (حسب الجنسية)
  lastActive?: string; // آخر نشاط لحالة الاتصال
  showActivityStatus?: boolean; // إظهار حالة النشاط للآخرين (افتراضياً true)
}

export interface HighlightItem {
  id: string;
  media: string;
  caption?: string;
  createdAt: string;
}

export interface ProfileHighlight {
  id: string;
  userId: string;
  title: string;
  coverImage: string;
  items: HighlightItem[];
  createdAt: string;
}

export interface CommentItem {
  id: string;
  postId: string;
  userId: string;
  username: string;
  userAvatar: string;
  content: string;
  isApproved: boolean;
  createdAt: string;
}

export interface Post {
  id: string;
  userId: string;
  username: string;
  userAvatar: string;
  content: string;
  image?: string;
  images?: string[]; // مسموح حتى 5 صور في التغريدة
  video?: string;
  likes: string[]; // user IDs
  retweets?: string[]; // user IDs who retweeted this
  comments: CommentItem[];
  viewsCount: number;
  isApproved: boolean;
  isBlocked: boolean;
  rejectionReason?: string;
  createdAt: string;
  savedBy?: string[];
  tags?: string[]; // مسموح إضافة حتى 7 هاشتاغات في كل منشور
  location?: string; // إضافة الموقع الجغرافي
  isCloseFriendsOnly?: boolean; // منشور مخصص للأصدقاء المقربين فقط
  userNationality?: string; // جنسية ناشر التغريدة لخوارزمية المنشورات المحلية أولاً
}

export interface UsernameReservation {
  id: string;
  desiredUsername: string; // 1-4 أحرف
  suggestedUsername?: string; // اليوزر المؤقت (5+ أحرف) لمواصلة التسجيل
  phoneOrEmail?: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

export interface Story {
  id: string;
  userId: string;
  username: string;
  userAvatar: string;
  media: string;
  type: 'image' | 'video';
  caption?: string;
  expiresAt: string;
  createdAt: string;
  viewsCount: number;
  seenBy?: string[];
  isCloseFriendsOnly?: boolean; // ستوري مخصصة للأصدقاء المقربين فقط
}

export interface Product {
  id: string;
  userId: string;
  sellerName: string;
  sellerAvatar?: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  images: string[];
  category: string;
  isApproved: boolean;
  isBlocked: boolean;
  rejectionReason?: string;
  salesCount: number;
  rating: number;
  stock?: number; // الكمية المتاحة (الكمية اللانهائية إذا لم تُحدد)
  createdAt: string;
}

export interface OrderItem {
  productId: string;
  title: string;
  image: string;
  price: number;
  qty: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  buyerId: string;
  buyerName: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  total: number;
  currency: string;
  promoCode?: string;
  status: 'pending' | 'confirmed' | 'delivered';
  createdAt: string;
}

export interface Report {
  id: string;
  reporterId: string;
  reporterName: string;
  targetId: string;
  targetType: 'post' | 'product' | 'comment' | 'user';
  reason: string;
  targetSnippet: string;
  status: 'pending' | 'resolved' | 'dismissed';
  createdAt: string;
}

export interface BlockedWord {
  id: string;
  word: string;
  createdAt: string;
}

export interface AdminLog {
  id: string;
  action: string;
  adminName: string;
  details: string;
  timestamp: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  actorId: string;
  actorName: string;
  actorAvatar: string;
  type: 'like' | 'comment' | 'follow' | 'approval' | 'rejection' | 'report_action' | 'admin_broadcast' | 'verification' | 'channel' | 'closure' | 'pending_approval' | 'mention';
  title?: string;
  text: string;
  targetId?: string;
  isRead: boolean;
  createdAt: string;
  importance?: 'normal' | 'urgent' | 'guidance';
}

export interface DirectMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  receiverId: string;
  content: string;
  audio?: string;
  audioName?: string;
  createdAt: string;
  isRead: boolean;
  sharedPostId?: string;
}

export interface ChatConversation {
  id: string;
  participantIds: string[];
  lastMessageText: string;
  lastMessageTime: string;
  unreadCount: number;
  isGroup?: boolean; // محادثة جماعية
  groupName?: string; // اسم المجموعة
  groupAvatar?: string; // صورة المجموعة
  groupMemberColors?: string[]; // ألوان متراكبة لأفاتار المجموعة
  adminIds?: string[]; // مدراء المجموعة (منشئ الوحيد)
  maxMembers?: number; // الحد الأقصى للأعضاء (25 حاليًا)
  isRequest?: boolean; // طلب مراسلة
  requestedBy?: string; // معرّف الشخص الذي أرسل الطلب
  requestAccepted?: boolean; // هل تم قبول طلب المراسلة
}

export interface PromoCode {
  id: string;
  code: string;
  discountPercent: number;
  description: string;
  isActive: boolean;
}

export interface Channel {
  id: string;
  ownerId: string;
  ownerUsername: string;
  ownerAvatar?: string;
  name: string;
  description?: string;
  memberIds: string[]; // المالك + الأعضاء المتابعون للقناة
  createdAt: string;
}

// محتوى القناة: نص / صورة / صوت فقط — الفيديوهات ممنوعة حالياً على مستوى المنصة
export interface ChannelPost {
  id: string;
  channelId: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  text?: string;
  image?: string;
  audio?: string;
  audioName?: string;
  createdAt: string;
}

export interface VerificationRequest {
  id: string;
  userId: string;
  username: string;
  fullName: string;
  category: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

export interface PlatformSettings {
  autoApprovePosts: boolean;
  autoApproveProducts: boolean;
  siteNotice: string;
  maintenanceMode: boolean; // نظام صيانة الموقع
  maintenanceMessage: string;
}

export type SupportCategory =
  | 'technical' // مشكلة تقنية أو برمجية
  | 'account' // أمان واسترجاع وتوثيق الحساب
  | 'billing' // متجر AyGram والطلبات والمدفوعات
  | 'report_abuse' // بلاغ عن انتهاك أو محتوى مسيء
  | 'feature_request' // اقتراح ميزة جديدة للمنصة
  | 'other'; // استفسار عام

export type SupportPriority = 'low' | 'normal' | 'high' | 'urgent';

export type SupportStatus = 'open' | 'in_progress' | 'waiting_user' | 'resolved' | 'closed';

export interface SupportMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: 'user' | 'support' | 'admin';
  content: string;
  createdAt: string;
  attachment?: string;
}

export interface SupportTicket {
  id: string;
  ticketNumber: string; // e.g. AY-1042
  userId: string;
  userName: string;
  userAvatar?: string;
  userEmailOrPhone?: string;
  subject: string;
  category: SupportCategory;
  priority: SupportPriority;
  status: SupportStatus;
  messages: SupportMessage[];
  createdAt: string;
  updatedAt: string;
}

export type ActiveView =
  | 'landing' // الشاشة الرئيسية للموقع التي تفتح أول ما يفتح الموقع وتتضمن شروحات ومميزات
  | 'home'
  | 'explore' // قسم الإكسبلور والتغريدات الشائعة
  | 'search' // قسم البحث المتقدم
  | 'shop'
  | 'channels' // القنوات والمجتمعات
  | 'messages' // الرسائل الخاصة
  | 'notifications'
  | 'profile'
  | 'edit_profile' // صفحة تعديل الملف الشخصي المستقلة بتصميم انستغرام
  | 'settings' // صفحة الإعدادات الشاملة
  | 'auth' // صفحة تسجيل الدخول وإنشاء الحساب المنفصلة
  | 'saved'
  | 'rules' // شروط وقوانين المنصة وحقوق المطور يزن السلاق
  | 'bans' // صفحة الحظر وقائمة المحظورين (للإدارة فقط)
  | 'admin'
  | 'support' // نظام الدعم الفني وتذاكر المساعدة المباشرة
  | 'not_found'; // صفحة 404 غير موجودة
