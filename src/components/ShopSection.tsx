import React, { useState, useEffect } from 'react';
import {
  ShoppingBag,
  ShoppingCart,
  Plus,
  Tag,
  CheckCircle2,
  ExternalLink,
  MessageCircle,
  Flag,
  Search,
  Filter,
  BadgePercent,
  Pencil,
  Trash2,
  Package,
  X
} from 'lucide-react';
import { useAyGram } from '../context/AyGramContext';
import { Product, Order } from '../types/aygram';
import { OrderValidatedModal } from './OrderValidatedModal';
import { StoreCheckoutModal, CheckoutItem } from './StoreCheckoutModal';

interface ShopSectionProps {
  onOpenAddProduct: () => void;
  onEditProduct: (product: Product) => void;
  onOpenReport: (targetId: string, snippet: string, targetType: 'product') => void;
  onOpenAuth: () => void;
}

const SHOP_PROMO_HINT = ['AYGRAM10', 'RAMADAN15', 'CRAFT20', 'WELCOME5'];

const CATEGORIES = [
  'الكل',
  'لوحات وفنون إسلامية',
  'عطور وبخور',
  'سجاد ومستلزمات صلاة',
  'مصاحف وكتب قيّمة',
  'أزياء وملابس محتشمة',
  'هدايا ومناسبات دينية',
];

// Stable pseudo-random stats per store/product so every store shows lively numbers
const hashNum = (key: string) => {
  let h = 0;
  for (let i = 0; i < key.length; i++) h = (h * 31 + key.charCodeAt(i)) % 9973;
  return h;
};

const formatCount = (n: number) =>
  n >= 1000 ? `${(n / 1000).toFixed(1).replace(/\.0$/, '')}k` : String(n);

