import React from 'react';
import { useAyGram } from '../context/AyGramContext';
import { NotificationsView } from '../components/NotificationsView';
import { AuthRequiredCard } from '../components/AuthRequiredCard';

export const NotificationsPage: React.FC = () => {
  const { currentUser } = useAyGram();

  if (!currentUser) {
    return (
      <AuthRequiredCard
        title="عشان يصير الشي حقيقي، يلزمك حساب مسجل للإشعارات"
        description="التنبيهات والإشعارات مخصصة لمتابعة تفاعل الأعضاء مع منشوراتك والرسائل الواردة وتحديثات المنصة. يرجى تسجيل الدخول بحسابك."
        badge="تسجيل الدخول إلزامي"
      />
    );
  }

  return (
    <div className="space-y-4">
      <NotificationsView />
    </div>
  );
};
