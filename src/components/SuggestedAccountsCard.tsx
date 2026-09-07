import React, { useState } from 'react';
import { UserPlus, UserCheck, RefreshCw, Sparkles, MessageCircle } from 'lucide-react';
import { useAyGram } from '../context/AyGramContext';
import { VerificationBadge } from './VerificationBadge';
import { ChatSkeletonLoader } from './ChatSkeletonLoader';

interface SuggestedAccountsCardProps {
  onOpenAuth: () => void;
  title?: string;
  limit?: number;
}

export const SuggestedAccountsCard: React.FC<SuggestedAccountsCardProps> = ({
  onOpenAuth,
  title = 'حسابات مقترحة للمتابعة',
  limit = 4,
}) => {
  const {
    currentUser,
    users,
    toggleFollow,
    viewUserProfile,
    setActiveConversationUserId,
    setActiveView,
    showToast,
  } = useAyGram();

  const [isLoading, setIsLoading] = useState(false);

  // Filter accounts other than currentUser
  const candidateUsers = users.filter((u) => {
    if (!currentUser) return true;
    return u.id !== currentUser.id;
  });

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 600);
  };

  const handleFollowClick = (userId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!currentUser) {
      showToast('يرجى تسجيل الدخول بحسابك لمتابعة الحسابات والتواصل معهم!', 'warning');
      onOpenAuth();
      return;
    }
    toggleFollow(userId);
  };

  const handleDirectChat = (userId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!currentUser) {
      showToast('يرجى تسجيل الدخول لبدء محادثة خاصة!', 'warning');
      onOpenAuth();
      return;
    }
    setActiveConversationUserId(userId);
    setActiveView('messages');
  };

  return (
    <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-xs space-y-3 font-['IBM_Plex_Sans_Arabic']" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between pb-1 border-b border-stone-100">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#D4AF37]" />
          <h3 className="text-xs sm:text-sm font-bold text-[#0F3D2E]">
            {title}
          </h3>
        </div>
        <button
          onClick={handleRefresh}
          className="p-1 text-stone-400 hover:text-[#0F3D2E] transition-colors rounded-lg hover:bg-stone-100 cursor-pointer"
          title="تحديث الاقتراحات"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Suggested Users List or Skeleton */}
      {isLoading ? (
        <ChatSkeletonLoader count={limit} />
      ) : (
        <div className="space-y-2.5">
          {candidateUsers.slice(0, limit).map((u) => {
            const isFollowing = currentUser?.following?.includes(u.id);

            return (
              <div
                key={u.id}
                onClick={() => viewUserProfile(u.id)}
                className="flex items-center justify-between gap-2 p-2 rounded-xl hover:bg-stone-50 transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="relative">
                    <img
                      src={u.profileImage}
                      alt={u.username}
                      className="w-10 h-10 rounded-full object-cover border border-stone-200 group-hover:scale-105 transition-transform"
                    />
                    {u.verified && (
                      <span className="absolute -bottom-1 -end-1">
                        <VerificationBadge type={u.verificationBadge || 'blue'} size="xs" />
                      </span>
                    )}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-1 text-xs font-bold text-stone-900 truncate">
                      <span className="truncate">{u.fullName || u.username}</span>
                    </div>
                    <div className="text-[11px] text-stone-400 truncate">
                      @{u.username}
                    </div>
                    {u.bio && (
                      <div className="text-[10px] text-stone-500 truncate max-w-[140px]">
                        {u.bio}
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions: Follow and Message */}
                <div className="flex items-center gap-1 shrink-0">
                  {currentUser && (
                    <button
                      onClick={(e) => handleDirectChat(u.id, e)}
                      className="p-1.5 rounded-lg text-stone-400 hover:text-[#0F3D2E] hover:bg-stone-100 transition-colors cursor-pointer"
                      title="إرسال رسالة خاصة"
                    >
                      <MessageCircle className="w-4 h-4" />
                    </button>
                  )}

                  <button
                    onClick={(e) => handleFollowClick(u.id, e)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer active:scale-95 ${
                      isFollowing
                        ? 'bg-stone-100 text-stone-700 hover:bg-red-50 hover:text-red-700 border border-stone-200'
                        : 'bg-[#0F3D2E] text-[#D4AF37] hover:bg-[#155A44] shadow-xs'
                    }`}
                  >
                    {isFollowing ? (
                      <>
                        <UserCheck className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">متابَع</span>
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-3.5 h-3.5" />
                        <span>متابعة</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
