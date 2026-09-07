import React from 'react';
import { useAyGram } from '../context/AyGramContext';
import { SearchView } from '../components/SearchView';

interface SearchPageProps {
  onOpenReport?: (targetId: string, snippet: string, targetType: 'post' | 'product' | 'comment' | 'user') => void;
}

export const SearchPage: React.FC<SearchPageProps> = ({ onOpenReport }) => {
  const { setActiveView } = useAyGram();

  return (
    <div className="space-y-4">
      <SearchView
        onOpenReport={(id, snippet) => {
          if (onOpenReport) onOpenReport(id, snippet, 'post');
        }}
        onOpenAuth={() => setActiveView('auth')}
      />
    </div>
  );
};
