import React from 'react';
import { useAyGram } from '../context/AyGramContext';
import { ChannelsView } from '../components/ChannelsView';
import { AuthRequiredCard } from '../components/AuthRequiredCard';

export const ChannelsPage: React.FC = () => {
  const { currentUser } = useAyGram();

  if (!currentUser) {
    return (
      <AuthRequiredCard
        title="عشان يصير الشي حقيقي، يلزمك حساب مسجل للانضمام للقنوات"
        description="بدون تسجيل الدخول لا يمكنك الانضمام للقنوات أو إرسال الرسائل الصوتية والتفاعل مع المجتمعات. يرجى تسجيل الدخول أو إنشاء حسابك الجديد للمتابعة بأمان."
        badge="تسجيل الدخول إلزامي للقنوات والمجتمعات"
      />
    );
  }

  return (
    <div className="space-y-4">
      <ChannelsView />
    </div>
  );
};
