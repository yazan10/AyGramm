import React from 'react';
import { useAyGram } from '../context/AyGramContext';
import { EditProfileView } from '../components/EditProfileView';
import { AuthRequiredCard } from '../components/AuthRequiredCard';

export const EditProfilePage: React.FC = () => {
  const { currentUser } = useAyGram();

  if (!currentUser) {
    return (
      <AuthRequiredCard
        title="عشان يصير الشي حقيقي، يلزمك تسجيل الدخول لتعديل الملف الشخصي"
        description="سجّل دخولك لحسابك في AyGram لتتمكن من تعديل معلوماتك، صورتك، الروابط، والثيم بأسلوب انستغرام المتكامل."
        badge="تسجيل الدخول إلزامي لتعديل الملف"
      />
    );
  }

  return (
    <div className="space-y-4">
      <EditProfileView />
    </div>
  );
};
