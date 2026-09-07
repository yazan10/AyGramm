import React, { useState, useEffect } from 'react';

interface PageTransitionLoaderProps {
  isLoading: boolean;
  message?: string;
}

export const PageTransitionLoader: React.FC<PageTransitionLoaderProps> = ({ isLoading, message }) => {
  // `open` gates whether to render at all; `closing` drives the fade-out.
  // Render immediately when isLoading flips true (no effect-delay = never "not showing").
  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    if (isLoading) {
      setOpen(true);
      setClosing(false);
      return;
    }
    if (open) {
      setClosing(true);
      const t = setTimeout(() => {
        setClosing(false);
        setOpen(false);
      }, 1200);
      return () => clearTimeout(t);
    }
  }, [isLoading, open]);

  if (!isLoading && !open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0F3D2E]/95 backdrop-blur-xl pointer-events-auto"
      dir="ltr"
      style={{
        animation: !closing ? 'fadeInLoader 1.2s ease-out forwards' : undefined,
        opacity: closing ? 0 : 1,
        transition: 'opacity 1.2s ease-in-out',
      }}
    >
      <style>{`
        @keyframes fadeInLoader {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .aygram-loader-wrapper {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.2em;
        }

        .aygram-loader-chars {
          display: flex;
          align-items: center;
          gap: 0.15em;
          font-family: system-ui, -apple-system, sans-serif;
          font-size: 3.2em;
          font-weight: 900;
          letter-spacing: 0.04em;
          text-transform: uppercase;
        }

        .aygram-loader-chars .char {
          display: inline-block;
          opacity: 0;
          transform: translateY(12px);
          animation: charReveal 0.5s cubic-bezier(0.22, 1, 0.36, 1) forwards;
          background: linear-gradient(135deg, #ffffff 0%, #D4AF37 100%);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          filter: drop-shadow(0 2px 8px rgba(212, 175, 55, 0.4));
        }

        .aygram-loader-chars .char:nth-child(1) { animation-delay: 0.15s; }
        .aygram-loader-chars .char:nth-child(2) { animation-delay: 0.35s; }
        .aygram-loader-chars .char:nth-child(3) { animation-delay: 0.55s; }
        .aygram-loader-chars .char:nth-child(4) { animation-delay: 0.75s; }
        .aygram-loader-chars .char:nth-child(5) { animation-delay: 0.95s; }
        .aygram-loader-chars .char:nth-child(6) { animation-delay: 1.15s; }

        @keyframes charReveal {
          0% {
            opacity: 0;
            transform: translateY(12px) scale(0.8);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .aygram-loader-bar-track {
          width: 10em;
          height: 3px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 9999px;
          overflow: hidden;
          opacity: 0;
          animation: charReveal 0.5s cubic-bezier(0.22, 1, 0.36, 1) forwards;
          animation-delay: 1.3s;
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

        .aygram-loader-message {
          font-family: 'IBM_Plex_Sans_Arabic', system-ui, sans-serif;
          font-size: 0.75rem;
          font-weight: 700;
          color: #D4AF37;
          letter-spacing: 0.05em;
          text-align: center;
          opacity: 0;
          animation: charReveal 0.5s cubic-bezier(0.22, 1, 0.36, 1) forwards;
          animation-delay: 1.5s;
        }
      `}</style>

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
        {message && (
          <p className="aygram-loader-message" dir="rtl">
            {message}
          </p>
        )}
      </div>
    </div>
  );
};