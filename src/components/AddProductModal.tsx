import React, { useState } from 'react';
import { X, ShoppingBag, AlertCircle, CheckCircle2, Image } from 'lucide-react';
import { useAyGram } from '../context/AyGramContext';
import { Product } from '../types/aygram';
import { compressImageFile } from '../utils/imageCompress';

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: Product | null;
}

const PRESET_PRODUCT_IMAGES = [
  { label: 'مصحف شريف فاخر مذهب', url: 'https://images.unsplash.com/photo-1584286595398-a59f21d313f5?auto=format&fit=crop&w=800&q=80' },
  { label: 'دهن عود وبخور فاخر', url: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=800&q=80' },
  { label: 'سجادة صلاة مبطنة طبية', url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80' },
  { label: 'لوحة خط آية الكرسي', url: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=800&q=80' },
  { label: 'سبحة كهرمان حر أصلي', url: 'https://images.unsplash.com/photo-1590402494682-cd3fb53b1f70?auto=format&fit=crop&w=800&q=80' },
];

const SHOP_CATEGORIES = [
  'لوحات وفنون إسلامية',
  'عطور وبخور',
  'سجاد ومستلزمات صلاة',
  'مصاحف وكتب قيّمة',
  'أزياء وملابس محتشمة',
  'هدايا ومناسبات دينية',
];

export const AddProductModal: React.FC<AddProductModalProps> = ({ isOpen, onClose, product }) => {
  const { createProduct, updateProduct } = useAyGram();
  const isEditing = Boolean(product);

  const [title, setTitle] = useState(product?.title || '');
  const [description, setDescription] = useState(product?.description || '');
  const [price, setPrice] = useState(product ? String(product.price) : '');
  const [stock, setStock] = useState(product?.stock !== undefined ? String(product.stock) : '');
  const [category, setCategory] = useState(product?.category || SHOP_CATEGORIES[0]);
  const [selectedImage, setSelectedImage] = useState(
    product?.images && product.images.length > 0 ? product.images[0] : PRESET_PRODUCT_IMAGES[0].url
  );
  const [customImageUrl, setCustomImageUrl] = useState('');
  const [uploading, setUploading] = useState(false);

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  if (!isOpen) return null;

  const handleFileUpload = async (file: File) => {
    setUploading(true);
    setError('');
    try {
      const compressed = await compressImageFile(file, { maxDimension: 900, quality: 0.8 });
      setSelectedImage(compressed);
      setCustomImageUrl('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'تعذر رفع الصورة');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const numPrice = parseFloat(price);
    if (!title.trim() || !description.trim() || isNaN(numPrice) || numPrice <= 0) {
      setError('يرجى ملء جميع الحقول وسعر صحيح');
      return;
    }
    const numStock = stock.trim() === '' ? undefined : Math.max(0, parseInt(stock, 10) || 0);
    const finalImage = customImageUrl.trim() || selectedImage;

    if (isEditing && product) {
      updateProduct(product.id, {
        title: title.trim(),
        description: description.trim(),
        price: numPrice,
        category,
        images: [finalImage],
        stock: numStock,
      });
      setSuccess('تم حفظ تعديلات المنتج بنجاح! وسيُعتمد من جديد بعد المراجعة الشرعية.');
      setTimeout(() => {
        onClose();
      }, 2000);
      return;
    }

    const res = createProduct({
      title: title.trim(),
      description: description.trim(),
      price: numPrice,
      category,
      images: [finalImage],
      stock: numStock,
    });

    if (res.success) {
      if (res.isPending) {
        setSuccess('تم تقديم المنتج بنجاح! وهو قيد المراجعة الشرعية من قِبل المشرف وسيظهر في المتجر فور اعتماده.');
      } else {
        setSuccess('تم نشر المنتج في المتجر الإسلامي بنجاح!');
      }
      setTimeout(() => {
        onClose();
      }, 2000);
    } else {
      setError(res.error || 'تعذر إضافة المنتج');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[#FCF9F0] rounded-[16px] max-w-lg w-full p-6 shadow-aygram-md border border-[#EFE9D9] relative text-[#1A1A1A]">
        
        <button
          onClick={onClose}
          className="absolute top-4 start-4 p-1.5 rounded-[8px] text-[#7A7A7A] hover:text-[#0F3D2E] hover:bg-black/5 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-5">
          <div className="w-12 h-12 rounded-full bg-[#0F3D2E] text-[#D4AF37] flex items-center justify-center mx-auto mb-2 border border-[#D4AF37]/50 shadow-gold">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-[#0F3D2E]">
            {isEditing ? 'تعديل المنتج المعروض' : 'عرض منتج في متجر AyGram'}
          </h3>
          <p className="text-xs text-[#7A7A7A] mt-1">
            {isEditing
              ? 'عدّل بيانات المنتج وسيعاد اعتماده بعد المراجعة الشرعية'
              : 'اختر المنتجات المباحة شرعاً والمطابقة للأوصاف الحقيقية'}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-[12px] bg-[#E8B4B8]/30 border border-[#E8B4B8] text-xs font-medium text-[#0F3D2E] flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-[#0F3D2E] shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 rounded-[12px] bg-[#0F3D2E]/10 border border-[#0F3D2E]/30 text-xs font-medium text-[#0F3D2E] flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#0F3D2E] shrink-0" />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-xs font-bold text-[#1A1A1A] mb-1">
              اسم المنتج أو السلعة
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="مثال: مصحف التهجد بخط عثماني وتذهيب فاخر"
              className="w-full py-2 px-3.5 rounded-[12px] bg-white border border-[#EFE9D9] text-xs focus:outline-none focus:border-[#0F3D2E]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#1A1A1A] mb-1">
                السعر (بالريال السعودي)
              </label>
              <input
                type="number"
                min="1"
                step="0.5"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="150"
                className="w-full py-2 px-3.5 rounded-[12px] bg-white border border-[#EFE9D9] text-xs focus:outline-none focus:border-[#0F3D2E]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1A1A1A] mb-1">
                الكمية المتوفرة (اختياري)
              </label>
              <input
                type="number"
                min="0"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                placeholder="فارغ = كمية غير محدودة"
                className="w-full py-2 px-3.5 rounded-[12px] bg-white border border-[#EFE9D9] text-xs focus:outline-none focus:border-[#0F3D2E]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1A1A1A] mb-1">
                التصنيف
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full py-2 px-3 rounded-[12px] bg-white border border-[#EFE9D9] text-xs focus:outline-none focus:border-[#0F3D2E]"
              >
                {SHOP_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#1A1A1A] mb-1">
              وصف دقيق للمنتج ومواصفاته
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="اذكر تفاصيل المقاسات، الخامة، المصدر، والضمان..."
              className="w-full py-2 px-3.5 rounded-[12px] bg-white border border-[#EFE9D9] text-xs focus:outline-none focus:border-[#0F3D2E] resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#1A1A1A] mb-1.5">
              صورة المنتج الرئيسية:
            </label>
            <div className="grid grid-cols-5 gap-2">
              {PRESET_PRODUCT_IMAGES.map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    setSelectedImage(item.url);
                    setCustomImageUrl('');
                  }}
                  className={`aspect-square rounded-[8px] overflow-hidden cursor-pointer border-2 transition-all ${
                    selectedImage === item.url && !customImageUrl
                      ? 'border-[#D4AF37] ring-2 ring-[#0F3D2E]'
                      : 'border-transparent hover:opacity-80'
                  }`}
                >
                  <img src={item.url} alt={item.label} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>

            <div className="pt-2 space-y-2">
              <input
                type="url"
                value={customImageUrl}
                onChange={(e) => {
                  setCustomImageUrl(e.target.value);
                  setSelectedImage('');
                }}
                placeholder="أو ضع رابط صورة خارجية للمنتج (URL)..."
                className="w-full py-1.5 px-3 rounded-[8px] bg-white border border-[#EFE9D9] text-xs focus:outline-none focus:border-[#0F3D2E]"
              />
              <label className="flex items-center justify-center gap-2 w-full py-2 rounded-[10px] bg-[#0F3D2E]/5 border border-dashed border-[#0F3D2E]/40 text-[#0F3D2E] text-xs font-bold hover:bg-[#0F3D2E]/10 transition-colors cursor-pointer">
                <Image className="w-4 h-4" />
                <span>{uploading ? 'جارِ ضغط الصورة ورفعها...' : 'رفع صورة من جهازك (تُضغط تلقائياً)'}</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files && e.target.files[0];
                    if (file) void handleFileUpload(file);
                    e.target.value = '';
                  }}
                />
              </label>
            </div>
          </div>

          <div className="p-2.5 rounded-[10px] bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-[11px] text-[#0F3D2E] leading-relaxed">
            💡 <strong>تنبيه الأمانة:</strong> تخضع كافة المنتجات لمطابقة الضوابط الشرعية وحماية المستهلك لضمان عدم وجود ربا أو غش أو مواد محرمة.
          </div>

          <div className="flex gap-2 pt-1">
            <button
              type="submit"
              className="flex-1 py-2.5 px-4 rounded-[12px] bg-[#0F3D2E] text-[#D4AF37] font-bold text-xs hover:bg-[#16503c] transition-colors shadow-aygram cursor-pointer"
            >
              {isEditing ? 'حفظ التعديلات وإعادة المراجعة' : 'تقديم المنتج للمراجعة'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="py-2.5 px-4 rounded-[12px] bg-white border border-[#EFE9D9] text-[#7A7A7A] font-medium text-xs hover:bg-black/5 transition-colors cursor-pointer"
            >
              إلغاء
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
