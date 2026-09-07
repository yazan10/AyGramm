import React, { useEffect } from 'react';
import { CheckCircle2, Info, AlertTriangle, XCircle, X, ArrowUp, Sparkles } from 'lucide-react';

export type ToastType = 'success' | 'info' | 'warning' | 'error' | 'upload';

export interface ToastMessage {
  id: string;
  type: ToastType;
  message: string;
  title?: string;
  duration?: number;
  progress?: number; // 0 to 100 for upload
  uploadStatus?: 'uploading' | 'completed' | 'failed';
  mediaPreview?: string;
}

interface ToastBannerProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

const TOAST_STYLES: Record<
  Exclude<ToastType, 'upload'>,
  { accent: string; chip: string; Icon: React.ElementType }
> = {
  success: {
    accent: '#22C55E',
    chip: 'rgba(34,197,94,0.18)',
    Icon: CheckCircle2,
  },
  info: {
    accent: '#38BDF8',
    chip: 'rgba(56,189,248,0.18)',
    Icon: Info,
  },
  warning: {
    accent: '#FBBF24',
    chip: 'rgba(251,191,36,0.18)',
    Icon: AlertTriangle,
  },
  error: {
    accent: '#F87171',
    chip: 'rgba(248,113,113,0.18)',
    Icon: XCircle,
  },
};

