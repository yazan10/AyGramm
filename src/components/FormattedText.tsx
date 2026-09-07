import React from 'react';
import { useAyGram } from '../context/AyGramContext';

interface FormattedTextProps {
  text: string;
  className?: string;
}

export const FormattedText: React.FC<FormattedTextProps> = ({ text, className = '' }) => {
  const { viewUserProfile, setSearchQuery, setActiveView } = useAyGram();

  if (!text) return null;

  // Regex to split by @mention or #hashtag
  // Matches @username or #hashtag (including arabic letters and underscores)
  const tokens = text.split(/([@#][a-zA-Z0-9_\u0600-\u06FF]+)/g);

  return (
    <span className={className}>
      {tokens.map((token, index) => {
        if (token.startsWith('@')) {
          const rawUsername = token.slice(1);
          return (
            <button
              key={index}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                viewUserProfile(rawUsername);
              }}
              className="inline-block font-semibold text-[#0F3D2E] hover:underline cursor-pointer bg-[#0F3D2E]/5 hover:bg-[#0F3D2E]/10 px-1 py-0.5 rounded transition-colors"
            >
              {token}
            </button>
          );
        }

        if (token.startsWith('#')) {
          const tag = token.slice(1);
          return (
            <button
              key={index}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setSearchQuery('#' + tag);
                setActiveView('search');
              }}
              className="inline-block font-bold text-[#D4AF37] hover:underline cursor-pointer hover:bg-[#D4AF37]/10 px-1 py-0.5 rounded transition-colors"
            >
              {token}
            </button>
          );
        }

        return <React.Fragment key={index}>{token}</React.Fragment>;
      })}
    </span>
  );
};
