import React, { useState } from 'react';
import {
  Compass,
  TrendingUp,
  Hash,
  Sparkles,
  Users,
  MapPin,
  Flame,
  ArrowRight,
  Filter
} from 'lucide-react';
import { useAyGram } from '../context/AyGramContext';
import { PostCard } from './PostCard';
import { VerificationBadge } from './VerificationBadge';

interface ExploreViewProps {
  onOpenReport: (targetId: string, snippet: string) => void;
  onOpenAuth: () => void;
}

export const ExploreView: React.FC<ExploreViewProps> = ({ onOpenReport, onOpenAuth }) => {
  const { posts, users, currentUser, viewUserProfile, setSearchQuery, setActiveView } = useAyGram();
  const [activeTab, setActiveTab] = useState<'all' | 'trending' | 'tags' | 'creators' | 'arab48'>('all');

  // Filter posts visible to current user (respecting close friends and blocks)
  const visiblePosts = posts.filter((post) => {
    if (!post.isApproved || post.isBlocked) return false;
    if (currentUser?.blockedUserIds?.includes(post.userId)) return false;
    if (post.isCloseFriendsOnly) {
      if (!currentUser) return false;
      if (post.userId === currentUser.id) return true;
      const author = users.find((u) => u.id === post.userId);
      return author?.closeFriends?.includes(currentUser.id);
    }
    return true;
  });

  // Calculate top hashtags from all visible posts
  const hashtagMap: { [tag: string]: number } = {};
  visiblePosts.forEach((p) => {
    (p.tags || []).forEach((t) => {
      hashtagMap[t] = (hashtagMap[t] || 0) + 1;
    });
  });
  const sortedHashtags = Object.entries(hashtagMap).sort((a, b) => b[1] - a[1]);

  // Featured Creators
  const creators = users.filter((u) => u.id !== currentUser?.id);

  // Country-based priority sorting
  const sortedByCountry = [...visiblePosts].sort((a, b) => {
    if (!currentUser) return 0;
    const aIsLocal = a.userNationality === currentUser.nationality || (a.location && currentUser.nationality && a.location.includes(currentUser.nationality));
    const bIsLocal = b.userNationality === currentUser.nationality || (b.location && currentUser.nationality && b.location.includes(currentUser.nationality));
    if (aIsLocal && !bIsLocal) return -1;
    if (!aIsLocal && bIsLocal) return 1;
    return 0;
  });

  // Tab Filtering
  let displayPosts = sortedByCountry;
  if (activeTab === 'trending') {
    displayPosts = [...sortedByCountry].sort((a, b) => (b.likes.length + (b.retweets?.length || 0)) - (a.likes.length + (a.retweets?.length || 0)));
  } else if (activeTab === 'arab48') {
    displayPosts = visiblePosts.filter(
      (p) =>
        (p.location && (p.location.includes('عرب الداخل') || p.location.includes('الناصرة') || p.location.includes('عكا') || p.location.includes('يافا') || p.location.includes('حيفا'))) ||
        (p.tags || []).some((t) => t.includes('عرب_الداخل'))
    );
  }

  return (
    <div className="space-y-6 pb-16">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-[#0F3D2E] via-[#16503c] to-[#0F3D2E] rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-sm">
        <div className="absolute top-0 end-0 -mt-8 -me-8 w-48 h-48 bg-[#D4AF37]/10 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#D4AF37] text-xs font-bold backdrop-blur-sm">
              <Compass className="w-4 h-4" />
              <span>استكشف مجتمع AyGram العربي</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold">
              اكتشف أحدث التغريدات، المبدعين، والوسوم الرائجة
            </h1>
            <p className="text-xs sm:text-sm text-stone-200 max-w-xl">
              تصفح التفاعل الحي للمجتمع العربي في السعودية، القدس، عرب الداخل، الخليج، ومختلف أنحاء العالم العربي.
            </p>
          </div>
          <button
            onClick={() => setActiveView('search')}
            className="self-start sm:self-center px-4 py-2.5 rounded-xl bg-[#D4AF37] text-[#0F3D2E] font-bold text-xs hover:bg-[#e4c251] transition-all shadow cursor-pointer active:scale-95"
          >
            الانتقال إلى البحث السريع
          </button>
        </div>
      </div>

      {/* Explore Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs font-bold">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-4 py-2 rounded-xl transition-all shrink-0 cursor-pointer ${
            activeTab === 'all'
              ? 'bg-[#0F3D2E] text-[#D4AF37] shadow'
              : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
          }`}
        >
          كل المستجدات
        </button>
        <button
          onClick={() => setActiveTab('trending')}
          className={`px-4 py-2 rounded-xl transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'trending'
              ? 'bg-[#0F3D2E] text-[#D4AF37] shadow'
              : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
          }`}
        >
          <Flame className="w-3.5 h-3.5 text-amber-500" />
          <span>الأكثر تفاعلاً</span>
        </button>
        <button
          onClick={() => setActiveTab('tags')}
          className={`px-4 py-2 rounded-xl transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'tags'
              ? 'bg-[#0F3D2E] text-[#D4AF37] shadow'
              : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
          }`}
        >
          <Hash className="w-3.5 h-3.5" />
          <span>الوسوم المتصدرة</span>
        </button>
        <button
          onClick={() => setActiveTab('creators')}
          className={`px-4 py-2 rounded-xl transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'creators'
              ? 'bg-[#0F3D2E] text-[#D4AF37] shadow'
              : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>صناع المحتوى والمؤسسات</span>
        </button>
        <button
          onClick={() => setActiveTab('arab48')}
          className={`px-4 py-2 rounded-xl transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'arab48'
              ? 'bg-[#0F3D2E] text-[#D4AF37] shadow'
              : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
          }`}
        >
          <MapPin className="w-3.5 h-3.5 text-emerald-600" />
          <span>عرب الداخل (الناصرة، عكا، يافا)</span>
        </button>
      </div>

      {/* Top Hashtags Horizontal Carousel */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-stone-200 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-[#D4AF37]" />
            <h2 className="text-sm font-bold text-[#0F3D2E]">الهاشتاغات المتداولة حالياً</h2>
          </div>
          <span className="text-[11px] text-stone-400 font-mono">حتى 7 وسوم للمنشور</span>
        </div>

        <div className="flex flex-wrap gap-2 pt-1">
          {sortedHashtags.map(([tag, count]) => (
            <button
              key={tag}
              onClick={() => {
                setSearchQuery('#' + tag);
                setActiveView('search');
              }}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-stone-50 hover:bg-[#0F3D2E]/10 border border-stone-200 text-xs font-medium text-stone-800 transition-all cursor-pointer group"
            >
              <span className="font-bold text-[#0F3D2E] group-hover:text-[#D4AF37]">#{tag}</span>
              <span className="text-[10px] bg-stone-200 text-stone-600 px-1.5 py-0.2 rounded-full font-mono">
                {count} تغريدة
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Suggested Creators Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-stone-200 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#D4AF37]" />
            <h2 className="text-sm font-bold text-[#0F3D2E]">شخصيات ومؤسسات مقترحة للمتابعة</h2>
          </div>
          <span className="text-[11px] text-stone-400">شارات التوثيق الزرقاء والذهبية</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
          {creators.slice(0, 4).map((cUser) => (
            <div
              key={cUser.id}
              onClick={() => viewUserProfile(cUser.id)}
              className="p-3.5 rounded-xl border border-stone-100 hover:border-[#0F3D2E]/40 hover:shadow-sm bg-stone-50/50 transition-all cursor-pointer flex flex-col justify-between space-y-3"
            >
              <div className="flex items-center gap-2.5">
                <img
                  src={cUser.profileImage}
                  alt={cUser.username}
                  className="w-10 h-10 rounded-full object-cover border border-[#D4AF37]"
                />
                <div className="overflow-hidden">
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-bold text-stone-900 truncate">
                      {cUser.fullName}
                    </span>
                    <VerificationBadge type={cUser.verificationBadge || (cUser.verified ? 'blue' : 'none')} size="xs" />
                  </div>
                  <span className="text-[11px] text-stone-400 font-mono block truncate">
                    @{cUser.username}
                  </span>
                </div>
              </div>

              <p className="text-[11px] text-stone-600 line-clamp-2 leading-relaxed">
                {cUser.bio}
              </p>

              <div className="flex items-center justify-between pt-2 border-t border-stone-200/60 text-[11px] text-stone-500">
                <span>{cUser.followers.length} متابع</span>
                <span className="text-[#0F3D2E] font-bold group-hover:underline flex items-center gap-1">
                  <span>زيارة</span>
                  <ArrowRight className="w-3 h-3 rotate-180" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Posts Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-[#0F3D2E] flex items-center gap-2">
            <span>تغريدات الاستكشاف</span>
            <span className="text-xs font-mono font-normal text-stone-400">
              ({displayPosts.length})
            </span>
          </h2>
        </div>

        {displayPosts.length === 0 ? (
          <div className="bg-white rounded-2xl p-10 text-center border border-stone-200 text-stone-500 space-y-2">
            <p className="text-sm font-medium">لا توجد تغريدات تطابق هذا القسم حالياً.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {displayPosts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onOpenReport={onOpenReport}
                onOpenAuth={onOpenAuth}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
