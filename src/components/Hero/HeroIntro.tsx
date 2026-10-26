import React, { useState, useEffect } from 'react';
import { ArrowRight, Play, Sparkles, Disc, Music, Sliders } from 'lucide-react';
import { Song } from '../../types';

interface HeroIntroProps {
  currentSong: Song | null;
  isPlaying: boolean;
  onPlaySong: (song: Song) => void;
  onEnterApp: () => void;
}

export const HeroIntro: React.FC<HeroIntroProps> = ({
  currentSong,
  isPlaying,
  onPlaySong,
  onEnterApp
}) => {
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setPulse((p) => !p);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between p-8 md:p-16 select-none overflow-hidden text-[#e4e2dd] z-20">
      
      {/* Subtle Background Mood Ambient Mesh */}
      <div className="absolute inset-0 pointer-events-none opacity-30">
        <div className={`absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-neutral-800 via-neutral-900 to-black blur-[120px] transition-all duration-1000 ${pulse ? 'scale-110 opacity-40' : 'scale-95 opacity-20'}`} />
      </div>

      {/* Top Subtle Status Line */}
      <div className="flex items-center justify-between z-10 text-xs font-mono tracking-widest text-white/40 uppercase">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>VALENCE ENGINE ACTIVE</span>
        </div>
        <span>60 FPS KINETIC CANVAS</span>
      </div>

      {/* Central Dramatic Editorial Typography */}
      <div className="my-auto max-w-5xl mx-auto text-center z-10 space-y-8">
        
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-mono tracking-wider text-amber-300/80 mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>REUSABLE VISUAL INTELLIGENCE ENGINE</span>
        </div>

        <h1 className="font-display font-extrabold text-5xl sm:text-7xl lg:text-8xl tracking-tight leading-[0.95] text-white uppercase">
          SOUND IS NOT PLAYED.<br />
          <span className="font-serif italic font-light lowercase tracking-normal text-white/70">
            sound is experienced.
          </span>
        </h1>

        <p className="max-w-2xl mx-auto text-sm sm:text-base font-sans text-white/50 leading-relaxed tracking-wide font-light">
          Drop any audio file or lyrics. Valence analyzes frequency, bass dynamics, sentiment, and structural beats to dynamically construct a unique cinematic visual world.
        </p>

        {/* Primary Interactive Entry Button */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
          
          {currentSong && (
            <button
              onClick={() => onPlaySong(currentSong)}
              className="flex items-center gap-3 px-8 py-4 rounded-full bg-white text-black font-mono font-semibold text-xs tracking-[0.2em] uppercase hover:bg-neutral-200 transition-all duration-300 shadow-2xl hover:scale-105"
            >
              {isPlaying ? (
                <>
                  <Sliders className="w-4 h-4 animate-spin text-black" />
                  <span>EXPERIENCE: {currentSong.title}</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 text-black fill-black" />
                  <span>PLAY: {currentSong.title}</span>
                </>
              )}
            </button>
          )}

          <button
            onClick={onEnterApp}
            className="flex items-center gap-3 px-8 py-4 rounded-full bg-white/10 border border-white/20 text-white font-mono text-xs tracking-[0.2em] uppercase hover:bg-white/20 hover:border-white/40 transition-all duration-300 backdrop-blur-xl"
          >
            <span>ENTER CATALOG</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* Bottom Editorial Controls Preview */}
      <div className="z-10 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-mono text-white/40 border-t border-white/5 pt-6">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Disc className="w-3.5 h-3.5" />
            <span>ONE ENGINE → INFINITE SONGS</span>
          </div>
          <div className="flex items-center gap-2">
            <Music className="w-3.5 h-3.5" />
            <span>LOCAL SCANNER ACTIVE</span>
          </div>
        </div>

        <div className="tracking-widest uppercase text-[10px]">
          [ PRESS SPACE TO PLAY / CMD+K TO SEARCH ]
        </div>
      </div>

    </div>
  );
};
