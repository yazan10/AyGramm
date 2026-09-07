import React, { useState, useEffect } from 'react';

interface HandLoadingScreenProps {
  isLoading: boolean;
  label?: string;
}

// Official full-page loading screen: animated platform name on top of the
// moving hand animation (Uiverse.io). Shown only once on initial open/refresh.
export const HandLoadingScreen: React.FC<HandLoadingScreenProps> = ({
  isLoading,
  label = 'جارٍ تحميل المنصة...',
}) => {
  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    if (isLoading) {
      setOpen(true);
      setClosing(false);
      // Failsafe: auto-close after 1.8s max so user is never locked out
      const autoCloseTimer = setTimeout(() => {
        setClosing(true);
        setTimeout(() => setOpen(false), 300);
      }, 1800);
      return () => clearTimeout(autoCloseTimer);
    }
    if (open) {
      setClosing(true);
      const t = setTimeout(() => {
        setClosing(false);
        setOpen(false);
      }, 400);
      return () => clearTimeout(t);
    }
  }, [isLoading, open]);

  if (!isLoading && !open) return null;

  const handleDismiss = () => {
    setClosing(true);
    setTimeout(() => setOpen(false), 200);
  };

  return (
    <div
      onClick={handleDismiss}
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#0F3D2E] transition-opacity duration-500 cursor-pointer ${
        closing ? 'opacity-0 pointer-events-none' : 'opacity-100 pointer-events-auto'
      }`}
      dir="rtl"
      title="انقر للتخطي والدخول الفوري"
    >
      <style>{`
        @keyframes handFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .aygram-loader-wrapper {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1em;
        }

        .aygram-loader-chars {
          display: flex;
          align-items: center;
          gap: 0.15em;
          font-family: system-ui, -apple-system, sans-serif;
          font-size: 2.6em;
          font-weight: 900;
          letter-spacing: 0.04em;
          text-transform: uppercase;
        }

        .aygram-loader-chars .char {
          display: inline-block;
          opacity: 0;
          transform: translateY(14px);
          animation: charReveal 0.5s cubic-bezier(0.22, 1, 0.36, 1) forwards;
          background: linear-gradient(135deg, #ffffff 0%, #D4AF37 100%);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          filter: drop-shadow(0 2px 8px rgba(212, 175, 55, 0.4));
        }

        .aygram-loader-chars .char:nth-child(1) { animation-delay: 0.1s; }
        .aygram-loader-chars .char:nth-child(2) { animation-delay: 0.25s; }
        .aygram-loader-chars .char:nth-child(3) { animation-delay: 0.4s; }
        .aygram-loader-chars .char:nth-child(4) { animation-delay: 0.55s; }
        .aygram-loader-chars .char:nth-child(5) { animation-delay: 0.7s; }
        .aygram-loader-chars .char:nth-child(6) { animation-delay: 0.85s; }

        @keyframes charReveal {
          0% {
            opacity: 0;
            transform: translateY(14px) scale(0.8);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .aygram-loader-bar-track {
          width: 9em;
          height: 3px;
          background: rgba(255, 255, 255, 0.12);
          border-radius: 9999px;
          overflow: hidden;
        }

        .aygram-loader-bar-fill {
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, #D4AF37, transparent);
          border-radius: 9999px;
          animation: barSweep 1.1s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }

        @keyframes barSweep {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>

      <div className="flex flex-col items-center justify-center p-6 space-y-10">
        {/* Animated platform name — on top */}
        <div className="aygram-loader-wrapper">
          <div className="aygram-loader-chars">
            <span className="char">A</span>
            <span className="char">y</span>
            <span className="char">G</span>
            <span className="char">r</span>
            <span className="char">a</span>
            <span className="char">m</span>
          </div>
          <div className="aygram-loader-bar-track">
            <div className="aygram-loader-bar-fill"></div>
          </div>
        </div>

        {/* Moving hand animation — below the name */}
        <div className="relative py-4">
          <div
            className="🤚"
            style={
              { '--skin-color': '#D4AF37' } as React.CSSProperties
            }
          >
            <div className="👉" />
            <div className="👉" />
            <div className="👉" />
            <div className="👉" />
            <div className="🌴" />
            <div className="👍" />
          </div>
        </div>

        {label && (
          <p className="text-xs sm:text-sm font-bold text-[#D4AF37] animate-pulse tracking-wide text-center max-w-xs">
            {label}
          </p>
        )}
      </div>
    </div>
  );
};