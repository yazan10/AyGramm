import React, { useState, useRef, useEffect } from 'react';
import {
  User as UserIcon,
  Search,
  CheckCheck,
  ShieldCheck,
  AlertCircle,
  MessageCircle,
  ArrowRight,
  Sparkles,
  Smile,
  Users,
  UserPlus,
  X,
  Trash2,
  Mic,
  MicOff,
  Inbox,
  Mail,
  Check
} from 'lucide-react';
import { useAyGram } from '../context/AyGramContext';
import { ChatSkeletonLoader } from './ChatSkeletonLoader';
import { AIChatInput } from './AIChatInput';
import { ChannelsView } from './ChannelsView';
import { VoiceNotePlayer } from './VoiceNotePlayer';
import { ChatConversation } from '../types/aygram';

// Overlapping avatar stack — adapted from Uiverse.io by ilkhoeri
const GroupAvatarStack: React.FC<{ avatars: string[]; label?: string }> = ({ avatars, label }) => {
  const shown = avatars.slice(0, 5);
  return (
    <div className="flex items-center" title={label}>
      {shown.map((src, i) => {
        const last = i === shown.length - 1;
        const middle = i === 2;
        const size = last && shown.length > 1 ? 30 : middle ? 48 : i % 2 === 1 ? 40 : 34;
        return (
          <span
            key={i}
            className="relative rounded-full bg-white border border-white object-cover -ml-2.5 first:ml-0 shadow-sm"
            style={{ width: size, height: size, zIndex: i + 3 }}
          >
            <img src={src} alt="" className="w-full h-full rounded-full object-cover" />
          </span>
        );
      })}
    </div>
  );
};

