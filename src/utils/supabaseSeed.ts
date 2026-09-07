import { supabase } from '../utils/supabaseClient';

// Initial users from AyGram
const INITIAL_USERS = [
  {
    id: 'user_sarah',
    fullName: 'سارة المهندس',
    username: 'sarah_design',
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
    verified: true,
    verificationBadge: 'blue',
  },
  {
    id: 'user_tareq',
    fullName: 'طارق العلي',
    username: 'tareq_tech',
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
    verified: true,
    verificationBadge: 'blue',
  },
  {
    id: 'user_ahmad',
    fullName: 'أحمد الخطاط',
    username: 'ahmad_calligraphy',
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
    verified: true,
    verificationBadge: 'blue',
  }
];

// Initial posts
const INITIAL_POSTS = [
  {
    id: 'post_welcome_1',
    userId: 'user_owner_aygram',
    username: 'y',
    content: 'أهلاً بكم في منصة AyGram! ✨ واحة التغريد والتواصل العربي الحديثة، المصممة بحب لخدمة المبدعين والمبرمجين والمجتمع العربي بكافة أطيافه. شاركونا أفكاركم ومشاريعكم!',
    isApproved: true,
    isBlocked: false,
    tags: ['aygram', 'ترحيب', 'تطوير_عربي'],
    location: 'القدس، فلسطين',
    userNationality: 'فلسطيني',
  },
  {
    id: 'post_design_2',
    userId: 'user_sarah',
    username: 'sarah_design',
    content: 'التناسق اللوني بين الأخضر الزمردي والذهبي يمنح شعوراً بالفخامة والأصالة العربية 🌿✨ ما رأيكم في تجربة واجهات الاستخدام في التطبيق الجديد؟',
    image: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1000&q=80',
    isApproved: true,
    isBlocked: false,
    tags: ['تصميم', 'واجهات', 'ألوان'],
    location: 'الرياض، السعودية',
    userNationality: 'سعودي',
  },
];

// Initial channels
const INITIAL_CHANNELS = [
  {
    id: 'channel_developers',
    ownerId: 'user_owner_aygram',
    ownerUsername: 'y',
    name: 'ملتقى المطورين والمبرمجين',
    description: 'قناة تقنية لمناقشة أحدث تقنيات الويب، الذكاء الاصطناعي، وتبادل الخبرات البرمجية.',
    memberIds: ['user_owner_aygram', 'user_sarah', 'user_tareq', 'user_ahmad'],
  },
  {
    id: 'channel_creators',
    ownerId: 'user_sarah',
    ownerUsername: 'sarah_design',
    name: 'سوق المبدعين وتجارب التصميم',
    description: 'مساحة لمصممي الجرافيك وصناع المحتوى لعرض أعمالهم ومشاركة فرص التعاون.',
    memberIds: ['user_sarah', 'user_owner_aygram', 'user_ahmad'],
  },
  {
    id: 'channel_announcements',
    ownerId: 'user_owner_aygram',
    ownerUsername: 'y',
    name: 'تحديثات منصة AyGram الرسمية',
    description: 'الإعلانات والتعاميم والخصائص الجديدة الصادرة من إدارة وتطوير المنصة.',
    memberIds: ['user_owner_aygram', 'user_sarah', 'user_tareq', 'user_ahmad'],
  }
];

// Initial channel posts
const INITIAL_CHANNEL_POSTS = [
  {
    id: 'cp_1',
    channelId: 'channel_developers',
    authorId: 'user_owner_aygram',
    authorName: 'يزن السلاق',
    text: 'مرحباً بجميع المطورين في قناة ملتقى المطورين! يمكنكم هنا مشاركة استفساراتكم التقنية والتسجيل الصوتي وملاحظات الكود البرمجي.',
  },
  {
    id: 'cp_2',
    channelId: 'channel_announcements',
    authorId: 'user_owner_aygram',
    authorName: 'يزن السلاق',
    text: 'تم بحمد الله ترقية البنية البرمجية لمنصة AyGram وتقسيم النظام إلى صفحات مستقلة مع دعم قاعدة البيانات المتزامنة!',
  }
];

