import React from 'react';
import { Compass, Home, ArrowRight } from 'lucide-react';
import { useAyGram } from '../context/AyGramContext';

interface NotFound404ViewProps {
  onBackToExplore?: () => void;
}

export const NotFound404View: React.FC<NotFound404ViewProps> = ({ onBackToExplore }) => {
  const { setActiveView, currentUser } = useAyGram();

  const handleGoHome = () => {
    if (onBackToExplore) {
      onBackToExplore();
    } else {
      setActiveView(currentUser ? 'home' : 'explore');
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 py-8 select-none text-center font-['IBM_Plex_Sans_Arabic']" dir="rtl">
      {/* Scoped CSS for the retro TV 404 from Uiverse.io by Praashoo7 */}
      <style>{`
        .uiverse-404-wrapper {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          max-width: 30em;
          height: 24em;
          position: relative;
          transform: scale(0.85);
        }
        @media (max-width: 640px) {
          .uiverse-404-wrapper {
            transform: scale(0.7);
            height: 20em;
          }
        }
        @media (max-width: 400px) {
          .uiverse-404-wrapper {
            transform: scale(0.58);
            height: 18em;
          }
        }

        .tv-main {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          margin-top: 3.5em;
          position: relative;
        }

        .tv-antenna {
          width: 5em;
          height: 5em;
          border-radius: 50%;
          border: 2px solid black;
          background-color: #f27405;
          margin-bottom: -6em;
          margin-left: 0em;
          z-index: 1;
          position: relative;
        }
        .tv-antenna_shadow {
          position: absolute;
          background-color: transparent;
          width: 50px;
          height: 56px;
          margin-left: 1.68em;
          border-radius: 45%;
          transform: rotate(140deg);
          border: 4px solid transparent;
          box-shadow:
            inset 0px 16px #a85103,
            inset 0px 16px 1px 1px #a85103;
        }
        .tv-antenna::after {
          content: "";
          position: absolute;
          margin-top: 0.8em;
          margin-left: 0.4em;
          transform: rotate(-25deg);
          width: 1em;
          height: 0.5em;
          border-radius: 50%;
          background-color: #f69e50;
        }
        .tv-antenna::before {
          content: "";
          position: absolute;
          margin-top: 0.2em;
          margin-left: 1.25em;
          transform: rotate(-20deg);
          width: 1.5em;
          height: 0.8em;
          border-radius: 50%;
          background-color: #f69e50;
        }
        .tv-a1 {
          position: relative;
          top: -102%;
          left: -130%;
          width: 12em;
          height: 5.5em;
          border-radius: 50px;
          background-image: linear-gradient(
            #171717,
            #171717,
            #353535,
            #353535,
            #171717
          );
          transform: rotate(-29deg);
          clip-path: polygon(50% 0%, 49% 100%, 52% 100%);
        }
        .tv-a1d {
          position: relative;
          top: -211%;
          left: -35%;
          transform: rotate(45deg);
          width: 0.5em;
          height: 0.5em;
          border-radius: 50%;
          border: 2px solid black;
          background-color: #979797;
          z-index: 99;
        }
        .tv-a2 {
          position: relative;
          top: -210%;
          left: -10%;
          width: 12em;
          height: 4em;
          border-radius: 50px;
          background-color: #171717;
          background-image: linear-gradient(
            #171717,
            #171717,
            #353535,
            #353535,
            #171717
          );
          margin-right: 5em;
          clip-path: polygon(
            47% 0,
            47% 0,
            34% 34%,
            54% 25%,
            32% 100%,
            29% 96%,
            49% 32%,
            30% 38%
          );
          transform: rotate(-8deg);
        }
        .tv-a2d {
          position: relative;
          top: -294%;
          left: 94%;
          width: 0.5em;
          height: 0.5em;
          border-radius: 50%;
          border: 2px solid black;
          background-color: #979797;
          z-index: 99;
        }

        .tv-notfound_text {
          background-color: black;
          padding-left: 0.5em;
          padding-right: 0.5em;
          font-size: 0.75em;
          color: white;
          letter-spacing: 0.05em;
          border-radius: 5px;
          z-index: 10;
        }
        .tv-box {
          width: 17em;
          height: 9em;
          margin-top: 3em;
          border-radius: 15px;
          background-color: #d36604;
          display: flex;
          justify-content: center;
          border: 2px solid #1d0e01;
          box-shadow: inset 0.2em 0.2em #e69635;
          position: relative;
          z-index: 2;
        }
        .tv-box::after {
          content: "";
          position: absolute;
          width: 17em;
          height: 9em;
          border-radius: 15px;
          background:
            repeating-radial-gradient(#d36604 0 0.0001%, #00000070 0 0.0002%) 50% 0/2500px 2500px,
            repeating-conic-gradient(#d36604 0 0.0001%, #00000070 0 0.0002%) 60% 60%/2500px 2500px;
          background-blend-mode: difference;
          opacity: 0.09;
        }
        .tv-curve_svg {
          position: absolute;
          margin-top: 0.25em;
          margin-left: -0.25em;
          height: 12px;
          width: 12px;
          fill: #1d0e01;
        }
        .tv-display_div {
          display: flex;
          align-items: center;
          align-self: center;
          justify-content: center;
          border-radius: 15px;
          box-shadow: 3.5px 3.5px 0px #e69635;
          margin-left: 0.5em;
        }
        .tv-screen_out1 {
          width: 11em;
          height: 7.75em;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 10px;
        }
        .tv-screen {
          width: 13em;
          height: 7.85em;
          border: 2px solid #1d0e01;
          background:
            repeating-radial-gradient(#000 0 0.0001%, #ffffff 0 0.0002%) 50% 0/2500px 2500px,
            repeating-conic-gradient(#000 0 0.0001%, #ffffff 0 0.0002%) 60% 60%/2500px 2500px;
          background-blend-mode: difference;
          animation: tv-b 0.2s infinite alternate;
          border-radius: 10px;
          z-index: 99;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          color: #252525;
          letter-spacing: 0.15em;
          text-align: center;
        }

        .tv-screenM {
          width: 13em;
          height: 7.85em;
          position: relative;
          background: linear-gradient(
            to right,
            #002fc6 0%,
            #002bb2 14.2857142857%,
            #3a3a3a 14.2857142857%,
            #303030 28.5714285714%,
            #ff0afe 28.5714285714%,
            #f500f4 42.8571428571%,
            #6c6c6c 42.8571428571%,
            #626262 57.1428571429%,
            #0affd9 57.1428571429%,
            #00f5ce 71.4285714286%,
            #3a3a3a 71.4285714286%,
            #303030 85.7142857143%,
            white 85.7142857143%,
            #fafafa 100%
          );
          border-radius: 10px;
          border: 2px solid black;
          z-index: 99;
          display: none;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          color: #252525;
          letter-spacing: 0.15em;
          text-align: center;
          overflow: hidden;
        }
        .tv-screenM:before,
        .tv-screenM:after {
          content: "";
          position: absolute;
          left: 0;
          z-index: 1;
          width: 100%;
        }
        .tv-screenM:before {
          top: 0;
          height: 68.4782608696%;
          background: linear-gradient(
            to right,
            white 0%,
            #fafafa 14.2857142857%,
            #ffe60a 14.2857142857%,
            #f5dc00 28.5714285714%,
            #0affd9 28.5714285714%,
            #00f5ce 42.8571428571%,
            #10ea00 42.8571428571%,
            #0ed600 57.1428571429%,
            #ff0afe 57.1428571429%,
            #f500f4 71.4285714286%,
            #ed0014 71.4285714286%,
            #d90012 85.7142857143%,
            #002fc6 85.7142857143%,
            #002bb2 100%
          );
        }
        .tv-screenM:after {
          bottom: 0;
          height: 21.7391304348%;
          background: linear-gradient(
            to right,
            #006c6b 0%,
            #005857 16.6666666667%,
            white 16.6666666667%,
            #fafafa 33.3333333333%,
            #001b75 33.3333333333%,
            #001761 50%,
            #6c6c6c 50%,
            #626262 66.6666666667%,
            #929292 66.6666666667%,
            #888888 83.3333333333%,
            #3a3a3a 83.3333333333%,
            #303030 100%
          );
        }

        @keyframes tv-b {
          100% {
            background-position: 50% 0, 60% 50%;
          }
        }

        .tv-lines {
          display: flex;
          column-gap: 0.1em;
          align-self: flex-end;
          margin-bottom: 0.5em;
        }
        .tv-line1,
        .tv-line3 {
          width: 2px;
          height: 0.5em;
          background-color: black;
          border-radius: 25px 25px 0px 0px;
          margin-top: 0.5em;
        }
        .tv-line2 {
          flex-grow: 1;
          width: 2px;
          height: 1em;
          background-color: black;
          border-radius: 25px 25px 0px 0px;
        }

        .tv-buttons_div {
          width: 4.25em;
          align-self: center;
          height: 8em;
          background-color: #e69635;
          border: 2px solid #1d0e01;
          padding: 0.6em;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          row-gap: 0.75em;
          box-shadow: 3px 3px 0px #e69635;
          margin-right: 0.5em;
        }
        .tv-b1 {
          width: 1.65em;
          height: 1.65em;
          border-radius: 50%;
          background-color: #7f5934;
          border: 2px solid black;
          box-shadow: inset 2px 2px 1px #b49577, -2px 0px #513721, -2px 0px 0px 1px black;
          position: relative;
        }
        .tv-b1::before {
          content: "";
          position: absolute;
          margin-top: 1em;
          margin-left: 0.5em;
          transform: rotate(47deg);
          border-radius: 5px;
          width: 0.1em;
          height: 0.4em;
          background-color: #000000;
        }
        .tv-b1::after {
          content: "";
          position: absolute;
          margin-top: 0.9em;
          margin-left: 0.8em;
          transform: rotate(47deg);
          border-radius: 5px;
          width: 0.1em;
          height: 0.55em;
          background-color: #000000;
        }
        .tv-b1 div {
          content: "";
          position: absolute;
          margin-top: -0.1em;
          margin-left: 0.65em;
          transform: rotate(45deg);
          width: 0.15em;
          height: 1.5em;
          background-color: #000000;
        }
        .tv-b2 {
          width: 1.65em;
          height: 1.65em;
          border-radius: 50%;
          background-color: #7f5934;
          border: 2px solid black;
          box-shadow: inset 2px 2px 1px #b49577, -2px 0px #513721, -2px 0px 0px 1px black;
          position: relative;
        }
        .tv-b2::before {
          content: "";
          position: absolute;
          margin-top: 1.05em;
          margin-left: 0.8em;
          transform: rotate(-45deg);
          border-radius: 5px;
          width: 0.15em;
          height: 0.4em;
          background-color: #000000;
        }
        .tv-b2::after {
          content: "";
          position: absolute;
          margin-top: -0.1em;
          margin-left: 0.65em;
          transform: rotate(-45deg);
          width: 0.15em;
          height: 1.5em;
          background-color: #000000;
        }
        .tv-speakers {
          display: flex;
          flex-direction: column;
          row-gap: 0.5em;
        }
        .tv-speakers .tv-g1 {
          display: flex;
          column-gap: 0.25em;
        }
        .tv-speakers .tv-g1 .tv-g11,
        .tv-speakers .tv-g1 .tv-g12,
        .tv-speakers .tv-g1 .tv-g13 {
          width: 0.65em;
          height: 0.65em;
          border-radius: 50%;
          background-color: #7f5934;
          border: 2px solid black;
          box-shadow: inset 1.25px 1.25px 1px #b49577;
        }
        .tv-speakers .tv-g {
          width: auto;
          height: 2px;
          background-color: #171717;
        }

        .tv-bottom {
          width: 100%;
          height: auto;
          display: flex;
          align-items: center;
          justify-content: center;
          column-gap: 8.7em;
          position: relative;
          z-index: 1;
        }
        .tv-base1,
        .tv-base2 {
          height: 1em;
          width: 2em;
          border: 2px solid #171717;
          background-color: #4d4d4d;
          margin-top: -0.15em;
          z-index: -1;
        }
        .tv-base3 {
          position: absolute;
          height: 0.15em;
          width: 17.5em;
          background-color: #171717;
          margin-top: 0.8em;
        }

        .tv-text_404 {
          position: absolute;
          display: flex;
          flex-direction: row;
          column-gap: 5.5em;
          z-index: 0;
          margin-bottom: 2em;
          align-items: center;
          justify-content: center;
          opacity: 0.18;
          font-family: sans-serif;
          font-weight: 900;
          color: #0F3D2E;
        }
        .tv-text_4041,
        .tv-text_4042,
        .tv-text_4043 {
          font-size: 1.5rem;
          transform: scaleY(18) scaleX(7.5);
        }

        @media (max-width: 640px) {
          .tv-screenM {
            display: flex;
          }
          .tv-screen {
            display: none;
          }
        }
      `}</style>

      {/* Retro 404 TV Graphic */}
      <div className="uiverse-404-wrapper my-2">
        <div className="tv-main">
          <div className="tv-antenna">
            <div className="tv-antenna_shadow"></div>
            <div className="tv-a1"></div>
            <div className="tv-a1d"></div>
            <div className="tv-a2"></div>
            <div className="tv-a2d"></div>
          </div>

          <div className="tv-box">
            <div className="tv-cruve">
              <svg
                className="tv-curve_svg"
                viewBox="0 0 189.929 189.929"
              >
                <path d="M70.343,70.343c-30.554,30.553-44.806,72.7-39.102,115.635l-29.738,3.951C-5.442,137.659,11.917,86.34,49.129,49.13 C86.34,11.918,137.664-5.445,189.928,1.502l-3.95,29.738C143.041,25.54,100.895,39.789,70.343,70.343z"></path>
              </svg>
            </div>

            <div className="tv-display_div">
              <div className="tv-screen_out">
                <div className="tv-screen_out1">
                  <div className="tv-screen">
                    <span className="tv-notfound_text">NOT FOUND</span>
                  </div>
                  <div className="tv-screenM">
                    <span className="tv-notfound_text">NOT FOUND</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="tv-lines">
              <div className="tv-line1"></div>
              <div className="tv-line2"></div>
              <div className="tv-line3"></div>
            </div>

            <div className="tv-buttons_div">
              <div className="tv-b1"><div></div></div>
              <div className="tv-b2"></div>
              <div className="tv-speakers">
                <div className="tv-g1">
                  <div className="tv-g11"></div>
                  <div className="tv-g12"></div>
                  <div className="tv-g13"></div>
                </div>
                <div className="tv-g"></div>
                <div className="tv-g"></div>
              </div>
            </div>
          </div>

          <div className="tv-bottom">
            <div className="tv-base1"></div>
            <div className="tv-base2"></div>
            <div className="tv-base3"></div>
          </div>
        </div>

        <div className="tv-text_404">
          <div className="tv-text_4041">4</div>
          <div className="tv-text_4042">0</div>
          <div className="tv-text_4043">4</div>
        </div>
      </div>

      {/* Explanatory Arabic Text & Navigation */}
      <div className="max-w-md mx-auto space-y-3 mt-4">
        <h1 className="text-xl sm:text-2xl font-black text-[#0F3D2E]">
          عذراً، الصفحة غير موجودة!
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
          يبدو أن الرابط الذي حاولت الوصول إليه غير صحيح، أو تم حذف المنشور، أو أن الصفحة انتقلت إلى عنوان آخر.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
          <button
            onClick={handleGoHome}
            className="px-5 py-2.5 rounded-xl bg-[#0F3D2E] text-[#D4AF37] font-bold text-xs hover:bg-[#155A44] transition-all shadow-sm flex items-center gap-2 cursor-pointer active:scale-95"
          >
            <Compass className="w-4 h-4" />
            <span>استكشاف المحتوى والمنشورات</span>
          </button>

          {currentUser && (
            <button
              onClick={() => setActiveView('home')}
              className="px-5 py-2.5 rounded-xl bg-white border border-stone-300 text-stone-700 font-bold text-xs hover:bg-stone-50 transition-all shadow-xs flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <Home className="w-4 h-4 text-[#0F3D2E]" />
              <span>الخط الزمني الرئيسي</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
