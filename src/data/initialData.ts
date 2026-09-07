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
    id: 'user_sarah',
    fullName: 'سارة المهندس',
    username: 'sarah_design',
    password: 'password123',
    nationality: 'سعودي',
    language: 'العربية',
    currency: 'SAR',
    profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
    bio: 'مصممة واجهات وتجارب مستخدم UI/UX ومبتكرة هوية رقمية. مهتمة بالخط العربي والتصميم الحديث.',
    accountType: 'creator',
    isAdmin: false,
    isActive: true,
    followers: [],
    following: [],
    createdAt: '2024-02-10T12:00:00.000Z',
    verified: true,
    verificationBadge: 'blue',
  },
  {
    id: 'user_tareq',
    fullName: 'طارق العلي',
    username: 'tareq_tech',
    password: 'password123',
    nationality: 'أردني',
    language: 'العربية',
    currency: 'JOD',
    profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    bio: 'مهندس برمجيات ومهتم بتقنيات الويب والذكاء الاصطناعي. أشارك تجاربي البرمجية يومياً.',
    accountType: 'creator',
    isAdmin: false,
    isActive: true,
    followers: [],
    following: [],
    createdAt: '2024-02-15T09:30:00.000Z',
    verified: true,
    verificationBadge: 'blue',
  },
  {
    id: 'user_ahmad',
    fullName: 'أحمد الخطاط',
    username: 'ahmad_calligraphy',
    password: 'password123',
    nationality: 'إماراتي',
    language: 'العربية',
    currency: 'AED',
    profileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    bio: 'فنان وخطاط عربي، مهتم باللوحات الحروفية والمخطوطات التراثية الأصلية.',
    accountType: 'creator',
    isAdmin: false,
    isActive: true,
    followers: [],
    following: [],
    createdAt: '2024-02-20T14:15:00.000Z',
    verified: true,
    verificationBadge: 'blue',
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
  },
  {
    id: 'post_design_2',
    userId: 'user_sarah',
    username: 'sarah_design',
    userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
    content: 'التناسق اللوني بين الأخضر الزمردي والذهبي يمنح شعوراً بالفخامة والأصالة العربية 🌿✨ ما رأيكم في تجربة واجهات الاستخدام في التطبيق الجديد؟',
    image: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1000&q=80',
    likes: [],
    retweets: [],
    comments: [],
    viewsCount: 0,
    isApproved: true,
    isBlocked: false,
    createdAt: new Date().toISOString(),
    tags: ['تصميم', 'واجهات', 'ألوان'],
    location: 'الرياض، السعودية',
    userNationality: 'سعودي',
  },
  {
    id: 'post_tech_3',
    userId: 'user_tareq',
    username: 'tareq_tech',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    content: 'نصيحة برمجية لليوم: عند بناء واجهات متعددة الصفحات، احرص على فصل كل صفحة بملفها المستقل لتسهيل الصيانة وتحسين سرعة التحميل والـ Code Splitting! 💻⚡',
    likes: [],
    retweets: [],
    comments: [],
    viewsCount: 0,
    isApproved: true,
    isBlocked: false,
    createdAt: new Date().toISOString(),
    tags: ['برمجة', 'نصائح_تقنية', 'تطوير_الويب'],
    location: 'عمّان، الأردن',
    userNationality: 'أردني',
  },
  {
    id: 'post_calligraphy_4',
    userId: 'user_ahmad',
    username: 'ahmad_calligraphy',
    userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    content: 'مخطوطة جديدة بالخط الثلث الجلي: "وقل رب زدني علماً". جماليات الحرف العربي لا تنتهي أبداً. سأعرض النسخ المحدودة قريباً في سوق المبدعين! ✒️📜',
    image: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1000&q=80',
    likes: [],
    retweets: [],
    comments: [],
    viewsCount: 0,
    isApproved: true,
    isBlocked: false,
    createdAt: new Date().toISOString(),
    tags: ['خط_عربي', 'فن', 'حروفيات'],
    location: 'دبي، الإمارات',
    userNationality: 'إماراتي',
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
  },
  {
    id: 'story_sarah_1',
    userId: 'user_sarah',
    username: 'sarah_design',
    userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
    media: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1000&q=80',
    type: 'image',
    caption: 'مسودة لتطوير ثيمات وتصاميم الملفات الشخصية 🎨',
    expiresAt: new Date(Date.now() + 3600000 * 20).toISOString(),
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
    memberIds: ['user_owner_aygram', 'user_sarah', 'user_tareq', 'user_ahmad'],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'channel_creators',
    ownerId: 'user_sarah',
    ownerUsername: 'sarah_design',
    name: 'سوق المبدعين وتجارب التصميم',
    description: 'مساحة لمصممي الجرافيك وصناع المحتوى لعرض أعمالهم ومشاركة فرص التعاون.',
    memberIds: ['user_sarah', 'user_owner_aygram', 'user_ahmad'],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'channel_announcements',
    ownerId: 'user_owner_aygram',
    ownerUsername: 'y',
    name: 'تحديثات منصة AyGram الرسمية',
    description: 'الإعلانات والتعاميم والخصائص الجديدة الصادرة من إدارة وتطوير المنصة.',
    memberIds: ['user_owner_aygram', 'user_sarah', 'user_tareq', 'user_ahmad'],
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
  },
  {
    id: 'cp_2',
    channelId: 'channel_announcements',
    authorId: 'user_owner_aygram',
    authorName: 'يزن السلاق',
    authorAvatar:
      "data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 100 100%27%3E%3Crect width=%27100%27 height=%27100%27 fill=%27%230F3D2E%27 rx=%2750%27/%3E%3Cpath d=%27M50 12c-16 0-28 12-28 30 0 24 22 40 28 46 6-6 28-22 28-46 0-18-12-30-28-30Zm0 12c9 0 16 8 16 18 0 12-10 22-16 28-6-6-16-16-16-28 0-10 7-18 16-18Z%27 fill=%27%23D4AF37%27/%3E%3Ctext x=%2750%27 y=%2760%27 font-size=%2728%27 font-family=%27system-ui%27 font-weight=%27bold%27 text-anchor=%27middle%27 fill=%27%230F3D2E%27%3Ey%3C/text%3E%3C/svg%3E",
    text: 'تم بحمد الله ترقية البنية البرمجية لمنصة AyGram وتقسيم النظام إلى صفحات مستقلة مع دعم قاعدة البيانات المتزامنة!',
    createdAt: new Date().toISOString(),
  }
];

