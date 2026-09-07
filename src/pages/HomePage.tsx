import React from 'react';
import { Compass, Sparkles } from 'lucide-react';
import { useAyGram } from '../context/AyGramContext';
import { StoriesBar } from '../components/StoriesBar';
import { CreatePostCard } from '../components/CreatePostCard';
import { PostCard } from '../components/PostCard';
import { ExploreView } from '../components/ExploreView';

interface HomePageProps {
  onOpenAddStory: () => void;
  onOpenReport: (targetId: string, snippet: string, targetType: 'post' | 'product' | 'comment' | 'user') => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onOpenAddStory, onOpenReport }) => {
  const { currentUser, posts, setActiveView } = useAyGram();

  // Public approved timeline posts sorted by user nationality match
  const homePosts = posts
    .filter((p) => {
      if (p.isBlocked) return false;
      if (p.isApproved) return true;
      if (currentUser && p.userId === currentUser.id) return true;
      return false;
    })
    .sort((a, b) => {
      if (!currentUser) return 0;
      const aIsLocal =
        a.userNationality === currentUser.nationality ||
        (a.location && currentUser.nationality && a.location.includes(currentUser.nationality));
      const bIsLocal =
        b.userNationality === currentUser.nationality ||
        (b.location && currentUser.nationality && b.location.includes(currentUser.nationality));
      if (aIsLocal && !bIsLocal) return -1;
      if (!aIsLocal && bIsLocal) return 1;
      return 0;
    });

  if (!currentUser) {
    return (
      <div className="space-y-4">
        <div className="bg-[#0F3D2E] text-white p-5 rounded-3xl border border-[#D4AF37]/40 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
          <div className="space-y-1 text-center sm:text-start">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <Sparkles className="w-4 h-4 text-[#D4AF37]" />
              <span className="text-xs font-bold text-[#D4AF37]">مرحباً بك في مجتمع AyGram</span>
            </div>
            <h2 className="text-sm sm:text-base font-bold text-white">
              عشان يصير الشي حقيقي، يرجى تسجيل حسابك
            </h2>
            <p className="text-xs text-stone-300 max-w-md">
              بدون تسجيل دخول يمكنك استكشاف المنشورات العامة في الإكسبلور. للتفاعل والمراسلة والنشر، انضم إلينا بحساب رسمي!
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setActiveView('auth')}
              className="px-4 py-2 bg-white text-[#0F3D2E] text-xs font-bold rounded-xl hover:bg-stone-100 transition-all cursor-pointer"
            >
              تسجيل الدخول
            </button>
            <button
              onClick={() => setActiveView('auth')}
              className="px-4 py-2 bg-[#D4AF37] text-[#0F3D2E] text-xs font-bold rounded-xl hover:bg-[#E5C358] transition-all cursor-pointer shadow-sm"
            >
              حساب جديد
            </button>
          </div>
        </div>
        <ExploreView
          onOpenReport={(id, snippet) => onOpenReport(id, snippet, 'post')}
          onOpenAuth={() => setActiveView('auth')}
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Stories Bar with Golden Rings */}
      <StoriesBar onOpenAddStory={onOpenAddStory} />

      {/* Create Tweet Input */}
      <CreatePostCard onOpenAuth={() => setActiveView('auth')} />

      {/* Posts Timeline */}
      <div className="space-y-4">
        {homePosts.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center border border-stone-200 text-stone-500 text-xs space-y-2 shadow-xs">
            <Compass className="w-8 h-8 text-[#D4AF37] mx-auto opacity-80" />
            <p>لا توجد تغريدات حتى الآن، كن أول من يشارك أفكاره على المنصة.</p>
          </div>
        ) : (
          homePosts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onOpenReport={(id, snippet) => onOpenReport(id, snippet, 'post')}
              onOpenAuth={() => setActiveView('auth')}
            />
          ))
        )}
      </div>
    </div>
  );
};
