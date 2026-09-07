import React, { useState } from 'react';
import { Check, Shield, Truck, RotateCcw, Sparkles, ArrowRight, ArrowLeft } from 'lucide-react';
import { Product, ProductVariant, Language } from '../types';
import { PRODUCTS } from '../data/products';

interface ProductsSectionProps {
  lang: Language;
  searchQuery: string;
  selectedProductId: string | null;
  onSelectProduct: (productId: string | null) => void;
  onAddToCart: (item: {
    productId: string;
    title: string;
    variantName: string;
    storage?: string;
    lens?: string;
    price: number;
    image: string;
  }) => void;
}

export const ProductsSection: React.FC<ProductsSectionProps> = ({
  lang,
  searchQuery,
  selectedProductId,
  onSelectProduct,
  onAddToCart,
}) => {
  const [activeCategory, setActiveCategory] = useState<'all' | 'glasses' | 'vr' | 'accessories'>('all');

  // Configurator state for selected PDP
  const activeProduct = PRODUCTS.find((p) => p.id === (selectedProductId || 'ray-ban-meta-skyler')) || PRODUCTS[0];
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(activeProduct.variants[0]);
  const [selectedStorageIndex, setSelectedStorageIndex] = useState<number>(0);
  const [selectedLensIndex, setSelectedLensIndex] = useState<number>(0);
  const [activeGalleryImage, setActiveGalleryImage] = useState<string>(activeProduct.mainImage);

  // Update variant and image when active product changes
  React.useEffect(() => {
    if (activeProduct) {
      setSelectedVariant(activeProduct.variants[0]);
      setActiveGalleryImage(activeProduct.mainImage);
      setSelectedStorageIndex(0);
      setSelectedLensIndex(0);
    }
  }, [activeProduct.id]);

  // When variant changes, update preview
  const handleVariantSelect = (variant: ProductVariant) => {
    setSelectedVariant(variant);
    setActiveGalleryImage(variant.image);
  };

  // Calculate live total price for the configurator
  const basePrice = activeProduct.basePrice;
  const storageModifier = activeProduct.storageOptions?.[selectedStorageIndex]?.priceModifier || 0;
  const lensModifier = activeProduct.lensOptions?.[selectedLensIndex]?.price || 0;
  const totalPrice = basePrice + storageModifier + lensModifier;

  // Filtered list of products
  const filteredProducts = PRODUCTS.filter((product) => {
    const matchesCategory = activeCategory === 'all' || product.category === activeCategory;
    const query = searchQuery.toLowerCase().trim();
    const matchesQuery =
      !query ||
      product.title.toLowerCase().includes(query) ||
      product.titleEn.toLowerCase().includes(query) ||
      product.description.toLowerCase().includes(query) ||
      product.descriptionEn.toLowerCase().includes(query);
    return matchesCategory && matchesQuery;
  });

  const handleAddToCart = () => {
    onAddToCart({
      productId: activeProduct.id,
      title: lang === 'ar' ? activeProduct.title : activeProduct.titleEn,
      variantName: lang === 'ar' ? selectedVariant.name : selectedVariant.nameEn,
      storage: activeProduct.storageOptions?.[selectedStorageIndex]?.size,
      lens: activeProduct.lensOptions?.[selectedLensIndex]
        ? lang === 'ar'
          ? activeProduct.lensOptions[selectedLensIndex].name
          : activeProduct.lensOptions[selectedLensIndex].nameEn
        : undefined,
      price: totalPrice,
      image: activeGalleryImage,
    });
  };

  return (
    <section className="space-y-12 pb-24 md:pb-16" id="products-catalog">
      
      {/* Category Filter Pills (button-pill-tab) */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#dee3e9] pb-6">
        <div>
          <h2 className="text-3xl font-medium tracking-tight text-[#0a1317]">
            {lang === 'ar' ? 'أجهزة وتقنيات Meta' : 'Meta Hardware Catalog'}
          </h2>
          <p className="text-sm text-[#5d6c7b] mt-1">
            {lang === 'ar'
              ? 'اختر جهازك وقم بتهيئته حسب رغبتك بالخيارات والعدسات والسعة المناسبة'
              : 'Configure your smart devices with customized frames, lenses, and storage.'}
          </p>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
          {[
            { id: 'all', label: 'الكل', labelEn: 'All Hardware' },
            { id: 'glasses', label: 'النظارات الذكية', labelEn: 'Smart Glasses' },
            { id: 'vr', label: 'الواقع المختلط (VR)', labelEn: 'VR & Mixed Reality' },
            { id: 'accessories', label: 'الملحقات', labelEn: 'Accessories' },
          ].map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id as any)}
                className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-full transition-all duration-200 cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-[#0a1317] text-white shadow-sm'
                    : 'bg-white text-[#1c1e21] border border-[#ced0d4] hover:bg-[#f1f4f7]'
                }`}
              >
                {lang === 'ar' ? cat.label : cat.labelEn}
              </button>
            );
          })}
        </div>
      </div>

      {/* Product Cards Grid (card-product-feature) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => {
          const isSelected = activeProduct.id === product.id;
          return (
            <div
              key={product.id}
              className={`group bg-white rounded-[24px] sm:rounded-[32px] p-6 border transition-all duration-300 flex flex-col justify-between hover:shadow-md ${
                isSelected
                  ? 'border-[#0064e0] ring-2 ring-[#0064e0]/20'
                  : 'border-[#dee3e9] hover:border-[#ced0d4]'
              }`}
            >
              <div className="space-y-4">
                {/* Header with Category & Badge */}
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#5d6c7b]">
                    {lang === 'ar' ? product.categoryLabel : product.categoryLabelEn}
                  </span>
                  {product.badge && (
                    <span
                      className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                        product.badgeType === 'yellow'
                          ? 'bg-[#f7b928] text-[#0a1317]'
                          : product.badgeType === 'attention'
                          ? 'bg-[#f2a918] text-white'
                          : 'bg-[#31a24c] text-white'
                      }`}
                    >
                      {product.badge}
                    </span>
                  )}
                </div>

                {/* Product Image Frame */}
                <div className="relative aspect-square rounded-[20px] bg-[#f1f4f7] overflow-hidden flex items-center justify-center p-4">
                  <img
                    src={product.mainImage}
                    alt={lang === 'ar' ? product.title : product.titleEn}
                    className="w-full h-full object-contain object-center transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                  />
                </div>

                {/* Title and Tagline */}
                <div>
                  <h3 className="text-xl font-medium tracking-tight text-[#0a1317] group-hover:text-[#0064e0] transition-colors">
                    {lang === 'ar' ? product.title : product.titleEn}
                  </h3>
                  <p className="text-xs text-[#5d6c7b] mt-1 line-clamp-2">
                    {lang === 'ar' ? product.tagline : product.taglineEn}
                  </p>
                </div>

                {/* Variants Preview Swatches */}
                {product.variants.length > 1 && (
                  <div className="flex items-center gap-1.5 pt-1">
                    {product.variants.map((v) => (
                      <span
                        key={v.id}
                        className="w-4 h-4 rounded-full border border-white shadow-xs"
                        style={{ backgroundColor: v.colorHex }}
                        title={lang === 'ar' ? v.name : v.nameEn}
                      />
                    ))}
                    <span className="text-[11px] text-[#5d6c7b] ms-1">
                      {product.variants.length} {lang === 'ar' ? 'خيارات ألوان' : 'colors'}
                    </span>
                  </div>
                )}
              </div>

              {/* Price & Action Button */}
              <div className="pt-6 border-t border-[#dee3e9] flex items-center justify-between gap-2 mt-4">
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-[#0a1317]">
                      ${product.basePrice}
                    </span>
                    {product.originalPrice && (
                      <span className="text-xs text-[#8595a4] line-through">
                        ${product.originalPrice}
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-[#31a24c] font-medium block">
                    {lang === 'ar' ? 'شحن مجاني متوفر' : 'Free shipping'}
                  </span>
                </div>

                <button
                  onClick={() => {
                    onSelectProduct(product.id);
                    // Scroll smoothly to the configurator
                    const configElem = document.getElementById('interactive-configurator');
                    if (configElem) {
                      configElem.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className={`px-4 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                    isSelected
                      ? 'bg-[#0064e0] text-white shadow-sm hover:bg-[#0457cb]'
                      : 'bg-[#0a1317] text-white hover:bg-[#444950]'
                  }`}
                >
                  <span>{isSelected ? (lang === 'ar' ? 'قيد التهيئة' : 'Configuring') : (lang === 'ar' ? 'تهيئة وشراء' : 'Configure')}</span>
                  {lang === 'ar' ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* Interactive PDP Configurator Section (product-gallery-pdp + card-checkout-summary) */}
      {/* ========================================================================= */}
      <div
        id="interactive-configurator"
        className="bg-[#f1f4f7] rounded-[24px] sm:rounded-[32px] p-6 sm:p-10 md:p-12 border border-[#dee3e9] space-y-8"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div>
            <span className="inline-block text-xs font-bold uppercase tracking-wider text-[#0064e0]">
              {lang === 'ar' ? 'المهيئ المباشر للشراء' : 'Live Hardware Configurator'}
            </span>
            <h3 className="text-2xl sm:text-3xl font-medium tracking-tight text-[#0a1317]">
              {lang === 'ar' ? activeProduct.title : activeProduct.titleEn}
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#31a24c]/15 text-[#31a24c] text-xs font-bold">
              <Check className="w-3.5 h-3.5" />
              {lang === 'ar' ? 'متوفر وجاهز للشحن الفوري' : 'In Stock & Ready to Ship'}
            </span>
          </div>
        </div>

        {/* 2-Column Split Layout: Gallery (58%) + Purchase Rail (42%) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Gallery PDP: 4-Up Thumbnails + Main View (lg:col-span-7) */}
          <div className="lg:col-span-7 flex flex-col-reverse sm:flex-row gap-4">
            
            {/* Thumbnail Strip */}
            <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-visible">
              {activeProduct.galleryImages.map((img, idx) => {
                const isCurrent = activeGalleryImage === img;
                return (
                  <button
                    key={idx}
                    onClick={() => setActiveGalleryImage(img)}
                    className={`w-18 h-18 sm:w-20 sm:h-20 rounded-[12px] bg-white p-2 border transition-all cursor-pointer shrink-0 ${
                      isCurrent
                        ? 'border-[#0a1317] ring-2 ring-[#0a1317]/20 shadow-xs'
                        : 'border-[#dee3e9] hover:border-[#ced0d4]'
                    }`}
                  >
                    <img
                      src={img}
                      alt="Thumbnail"
                      className="w-full h-full object-contain"
                      referrerPolicy="no-referrer"
                    />
                  </button>
                );
              })}
            </div>

            {/* Main Large Showcase Image */}
            <div className="flex-1 aspect-square sm:aspect-4/3 rounded-[24px] sm:rounded-[32px] bg-white border border-[#dee3e9] p-6 flex items-center justify-center relative overflow-hidden shadow-xs">
              <img
                src={activeGalleryImage}
                alt={lang === 'ar' ? activeProduct.title : activeProduct.titleEn}
                className="w-full h-full object-contain transition-all duration-300"
                referrerPolicy="no-referrer"
              />
              <div className="absolute bottom-4 start-4 bg-[#0a1317]/80 text-white text-[11px] font-bold px-3 py-1 rounded-full backdrop-blur-xs flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-[#f7b928]" />
                <span>{lang === 'ar' ? selectedVariant.name : selectedVariant.nameEn}</span>
              </div>
            </div>
          </div>

          {/* Sticky Purchase Rail (lg:col-span-5) - card-checkout-summary */}
          <div className="lg:col-span-5 bg-white rounded-[20px] sm:rounded-[24px] p-6 sm:p-8 border border-[#dee3e9] shadow-[0_2px_12px_rgba(20,22,26,0.06)] space-y-6">
            
            {/* 1. Variant Color Swatches (color-swatch-circle) */}
            {activeProduct.variants.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-[#0a1317] uppercase tracking-wider">
                    {lang === 'ar' ? 'اللون ونوع الإطار:' : 'Color & Frame Finish:'}
                  </label>
                  <span className="text-xs font-medium text-[#5d6c7b]">
                    {lang === 'ar' ? selectedVariant.name : selectedVariant.nameEn}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  {activeProduct.variants.map((variant) => {
                    const isSelected = selectedVariant.id === variant.id;
                    return (
                      <button
                        key={variant.id}
                        onClick={() => handleVariantSelect(variant)}
                        className={`w-9 h-9 rounded-full relative transition-all cursor-pointer flex items-center justify-center ${
                          isSelected
                            ? 'ring-2 ring-[#0064e0] ring-offset-2 scale-105'
                            : 'hover:scale-105'
                        }`}
                        style={{ backgroundColor: variant.colorHex }}
                        title={lang === 'ar' ? variant.name : variant.nameEn}
                      >
                        {isSelected && (
                          <Check className="w-4 h-4 text-white drop-shadow-md" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 2. Storage / Model Configuration Options (radio-option & radio-option-selected) */}
            {activeProduct.storageOptions && activeProduct.storageOptions.length > 0 && (
              <div className="space-y-3">
                <label className="text-xs font-bold text-[#0a1317] uppercase tracking-wider block">
                  {lang === 'ar' ? 'سعة التخزين:' : 'Storage Capacity:'}
                </label>
                <div className="space-y-2">
                  {activeProduct.storageOptions.map((opt, idx) => {
                    const isSelected = selectedStorageIndex === idx;
                    return (
                      <button
                        key={idx}
                        onClick={() => setSelectedStorageIndex(idx)}
                        className={`w-full text-start p-3.5 rounded-[12px] transition-all cursor-pointer flex items-center justify-between ${
                          isSelected
                            ? 'bg-[#f1f4f7] border-2 border-[#0064e0] text-[#0a1317] font-semibold'
                            : 'bg-white border border-[#ced0d4] hover:bg-[#f1f4f7] text-[#1c1e21]'
                        }`}
                      >
                        <span className="text-xs sm:text-sm">{opt.size}</span>
                        <span className="text-xs font-bold text-[#0064e0]">
                          {opt.priceModifier > 0 ? `+$${opt.priceModifier}` : (lang === 'ar' ? 'مشمول' : 'Included')}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 3. Lens Options for Smart Glasses */}
            {activeProduct.lensOptions && activeProduct.lensOptions.length > 0 && (
              <div className="space-y-3">
                <label className="text-xs font-bold text-[#0a1317] uppercase tracking-wider block">
                  {lang === 'ar' ? 'نوع العدسات البصرية:' : 'Optical Lens Type:'}
                </label>
                <div className="space-y-2">
                  {activeProduct.lensOptions.map((lens, idx) => {
                    const isSelected = selectedLensIndex === idx;
                    return (
                      <button
                        key={idx}
                        onClick={() => setSelectedLensIndex(idx)}
                        className={`w-full text-start p-3.5 rounded-[12px] transition-all cursor-pointer flex items-center justify-between ${
                          isSelected
                            ? 'bg-[#f1f4f7] border-2 border-[#0064e0] text-[#0a1317] font-semibold'
                            : 'bg-white border border-[#ced0d4] hover:bg-[#f1f4f7] text-[#1c1e21]'
                        }`}
                      >
                        <span className="text-xs sm:text-sm">
                          {lang === 'ar' ? lens.name : lens.nameEn}
                        </span>
                        <span className="text-xs font-bold text-[#0064e0]">
                          {lens.price > 0 ? `+$${lens.price}` : (lang === 'ar' ? 'مشمول' : 'Included')}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 4. Total Price & Buy CTA Button (button-buy-cta in Cobalt Blue #0064e0) */}
            <div className="pt-4 border-t border-[#dee3e9] space-y-4">
              <div className="flex items-baseline justify-between">
                <span className="text-xs text-[#5d6c7b] uppercase font-bold tracking-wider">
                  {lang === 'ar' ? 'السعر النهائي المجمّع:' : 'Configured Total:'}
                </span>
                <div className="text-right">
                  <span className="text-3xl font-bold text-[#0a1317]">
                    ${totalPrice}
                  </span>
                  <span className="text-xs text-[#5d6c7b] block">
                    {lang === 'ar' ? 'شامل الضرائب والشحن' : 'Taxes and 2-day delivery included'}
                  </span>
                </div>
              </div>

              {/* The Cobalt Blue Buy Button - ONLY for Buy Actions */}
              <button
                onClick={handleAddToCart}
                className="w-full py-4 px-8 rounded-full bg-[#0064e0] hover:bg-[#0457cb] active:bg-[#0457cb] text-white font-bold text-sm tracking-tight shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer flex items-center justify-center gap-2"
              >
                <span>{lang === 'ar' ? 'إضافة إلى سلة الشراء' : 'Add to Cart — Immediate Checkout'}</span>
                <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full font-mono">
                  ${totalPrice}
                </span>
              </button>
            </div>

            {/* Quick Reassurance Badges */}
            <div className="grid grid-cols-2 gap-3 pt-2 text-[11px] text-[#5d6c7b]">
              <div className="flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-[#31a24c]" />
                <span>{lang === 'ar' ? 'شحن فوري خلال 48 ساعة' : 'Ships within 48 hours'}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <RotateCcw className="w-3.5 h-3.5 text-[#31a24c]" />
                <span>{lang === 'ar' ? 'إرجاع سهل لمدة 30 يوماً' : '30-day hassle-free return'}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-[#0064e0]" />
                <span>{lang === 'ar' ? 'ضمان رسمي لعامين' : '2-Year official warranty'}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#f7b928]" />
                <span>{lang === 'ar' ? 'مساعد Meta AI مدمج' : 'Built-in Meta AI'}</span>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* Mobile Sticky Checkout Bar (< 768px) when configurator is active */}
      <div className="md:hidden fixed bottom-16 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-[#dee3e9] p-3.5 shadow-lg flex items-center justify-between gap-3">
        <div>
          <span className="text-[11px] text-[#5d6c7b] block font-medium">
            {lang === 'ar' ? 'المجموع النهائي:' : 'Total Price:'}
          </span>
          <span className="text-xl font-bold text-[#0a1317]">
            ${totalPrice}
          </span>
        </div>
        <button
          onClick={handleAddToCart}
          className="py-3 px-6 rounded-full bg-[#0064e0] active:bg-[#0457cb] text-white text-xs font-bold shadow-md cursor-pointer flex items-center gap-1.5 shrink-0"
        >
          <span>{lang === 'ar' ? 'إضافة إلى السلة' : 'Add to Cart'}</span>
          <span className="bg-white/20 px-1.5 py-0.5 rounded-full text-[10px] font-mono">
            ${totalPrice}
          </span>
        </button>
      </div>

    </section>
  );
};
