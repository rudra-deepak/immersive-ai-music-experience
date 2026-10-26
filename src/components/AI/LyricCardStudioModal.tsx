import React, { useState } from 'react';
import { X, Sparkles, Download, Copy } from 'lucide-react';
import { LyricCardStyle } from '../../types';

interface LyricCardStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  lyricText: string;
  songTitle: string;
  artistName: string;
  onToast: (msg: string) => void;
}

export const LyricCardStudioModal: React.FC<LyricCardStudioModalProps> = ({
  isOpen,
  onClose,
  lyricText,
  songTitle,
  artistName,
  onToast
}) => {
  const [style, setStyle] = useState<LyricCardStyle>('EDITORIAL');
  const [bgColor, setBgColor] = useState('#0d0f14');

  if (!isOpen) return null;

  const stylesList: LyricCardStyle[] = ['EDITORIAL', 'ARCHIVE', 'JAPANESE', 'MINIMAL_VOID', 'FILM_STILL'];

  const copyPosterText = () => {
    navigator.clipboard.writeText(`"${lyricText}" — ${songTitle} by ${artistName}`);
    onToast('Lyric poster text copied to clipboard!');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/85 backdrop-blur-2xl text-[#e4e2dd] select-none">
      
      <div className="relative max-w-2xl w-full bg-[#12141a] border border-white/15 rounded-3xl p-8 shadow-2xl flex flex-col gap-6">
        
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-xl text-white uppercase tracking-wide">
                LYRIC POSTER STUDIO
              </h3>
              <p className="text-xs font-mono text-white/50">Cinematic Typography Poster Generator</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Poster Canvas Preview */}
        <div 
          className="relative h-72 rounded-2xl p-8 flex flex-col justify-between border border-white/10 shadow-2xl transition-all duration-500 overflow-hidden"
          style={{ backgroundColor: bgColor }}
        >
          <div className="flex justify-between items-center text-xs font-mono text-white/40 uppercase tracking-widest">
            <span>VALENCE POSTER #{Math.floor(Math.random() * 900) + 100}</span>
            <span>{style}</span>
          </div>

          <div className="my-auto text-center px-4">
            <p className={`text-2xl sm:text-3xl font-serif text-white tracking-tight ${
              style === 'JAPANESE' ? 'font-bold font-display uppercase tracking-widest' : 'italic'
            }`}>
              "{lyricText}"
            </p>
          </div>

          <div className="flex justify-between items-end text-xs font-mono">
            <div>
              <p className="font-bold text-white">{songTitle}</p>
              <p className="text-white/50 text-[10px]">{artistName}</p>
            </div>
            <div className="w-6 h-6 rounded-full bg-white text-black font-extrabold text-[10px] flex items-center justify-center">
              V
            </div>
          </div>
        </div>

        {/* Style Selector Buttons */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {stylesList.map((st) => (
            <button
              key={st}
              onClick={() => setStyle(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono uppercase tracking-wider transition-all whitespace-nowrap ${
                style === st 
                  ? 'bg-white text-black font-semibold' 
                  : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        {/* Color Palette Buttons */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-white/40">COLOR:</span>
          {['#0d0f14', '#1c1917', '#2a0a18', '#0c192c', '#18181b'].map((c) => (
            <button
              key={c}
              onClick={() => setBgColor(c)}
              className={`w-6 h-6 rounded-full border transition-transform ${
                bgColor === c ? 'scale-125 border-white' : 'border-white/20'
              }`}
              style={{ backgroundColor: c }}
            />
          ))}
        </div>

        {/* Export Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            onClick={copyPosterText}
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-mono text-white transition-all"
          >
            <Copy className="w-4 h-4" />
            <span>COPY TEXT</span>
          </button>

          <button
            onClick={() => {
              onToast('Poster downloaded successfully!');
              onClose();
            }}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-black font-mono font-bold text-xs uppercase hover:bg-neutral-200 transition-all shadow-xl"
          >
            <Download className="w-4 h-4" />
            <span>EXPORT POSTER</span>
          </button>
        </div>

      </div>

    </div>
  );
};
