import React from 'react';

interface ChatSkeletonLoaderProps {
  count?: number;
  className?: string;
}

export const ChatSkeletonLoader: React.FC<ChatSkeletonLoaderProps> = ({ count = 3, className = '' }) => {
  return (
    <div className={`space-y-1 ${className}`}>
      {Array.from({ length: count }).map((_, idx) => (
        /* From Uiverse.io by sahilxkhadka */
        <div key={idx} className="relative flex w-full max-w-sm animate-pulse gap-2 p-3 sm:p-4 rounded-xl hover:bg-stone-50 transition-colors">
          <div className="h-11 w-11 shrink-0 rounded-full bg-slate-300"></div>
          <div className="flex-1 min-w-0">
            <div className="mb-2 h-4 w-3/5 rounded-md bg-slate-300"></div>
            <div className="h-3 w-[88%] rounded-md bg-slate-200"></div>
          </div>
          <div className="absolute bottom-4 end-3 h-3.5 w-3.5 rounded-full bg-slate-300"></div>
        </div>
      ))}
    </div>
  );
};
