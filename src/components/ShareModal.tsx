import React, { useState } from 'react';
import {
  Share2,
  Copy,
  Check,
  Send,
  X,
  MessageCircle,
  ExternalLink,
  Sparkles
} from 'lucide-react';
import { Post } from '../types/aygram';
import { useAyGram } from '../context/AyGramContext';

interface ShareModalProps {
  post: Post | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({ post, isOpen, onClose }) => {
  const { currentUser, users, sendMessage } = useAyGram();
  const [copied, setCopied] = useState(false);
  const [selectedUserToSend, setSelectedUserToSend] = useState('');
  const [sendSuccess, setSendSuccess] = useState(false);
  const [dmNote, setDmNote] = useState('');

  if (!isOpen || !post) return null;

  const postUrl = `${window.location.origin}/#post_${post.id}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(postUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendViaDM = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !selectedUserToSend) return;
    const content = dmNote.trim()
      ? `${dmNote.trim()}\n\n[رابط المنشور: @${post.username}]`
      : `السلام عليكم، أشارك معك هذا المنشور المبارك للكاتب @${post.username}: "${post.content.slice(0, 60)}..."`;

    const res = sendMessage(selectedUserToSend, content, post.id);
    if (res.success) {
      setSendSuccess(true);
      setTimeout(() => {
        setSendSuccess(false);
        onClose();
      }, 1200);
    }
  };

  const handleNativeShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `منشور في AyGram بواسطة @${post.username}`,
        text: post.content.slice(0, 100),
        url: postUrl,
      }).catch(() => {});
    } else {
      handleCopyLink();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 font-['IBM_Plex_Sans_Arabic']" dir="rtl">
      <div className="bg-white rounded-[20px] max-w-md w-full p-6 border border-[#EFE9D9] shadow-aygram-md relative text-[#1A1A1A]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 start-4 p-1.5 rounded-full text-[#7A7A7A] hover:text-[#0F3D2E] hover:bg-[#FCF9F0] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-4">
          <div className="w-12 h-12 rounded-[14px] bg-[#0F3D2E]/10 text-[#0F3D2E] flex items-center justify-center mx-auto mb-2">
            <Share2 className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-[#0F3D2E]">مشاركة المنشور</h3>
          <p className="text-xs text-[#7A7A7A]">شارك الخير والفائدة مع الآخرين</p>
        </div>

        {/* Post Snippet */}
        <div className="bg-[#FCF9F0] p-3 rounded-[14px] border border-[#EFE9D9] mb-4">
          <div className="flex items-center gap-2 mb-1.5">
            <img
              src={post.userAvatar}
              alt={post.username}
              className="w-6 h-6 rounded-full object-cover"
            />
            <span className="text-xs font-bold text-[#0F3D2E]">@{post.username}</span>
          </div>
          <p className="text-xs text-[#555555] line-clamp-2 leading-relaxed">
            {post.content}
          </p>
        </div>

        {/* Copy Link Action */}
        <div className="mb-4">
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={postUrl}
              className="flex-1 py-2 px-3 rounded-[12px] bg-[#FCF9F0] border border-[#EFE9D9] text-xs text-[#7A7A7A] select-all font-mono"
            />
            <button
              onClick={handleCopyLink}
              className="px-3.5 py-2 rounded-[12px] bg-[#0F3D2E] text-white text-xs font-bold flex items-center gap-1 hover:bg-[#155A44] transition-colors cursor-pointer shrink-0"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-[#D4AF37]" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'تم النسخ' : 'نسخ الرابط'}</span>
            </button>
          </div>
        </div>

        {/* Send to Member via DM */}
        {currentUser && (
          <form onSubmit={handleSendViaDM} className="mb-4 pt-3 border-t border-[#EFE9D9] space-y-2.5">
            <div className="text-xs font-bold text-[#0F3D2E] flex items-center gap-1.5">
              <MessageCircle className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>إرسال في رسالة خاصة لعضو في AyGram:</span>
            </div>

            {sendSuccess && (
              <div className="p-2 bg-emerald-50 border border-emerald-200 rounded-[10px] text-xs text-emerald-700 font-bold flex items-center gap-1.5">
                <Check className="w-4 h-4" />
                <span>تم إرسال المنشور في الرسائل بنجاح!</span>
              </div>
            )}

            <select
              value={selectedUserToSend}
              onChange={(e) => setSelectedUserToSend(e.target.value)}
              className="w-full py-2 px-3 rounded-[12px] bg-[#FCF9F0] border border-[#EFE9D9] text-xs focus:outline-none focus:border-[#0F3D2E]"
              required
            >
              <option value="">اختر العضو المراد الإرسال إليه...</option>
              {users
                .filter((u) => u.id !== currentUser.id)
                .map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.fullName || u.username} (@{u.username})
                  </option>
                ))}
            </select>

            <input
              type="text"
              value={dmNote}
              onChange={(e) => setDmNote(e.target.value)}
              placeholder="أضف ملاحظة طيبة مع المنشور (اختياري)..."
              className="w-full py-2 px-3 rounded-[12px] bg-[#FCF9F0] border border-[#EFE9D9] text-xs focus:outline-none focus:border-[#0F3D2E]"
            />

            <button
              type="submit"
              disabled={!selectedUserToSend}
              className="w-full py-2 rounded-[12px] bg-[#D4AF37] text-[#0F3D2E] font-bold text-xs hover:bg-[#C29E2E] transition-colors disabled:opacity-40 cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5 rotate-180" />
              <span>إرسال في محادثة خاصة</span>
            </button>
          </form>
        )}

        {/* External Social Share Buttons */}
        <div className="pt-3 border-t border-[#EFE9D9] flex items-center justify-center gap-3">
          <a
            href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`${post.content.slice(0, 100)}\n${postUrl}`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2.5 rounded-[12px] bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366]/20 transition-colors flex items-center gap-1 text-xs font-bold"
          >
            <span>واتساب</span>
          </a>

          <a
            href={`https://t.me/share/url?url=${encodeURIComponent(postUrl)}&text=${encodeURIComponent(post.content.slice(0, 100))}`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2.5 rounded-[12px] bg-[#0088cc]/10 text-[#0088cc] hover:bg-[#0088cc]/20 transition-colors flex items-center gap-1 text-xs font-bold"
          >
            <span>تيليجرام</span>
          </a>

          <a
            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`${post.content.slice(0, 100)} عبر منصة AyGram\n${postUrl}`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2.5 rounded-[12px] bg-black/5 text-black hover:bg-black/10 transition-colors flex items-center gap-1 text-xs font-bold"
          >
            <span>منصة X</span>
          </a>

          <button
            onClick={handleNativeShare}
            className="p-2.5 rounded-[12px] bg-[#0F3D2E]/10 text-[#0F3D2E] hover:bg-[#0F3D2E]/20 transition-colors flex items-center gap-1 text-xs font-bold cursor-pointer"
          >
            <span>المزيد</span>
          </button>
        </div>
      </div>
    </div>
  );
};
