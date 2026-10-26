import React, { useState } from 'react';
import { 
  Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, 
  Heart, Sparkles, ListMusic, Maximize2, Clapperboard, ChevronUp
} from 'lucide-react';
import { Song, VisualMode } from '../../types';

interface PlayerBarProps {
  currentSong: Song | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  activeMode: VisualMode;
  onPlayPause: () => void;
  onNext: () => void;
  onPrev: () => void;
  onSeek: (seconds: number) => void;
  onVolumeChange: (vol: number) => void;
  onToggleMute: () => void;
  onToggleFavorite: (id: string) => void;
  onSelectMode: (mode: VisualMode) => void;
  onToggleNowPlaying: () => void;
  onToggleLyrics: () => void;
  onToggleQueue: () => void;
  onOpenDirector: () => void;
  onOpenSongDna?: () => void;
}

const VISUAL_MODES: VisualMode[] = [
  'CINEMA', 'VOID', 'ARCHIVE', 'DREAM', 'RAW', 'NATURE', 'TYPOGRAPHIC', 'PARTICLE'
];

export const PlayerBar: React.FC<PlayerBarProps> = ({
  currentSong,
  isPlaying,
  currentTime,
  duration,
  volume,
  isMuted,
  activeMode,
  onPlayPause,
  onNext,
  onPrev,
  onSeek,
  onVolumeChange,
  onToggleMute,
  onToggleFavorite,
  onSelectMode,
  onToggleNowPlaying,
  onToggleLyrics,
  onToggleQueue,
  onOpenDirector
}) => {
  const [showModePicker, setShowModePicker] = useState(false);

  if (!currentSong) return null;

  const formatTime = (secs: number) => {
    if (isNaN(secs)) return '00:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-40 max-w-6xl mx-auto transition-all duration-500">
      <div className="relative bg-[#101217]/90 border border-white/10 backdrop-blur-2xl rounded-2xl p-4 shadow-2xl overflow-hidden text-[#e4e2dd]">
        
        {/* Subtle Progress Bar top line */}
        <div 
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const newPercent = clickX / rect.width;
            onSeek(newPercent * duration);
          }}
          className="absolute top-0 left-0 right-0 h-1 bg-white/10 cursor-pointer group hover:h-2 transition-all duration-200"
        >
          <div 
            className="h-full bg-gradient-to-r from-white/60 to-white transition-all duration-100" 
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <div className="flex items-center justify-between gap-4 pt-1">
          
          {/* Left: Song Meta & Artwork */}
          <div className="flex items-center gap-4 min-w-0 w-1/4">
            <div 
              onClick={onToggleNowPlaying}
              className="relative w-12 h-12 rounded-xl overflow-hidden group cursor-pointer border border-white/10 flex-shrink-0"
            >
              <img 
                src={currentSong.artwork} 
                alt={currentSong.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Maximize2 className="w-4 h-4 text-white" />
              </div>
            </div>

            <div className="min-w-0 flex flex-col">
              <div className="flex items-center gap-2">
                <h3 
                  onClick={onToggleNowPlaying}
                  className="font-display font-bold text-sm text-white truncate cursor-pointer hover:underline tracking-wide"
                >
                  {currentSong.title}
                </h3>
                <button
                  onClick={() => onToggleFavorite(currentSong.id)}
                  className="text-white/40 hover:text-rose-400 transition-colors"
                >
                  <Heart className={`w-3.5 h-3.5 ${currentSong.isFavorite ? 'fill-rose-500 text-rose-500' : ''}`} />
                </button>
              </div>
              <p className="text-xs font-mono text-white/50 truncate mt-0.5">
                {currentSong.artist} • <span className="text-white/30">{currentSong.genre}</span>
              </p>
            </div>
          </div>

          {/* Center: Playback Controls & Time */}
          <div className="flex flex-col items-center justify-center flex-1 max-w-md">
            
            <div className="flex items-center gap-6">
              <button 
                onClick={onPrev}
                className="text-white/60 hover:text-white transition-colors"
                title="Previous Track"
              >
                <SkipBack className="w-4 h-4" />
              </button>

              <button
                onClick={onPlayPause}
                className="w-11 h-11 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-xl"
                title={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? <Pause className="w-5 h-5 fill-black text-black" /> : <Play className="w-5 h-5 fill-black text-black ml-0.5" />}
              </button>

              <button 
                onClick={onNext}
                className="text-white/60 hover:text-white transition-colors"
                title="Next Track"
              >
                <SkipForward className="w-4 h-4" />
              </button>
            </div>

            <div className="w-full flex items-center justify-between gap-3 text-[10px] font-mono text-white/40 mt-1.5">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>

          </div>

          {/* Right: Engine Tools & Mode Picker */}
          <div className="flex items-center justify-end gap-3 w-1/4">
            
            {/* Visual Mode Picker Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowModePicker(!showModePicker)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:border-white/20 text-xs font-mono text-white/80 transition-all"
                title="Change Visual Mode"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span className="hidden lg:inline">{activeMode}</span>
                <ChevronUp className={`w-3 h-3 transition-transform ${showModePicker ? 'rotate-180' : ''}`} />
              </button>

              {showModePicker && (
                <div className="absolute bottom-12 right-0 bg-[#14161f] border border-white/10 rounded-xl p-2 shadow-2xl flex flex-col gap-1 w-40 z-50">
                  <span className="text-[10px] font-mono text-white/40 px-2 py-1 uppercase tracking-wider">
                    Visual Language
                  </span>
                  {VISUAL_MODES.map((mode) => (
                    <button
                      key={mode}
                      onClick={() => {
                        onSelectMode(mode);
                        setShowModePicker(false);
                      }}
                      className={`text-left text-xs font-mono px-2 py-1.5 rounded-lg transition-all ${
                        activeMode === mode ? 'bg-white text-black font-semibold' : 'text-white/70 hover:bg-white/5'
                      }`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={onOpenDirector}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-all"
              title="AI Song Director Timeline"
            >
              <Clapperboard className="w-4 h-4 text-purple-300" />
            </button>

            <button
              onClick={onToggleLyrics}
              className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-mono text-white/80 transition-all"
              title="Toggle Kinetic Lyrics"
            >
              LYRICS
            </button>

            {/* Volume Control */}
            <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-white/10">
              <button 
                onClick={onToggleMute}
                className="text-white/60 hover:text-white transition-colors"
              >
                {isMuted || volume === 0 ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4" />}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={isMuted ? 0 : volume}
                onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
                className="w-16 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-white"
              />
            </div>

            <button
              onClick={onToggleQueue}
              className="p-2 rounded-lg text-white/60 hover:text-white transition-colors"
              title="Up Next Queue"
            >
              <ListMusic className="w-4 h-4" />
            </button>

          </div>

        </div>

      </div>
    </div>
  );
};
