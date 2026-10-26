import React from 'react';
import { X, Activity } from 'lucide-react';
import { Song } from '../../types';

interface SongDnaModalProps {
  isOpen: boolean;
  onClose: () => void;
  song: Song | null;
}

export const SongDnaModal: React.FC<SongDnaModalProps> = ({
  isOpen,
  onClose,
  song
}) => {
  if (!isOpen || !song) return null;

  const renderBlocks = (value: number) => {
    const total = 10;
    const active = Math.round((value / 100) * total);
    return '█'.repeat(active) + '░'.repeat(total - active);
  };

  const { songDna } = song;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/85 backdrop-blur-2xl text-[#e4e2dd] select-none font-mono">
      
      <div className="relative max-w-lg w-full bg-[#12141a] border border-white/15 rounded-3xl p-8 shadow-2xl flex flex-col gap-6">
        
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-xl text-white uppercase tracking-wide">
                SONG DNA BREAKDOWN
              </h3>
              <p className="text-xs text-white/50">{song.title} • {song.artist}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ASCII Block Spectral Graph */}
        <div className="space-y-3 bg-[#0a0b0e] p-6 rounded-2xl border border-white/10 text-xs">
          <div className="flex justify-between items-center text-sky-300">
            <span>ENERGY IMPACT</span>
            <span className="font-bold">{renderBlocks(songDna.energy)} {songDna.energy}%</span>
          </div>

          <div className="flex justify-between items-center text-amber-300">
            <span>DANCE VELOCITY</span>
            <span className="font-bold">{renderBlocks(songDna.dance)} {songDna.dance}%</span>
          </div>

          <div className="flex justify-between items-center text-rose-400">
            <span>EMOTIONAL DEPTH</span>
            <span className="font-bold">{renderBlocks(songDna.emotion)} {songDna.emotion}%</span>
          </div>

          <div className="flex justify-between items-center text-purple-300">
            <span>NOSTALGIC REVERB</span>
            <span className="font-bold">{renderBlocks(songDna.nostalgia)} {songDna.nostalgia}%</span>
          </div>

          <div className="flex justify-between items-center text-emerald-400">
            <span>VOCAL CLARITY</span>
            <span className="font-bold">{renderBlocks(songDna.vocalClarity)} {songDna.vocalClarity}%</span>
          </div>

          <div className="flex justify-between items-center text-white/80">
            <span>SUB-BASS PRESSURE</span>
            <span className="font-bold">{renderBlocks(songDna.bassIntensity)} {songDna.bassIntensity}%</span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3.5 rounded-2xl bg-white text-black font-bold text-xs uppercase hover:bg-neutral-200 transition-all shadow-xl"
        >
          CLOSE BREAKDOWN
        </button>

      </div>

    </div>
  );
};
