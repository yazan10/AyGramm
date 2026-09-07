import React from 'react';
import { Bookmark } from 'lucide-react';
import { useAyGram } from '../context/AyGramContext';
import { PostCard } from '../components/PostCard';
import { AuthRequiredCard } from '../components/AuthRequiredCard';

interface SavedPageProps {
  onOpenReport?: (targetId: string, snippet: string, targetType: 'post' | 'product' | 'comment' | 'user') => void;
}

export const SavedPage: React.FC<SavedPageProps> = ({ onOpenReport }) => {
  const { currentUser, posts, savedPostIds, setActiveView } = useAyGram();

  if (!currentUser) {
    return (
      <AuthRequiredCard
        title="عشان يصير الشي حقيقي، يلزمك حساب مسجل للتغريدات المحفوظة"
        description="لحفظ التغريدات والمحتوى المفضل لديك والرجوع إليه في أي وقت ومن أي جهاز، يجب تسجيل الدخول بحسابك."
        badge="تسجيل الدخول إلزامي"
      />
    );
  }

  const savedPosts = posts.filter((p) => savedPostIds.includes(p.id) && !p.isBlocked);

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-stone-200 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#0F3D2E] text-[#D4AF37] flex items-center justify-center">
            <Bookmark className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-[#0F3D2E]">التغريدات المحفوظة</h2>
            <p className="text-xs text-stone-500">التغريدات والمحتوى الذي قمت بتمييزه للرجوع إليه لاحقاً</p>
          </div>
        </div>
        <span className="text-xs font-mono font-bold text-[#0F3D2E] bg-stone-100 px-3 py-1 rounded-full border border-stone-200">
          {savedPosts.length} تغريدة
        </span>
      </div>

      {savedPosts.length === 0 ? (
        <div className="bg-white rounded-2xl p-10 text-center border border-stone-200 text-xs text-stone-500 space-y-2 shadow-xs">
          <Bookmark className="w-8 h-8 text-stone-400 mx-auto opacity-50" />
          <p>قائمتك فارغة حالياً. اضغط على أيقونة الحفظ على أي تغريدة ترغب في حفظها هنا.</p>
        </div>
      ) : (
        savedPosts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            onOpenReport={(id, snippet) => {
              if (onOpenReport) onOpenReport(id, snippet, 'post');
            }}
            onOpenAuth={() => setActiveView('auth')}
          />
        ))
      )}
    </div>
  );
};