export const INITIAL_VERIFICATION_REQUESTS: VerificationRequest[] = [];

export const INITIAL_USERNAME_RESERVATIONS: UsernameReservation[] = [];

export const INITIAL_SUPPORT_TICKETS: SupportTicket[] = [
  {
    id: 'ticket_sample_1',
    ticketNumber: 'AY-1042',
    userId: 'user_yazan_creator',
    userName: 'يزن السلاق (المطور والمالك)',
    userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    userEmailOrPhone: 'yazan@aygram.app',
    subject: 'التحقق من جاهزية خادم المزامنة التلقائية لـ Vercel وتحديثات النظام',
    category: 'technical',
    priority: 'normal',
    status: 'resolved',
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    messages: [
      {
        id: 'msg_t1_1',
        senderId: 'user_yazan_creator',
        senderName: 'يزن السلاق (المطور والمالك)',
        senderRole: 'user',
        content: 'مرحباً، أود التأكد من أن جميع نقاط الاتصال API الخاصة بالمزامنة مع Vercel تعمل بكفاءة عالية وبدون انقطاع.',
        createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
      },
      {
        id: 'msg_t1_2',
        senderId: 'support_team',
        senderName: 'فريق الدعم الفني - AyGram',
        senderRole: 'support',
        content: 'أهلاً بك أستاذ يزن! تم فحص محرك المزامنة السحابي وتم بنجاح ربط خادم Vercel Serverless مع دعم المزامنة اللحظية وتخزين الكاش المحلي بنسبة استقرار 99.9%. التذاكر والمشاركات تعمل بسلاسة تامة.',
        createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
      },
    ],
  },
  {
    id: 'ticket_sample_2',
    ticketNumber: 'AY-1055',
    userId: 'guest_inquiry',
    userName: 'سارة المهندس',
    userEmailOrPhone: 'sarah.m@example.com',
    subject: 'استفسار حول فتح متجر وبيع المنتجات الرقمية والحرفية',
    category: 'billing',
    priority: 'normal',
    status: 'in_progress',
    createdAt: new Date(Date.now() - 3600000 * 6).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    messages: [
      {
        id: 'msg_t2_1',
        senderId: 'guest_inquiry',
        senderName: 'سارة المهندس',
        senderRole: 'user',
        content: 'السلام عليكم، كيف يمكنني كصانعة محتوى ومصممة إضافة منتجاتي في متجر المنصة وتحديد الأسعار والخصومات؟',
        createdAt: new Date(Date.now() - 3600000 * 6).toISOString(),
      },
      {
        id: 'msg_t2_2',
        senderId: 'support_team',
        senderName: 'فريق الدعم الفني - AyGram',
        senderRole: 'support',
        content: 'وعليكم السلام ورحمة الله أستاذة سارة. يمكنك التوجه إلى قسم "المتجر" والضغط على زر "إضافة منتج جديد" واختيار التصنيف والسعر والعملة المناسبة. طلبك حالياً قيد المتابعة للمساعدة في الإعداد.',
        createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
      },
    ],
  },
];
