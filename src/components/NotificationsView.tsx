import React, { useState } from 'react';
import {
  Bell,
  Heart,
  MessageCircle,
  UserPlus,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Sparkles,
  CheckCheck,
  Filter,
  Trash2,
  ExternalLink
} from 'lucide-react';
import { useAyGram } from '../context/AyGramContext';
import { NotificationItem } from '../types/aygram';

export const NotificationsView: React.FC = () => {
  const { notifications, viewUserProfile, setNotifications, showToast } = useAyGram();
  const [filter, setFilter] = useState<'all' | 'unread' | 'social' | 'system'>('all');

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const markAllAsRead = () => {
    setNotifications((prev: NotificationItem[]) => prev.map((n: NotificationItem) => ({ ...n, isRead: true })));
    showToast('تم تحديد جميع الإشعارات كمقروءة', 'success');
  };

  const clearAllNotifications = () => {
    if (notifications.length === 0) return;
    setNotifications([]);
    showToast('تم مسح جميع الإشعارات', 'info');
  };

  const getIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'like':
        return <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />;
      case 'comment':
        return <MessageCircle className="w-4 h-4 text-[#0F3D2E]" />;
      case 'follow':
        return <UserPlus className="w-4 h-4 text-[#D4AF37]" />;
      case 'approval':
        return <CheckCircle2 className="w-4 h-4 text-emerald-600" />;
      case 'rejection':
        return <AlertTriangle className="w-4 h-4 text-amber-600" />;
      default:
        return <Bell className="w-4 h-4 text-stone-500" />;
    }
  };

  const filteredNotifications = notifications.filter((n) => {
    if (filter === 'unread') return !n.isRead;
    if (filter === 'social') return n.type === 'like' || n.type === 'comment' || n.type === 'follow';
    if (filter === 'system') return n.type === 'approval' || n.type === 'rejection';
    return true;
  });

  return (
    <div className="space-y-3 sm:space-y-4 font-['IBM_Plex_Sans_Arabic']" dir="rtl">
      
      {/* Header Card */}
      <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-5 border border-stone-200 shadow-xs">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#0F3D2E] text-[#D4AF37] flex items-center justify-center shrink-0 shadow-xs">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-black text-[#0F3D2E]">مركز الإشعارات</h2>
              <p className="text-[11px] sm:text-xs text-stone-500">
                {unreadCount > 0 ? `لديك ${unreadCount} إشعار غير مقروء` : 'جميع التنبيهات محدثة ومقروءة'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllAsRead}
                className="px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-[11px] font-bold transition-all flex items-center gap-1 cursor-pointer"
                title="تحديد الكل كمقروء"
              >
                <CheckCheck className="w-3.5 h-3.5 text-[#0F3D2E]" />
                <span className="hidden sm:inline">تحديد كمقروء</span>
              </button>
            )}

            {notifications.length > 0 && (
              <button
                type="button"
                onClick={clearAllNotifications}
                className="p-2 rounded-xl text-stone-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                title="مسح الإشعارات"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Filter Pills for quick mobile switching */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-4 border-t border-stone-100 mt-4 scrollbar-none">
          <button
            type="button"
            onClick={() => setFilter('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
              filter === 'all'
                ? 'bg-[#0F3D2E] text-[#D4AF37] shadow-xs'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            الكل ({notifications.length})
          </button>
          <button
            type="button"
            onClick={() => setFilter('unread')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
              filter === 'unread'
                ? 'bg-[#0F3D2E] text-[#D4AF37] shadow-xs'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            غير مقروء ({unreadCount})
          </button>
          <button
            type="button"
            onClick={() => setFilter('social')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
              filter === 'social'
                ? 'bg-[#0F3D2E] text-[#D4AF37] shadow-xs'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            التفاعلات والمتابعات
          </button>
          <button
            type="button"
            onClick={() => setFilter('system')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
              filter === 'system'
                ? 'bg-[#0F3D2E] text-[#D4AF37] shadow-xs'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            النظام والرقابة
          </button>
        </div>
      </div>

      {/* Notifications List */}
      {filteredNotifications.length === 0 ? (
        <div className="bg-white rounded-2xl sm:rounded-3xl p-8 sm:p-12 text-center border border-stone-200 shadow-xs space-y-2.5">
          <div className="w-12 h-12 rounded-2xl bg-[#0F3D2E]/5 text-[#D4AF37] flex items-center justify-center mx-auto">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-stone-700">لا توجد إشعارات في هذا القسم</h3>
          <p className="text-xs text-stone-500 max-w-xs mx-auto">
            عندما يتفاعل أي شخص مع منشوراتك أو يرسل لك متابعة، ستظهر الإشعارات هنا فوراً
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {filteredNotifications.map((n) => (
            <div
              key={n.id}
              className={`p-3.5 sm:p-4 rounded-2xl border transition-all flex items-start gap-3 bg-white ${
                !n.isRead
                  ? 'border-[#D4AF37] bg-[#FCF9F0]/60 shadow-xs'
                  : 'border-stone-200 hover:border-stone-300'
              }`}
            >
              {/* Type Badge */}
              <div className="p-2 rounded-xl bg-stone-100 shrink-0 border border-stone-200 mt-0.5">
                {getIcon(n.type)}
              </div>

              {/* Main Content */}
              <div className="flex-1 min-w-0">
                <div className="text-xs leading-relaxed text-stone-800 break-words">
                  {n.actorName && (
                    <button
                      type="button"
                      onClick={() => n.actorId !== 'admin' && viewUserProfile(n.actorId)}
                      className="font-bold text-[#0F3D2E] hover:underline cursor-pointer me-1.5"
                    >
                      @{n.actorName}
                    </button>
                  )}
                  <span>{n.text}</span>
                </div>

                <div className="flex items-center gap-1.5 text-[10px] text-stone-400 mt-1.5">
                  <Clock className="w-3 h-3" />
                  <span>
                    {new Date(n.createdAt).toLocaleDateString('ar-SA', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              </div>

              {/* Read indicator */}
              {!n.isRead && (
                <span className="w-2.5 h-2.5 rounded-full bg-[#D4AF37] shrink-0 self-center" />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
