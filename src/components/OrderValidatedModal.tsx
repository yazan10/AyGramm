import React from 'react';

interface OrderValidatedModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderTitle?: string;
  orderNumber?: string;
  onViewHistory?: () => void;
  onTrackPackage?: () => void;
}

export const OrderValidatedModal: React.FC<OrderValidatedModalProps> = ({
  isOpen,
  onClose,
  orderTitle = 'تم تأكيد طلبك بنجاح!',
  orderNumber = 'AYG-' + Math.floor(100000 + Math.random() * 900000),
  onViewHistory,
  onTrackPackage,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200 font-['IBM_Plex_Sans_Arabic']"
      dir="rtl"
    >
      {/* Backdrop */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Card From Uiverse.io by ZstarPanda0210 */}
      <div className="relative z-10 overflow-hidden bg-white text-start rounded-2xl max-w-[320px] w-full shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1),0_10px_10px_-5px_rgba(0,0,0,0.04)] border border-stone-200">
        {/* Dismiss Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-2.5 start-2.5 w-8 h-8 flex items-center justify-center bg-white hover:bg-[#ee0d0d] text-stone-500 hover:text-white border-2 border-stone-200 hover:border-[#ee0d0d] rounded-lg text-base font-light transition-all cursor-pointer shadow-xs"
          title="إغلاق"
        >
          ×
        </button>

        <div className="p-5 pt-7">
          {/* Animated Green Circle with Checkmark */}
          <div className="flex mx-auto bg-[#e2feee] shrink-0 justify-center items-center w-12 h-12 rounded-full order-validate-animated-icon shadow-xs">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="w-7 h-7 text-[#0afa2a]"
            >
              <path
                strokeLinejoin="round"
                strokeLinecap="round"
                strokeWidth="2"
                stroke="currentColor"
                d="M20 7L9.00004 18L3.99994 13"
              />
            </svg>
          </div>

          {/* Content */}
          <div className="mt-3 text-center">
            <h3 className="text-[#066e29] text-base font-bold leading-6">
              {orderTitle}
            </h3>
            <p className="mt-0.5 text-[11px] font-mono text-stone-400">
              رقم الشحنة: {orderNumber}
            </p>
            <p className="mt-2 text-[#595b5f] text-xs leading-5">
              شكرًا لتسوقك ودعمك لتجار ومبدعي AyGram. سيتم تجهيز وتوصيل طردك خلال 48 ساعة من تأكيد الشراء.
            </p>
          </div>

          {/* Actions */}
          <div className="mt-5 space-y-2">
            <button
              type="button"
              onClick={() => {
                if (onViewHistory) onViewHistory();
                onClose();
              }}
              className="inline-flex py-2.5 px-4 bg-[#1aa06d] hover:bg-[#158057] text-white text-sm font-semibold justify-center w-full rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              سجل الطلبات والمشتريات
            </button>
            <button
              type="button"
              onClick={() => {
                if (onTrackPackage) onTrackPackage();
                onClose();
              }}
              className="inline-flex py-2.5 px-4 bg-white hover:bg-stone-50 text-[#242525] text-sm font-semibold justify-center w-full rounded-xl border border-stone-300 shadow-xs transition-colors cursor-pointer"
            >
              تتبع مسار الشحنة
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
