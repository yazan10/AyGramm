import React from 'react';
import { useAyGram } from '../context/AyGramContext';
import { AdminPanel } from '../components/AdminPanel';
import { NotFound404View } from '../components/NotFound404View';

export const AdminPage: React.FC = () => {
  const { currentUser, isAdminUnlocked, setActiveView } = useAyGram();

  const isAuthorized = isAdminUnlocked || currentUser?.role === 'admin' || currentUser?.role === 'owner' || currentUser?.isAdmin;

  if (!isAuthorized) {
    return (
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-5">
        <NotFound404View onBackToExplore={() => setActiveView('explore')} />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-5">
      <AdminPanel />
    </div>
  );
};
