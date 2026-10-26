import { useState, useEffect, useCallback, useRef } from 'react';
import { Song, VisualMode, User } from './types';
import { DbService } from './services/dbService';
import { audioEngine } from './services/audioEngine';
import { VisualizerCanvas } from './components/Visualizer/VisualizerCanvas';
import { Navbar } from './components/Navigation/Navbar';
import { HeroIntro } from './components/Hero/HeroIntro';
import { LibraryView } from './components/Library/LibraryView';
import { MainCharacterView } from './components/NowPlaying/MainCharacterView';
import { PlayerBar } from './components/Player/PlayerBar';
import { UploadModal } from './components/Upload/UploadModal';
import { ScannerModal } from './components/Scanner/ScannerModal';
import { DirectorViewModal } from './components/AI/DirectorViewModal';
import { VibeCheckModal } from './components/AI/VibeCheckModal';
import { SongDnaModal } from './components/AI/SongDnaModal';
import { LyricCardStudioModal } from './components/AI/LyricCardStudioModal';
import { AuthModal } from './components/Auth/AuthModal';
import { SettingsModal } from './components/Settings/SettingsModal';
import { CommandSearchModal } from './components/CommandPalette/CommandSearchModal';
import { ToastContainer, ToastMessage } from './components/UI/Toast';

