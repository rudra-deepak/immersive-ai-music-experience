import React from 'react';
import { Sparkles, FolderSync, Upload, User as UserIcon, Search, Compass, Tv, Key, ShieldCheck } from 'lucide-react';
import { User } from '../../types';

interface NavbarProps {
  currentView: 'hero' | 'library' | 'nowplaying' | 'director';
  onNavigate: (view: 'hero' | 'library' | 'nowplaying' | 'director') => void;
  onOpenUpload: () => void;
  onOpenScanner: () => void;
  onOpenAuth: () => void;
  onOpenSearch: () => void;
  onOpenVibeCheck: () => void;
  onOpenSettings: () => void;
  user: User | null;
  trackCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  onOpenUpload,
  onOpenScanner,
  onOpenAuth,
  onOpenSearch,
  onOpenVibeCheck,
  onOpenSettings,
  user,
  trackCount
}) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 px-6 py-4 transition-all duration-500">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Brand Monolith */}
        <div 
          onClick={() => onNavigate('hero')} 
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-white/30 transition-all duration-300">
            <span className="font-display font-black text-xs text-white tracking-tighter">V</span>
          </div>
          <div className="flex flex-col">
            <span className="font-display font-bold text-sm tracking-[0.25em] text-white uppercase group-hover:tracking-[0.3em] transition-all duration-300">
              VALENCE
            </span>
            <span className="text-[9px] font-mono text-white/40 tracking-wider uppercase">
              Audio Intelligence
            </span>
          </div>
        </div>

        {/* Floating Minimalist Navigation Pills */}
        <nav className="hidden md:flex items-center gap-1 bg-[#12141a]/80 border border-white/10 backdrop-blur-xl p-1.5 rounded-full shadow-2xl">
          <button
            onClick={() => onNavigate('library')}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-mono tracking-wider transition-all duration-300 ${
              currentView === 'library'
                ? 'bg-white text-black font-medium shadow-lg'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            CATALOG ({trackCount})
          </button>

          <button
            onClick={() => onNavigate('nowplaying')}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-mono tracking-wider transition-all duration-300 ${
              currentView === 'nowplaying'
                ? 'bg-white text-black font-medium shadow-lg'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            <Tv className="w-3.5 h-3.5" />
            CINEMA
          </button>

          <button
            onClick={onOpenVibeCheck}
            className="flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-mono tracking-wider text-amber-300/80 hover:text-amber-200 hover:bg-white/5 transition-all duration-300"
          >
            <Sparkles className="w-3.5 h-3.5" />
            VIBE CHECK
          </button>
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          
          <button
            onClick={onOpenSearch}
            className="p-2.5 rounded-full bg-white/5 border border-white/10 text-white/70 hover:text-white hover:border-white/20 transition-all duration-300"
            title="Command Search (Cmd+K)"
          >
            <Search className="w-4 h-4" />
          </button>

          <button
            onClick={onOpenScanner}
            className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-white/80 hover:text-white hover:bg-white/10 transition-all duration-300"
            title="Scan /music/ Folder"
          >
            <FolderSync className="w-3.5 h-3.5 text-sky-400" />
            <span className="hidden lg:inline">FOLDER SCAN</span>
          </button>

          <button
            onClick={onOpenUpload}
            className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-white text-black font-medium text-xs font-mono tracking-wider hover:bg-neutral-200 transition-all duration-300 shadow-lg"
          >
            <Upload className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">DROP SOUND</span>
          </button>

          {/* User Auth Profile Trigger */}
          <button
            onClick={onOpenAuth}
            className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full bg-white/5 border border-white/10 hover:border-white/30 text-white transition-all duration-300"
          >
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-neutral-700 to-neutral-900 border border-white/20 flex items-center justify-center text-[10px] font-bold">
              {user ? user.name[0].toUpperCase() : <UserIcon className="w-3 h-3 text-white/60" />}
            </div>
            <span className="text-xs font-mono text-white/80 hidden sm:inline">
              {user ? user.name.split(' ')[0] : 'ACCOUNT'}
            </span>
            {user && <ShieldCheck className="w-3 h-3 text-emerald-400 hidden lg:inline" />}
          </button>

          <button
            onClick={onOpenSettings}
            className="p-2.5 rounded-full bg-white/5 border border-white/10 text-white/60 hover:text-white transition-all duration-300"
            title="Settings & Keyboard Shortcuts"
          >
            <Key className="w-4 h-4" />
          </button>
        </div>

      </div>
    </header>
  );
};