export const DirectMessagesView: React.FC = () => {
  const {
    currentUser,
    users,
    posts,
    conversations,
    messages,
    sendMessage,
    sendGroupMessage,
    createGroupConversation,
    addGroupMember,
    markConversationAsRead,
    activeConversationUserId,
    setActiveConversationUserId,
    viewUserProfile,
    acceptMessageRequest,
    rejectMessageRequest,
    setActiveView
  } = useAyGram();

  const [messageInput, setMessageInput] = useState('');
  const [searchRecipientQuery, setSearchRecipientQuery] = useState('');
  const [errorBanner, setErrorBanner] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showEmojiBar, setShowEmojiBar] = useState(false);
  const [isLoadingChats, setIsLoadingChats] = useState(false);
  const [viewTab, setViewTab] = useState<'chats' | 'requests' | 'channels'>('chats');

  // Group chat state
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [activeGroupConv, setActiveGroupConv] = useState<ChatConversation | null>(null);
  const [groupName, setGroupName] = useState('');
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [groupError, setGroupError] = useState('');
  const [showAddMembers, setShowAddMembers] = useState(false);
  const [addTargetId, setAddTargetId] = useState('');

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Voice recording
  const [isRecording, setIsRecording] = useState(false);
  const [recordSeconds, setRecordSeconds] = useState(0);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const recordTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (recordTimerRef.current) clearInterval(recordTimerRef.current);
    };
  }, []);

  const startRecording = async () => {
    setErrorBanner('');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const rec = new MediaRecorder(stream);
      const chunks: Blob[] = [];
      rec.ondataavailable = (e) => { if (e.data.size > 0) chunks.push(e.data); };
      rec.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        const audioUrl = URL.createObjectURL(blob);
        sendVoiceMessage(audioUrl);
        stream.getTracks().forEach((t) => t.stop());
        setIsRecording(false);
        setRecordSeconds(0);
      };
      rec.start();
      recorderRef.current = rec;
      setIsRecording(true);
      setRecordSeconds(0);
      recordTimerRef.current = setInterval(() => setRecordSeconds((s) => s + 1), 1000);
    } catch {
      setErrorBanner('تعذر الوصول إلى الميكروفون. تأكد من منح الصلاحية.');
    }
  };

  const stopRecording = () => {
    if (recorderRef.current && recorderRef.current.state !== 'inactive') {
      recorderRef.current.stop();
    }
    if (recordTimerRef.current) clearInterval(recordTimerRef.current);
  };

  const sendVoiceMessage = (audioUrl: string) => {
    if (activeGroup) {
      sendGroupMessage(activeGroup.id, '', audioUrl);
    } else if (activeRecipient) {
      sendMessage(activeRecipient.id, '', undefined, audioUrl);
    }
  };

  if (!currentUser) {
    return (
      <div className="max-w-xl mx-auto py-16 px-4 text-center">
        <div className="w-16 h-16 rounded-[20px] bg-[#0F3D2E]/10 text-[#0F3D2E] flex items-center justify-center mx-auto mb-4">
          <MessageCircle className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-[#0F3D2E] mb-2">
          الرسائل الخاصة في AyGram
        </h2>
        <p className="text-sm text-[#7A7A7A] mb-6">
          يرجى تسجيل الدخول أو إنشاء حساب للتواصل بأمان وسرية تامة مع سائر الإخوة والأخوات والتجار.
        </p>
        <button
          onClick={() => setActiveView('auth')}
          className="py-2.5 px-6 rounded-xl bg-[#0F3D2E] hover:bg-[#155A44] text-[#D4AF37] font-bold text-xs transition-colors shadow-aygram cursor-pointer"
        >
          تسجيل الدخول / إنشاء حساب
        </button>
      </div>
    );
  }

  // Selected recipient (1:1)
  const activeRecipient = users.find((u) => u.id === activeConversationUserId) || null;
  const activeGroup = activeGroupConv;

  // Filter conversations involving currentUser
  const userConversations = conversations.filter((c) =>
    c.participantIds.includes(currentUser.id)
  );
  const userGroups = userConversations.filter((c) => c.isGroup);

  // Incoming message requests (waiting for current user's approval)
  const incomingRequests = userConversations.filter(
    (c) =>
      !c.isGroup &&
      c.isRequest &&
      c.requestedBy !== currentUser.id &&
      !c.requestAccepted
  );

  // Exclude unaccepted incoming requests from regular 1:1 chat list
  const userChats = userConversations.filter(
    (c) =>
      !c.isGroup &&
      !(c.isRequest && c.requestedBy !== currentUser.id && !c.requestAccepted)
  );

  // Active 1:1 conversation
  const activeConversation = activeRecipient
    ? conversations.find(
        (c) =>
          !c.isGroup &&
          c.participantIds.includes(currentUser.id) &&
          c.participantIds.includes(activeRecipient.id)
      )
    : null;

  const isCurrentChatIncomingRequest = Boolean(
    activeConversation &&
    activeConversation.isRequest &&
    activeConversation.requestedBy !== currentUser.id &&
    !activeConversation.requestAccepted
  );

  // Filter messages for active chat
  const activeChatMessages = activeGroup
    ? messages.filter((m) => m.conversationId === activeGroup.id)
    : activeRecipient
    ? messages.filter(
        (m) =>
          (m.senderId === currentUser.id && m.receiverId === activeRecipient.id) ||
          (m.senderId === activeRecipient.id && m.receiverId === currentUser.id)
      )
    : [];

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeChatMessages.length, isTyping]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorBanner('');
    if (activeGroup) {
      if (!messageInput.trim()) return;
      const res = sendGroupMessage(activeGroup.id, messageInput.trim());
      if (res.success) {
        setMessageInput('');
      } else {
        setErrorBanner(res.error || 'تعذر إرسال الرسالة');
      }
      return;
    }
    if (!activeRecipient) return;
    if (!messageInput.trim()) return;

    const res = sendMessage(activeRecipient.id, messageInput.trim());
    if (res.success) {
      setMessageInput('');
    } else {
      setErrorBanner(res.error || 'تعذر إرسال الرسالة');
    }
  };

  const handleSelectConversation = (otherUserId: string) => {
    setIsLoadingChats(true);
    setActiveConversationUserId(otherUserId);
    setActiveGroupConv(null);
    const conv = conversations.find(
      (c) =>
        c.participantIds.includes(currentUser.id) &&
        !c.isGroup &&
        c.participantIds.includes(otherUserId)
    );
    if (conv) {
      markConversationAsRead(conv.id);
    }
    setTimeout(() => {
      setIsLoadingChats(false);
    }, 250);
  };

  const handleSelectGroup = (conv: ChatConversation) => {
    setIsLoadingChats(true);
    setActiveConversationUserId(null);
    setActiveGroupConv(conv);
    markConversationAsRead(conv.id);
    setTimeout(() => {
      setIsLoadingChats(false);
    }, 250);
  };

  // Filter potential new chat users
  const filteredUsersToChat = users.filter(
    (u) =>
      u.id !== currentUser.id &&
      !u.isClosed &&
      (u.username.toLowerCase().includes(searchRecipientQuery.toLowerCase()) ||
        u.fullName?.toLowerCase().includes(searchRecipientQuery.toLowerCase()))
  );

  const toggleMember = (userId: string) => {
    setSelectedMembers((prev) =>
      prev.includes(userId) ? prev.filter((x) => x !== userId) : [...prev, userId]
    );
  };

  const handleCreateGroup = (e: React.FormEvent) => {
    e.preventDefault();
    setGroupError('');
    const res = createGroupConversation(selectedMembers, groupName);
    if (res.success && res.conversationId) {
      setGroupName('');
      setSelectedMembers([]);
      setShowGroupModal(false);
      const conv = conversations.find((c) => c.id === res.conversationId);
      if (conv) handleSelectGroup(conv);
    } else {
      setGroupError(res.error || 'تعذر إنشاء المجموعة');
    }
  };

  const handleAddGroupMember = () => {
    if (!activeGroup || !addTargetId) return;
    const res = addGroupMember(activeGroup.id, addTargetId);
    if (!res.success) {
      setErrorBanner(res.error || 'تعذر إضافة العضو');
    }
    setAddTargetId('');
    setShowAddMembers(false);
  };

  const groupMemberUsers = activeGroup
    ? activeGroup.participantIds
        .map((id) => users.find((u) => u.id === id))
        .filter((u): u is NonNullable<typeof u> => Boolean(u))
    : [];

  const isGroupOwner = activeGroup ? activeGroup.adminIds?.includes(currentUser.id) : false;
  const canAddMore = activeGroup
    ? activeGroup.participantIds.length < (activeGroup.maxMembers || 25)
    : false;

  const isChatOpen = Boolean(activeRecipient || activeGroup);

  return (
    <div className="max-w-4xl mx-auto px-2 sm:px-4 py-4 font-['IBM_Plex_Sans_Arabic']" dir="rtl">
      {/* Banner if banned */}
      {!currentUser.isActive && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-[14px] text-xs font-bold text-red-700 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>حسابك موقوف حالياً من قِبل الإدارة. لا يمكنك إرسال رسائل جديدة.</span>
        </div>
      )}

      {errorBanner && (
        <div className="mb-4 p-3 bg-[#E8B4B8]/40 border border-[#E8B4B8] rounded-[14px] text-xs font-bold text-[#801824] flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorBanner}</span>
        </div>
      )}

      {/* Tabs: الرسائل / طلبات المراسلة / القنوات */}
      <div className="flex items-center gap-1 mb-3 rounded-[16px] bg-white border border-[#EFE9D9] p-1 shadow-aygram max-w-md">
        <button
          type="button"
          onClick={() => setViewTab('chats')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-[12px] text-xs font-bold transition-all cursor-pointer ${
            viewTab === 'chats' ? 'bg-[#0F3D2E] text-[#D4AF37] shadow' : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <MessageCircle className="w-3.5 h-3.5" />
          <span>المحادثات</span>
        </button>
        <button
          type="button"
          onClick={() => setViewTab('requests')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-[12px] text-xs font-bold transition-all cursor-pointer relative ${
            viewTab === 'requests' ? 'bg-[#0F3D2E] text-[#D4AF37] shadow' : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <Inbox className="w-3.5 h-3.5" />
          <span>طلبات المراسلة</span>
          {incomingRequests.length > 0 && (
            <span className="px-1.5 py-0.2 rounded-full bg-[#D4AF37] text-[#0F3D2E] text-[10px] font-extrabold shadow-xs">
              {incomingRequests.length}
            </span>
          )}
        </button>
        <button
          type="button"
          onClick={() => setViewTab('channels')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-[12px] text-xs font-bold transition-all cursor-pointer ${
            viewTab === 'channels' ? 'bg-[#0F3D2E] text-[#D4AF37] shadow' : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>القنوات الخاصة</span>
        </button>
      </div>

      <div className={`bg-white rounded-[20px] border border-[#EFE9D9] shadow-aygram overflow-hidden flex flex-col md:flex-row h-[75vh] ${viewTab !== 'chats' ? 'hidden' : ''}`}>
        {/* SIDEBAR: Conversation List */}
        <div className={`w-full md:w-80 border-b md:border-b-0 md:border-e border-[#EFE9D9] flex-col bg-[#FCF9F0]/60 ${isChatOpen ? 'hidden md:flex' : 'flex flex-1'}`}>
          {/* Header & Search */}
          <div className="p-3.5 border-b border-[#EFE9D9]">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-bold text-[#0F3D2E] flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-[#D4AF37]" />
                الرسائل الخاصة
              </h2>
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#0F3D2E]/10 text-[#0F3D2E] font-bold">
                  مشفرة وآمنة 🛡️
                </span>
                <button
                  type="button"
                  onClick={() => setShowGroupModal(true)}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-[12px] bg-[#0F3D2E] text-[#D4AF37] text-xs font-bold hover:bg-[#16503c] transition-colors cursor-pointer"
                  title="إنشاء مجموعة جديدة (حتى 25 شخصاً)"
                >
                  <Users className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">مجموعة</span>
                </button>
              </div>
            </div>

            <div className="relative">
              <input
                type="text"
                value={searchRecipientQuery}
                onChange={(e) => setSearchRecipientQuery(e.target.value)}
                placeholder="ابحث عن عضو لمراسلته..."
                className="w-full py-1.5 px-3 pe-8 rounded-[12px] bg-white border border-[#EFE9D9] text-xs focus:outline-none focus:border-[#0F3D2E]"
              />
              <Search className="w-3.5 h-3.5 text-[#7A7A7A] absolute end-2.5 top-2.5" />
            </div>
          </div>

          {/* Quick Message Requests Banner if any pending */}
          {incomingRequests.length > 0 && (
            <button
              type="button"
              onClick={() => setViewTab('requests')}
              className="w-full p-2.5 bg-gradient-to-r from-[#D4AF37]/20 via-[#0F3D2E]/10 to-transparent border-b border-[#EFE9D9] flex items-center justify-between hover:bg-[#D4AF37]/30 transition-colors cursor-pointer text-start"
            >
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#0F3D2E] text-[#D4AF37] flex items-center justify-center shadow-xs">
                  <Inbox className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#0F3D2E] flex items-center gap-1.5">
                    <span>طلبات المراسلة</span>
                    <span className="px-1.5 py-0.2 rounded-full bg-[#D4AF37] text-[#0F3D2E] text-[10px] font-extrabold">
                      {incomingRequests.length}
                    </span>
                  </div>
                  <div className="text-[10px] text-stone-500">انقر لمراجعة وقبول الرسائل الواردة</div>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-[#0F3D2E] rotate-180" />
            </button>
          )}

          {/* Conversation & User List */}
          <div className="flex-1 overflow-y-auto divide-y divide-[#EFE9D9]/50">
            {searchRecipientQuery ? (
              // Search Results
              <div className="p-2 space-y-1">
                <div className="text-[11px] font-bold text-[#7A7A7A] px-2 py-1">
                  نتائج البحث ({filteredUsersToChat.length}):
                </div>
                {filteredUsersToChat.map((u) => (
                  <button
                    key={u.id}
                    onClick={() => {
                      handleSelectConversation(u.id);
                      setSearchRecipientQuery('');
                    }}
                    className="w-full p-2.5 rounded-[12px] hover:bg-white flex items-center gap-2.5 text-start transition-colors cursor-pointer"
                  >
                    <img
                      src={u.profileImage}
                      alt={u.username}
                      className="w-9 h-9 rounded-full object-cover border border-[#EFE9D9]"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold text-[#1A1A1A] flex items-center gap-1">
                        <span className="truncate">{u.fullName || u.username}</span>
                        {u.verified && (
                          <span className="text-[#0F3D2E] text-[10px]" title="موثق">✓</span>
                        )}
                      </div>
                      <div className="text-[11px] text-[#7A7A7A] truncate">
                        @{u.username}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              // Recent Conversations (Groups first, then 1:1 users)
              <div>
                {/* Groups */}
                {userGroups.map((conv) => {
                  const members = conv.participantIds
                    .map((id) => users.find((u) => u.id === id))
                    .filter((u): u is NonNullable<typeof u> => Boolean(u));
                  const isSelected = activeGroup?.id === conv.id;
                  return (
                    <button
                      key={conv.id}
                      onClick={() => handleSelectGroup(conv)}
                      className={`w-full p-3 flex items-center gap-3 text-start transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-[#0F3D2E]/10 border-s-4 border-[#0F3D2E]'
                          : 'hover:bg-white/80'
                      }`}
                    >
                      <div className="relative shrink-0">
                        <GroupAvatarStack
                          avatars={members.map((m) => m.profileImage)}
                          label={`${conv.groupName} (${conv.participantIds.length}/25)`}
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-0.5">
                          <span className="text-xs font-bold text-[#1A1A1A] truncate flex items-center gap-1">
                            <Users className="w-3 h-3 text-[#0F3D2E]" />
                            {conv.groupName}
                            <span className="text-[10px] text-[#7A7A7A] font-semibold">
                              ({conv.participantIds.length}/25)
                            </span>
                          </span>
                          <span className="text-[10px] text-[#7A7A7A]">
                            {new Date(conv.lastMessageTime).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#7A7A7A] truncate">
                          {conv.unreadCount > 0 && (
                            <span className="me-1 px-1.5 py-0.5 rounded-full bg-[#D4AF37] text-[#0F3D2E] text-[10px] font-bold">
                              {conv.unreadCount}
                            </span>
                          )}
                          {conv.lastMessageText}
                        </p>
                      </div>
                    </button>
                  );
                })}

                {/* 1:1 Users */}
                {userGroups.length > 0 && (
                  <div className="px-3 pt-2.5 pb-1 text-[10px] font-bold text-[#7A7A7A]">
                    المحادثات المباشرة
                  </div>
                )}
                {users
                  .filter((u) => u.id !== currentUser.id && !u.isClosed)
                  .map((otherUser) => {
                    const conv = userChats.find((c) =>
                      c.participantIds.includes(otherUser.id)
                    );
                    const isSelected = activeRecipient?.id === otherUser.id;

                    return (
                      <button
                        key={otherUser.id}
                        onClick={() => handleSelectConversation(otherUser.id)}
                        className={`w-full p-3 flex items-center gap-3 text-start transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-[#0F3D2E]/10 border-s-4 border-[#0F3D2E]'
                            : 'hover:bg-white/80'
                        }`}
                      >
                        <div className="relative">
                          <img
                            src={otherUser.profileImage}
                            alt={otherUser.username}
                            className="w-10 h-10 rounded-full object-cover border border-[#EFE9D9]"
                          />
                          {otherUser.isActive && (
                            <span className="absolute bottom-0 start-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-0.5">
                            <span className="text-xs font-bold text-[#1A1A1A] truncate flex items-center gap-1">
                              {otherUser.fullName || otherUser.username}
                              {otherUser.verified && (
                                <span className="text-[#0F3D2E] text-[10px]" title="حساب موثق">✓</span>
                              )}
                            </span>
                            {conv && (
                              <span className="text-[10px] text-[#7A7A7A]">
                                {new Date(conv.lastMessageTime).toLocaleTimeString([], {
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-[#7A7A7A] truncate">
                            {conv ? conv.lastMessageText : `بدء محادثة مع @${otherUser.username}`}
                          </p>
                        </div>
                      </button>
                    );
                  })}
              </div>
            )}
          </div>
        </div>

        {/* MAIN CHAT WINDOW */}
        {isChatOpen ? (
          <div className="flex-1 flex flex-col bg-white h-full">
            {/* Chat Top Header */}
            <div className="p-3.5 border-b border-[#EFE9D9] flex items-center justify-between bg-[#FCF9F0]/40">
              {activeGroup ? (
                <div className="flex items-center gap-2.5 sm:gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveConversationUserId(null);
                      setActiveGroupConv(null);
                    }}
                    className="md:hidden p-1.5 rounded-xl bg-white border border-[#EFE9D9] text-[#0F3D2E] hover:bg-stone-100 transition-colors cursor-pointer shadow-xs"
                    title="الرجوع لقائمة المحادثات"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <div className="shrink-0">
                    <GroupAvatarStack
                      avatars={groupMemberUsers.map((m) => m.profileImage)}
                      label={`${activeGroup.groupName} (${activeGroup.participantIds.length}/25)`}
                    />
                  </div>

                  <div>
                    <div className="text-sm font-bold text-[#0F3D2E] flex items-center gap-1.5">
                      <span>{activeGroup.groupName}</span>
                      <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#0F3D2E]/10 text-[#0F3D2E] font-bold">
                        مجموعة {activeGroup.participantIds.length}/25
                      </span>
                    </div>
                    <div className="text-[11px] text-[#7A7A7A]">
                      {groupMemberUsers.map((m) => m.fullName || m.username).slice(0, 3).join('، ')}
                      {groupMemberUsers.length > 3 && ` +${groupMemberUsers.length - 3}`}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2.5 sm:gap-3">
                  {/* Mobile Back Button */}
                  <button
                    type="button"
                    onClick={() => setActiveConversationUserId(null)}
                    className="md:hidden p-1.5 rounded-xl bg-white border border-[#EFE9D9] text-[#0F3D2E] hover:bg-stone-100 transition-colors cursor-pointer shadow-xs"
                    title="الرجوع لقائمة المحادثات"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => activeRecipient && viewUserProfile(activeRecipient)}
                    className="relative group cursor-pointer"
                  >
                    <img
                      src={activeRecipient?.profileImage}
                      alt={activeRecipient?.username || ''}
                      className="w-10 h-10 rounded-full object-cover border border-[#EFE9D9]"
                    />
                    {activeRecipient?.verified && (
                      <span className="absolute -bottom-1 -start-1 bg-[#D4AF37] text-[#0F3D2E] text-[9px] font-bold px-1 rounded-full border border-white">
                        ✓
                      </span>
                    )}
                  </button>

                  <div>
                    <button
                      onClick={() => activeRecipient && viewUserProfile(activeRecipient)}
                      className="text-sm font-bold text-[#0F3D2E] hover:underline flex items-center gap-1.5 cursor-pointer text-start"
                    >
                      <span>{activeRecipient?.fullName || activeRecipient?.username}</span>
                      {activeRecipient?.verified && (
                        <span className="text-[10px] bg-[#0F3D2E]/10 text-[#0F3D2E] px-1.5 py-0.5 rounded-full font-bold">
                          موثّق
                        </span>
                      )}
                    </button>
                    <div className="text-[11px] text-[#7A7A7A]">
                      @{activeRecipient?.username} • {activeRecipient?.nationality || 'عضو في AyGram'}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* GROUP: Add Members + Members list */}
            {activeGroup && (
              <div className="px-3.5 py-2 border-b border-[#EFE9D9] bg-white/60 flex items-center gap-2 overflow-x-auto no-scrollbar">
                <div className="flex -space-x-1.5 shrink-0">
                  {groupMemberUsers.map((m) => (
                    <img
                      key={m.id}
                      src={m.profileImage}
                      alt={m.username}
                      title={`@${m.username}`}
                      className="w-6 h-6 rounded-full object-cover border-2 border-white"
                    />
                  ))}
                </div>
                {isGroupOwner && canAddMore && (
                  <button
                    type="button"
                    onClick={() => setShowAddMembers((s) => !s)}
                    className="shrink-0 flex items-center gap-1 px-2 py-1 rounded-full bg-[#0F3D2E]/10 text-[#0F3D2E] text-[11px] font-bold hover:bg-[#0F3D2E]/20 transition-colors cursor-pointer"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>إضافة عضو ({25 - activeGroup.participantIds.length} متاح)</span>
                  </button>
                )}
                <span className="text-[10px] text-[#7A7A7A] shrink-0">
                  الحد الأقصى للأعضاء: 25 شخصاً
                </span>
              </div>
            )}

            {/* GROUP: Add-Member select box */}
            {showAddMembers && activeGroup && (
              <div className="px-3.5 py-2.5 border-b border-[#EFE9D9] bg-[#FCF9F0] space-y-2">
                <select
                  value={addTargetId}
                  onChange={(e) => setAddTargetId(e.target.value)}
                  className="w-full py-2 px-3 rounded-[12px] bg-white border border-[#EFE9D9] text-xs focus:outline-none focus:border-[#0F3D2E]"
                >
                  <option value="">اختر عضواً لإضافته...</option>
                  {users
                    .filter((u) => u.id !== currentUser.id && !u.isClosed && !activeGroup.participantIds.includes(u.id))
                    .map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.fullName || u.username} — @{u.username}
                      </option>
                    ))}
                </select>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleAddGroupMember}
                    disabled={!addTargetId}
                    className="flex-1 py-1.5 px-3 rounded-[10px] bg-[#0F3D2E] text-[#D4AF37] text-[11px] font-bold hover:bg-[#16503c] transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    إضافة إلى المجموعة
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddMembers(false)}
                    className="px-3 py-1.5 rounded-[10px] bg-white border border-[#EFE9D9] text-[#7A7A7A] text-[11px] font-bold cursor-pointer"
                  >
                    إلغاء
                  </button>
                </div>
              </div>
            )}

            {/* Messages Thread */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#FCF9F0]/20">
              {/* Islamic Etiquette Note */}
              {!activeGroup && (
                <div className="bg-[#EAE4D3]/40 p-2.5 rounded-[14px] border border-[#EFE9D9] text-center text-[11px] text-[#7A7A7A] max-w-md mx-auto">
                  قال رسول الله ﷺ: «المسلم من سَلِمَ المسلمون من لسانه ويده». المحادثات مراقبة بفلترة شرعية آلية.
                </div>
              )}

              {activeGroup && (
                <div className="bg-[#0F3D2E]/5 p-2.5 rounded-[14px] border border-[#0F3D2E]/15 text-center text-[11px] text-[#0F3D2E] max-w-md mx-auto font-bold">
                  <Users className="w-3.5 h-3.5 inline -mt-0.5 me-1" />
                  مجموعة «{activeGroup.groupName}» — يتسع حتى 25 شخصاً، لا يحق لأحد تركّز الصلاحيات إلا للمشرف (المنشئ).
                </div>
              )}

              {activeChatMessages.length === 0 && (
                <div className="py-12 text-center text-xs text-[#7A7A7A]">
                  لا توجد رسائل سابقة. ابدأ المحادثة بالسلام والتحية الطيبة 🌿
                </div>
              )}

              {activeChatMessages.map((msg) => {
                const isMe = msg.senderId === currentUser.id;
                const sharedPost = msg.sharedPostId
                  ? posts.find((p) => p.id === msg.sharedPostId)
                  : null;
                const senderUser = activeGroup
                  ? users.find((u) => u.id === msg.senderId)
                  : null;

                return (
                  <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                    {activeGroup && !isMe && (
                      <span className="text-[10px] font-bold text-[#7A7A7A] mb-0.5 flex items-center gap-1">
                        <img
                          src={msg.senderAvatar}
                          alt=""
                          className="w-4 h-4 rounded-full object-cover"
                        />
                        @{msg.senderName}
                      </span>
                    )}
                    <div
                      className={`max-w-[80%] rounded-[16px] px-3.5 py-2.5 text-xs sm:text-sm leading-relaxed ${
                        isMe
                          ? 'bg-[#0F3D2E] text-white rounded-br-xs'
                          : 'bg-white border border-[#EFE9D9] text-[#1A1A1A] rounded-bl-xs shadow-2xs'
                      }`}
                    >
                      {sharedPost && !activeGroup && (
                        <div
                          className={`mb-2 p-2 rounded-[12px] border text-xs cursor-pointer ${
                            isMe
                              ? 'bg-white/10 border-white/20 text-white'
                              : 'bg-[#FCF9F0] border-[#EFE9D9] text-[#1A1A1A]'
                          }`}
                          onClick={() => senderUser && viewUserProfile(senderUser)}
                        >
                          <div className="flex items-center gap-1.5 font-bold mb-1">
                            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                            <span>منشور تمت مشاركته من @{msg.senderName}</span>
                          </div>
                          <p className="line-clamp-2 text-[11px] opacity-90">{sharedPost.content}</p>
                          {sharedPost.image && (
                            <img
                              src={sharedPost.image}
                              alt="post preview"
                              className="mt-1.5 w-full h-24 object-cover rounded-[8px]"
                            />
                          )}
                        </div>
                      )}

                      {msg.content && <div>{msg.content}</div>}
                      {msg.audio && (
                        <div className="mt-1.5">
                          <VoiceNotePlayer src={msg.audio} name={msg.audioName} compact={isMe} />
                        </div>
                      )}

                      <div
                        className={`text-[9px] mt-1 flex items-center gap-1 justify-end ${
                          isMe ? 'text-white/70' : 'text-[#7A7A7A]'
                        }`}
                      >
                        <span>
                          {new Date(msg.createdAt).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                        {isMe && <CheckCheck className="w-3 h-3 text-[#D4AF37]" />}
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Typing indicator */}
              {isTyping && !activeGroup && (
                <div className="flex items-center gap-2 text-stone-500 text-xs py-1">
                  <div className="bg-white border border-[#EFE9D9] px-3 py-2 rounded-2xl rounded-bl-xs flex items-center gap-1.5 shadow-2xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#0F3D2E] animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#0F3D2E] animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#0F3D2E] animate-bounce" style={{ animationDelay: '300ms' }} />
                    <span className="text-[11px] text-stone-600 font-medium ms-1">يكتب الآن...</span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Greeting Chips & Emoji Bar */}
            {!activeGroup && (
              <div className="px-3 py-1.5 bg-white border-t border-[#EFE9D9]/60 flex items-center gap-1.5 overflow-x-auto text-[11px]">
                {isRecording && (
                  <span className="flex items-center gap-1.5 text-red-600 font-bold shrink-0 ps-1">
                    <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
                    <span className="text-[10px] font-mono">{recordSeconds}s</span>
                    <button
                      type="button"
                      onClick={stopRecording}
                      className="px-2 py-1 rounded-full bg-[#801824] text-white text-[10px] font-bold cursor-pointer"
                    >
                      إنهاء وإرسال
                    </button>
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => setShowEmojiBar(!showEmojiBar)}
                  className="p-1 rounded-lg text-stone-500 hover:text-[#0F3D2E] hover:bg-stone-100 transition-colors cursor-pointer shrink-0"
                  title="رموز تعبيرية سريعة"
                >
                  <Smile className="w-4 h-4" />
                </button>
                <span className="text-[#7A7A7A] shrink-0">تحيات:</span>
                <button
                  type="button"
                  onClick={() => setMessageInput((prev) => prev + (prev ? ' ' : '') + 'السلام عليكم ورحمة الله وبركاته')}
                  className="px-2 py-0.5 rounded-full bg-[#FCF9F0] border border-[#EFE9D9] hover:border-[#0F3D2E] text-[#0F3D2E] whitespace-nowrap cursor-pointer"
                >
                  السلام عليكم 🌿
                </button>
                <button
                  type="button"
                  onClick={() => setMessageInput((prev) => prev + (prev ? ' ' : '') + 'جزاك الله خيراً وبارك فيك')}
                  className="px-2 py-0.5 rounded-full bg-[#FCF9F0] border border-[#EFE9D9] hover:border-[#0F3D2E] text-[#0F3D2E] whitespace-nowrap cursor-pointer"
                >
                  جزاك الله خيراً ✨
                </button>
                <button
                  type="button"
                  onClick={() => setMessageInput((prev) => prev + (prev ? ' ' : '') + 'ما شاء الله تبارك الرحمن')}
                  className="px-2 py-0.5 rounded-full bg-[#FCF9F0] border border-[#EFE9D9] hover:border-[#0F3D2E] text-[#0F3D2E] whitespace-nowrap cursor-pointer"
                >
                  ما شاء الله 🤍
                </button>
              </div>
            )}

            {/* Expanded Emoji quick bar */}
            {showEmojiBar && !activeGroup && (
              <div className="px-3 py-2 bg-stone-50 border-t border-[#EFE9D9] flex items-center gap-2 overflow-x-auto text-base">
                {['🌿', '🤍', '✨', '🤲', '👍', '🌟', '📚', '😊', '🤝', '🌸', '🕌', '👌'].map((em) => (
                  <button
                    key={em}
                    type="button"
                    onClick={() => setMessageInput((prev) => prev + em)}
                    className="p-1 rounded-lg hover:bg-stone-200 transition-colors cursor-pointer"
                  >
                    {em}
                  </button>
                ))}
              </div>
            )}

            {/* Input Bar or Request Acceptance Bar */}
            {isCurrentChatIncomingRequest ? (
              <div className="p-4 bg-[#FCF9F0] border-t border-[#EFE9D9] flex flex-col items-center gap-3">
                <div className="text-center">
                  <p className="text-xs font-bold text-[#0F3D2E]">
                    أرسل لك {activeRecipient?.fullName || activeRecipient?.username} (@{activeRecipient?.username}) طلب مراسلة
                  </p>
                  <p className="text-[11px] text-[#7A7A7A] mt-0.5">
                    لن يعلم الطرف الآخر بأنك قرأت الرسالة إلا بعد قبول طلب المراسلة.
                  </p>
                </div>
                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => {
                      if (activeConversation) acceptMessageRequest(activeConversation.id);
                    }}
                    className="px-4 py-2 rounded-xl bg-[#0F3D2E] text-[#D4AF37] text-xs font-bold hover:bg-[#16503c] transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    <Check className="w-4 h-4" />
                    قبول المحادثة
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (activeConversation) rejectMessageRequest(activeConversation.id);
                      setActiveConversationUserId(null);
                    }}
                    className="px-4 py-2 rounded-xl bg-white border border-red-200 text-red-600 hover:bg-red-50 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                    رفض وحذف
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-3 border-t border-[#EFE9D9] bg-white flex items-center justify-end gap-2">
                {!isRecording ? (
                  <button
                    type="button"
                    onClick={startRecording}
                    className="p-2.5 rounded-full bg-[#0F3D2E]/10 text-[#0F3D2E] hover:bg-[#0F3D2E] hover:text-[#D4AF37] transition-colors cursor-pointer shrink-0"
                    title="تسجيل رسالة صوتية"
                  >
                    <Mic className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={stopRecording}
                    className="p-2.5 rounded-full bg-red-600 text-white animate-pulse transition-colors cursor-pointer shrink-0"
                    title="إيقاف التسجيل وإرساله"
                  >
                    <MicOff className="w-4 h-4" />
                  </button>
                )}
                <AIChatInput
                  value={messageInput}
                  onChange={setMessageInput}
                  onSubmit={handleSendMessage}
                  disabled={!currentUser.isActive}
                  placeholder={activeGroup ? 'اكتب رسالة للمجموعة...' : ''}
                />
              </div>
            )}
          </div>
        ) : (
          <div className="flex-1 hidden md:flex flex-col items-center justify-center p-8 text-center bg-white">
            <MessageCircle className="w-12 h-12 text-[#D4AF37] mb-3" />
            <h3 className="text-base font-bold text-[#0F3D2E] mb-1">
              اختر محادثة أو مجموعة للبدء
            </h3>
            <p className="text-xs text-[#7A7A7A]">
              اختر أي عضو من القائمة الجانبية، أو أنشئ مجموعة جديدة تتسع حتى 25 شخصاً.
            </p>
          </div>
        )}
      </div>

      {/* Message Requests Section */}
      {viewTab === 'requests' && (
        <div className="bg-white rounded-[20px] border border-[#EFE9D9] shadow-aygram p-4 sm:p-6 min-h-[500px]">
          <div className="flex items-center justify-between border-b border-[#EFE9D9] pb-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#0F3D2E] text-[#D4AF37] flex items-center justify-center shadow-xs">
                <Inbox className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-[#0F3D2E] flex items-center gap-2">
                  طلبات المراسلة
                  {incomingRequests.length > 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-[#D4AF37] text-[#0F3D2E] text-xs font-bold">
                      {incomingRequests.length}
                    </span>
                  )}
                </h2>
                <p className="text-xs text-[#7A7A7A]">
                  الرسائل الواردة من مستخدمين لا تتابعهم. لن يعلموا بأنك قرأت رسالتهم إلا عند قبولك للطلب.
                </p>
              </div>
            </div>
            {incomingRequests.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  incomingRequests.forEach((req) => acceptMessageRequest(req.id));
                }}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0F3D2E]/10 hover:bg-[#0F3D2E] text-[#0F3D2E] hover:text-[#D4AF37] text-xs font-bold transition-colors cursor-pointer"
              >
                <Check className="w-3.5 h-3.5" />
                قبول الكل
              </button>
            )}
          </div>

          {incomingRequests.length === 0 ? (
            <div className="py-16 text-center">
              <div className="w-16 h-16 rounded-full bg-[#FCF9F0] border border-[#EFE9D9] text-[#0F3D2E] flex items-center justify-center mx-auto mb-3">
                <Inbox className="w-8 h-8 text-[#0F3D2E]" />
              </div>
              <h3 className="text-sm font-bold text-[#0F3D2E] mb-1">
                صندوق طلبات المراسلة فارغ
              </h3>
              <p className="text-xs text-[#7A7A7A] max-w-sm mx-auto">
                لا توجد طلبات مراسلة معلقة حالياً. ستظهر هنا أي رسائل جديدة تتلقاها من مستخدمين لا تتابعهم لحماية خصوصيتك.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {incomingRequests.map((req) => {
                const senderId = req.participantIds.find((id) => id !== currentUser.id);
                const senderUser = users.find((u) => u.id === senderId);
                if (!senderUser) return null;

                return (
                  <div
                    key={req.id}
                    className="p-4 rounded-2xl bg-[#FCF9F0]/60 border border-[#EFE9D9] hover:bg-white hover:border-[#D4AF37]/50 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs"
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      <img
                        src={senderUser.profileImage}
                        alt={senderUser.username}
                        className="w-12 h-12 rounded-full object-cover border border-[#EFE9D9] shrink-0 cursor-pointer"
                        onClick={() => viewUserProfile(senderUser.id)}
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span
                            onClick={() => viewUserProfile(senderUser.id)}
                            className="text-xs font-bold text-[#1A1A1A] hover:underline cursor-pointer"
                          >
                            {senderUser.fullName || senderUser.username}
                          </span>
                          {senderUser.verified && (
                            <span className="text-[#0F3D2E] text-[10px]" title="موثق">✓</span>
                          )}
                          <span className="text-[11px] text-[#7A7A7A]">@{senderUser.username}</span>
                          {senderUser.nationality && (
                            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white border border-[#EFE9D9] text-stone-600">
                              {senderUser.nationality}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-stone-700 font-medium mt-1 line-clamp-2 bg-white/80 p-2 rounded-xl border border-[#EFE9D9]">
                          «{req.lastMessageText || 'أرسل لك رسالة'}»
                        </p>
                        <span className="text-[10px] text-[#7A7A7A] mt-1 block">
                          {new Date(req.lastMessageTime).toLocaleString('ar', {
                            dateStyle: 'short',
                            timeStyle: 'short'
                          })}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                      <button
                        type="button"
                        onClick={() => {
                          handleSelectConversation(senderUser.id);
                          setViewTab('chats');
                        }}
                        className="px-3.5 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold transition-colors cursor-pointer"
                      >
                        معاينة
                      </button>
                      <button
                        type="button"
                        onClick={() => acceptMessageRequest(req.id)}
                        className="px-3.5 py-1.5 rounded-xl bg-[#0F3D2E] text-[#D4AF37] text-xs font-bold hover:bg-[#16503c] transition-colors flex items-center gap-1 cursor-pointer shadow-xs"
                      >
                        <Check className="w-3.5 h-3.5" />
                        قبول
                      </button>
                      <button
                        type="button"
                        onClick={() => rejectMessageRequest(req.id)}
                        className="px-3.5 py-1.5 rounded-xl bg-white border border-red-200 text-red-600 hover:bg-red-50 text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        حذف
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Channels (private channel feed: text/image/voice only) */}
      <div className={viewTab === 'channels' ? '' : 'hidden'}>
        <ChannelsView />
      </div>

      {/* Create Group Modal */}
      {showGroupModal && viewTab === 'chats' && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FCF9F0] rounded-[16px] max-w-md w-full p-6 shadow-aygram-md border border-[#EFE9D9] relative text-[#1A1A1A]">
            <button
              onClick={() => setShowGroupModal(false)}
              className="absolute top-4 start-4 p-1.5 rounded-[8px] text-[#7A7A7A] hover:text-[#0F3D2E] hover:bg-black/5 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-4">
              <div className="w-12 h-12 rounded-full bg-[#0F3D2E]/10 text-[#0F3D2E] flex items-center justify-center mx-auto mb-2 border border-[#D4AF37]/40">
                <Users className="w-6 h-6 text-[#D4AF37]" />
              </div>
              <h3 className="text-base font-bold text-[#0F3D2E]">
                إنشاء مجموعة جديدة
              </h3>
              <p className="text-xs text-[#7A7A7A] mt-1">
                المجموعة تتسع حتى <strong>25 شخصاً</strong> كحد أقصى
              </p>
            </div>

            <form onSubmit={handleCreateGroup} className="space-y-3.5">
              {groupError && (
                <div className="p-2.5 rounded-[10px] bg-[#E8B4B8]/40 border border-[#E8B4B8] text-xs font-bold text-[#801824]">
                  {groupError}
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-[#1A1A1A] mb-1.5">
                  اسم المجموعة *
                </label>
                <input
                  type="text"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  placeholder="مثال: مجموعة السوق والمشغولات"
                  className="w-full py-2 px-3 rounded-[12px] bg-white border border-[#EFE9D9] text-xs focus:outline-none focus:border-[#0F3D2E]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1A1A1A] mb-1.5">
                  اختر الأعضاء ({selectedMembers.length}/25)
                </label>
                <div className="max-h-52 overflow-y-auto space-y-1.5 pe-1">
                  {users
                    .filter((u) => u.id !== currentUser.id && !u.isClosed)
                    .map((u) => {
                      const checked = selectedMembers.includes(u.id);
                      return (
                        <label
                          key={u.id}
                          className={`flex items-center gap-2.5 p-2 rounded-[10px] text-xs cursor-pointer border transition-all ${
                            checked
                              ? 'bg-[#0F3D2E] text-white border-[#0F3D2E]'
                              : 'bg-white border-[#EFE9D9] text-[#1A1A1A] hover:bg-[#FCF9F0]'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => toggleMember(u.id)}
                            className="hidden"
                          />
                          <img src={u.profileImage} alt="" className="w-7 h-7 rounded-full object-cover" />
                          <span className="font-bold truncate flex-1">{u.fullName || u.username}</span>
                          <span className="text-[10px] opacity-70 font-mono">@{u.username}</span>
                        </label>
                      );
                    })}
                </div>
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  type="submit"
                  disabled={selectedMembers.length === 0 || !groupName.trim()}
                  className="flex-1 py-2.5 px-4 rounded-[12px] bg-[#0F3D2E] text-[#D4AF37] font-bold text-xs hover:bg-[#16503c] transition-colors shadow-aygram cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  إنشاء المجموعة
                </button>
                <button
                  type="button"
                  onClick={() => setShowGroupModal(false)}
                  className="py-2.5 px-4 rounded-[12px] bg-white border border-[#EFE9D9] text-[#7A7A7A] font-medium text-xs hover:bg-black/5 transition-colors cursor-pointer"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};