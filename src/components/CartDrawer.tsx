import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, ShieldCheck, Truck, ArrowRight, ArrowLeft } from 'lucide-react';
import { CartItem, Language } from '../types';
import { OrderValidatedModal } from './OrderValidatedModal';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onCheckout: () => void;
  lang: Language;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
  lang,
}) => {
  const [showOrderValidated, setShowOrderValidated] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');

  if (!isOpen) return null;

  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);

  const handleStartCheckout = () => {
    const generatedOrderNum = 'ORD-' + Math.floor(100000 + Math.random() * 900000);
    setOrderNumber(generatedOrderNum);
    setShowOrderValidated(true);
  };

  const handleCompleteOrder = () => {
    setShowOrderValidated(false);
    onCheckout();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity duration-300"
      />

      <div className="fixed inset-y-0 end-0 max-w-full flex">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between">
          
          {/* Header */}
          <div className="p-5 border-b border-[#dee3e9] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#0064e0]" />
              <h2 className="text-lg font-bold text-[#0a1317]">
                {lang === 'ar' ? 'سلة المشتريات' : 'Shopping Cart'}
              </h2>
              <span className="text-xs bg-[#f1f4f7] text-[#5d6c7b] px-2 py-0.5 rounded-full font-bold">
                {totalItems}
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-[#5d6c7b] hover:text-[#0a1317] hover:bg-[#f1f4f7] transition-colors cursor-pointer"
              aria-label={lang === 'ar' ? 'إغلاق السلة' : 'Close cart'}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#f1f4f7] flex items-center justify-center text-[#5d6c7b]">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-[#0a1317]">
                  {lang === 'ar' ? 'سلتك فارغة حالياً' : 'Your cart is empty'}
                </h3>
                <p className="text-xs text-[#5d6c7b] max-w-xs leading-relaxed">
                  {lang === 'ar'
                    ? 'استعرض مجموعتنا من نظارات Ray-Ban Meta الذكية وخوذات الواقع المختلط وأضف ما يناسبك.'
                    : 'Explore our collection of Ray-Ban Meta AI smart glasses and mixed reality hardware.'}
                </p>
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-full bg-[#000000] text-white text-xs font-bold hover:bg-[#444950] transition-colors cursor-pointer"
                >
                  {lang === 'ar' ? 'استعراض الأجهزة الآن' : 'Start Shopping'}
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  className="bg-[#f1f4f7] rounded-[16px] p-4 flex gap-3.5 border border-[#dee3e9]"
                >
                  {/* Thumbnail */}
                  <div className="w-20 h-20 rounded-[12px] bg-white p-2 border border-[#dee3e9] shrink-0 flex items-center justify-center">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-contain"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-1">
                        <h4 className="text-sm font-bold text-[#0a1317] truncate">
                          {item.title}
                        </h4>
                        <button
                          onClick={() => onRemoveItem(item.id)}
                          className="text-[#8595a4] hover:text-[#f0284a] p-1 transition-colors cursor-pointer"
                          title={lang === 'ar' ? 'حذف' : 'Remove'}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p className="text-xs text-[#5d6c7b] mt-0.5">
                        {item.variantName}
                      </p>
                      {item.lens && (
                        <p className="text-[11px] text-[#5d6c7b]">
                          {item.lens}
                        </p>
                      )}
                      {item.storage && (
                        <p className="text-[11px] text-[#5d6c7b]">
                          {item.storage}
                        </p>
                      )}
                    </div>

                    {/* Quantity and Price */}
                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center gap-1.5 bg-white rounded-full border border-[#ced0d4] px-2 py-0.5">
                        <button
                          onClick={() => onUpdateQuantity(item.id, -1)}
                          className="text-[#5d6c7b] hover:text-[#0a1317] p-0.5 cursor-pointer"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-bold text-[#0a1317] px-1">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.id, 1)}
                          className="text-[#5d6c7b] hover:text-[#0a1317] p-0.5 cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="text-sm font-bold text-[#0a1317]">
                        ${item.price * item.quantity}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Checkout Summary */}
          {items.length > 0 && (
            <div className="p-5 border-t border-[#dee3e9] bg-white space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-[#5d6c7b]">
                  <span>{lang === 'ar' ? 'المجموع الفرعي:' : 'Subtotal:'}</span>
                  <span className="font-semibold text-[#0a1317]">${subtotal}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-[#5d6c7b]">
                  <span>{lang === 'ar' ? 'الشحن السريع (خلال 48 ساعة):' : 'Priority 2-Day Shipping:'}</span>
                  <span className="font-bold text-[#31a24c]">{lang === 'ar' ? 'مجاني' : 'FREE'}</span>
                </div>
                <div className="flex items-center justify-between text-sm font-bold text-[#0a1317] pt-2 border-t border-[#dee3e9]">
                  <span>{lang === 'ar' ? 'الإجمالي المقدر:' : 'Estimated Total:'}</span>
                  <span className="text-xl text-[#0064e0]">${subtotal}</span>
                </div>
              </div>

              {/* Cobalt Blue Checkout Button */}
              <button
                onClick={handleStartCheckout}
                className="w-full py-3.5 px-6 rounded-full bg-[#0064e0] hover:bg-[#0457cb] active:bg-[#0457cb] text-white font-bold text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span>{lang === 'ar' ? 'متابعة الدفع الآمن' : 'Proceed to Secure Checkout'}</span>
                {lang === 'ar' ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
              </button>

              <div className="flex items-center justify-center gap-4 text-[11px] text-[#5d6c7b] pt-1">
                <span className="flex items-center gap-1">
                  <Truck className="w-3.5 h-3.5 text-[#31a24c]" />
                  {lang === 'ar' ? 'توصيل مجاني' : 'Free delivery'}
                </span>
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#0064e0]" />
                  {lang === 'ar' ? 'دفع مشفر وآمن 100%' : '100% Encrypted'}
                </span>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Uiverse Order Validated Modal */}
      <OrderValidatedModal
        isOpen={showOrderValidated}
        orderNumber={orderNumber}
        orderTitle={lang === 'ar' ? 'تم تأكيد طلبك وشحنه بنجاح!' : 'Order Placed & Confirmed!'}
        onClose={handleCompleteOrder}
      />
    </div>
  );
};
