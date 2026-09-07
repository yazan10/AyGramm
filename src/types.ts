export type Language = 'ar' | 'en';

export type PageTab = 'home' | 'products' | 'about' | 'contact';

export interface ProductVariant {
  id: string;
  name: string;
  nameEn: string;
  colorHex: string;
  image: string;
}

export interface StorageOption {
  size: string;
  priceModifier: number;
}

export interface Product {
  id: string;
  title: string;
  titleEn: string;
  category: 'glasses' | 'vr' | 'accessories';
  categoryLabel: string;
  categoryLabelEn: string;
  tagline: string;
  taglineEn: string;
  description: string;
  descriptionEn: string;
  basePrice: number;
  originalPrice?: number;
  badge?: string;
  badgeType?: 'yellow' | 'attention' | 'success';
  mainImage: string;
  galleryImages: string[];
  variants: ProductVariant[];
  storageOptions?: StorageOption[];
  lensOptions?: { name: string; nameEn: string; price: number }[];
  features: { icon: string; title: string; titleEn: string; desc: string; descEn: string }[];
  specs: { label: string; labelEn: string; value: string; valueEn: string }[];
}

export interface CartItem {
  id: string;
  productId: string;
  title: string;
  variantName: string;
  storage?: string;
  lens?: string;
  price: number;
  image: string;
  quantity: number;
}

export interface Testimonial {
  id: string;
  name: string;
  nameEn: string;
  role: string;
  roleEn: string;
  avatar: string;
  quote: string;
  quoteEn: string;
  rating: number;
}

export interface FAQItem {
  id: string;
  question: string;
  questionEn: string;
  answer: string;
  answerEn: string;
  category: string;
}
