import React from 'react';
import { X, Sparkles, Moon, Flame, HeartHandshake, Zap } from 'lucide-react';
import { Song } from '../../types';

interface VibeCheckModalProps {
  isOpen: boolean;
  onClose: () => void;
  song: Song | null;
}

export const VibeCheckModal: React.FC<VibeCheckModalProps> = ({
  isOpen,
  onClose,
  song
}) => {
  if (!isOpen || !song) return null;

  const { vibeCheck } = song;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/85 backdrop-blur-2xl text-[#e4e2dd] select-none">
      
      <div className="relative max-w-xl w-full bg-[#12141a] border border-white/15 rounded-3xl p-8 shadow-2xl flex flex-col gap-6 text-center">
        
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="inline-flex items-center justify-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-mono tracking-widest uppercase mx-auto">
          <Sparkles className="w-3.5 h-3.5" />
          <span>GEN-Z VIBE CHECK ENGINE</span>
        </div>

        <div>
          <h3 className="font-display font-black text-3xl text-white tracking-wide uppercase">
            {vibeCheck.primaryVibeText}
          </h3>
          <p className="font-serif italic text-lg text-white/70 mt-1">
            {vibeCheck.summaryQuote}
          </p>
        </div>

        {/* Vibe Score Meters */}
        <div className="space-y-4 text-left font-mono text-xs my-2">
          
          <div>
            <div className="flex justify-between text-white/80 mb-1">
              <span className="flex items-center gap-1.5"><HeartHandshake className="w-3.5 h-3.5 text-rose-400" /> NOSTALGIA SCORE</span>
              <span className="font-bold text-amber-300">{vibeCheck.nostalgia}%</span>
            </div>
            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-amber-300 rounded-full" style={{ width: `${vibeCheck.nostalgia}%` }} />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-white/80 mb-1">
              <span className="flex items-center gap-1.5"><Flame className="w-3.5 h-3.5 text-rose-500" /> HEARTBREAK SCORE</span>
              <span className="font-bold text-rose-400">{vibeCheck.heartbreak}%</span>
            </div>
            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-rose-500 rounded-full" style={{ width: `${vibeCheck.heartbreak}%` }} />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-white/80 mb-1">
              <span className="flex items-center gap-1.5"><Zap className="w-3.5 h-3.5 text-sky-400" /> MAIN CHARACTER ENERGY</span>
              <span className="font-bold text-sky-300">{vibeCheck.mainCharacterScore}%</span>
            </div>
            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-sky-400 rounded-full" style={{ width: `${vibeCheck.mainCharacterScore}%` }} />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-white/80 mb-1">
              <span className="flex items-center gap-1.5"><Moon className="w-3.5 h-3.5 text-purple-400" /> LATE NIGHT ATMOSPHERE</span>
              <span className="font-bold text-purple-300">{vibeCheck.lateNightScore}%</span>
            </div>
            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-purple-400 rounded-full" style={{ width: `${vibeCheck.lateNightScore}%` }} />
            </div>
          </div>

        </div>

        <button
          onClick={onClose}
          className="w-full py-3.5 rounded-2xl bg-white text-black font-mono font-bold text-xs uppercase hover:bg-neutral-200 transition-all shadow-xl mt-2"
        >
          CONFIRM VIBE
        </button>

      </div>

    </div>
  );
};