export function App() {
  // Navigation View State
  const [currentView, setCurrentView] = useState<'hero' | 'library' | 'nowplaying'>('hero');
  
  // Music Catalog State
  const [songs, setSongs] = useState<Song[]>(() => DbService.getSongs());
  const [currentSong, setCurrentSong] = useState<Song | null>(() => songs[0] || null);
  
  // Audio Playback State
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(180);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  
  // Visual Mode State
  const [activeMode, setActiveMode] = useState<VisualMode>(
    () => currentSong?.visualProfile.visualMode || 'CINEMA'
  );
  const [isReducedMotion, setIsReducedMotion] = useState(false);

  // User Auth State
  const [user, setUser] = useState<User | null>(() => DbService.getUser());

  // Modal Dialog States
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isDirectorOpen, setIsDirectorOpen] = useState(false);
  const [isVibeCheckOpen, setIsVibeCheckOpen] = useState(false);
  const [isSongDnaOpen, setIsSongDnaOpen] = useState(false);
  const [isLyricStudioOpen, setIsLyricStudioOpen] = useState(false);
  const [selectedLyricText, setSelectedLyricText] = useState('');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Notification Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = useCallback((title: string, message?: string, type: ToastMessage['type'] = 'custom') => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const handleDismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Audio Playhead Time Updates
  const animRef = useRef<number | null>(null);

  useEffect(() => {
    const audioEl = audioEngine.getAudioElement();
    if (!audioEl) return;

    const updateTime = () => {
      if (audioEl.duration && !isNaN(audioEl.duration)) {
        setDuration(audioEl.duration);
      }
      setCurrentTime(audioEl.currentTime || 0);
      if (isPlaying) {
        animRef.current = requestAnimationFrame(updateTime);
      }
    };

    if (isPlaying) {
      animRef.current = requestAnimationFrame(updateTime);
    } else if (animRef.current) {
      cancelAnimationFrame(animRef.current);
    }

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [isPlaying]);

  // Handle Playback Actions
  const handlePlaySong = useCallback((song: Song) => {
    setCurrentSong(song);
    setActiveMode(song.visualProfile.visualMode);

    audioEngine.loadAudioUrl(song.audioUrl, () => {
      handleNextTrack();
    });

    audioEngine.playAudio();
    setIsPlaying(true);
    DbService.recordPlayHistory(song.id);
  }, []);

  const handleTogglePlayPause = useCallback(() => {
    if (!currentSong) return;

    if (isPlaying) {
      audioEngine.pauseAudio();
      setIsPlaying(false);
    } else {
      audioEngine.playAudio();
      setIsPlaying(true);
    }
  }, [currentSong, isPlaying]);

  const handleNextTrack = useCallback(() => {
    if (!currentSong || songs.length === 0) return;
    const currentIndex = songs.findIndex((s) => s.id === currentSong.id);
    const nextIndex = (currentIndex + 1) % songs.length;
    handlePlaySong(songs[nextIndex]);
  }, [currentSong, songs, handlePlaySong]);

  const handlePrevTrack = useCallback(() => {
    if (!currentSong || songs.length === 0) return;
    const currentIndex = songs.findIndex((s) => s.id === currentSong.id);
    const prevIndex = (currentIndex - 1 + songs.length) % songs.length;
    handlePlaySong(songs[prevIndex]);
  }, [currentSong, songs, handlePlaySong]);

  const handleSeek = (seconds: number) => {
    setCurrentTime(seconds);
    audioEngine.seek(seconds);
  };

  const handleVolumeChange = (vol: number) => {
    setVolume(vol);
    audioEngine.setVolume(vol);
  };

  const handleToggleMute = () => {
    const muted = audioEngine.toggleMute();
    setIsMuted(muted);
  };

  const handleToggleFavorite = (songId: string) => {
    const updatedSongs = DbService.toggleFavorite(songId);
    setSongs(updatedSongs);
    if (currentSong?.id === songId) {
      setCurrentSong({ ...currentSong, isFavorite: !currentSong.isFavorite });
    }
  };

  // Keyboard Shortcuts Listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      } else if (e.code === 'Space') {
        e.preventDefault();
        handleTogglePlayPause();
      } else if (e.key.toLowerCase() === 'm') {
        handleToggleMute();
      } else if (e.key.toLowerCase() === 'd') {
        setIsDirectorOpen(true);
      } else if (e.key.toLowerCase() === 'l') {
        setCurrentView('nowplaying');
      } else if (e.key === 'Escape') {
        setIsUploadOpen(false);
        setIsScannerOpen(false);
        setIsAuthOpen(false);
        setIsSearchOpen(false);
        setIsDirectorOpen(false);
        setIsVibeCheckOpen(false);
        setIsSongDnaOpen(false);
        setIsLyricStudioOpen(false);
        setIsSettingsOpen(false);
        if (currentView === 'nowplaying') {
          setCurrentView('library');
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleTogglePlayPause, currentView]);

  return (
    <div className="relative min-h-screen bg-[#08090b] text-[#e4e2dd] overflow-x-hidden font-sans film-grain select-none">
      
      {/* 60 FPS Visual Intelligence Engine Canvas */}
      {currentSong && (
        <VisualizerCanvas
          visualProfile={currentSong.visualProfile}
          activeMode={activeMode}
          isReducedMotion={isReducedMotion}
        />
      )}

      {/* Navigation Bar */}
      <Navbar
        currentView={currentView}
        onNavigate={(view) => {
          if (view === 'director') {
            setIsDirectorOpen(true);
          } else {
            setCurrentView(view);
          }
        }}
        onOpenUpload={() => setIsUploadOpen(true)}
        onOpenScanner={() => setIsScannerOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenVibeCheck={() => setIsVibeCheckOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        user={user}
        trackCount={songs.length}
      />

      {/* Primary Page Views */}
      <main className="relative z-10 min-h-screen flex flex-col">
        {currentView === 'hero' && (
          <HeroIntro
            currentSong={currentSong}
            isPlaying={isPlaying}
            onPlaySong={handlePlaySong}
            onEnterApp={() => setCurrentView('library')}
          />
        )}

        {currentView === 'library' && (
          <LibraryView
            songs={songs}
            currentSong={currentSong}
            isPlaying={isPlaying}
            onPlaySong={handlePlaySong}
            onToggleFavorite={handleToggleFavorite}
            onOpenUpload={() => setIsUploadOpen(true)}
            onOpenScanner={() => setIsScannerOpen(true)}
          />
        )}

        {currentView === 'nowplaying' && currentSong && (
          <MainCharacterView
            song={currentSong}
            isPlaying={isPlaying}
            currentTime={currentTime}
            duration={duration}
            activeMode={activeMode}
            onPlayPause={handleTogglePlayPause}
            onClose={() => setCurrentView('library')}
            onToggleFavorite={handleToggleFavorite}
            onOpenDirector={() => setIsDirectorOpen(true)}
            onOpenVibeCheck={() => setIsVibeCheckOpen(true)}
            onOpenSongDna={() => setIsSongDnaOpen(true)}
            onOpenLyricStudio={(lyric) => {
              setSelectedLyricText(lyric);
              setIsLyricStudioOpen(true);
            }}
          />
        )}
      </main>

      {/* Floating Player Control Bar */}
      {currentSong && (
        <PlayerBar
          currentSong={currentSong}
          isPlaying={isPlaying}
          currentTime={currentTime}
          duration={duration}
          volume={volume}
          isMuted={isMuted}
          activeMode={activeMode}
          onPlayPause={handleTogglePlayPause}
          onNext={handleNextTrack}
          onPrev={handlePrevTrack}
          onSeek={handleSeek}
          onVolumeChange={handleVolumeChange}
          onToggleMute={handleToggleMute}
          onToggleFavorite={handleToggleFavorite}
          onSelectMode={(mode) => setActiveMode(mode)}
          onToggleNowPlaying={() => setCurrentView('nowplaying')}
          onToggleLyrics={() => setCurrentView('nowplaying')}
          onToggleQueue={() => setCurrentView('library')}
          onOpenDirector={() => setIsDirectorOpen(true)}
          onOpenSongDna={() => setIsSongDnaOpen(true)}
        />
      )}

      {/* Interactive Modals */}
      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onSongsAdded={(newSongs) => {
          const updated = [...newSongs, ...songs];
          setSongs(updated);
          localStorage.setItem('valence_songs_v1', JSON.stringify(updated));
          if (newSongs.length > 0) {
            handlePlaySong(newSongs[0]);
            addToast(`Imported ${newSongs.length} new tracks into local library.`);
          }
        }}
      />

      <ScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        songs={songs}
        onSongsAdded={(scannedSongs) => {
          const updated = [...scannedSongs, ...songs];
          setSongs(updated);
          localStorage.setItem('valence_songs_v1', JSON.stringify(updated));
          addToast(`Discovered ${scannedSongs.length} local track files.`);
        }}
      />

      <DirectorViewModal
        isOpen={isDirectorOpen}
        onClose={() => setIsDirectorOpen(false)}
        song={currentSong}
        currentTime={currentTime}
        onSeek={handleSeek}
      />

      <VibeCheckModal
        isOpen={isVibeCheckOpen}
        onClose={() => setIsVibeCheckOpen(false)}
        song={currentSong}
      />

      <SongDnaModal
        isOpen={isSongDnaOpen}
        onClose={() => setIsSongDnaOpen(false)}
        song={currentSong}
      />

      <LyricCardStudioModal
        isOpen={isLyricStudioOpen}
        onClose={() => setIsLyricStudioOpen(false)}
        lyricText={selectedLyricText || currentSong?.lyrics[0]?.text || ''}
        songTitle={currentSong?.title || ''}
        artistName={currentSong?.artist || ''}
        onToast={(msg) => addToast(msg)}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        user={user}
        onUserChange={setUser}
        onToast={(msg) => addToast(msg)}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        isReducedMotion={isReducedMotion}
        onToggleReducedMotion={() => setIsReducedMotion(!isReducedMotion)}
      />

      <CommandSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        songs={songs}
        onPlaySong={handlePlaySong}
        onSelectMode={(mode) => setActiveMode(mode)}
      />

      {/* Toast Notification Container */}
      <ToastContainer toasts={toasts} onDismiss={handleDismissToast} />

    </div>
  );
}

export default App;
