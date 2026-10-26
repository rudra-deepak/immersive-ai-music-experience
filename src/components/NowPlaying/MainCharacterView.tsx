import React, { useState } from 'react';
import { Song, VisualMode } from '../../types';
import { CinematicLyricsView } from '../Lyrics/CinematicLyricsView';
import { Sparkles, Clapperboard, Activity, Heart, X, Play, Pause } from 'lucide-react';

interface MainCharacterViewProps {
  song: Song;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  activeMode: VisualMode;
  onPlayPause: () => void;
  onClose: () => void;
  onToggleFavorite: (id: string) => void;
  onOpenDirector: () => void;
  onOpenVibeCheck: () => void;
  onOpenSongDna: () => void;
  onOpenLyricStudio: (lyric: string) => void;
}

export const MainCharacterView: React.FC<MainCharacterViewProps> = ({
  song,
  isPlaying,
  currentTime,
  activeMode,
  onPlayPause,
  onClose,
  onToggleFavorite,
  onOpenDirector,
  onOpenVibeCheck,
  onOpenSongDna,
  onOpenLyricStudio
}) => {
  const [showMetadata, setShowMetadata] = useState(true);

  return (
    <div className="fixed inset-0 z-30 flex flex-col justify-between p-6 sm:p-12 text-[#e4e2dd] overflow-y-auto select-none backdrop-blur-sm">
      
      {/* Background Ambient Spatial Artwork Blur */}
      <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
        <img 
          src={song.artwork} 
          alt={song.title}
          className="w-full h-full object-cover scale-125 blur-[120px] opacity-25 transition-all duration-1000"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#08090b] via-transparent to-[#08090b]/80" />
      </div>

      {/* Top Floating Header */}
      <div className="flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowMetadata(!showMetadata)}
            className="px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 text-xs font-mono tracking-wider hover:bg-white/20 transition-all text-white/80"
          >
            {showMetadata ? 'HIDE META' : 'SHOW META'}
          </button>
          
          <div className="px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-mono tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>MODE: {activeMode}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenVibeCheck}
            className="px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-xs font-mono tracking-wider transition-all text-white"
          >
            VIBE CHECK
          </button>

          <button
            onClick={onOpenSongDna}
            className="px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-xs font-mono tracking-wider transition-all text-white flex items-center gap-1.5"
          >
            <Activity className="w-3.5 h-3.5 text-sky-400" />
            <span>DNA</span>
          </button>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/10 hover:bg-white text-white hover:text-black transition-all"
            title="Exit Now Playing"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Central Viewport Content */}
      <div className="my-auto py-12 flex flex-col items-center justify-center gap-8 z-10 max-w-5xl mx-auto w-full">
        
        {showMetadata && (
          <div className="flex flex-col md:flex-row items-center gap-8 text-center md:text-left transition-all duration-500 animate-float">
            <div className="w-40 h-40 sm:w-56 sm:h-56 rounded-2xl overflow-hidden border border-white/20 shadow-2xl flex-shrink-0 group relative">
              <img 
                src={song.artwork} 
                alt={song.title} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <button
                onClick={onPlayPause}
                className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
              >
                {isPlaying ? <Pause className="w-10 h-10 text-white fill-white" /> : <Play className="w-10 h-10 text-white fill-white ml-1" />}
              </button>
            </div>

            <div className="flex flex-col gap-2">
              <div className="inline-flex items-center gap-2 text-xs font-mono text-white/50 uppercase tracking-widest">
                <span>{song.genre}</span>
                <span>•</span>
                <span>{song.bpm} BPM</span>
              </div>

              <h2 className="font-display font-black text-3xl sm:text-5xl lg:text-6xl text-white tracking-tight uppercase">
                {song.title}
              </h2>

              <p className="font-serif italic text-xl sm:text-2xl text-white/70">
                by {song.artist}
              </p>

              <div className="flex items-center justify-center md:justify-start gap-3 mt-4">
                <button
                  onClick={() => onToggleFavorite(song.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-mono transition-all ${
                    song.isFavorite 
                      ? 'bg-rose-500/20 border-rose-500/40 text-rose-300' 
                      : 'bg-white/5 border-white/10 text-white/70 hover:text-white'
                  }`}
                >
                  <Heart className={`w-3.5 h-3.5 ${song.isFavorite ? 'fill-rose-400' : ''}`} />
                  <span>{song.isFavorite ? 'FAVORITED' : 'FAVORITE'}</span>
                </button>

                <button
                  onClick={onOpenDirector}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/20 border border-purple-500/40 text-purple-200 text-xs font-mono hover:bg-purple-500/30 transition-all"
                >
                  <Clapperboard className="w-3.5 h-3.5" />
                  <span>AI DIRECTOR</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Primary Interactive Kinetic Lyrics */}
        <CinematicLyricsView
          lyrics={song.lyrics}
          currentTime={currentTime}
          onSelectLineForCard={onOpenLyricStudio}
        />

      </div>

      {/* Bottom Status Coda */}
      <div className="z-10 flex items-center justify-between text-xs font-mono text-white/40 border-t border-white/10 pt-4">
        <div>VALENCE MAIN CHARACTER MODE</div>
        <div>PRESS ESC TO CLOSE</div>
      </div>

    </div>
  );
};
