import { Song } from '../types';
import { parseLRC } from './lyricEngine';
import { generateDirectorTimeline } from './aiDirectorEngine';

const ARTWORK = {
  arijit: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1000&q=80',
  weeknd: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=1000&q=80',
  aujla: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1000&q=80',
  kendrick: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1000&q=80',
  ambient: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=1000&q=80'
};

const arijitLrc = `[00:00.00] (Instrumental Prelude - Atmospheric Ambient Shift)
[00:12.50] I still remember the quiet in your voice
[00:19.80] Maybe we were just a beautiful mistake
[00:26.40] Floating through the midnight shadow lines
[00:34.10] Searching for a spark before the daylight breaks
[00:43.00] (Bass Drop - Volumetric Kinetic Shift)
[00:48.20] Rain falling down on the obsidian street
[00:55.60] Every heartbeat echoes in the empty space
[01:03.10] Time moves slower when you hold the memory
[01:10.50] I still remember you, I still remember us
[01:22.00] (Silence and fade into deep night)`;

const weekndLrc = `[00:00.00] (Synthwave Pulse - High Frequency Intro)
[00:10.00] Neon city lights reflection in the dark
[00:16.80] Speeding through the static of a burning heart
[00:24.00] I hear the echo of your touch in the night
[00:31.20] Lost inside the rhythm of the velvet light
[00:39.50] (Chorus - High Energy Surge)
[00:44.00] Can you feel the voltage rushing through the pulse?
[00:51.30] Electric fire burning down the silence
[00:58.70] We are timeless in this void of sound
[01:05.40] Blinding echoes taking over now`;

const aujlaLrc = `[00:00.00] (Acoustic Strings & Urban Beat)
[00:08.50] Deep bass heavy in the quiet of the night
[00:15.20] Walk down the path where the stars align
[00:22.80] Words spoken softly like an ancient sign
[00:30.00] Heavy soul, golden mind, standing in the light
[00:38.20] (Drop - Bass Punch)
[00:43.10] Soft voltage running deep beneath the skin
[00:50.00] Never looking back where the story has been
[00:57.40] Legendary focus in a room of noise
[01:04.20] Silence is the loudest answer in the end`;

const kendrickLrc = `[00:00.00] (Sub Bass Rumble - Raw Studio Static)
[00:06.00] Royalty in my bloodstream, rhythm in the bone
[00:12.40] Constructing architecture in an isolated zone
[00:18.90] Raw frequency shaking through the floorboards
[00:25.50] Speaks with precision while the world wants war
[00:33.00] (Verse II - Rapid Kinetic Flow)
[00:38.00] Unfiltered truth floating in the atmosphere
[00:44.50] Legacy written where the vision stays clear`;

const ambientLrc = `[00:00.00] (Cosmic Soundscape - Zero Gravity)
[00:15.00] Floating above the atmosphere
[00:30.00] Pure stillness in the endless expanse
[00:45.00] Echoes of forgotten worlds
[01:00.00] Light bending through deep space
[01:15.00] Return to stillness`;

