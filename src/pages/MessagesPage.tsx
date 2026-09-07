import React from 'react';
import { useAyGram } from '../context/AyGramContext';
import { DirectMessagesView } from '../components/DirectMessagesView';
import { AuthRequiredCard } from '../components/AuthRequiredCard';

export const MessagesPage: React.FC = () => {
  const { currentUser } = useAyGram();

  if (!currentUser) {
    return (
      <AuthRequiredCard
        title="عشان يصير الشي حقيقي، يلزمك حساب مسجل للمراسلة"
        description="بدون تسجيل الدخول لا يمكنك إرسال أو استقبال الرسائل الخاصة أو إنشاء مجموعات الدردشة. سجّل حسابك وتواصل بأمان وسرية تامة مع الأعضاء."
        badge="تسجيل الدخول إلزامي للمراسلة"
      />
    );
  }

  return (
    <div className="space-y-4">
      <DirectMessagesView />
    </div>
  );
};
