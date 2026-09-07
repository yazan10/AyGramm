import React from 'react';
import { useAyGram } from '../context/AyGramContext';
import { User } from '../types/aygram';
import { ProfileView } from '../components/ProfileView';
import { AuthRequiredCard } from '../components/AuthRequiredCard';

interface ProfilePageProps {
  onOpenReport?: (targetId: string, snippet: string, targetType: 'post' | 'product' | 'comment' | 'user') => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ onOpenReport }) => {
  const { currentUser, selectedUserProfile, setActiveView } = useAyGram();

  const profileUser = selectedUserProfile || currentUser;

  if (!profileUser) {
    return (
      <AuthRequiredCard
        title="عشان يصير الشي حقيقي، يلزمك حساب مسجل للملف الشخصي"
        description="سجّل حسابك في AyGram لتمتلك ملفاً شخصياً موثقاً وتتمكن من نشر محتواك وتخصيص الهايلايت والروابط والتفاعل مع المتابعين!"
        badge="تسجيل الدخول إلزامي للملف الشخصي"
      />
    );
  }

  return (
    <div className="space-y-4">
      <ProfileView
        user={profileUser as User}
        onOpenReport={(id, snippet) => {
          if (onOpenReport) onOpenReport(id, snippet, 'user');
        }}
        onOpenAuth={() => setActiveView('auth')}
      />
    </div>
  );
};
