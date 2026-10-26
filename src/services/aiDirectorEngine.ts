import { SongDirectorScene, MoodType } from '../types';

export function generateDirectorTimeline(
  title: string,
  artist: string,
  duration: number,
  mood: MoodType,
  lyricsCount: number
): SongDirectorScene[] {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const introEnd = Math.min(20, duration * 0.1);
  const verse1End = Math.min(60, duration * 0.3);
  const chorus1End = Math.min(110, duration * 0.5);
  const bridgeEnd = Math.min(160, duration * 0.75);
  const chorus2End = Math.min(210, duration * 0.9);

  const moodDescriptions: Record<MoodType, string[]> = {
    sad: [
      `Dark room for '${title}' by ${artist}, desaturated rainfall particles drift downward. Slow camera tracking.`,
      `Minimalist text illumination across ${lyricsCount} lyric moments.`,
      "Subtle chromatic separation as vocals peak.",
      "Fragmented light particle drop at instrumental bridge.",
      "Gradual visual dissolve into black silence."
    ],
    romantic: [
      `Warm bokeh lighting for '${title}' with slow radial pulse.`,
      `Typography for ${artist} floats smoothly with golden light leaks.`,
      "Volumetric glow expands around central album artwork.",
      "Soft ember drift during vocal climax.",
      "Gentle atmospheric fade out."
    ],
    energetic: [
      `Aggressive stroboscopic pulse aligned to rhythm of ${title}.`,
      "High-contrast monochrome burst and particle acceleration.",
      "Volumetric laser rays flashing on high frequencies.",
      "Full spectrum visual distortion and camera shake on drop.",
      "Hyper-speed particle deceleration."
    ],
    nostalgic: [
      `Analog 35mm film grain with vintage sepia warmth for ${artist}.`,
      "Serif typography appearing like archival film subtitles.",
      "Soft horizontal scanning lines with VHS tape drift.",
      "Dust motes dancing in warm sunlight beam.",
      "Film burn transition into silence."
    ],
    dreamy: [
      `Volumetric nebula clouds drifting in zero gravity during '${title}'.`,
      "Spatial typography floating through atmospheric fog.",
      "Prismatic color shift responding to mid frequencies.",
      "Infinite depth particle tunnel zoom.",
      "Soft atmospheric fade."
    ],
    dark: [
      "High-contrast obsidian shadows with minimal backlight.",
      "Sharp geometric contours pulsing to low-end bass.",
      "Vaporous smoke rising from bottom viewport.",
      "Aggressive silhouette bloom during chorus.",
      "Collapse into void black."
    ],
    happy: [
      `Bright daylight illumination with kinetic particle sparkles for ${title}.`,
      "Vibrant typography bouncing on every beat.",
      "Radial rainbow wave expanding from audio spectrum.",
      "Exuberant particle fireworks on chorus peak.",
      "Warm golden glow coda."
    ],
    raw: [
      `Stark digital monochrome glitch performance for ${artist}.`,
      "Monochrome contrast pulse with heavy audio distortion visual.",
      "Sub-bass visual camera shaking.",
      "Raw waveforms expanding past viewport borders.",
      "Instant visual cutoff."
    ]
  };

  const scenes = moodDescriptions[mood] || moodDescriptions.sad;

  return [
    {
      timestamp: 0,
      timeFormatted: "00:00",
      title: "Prelude: Ambient Atmosphere",
      description: scenes[0],
      visualEffect: "Atmospheric Fade In",
      cameraMotion: "Slow Forward Drift",
      intensity: 20
    },
    {
      timestamp: Math.floor(introEnd),
      timeFormatted: formatTime(introEnd),
      title: "Verse I: Lyrical Awakening",
      description: scenes[1],
      visualEffect: "Typographic Resonance",
      cameraMotion: "Static Focused View",
      intensity: 40
    },
    {
      timestamp: Math.floor(verse1End),
      timeFormatted: formatTime(verse1End),
      title: "Chorus: Harmonic Expansion",
      description: scenes[2],
      visualEffect: "Volumetric Bloom",
      cameraMotion: "Subtle Kinetic Orbit",
      intensity: 85
    },
    {
      timestamp: Math.floor(chorus1End),
      timeFormatted: formatTime(chorus1End),
      title: "Bridge: Instrumental Spectrum",
      description: scenes[3],
      visualEffect: "Particle Acceleration",
      cameraMotion: "Dynamic Depth Zoom",
      intensity: 95
    },
    {
      timestamp: Math.floor(bridgeEnd),
      timeFormatted: formatTime(bridgeEnd),
      title: "Climax: Full Resonance",
      description: "Maximum synchronization between bass pulse and visual canvas.",
      visualEffect: "Spectral Flash & Shake",
      cameraMotion: "Rhythmic Camera Kick",
      intensity: 100
    },
    {
      timestamp: Math.floor(chorus2End),
      timeFormatted: formatTime(chorus2End),
      title: "Outro: Dissolve to Stillness",
      description: scenes[4],
      visualEffect: "Grain Dissolve",
      cameraMotion: "Slow Pull-Back",
      intensity: 15
    }
  ];
}
