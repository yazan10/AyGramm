import React, { useState, useRef, useEffect } from 'react';
import {
  Radio,
  Image as ImageIcon,
  Mic,
  Video,
  MicOff,
  Trash2,
  Send,
  Plus,
  X,
  Users,
  ShieldCheck
} from 'lucide-react';
import { useAyGram } from '../context/AyGramContext';
import { VoiceNotePlayer } from './VoiceNotePlayer';

export const ChannelsView: React.FC = () => {
  const {
    currentUser,
    channels,
    channelPosts,
    createChannel,
    deleteChannel,
    postToChannel
  } = useAyGram();

  const [selectedChannelId, setSelectedChannelId] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [createError, setCreateError] = useState('');

  const [draftText, setDraftText] = useState('');
  const [draftImage, setDraftImage] = useState('');
  const [draftAudio, setDraftAudio] = useState('');
  const [audioName, setAudioName] = useState('');
  const [composerError, setComposerError] = useState('');

  // Voice recording
  const [recorder, setRecorder] = useState<MediaRecorder | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordSeconds, setRecordSeconds] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const myChannels = channels.filter((c) => c.memberIds.includes(currentUser?.id || ''));
  const selected = selectedChannelId ? channels.find((c) => c.id === selectedChannelId) : null;
  const feed = selected ? channelPosts.filter((p) => p.channelId === selected.id) : [];

  useEffect(() => {
    if (!selectedChannelId && myChannels.length > 0) {
      setSelectedChannelId(myChannels[0].id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [channels.length]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const readFileAsDataURL = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = () => reject(new Error('read error'));
      reader.readAsDataURL(file);
    });

  const handleCreateChannel = (e: React.FormEvent) => {
    e.preventDefault();
    setCreateError('');
    const res = createChannel(newName, newDesc);
    if (res.success && res.channelId) {
      setNewName('');
      setNewDesc('');
      setShowCreate(false);
      setSelectedChannelId(res.channelId);
    } else {
      setCreateError(res.error || 'تعذر إنشاء القناة');
    }
  };

  const startRecording = async () => {
    setComposerError('');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const rec = new MediaRecorder(stream);
      const chunks: Blob[] = [];
      rec.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };
      rec.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        setDraftAudio(URL.createObjectURL(blob));
        setAudioName(`تسجيل صوتي (${recordSeconds} ثانية)`);
        stream.getTracks().forEach((t) => t.stop());
        setIsRecording(false);
        if (timerRef.current) clearInterval(timerRef.current);
      };
      rec.start();
      setRecorder(rec);
      setIsRecording(true);
      setRecordSeconds(0);
      timerRef.current = setInterval(() => {
        setRecordSeconds((s) => s + 1);
      }, 1000);
    } catch (err) {
      setComposerError('تعذر الوصول إلى الميكروفون. يمكنك إرفاق ملف صوتي بدلاً من التسجيل.');
    }
  };

  const stopRecording = () => {
    if (recorder && recorder.state !== 'inactive') recorder.stop();
  };

  const handleAttachAudioFile = async (file: File) => {
    if (!file.type.startsWith('audio/')) {
      setComposerError('يرجى اختيار ملف صوتي فقط');
      return;
    }
    const url = await readFileAsDataURL(file);
    setDraftAudio(url);
    setAudioName(file.name);
    setComposerError('');
  };

  const handlePost = () => {
    if (!selected) return;
    setComposerError('');
    const res = postToChannel(selected.id, {
      text: draftText,
      image: draftImage || undefined,
      audio: draftAudio || undefined,
      audioName: audioName || undefined,
    });
    if (res.success) {
      setDraftText('');
      setDraftImage('');
      setDraftAudio('');
      setAudioName('');
    } else {
      setComposerError(res.error || 'تعذر النشر في القناة');
    }
  };

  if (!currentUser) {
    return (
      <div className="py-16 text-center text-sm text-[#7A7A7A]">
        يرجى تسجيل الدخول لإنشاء ومتابعة القنوات الخاصة.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-[20px] border border-[#EFE9D9] shadow-aygram overflow-hidden flex flex-col md:flex-row h-[75vh]">
      {/* Channel List */}
      <div className="w-full md:w-72 border-b md:border-b-0 md:border-e border-[#EFE9D9] flex-col bg-[#FCF9F0]/60 flex flex-1 md:flex-none md:block overflow-y-auto">
        <div className="p-3.5 border-b border-[#EFE9D9]">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-bold text-[#0F3D2E] flex items-center gap-2">
              <Radio className="w-4 h-4 text-[#D4AF37]" />
              قنواتي الخاصة
            </h2>
            <button
              type="button"
              onClick={() => setShowCreate(true)}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-[12px] bg-[#0F3D2E] text-[#D4AF37] text-xs font-bold hover:bg-[#16503c] transition-colors cursor-pointer"
              title="إنشاء قناة خاصة"
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">قناة جديدة</span>
            </button>
          </div>
          <p className="text-[11px] text-[#7A7A7A] leading-relaxed">
            نشر <strong>نصوص وصور وصوتيات</strong> في قناتك الخاصة بنشر فوري دون انتظار موافقة.
          </p>
        </div>

        <div className="divide-y divide-[#EFE9D9]/50">
          {myChannels.length === 0 && (
            <div className="p-8 text-center text-xs text-[#7A7A7A] space-y-2">
              <Radio className="w-8 h-8 text-[#D4AF37] mx-auto opacity-60" />
              <p>لا تملك أي قناة بعد. أنشئ قناة خاصة بك وابدأ النشر فوراً.</p>
            </div>
          )}
          {myChannels.map((ch) => {
            const isSelected = selected?.id === ch.id;
            const postCount = channelPosts.filter((p) => p.channelId === ch.id).length;
            return (
              <button
                key={ch.id}
                onClick={() => setSelectedChannelId(ch.id)}
                className={`w-full p-3 flex items-start gap-3 text-start transition-colors cursor-pointer ${
                  isSelected ? 'bg-[#0F3D2E]/10 border-s-4 border-[#0F3D2E]' : 'hover:bg-white/80'
                }`}
              >
                <div className="w-9 h-9 shrink-0 rounded-[12px] bg-gradient-to-br from-[#0F3D2E] to-[#16503c] text-[#D4AF37] flex items-center justify-center">
                  <Radio className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-[#1A1A1A] truncate flex items-center gap-1">
                    {ch.name}
                    {ch.ownerId === currentUser.id && (
                      <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-[#D4AF37] text-[#0F3D2E] font-bold">
                        المالك
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-[#7A7A7A] truncate mt-0.5">
                    {ch.description || `قناة @${ch.ownerUsername}`}
                  </div>
                  <div className="text-[10px] text-[#7A7A7A] mt-1">
                    {ch.memberIds.length} متابع • {postCount} منشور
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Channel Feed */}
      <div className="flex-1 flex flex-col bg-white h-full">
        {selected ? (
          <>
            {/* Channel Header */}
            <div className="p-3.5 border-b border-[#EFE9D9] flex items-center justify-between bg-[#FCF9F0]/40">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-[12px] bg-gradient-to-br from-[#0F3D2E] to-[#16503c] text-[#D4AF37] flex items-center justify-center">
                  <Radio className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-bold text-[#0F3D2E] flex items-center gap-1.5">
                    <span>{selected.name}</span>
                    <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
                  </div>
                  <div className="text-[11px] text-[#7A7A7A]">
                    قناة @{selected.ownerUsername} • {selected.memberIds.length} متابع
                  </div>
                </div>
              </div>
              {selected.ownerId === currentUser.id && (
                <button
                  type="button"
                  onClick={() => deleteChannel(selected.id)}
                  className="p-2 rounded-[10px] text-[#7A7A7A] hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                  title="حذف القناة نهائياً"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Voice note: video blocked message */}
            <div className="px-3.5 py-2 border-b border-[#EFE9D9] bg-[#D4AF37]/10 flex items-center gap-2 text-[11px] font-bold text-[#0F3D2E]">
              <Video className="w-3.5 h-3.5 shrink-0" />
              <span>
                رفع الفيديوهات في المنصة ممنوع حالياً بشكل مؤقت — سنفعّله قريباً بشكل طبيعي. مسموح: نصوص، صور، صوتيات.
              </span>
            </div>

            {/* Feed */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#FCF9F0]/20">
              {feed.length === 0 && (
                <div className="py-12 text-center text-xs text-[#7A7A7A]">
                  لا توجد منشورات بعد. انشر أول محتوى في قناتك الآن.
                </div>
              )}
              {feed.map((post) => {
                const isMine = post.authorId === currentUser.id;
                return (
                  <div
                    key={post.id}
                    className={`max-w-[85%] rounded-[16px] px-3.5 py-3 text-xs sm:text-sm leading-relaxed ${
                      isMine
                        ? 'bg-[#0F3D2E] text-white rounded-br-xs ms-auto'
                        : 'bg-white border border-[#EFE9D9] text-[#1A1A1A] rounded-bl-xs shadow-2xs'
                    }`}
                  >
                    <div className={`flex items-center gap-2 mb-1.5 ${!isMine ? '' : 'justify-end'}`}>
                      <img
                        src={post.authorAvatar}
                        alt=""
                        className={`w-6 h-6 rounded-full object-cover ${isMine ? 'order-2' : ''}`}
                      />
                      <span className={`text-[10px] font-bold ${isMine ? 'text-[#D4AF37]' : 'text-[#7A7A7A]'}`}>
                        @{post.authorName}
                      </span>
                      <span className="text-[9px] opacity-60">
                        {new Date(post.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    {post.text && <div className="whitespace-pre-wrap">{post.text}</div>}
                    {post.image && (
                      <img
                        src={post.image}
                        alt=""
                        className="mt-2 w-full max-h-64 object-cover rounded-[12px] border border-black/5"
                      />
                    )}
                    {post.audio && (
                      <div className="mt-2">
                        <VoiceNotePlayer src={post.audio} name={post.audioName} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Composer */}
            <div className="p-3 border-t border-[#EFE9D9] bg-white space-y-2">
              {composerError && (
                <div className="p-2 rounded-[10px] bg-[#E8B4B8]/40 border border-[#E8B4B8] text-[11px] font-bold text-[#801824]">
                  {composerError}
                </div>
              )}
              {(draftImage || draftAudio) && (
                <div className="flex items-center gap-2 p-2 rounded-[12px] bg-[#FCF9F0] border border-[#EFE9D9]">
                  {draftImage && (
                    <img src={draftImage} alt="" className="h-12 w-12 object-cover rounded-[8px]" />
                  )}
                  {draftAudio && (
                    <div className="flex-1 flex flex-col gap-1 min-w-0">
                      {audioName && <span className="text-[10px] text-[#7A7A7A] truncate">{audioName}</span>}
                      <VoiceNotePlayer src={draftAudio} name={audioName} compact />
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      setDraftImage('');
                      setDraftAudio('');
                      setAudioName('');
                    }}
                    className="p-1 rounded-lg text-[#7A7A7A] hover:text-red-600 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              <textarea
                value={draftText}
                onChange={(e) => setDraftText(e.target.value)}
                rows={2}
                placeholder="اكتب محتوى قناتك... (نشر فوري دون انتظار موافقة)"
                className="w-full py-2 px-3 rounded-[12px] bg-white border border-[#EFE9D9] text-xs focus:outline-none focus:border-[#0F3D2E] resize-none"
              />

              <div className="flex items-center gap-2">
                {/* Image attach */}
                <label className="p-2 rounded-[12px] bg-[#FCF9F0] border border-[#EFE9D9] text-[#0F3D2E] hover:border-[#0F3D2E] transition-colors cursor-pointer" title="إرفاق صورة">
                  <ImageIcon className="w-4 h-4" />
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={async (e) => {
                      const f = e.target.files?.[0];
                      if (f) {
                        const url = await readFileAsDataURL(f);
                        setDraftImage(url);
                      }
                      e.target.value = '';
                    }}
                  />
                </label>

                {/* Voice record */}
                {!isRecording ? (
                  <button
                    type="button"
                    onClick={startRecording}
                    className="p-2 rounded-[12px] bg-[#FCF9F0] border border-[#EFE9D9] text-red-600 hover:border-red-400 transition-colors cursor-pointer"
                    title="تسجيل صوتي"
                  >
                    <Mic className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={stopRecording}
                    className="p-2 rounded-[12px] bg-red-600 text-white animate-pulse transition-colors cursor-pointer flex items-center gap-1.5 ps-3"
                    title="إيقاف التسجيل"
                  >
                    <MicOff className="w-4 h-4" />
                    <span className="text-[10px] font-bold">{recordSeconds}s</span>
                  </button>
                )}

                {/* Voice file attach */}
                <label className="p-2 rounded-[12px] bg-[#FCF9F0] border border-[#EFE9D9] text-[#0F3D2E] hover:border-[#0F3D2E] transition-colors cursor-pointer" title="إرفاق ملف صوتي">
                  🎵
                  <input
                    type="file"
                    accept="audio/*"
                    className="hidden"
                    onChange={async (e) => {
                      const f = e.target.files?.[0];
                      if (f) await handleAttachAudioFile(f);
                      e.target.value = '';
                    }}
                  />
                </label>

                <span className="flex-1" />

                <button
                  type="button"
                  onClick={handlePost}
                  disabled={!draftText.trim() && !draftImage && !draftAudio}
                  className="flex items-center gap-1.5 py-2 px-4 rounded-[12px] bg-[#0F3D2E] text-[#D4AF37] font-bold text-xs hover:bg-[#16503c] transition-colors shadow-aygram cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>نشر فوري</span>
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 hidden md:flex flex-col items-center justify-center p-8 text-center bg-white">
            <Radio className="w-12 h-12 text-[#D4AF37] mb-3" />
            <h3 className="text-base font-bold text-[#0F3D2E] mb-1">اختر قناة أو أنشئ قناة جديدة</h3>
            <p className="text-xs text-[#7A7A7A]">
              القناة الخاصة بك لتنشر فيها ما يحلو لك: نص، صورة، صوت. والفيديو سيطلق قريباً.
            </p>
          </div>
        )}
      </div>

      {/* Create Channel Modal */}
      {showCreate && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FCF9F0] rounded-[16px] max-w-md w-full p-6 shadow-aygram-md border border-[#EFE9D9] relative text-[#1A1A1A]">
            <button
              onClick={() => setShowCreate(false)}
              className="absolute top-4 start-4 p-1.5 rounded-[8px] text-[#7A7A7A] hover:text-[#0F3D2E] hover:bg-black/5 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#0F3D2E] to-[#16503c] text-[#D4AF37] flex items-center justify-center mx-auto mb-2">
                <Radio className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-[#0F3D2E]">إنشاء قناة خاصة</h3>
              <p className="text-xs text-[#7A7A7A] mt-1">
                قناتك الخاصة — النشر فيها فوري دون انتظار موافقة
              </p>
            </div>

            <form onSubmit={handleCreateChannel} className="space-y-3.5">
              {createError && (
                <div className="p-2.5 rounded-[10px] bg-[#E8B4B8]/40 border border-[#E8B4B8] text-xs font-bold text-[#801824]">
                  {createError}
                </div>
              )}
              <div>
                <label className="block text-xs font-bold text-[#1A1A1A] mb-1.5">اسم القناة *</label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="مثال: قناة المحتوى الهادف"
                  className="w-full py-2 px-3 rounded-[12px] bg-white border border-[#EFE9D9] text-xs focus:outline-none focus:border-[#0F3D2E]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#1A1A1A] mb-1.5">الوصف (اختياري)</label>
                <textarea
                  rows={2}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="وصف مختصر لمحتوى القناة..."
                  className="w-full py-2 px-3 rounded-[12px] bg-white border border-[#EFE9D9] text-xs focus:outline-none focus:border-[#0F3D2E] resize-none"
                />
              </div>
              <div className="flex gap-2 pt-1">
                <button
                  type="submit"
                  disabled={!newName.trim()}
                  className="flex-1 py-2.5 px-4 rounded-[12px] bg-[#0F3D2E] text-[#D4AF37] font-bold text-xs hover:bg-[#16503c] transition-colors shadow-aygram cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  إنشاء القناة
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreate(false)}
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