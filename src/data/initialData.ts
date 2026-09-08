import {
  User,
  Post,
  Story,
  Product,
  Report,
  BlockedWord,
  AdminLog,
  NotificationItem,
  DirectMessage,
  ChatConversation,
  VerificationRequest,
  UsernameReservation,
  SupportTicket,
  Channel,
  ChannelPost
} from '../types/aygram';

export const INITIAL_USERS: User[] = [
  {
    id: 'user_owner_aygram',
    fullName: 'يزن السلاق',
    username: 'y',
    password: 'jana@#5Y',
    nationality: 'فلسطيني',
    language: 'العربية',
    currency: 'SAR',
    profileImage: 'data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 100 100%27%3E%3Crect width=%27100%27 height=%27100%27 fill=%27%230F3D2E%27 rx=%2750%27/%3E%3Cpath d=%27M50 12c-16 0-28 12-28 30 0 24 22 40 28 46 6-6 28-22 28-46 0-18-12-30-28-30Zm0 12c9 0 16 8 16 18 0 12-10 22-16 28-6-6-16-16-16-28 0-10 7-18 16-18Z%27 fill=%27%23D4AF37%27/%3E%3Ctext x=%2750%27 y=%2760%27 font-size=%2728%27 font-family=%27system-ui%27 font-weight=%27bold%27 text-anchor=%27middle%27 fill=%27%230F3D2E%27%3Ey%3C/text%3E%3C/svg%3E',
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
  }
];

export const INITIAL_POSTS: Post[] = [
  {
    id: 'post_welcome_1',
    userId: 'user_owner_aygram',
    username: 'y',
    userAvatar:
      "data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 100 100%27%3E%3Crect width=%27100%27 height=%27100%27 fill=%27%230F3D2E%27 rx=%2750%27/%3E%3Cpath d=%27M50 12c-16 0-28 12-28 30 0 24 22 40 28 46 6-6 28-22 28-46 0-18-12-30-28-30Zm0 12c9 0 16 8 16 18 0 12-10 22-16 28-6-6-16-16-16-28 0-10 7-18 16-18Z%27 fill=%27%23D4AF37%27/%3E%3Ctext x=%2750%27 y=%2760%27 font-size=%2728%27 font-family=%27system-ui%27 font-weight=%27bold%27 text-anchor=%27middle%27 fill=%27%230F3D2E%27%3Ey%3C/text%3E%3C/svg%3E",
    content: 'أهلاً بكم في منصة AyGram! ✨ واحة التغريد والتواصل العربي الحديثة، المصممة بحب لخدمة المبدعين والمبرمجين والمجتمع العربي بكافة أطيافه. شاركونا أفكاركم ومشاريعكم!',
    likes: [],
    retweets: [],
    comments: [],
    viewsCount: 0,
    isApproved: true,
    isBlocked: false,
    createdAt: new Date().toISOString(),
    tags: ['aygram', 'ترحيب', 'تطوير_عربي'],
    location: 'القدس، فلسطين',
    userNationality: 'فلسطيني',
  }
];

export const INITIAL_STORIES: Story[] = [
  {
    id: 'story_owner_1',
    userId: 'user_owner_aygram',
    username: 'y',
    userAvatar:
      "data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 100 100%27%3E%3Crect width=%27100%27 height=%27100%27 fill=%27%230F3D2E%27 rx=%2750%27/%3E%3Cpath d=%27M50 12c-16 0-28 12-28 30 0 24 22 40 28 46 6-6 28-22 28-46 0-18-12-30-28-30Zm0 12c9 0 16 8 16 18 0 12-10 22-16 28-6-6-16-16-16-28 0-10 7-18 16-18Z%27 fill=%27%23D4AF37%27/%3E%3Ctext x=%2750%27 y=%2760%27 font-size=%2728%27 font-family=%27system-ui%27 font-weight=%27bold%27 text-anchor=%27middle%27 fill=%27%230F3D2E%27%3Ey%3C/text%3E%3C/svg%3E",
    media: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1000&q=80',
    type: 'image',
    caption: 'نواصل العمل لتقديم تجربة تواصل عربية غير مسبوقة!',
    expiresAt: new Date(Date.now() + 3600000 * 24).toISOString(),
    createdAt: new Date().toISOString(),
    viewsCount: 0,
    seenBy: [],
  }
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod_calligraphy_art',
    userId: 'user_ahmad',
    sellerName: 'أحمد الخطاط',
    sellerAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    title: 'لوحة خط ثلث أصلية مذهبة يدوياً',
    description: 'لوحة كانفاس فاخرة قياس 70x50 سم مكتوبة بحبر الشينوا الأسود الأصلي مع تفاصيل مذهبة بورق الذهب عيار 24. قطعة فنية راقية للمكاتب والمنازل.',
    price: 350,
    currency: 'SAR',
    images: ['https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1000&q=80'],
    category: 'فن وتصميم',
    isApproved: true,
    isBlocked: false,
    salesCount: 0,
    rating: 5.0,
    stock: 5,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'prod_ui_kit',
    userId: 'user_sarah',
    sellerName: 'سارة المهندس',
    sellerAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
    title: 'حزمة تصميم واجهات عربية Figma UI Kit (أكثر من 300 شاشة)',
    description: 'حزمة تصميم كاملة تدعم اللغة العربية واتجاه RTL بنسبة 100% مع نظام رموز ومكونات تفاعلية جاهزة للاستخدام في تطبيقات الجوال والويب.',
    price: 120,
    currency: 'SAR',
    images: ['https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1000&q=80'],
    category: 'منتجات رقمية',
    isApproved: true,
    isBlocked: false,
    salesCount: 0,
    rating: 5.0,
    stock: 999,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'prod_dev_book',
    userId: 'user_tareq',
    sellerName: 'طارق العلي',
    sellerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    title: 'كتاب "دليلك الشامل لهندسة تطبيقات الويب الحديثة"',
    description: 'كتاب رقمي بصيغة PDF و ePub يشرح أفضل الممارسات في بناء الأنظمة القابلة للتوسع، معالجة الحالة، والمزامنة السحابية اللحظية.',
    price: 65,
    currency: 'SAR',
    images: ['https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=1000&q=80'],
    category: 'كتب وتعليم',
    isApproved: true,
    isBlocked: false,
    salesCount: 0,
    rating: 5.0,
    stock: 999,
    createdAt: new Date().toISOString(),
  }
];

