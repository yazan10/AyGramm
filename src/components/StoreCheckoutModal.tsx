import React, { useState } from 'react';
import { X, Tag, CheckCircle2, ShoppingBag, Minus, Plus, Trash2 } from 'lucide-react';
import { useAyGram } from '../context/AyGramContext';

export interface CheckoutItem {
  productId: string;
  title: string;
  image: string;
  price: number;
  qty: number;
}

interface StoreCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CheckoutItem[];
  onUpdateQty: (productId: string, delta: number) => void;
  onRemoveItem: (productId: string) => void;
  onComplete: () => void;
}

export const StoreCheckoutModal: React.FC<StoreCheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQty,
  onRemoveItem,
  onComplete,
}) => {
  const { validatePromoCode, placeOrder, currentUser } = useAyGram();
  const [promoInput, setPromoInput] = useState('');
  const [applied, setApplied] = useState<{ code: string; percent: number; description?: string } | null>(null);
  const [promoError, setPromoError] = useState('');
  const [placed, setPlaced] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');

  if (!isOpen) return null;

  const subtotal = items.reduce((acc, it) => acc + it.price * it.qty, 0);
  const shipping = items.length > 0 ? 10 : 0;
  const tax = Math.round(subtotal * 0.07);
  const discount = applied ? Math.round((subtotal * applied.percent) / 100) : 0;
  const total = subtotal + shipping + tax - discount;
  const totalItems = items.reduce((acc, it) => acc + it.qty, 0);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    const res = validatePromoCode(promoInput);
    if (res.success && res.discountPercent !== undefined) {
      setApplied({ code: promoInput.trim().toUpperCase(), percent: res.discountPercent, description: res.description });
      setPromoError('');
    } else {
      setApplied(null);
      setPromoError(res.error || 'كود غير صالح');
    }
  };

  const handlePlaceOrder = () => {
    if (!currentUser) {
      setPlaced(false);
      return;
    }
    const order = placeOrder({
      items: items.map((i) => ({
        productId: i.productId,
        title: i.title,
        image: i.image,
        price: i.price,
        qty: i.qty,
      })),
      subtotal,
      shipping,
      tax,
      discount,
      total,
      currency: currentUser?.currency || 'SAR',
      promoCode: applied?.code,
    });
    if (order) {
      setOrderNumber(order.orderNumber);
      setPlaced(true);
    }
  };

  const handleFinish = () => {
    setPlaced(false);
    setApplied(null);
    setPromoInput('');
    setPromoError('');
    onComplete();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* mi-series style invoice (Uiverse.io by mi-series) */}
        <div className="ayg-inv overflow-hidden">
          {/* Title bar */}
          <div className="ayg-inv-title">
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>{placed ? 'تم الطلب ✅' : 'الفاتورة والدفع'}</span>
            {!placed && (
              <button
                onClick={onClose}
                className="ms-auto p-1 rounded-lg text-black/60 hover:text-black hover:bg-black/5 transition-colors cursor-pointer"
                aria-label="إغلاق"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {placed ? (
            <div className="p-8 text-center space-y-4 bg-[#F4E2DE]">
              <div className="w-16 h-16 mx-auto rounded-full bg-[#0F3D2E] text-[#D4AF37] flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-base font-black text-[#2B2B2F]">تم تأكيد طلبك بنجاح!</h3>
              <p className="text-xs font-semibold text-black/70 leading-relaxed">
                رقم الطلب: <span dir="ltr">{orderNumber}</span>
                <br />
                بارك الله فيما اشتريت وألطف بك في تعاملاتك.
              </p>
              <p className="text-[11px] font-semibold text-black/50">
                إجمالي مدفوع: <span className="font-black text-[#0F3D2E]">{total} ر.س</span>
              </p>
              <button
                onClick={handleFinish}
                className="w-full py-2.5 rounded-[10px] bg-[#0F3D2E] text-[#D4AF37] text-xs font-black hover:bg-[#16503c] transition-all cursor-pointer"
              >
                العودة للمتجر
              </button>
            </div>
          ) : (
            <>
              {/* Steps */}
              <div className="ayg-inv-steps">
                <div className="ayg-inv-step">
                  <div>
                    <span className="ayg-inv-label">عناصر السلة ({totalItems})</span>
                    <div className="space-y-2 mt-2">
                      {items.length === 0 ? (
                        <p className="text-[11px] font-bold text-black/60">سلتك فارغة</p>
                      ) : (
                        items.map((it) => (
                          <div
                            key={it.productId}
                            className="flex items-center gap-2 bg-white/60 rounded-xl p-2 border border-[#E5C7C5]"
                          >
                            <img src={it.image} alt={it.title} className="w-10 h-10 rounded-lg object-cover" />
                            <div className="flex-1 min-w-0">
                              <p className="text-[11px] font-black text-black truncate">{it.title}</p>
                              <p className="text-[10px] font-bold text-black/60">
                                {it.price} ر.س × {it.qty}
                              </p>
                            </div>
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => onUpdateQty(it.productId, -1)}
                                className="p-1 rounded-md bg-[#F3D2C9] hover:bg-[#E5C7C5] transition-colors cursor-pointer"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="text-xs font-black w-5 text-center">{it.qty}</span>
                              <button
                                onClick={() => onUpdateQty(it.productId, 1)}
                                className="p-1 rounded-md bg-[#F3D2C9] hover:bg-[#E5C7C5] transition-colors cursor-pointer"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                              <button
                                onClick={() => onRemoveItem(it.productId)}
                                className="p-1 rounded-md text-black/40 hover:text-red-600 transition-colors cursor-pointer"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  <hr className="ayg-inv-hr" />

                  <div>
                    <span className="ayg-inv-label">طريقة الدفع</span>
                    <p>الدفع عند الاستلام 💵</p>
                    <p className="text-black">تبقى أميناً على التعامل الصادق مع البائع</p>
                  </div>

                  <hr className="ayg-inv-hr" />

                  {/* Promo Code */}
                  <div>
                    <span className="ayg-inv-label flex items-center gap-1">
                      <Tag className="w-3 h-3" />
                      هل لديك كود خصم؟
                    </span>
                    <form onSubmit={handleApplyPromo} className="ayg-inv-promo-form">
                      <input
                        type="text"
                        value={promoInput}
                        onChange={(e) => setPromoInput(e.target.value)}
                        placeholder="أدخل كود البرومو"
                        className="ayg-inv-input"
                        dir="ltr"
                      />
                      <button type="submit">تطبيق</button>
                    </form>
                    {promoError && <p className="text-[10px] font-bold text-red-700 mt-1">{promoError}</p>}
                    {applied && (
                      <p className="mt-2 p-2 rounded-lg bg-[#0F3D2E] text-[#D4AF37] text-[11px] font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        تم تطبيق {applied.code} — خصم {applied.percent}%
                      </p>
                    )}
                  </div>

                  <hr className="ayg-inv-hr" />

                  {/* Payment breakdown */}
                  <div>
                    <span className="ayg-inv-label">تفاصيل الدفع</span>
                    <div className="ayg-inv-details">
                      <span>Subtotal:</span>
                      <span>{subtotal} ر.س</span>
                      <span>Shipping:</span>
                      <span>{shipping} ر.س</span>
                      <span>Tax:</span>
                      <span>{tax} ر.س</span>
                      {discount > 0 && (
                        <>
                          <span>Discount:</span>
                          <span className="text-emerald-700">-{discount} ر.س</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="ayg-inv-footer">
                <span className="ayg-inv-price">{total} ر.س</span>
                <button onClick={handlePlaceOrder} className="ayg-inv-checkout-btn">
                  إتمام الطلب
                </button>
              </div>
            </>
          )}
        </div>

        {/* Namespaced CSS (adapted from Uiverse.io by mi-series) */}
        <style>{`
          .ayg-inv {
            background: #F4E2DE;
            border-radius: 19px;
            box-shadow: 0px 187px 75px rgba(0, 0, 0, 0.01), 0px 105px 63px rgba(0, 0, 0, 0.05), 0px 47px 47px rgba(0, 0, 0, 0.09), 0px 12px 26px rgba(0, 0, 0, 0.1);
          }
          .ayg-inv-title {
            width: 100%;
            height: 44px;
            position: relative;
            display: flex;
            align-items: center;
            gap: 8px;
            padding-left: 16px;
            padding-right: 16px;
            border-bottom: 1px solid #E5C7C5;
            font-weight: 800;
            font-size: 12px;
            color: #000;
          }
          .ayg-inv-steps {
            padding: 16px;
          }
          .ayg-inv-step {
            display: grid;
            gap: 12px;
          }
          .ayg-inv-label {
            font-size: 12px;
            font-weight: 800;
            color: #000;
            margin-bottom: 6px;
            display: block;
            letter-spacing: 0.3px;
          }
          .ayg-inv-step p {
            font-size: 11px;
            font-weight: 700;
            color: #000;
            margin: 2px 0;
          }
          .ayg-inv-hr {
            height: 1px;
            background-color: #E5C7C5;
            border: none;
            margin: 0;
          }
          .ayg-inv-promo-form {
            display: grid;
            grid-template-columns: 1fr 74px;
            gap: 8px;
            padding: 0;
          }
          .ayg-inv-input {
            width: auto;
            height: 34px;
            padding: 0 0 0 12px;
            border-radius: 5px;
            outline: none;
            border: 1px solid #E5C7C5;
            background-color: #F4E2DE;
            transition: all 0.3s cubic-bezier(0.15, 0.83, 0.66, 1);
            font-size: 11px;
          }
          .ayg-inv-input:focus {
            border: 1px solid transparent;
            box-shadow: 0px 0px 0px 2px #F3D2C9;
            background-color: #ffffff;
          }
          .ayg-inv-promo-form button {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 100%;
            height: 34px;
            background: #F3D2C9;
            border-radius: 5px;
            border: 0;
            font-weight: 800;
            font-size: 12px;
            color: #000;
            cursor: pointer;
            transition: all 0.2s;
          }
          .ayg-inv-promo-form button:hover { background: #E5C7C5; }
          .ayg-inv-details {
            display: grid;
            grid-template-columns: 1fr auto;
            gap: 5px;
          }
          .ayg-inv-details span:nth-child(odd) {
            font-size: 12px;
            font-weight: 700;
            color: #000;
            margin: auto auto auto 0;
          }
          .ayg-inv-details span:nth-child(even) {
            font-size: 13px;
            font-weight: 800;
            color: #000;
            margin: auto 0 auto auto;
          }
          .ayg-inv-footer {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 10px 10px 10px 16px;
            background-color: #ECC2C0;
            border-radius: 0 0 19px 19px;
          }
          .ayg-inv-price {
            font-size: 20px;
            color: #2B2B2F;
            font-weight: 900;
          }
          .ayg-inv-checkout-btn {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 150px;
            height: 36px;
            background: #F3D2C9;
            border-radius: 7px;
            border: 1px solid #ECC2C0;
            color: #000;
            font-size: 12px;
            font-weight: 800;
            cursor: pointer;
            transition: all 0.3s cubic-bezier(0.15, 0.83, 0.66, 1);
          }
          .ayg-inv-checkout-btn:hover {
            background: #0F3D2E;
            color: #D4AF37;
            border-color: #0F3D2E;
          }
          .ayg-inv-checkout-btn:active { transform: scale(0.97); }
        `}</style>
      </div>
    </div>
  );
};