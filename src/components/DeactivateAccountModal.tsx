import React from 'react';

interface DeactivateAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmDeactivate: () => void;
  isProcessing?: boolean;
}

export const DeactivateAccountModal: React.FC<DeactivateAccountModalProps> = ({
  isOpen,
  onClose,
  onConfirmDeactivate,
  isProcessing = false,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200 font-['IBM_Plex_Sans_Arabic']"
      dir="rtl"
    >
      {/* Backdrop click to dismiss */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Card from Uiverse.io by Yaya12085 */}
      <div className="relative z-10 overflow-hidden bg-white text-start rounded-2xl max-w-[340px] w-full shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1),0_10px_10px_-5px_rgba(0,0,0,0.04)] border border-stone-200">
        <div className="p-6 pb-4 bg-white text-center">
          {/* Warning Icon Container */}
          <div className="flex mx-auto bg-red-100 shrink-0 justify-center items-center w-12 h-12 rounded-full mb-3">
            <svg
              aria-hidden="true"
              stroke="currentColor"
              strokeWidth="1.5"
              viewBox="0 0 24 24"
              fill="none"
              className="text-red-600 w-6 h-6"
            >
              <path
                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                strokeLinejoin="round"
                strokeLinecap="round"
              />
            </svg>
          </div>

          <div className="mt-2 text-center">
            <h3 className="text-gray-900 text-base font-bold leading-6">
              تعطيل / حذف الحساب
            </h3>
            <p className="mt-2 text-gray-500 text-xs sm:text-sm leading-5">
              هل أنت متأكد من رغبتك في تعطيل أو إيقاف حسابك في AyGram؟ سيتم إيقاف ظهور ملفك الشخصي ومنشوراتك مؤقتًا لحين إعادة تفعيلك للحساب.
            </p>
          </div>
        </div>

        {/* Actions from Uiverse */}
        <div className="p-4 bg-gray-50/80 border-t border-gray-100 flex flex-col gap-2">
          <button
            type="button"
            disabled={isProcessing}
            onClick={onConfirmDeactivate}
            className="inline-flex py-2.5 px-4 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white text-sm font-semibold justify-center w-full rounded-xl shadow-xs transition-colors cursor-pointer disabled:opacity-50"
          >
            {isProcessing ? 'جارٍ التعطيل...' : 'تعطيل الحساب الآن'}
          </button>
          <button
            type="button"
            disabled={isProcessing}
            onClick={onClose}
            className="inline-flex py-2.5 px-4 bg-white hover:bg-gray-100 text-gray-700 text-sm font-medium justify-center w-full rounded-xl border border-gray-300 shadow-xs transition-colors cursor-pointer"
          >
            إلغاء والعودة
          </button>
        </div>
      </div>
    </div>
  );
};
