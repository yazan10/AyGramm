import React, { useRef, useState, useEffect } from 'react';
import { Play, Pause } from 'lucide-react';

interface VoiceNotePlayerProps {
  src: string;
  name?: string;
  compact?: boolean;
}

// Waveform bar heights (fixed pattern resembling asif_6635)
const BAR_HEIGHTS = [3, 6, 4, 8, 5, 3, 7, 4];

export const VoiceNotePlayer: React.FC<VoiceNotePlayerProps> = ({ src, name, compact = false }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    // Reset when src changes
    const a = audioRef.current;
    if (a) {
      a.pause();
      a.src = src;
      a.load();
      setPlaying(false);
      setCurrentTime(0);
      setDuration(0);
    }
  }, [src]);

  useEffect(() => {
    return () => {
      audioRef.current?.pause();
    };
  }, []);

  const togglePlay = () => {
    const a = audioRef.current;
    if (!a) return;
    if (playing) {
      a.pause();
    } else {
      a.play();
    }
  };

  const formatTime = (s: number) => {
    if (!isFinite(s)) return '0:00';
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`flex items-center bg-gray-900 text-white ${compact ? 'p-1.5 rounded-full gap-2' : 'p-2.5 rounded-full gap-2.5'} ${compact ? 'max-w-[220px]' : 'max-w-[260px]'} shadow-lg`}>
      <audio
        ref={audioRef}
        src={src}
        preload="auto"
        onLoadedMetadata={() => audioRef.current && setDuration(audioRef.current.duration)}
        onTimeUpdate={() => audioRef.current && setCurrentTime(audioRef.current.currentTime)}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => { setPlaying(false); setCurrentTime(0); }}
        className="hidden"
      />

      <button
        type="button"
        onClick={togglePlay}
        className="bg-white text-gray-900 rounded-full p-1.5 hover:bg-gray-100 transition-colors cursor-pointer shrink-0"
      >
        {playing ? <Pause className="w-3.5 h-3.5" fill="currentColor" /> : <Play className="w-3.5 h-3.5" fill="currentColor" />}
      </button>

      {/* Waveform bars */}
      <div className="flex items-end gap-[2px] flex-1 min-w-0 px-1 overflow-hidden">
        {BAR_HEIGHTS.map((h, i) => (
          <div
            key={i}
            className={`w-[3px] rounded-full ${
              playing
                ? 'animate-pulse'
                : ''
            } ${i === 3 ? 'bg-[#D4AF37]' : 'bg-white/50'}`}
            style={{
              height: `${h * 2.5}px`,
              animationDuration: playing ? `${0.7 + i * 0.08}s` : undefined,
              animationDelay: playing ? `${i * 0.1}s` : undefined,
            }}
          />
        ))}
      </div>

      <span className="text-[10px] text-gray-300 font-mono shrink-0 min-w-[2.2rem] text-center" dir="ltr">
        {playing ? formatTime(currentTime) : formatTime(duration)}
      </span>
    </div>
  );
};