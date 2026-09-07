import React from 'react';
import { Palette } from 'lucide-react';

export const PROFILE_COLORS = [
  '#0F3D2E', // الكلاسيكي (أخضر زيتي AyGram)
  '#e11d48',
  '#f472b6',
  '#fb923c',
  '#facc15',
  '#84cc16',
  '#10b981',
  '#0ea5e9',
  '#3b82f6',
  '#8b5cf6',
  '#a78bfa',
];

interface ProfileColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  className?: string;
}

export const ProfileColorPicker: React.FC<ProfileColorPickerProps> = ({
  value,
  onChange,
  className,
}) => {
  return (
    <div className={className}>
      <div className="flex items-center gap-1.5 mb-2 text-xs font-bold text-[#0F3D2E]">
        <Palette className="w-4 h-4 text-[#D4AF37]" />
        <span>لون ملفك الشخصي (ثيم البروفايل):</span>
      </div>

      {/* From Uiverse.io by chase2k25 */}
      <style>{`
        .pck-comic-panel {
          background: #ffffff;
          border: 3px solid #0F3D2E;
          padding: 1rem 0.9rem;
          border-radius: 10px;
          box-shadow: 4px 4px 0px rgba(15, 61, 46, 0.9);
          display: inline-block;
        }
        .pck-container-items {
          display: flex;
          flex-wrap: wrap;
          transform-style: preserve-3d;
          transform: perspective(1000px);
          justify-content: center;
        }
        .pck-item-color {
          position: relative;
          flex-shrink: 0;
          width: 34px;
          height: 42px;
          border: none;
          outline: none;
          margin: -3px;
          background-color: transparent;
          transition: 300ms ease-out;
          cursor: pointer;
          -webkit-tap-highlight-color: transparent;
        }
        .pck-item-color::after {
          position: absolute;
          content: "";
          inset: 0;
          width: 34px;
          height: 34px;
          background-color: var(--color);
          border-radius: 6px;
          border: 2px solid #0F3D2E;
          box-shadow: 3px 3px 0 0 #0F3D2E;
          pointer-events: none;
          transition: 300ms cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        .pck-item-color::before {
          position: absolute;
          content: attr(aria-color);
          left: 50%;
          bottom: 52px;
          font-size: 13px;
          letter-spacing: 1px;
          line-height: 1;
          padding: 5px 8px;
          background-color: #F6E7B6;
          color: #0F3D2E;
          border: 2px solid #0F3D2E;
          border-radius: 6px;
          pointer-events: none;
          opacity: 0;
          visibility: hidden;
          transform-origin: bottom center;
          transition:
            all 300ms cubic-bezier(0.175, 0.885, 0.32, 1.275),
            opacity 300ms ease-out,
            visibility 300ms ease-out;
          transform: translateX(-50%) scale(0.5) translateY(10px);
          white-space: nowrap;
          z-index: 20;
        }
        .pck-item-color:hover {
          transform: scale(1.5) translateY(-5px);
          z-index: 99999;
        }
        .pck-item-color:hover::before {
          opacity: 1;
          visibility: visible;
          transform: translateX(-50%) scale(1) translateY(0);
        }
        .pck-item-color:active::after {
          transform: translate(2px, 2px);
          box-shadow: 1px 1px 0 0 #0F3D2E;
        }
        .pck-item-color:focus::before {
          content: "تم!";
          opacity: 1;
          visibility: visible;
          background-color: #a7f3d0;
          transform: translateX(-50%) scale(1) translateY(0);
        }
        .pck-item-color:hover + .pck-item-color {
          transform: scale(1.3) translateY(-3px);
          z-index: 9999;
        }
        .pck-item-color:hover + * + .pck-item-color {
          transform: scale(1.15);
          z-index: 999;
        }
        .pck-item-color:has(+ *:hover) {
          transform: scale(1.3) translateY(-3px);
          z-index: 9999;
        }
        .pck-item-color:has(+ * + *:hover) {
          transform: scale(1.15);
          z-index: 999;
        }
        .pck-item-color.pck-selected::after {
          box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.7), 3px 3px 0 0 #0F3D2E;
        }
      `}</style>

      <div className="pck-comic-panel">
        <div className="pck-container-items">
          {PROFILE_COLORS.map((color) => (
            <button
              key={color}
              type="button"
              style={{ '--color': color } as React.CSSProperties}
              aria-color={color}
              aria-label={`تغيير لون الملف إلى ${color}`}
              onClick={() => onChange(color)}
              className={`pck-item-color ${value === color ? 'pck-selected' : ''}`}
            />
          ))}
        </div>
        <div className="mt-1.5 text-[10px] text-stone-400 text-center">
          الحرص على جمال ملفك: اختَر اللون الذي يميز صفحة ملفك الشخصي.
        </div>
      </div>
    </div>
  );
};