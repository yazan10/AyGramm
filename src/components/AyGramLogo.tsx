import React, { useState, useRef } from 'react';

interface AyGramLogoProps {
  onSecretTrigger: () => void;
  size?: 'sm' | 'md' | 'lg';
}

export const AyGramLogo: React.FC<AyGramLogoProps> = ({ onSecretTrigger, size = 'md' }) => {
  const [clickCount, setClickCount] = useState<number>(0);
  const clickTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleClick = () => {
    // Increment click counter for the 6-click secret admin entry
    const newCount = clickCount + 1;
    setClickCount(newCount);

    if (clickTimeoutRef.current) {
      clearTimeout(clickTimeoutRef.current);
    }

    if (newCount >= 6) {
      setClickCount(0);
      onSecretTrigger();
    } else {
      // Reset if user doesn't complete 6 clicks in 3 seconds
      clickTimeoutRef.current = setTimeout(() => {
        setClickCount(0);
      }, 3000);
    }
  };

  const isSmall = size === 'sm';
  const isLarge = size === 'lg';

  return (
    <div
      onClick={handleClick}
      className="flex items-center gap-2.5 cursor-pointer select-none group transition-transform active:scale-95"
      title="AyGram"
    >
      {/* Islamic Calligraphic Crescent / Leaf Icon */}
      <div
        className={`rounded-[10px] bg-[#0F3D2E] flex items-center justify-center text-[#D4AF37] shadow-aygram border border-[#D4AF37]/30 transition-all group-hover:border-[#D4AF37] ${
          isSmall ? 'w-8 h-8' : isLarge ? 'w-12 h-12' : 'w-10 h-10'
        }`}
      >
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          className={isSmall ? 'w-4 h-4' : isLarge ? 'w-6 h-6' : 'w-5 h-5'}
        >
          {/* Elegant Crescent + Star + Pen Flourish */}
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c1.82 0 3.53-.49 5-1.35-4.04-.6-7.18-4.04-7.18-8.25 0-4.14 3.03-7.53 7-8.21C15.34 2.76 13.72 2 12 2z" />
          <path d="M19 8l-1.2 2.6L15.2 11.8l2.6 1.2L19 15.6l1.2-2.6 2.6-1.2-2.6-1.2z" />
        </svg>
      </div>

      <div className="flex flex-col">
        <div className="flex items-center gap-1.5">
          <span
            className={`font-bold tracking-tight text-[#0F3D2E] font-serif ${
              isSmall ? 'text-lg' : isLarge ? 'text-2xl' : 'text-xl'
            }`}
          >
            AyGram
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
        </div>
        {!isSmall && (
          <span className="text-[11px] text-[#7A7A7A] -mt-1 font-medium">
            واحة التواصل والتجارة النبيلة
          </span>
        )}
      </div>
    </div>
  );
};