export const ToastBanner: React.FC<ToastBannerProps> = ({ toasts, onDismiss }) => {
  // Auto-dismiss standard toasts after their duration (default 3.2s)
  // For 'upload' type, auto-dismiss happens when uploadStatus === 'completed' or 'failed'
  useEffect(() => {
    const timers: NodeJS.Timeout[] = [];

    toasts.forEach((t) => {
      if (t.type === 'upload') {
        if (t.uploadStatus === 'completed') {
          const timer = setTimeout(() => onDismiss(t.id), t.duration ?? 2800);
          timers.push(timer);
        } else if (t.uploadStatus === 'failed') {
          const timer = setTimeout(() => onDismiss(t.id), t.duration ?? 4000);
          timers.push(timer);
        }
      } else {
        const timer = setTimeout(() => onDismiss(t.id), t.duration ?? 3200);
        timers.push(timer);
      }
    });

    return () => timers.forEach((timer) => clearTimeout(timer));
  }, [toasts, onDismiss]);

  if (toasts.length === 0) return null;

  return (
    <div
      id="aygram-system-toast-container"
      className="fixed bottom-[84px] sm:bottom-6 left-1/2 -translate-x-1/2 z-[9999] w-[calc(100%-2rem)] max-w-sm sm:max-w-md pointer-events-none font-['IBM_Plex_Sans_Arabic'] select-none"
      dir="rtl"
    >
      <style>{`
        .ayg-toast-bottom-in {
          animation: aygToastBottomIn .35s cubic-bezier(.2,.9,.3,1.15) both;
        }
        @keyframes aygToastBottomIn {
          from {
            opacity: 0;
            transform: translateY(22px) scale(.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .ayg-upload-arrow-anim {
          animation: uploadArrowFloat 1.2s infinite ease-in-out;
        }
        @keyframes uploadArrowFloat {
          0%, 100% {
            transform: translateY(2px);
          }
          50% {
            transform: translateY(-4px);
          }
        }
        .ayg-pop-in {
          animation: aygPopIn .4s cubic-bezier(.34,1.56,.64,1) both;
        }
        @keyframes aygPopIn {
          0% {
            transform: scale(0.6) rotate(-10deg);
            opacity: 0;
          }
          100% {
            transform: scale(1) rotate(0deg);
            opacity: 1;
          }
        }
        .ayg-toast-bar {
          animation: aygToastBar linear forwards;
        }
        @keyframes aygToastBar {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>

      <div className="space-y-2.5">
        {toasts.map((toast) => {
          // 1. Uploading / Publishing Toast with dynamic progress bar and animated arrow
          if (toast.type === 'upload') {
            const isCompleted = toast.uploadStatus === 'completed';
            const isFailed = toast.uploadStatus === 'failed';
            const isUploading = !isCompleted && !isFailed;
            const progress = Math.min(100, Math.max(0, toast.progress ?? (isCompleted ? 100 : 20)));

            return (
              <div
                key={toast.id}
                role="status"
                aria-live="polite"
                className="ayg-toast-bottom-in pointer-events-auto relative overflow-hidden rounded-2xl bg-[#0A261D]/95 backdrop-blur-xl border border-white/15 shadow-[0_20px_50px_-10px_rgba(0,0,0,0.65)] text-white"
              >
                {/* Lateral accent gradient */}
                <div
                  className={`absolute inset-y-0 start-0 w-1.5 transition-colors duration-500 ${
                    isCompleted
                      ? 'bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.8)]'
                      : isFailed
                      ? 'bg-rose-500 shadow-[0_0_12px_rgba(244,63,94,0.8)]'
                      : 'bg-[#D4AF37] shadow-[0_0_12px_rgba(212,175,55,0.8)]'
                  }`}
                />

                <div className="p-3.5 sm:p-4">
                  <div className="flex items-center gap-3">
                    {/* Media thumbnail preview if available */}
                    {toast.mediaPreview ? (
                      <div className="relative shrink-0 w-11 h-11 rounded-xl overflow-hidden border border-white/20 shadow-sm bg-black/40">
                        <img
                          src={toast.mediaPreview}
                          alt="معاينة"
                          className="w-full h-full object-cover"
                        />
                        {/* Status badge over thumbnail */}
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                          {isCompleted ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-400 ayg-pop-in" />
                          ) : isFailed ? (
                            <XCircle className="w-5 h-5 text-rose-400" />
                          ) : (
                            <ArrowUp className="w-5 h-5 text-[#D4AF37] ayg-upload-arrow-anim" />
                          )}
                        </div>
                      </div>
                    ) : (
                      /* Icon Badge */
                      <div
                        className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-500 ${
                          isCompleted
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-400/40 shadow-[0_0_16px_rgba(16,185,129,0.4)]'
                            : isFailed
                            ? 'bg-rose-500/20 text-rose-400 border border-rose-400/40'
                            : 'bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/40 shadow-[0_0_16px_rgba(212,175,55,0.25)]'
                        }`}
                      >
                        {isCompleted ? (
                          <div className="ayg-pop-in flex items-center justify-center">
                            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                          </div>
                        ) : isFailed ? (
                          <XCircle className="w-5 h-5" />
                        ) : (
                          <div className="relative flex items-center justify-center">
                            <ArrowUp className="w-5 h-5 ayg-upload-arrow-anim text-[#D4AF37]" />
                          </div>
                        )}
                      </div>
                    )}

                    {/* Content text */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5">
                          {isCompleted ? (
                            <>
                              <span className="text-emerald-400 font-extrabold">تم النشر بنجاح</span>
                              <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
                            </>
                          ) : isFailed ? (
                            <span className="text-rose-400 font-extrabold">تعذر النشر</span>
                          ) : (
                            <span>{toast.title || 'جاري النشر...'}</span>
                          )}
                        </h4>

                        {/* Progress percentage during upload */}
                        {isUploading && (
                          <span className="text-[11px] font-mono font-bold text-[#D4AF37]">
                            {Math.round(progress)}%
                          </span>
                        )}
                      </div>

                      <p className="text-[11px] sm:text-xs text-stone-300 truncate mt-0.5">
                        {isCompleted
                          ? toast.message || 'تم تحديث المحتوى وهو متاح الآن للجميع'
                          : isFailed
                          ? toast.message || 'يرجى التحقق من الاتصال والمحاولة ثانية'
                          : toast.message || 'سهم الرفع قيد المعالجة...'}
                      </p>
                    </div>

                    {/* Close button (allowed anytime or on complete/error) */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDismiss(toast.id);
                      }}
                      aria-label="إغلاق"
                      className="shrink-0 p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Progress Line Bar ("يكتمل الخط") */}
                  <div className="mt-2.5 w-full bg-black/40 h-2 rounded-full overflow-hidden p-0.5 border border-white/10">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ease-out ${
                        isCompleted
                          ? 'bg-gradient-to-r from-emerald-500 to-emerald-400 shadow-[0_0_14px_rgba(52,211,153,0.9)]'
                          : isFailed
                          ? 'bg-rose-500 shadow-[0_0_14px_rgba(244,63,94,0.8)]'
                          : 'bg-gradient-to-r from-[#D4AF37] via-amber-400 to-emerald-400 shadow-[0_0_12px_rgba(212,175,55,0.7)]'
                      }`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          }

          // 2. Standard System Toasts (success, info, warning, error)
          const style = TOAST_STYLES[toast.type as Exclude<ToastType, 'upload'>] || TOAST_STYLES.info;
          const { accent, chip, Icon } = style;
          const duration = toast.duration ?? 3200;

          return (
            <div
              key={toast.id}
              role="alert"
              className="ayg-toast-bottom-in pointer-events-auto relative overflow-hidden rounded-2xl bg-[#0A261D]/95 backdrop-blur-xl border border-white/15 shadow-[0_20px_50px_-10px_rgba(0,0,0,0.65)]"
            >
              {/* Accent glow on start side */}
              <div
                className="absolute inset-y-0 start-0 w-1.5"
                style={{ background: `linear-gradient(180deg, transparent, ${accent}, transparent)` }}
              />

              <div className="flex items-start gap-3 p-3.5 sm:p-4">
                <span
                  className="shrink-0 w-9 h-9 rounded-xl flex items-center justify-center shadow-inner"
                  style={{ background: chip, color: accent }}
                >
                  <Icon className="w-5 h-5" />
                </span>

                <div className="flex-1 min-w-0 pt-0.5">
                  {toast.title && (
                    <h4 className="text-xs sm:text-sm font-bold text-white mb-0.5">
                      {toast.title}
                    </h4>
                  )}
                  <p className="text-xs sm:text-sm font-medium text-stone-200 leading-relaxed">
                    {toast.message}
                  </p>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDismiss(toast.id);
                  }}
                  aria-label="إغلاق الإشعار"
                  className="shrink-0 p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Auto-dismiss countdown bar */}
              <div className="absolute inset-x-0 bottom-0 h-1" style={{ background: chip }}>
                <div
                  className="ayg-toast-bar h-full rounded-full"
                  style={{ background: accent, animationDuration: `${duration}ms` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
