import { Song, MoodType, VisualProfile } from '../types';
import { parseLRC, parsePlainTextLyrics } from './lyricEngine';
import { generateDirectorTimeline } from './aiDirectorEngine';

export interface ScannedFileItem {
  file: File;
  path: string;
}

export async function scanLocalFiles(files: FileList | File[]): Promise<{ addedSongs: Song[]; duplicateCount: number }> {
  const fileArray = Array.from(files);
  const audioFiles: File[] = [];
  const lrcFilesMap = new Map<string, File>();

  // Group files into audio vs .lrc
  for (const f of fileArray) {
    const ext = f.name.substring(f.name.lastIndexOf('.')).toLowerCase();
    const baseName = f.name.substring(0, f.name.lastIndexOf('.')).toLowerCase();

    if (['.mp3', '.wav', '.ogg', '.m4a', '.aac', '.flac'].includes(ext)) {
      audioFiles.push(f);
    } else if (ext === '.lrc') {
      lrcFilesMap.set(baseName, f);
    }
  }

  const newSongs: Song[] = [];
  let duplicateCount = 0;

  for (const audioFile of audioFiles) {
    const baseName = audioFile.name.substring(0, audioFile.name.lastIndexOf('.'));
    const cleanBaseName = baseName.toLowerCase();
    
    // Check path / artist extraction from folder structure
    let artist = 'Local Artist';
    let title = baseName;

    if (baseName.includes('-')) {
      const parts = baseName.split('-');
      artist = parts[0].trim();
      title = parts.slice(1).join('-').trim();
    }

    // Try reading matching .lrc file if paired
    let lyricsText = '';
    const pairedLrc = lrcFilesMap.get(cleanBaseName);
    if (pairedLrc) {
      try {
        lyricsText = await pairedLrc.text();
      } catch (e) {
        console.warn('Could not read lrc file', e);
      }
    }

    const duration = 210; // Default estimate
    const lyrics = lyricsText ? parseLRC(lyricsText, duration) : parsePlainTextLyrics(`${title}\n${artist}\nInstrumental soundscape`, duration);

    // Dynamic Visual Profile synthesis
    const mood = determineMoodFromText(title + ' ' + artist);
    const visualProfile = generateVisualProfileForMood(mood);

    // Object URL for playback
    const audioUrl = URL.createObjectURL(audioFile);

    const newSong: Song = {
      id: `local-${audioFile.name}-${audioFile.size}`,
      title,
      artist,
      album: 'Local Collection',
      artwork: generateArtworkDataUrl(title, visualProfile.accentColor),
      audioUrl,
      duration,
      bpm: Math.floor(Math.random() * 40) + 85,
      genre: 'Local Audio',
      mood,
      lyrics,
      visualProfile,
      folderPath: `music/${artist}/${audioFile.name}`,
      playCount: 0,
      isFavorite: false,
      addedAt: new Date().toISOString().split('T')[0],
      songDna: {
        energy: visualProfile.energy,
        dance: Math.floor(Math.random() * 30) + 50,
        emotion: visualProfile.nostalgia,
        nostalgia: visualProfile.nostalgia,
        vocalClarity: 85,
        bassIntensity: visualProfile.darkness,
        acousticness: visualProfile.warmth
      },
      vibeCheck: {
        nostalgia: visualProfile.nostalgia,
        heartbreak: visualProfile.darkness,
        mainCharacterScore: 90,
        lateNightScore: 85,
        euphoria: visualProfile.energy,
        primaryVibeText: `${mood.toUpperCase()} Sonic Wave`,
        summaryQuote: `"${title} by ${artist} imported into local library."`
      },
      directorTimeline: generateDirectorTimeline(title, artist, duration, mood, lyrics.length)
    };

    newSongs.push(newSong);
  }

  return { addedSongs: newSongs, duplicateCount };
}

function determineMoodFromText(text: string): MoodType {
  const lower = text.toLowerCase();
  if (lower.includes('rain') || lower.includes('sad') || lower.includes('tears') || lower.includes('lonely')) return 'sad';
  if (lower.includes('love') || lower.includes('heart') || lower.includes('warm')) return 'romantic';
  if (lower.includes('fire') || lower.includes('electric') || lower.includes('dance') || lower.includes('fast')) return 'energetic';
  if (lower.includes('memory') || lower.includes('past') || lower.includes('old')) return 'nostalgic';
  if (lower.includes('dream') || lower.includes('sky') || lower.includes('space')) return 'dreamy';
  if (lower.includes('dark') || lower.includes('night') || lower.includes('black')) return 'dark';
  return 'raw';
}

