import React from 'react';
import { X, Clapperboard, Sparkles, Play } from 'lucide-react';
import { Song } from '../../types';

interface DirectorViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  song: Song | null;
  currentTime: number;
  onSeek: (secs: number) => void;
}

export const DirectorViewModal: React.FC<DirectorViewModalProps> = ({
  isOpen,
  onClose,
  song,
  currentTime,
  onSeek
}) => {
  if (!isOpen || !song) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/85 backdrop-blur-2xl text-[#e4e2dd] select-none">
      
      <div className="relative max-w-3xl w-full bg-[#12141a] border border-white/15 rounded-3xl p-8 shadow-2xl flex flex-col gap-6 max-h-[85vh] overflow-y-auto">
        
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-300">
              <Clapperboard className="w-5 h-5" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1 text-[10px] font-mono text-purple-300 uppercase tracking-widest">
                <Sparkles className="w-3 h-3" />
                <span>AI DIRECTOR TIMELINE</span>
              </div>
              <h3 className="font-display font-bold text-xl text-white uppercase tracking-wide">
                {song.title} — VISUAL SCRIPT
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Timeline Event Scenes */}
        <div className="space-y-4">
          {song.directorTimeline.map((scene, idx) => {
            const isActive = currentTime >= scene.timestamp && (idx === song.directorTimeline.length - 1 || currentTime < song.directorTimeline[idx + 1].timestamp);

            return (
              <div
                key={idx}
                onClick={() => onSeek(scene.timestamp)}
                className={`p-5 rounded-2xl border cursor-pointer transition-all duration-300 flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                  isActive 
                    ? 'bg-purple-500/15 border-purple-500/40 shadow-xl scale-[1.01]' 
                    : 'bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/10'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="px-3 py-1.5 rounded-lg bg-black/40 border border-white/10 text-xs font-mono text-amber-300 font-bold">
                    {scene.timeFormatted}
                  </div>

                  <div>
                    <h4 className="font-display font-bold text-base text-white flex items-center gap-2">
                      {scene.title}
                      {isActive && <span className="w-2 h-2 rounded-full bg-purple-400 animate-ping" />}
                    </h4>
                    <p className="text-xs font-sans text-white/70 mt-1 leading-relaxed">
                      {scene.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-[11px] font-mono text-white/50 border-t md:border-t-0 border-white/10 pt-3 md:pt-0">
                  <span className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-white/80">
                    {scene.visualEffect}
                  </span>
                  <button className="p-2 rounded-full bg-white/10 text-white hover:bg-white hover:text-black transition-all">
                    <Play className="w-3.5 h-3.5 fill-current" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>

    </div>
  );
};
