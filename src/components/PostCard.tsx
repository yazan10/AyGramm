import React, { useState } from 'react';
import {
  Heart,
  MessageCircle,
  Repeat2,
  Share2,
  Bookmark,
  MoreHorizontal,
  Flag,
  CheckCircle2,
  Eye,
  Send,
  Trash2,
  Check,
  AlertCircle,
  MapPin,
  Star,
  UserX,
  MessageSquare,
  Shield
} from 'lucide-react';
import { Post } from '../types/aygram';
import { useAyGram } from '../context/AyGramContext';
import { ShareModal } from './ShareModal';
import { VerificationBadge } from './VerificationBadge';
import { FormattedText } from './FormattedText';
import { HeartLikeButton } from './HeartLikeButton';

interface PostCardProps {
  post: Post;
  onOpenReport: (targetId: string, snippet: string) => void;
  onOpenAuth: () => void;
}

export const PostCard: React.FC<PostCardProps> = ({ post, onOpenReport, onOpenAuth }) => {
  const {
    currentUser,
    users,
    toggleLikePost,
    toggleRetweet,
    addComment,
    deleteComment,
    toggleSavePost,
    savedPostIds,
    viewUserProfile,
    deletePost,
    toggleBlockUser,
    openDirectChatWithUser,
    setSearchQuery,
    setActiveView
  } = useAyGram();

  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [commentError, setCommentError] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const authorUser = users.find((u) => u.id === post.userId);
  const isLiked = currentUser ? post.likes.includes(currentUser.id) : false;
  const retweetsList = post.retweets || [];
  const isRetweeted = currentUser ? retweetsList.includes(currentUser.id) : false;
  const isSaved = savedPostIds.includes(post.id);
  const isAuthor = currentUser?.id === post.userId;
  const isBlocked = currentUser?.blockedUserIds?.includes(post.userId);

  const handleLike = () => {
    if (!currentUser) {
      onOpenAuth();
      return;
    }
    toggleLikePost(post.id);
  };

  const handleRetweet = () => {
    if (!currentUser) {
      onOpenAuth();
      return;
    }
    toggleRetweet(post.id);
  };

  const handleSave = () => {
    if (!currentUser) {
      onOpenAuth();
      return;
    }
    toggleSavePost(post.id);
  };

  const handleShare = () => {
    setIsShareModalOpen(true);
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCommentError('');

    if (!currentUser) {
      onOpenAuth();
      return;
    }

    if (!commentText.trim()) return;

    const res = addComment(post.id, commentText);
    if (res.success) {
      setCommentText('');
    } else {
      setCommentError(res.error || 'تعذر إضافة التعليق');
    }
  };

  // Format date helper
  const formatDate = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString('ar-SA', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return 'الآن';
    }
  };

  return (
    <>
    <article className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden transition-all hover:border-[#0F3D2E]/30">
      {/* Retweet Indicator if active */}
      {retweetsList.length > 0 && (
        <div className="px-4 py-1.5 bg-stone-50 border-b border-stone-100 flex items-center gap-1.5 text-[11px] font-medium text-[#0F3D2E]">
          <Repeat2 className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span>
            {isRetweeted ? 'أنت قمت بإعادة تغريد هذا المنشور' : `أعاد ${retweetsList.length} مستخدم تغريد هذا المنشور`}
          </span>
        </div>
      )}

      {/* Close Friends Banner */}
      {post.isCloseFriendsOnly && (
        <div className="px-4 py-1.5 bg-emerald-50 border-b border-emerald-100 flex items-center justify-between text-xs font-bold text-emerald-800">
          <span className="flex items-center gap-1.5">
            <Star className="w-3.5 h-3.5 fill-emerald-600 text-emerald-600" />
            <span>تغريدة حصرية للأصدقاء المقربين</span>
          </span>
          <span className="text-[10px] bg-emerald-200/60 text-emerald-900 px-2 py-0.5 rounded-full">
            خاص
          </span>
        </div>
      )}

      {/* Header with Author info */}
      <div className="p-4 sm:p-5 flex items-center justify-between gap-3 border-b border-stone-50">
        
        <div
          onClick={() => viewUserProfile(post.userId)}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="relative">
            {authorUser?.isClosed ? (
              <div className="w-11 h-11 rounded-full bg-[#333] text-white flex items-center justify-center font-black border-2 border-[#D4AF37]/40">
                <span className="text-base text-[#d8d8d8]">#</span>
              </div>
            ) : (
              <img
                src={post.userAvatar}
                alt={post.username}
                className={`w-11 h-11 rounded-full object-cover border-2 transition-all ${
                  post.isCloseFriendsOnly
                    ? 'border-emerald-500 ring-2 ring-emerald-200'
                    : 'border-[#D4AF37]/40 group-hover:border-[#0F3D2E]'
                }`}
              />
            )}
            {post.isApproved && (
              <span className="absolute bottom-0 end-0 w-3.5 h-3.5 rounded-full bg-[#0F3D2E] text-[#D4AF37] flex items-center justify-center ring-2 ring-white">
                <Check className="w-2.5 h-2.5 stroke-[3]" />
              </span>
            )}
          </div>

          <div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs sm:text-sm font-bold text-stone-900 group-hover:underline">
                {authorUser?.isClosed ? 'حساب مغلق' : authorUser?.fullName || post.username}
              </span>
              <span className="text-xs text-stone-400 font-mono">
                {authorUser?.isClosed ? <span dir="ltr">@aygram.user</span> : `@${post.username}`}
              </span>

              {/* Instagram-style Blue or Gold Verification Badge */}
              {authorUser?.verificationBadge && authorUser.verificationBadge !== 'none' ? (
                <VerificationBadge type={authorUser.verificationBadge} size="sm" />
              ) : authorUser?.verified ? (
                <VerificationBadge type="blue" size="sm" />
              ) : null}

              {/* Admin Banner for user y / owner */}
              {(post.username === 'y' || authorUser?.username === 'y' || authorUser?.role === 'owner') && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#0F3D2E] text-[#D4AF37] border border-[#D4AF37]/50 text-[10px] font-bold shadow-xs">
                  <Shield className="w-2.5 h-2.5 text-[#D4AF37]" />
                  <span>مسؤول المنصة</span>
                </span>
              )}

              {/* Account type tag */}
              {authorUser?.accountType === 'business' && (
                <span className="text-[10px] bg-amber-50 text-amber-800 border border-amber-200 px-1.5 py-0.2 rounded font-medium">
                  أعمال
                </span>
              )}
              {authorUser?.accountType === 'creator' && (
                <span className="text-[10px] bg-sky-50 text-sky-800 border border-sky-200 px-1.5 py-0.2 rounded font-medium">
                  صانع محتوى
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 text-[11px] text-stone-400 flex-wrap">
              <span>{formatDate(post.createdAt)}</span>
              {post.location && (
                <>
                  <span>•</span>
                  <span className="flex items-center gap-0.5 text-stone-500 font-medium">
                    <MapPin className="w-3 h-3 text-[#0F3D2E]" />
                    <span>{post.location}</span>
                  </span>
                </>
              )}
              <span>•</span>
              <span className="flex items-center gap-1">
                <Eye className="w-3 h-3 text-stone-400" />
                <span>{post.viewsCount} مشاهدة</span>
              </span>
            </div>
          </div>
        </div>

        {/* Options Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-50 transition-colors cursor-pointer"
          >
            <MoreHorizontal className="w-5 h-5" />
          </button>

          {showDropdown && (
            <>
              {/* Invisible full-screen backdrop to close on outside click */}
              <div
                className="fixed inset-0 z-20 cursor-default"
                onClick={() => setShowDropdown(false)}
              />
              <div className="absolute end-0 top-8 z-30 w-52 bg-white rounded-xl shadow-lg border border-stone-200 py-1.5 text-xs text-stone-800 animate-in fade-in zoom-in-95">
              <button
                onClick={() => {
                  handleSave();
                  setShowDropdown(false);
                }}
                className="w-full px-3 py-2 text-start flex items-center gap-2 hover:bg-stone-50 cursor-pointer"
              >
                <Bookmark className={`w-4 h-4 ${isSaved ? 'text-[#D4AF37] fill-[#D4AF37]' : ''}`} />
                <span>{isSaved ? 'إزالة من المحفوظات' : 'حفظ التغريدة'}</span>
              </button>

              <button
                onClick={() => {
                  handleShare();
                  setShowDropdown(false);
                }}
                className="w-full px-3 py-2 text-start flex items-center gap-2 hover:bg-stone-50 cursor-pointer"
              >
                <Share2 className="w-4 h-4" />
                <span>مشاركة ورابط التغريدة</span>
              </button>

              {!isAuthor && (
                <>
                  <button
                    onClick={() => {
                      openDirectChatWithUser(post.userId);
                      setShowDropdown(false);
                    }}
                    className="w-full px-3 py-2 text-start flex items-center gap-2 text-[#0F3D2E] hover:bg-stone-50 cursor-pointer"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>إرسال رسالة خاصة للكاتب</span>
                  </button>

                  <button
                    onClick={() => {
                      toggleBlockUser(post.userId);
                      setShowDropdown(false);
                    }}
                    className="w-full px-3 py-2 text-start flex items-center gap-2 text-red-600 hover:bg-red-50 cursor-pointer"
                  >
                    <UserX className="w-4 h-4" />
                    <span>{isBlocked ? 'إلغاء حظر المستخدم' : 'حظر هذا المستخدم'}</span>
                  </button>
                </>
              )}

              <button
                onClick={() => {
                  onOpenReport(post.id, post.content.slice(0, 50));
                  setShowDropdown(false);
                }}
                className="w-full px-3 py-2 text-start flex items-center gap-2 text-[#0F3D2E] hover:bg-stone-50 cursor-pointer"
              >
                <Flag className="w-4 h-4 text-[#0F3D2E]" />
                <span>إبلاغ عن مخالفة للقوانين</span>
              </button>

              {isAuthor && (
                <button
                  onClick={() => {
                    deletePost(post.id);
                    setShowDropdown(false);
                  }}
                  className="w-full px-3 py-2 text-start flex items-center gap-2 text-red-600 hover:bg-red-50 cursor-pointer border-t border-stone-100"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>حذف التغريدة</span>
                </button>
              )}
            </div>
            </>
          )}
        </div>

      </div>

      {/* Post Text Content with Mentions and Hashtags formatted */}
      <div className="p-4 sm:p-5 space-y-3">
        <p className="text-xs sm:text-sm text-stone-800 leading-relaxed whitespace-pre-line">
          <FormattedText text={post.content} />
        </p>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {post.tags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => {
                  setSearchQuery('#' + tag);
                  setActiveView('search');
                }}
                className="text-[11px] font-bold text-[#0F3D2E] bg-stone-50 hover:bg-[#0F3D2E]/10 px-2.5 py-1 rounded-lg border border-stone-200 transition-colors cursor-pointer"
              >
                #{tag}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Attached Media (Image or Video) */}
      {(post.image || (post.images && post.images.length > 0)) && (
        <div className="relative w-full max-h-[500px] overflow-hidden bg-stone-100">
          <img
            src={post.image}
            alt="مرفق التغريدة"
            loading="lazy"
            className="w-full h-auto max-h-[500px] object-cover"
          />
        </div>
      )}

      {/* Interactions Bar */}
      <div className="px-4 sm:px-5 py-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
        
        <div className="flex items-center gap-4 sm:gap-6">
          
          {/* Like Button with Uiverse Animated Heart */}
          <HeartLikeButton
            id={post.id}
            isLiked={isLiked}
            likesCount={post.likes.length}
            onToggle={handleLike}
          />

          {/* Retweet Button */}
          <button
            onClick={handleRetweet}
            className={`flex items-center gap-1.5 transition-colors cursor-pointer group ${
              isRetweeted ? 'text-[#0F3D2E] font-bold' : 'hover:text-[#0F3D2E]'
            }`}
            title={isRetweeted ? 'إلغاء إعادة التغريد' : 'إعادة التغريد'}
          >
            <Repeat2
              className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform group-active:scale-125 ${
                isRetweeted ? 'stroke-[2.5] text-[#0F3D2E]' : ''
              }`}
            />
            <span>{retweetsList.length}</span>
          </button>

          {/* Comment Button */}
          <button
            onClick={() => setShowComments(!showComments)}
            className="flex items-center gap-1.5 hover:text-[#0F3D2E] transition-colors cursor-pointer"
          >
            <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>{post.comments.length}</span>
          </button>

          {/* Share Button */}
          <button
            onClick={() => setIsShareModalOpen(true)}
            className="flex items-center gap-1.5 hover:text-[#0F3D2E] transition-colors cursor-pointer"
            title="مشاركة ورابط"
          >
            <Share2 className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="hidden sm:inline">مشاركة</span>
          </button>

        </div>

        {/* Save Post Bookmark (Uiverse by neerajbaniwal) */}
        <label
          className="ui-bookmark"
          title={isSaved ? 'محفوظ في قائمتك' : 'حفظ'}
        >
          <input type="checkbox" checked={isSaved} onChange={handleSave} />
          <div className="bookmark">
            <svg viewBox="0 0 32 32">
              <g>
                <path d="M27 4v27a1 1 0 0 1-1.625.781L16 24.281l-9.375 7.5A1 1 0 0 1 5 31V4a4 4 0 0 1 4-4h14a4 4 0 0 1 4 4z"></path>
              </g>
            </svg>
          </div>
        </label>

      </div>

      {/* Share Modal */}
      <ShareModal
        post={post}
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
      />

      {/* Comments Expandable Section */}
      {showComments && (
        <div className="p-4 sm:p-5 bg-stone-50/70 border-t border-stone-100 space-y-3">
          
          {/* Comments list */}
          <div className="space-y-2.5 max-h-60 overflow-y-auto pe-1">
            {post.comments.length === 0 ? (
              <p className="text-xs text-stone-400 text-center py-2">
                كن أول من يشارك بتعليق على هذه التغريدة
              </p>
            ) : (
              post.comments.map((c) => (
                <div key={c.id} className="flex items-start gap-2.5 bg-white p-2.5 rounded-xl border border-stone-200">
                  <img
                    src={c.userAvatar}
                    alt={c.username}
                    className="w-7 h-7 rounded-full object-cover border border-[#D4AF37]/50 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[11px] font-bold text-[#0F3D2E]">
                          @{c.username}
                        </span>
                        {c.username === 'y' && (
                          <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded-full bg-[#0F3D2E] text-[#D4AF37] border border-[#D4AF37]/40 text-[9px] font-bold shadow-xs">
                            <Shield className="w-2.5 h-2.5 text-[#D4AF37]" />
                            <span>مسؤول المنصة</span>
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5">
                        {currentUser && (currentUser.id === c.userId || currentUser.id === post.userId) && (
                          <button
                            type="button"
                            onClick={() => deleteComment(post.id, c.id)}
                            className="text-stone-400 hover:text-red-600 text-[10px] p-0.5 transition-colors cursor-pointer"
                            title="حذف التعليق"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => onOpenReport(c.id, c.content)}
                          className="text-stone-400 hover:text-stone-700 text-[10px] p-0.5 transition-colors cursor-pointer"
                          title="إبلاغ عن تعليق"
                        >
                          <Flag className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                    <p className="text-xs text-stone-800 mt-0.5 leading-relaxed">
                      {c.content}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Add comment input */}
          <form onSubmit={handleCommentSubmit} className="space-y-1.5 pt-1">
            <div className="flex gap-2">
              <input
                type="text"
                value={commentText}
                onChange={(e) => {
                  setCommentText(e.target.value);
                  if (commentError) setCommentError('');
                }}
                placeholder="اكتب ردك أو تعليقك..."
                className="flex-1 py-2 px-3.5 rounded-xl bg-white border border-stone-200 text-xs text-stone-900 focus:outline-none focus:border-[#0F3D2E]"
              />
              <button
                type="submit"
                className="py-2 px-4 rounded-xl bg-[#0F3D2E] text-white font-bold text-xs hover:bg-[#155A44] transition-colors cursor-pointer flex items-center justify-center shadow"
              >
                <Send className="w-3.5 h-3.5 rotate-180" />
              </button>
            </div>

            {commentError && (
              <div className="p-2 rounded-lg bg-red-50 border border-red-200 text-[11px] text-red-800 font-medium flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{commentError}</span>
              </div>
            )}
          </form>

        </div>
      )}

    </article>

    <style>{`
      .ui-bookmark {
        --icon-size: 22px;
        --icon-secondary-color: rgb(164, 164, 164);
        --icon-hover-color: rgb(165, 164, 164);
        --icon-primary-color: var(--gold, #D4AF37);
        --icon-circle-border: 1px solid var(--icon-primary-color);
        --icon-circle-size: 35px;
        --icon-anmt-duration: 0.3s;
      }

      .ui-bookmark input {
        -webkit-appearance: none;
        -moz-appearance: none;
        appearance: none;
        display: none;
      }

      .ui-bookmark .bookmark {
        width: var(--icon-size);
        height: auto;
        fill: var(--icon-secondary-color);
        cursor: pointer;
        -webkit-transition: 0.2s;
        -o-transition: 0.2s;
        transition: 0.2s;
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        -webkit-box-pack: center;
        -ms-flex-pack: center;
        justify-content: center;
        -webkit-box-align: center;
        -ms-flex-align: center;
        align-items: center;
        position: relative;
        -webkit-transform-origin: top;
        -ms-transform-origin: top;
        transform-origin: top;
      }

      .ui-bookmark .bookmark::after {
        content: "";
        position: absolute;
        width: 10px;
        height: 10px;
        box-shadow: 0 30px 0 -4px var(--icon-primary-color),
          30px 0 0 -4px var(--icon-primary-color),
          0 -30px 0 -4px var(--icon-primary-color),
          -30px 0 0 -4px var(--icon-primary-color),
          -22px 22px 0 -4px var(--icon-primary-color),
          -22px -22px 0 -4px var(--icon-primary-color),
          22px -22px 0 -4px var(--icon-primary-color),
          22px 22px 0 -4px var(--icon-primary-color);
        border-radius: 50%;
        -webkit-transform: scale(0);
        -ms-transform: scale(0);
        transform: scale(0);
      }

      .ui-bookmark .bookmark::before {
        content: "";
        position: absolute;
        border-radius: 50%;
        border: var(--icon-circle-border);
        opacity: 0;
      }

      .ui-bookmark:hover .bookmark {
        fill: var(--icon-hover-color);
      }

      .ui-bookmark input:checked + .bookmark::after {
        -webkit-animation: ubmak-circles var(--icon-anmt-duration)
          cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        animation: ubmak-circles var(--icon-anmt-duration)
          cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        -webkit-animation-delay: var(--icon-anmt-duration);
        animation-delay: var(--icon-anmt-duration);
      }

      .ui-bookmark input:checked + .bookmark {
        fill: var(--icon-primary-color);
        -webkit-animation: ubmak-bookmark var(--icon-anmt-duration) forwards;
        animation: ubmak-bookmark var(--icon-anmt-duration) forwards;
        -webkit-transition-delay: 0.3s;
        -o-transition-delay: 0.3s;
        transition-delay: 0.3s;
      }

      .ui-bookmark input:checked + .bookmark::before {
        -webkit-animation: ubmak-circle var(--icon-anmt-duration)
          cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        animation: ubmak-circle var(--icon-anmt-duration)
          cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        -webkit-animation-delay: var(--icon-anmt-duration);
        animation-delay: var(--icon-anmt-duration);
      }

      @keyframes ubmak-bookmark {
        50% {
          -webkit-transform: scaleY(0.6);
          transform: scaleY(0.6);
        }
        100% {
          -webkit-transform: scaleY(1);
          transform: scaleY(1);
        }
      }

      @keyframes ubmak-circle {
        from {
          width: 0;
          height: 0;
          opacity: 0;
        }
        90% {
          width: var(--icon-circle-size);
          height: var(--icon-circle-size);
          opacity: 1;
        }
        to {
          opacity: 0;
        }
      }

      @keyframes ubmak-circles {
        from {
          -webkit-transform: scale(0);
          transform: scale(0);
        }
        40% {
          opacity: 1;
        }
        to {
          -webkit-transform: scale(0.8);
          transform: scale(0.8);
          opacity: 0;
        }
      }
    `}</style>
    </>
  );
};

