export type VisualMode = 
  | 'CINEMA' 
  | 'VOID' 
  | 'ARCHIVE' 
  | 'DREAM' 
  | 'RAW' 
  | 'NATURE' 
  | 'TYPOGRAPHIC' 
  | 'PARTICLE';

export type MoodType = 
  | 'sad' 
  | 'romantic' 
  | 'energetic' 
  | 'nostalgic' 
  | 'dreamy' 
  | 'dark' 
  | 'happy' 
  | 'raw';

export interface VisualProfile {
  mood: MoodType;
  energy: number; // 0 - 100
  warmth: number; // 0 - 100
  darkness: number; // 0 - 100
  nostalgia: number; // 0 - 100
  aggression: number; // 0 - 100
  romance: number; // 0 - 100
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  particleStyle: 'dust' | 'embers' | 'rain' | 'stars' | 'rays' | 'geometric';
  typographyStyle: 'cinematic' | 'bold-editorial' | 'serif-italic' | 'mono-space' | 'minimalist';
  visualMode: VisualMode;
}

export interface LyricWord {
  word: string;
  startTime: number;
  endTime: number;
  emotion?: string;
}

export interface LyricLine {
  id: string;
  time: number; // in seconds
  endTime?: number;
  text: string;
  words?: LyricWord[];
  emotion?: string;
  sceneTrigger?: string;
}

export interface SongDirectorScene {
  timestamp: number;
  timeFormatted: string;
  title: string;
  description: string;
  visualEffect: string;
  cameraMotion: string;
  intensity: number;
}

export interface SongDNA {
  energy: number;
  dance: number;
  emotion: number;
  nostalgia: number;
  vocalClarity: number;
  bassIntensity: number;
  acousticness: number;
}

export interface VibeCheck {
  nostalgia: number;
  heartbreak: number;
  mainCharacterScore: number;
  lateNightScore: number;
  euphoria: number;
  primaryVibeText: string;
  summaryQuote: string;
}

export interface Song {
  id: string;
  title: string;
  artist: string;
  album: string;
  artwork: string;
  audioUrl: string;
  duration: number; // in seconds
  bpm: number;
  genre: string;
  year?: number;
  mood: MoodType;
  lyrics: LyricLine[];
  visualProfile: VisualProfile;
  songDna: SongDNA;
  vibeCheck: VibeCheck;
  directorTimeline: SongDirectorScene[];
  playCount: number;
  isFavorite: boolean;
  folderPath?: string;
  addedAt: string;
  audioBlob?: Blob;
}

export interface Playlist {
  id: string;
  name: string;
  description: string;
  coverArt: string;
  songIds: string[];
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  token?: string;
  listeningArchetype?: string;
}

export interface AudioAnalysisData {
  bass: number;        // 0 - 1
  mid: number;         // 0 - 1
  treble: number;      // 0 - 1
  amplitude: number;   // 0 - 1
  kickDetected: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  frequencyData: any;
}

export type LyricCardStyle = 'EDITORIAL' | 'ARCHIVE' | 'JAPANESE' | 'MINIMAL_VOID' | 'FILM_STILL';

export interface LyricCardConfig {
  lyricText: string;
  songTitle: string;
  artistName: string;
  style: LyricCardStyle;
  backgroundColor: string;
  textColor: string;
  showGrain: boolean;
  showWaveform: boolean;
}
