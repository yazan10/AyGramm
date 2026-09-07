import React from 'react';
import { VerificationBadgeType } from '../types/aygram';

interface VerificationBadgeProps {
  type?: VerificationBadgeType;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  className?: string;
}

export const VerificationBadge: React.FC<VerificationBadgeProps> = ({
  type = 'none',
  size = 'sm',
  className = ''
}) => {
  if (type === 'none') return null;

  const sizeClasses = {
    xs: 'w-3 h-3 text-[8px]',
    sm: 'w-4 h-4 text-[10px]',
    md: 'w-5 h-5 text-xs',
    lg: 'w-6 h-6 text-sm',
  }[size];

  const iconSizes = {
    xs: 10,
    sm: 14,
    md: 18,
    lg: 22,
  }[size];

  if (type === 'gold') {
    // Gold badge (for business / مؤسسات وأعمال)
    return (
      <span
        title="حساب أعمال موثّق بالشارة الذهبية"
        className={`inline-flex items-center justify-center rounded-full shrink-0 select-none ${className}`}
      >
        <svg
          width={iconSizes}
          height={iconSizes}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="drop-shadow-sm"
        >
          {/* Instagram-style 8-pointed / scalloped star badge */}
          <path
            d="M12 2L14.7 4.2L18.1 4L19 7.3L22 9L21.1 12.3L22.6 15.4L19.8 17.5L19.4 21L15.9 21.2L13.6 23.8L10.5 22.3L7.7 24L6.1 20.8L2.6 20.2L2.7 16.7L0.5 14.2L1.8 11L0.8 7.7L4 6.7L4.6 3.3L8 3.7L10.4 1.4L12 2Z"
            fill="#E5A93C"
          />
          <path
            d="M12 3L14.4 5L17.5 4.8L18.3 7.8L21 9.4L20.2 12.4L21.5 15.2L19 17.1L18.6 20.3L15.4 20.5L13.3 22.8L10.5 21.5L8 23L6.5 20.1L3.3 19.6L3.4 16.4L1.4 14.1L2.6 11.2L1.7 8.2L4.6 7.3L5.1 4.2L8.2 4.6L10.4 2.5L12 3Z"
            fill="#F6C343"
          />
          {/* Inner Checkmark */}
          <path
            d="M8.5 12.5L10.8 14.8L15.8 9.5"
            stroke="#2C1B00"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    );
  }

  // Blue badge (for creator / personal / مشاهير وصناع محتوى)
  return (
    <span
      title="حساب موثّق بالشارة الزرقاء الرسمية"
      className={`inline-flex items-center justify-center rounded-full shrink-0 select-none ${className}`}
    >
      <svg
        width={iconSizes}
        height={iconSizes}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-sm"
      >
        <path
          d="M12 2L14.7 4.2L18.1 4L19 7.3L22 9L21.1 12.3L22.6 15.4L19.8 17.5L19.4 21L15.9 21.2L13.6 23.8L10.5 22.3L7.7 24L6.1 20.8L2.6 20.2L2.7 16.7L0.5 14.2L1.8 11L0.8 7.7L4 6.7L4.6 3.3L8 3.7L10.4 1.4L12 2Z"
          fill="#1D9BF0"
        />
        <path
          d="M12 3L14.4 5L17.5 4.8L18.3 7.8L21 9.4L20.2 12.4L21.5 15.2L19 17.1L18.6 20.3L15.4 20.5L13.3 22.8L10.5 21.5L8 23L6.5 20.1L3.3 19.6L3.4 16.4L1.4 14.1L2.6 11.2L1.7 8.2L4.6 7.3L5.1 4.2L8.2 4.6L10.4 2.5L12 3Z"
          fill="#38A9F5"
        />
        <path
          d="M8.5 12.5L10.8 14.8L15.8 9.5"
          stroke="#FFFFFF"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
};