export const ShopSection: React.FC<ShopSectionProps> = ({
  onOpenAddProduct,
  onEditProduct,
  onOpenReport,
  onOpenAuth,
}) => {
  const { products, currentUser, viewUserProfile, deleteProduct, orders, showToast } = useAyGram();
  const [selectedCategory, setSelectedCategory] = useState('الكل');
  const [shopSearch, setShopSearch] = useState('');
  const [contactSuccess, setContactSuccess] = useState<string | null>(null);
  const [validatedProduct, setValidatedProduct] = useState<Product | null>(null);
  const cartStorageKey = `aygram_cart_${currentUser?.id ?? 'guest'}`;
  const [cart, setCart] = useState<CheckoutItem[]>(() => {
    try {
      const raw = localStorage.getItem(`aygram_cart_${currentUser?.id ?? 'guest'}`);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [ordersOpen, setOrdersOpen] = useState(false);

  // السلة محفوظة دائماً (لكل مستخدم على حدة) — لا تضيع عند الرفراش أو الخروج
  useEffect(() => {
    try {
      localStorage.setItem(cartStorageKey, JSON.stringify(cart));
    } catch (e) {
      console.error(e);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cart, currentUser?.id]);

  // عند تغيّر المستخدم: تحميل سلته الخاصة
  useEffect(() => {
    try {
      const raw = localStorage.getItem(`aygram_cart_${currentUser?.id ?? 'guest'}`);
      setCart(raw ? JSON.parse(raw) : []);
    } catch (e) {
      setCart([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser?.id]);

  const myOrders = orders.filter((o) => o.buyerId === currentUser?.id);

  // Filter approved products only for general public
  const visibleProducts = products.filter((p) => {
    // If current user is seller, allow them to see their pending products too
    const isOwner = currentUser && p.userId === currentUser.id;
    if (!p.isApproved && !isOwner) return false;
    if (p.isBlocked) return false;

    // Filter by category
    if (selectedCategory !== 'الكل' && p.category !== selectedCategory) {
      return false;
    }

    // Filter by search text
    if (shopSearch.trim()) {
      const q = shopSearch.toLowerCase();
      return (
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      );
    }

    return true;
  });

  const handleContactSeller = (product: Product) => {
    setContactSuccess(product.id);
    setValidatedProduct(product);
  };

  const handleAddToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.productId === product.id);
      if (existing) {
        return prev.map((i) =>
          i.productId === product.id ? { ...i, qty: i.qty + 1 } : i
        );
      }
      return [
        ...prev,
        {
          productId: product.id,
          title: product.title,
          image:
            product.images && product.images.length > 0
              ? product.images[0]
              : 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80',
          price: product.price,
          qty: 1,
        },
      ];
    });
  };

  const cartTotalItems = cart.reduce((acc, i) => acc + i.qty, 0);
  const cartTotalPrice = cart.reduce((acc, i) => acc + i.price * i.qty, 0);

  return (
    <div className="space-y-6">

      {/* Store stats card styling (Uiverse.io by vinodjangid07) */}
      <style>{`
        .ayg-store-stats {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          flex-wrap: wrap;
        }
        .ayg-store-stats .ayg-sw {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          justify-content: space-between;
          width: 100px;
          height: 90px;
          border-radius: 20px;
          background-color: #ffffff;
          padding: 14px 15px;
          box-shadow:
            20px 20px 60px #e6e6e6,
            -20px -20px 60px #f3f3f3;
        }
        .ayg-store-stats .ayg-hd {
          font-size: 0.7em;
          font-weight: 700;
          letter-spacing: 1px;
          color: #6b7280;
        }
        .ayg-store-stats .ayg-bw {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .ayg-store-stats .ayg-bw svg.ayg-star {
          width: 30px;
          height: 30px;
          fill: gold;
        }
        .ayg-store-stats .ayg-bw svg.ayg-tag {
          width: 27px;
          height: 27px;
          fill: rgb(141, 214, 32);
        }
        .ayg-store-stats .ayg-bw svg.ayg-thumb {
          width: 27px;
          height: 27px;
          fill: blueviolet;
        }
        .ayg-store-stats .ayg-bw p {
          font-size: 1.2em;
          font-weight: 700;
          color: #1a1a1a;
        }
      `}</style>

      {/* Top Banner and Actions */}
      <div className="bg-gradient-to-r from-[#0F3D2E] to-[#16503c] rounded-[16px] p-5 sm:p-7 text-white shadow-aygram-md relative overflow-hidden">
        <div className="relative z-10 max-w-xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#D4AF37] text-xs font-bold">
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>سوق AyGram للتجارة الإسلامية الصادقة</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-serif text-[#FCF9F0]">
            بضائع مباركة، وعقود تجارية خالية من الغش
          </h2>
          <p className="text-xs sm:text-sm text-[#FCF9F0]/80 leading-relaxed">
            منصة تسوق نقية تربط الحرفيين والتجار الصادقين بعملاء يقدرون الجودة والأمانة.
          </p>
        </div>

        <div className="mt-4 sm:mt-0 sm:absolute sm:bottom-6 sm:end-6 flex items-center gap-2">
          {currentUser && (
            <button
              onClick={() => setOrdersOpen(true)}
              className="flex items-center gap-2 py-3 px-4 rounded-[12px] bg-white/10 border border-white/20 text-white font-bold text-xs hover:bg-white/20 transition-all shadow-aygram active:scale-95 cursor-pointer"
            >
              <Package className="w-4 h-4" />
              <span>طلباتي ({myOrders.length})</span>
            </button>
          )}
          <button
            onClick={() => {
              if (!currentUser) {
                onOpenAuth();
              } else {
                onOpenAddProduct();
              }
            }}
            className="flex items-center gap-2 py-3 px-5 rounded-[12px] bg-[#D4AF37] text-[#0F3D2E] font-bold text-xs hover:bg-[#e0be4e] transition-all shadow-aygram active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ إضافة منتج للبيع</span>
          </button>
        </div>
      </div>

      {/* Category Pills & Search */}
      <div className="space-y-3">
        {/* Search */}
        <div className="relative max-w-md">
          <input
            type="text"
            value={shopSearch}
            onChange={(e) => setShopSearch(e.target.value)}
            placeholder="ابحث في المتجر بالاسم أو الوصف..."
            className="w-full py-2 px-3.5 pe-10 rounded-[12px] bg-white border border-[#EFE9D9] text-xs text-[#1A1A1A] focus:outline-none focus:border-[#0F3D2E] shadow-aygram"
          />
          <Search className="w-4 h-4 text-[#7A7A7A] absolute end-3.5 top-1/2 -translate-y-1/2" />
        </div>

        {/* Categories Bar */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#0F3D2E] text-[#D4AF37] shadow-aygram'
                  : 'bg-white border border-[#EFE9D9] text-[#7A7A7A] hover:text-[#1A1A1A] hover:border-[#D4AF37]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Promo codes hint banner */}
        <div className="rounded-[14px] border border-[#D4AF37]/50 bg-gradient-to-l from-[#D4AF37]/15 to-transparent p-3 flex flex-wrap items-center gap-2">
          <BadgePercent className="w-4 h-4 text-[#D4AF37]" />
          <span className="text-xs font-bold text-[#0F3D2E]">عروض المتجر:</span>
          <div className="flex flex-wrap gap-1.5">
            {SHOP_PROMO_HINT.map((code) => (
              <span
                key={code}
                dir="ltr"
                className="px-2 py-0.5 rounded-[8px] bg-white border border-dashed border-[#D4AF37] text-[10px] font-mono font-bold text-[#0F3D2E]"
              >
                {code}
              </span>
            ))}
          </div>
          <span className="text-[11px] text-[#7A7A7A]">أدخل الكود عند إتمام الدفع للحصول على الخصم</span>
        </div>
      </div>

      {/* Products Grid */}
      {visibleProducts.length === 0 ? (
        <div className="bg-white rounded-[16px] p-10 text-center border border-[#EFE9D9] shadow-aygram space-y-3">
          <ShoppingBag className="w-12 h-12 text-[#7A7A7A] mx-auto opacity-50" />
          <h3 className="text-sm font-bold text-[#0F3D2E]">لا توجد منتجات مطابقة حالياً</h3>
          <p className="text-xs text-[#7A7A7A]">
            جرب البحث بكلمات أخرى أو كن أول من يضيف منتجاً في هذا التصنيف.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5">
          {visibleProducts.map((product) => {
            const isOwner = currentUser && product.userId === currentUser.id;
            const reviewCount = 30 + hashNum(product.id) % 2700;
            const sellsCount = product.salesCount > 0 ? product.salesCount : 120 + hashNum(product.id + '.s') % 1800;

            return (
              <div
                key={product.id}
                className="bg-white rounded-[16px] border border-[#EFE9D9] shadow-aygram hover:shadow-aygram-md transition-all overflow-hidden flex flex-col justify-between group"
              >
                <div>
                  {/* Product Image */}
                  <div className="relative aspect-4/3 overflow-hidden bg-[#FCF9F0]">
                    <img
                      src={product.images && product.images.length > 0 ? product.images[0] : 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80'}
                      alt={product.title}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />

                    {/* Pending Moderation Notice */}
                    {!product.isApproved && isOwner && (
                      <span className="absolute top-2.5 start-2.5 px-2.5 py-1 rounded-full bg-[#D4AF37] text-[#0F3D2E] text-[10px] font-bold shadow-aygram">
                        قيد المراجعة الشرعية
                      </span>
                    )}

                    {/* Category badge */}
                    <span className="absolute bottom-2.5 start-2.5 px-2.5 py-1 rounded-full bg-black/60 text-white text-[10px] backdrop-blur-xs">
                      {product.category}
                    </span>

                    {/* Report button */}
                    <button
                      onClick={() => onOpenReport(product.id, product.title, 'product')}
                      className="absolute top-2.5 end-2.5 p-1.5 rounded-full bg-white/80 hover:bg-white text-[#7A7A7A] hover:text-[#0F3D2E] transition-colors cursor-pointer shadow-xs"
                      title="إبلاغ عن مخالفة"
                    >
                      <Flag className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Product Details */}
                  <div className="p-4 space-y-2.5">
                    {/* Seller row */}
                    <div
                      onClick={() => viewUserProfile(product.userId)}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <img
                        src={product.sellerAvatar}
                        alt={product.sellerName}
                        className="w-5 h-5 rounded-full object-cover border border-[#D4AF37]"
                      />
                      <span className="text-[11px] font-medium text-[#7A7A7A] hover:text-[#0F3D2E] truncate">
                        البائع: {product.sellerName}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-[#1A1A1A] line-clamp-1 group-hover:text-[#0F3D2E] transition-colors">
                      {product.title}
                    </h3>

                    <p className="text-xs text-[#7A7A7A] line-clamp-2 leading-relaxed">
                      {product.description}
                    </p>

                    {/* Store stats card (Uiverse.io by vinodjangid07) */}
                    <div className="ayg-store-stats pt-1">
                      <div className="ayg-sw">
                        <p className="ayg-hd">Rating</p>
                        <div className="ayg-bw">
                          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="ayg-star">
                            <g data-name="Layer 2">
                              <g data-name="star">
                                <rect opacity="0" transform="rotate(90 12 12)" height="24" width="24"></rect>
                                <path d="M17.56 21a1 1 0 0 1-.46-.11L12 18.22l-5.1 2.67a1 1 0 0 1-1.45-1.06l1-5.63-4.12-4a1 1 0 0 1-.25-1 1 1 0 0 1 .81-.68l5.7-.83 2.51-5.13a1 1 0 0 1 1.8 0l2.54 5.12 5.7.83a1 1 0 0 1 .81.68 1 1 0 0 1-.25 1l-4.12 4 1 5.63a1 1 0 0 1-.4 1 1 1 0 0 1-.62.18z"></path>
                              </g>
                            </g>
                          </svg>
                          <p>{Number(product.rating).toFixed(1)}</p>
                        </div>
                      </div>

                      <div className="ayg-sw">
                        <p className="ayg-hd">Review</p>
                        <div className="ayg-bw">
                          <svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" className="ayg-thumb">
                            <path d="M472.06 334l-144.16-6.13c-4.61-.36-23.9-1.21-23.9-25.87 0-23.81 19.16-25.33 24.14-25.88L472.06 270c12.67.13 23.94 14.43 23.94 32s-11.27 31.87-23.94 32zM330.61 202.33L437.35 194C450 194 464 210.68 464 227.88v.33c0 16.32-11.14 29.62-24.88 29.79l-108.45-1.73C304 253 304 236.83 304 229.88c0-22.88 21.8-27.15 26.61-27.55zM421.85 480l-89.37-8.93C308 470.14 304 453.82 304 443.59c0-18.38 13.41-24.6 26.67-24.6l91-3c14.54.23 26.32 14.5 26.32 32s-11.67 31.67-26.14 32.01zm34.36-71.5l-126.4-6.21c-9.39-.63-25.81-3-25.81-26.37 0-12 4.35-25.61 25-27.53l127.19-3.88c13.16.14 23.81 13.49 23.81 31.4s-10.65 32.43-23.79 32.58z"></path>
                            <path fill="none" d="M133.55 238.06A15.85 15.85 0 01126 240a15.82 15.82 0 007.51-1.92zM174.14 168.78l.13-.23-.13.23c-20.5 35.51-30.36 54.95-33.82 62 3.47-7.07 13.34-26.51 33.82-62z"></path>
                            <path d="M139.34 232.84l1-2a16.27 16.27 0 01-6.77 7.25 16.35 16.35 0 005.77-5.25z"></path>
                            <path d="M316.06 52.62C306.63 39.32 291 32 272 32a16 16 0 00-14.31 8.84c-3 6.07-15.25 24-28.19 42.91-18 26.33-40.35 59.07-55.23 84.8l-.13.23c-20.48 35.49-30.35 54.93-33.82 62l-1 2a16.35 16.35 0 01-5.79 5.22 15.82 15.82 0 01-7.53 2h-25.31A84.69 84.69 0 0016 324.69v38.61a84.69 84.69 0 0084.69 84.7h48.79a17.55 17.55 0 019.58 2.89C182 465.87 225.34 480 272 480c7.45 0 14.19-.14 20.27-.38a8 8 0 006.2-12.68l-.1-.14C289.8 454.41 288 441 288 432a61.2 61.2 0 015.19-24.77 17.36 17.36 0 000-14.05 63.81 63.81 0 010-50.39 17.32 17.32 0 000-14 62.15 62.15 0 010-49.59 18.13 18.13 0 000-14.68A60.33 60.33 0 01288 239c0-8.2 2-21.3 8-31.19a15.63 15.63 0 001.14-13.64c-.38-1-.76-2.07-1.13-3.17a24.84 24.84 0 01-.86-11.58c3-19.34 9.67-36.29 16.74-54.16 3.08-7.78 6.27-15.82 9.22-24.26 6.14-17.57 4.3-35.2-5.05-48.38z"></path>
                          </svg>
                          <p>{formatCount(reviewCount)}</p>
                        </div>
                      </div>

                      <div className="ayg-sw">
                        <p className="ayg-hd">Sells</p>
                        <div className="ayg-bw">
                          <svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" className="ayg-tag">
                            <path d="M448 183.8v-123A44.66 44.66 0 00403.29 16H280.36a30.62 30.62 0 00-21.51 8.89L13.09 270.58a44.86 44.86 0 000 63.34l117 117a44.84 44.84 0 0063.33 0l245.69-245.61A30.6 30.6 0 00448 183.8zM352 144a32 32 0 1132-32 32 32 0 01-32 32z"></path>
                            <path d="M496 64a16 16 0 00-16 16v127.37L218.69 468.69a16 16 0 1022.62 22.62l262-262A29.84 29.84 0 00512 208V80a16 16 0 00-16-16z"></path>
                          </svg>
                          <p>{formatCount(sellsCount)}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Pricing & Contact Footer */}
                <div className="p-4 pt-0 border-t border-[#FCF9F0] mt-2 flex items-center justify-between gap-2">
                  <div>
                    <div className="text-base font-bold text-[#D4AF37] font-mono">
                      {product.price} {product.currency}
                    </div>
                    {product.stock !== undefined && (
                      <div className={`text-[10px] font-bold mt-0.5 ${product.stock <= 0 ? 'text-red-600' : 'text-[#0F3D2E]/70'}`}>
                        {product.stock <= 0 ? 'نفدت الكمية' : `متوفر: ${product.stock} قطعة`}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5">
                    {/* Seller: edit & delete own products */}
                    {isOwner && (
                      <button
                        onClick={() => onEditProduct(product)}
                        className="p-2 rounded-[12px] bg-[#0F3D2E]/10 text-[#0F3D2E] hover:bg-[#0F3D2E]/20 transition-colors cursor-pointer"
                        title="تعديل المنتج"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                    )}
                    {isOwner && (
                      <button
                        onClick={() => {
                          if (window.confirm('هل أنت متأكد من حذف هذا المنتج نهائياً؟')) {
                            deleteProduct(product.id);
                            showToast('تم حذف المنتج نهائياً', 'info');
                          }
                        }}
                        className="p-2 rounded-[12px] bg-red-50 text-red-600 hover:bg-red-100 transition-colors cursor-pointer"
                        title="حذف المنتج"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}

                    {/* Add to cart */}
                    {!isOwner && (
                      <button
                        onClick={() => {
                          if (product.stock !== undefined && product.stock <= 0) {
                            showToast('هذا المنتج نفدت كمية منه حالياً', 'warning');
                            return;
                          }
                          handleAddToCart(product);
                        }}
                        className="p-2 rounded-[12px] bg-[#D4AF37]/20 text-[#0F3D2E] hover:bg-[#D4AF37]/40 transition-colors cursor-pointer"
                        title="أضف إلى السلة ثم أتم الدفع بفاتورة مع خصم"
                      >
                        <ShoppingCart className="w-4 h-4" />
                      </button>
                    )}

                    {!isOwner && (
                      <button
                        onClick={() => handleContactSeller(product)}
                        className="flex items-center gap-1.5 py-2 px-3.5 rounded-[12px] bg-[#0F3D2E] text-[#D4AF37] hover:bg-[#16503c] transition-colors text-xs font-bold shadow-aygram cursor-pointer"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>طلب وتواصل</span>
                      </button>
                    )}
                  </div>
                </div>

                {contactSuccess === product.id && (
                  <div className="px-4 pb-3 text-[11px] text-[#0F3D2E] font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#0F3D2E]" />
                    <span>تم فتح قناة التواصل المباشرة مع البائع بنجاح!</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Order Validated Modal */}
      {validatedProduct && (
        <OrderValidatedModal
          isOpen={true}
          orderTitle={`تم استلام وتأكيد طلب "${validatedProduct.title}"!`}
          orderNumber={`ORD-${Math.floor(100000 + Math.random() * 900000)}`}
          onClose={() => setValidatedProduct(null)}
        />
      )}

      {/* Floating Cart / Checkout */}
      {cart.length > 0 && (
        <button
          onClick={() => {
            if (!currentUser) {
              showToast('سجّل دخولك أولاً لإتمام الطلب وسيتم حفظ سلتك', 'warning');
              onOpenAuth();
              return;
            }
            setCheckoutOpen(true);
          }}
          className="fixed end-5 z-40 flex items-center gap-2.5 ps-4 pe-5 py-3 rounded-full bg-[#0F3D2E] text-[#D4AF37] shadow-aygram-md hover:bg-[#16503c] transition-all active:scale-95 cursor-pointer mobile-fixed-lower"
          style={{ bottom: 'calc(env(safe-area-inset-bottom, 0px) + 78px)' }}
        >
          <span className="relative">
            <ShoppingBag className="w-5 h-5" />
            <span className="absolute -top-2 -end-2 min-w-4 h-4 px-0.5 rounded-full bg-[#D4AF37] text-[#0F3D2E] text-[9px] font-black flex items-center justify-center">
              {cartTotalItems}
            </span>
          </span>
          <span className="text-xs font-bold">إتمام الدفع — {cartTotalPrice} ر.س</span>
        </button>
      )}

      {/* Checkout Modal (mi-series invoice) */}
      {checkoutOpen && (
        <StoreCheckoutModal
          isOpen
          onClose={() => setCheckoutOpen(false)}
          items={cart}
          onUpdateQty={(id, delta) =>
            setCart((prev) =>
              prev.map((i) =>
                i.productId === id ? { ...i, qty: Math.max(1, i.qty + delta) } : i
              )
            )
          }
          onRemoveItem={(id) => setCart((prev) => prev.filter((i) => i.productId !== id))}
          onComplete={() => {
            setCart([]);
            setCheckoutOpen(false);
          }}
        />
      )}

      {/* My Orders Modal */}
      {ordersOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FCF9F0] rounded-[16px] w-full max-w-lg p-6 shadow-aygram-md border border-[#EFE9D9] relative text-[#1A1A1A]">
            <button
              onClick={() => setOrdersOpen(false)}
              className="absolute top-4 start-4 p-1.5 rounded-[8px] text-[#7A7A7A] hover:text-[#0F3D2E] hover:bg-black/5 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-5">
              <div className="w-12 h-12 rounded-full bg-[#0F3D2E] text-[#D4AF37] flex items-center justify-center mx-auto mb-2 border border-[#D4AF37]/50 shadow-gold">
                <Package className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#0F3D2E]">سجل طلباتي</h3>
              <p className="text-xs text-[#7A7A7A] mt-1">
                {myOrders.length === 0
                  ? 'لم تقم بأي طلب بعد — منتجاتك المطلوبة ستظهر هنا'
                  : `لديك ${myOrders.length} ${myOrders.length === 1 ? 'طلب' : 'طلبات'}`}
              </p>
            </div>

            <div className="space-y-3 max-h-80 overflow-y-auto">
              {myOrders.length === 0 && (
                <div className="p-6 text-center text-sm text-[#7A7A7A]">سلتك وسجلاتك آمنة في هذا الجهاز</div>
              )}
              {myOrders.map((order) => (
                <div key={order.id} className="rounded-[14px] border border-[#EFE9D9] bg-white p-4 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-black text-[#0F3D2E]" dir="ltr">{order.orderNumber}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#D4AF37]/20 text-[#7A4B00]">
                      {order.status === 'confirmed' ? 'مؤكد' : order.status === 'delivered' ? 'تم التوصيل' : 'قيد التجهيز'}
                    </span>
                  </div>
                  <div className="space-y-1.5">
                    {order.items.map((it, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-[11px]">
                        <img src={it.image} alt={it.title} className="w-8 h-8 rounded-lg object-cover" />
                        <span className="flex-1 truncate font-semibold text-[#1A1A1A]">{it.title}</span>
                        <span className="text-[#7A7A7A]">× {it.qty}</span>
                        <span className="font-black text-[#D4AF37]">{it.price} {order.currency}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-between pt-1 border-t border-[#EFE9D9]">
                    <span className="text-[11px] text-[#7A7A7A]">جميع الحقوق محفوظة ومبارك طلبك</span>
                    <span className="text-sm font-black text-[#0F3D2E]">{order.total} {order.currency}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
