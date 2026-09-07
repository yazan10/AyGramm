import React from 'react';
import { useAyGram } from '../context/AyGramContext';
import { SettingsView } from '../components/SettingsView';
import { AuthRequiredCard } from '../components/AuthRequiredCard';

export const SettingsPage: React.FC = () => {
  const { currentUser } = useAyGram();

  if (!currentUser) {
    return (
      <AuthRequiredCard
        title="عشان يصير الشي حقيقي، يلزمك حساب مسجل للإعدادات"
        description="إعدادات الحساب والخصوصية وكلمة المرور وتوثيق الهوية تتطلب تسجيل الدخول بحسابك."
        badge="تسجيل الدخول إلزامي"
      />
    );
  }

  return (
    <div className="space-y-4">
      <SettingsView />
    </div>
  );
};