export const PRESET_SONGS: Song[] = [
  {
    id: 'song-arijit-midnight',
    title: 'Midnight Memories',
    artist: 'Arijit Singh',
    album: 'Noir Sessions Vol. I',
    artwork: ARTWORK.arijit,
    audioUrl: 'data:synth/arijit',
    duration: 180,
    bpm: 72,
    genre: 'Cinematic Soul',
    year: 2025,
    mood: 'sad',
    folderPath: 'music/Arijit Singh/Midnight Memories.mp3',
    playCount: 142,
    isFavorite: true,
    addedAt: '2025-01-15',
    lyrics: parseLRC(arijitLrc, 180),
    visualProfile: {
      mood: 'sad',
      energy: 35,
      warmth: 20,
      darkness: 85,
      nostalgia: 90,
      aggression: 10,
      romance: 65,
      primaryColor: '#1c232f',
      secondaryColor: '#4a5568',
      accentColor: '#93c5fd',
      particleStyle: 'rain',
      typographyStyle: 'serif-italic',
      visualMode: 'CINEMA'
    },
    songDna: {
      energy: 40,
      dance: 30,
      emotion: 95,
      nostalgia: 90,
      vocalClarity: 92,
      bassIntensity: 45,
      acousticness: 80
    },
    vibeCheck: {
      nostalgia: 92,
      heartbreak: 88,
      mainCharacterScore: 94,
      lateNightScore: 96,
      euphoria: 35,
      primaryVibeText: 'Midnight Solitude',
      summaryQuote: '"Walking through rainy glass reflections with headphones on."'
    },
    directorTimeline: generateDirectorTimeline('Midnight Memories', 'Arijit Singh', 180, 'sad', 8)
  },
  {
    id: 'song-weeknd-blinding',
    title: 'Blinding Echoes',
    artist: 'The Weeknd',
    album: 'After Hours Obsidian',
    artwork: ARTWORK.weeknd,
    audioUrl: 'data:synth/weeknd',
    duration: 210,
    bpm: 122,
    genre: 'Synthwave / Electronic',
    year: 2025,
    mood: 'energetic',
    folderPath: 'music/The Weeknd/Blinding Echoes.mp3',
    playCount: 289,
    isFavorite: true,
    addedAt: '2025-01-20',
    lyrics: parseLRC(weekndLrc, 210),
    visualProfile: {
      mood: 'energetic',
      energy: 92,
      warmth: 40,
      darkness: 70,
      nostalgia: 60,
      aggression: 75,
      romance: 50,
      primaryColor: '#311022',
      secondaryColor: '#9f1239',
      accentColor: '#fb7185',
      particleStyle: 'embers',
      typographyStyle: 'bold-editorial',
      visualMode: 'PARTICLE'
    },
    songDna: {
      energy: 92,
      dance: 88,
      emotion: 70,
      nostalgia: 65,
      vocalClarity: 85,
      bassIntensity: 90,
      acousticness: 10
    },
    vibeCheck: {
      nostalgia: 65,
      heartbreak: 45,
      mainCharacterScore: 98,
      lateNightScore: 90,
      euphoria: 94,
      primaryVibeText: 'High Voltage Speed',
      summaryQuote: '"Night drive through neon tunnels at 120 MPH."'
    },
    directorTimeline: generateDirectorTimeline('Blinding Echoes', 'The Weeknd', 210, 'energetic', 8)
  },
  {
    id: 'song-aujla-voltage',
    title: 'Soft Voltage',
    artist: 'Karan Aujla',
    album: 'Street Monolith',
    artwork: ARTWORK.aujla,
    audioUrl: 'data:synth/aujla',
    duration: 195,
    bpm: 94,
    genre: 'Punjabi Neo-HipHop',
    year: 2025,
    mood: 'raw',
    folderPath: 'music/Karan Aujla/Soft Voltage.mp3',
    playCount: 198,
    isFavorite: false,
    addedAt: '2025-02-01',
    lyrics: parseLRC(aujlaLrc, 195),
    visualProfile: {
      mood: 'raw',
      energy: 80,
      warmth: 30,
      darkness: 90,
      nostalgia: 40,
      aggression: 85,
      romance: 20,
      primaryColor: '#18181b',
      secondaryColor: '#3f3f46',
      accentColor: '#e4e4e7',
      particleStyle: 'geometric',
      typographyStyle: 'mono-space',
      visualMode: 'RAW'
    },
    songDna: {
      energy: 82,
      dance: 78,
      emotion: 60,
      nostalgia: 35,
      vocalClarity: 90,
      bassIntensity: 95,
      acousticness: 25
    },
    vibeCheck: {
      nostalgia: 40,
      heartbreak: 20,
      mainCharacterScore: 99,
      lateNightScore: 85,
      euphoria: 80,
      primaryVibeText: 'Unshakable Focus',
      summaryQuote: '"Heavy bass, zero noise, moving with quiet dominance."'
    },
    directorTimeline: generateDirectorTimeline('Soft Voltage', 'Karan Aujla', 195, 'raw', 8)
  },
  {
    id: 'song-kendrick-dna',
    title: 'DNA Continuum',
    artist: 'Kendrick Lamar',
    album: 'Architectural Flow',
    artwork: ARTWORK.kendrick,
    audioUrl: 'data:synth/kendrick',
    duration: 205,
    bpm: 108,
    genre: 'Experimental Hip-Hop',
    year: 2025,
    mood: 'dark',
    folderPath: 'music/Kendrick Lamar/DNA Continuum.mp3',
    playCount: 167,
    isFavorite: true,
    addedAt: '2025-02-04',
    lyrics: parseLRC(kendrickLrc, 205),
    visualProfile: {
      mood: 'dark',
      energy: 88,
      warmth: 15,
      darkness: 95,
      nostalgia: 50,
      aggression: 90,
      romance: 10,
      primaryColor: '#090a0f',
      secondaryColor: '#27272a',
      accentColor: '#a1a1aa',
      particleStyle: 'rays',
      typographyStyle: 'cinematic',
      visualMode: 'VOID'
    },
    songDna: {
      energy: 90,
      dance: 65,
      emotion: 75,
      nostalgia: 45,
      vocalClarity: 98,
      bassIntensity: 92,
      acousticness: 15
    },
    vibeCheck: {
      nostalgia: 45,
      heartbreak: 15,
      mainCharacterScore: 97,
      lateNightScore: 82,
      euphoria: 75,
      primaryVibeText: 'Lyrical Architecture',
      summaryQuote: '"Sharp precision, heavy sub frequencies in absolute dark."'
    },
    directorTimeline: generateDirectorTimeline('DNA Continuum', 'Kendrick Lamar', 205, 'dark', 6)
  },
  {
    id: 'song-ambient-celestial',
    title: 'Celestial Drift',
    artist: 'Aether Ensemble',
    album: 'Zero Gravity Vol. IV',
    artwork: ARTWORK.ambient,
    audioUrl: 'data:synth/ambient',
    duration: 240,
    bpm: 60,
    genre: 'Ambient / Space',
    year: 2025,
    mood: 'dreamy',
    folderPath: 'music/Ambient/Celestial Drift.mp3',
    playCount: 312,
    isFavorite: true,
    addedAt: '2025-02-10',
    lyrics: parseLRC(ambientLrc, 240),
    visualProfile: {
      mood: 'dreamy',
      energy: 15,
      warmth: 75,
      darkness: 60,
      nostalgia: 85,
      aggression: 0,
      romance: 80,
      primaryColor: '#0f172a',
      secondaryColor: '#1e293b',
      accentColor: '#38bdf8',
      particleStyle: 'stars',
      typographyStyle: 'serif-italic',
      visualMode: 'DREAM'
    },
    songDna: {
      energy: 15,
      dance: 10,
      emotion: 90,
      nostalgia: 95,
      vocalClarity: 40,
      bassIntensity: 30,
      acousticness: 90
    },
    vibeCheck: {
      nostalgia: 95,
      heartbreak: 30,
      mainCharacterScore: 85,
      lateNightScore: 100,
      euphoria: 82,
      primaryVibeText: 'Sublime Weightlessness',
      summaryQuote: '"Floating through deep space with stars bending light."'
    },
    directorTimeline: generateDirectorTimeline('Celestial Drift', 'Aether Ensemble', 240, 'dreamy', 5)
  }
];
