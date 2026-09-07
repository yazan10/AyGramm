import React from 'react';
import { useAyGram } from '../context/AyGramContext';
import { Product } from '../types/aygram';
import { ShopSection } from '../components/ShopSection';
import { AuthRequiredCard } from '../components/AuthRequiredCard';

interface ShopPageProps {
  onOpenAddProduct: () => void;
  onEditProduct: (product: Product) => void;
  onOpenReport?: (targetId: string, snippet: string, targetType: 'post' | 'product' | 'comment' | 'user') => void;
}

export const ShopPage: React.FC<ShopPageProps> = ({
  onOpenAddProduct,
  onEditProduct,
  onOpenReport
}) => {
  const { currentUser, setActiveView } = useAyGram();

  if (!currentUser) {
    return (
      <AuthRequiredCard
        title="عشان يصير الشي حقيقي، يلزمك حساب مسجل للتسوق"
        description="بدون تسجيل الدخول لا يمكنك الشراء أو البيع في سوق AyGram للمبدعين. يرجى تسجيل الدخول أو إنشاء حسابك لإتمام الطلبات بأمان."
        badge="تسجيل الدخول إلزامي للتسوق"
      />
    );
  }

  return (
    <div className="space-y-4">
      <ShopSection
        onOpenAddProduct={onOpenAddProduct}
        onEditProduct={onEditProduct}
        onOpenReport={(id, snippet) => {
          if (onOpenReport) onOpenReport(id, snippet, 'product');
        }}
        onOpenAuth={() => setActiveView('auth')}
      />
    </div>
  );
};
