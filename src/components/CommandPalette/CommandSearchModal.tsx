import React, { useState } from 'react';
import { Search, X, Music, Sparkles } from 'lucide-react';
import { Song, VisualMode } from '../../types';

interface CommandSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  songs: Song[];
  onPlaySong: (song: Song) => void;
  onSelectMode: (mode: VisualMode) => void;
}

export const CommandSearchModal: React.FC<CommandSearchModalProps> = ({
  isOpen,
  onClose,
  songs,
  onPlaySong,
  onSelectMode
}) => {
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  const filteredSongs = songs.filter(
    (s) =>
      s.title.toLowerCase().includes(query.toLowerCase()) ||
      s.artist.toLowerCase().includes(query.toLowerCase())
  );

  const modes: VisualMode[] = ['CINEMA', 'VOID', 'ARCHIVE', 'DREAM', 'RAW', 'NATURE', 'TYPOGRAPHIC', 'PARTICLE'];
  const filteredModes = modes.filter((m) => m.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-6 bg-black/80 backdrop-blur-2xl text-[#e4e2dd] select-none font-mono">
      
      <div className="relative max-w-xl w-full bg-[#12141a] border border-white/15 rounded-3xl p-6 shadow-2xl flex flex-col gap-4">
        
        <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-white/5 border border-white/10">
          <Search className="w-4 h-4 text-white/40" />
          <input
            type="text"
            placeholder="Type a track name, artist, or visual mode (e.g. Cinema, Void)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="bg-transparent text-xs font-mono text-white focus:outline-none w-full"
            autoFocus
          />
          <button onClick={onClose} className="p-1 text-white/40 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="max-h-80 overflow-y-auto space-y-2">
          
          {filteredModes.length > 0 && (
            <div className="space-y-1">
              <span className="text-[10px] text-white/40 uppercase tracking-widest px-2">VISUAL MODES</span>
              {filteredModes.map((m) => (
                <div
                  key={m}
                  onClick={() => {
                    onSelectMode(m);
                    onClose();
                  }}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/10 cursor-pointer transition-all text-xs text-white"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Switch to {m} Mode</span>
                </div>
              ))}
            </div>
          )}

          <div className="space-y-1 pt-2">
            <span className="text-[10px] text-white/40 uppercase tracking-widest px-2">TRACKS ({filteredSongs.length})</span>
            {filteredSongs.map((s) => (
              <div
                key={s.id}
                onClick={() => {
                  onPlaySong(s);
                  onClose();
                }}
                className="flex items-center justify-between p-3 rounded-xl hover:bg-white/10 cursor-pointer transition-all text-xs"
              >
                <div className="flex items-center gap-3">
                  <Music className="w-4 h-4 text-white/40" />
                  <div>
                    <p className="font-bold text-white">{s.title}</p>
                    <p className="text-[10px] text-white/50">{s.artist}</p>
                  </div>
                </div>
                <span className="text-[10px] text-white/30 uppercase">{s.genre}</span>
              </div>
            ))}
          </div>

        </div>

      </div>

    </div>
  );
};
