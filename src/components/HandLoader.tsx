import React from 'react';

interface HandLoaderProps {
  label?: string;
  fullscreen?: boolean;
}

export const HandLoader: React.FC<HandLoaderProps> = ({
  label = 'جارٍ التحميل في AyGram...',
  fullscreen = false,
}) => {
  const content = (
    <div className="flex flex-col items-center justify-center p-6 space-y-6">
      {/* Hand tapping animation from Uiverse.io by Pradeepsaranbishnoi */}
      <div className="relative py-4">
        <div className="🤚">
          <div className="👉" />
          <div className="👉" />
          <div className="👉" />
          <div className="👉" />
          <div className="🌴" />
          <div className="👍" />
        </div>
      </div>

      {label && (
        <p className="text-xs sm:text-sm font-bold text-[#0F3D2E] animate-pulse tracking-wide text-center">
          {label}
        </p>
      )}
    </div>
  );

  if (fullscreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#FCF9F0]/80 backdrop-blur-xs">
        {content}
      </div>
    );
  }

  return content;
};
