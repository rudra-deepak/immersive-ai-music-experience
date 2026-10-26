import React from 'react';
import { LyricLine } from '../../types';
import { getCurrentLyricLine } from '../../services/lyricEngine';
import { Sparkles, Share2 } from 'lucide-react';

interface CinematicLyricsViewProps {
  lyrics: LyricLine[];
  currentTime: number;
  onSelectLineForCard?: (lineText: string) => void;
  isCompact?: boolean;
}

export const CinematicLyricsView: React.FC<CinematicLyricsViewProps> = ({
  lyrics,
  currentTime,
  onSelectLineForCard,
  isCompact = false
}) => {
  const currentLine = getCurrentLyricLine(lyrics, currentTime);

  if (!lyrics || lyrics.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center text-white/40 font-mono text-xs">
        <Sparkles className="w-5 h-5 mb-2 text-white/20" />
        <p className="font-serif italic text-base text-white/60">"The words are missing."</p>
        <p className="mt-1 text-[11px] text-white/30">Upload an .lrc file or auto-generate lyrics from track metadata.</p>
      </div>
    );
  }

  return (
    <div className={`w-full flex flex-col justify-center items-center select-none text-[#e4e2dd] transition-all duration-700 ${isCompact ? 'py-4' : 'py-16'}`}>
      
      {/* Primary Active Lyric Sentence */}
      <div className="max-w-4xl mx-auto text-center space-y-6 px-6">
        
        {lyrics.map((line) => {
          const isActive = currentLine?.id === line.id;
          const isPast = currentTime > (line.endTime || line.time + 5);

          return (
            <div
              key={line.id}
              className={`group cursor-pointer transition-all duration-700 flex items-center justify-center gap-3 ${
                isActive
                  ? 'scale-105 opacity-100 py-4'
                  : isPast
                  ? 'scale-95 opacity-25 hover:opacity-50 py-1'
                  : 'scale-95 opacity-25 hover:opacity-50 py-1'
              }`}
            >
              <p className={`font-serif tracking-tight transition-all duration-500 ${
                isActive
                  ? 'text-3xl sm:text-5xl lg:text-6xl font-normal text-white text-glow-light'
                  : 'text-xl sm:text-2xl text-white/60'
              }`}>
                {line.text}
              </p>

              {onSelectLineForCard && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectLineForCard(line.text);
                  }}
                  className="opacity-0 group-hover:opacity-100 p-2 rounded-full bg-white/10 hover:bg-white text-white hover:text-black transition-all duration-300"
                  title="Generate Lyric Card Poster"
                >
                  <Share2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          );
        })}

      </div>

    </div>
  );
};
