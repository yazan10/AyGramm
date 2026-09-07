import React from 'react';

interface AppDownloadCardProps {
  onNotifySoon?: () => void;
  className?: string;
}

export const AppDownloadCard: React.FC<AppDownloadCardProps> = ({
  onNotifySoon,
  className = '',
}) => {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onNotifySoon) {
      onNotifySoon();
    }
  };

  return (
    <div
      className={`rounded-2xl p-5 border border-[#D4AF37]/35 shadow-lg flex flex-col font-['IBM_Plex_Sans_Arabic'] ${className}`}
      style={{
        background: 'linear-gradient(135deg, #09261D 0%, #0F3D2E 60%, #174E3C 100%)',
      }}
      dir="rtl"
    >
      {/* Status banner */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <span className="text-[11px] font-bold text-[#D4AF37] bg-[#D4AF37]/15 px-3 py-1 rounded-full border border-[#D4AF37]/30 inline-flex items-center gap-1.5">
          <span>قيد العمل والتطوير • قريباً</span>
          <span>⏳</span>
        </span>
        <span className="text-[10px] text-stone-300/80 font-mono">v1.0 للهواتف</span>
      </div>

      <h3 className="text-white text-lg font-bold my-1 leading-snug">
        حمّل تطبيق AyGram للهواتف الذكية
      </h3>

      <p className="text-stone-200/85 text-xs leading-relaxed mb-4">
        تطبيق AyGram للهواتف الذكية قيد التطوير والعمل وسيتوفر قريبًا لكلا نظامي iOS و Android لتجربة تواصل وتجارة إلكترونية متكاملة.
      </p>

      {/* Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1 w-full">
        {/* Google Play Button */}
        <button
          type="button"
          onClick={handleClick}
          className="w-full flex items-center justify-start gap-2.5 px-3 py-2.5 rounded-xl bg-[#488aec] hover:bg-[#3b78d8] text-white transition-all shadow-[0_4px_12px_rgba(72,138,236,0.3)] cursor-pointer active:scale-98"
          title="متجر جوجل بلاي (قيد التطوير)"
        >
          <span className="w-6 h-6 shrink-0">
            <svg
              className="w-full h-full"
              viewBox="0 0 34 34"
              fill="white"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M4 28.9958V4.9125C4 4.07667 4.48167 3.34 5.19 3L19.1442 16.9542L5.19 30.9083C4.48167 30.5542 4 29.8317 4 28.9958ZM23.5642 21.3742L8.32083 30.1858L20.3483 18.1583L23.5642 21.3742ZM28.31 15.2683C28.7917 15.6508 29.1458 16.2458 29.1458 16.9542C29.1458 17.6625 28.8342 18.2292 28.3383 18.6258L25.0942 20.4958L21.5525 16.9542L25.0942 13.4125L28.31 15.2683ZM8.32083 3.7225L23.5642 12.5342L20.3483 15.75L8.32083 3.7225Z" />
            </svg>
          </span>
          <div className="flex flex-col text-start leading-none">
            <span className="text-[10px] text-blue-100 font-medium">
              قريباً على
            </span>
            <span className="text-xs font-bold text-white mt-1">
              Google Play
            </span>
          </div>
        </button>

        {/* App Store Button */}
        <button
          type="button"
          onClick={handleClick}
          className="w-full flex items-center justify-start gap-2.5 px-3 py-2.5 rounded-xl bg-white hover:bg-stone-100 text-stone-900 transition-all shadow-[0_4px_12px_rgba(0,0,0,0.15)] cursor-pointer active:scale-98"
          title="متجر آب ستور (قيد التطوير)"
        >
          <span className="w-6 h-6 shrink-0">
            <svg
              className="w-full h-full fill-black"
              viewBox="0 0 34 34"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M26.5058 27.625C25.33 29.3817 24.0833 31.0958 22.185 31.1242C20.2866 31.1667 19.6775 30.005 17.5241 30.005C15.3566 30.005 14.6908 31.0958 12.8916 31.1667C11.0358 31.2375 9.6333 29.2967 8.4433 27.5825C6.0208 24.0833 4.16497 17.6375 6.6583 13.3025C7.8908 11.1492 10.1008 9.78916 12.495 9.74666C14.3083 9.71833 16.0366 10.9792 17.1558 10.9792C18.2608 10.9792 20.3575 9.46333 22.5533 9.68999C23.4741 9.73249 26.0525 10.0583 27.71 12.495C27.5825 12.58 24.6358 14.3083 24.6641 17.8925C24.7066 22.1708 28.4183 23.6017 28.4608 23.6158C28.4183 23.715 27.8658 25.6558 26.5058 27.625ZM18.4166 4.95833C19.4508 3.78249 21.165 2.88999 22.5816 2.83333C22.7658 4.49083 22.1 6.16249 21.1083 7.35249C20.1308 8.55666 18.5158 9.49166 16.9291 9.36416C16.7166 7.73499 17.51 6.03499 18.4166 4.95833Z" />
            </svg>
          </span>
          <div className="flex flex-col text-start leading-none">
            <span className="text-[10px] text-stone-500 font-medium">
              قريباً على
            </span>
            <span className="text-xs font-bold text-stone-900 mt-1">
              App Store
            </span>
          </div>
        </button>
      </div>
    </div>
  );
};

