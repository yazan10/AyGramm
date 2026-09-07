import React from 'react';
import { useAyGram } from '../context/AyGramContext';
import { ExploreView } from '../components/ExploreView';

interface ExplorePageProps {
  onOpenReport?: (targetId: string, snippet: string, targetType: 'post' | 'product' | 'comment' | 'user') => void;
}

export const ExplorePage: React.FC<ExplorePageProps> = ({ onOpenReport }) => {
  const { setActiveView } = useAyGram();

  return (
    <div className="space-y-4">
      <ExploreView
        onOpenReport={(id, snippet) => {
          if (onOpenReport) onOpenReport(id, snippet, 'post');
        }}
        onOpenAuth={() => setActiveView('auth')}
      />
    </div>
  );
};
