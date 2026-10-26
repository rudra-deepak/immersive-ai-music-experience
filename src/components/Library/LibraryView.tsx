import React, { useState } from 'react';
import { Song, MoodType } from '../../types';
import { Play, Pause, Sparkles, FolderSync, Upload, Heart, Search, Filter } from 'lucide-react';

interface LibraryViewProps {
  songs: Song[];
  currentSong: Song | null;
  isPlaying: boolean;
  onPlaySong: (song: Song) => void;
  onToggleFavorite: (id: string) => void;
  onOpenUpload: () => void;
  onOpenScanner: () => void;
}

export const LibraryView: React.FC<LibraryViewProps> = ({
  songs,
  currentSong,
  isPlaying,
  onPlaySong,
  onToggleFavorite,
  onOpenUpload,
  onOpenScanner
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMood, setSelectedMood] = useState<string>('ALL');

  const filteredSongs = songs.filter((s) => {
    const matchesSearch = 
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.genre.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesMood = selectedMood === 'ALL' || s.mood === selectedMood;

    return matchesSearch && matchesMood;
  });

  const moods: (MoodType | 'ALL')[] = ['ALL', 'sad', 'energetic', 'raw', 'dark', 'dreamy', 'romantic'];

  return (
    <div className="min-h-screen pt-28 pb-32 px-6 max-w-7xl mx-auto z-20 relative text-[#e4e2dd] select-none">
      
      {/* Top Header & Local Scanner Banner */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-white/10 pb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-white/60 mb-3">
            <FolderSync className="w-3.5 h-3.5 text-sky-400" />
            <span>LOCAL LIBRARY (/music/) — AUTO DISCOVERY</span>
          </div>
          <h1 className="font-display font-extrabold text-4xl sm:text-6xl text-white tracking-tight uppercase">
            SONIC CATALOG
          </h1>
          <p className="font-serif italic text-lg sm:text-xl text-white/60 mt-1">
            {songs.length} tracks discovered across local folders & synthetic visual profiles.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onOpenScanner}
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-xs font-mono tracking-wider text-white transition-all shadow-xl"
          >
            <FolderSync className="w-4 h-4 text-sky-400" />
            <span>SCAN LOCAL /music/</span>
          </button>

          <button
            onClick={onOpenUpload}
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-white text-black font-semibold text-xs font-mono tracking-wider hover:bg-neutral-200 transition-all shadow-xl"
          >
            <Upload className="w-4 h-4" />
            <span>DROP SOUND</span>
          </button>
        </div>
      </div>

      {/* Horizontal Visual Feature Cards (Kinetic Composition) */}
      <div className="mb-12">
        <h2 className="text-xs font-mono uppercase tracking-[0.25em] text-white/40 mb-4 flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>FEATURED VISUAL PROFILES</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {songs.slice(0, 3).map((song) => {
            const isThisPlaying = currentSong?.id === song.id && isPlaying;

            return (
              <div
                key={song.id}
                onClick={() => onPlaySong(song)}
                className="group relative h-64 rounded-2xl overflow-hidden border border-white/10 bg-[#12141a] cursor-pointer hover:border-white/30 transition-all duration-500 shadow-2xl p-6 flex flex-col justify-between"
              >
                <img 
                  src={song.artwork} 
                  alt={song.title} 
                  className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:scale-105 group-hover:opacity-50 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

                <div className="z-10 flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full bg-white/10 border border-white/20 backdrop-blur-md text-[10px] font-mono text-white tracking-widest uppercase">
                    {song.visualProfile.visualMode}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleFavorite(song.id);
                    }}
                    className="p-2 rounded-full bg-black/40 text-white/60 hover:text-rose-400 backdrop-blur-md"
                  >
                    <Heart className={`w-3.5 h-3.5 ${song.isFavorite ? 'fill-rose-500 text-rose-500' : ''}`} />
                  </button>
                </div>

                <div className="z-10 flex items-end justify-between gap-4">
                  <div>
                    <h3 className="font-display font-bold text-xl text-white tracking-wide group-hover:underline">
                      {song.title}
                    </h3>
                    <p className="font-serif italic text-sm text-white/70">
                      {song.artist}
                    </p>
                  </div>

                  <div className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform shadow-xl">
                    {isThisPlaying ? <Pause className="w-5 h-5 fill-black" /> : <Play className="w-5 h-5 fill-black ml-0.5" />}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8 bg-[#12141a]/60 border border-white/10 p-3 rounded-2xl backdrop-blur-xl">
        
        <div className="flex items-center gap-2 w-full md:w-auto px-3 py-2 bg-white/5 rounded-xl border border-white/10">
          <Search className="w-4 h-4 text-white/40" />
          <input
            type="text"
            placeholder="Search tracks, artists, genres..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent text-xs font-mono text-white placeholder-white/40 focus:outline-none w-full md:w-64"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          <Filter className="w-3.5 h-3.5 text-white/40 ml-2" />
          {moods.map((m) => (
            <button
              key={m}
              onClick={() => setSelectedMood(m)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono uppercase tracking-wider transition-all whitespace-nowrap ${
                selectedMood === m 
                  ? 'bg-white text-black font-semibold' 
                  : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10'
              }`}
            >
              {m}
            </button>
          ))}
        </div>

      </div>

      {/* Editorial Track List */}
      <div className="space-y-2">
        {filteredSongs.map((song, index) => {
          const isThisPlaying = currentSong?.id === song.id && isPlaying;

          return (
            <div
              key={song.id}
              onClick={() => onPlaySong(song)}
              className={`group flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all duration-300 ${
                currentSong?.id === song.id
                  ? 'bg-white/10 border-white/30 shadow-xl'
                  : 'bg-[#101217]/50 border-white/5 hover:border-white/20 hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-4 min-w-0">
                <span className="font-mono text-xs text-white/30 w-6 text-right">
                  {(index + 1).toString().padStart(2, '0')}
                </span>

                <div className="w-12 h-12 rounded-xl overflow-hidden relative flex-shrink-0 border border-white/10">
                  <img src={song.artwork} alt={song.title} className="w-full h-full object-cover" />
                  <div className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity ${
                    isThisPlaying ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                  }`}>
                    {isThisPlaying ? <Pause className="w-4 h-4 text-white fill-white" /> : <Play className="w-4 h-4 text-white fill-white ml-0.5" />}
                  </div>
                </div>

                <div className="min-w-0">
                  <h4 className="font-display font-bold text-base text-white truncate group-hover:underline">
                    {song.title}
                  </h4>
                  <p className="text-xs font-mono text-white/50 truncate mt-0.5">
                    {song.artist} • <span className="text-white/30">{song.album}</span>
                  </p>
                </div>
              </div>

              <div className="hidden sm:flex items-center gap-6 text-xs font-mono text-white/40">
                <span className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 uppercase tracking-wider text-[10px]">
                  {song.mood}
                </span>
                <span>{Math.floor(song.duration / 60)}:{(song.duration % 60).toString().padStart(2, '0')}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleFavorite(song.id);
                  }}
                  className="p-2 text-white/40 hover:text-rose-400 transition-colors"
                >
                  <Heart className={`w-4 h-4 ${song.isFavorite ? 'fill-rose-500 text-rose-500' : ''}`} />
                </button>
              </div>
            </div>
          );
        })}

        {filteredSongs.length === 0 && (
          <div className="text-center py-16 text-white/40 font-mono text-xs border border-dashed border-white/10 rounded-2xl">
            No tracks found matching "{searchQuery}". Try dropping a new audio file!
          </div>
        )}
      </div>

    </div>
  );
};
