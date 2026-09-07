import React from 'react';
import { useAyGram } from '../context/AyGramContext';
import { NotFound404View } from '../components/NotFound404View';

export const NotFoundPage: React.FC = () => {
  const { setActiveView } = useAyGram();

  return (
    <div className="w-full">
      <NotFound404View onBackToExplore={() => setActiveView('explore')} />
    </div>
  );
};
