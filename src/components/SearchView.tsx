import React, { useState, useEffect } from 'react';
import {
  Search,
  Hash,
  User as UserIcon,
  MessageSquare,
  ShoppingBag,
  X,
  ArrowLeft,
  Sparkles,
  MapPin,
  Check
} from 'lucide-react';
import { useAyGram } from '../context/AyGramContext';
import { PostCard } from './PostCard';
import { VerificationBadge } from './VerificationBadge';

interface SearchViewProps {
  onOpenReport: (targetId: string, snippet: string) => void;
  onOpenAuth: () => void;
}

export const SearchView: React.FC<SearchViewProps> = ({ onOpenReport, onOpenAuth }) => {
  const {
    searchQuery,
    setSearchQuery,
    users,
    posts,
    products,
    currentUser,
    viewUserProfile,
    toggleFollow
  } = useAyGram();

  const [activeTab, setActiveTab] = useState<'all' | 'posts' | 'users' | 'tags' | 'products'>('all');
  const [localQuery, setLocalQuery] = useState(searchQuery || '');

  useEffect(() => {
    setLocalQuery(searchQuery);
  }, [searchQuery]);

  const handleQueryChange = (q: string) => {
    setLocalQuery(q);
    setSearchQuery(q);
  };

  const cleanQuery = localQuery.trim().toLowerCase().replace(/^[#@]/, '');

  // Visible posts filtered by approved & unblocked & close friends
  const visiblePosts = posts.filter((p) => {
    if (!p.isApproved || p.isBlocked) return false;
    if (currentUser?.blockedUserIds?.includes(p.userId)) return false;
    if (p.isCloseFriendsOnly) {
      if (!currentUser) return false;
      if (p.userId === currentUser.id) return true;
      const author = users.find((u) => u.id === p.userId);
      return author?.closeFriends?.includes(currentUser.id);
    }
    return true;
  });

  // Filtered Users
  const matchedUsers = users.filter((u) => {
    if (!cleanQuery) return true;
    return (
      u.username.toLowerCase().includes(cleanQuery) ||
      u.fullName.toLowerCase().includes(cleanQuery) ||
      (u.bio && u.bio.toLowerCase().includes(cleanQuery)) ||
      (u.nationality && u.nationality.toLowerCase().includes(cleanQuery)) ||
      (u.location && u.location.toLowerCase().includes(cleanQuery))
    );
  });

  // Filtered Posts
  const matchedPosts = [...visiblePosts].sort((a, b) => {
    if (!currentUser) return 0;
    const aIsLocal = a.userNationality === currentUser.nationality || (a.location && currentUser.nationality && a.location.includes(currentUser.nationality));
    const bIsLocal = b.userNationality === currentUser.nationality || (b.location && currentUser.nationality && b.location.includes(currentUser.nationality));
    if (aIsLocal && !bIsLocal) return -1;
    if (!aIsLocal && bIsLocal) return 1;
    return 0;
  }).filter((p) => {
    if (!cleanQuery) return true;
    const contentMatch = p.content.toLowerCase().includes(cleanQuery);
    const tagMatch = (p.tags || []).some((t) => t.toLowerCase().includes(cleanQuery));
    const userMatch = p.username.toLowerCase().includes(cleanQuery);
    const locationMatch = p.location ? p.location.toLowerCase().includes(cleanQuery) : false;
    return contentMatch || tagMatch || userMatch || locationMatch;
  });

  // Filtered Hashtags
  const allHashtags: string[] = Array.from(
    new Set<string>(visiblePosts.flatMap((p) => p.tags || []))
  );
  const matchedTags = allHashtags.filter((t: string) => {
    if (!cleanQuery) return true;
    return t.toLowerCase().includes(cleanQuery);
  });

  // Filtered Products
  const matchedProducts = products.filter((p) => {
    if (!p.isApproved) return false;
    if (!cleanQuery) return true;
    return (
      p.title.toLowerCase().includes(cleanQuery) ||
      p.description.toLowerCase().includes(cleanQuery) ||
      p.category.toLowerCase().includes(cleanQuery)
    );
  });

  const popularTags = ['محتوى_عربي', 'تقنية', 'تصميم', 'عرب_الداخل', 'خط_عربي', 'ريادة_أعمال', 'تجارة_إلكترونية'];

  return (
    <div className="space-y-6 pb-16">
      {/* Search Header Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-6 border border-stone-200 shadow-sm space-y-4">
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-stone-400 absolute start-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={localQuery}
              onChange={(e) => handleQueryChange(e.target.value)}
              placeholder="ابحث عن أشخاص، هاشتاغات (#)، تغريدات، أو منتجات..."
              className="w-full ps-11 pe-10 py-3 rounded-xl bg-stone-50 border border-stone-200 text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:border-[#0F3D2E] focus:bg-white transition-all"
            />
            {localQuery && (
              <button
                type="button"
                onClick={() => handleQueryChange('')}
                className="absolute end-3 top-1/2 -translate-y-1/2 p-1 text-stone-400 hover:text-stone-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs font-bold border-t border-stone-100 pt-3">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3.5 py-1.5 rounded-lg transition-all shrink-0 cursor-pointer ${
              activeTab === 'all'
                ? 'bg-[#0F3D2E] text-[#D4AF37]'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            الكل
          </button>
          <button
            onClick={() => setActiveTab('posts')}
            className={`px-3.5 py-1.5 rounded-lg transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'posts'
                ? 'bg-[#0F3D2E] text-[#D4AF37]'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>التغريدات ({matchedPosts.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-3.5 py-1.5 rounded-lg transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'users'
                ? 'bg-[#0F3D2E] text-[#D4AF37]'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            <UserIcon className="w-3.5 h-3.5" />
            <span>الحسابات ({matchedUsers.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('tags')}
            className={`px-3.5 py-1.5 rounded-lg transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'tags'
                ? 'bg-[#0F3D2E] text-[#D4AF37]'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            <Hash className="w-3.5 h-3.5" />
            <span>الهاشتاغات ({matchedTags.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`px-3.5 py-1.5 rounded-lg transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'products'
                ? 'bg-[#0F3D2E] text-[#D4AF37]'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>المنتجات ({matchedProducts.length})</span>
          </button>
        </div>
      </div>

      {/* Suggested Quick Tags if query is empty */}
      {!localQuery && (
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-stone-200 shadow-sm space-y-2.5">
          <div className="text-xs font-bold text-stone-500">عمليات بحث شائعة مقترحة:</div>
          <div className="flex flex-wrap gap-2">
            {popularTags.map((tag) => (
              <button
                key={tag}
                onClick={() => handleQueryChange('#' + tag)}
                className="px-3 py-1 rounded-xl bg-stone-100 hover:bg-[#0F3D2E]/10 text-xs font-bold text-[#0F3D2E] transition-colors cursor-pointer"
              >
                #{tag}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Users Results Section (if activeTab is all or users) */}
      {(activeTab === 'all' || activeTab === 'users') && matchedUsers.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-xs font-bold text-stone-500 px-1">
            الحسابات المطابقة ({matchedUsers.length})
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {matchedUsers.slice(0, activeTab === 'all' ? 4 : 20).map((u) => {
              const isFollowing = currentUser?.following?.includes(u.id) || false;
              return (
                <div
                  key={u.id}
                  onClick={() => viewUserProfile(u.id)}
                  className="bg-white rounded-2xl p-4 border border-stone-200 hover:border-[#0F3D2E]/30 transition-all flex items-center justify-between gap-3 cursor-pointer shadow-sm"
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <img
                      src={u.profileImage}
                      alt={u.username}
                      className="w-12 h-12 rounded-full object-cover border-2 border-[#D4AF37]/40 shrink-0"
                    />
                    <div className="overflow-hidden">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-xs sm:text-sm font-bold text-stone-900 truncate">
                          {u.fullName}
                        </span>
                        <VerificationBadge type={u.verificationBadge || (u.verified ? 'blue' : 'none')} size="sm" />
                      </div>
                      <span className="text-xs text-stone-400 font-mono block truncate">
                        @{u.username}
                      </span>
                      {u.nationality && (
                        <span className="text-[10px] text-stone-500 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-[#0F3D2E]" />
                          <span>{u.nationality}</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {currentUser && currentUser.id !== u.id && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFollow(u.id);
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                        isFollowing
                          ? 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                          : 'bg-[#0F3D2E] text-white hover:bg-[#155A44]'
                      }`}
                    >
                      {isFollowing ? 'متابع' : 'متابعة'}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Hashtags Section (if activeTab is all or tags) */}
      {(activeTab === 'all' || activeTab === 'tags') && matchedTags.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-xs font-bold text-stone-500 px-1">
            الهاشتاغات المطابقة ({matchedTags.length})
          </h2>
          <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-sm flex flex-wrap gap-2">
            {matchedTags.map((tag) => (
              <button
                key={tag}
                onClick={() => handleQueryChange('#' + tag)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-50 hover:bg-[#0F3D2E]/10 border border-stone-200 text-xs font-bold text-[#0F3D2E] transition-all cursor-pointer"
              >
                <Hash className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>{tag}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Posts Results Section */}
      {(activeTab === 'all' || activeTab === 'posts') && (
        <div className="space-y-3">
          <h2 className="text-xs font-bold text-stone-500 px-1">
            التغريدات المطابقة ({matchedPosts.length})
          </h2>
          {matchedPosts.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 text-center border border-stone-200 text-stone-500 text-xs">
              لم يتم العثور على تغريدات تطابق كلمة البحث "{localQuery}".
            </div>
          ) : (
            <div className="space-y-4">
              {matchedPosts.map((post) => (
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
      )}

      {/* Products Section */}
      {(activeTab === 'all' || activeTab === 'products') && matchedProducts.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-xs font-bold text-stone-500 px-1">
            المنتجات في السوق ({matchedProducts.length})
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {matchedProducts.map((p) => (
              <div
                key={p.id}
                className="bg-white rounded-2xl p-3 border border-stone-200 shadow-sm flex gap-3"
              >
                {p.images && p.images[0] && (
                  <img
                    src={p.images[0]}
                    alt={p.title}
                    className="w-20 h-20 rounded-xl object-cover border border-stone-200 shrink-0"
                  />
                )}
                <div className="flex-1 overflow-hidden">
                  <h3 className="text-xs font-bold text-stone-900 truncate">{p.title}</h3>
                  <p className="text-[11px] text-stone-500 line-clamp-2 mt-0.5">{p.description}</p>
                  <div className="mt-2 text-xs font-bold text-[#0F3D2E]">
                    {p.price} ريال سعودي
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