function generateVisualProfileForMood(mood: MoodType): VisualProfile {
  const profiles: Record<MoodType, VisualProfile> = {
    sad: {
      mood: 'sad',
      energy: 30,
      warmth: 20,
      darkness: 80,
      nostalgia: 85,
      aggression: 10,
      romance: 50,
      primaryColor: '#1c232f',
      secondaryColor: '#334155',
      accentColor: '#93c5fd',
      particleStyle: 'rain',
      typographyStyle: 'serif-italic',
      visualMode: 'CINEMA'
    },
    romantic: {
      mood: 'romantic',
      energy: 50,
      warmth: 85,
      darkness: 40,
      nostalgia: 70,
      aggression: 5,
      romance: 95,
      primaryColor: '#271219',
      secondaryColor: '#881337',
      accentColor: '#fda4af',
      particleStyle: 'embers',
      typographyStyle: 'serif-italic',
      visualMode: 'DREAM'
    },
    energetic: {
      mood: 'energetic',
      energy: 90,
      warmth: 50,
      darkness: 60,
      nostalgia: 40,
      aggression: 80,
      romance: 30,
      primaryColor: '#2a0a18',
      secondaryColor: '#9f1239',
      accentColor: '#f43f5e',
      particleStyle: 'embers',
      typographyStyle: 'bold-editorial',
      visualMode: 'PARTICLE'
    },
    nostalgic: {
      mood: 'nostalgic',
      energy: 40,
      warmth: 75,
      darkness: 50,
      nostalgia: 95,
      aggression: 10,
      romance: 60,
      primaryColor: '#1f1911',
      secondaryColor: '#78350f',
      accentColor: '#fde047',
      particleStyle: 'dust',
      typographyStyle: 'cinematic',
      visualMode: 'ARCHIVE'
    },
    dreamy: {
      mood: 'dreamy',
      energy: 25,
      warmth: 80,
      darkness: 50,
      nostalgia: 85,
      aggression: 0,
      romance: 75,
      primaryColor: '#0c192c',
      secondaryColor: '#1e3a8a',
      accentColor: '#38bdf8',
      particleStyle: 'stars',
      typographyStyle: 'serif-italic',
      visualMode: 'DREAM'
    },
    dark: {
      mood: 'dark',
      energy: 85,
      warmth: 10,
      darkness: 95,
      nostalgia: 30,
      aggression: 90,
      romance: 10,
      primaryColor: '#090a0f',
      secondaryColor: '#27272a',
      accentColor: '#e4e4e7',
      particleStyle: 'rays',
      typographyStyle: 'cinematic',
      visualMode: 'VOID'
    },
    happy: {
      mood: 'happy',
      energy: 80,
      warmth: 85,
      darkness: 20,
      nostalgia: 50,
      aggression: 20,
      romance: 60,
      primaryColor: '#1c1917',
      secondaryColor: '#854d0e',
      accentColor: '#fef08a',
      particleStyle: 'dust',
      typographyStyle: 'bold-editorial',
      visualMode: 'TYPOGRAPHIC'
    },
    raw: {
      mood: 'raw',
      energy: 80,
      warmth: 30,
      darkness: 85,
      nostalgia: 40,
      aggression: 85,
      romance: 20,
      primaryColor: '#18181b',
      secondaryColor: '#3f3f46',
      accentColor: '#f4f4f5',
      particleStyle: 'geometric',
      typographyStyle: 'mono-space',
      visualMode: 'RAW'
    }
  };

  return profiles[mood] || profiles.sad;
}

function generateArtworkDataUrl(title: string, color: string): string {
  const canvas = document.createElement('canvas');
  canvas.width = 500;
  canvas.height = 500;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  const grad = ctx.createLinearGradient(0, 0, 500, 500);
  grad.addColorStop(0, '#090a0f');
  grad.addColorStop(1, color || '#27272a');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 500, 500);

  ctx.fillStyle = '#ffffff';
  ctx.font = '600 42px Syne, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  
  const words = title.split(' ');
  const initial = words.map(w => w[0]).join('').toUpperCase().substring(0, 3);
  ctx.fillText(initial, 250, 250);

  return canvas.toDataURL('image/jpeg');
}