export const INITIAL_BLOCKED_WORDS: BlockedWord[] = [];

export const INITIAL_REPORTS: Report[] = [];

export const INITIAL_ADMIN_LOGS: AdminLog[] = [];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [];

export const INITIAL_CONVERSATIONS: ChatConversation[] = [];

export const INITIAL_MESSAGES: DirectMessage[] = [];

export const INITIAL_CHANNELS: Channel[] = [
  {
    id: 'channel_developers',
    ownerId: 'user_owner_aygram',
    ownerUsername: 'y',
    name: 'ملتقى المطورين والمبرمجين',
    description: 'قناة تقنية لمناقشة أحدث تقنيات الويب، الذكاء الاصطناعي، وتبادل الخبرات البرمجية.',
    memberIds: ['user_owner_aygram'],
    createdAt: new Date().toISOString(),
  }
];

export const INITIAL_CHANNEL_POSTS: ChannelPost[] = [
  {
    id: 'cp_1',
    channelId: 'channel_developers',
    authorId: 'user_owner_aygram',
    authorName: 'يزن السلاق',
    authorAvatar:
      "data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 100 100%27%3E%3Crect width=%27100%27 height=%27100%27 fill=%27%230F3D2E%27 rx=%2750%27/%3E%3Cpath d=%27M50 12c-16 0-28 12-28 30 0 24 22 40 28 46 6-6 28-22 28-46 0-18-12-30-28-30Zm0 12c9 0 16 8 16 18 0 12-10 22-16 28-6-6-16-16-16-28 0-10 7-18 16-18Z%27 fill=%27%23D4AF37%27/%3E%3Ctext x=%2750%27 y=%2760%27 font-size=%2728%27 font-family=%27system-ui%27 font-weight=%27bold%27 text-anchor=%27middle%27 fill=%27%230F3D2E%27%3Ey%3C/text%3E%3C/svg%3E",
    text: 'مرحباً بجميع المطورين في قناة ملتقى المطورين! يمكنكم هنا مشاركة استفساراتكم التقنية والتسجيل الصوتي وملاحظات الكود البرمجي.',
    createdAt: new Date().toISOString(),
  }
];

export const INITIAL_VERIFICATION_REQUESTS: VerificationRequest[] = [];

export const INITIAL_USERNAME_RESERVATIONS: UsernameReservation[] = [];

export const INITIAL_SUPPORT_TICKETS: SupportTicket[] = [
  {
    id: 'ticket_sample_1',
    ticketNumber: 'AY-1042',
    userId: 'user_owner_aygram',
    userName: 'يزن السلاق (المطور والمالك)',
    userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    userEmailOrPhone: 'yazan@aygram.app',
    subject: 'التحقق من جاهزية خادم المزامنة التلقائية السحابي وتحديثات النظام',
    category: 'technical',
    priority: 'normal',
    status: 'resolved',
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    messages: [
      {
        id: 'msg_t1_1',
        senderId: 'user_owner_aygram',
        senderName: 'يزن السلاق (المطور والمالك)',
        senderRole: 'user',
        content: 'مرحباً، أود التأكد من أن جميع نقاط الاتصال API الخاصة بالمزامنة السحابية تعمل بكفاءة عالية وبدون انقطاع.',
        createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
      },
      {
        id: 'msg_t1_2',
        senderId: 'support_team',
        senderName: 'فريق الدعم الفني - AyGram',
        senderRole: 'support',
        content: 'أهلاً بك أستاذ يزن! تم فحص محرك المزامنة السحابي وتم بنجاح ربط خادم AyGram السحابي مع دعم المزامنة اللحظية وتخزين الكاش المحلي بنسبة استقرار 99.9%. التذاكر والمشاركات تعمل بسلاسة تامة.',
        createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
      },
    ],
  }
];
