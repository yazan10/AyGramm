import React from 'react';
import { useAyGram } from '../context/AyGramContext';
import { LandingPage as LandingComponent } from '../components/LandingPage';

export const LandingPage: React.FC = () => {
  const { setActiveView } = useAyGram();

  return (
    <div className="w-full">
      <LandingComponent
        onOpenAuth={(_mode) => {
          setActiveView('auth');
        }}
      />
    </div>
  );
};