// Initial products
const INITIAL_PRODUCTS = [
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
  }
];

// Platform settings
const INITIAL_SETTINGS = {
  autoApprovePosts: false,
  autoApproveProducts: false,
  siteNotice: 'أهلاً بك في منصة AyGram - واحة التغريد والتواصل والتجارة النبيلة',
  maintenanceMode: false,
  maintenanceMessage: '',
};

// Seed function
export async function seedDatabase() {
  console.log('Seeding Supabase database...');

  // Insert users
  for (const user of INITIAL_USERS) {
    const { error } = await supabase.from('users').upsert({
      id: user.id,
      full_name: user.fullName,
      username: user.username,
      nationality: user.nationality,
      language: user.language,
      currency: user.currency,
      profile_image: user.profileImage,
      bio: user.bio,
      account_type: user.accountType,
      is_active: user.isActive,
      verified: user.verified,
      verification_badge: user.verificationBadge,
      created_at: new Date().toISOString(),
    });
    if (error) console.error(`Error seeding user ${user.username}:`, error);
  }
  console.log('Users seeded');

  // Insert posts
  for (const post of INITIAL_POSTS) {
    const { error } = await supabase.from('posts').upsert({
      id: post.id,
      user_id: post.userId,
      username: post.username,
      content: post.content,
      is_approved: post.isApproved,
      is_blocked: post.isBlocked,
      tags: post.tags,
      location: post.location,
      user_nationality: post.userNationality,
      created_at: new Date().toISOString(),
    });
    if (error) console.error(`Error seeding post ${post.id}:`, error);
  }
  console.log('Posts seeded');

  // Insert channels
  for (const channel of INITIAL_CHANNELS) {
    const { error } = await supabase.from('channels').upsert({
      id: channel.id,
      owner_id: channel.ownerId,
      owner_username: channel.ownerUsername,
      name: channel.name,
      description: channel.description,
      member_ids: channel.memberIds,
      created_at: new Date().toISOString(),
    });
    if (error) console.error(`Error seeding channel ${channel.name}:`, error);
  }
  console.log('Channels seeded');

  // Insert channel posts
  for (const post of INITIAL_CHANNEL_POSTS) {
    const { error } = await supabase.from('channel_posts').upsert({
      id: post.id,
      channel_id: post.channelId,
      author_id: post.authorId,
      author_username: post.authorName,
      text: post.text,
      created_at: new Date().toISOString(),
    });
    if (error) console.error(`Error seeding channel post ${post.id}:`, error);
  }
  console.log('Channel posts seeded');

  // Insert products
  for (const product of INITIAL_PRODUCTS) {
    const { error } = await supabase.from('products').upsert({
      id: product.id,
      user_id: product.userId,
      seller_name: product.sellerName,
      seller_avatar: product.sellerAvatar,
      title: product.title,
      description: product.description,
      price: product.price,
      currency: product.currency,
      images: product.images,
      category: product.category,
      is_approved: product.isApproved,
      is_blocked: product.isBlocked,
      sales_count: product.salesCount,
      rating: product.rating,
      stock: product.stock,
      created_at: new Date().toISOString(),
    });
    if (error) console.error(`Error seeding product ${product.id}:`, error);
  }
  console.log('Products seeded');

  // Insert platform settings
  const { error } = await supabase.from('platform_settings').upsert({
    id: 'single',
    auto_approve_posts: INITIAL_SETTINGS.autoApprovePosts,
    auto_approve_products: INITIAL_SETTINGS.autoApproveProducts,
    site_notice: INITIAL_SETTINGS.siteNotice,
    maintenance_mode: INITIAL_SETTINGS.maintenanceMode,
    maintenance_message: INITIAL_SETTINGS.maintenanceMessage,
    updated_at: new Date().toISOString(),
  });
  if (error) console.error('Error seeding settings:', error);
  console.log('Settings seeded');

  console.log('Database seeding complete!');
}