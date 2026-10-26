import { LyricLine, LyricWord } from '../types';

const EMOTION_DICTIONARY: Record<string, string[]> = {
  sadness: ['lonely', 'crying', 'tears', 'alone', 'broken', 'hurt', 'pain', 'fade', 'darkness', 'sad', 'empty', 'loss'],
  romance: ['love', 'heart', 'kiss', 'touch', 'hold', 'forever', 'desire', 'eyes', 'beautiful', 'warmth', 'embrace'],
  nostalgia: ['remember', 'past', 'yesterday', 'used to', 'time', 'years', 'old', 'memory', 'still', 'starlight', 'photo'],
  tension: ['mistake', 'run', 'fire', 'burn', 'fear', 'crash', 'wild', 'chase', 'fall', 'chaos', 'shadow', 'edge'],
  energy: ['electric', 'voltage', 'rhythm', 'pulse', 'dance', 'lights', 'surge', 'speed', 'louder', 'power', 'beat'],
  nature: ['rain', 'ocean', 'river', 'sky', 'stars', 'wind', 'sun', 'water', 'breathe', 'earth', 'storm']
};

export function parseLRC(lrcText: string, songDuration: number = 240): LyricLine[] {
  const lines = lrcText.split(/\r?\n/);
  const parsedLines: LyricLine[] = [];
  const timeRegex = /\[(\d{2}):(\d{2})\.(\d{2,3})\]/;

  lines.forEach((line, index) => {
    const match = timeRegex.exec(line);
    if (match) {
      const minutes = parseInt(match[1], 10);
      const seconds = parseInt(match[2], 10);
      const milliseconds = parseInt(match[3].padEnd(3, '0'), 10);
      const time = minutes * 60 + seconds + milliseconds / 1000;
      const text = line.replace(/\[\d{2}:\d{2}\.\d{2,3}\]/g, '').trim();

      if (text) {
        const emotion = detectEmotion(text);
        const words = createWordTimestamps(text, time);

        parsedLines.push({
          id: `lyric-${index}-${Math.random().toString(36).substr(2, 5)}`,
          time,
          text,
          words,
          emotion
        });
      }
    }
  });

  // Calculate line end times
  for (let i = 0; i < parsedLines.length; i++) {
    if (i < parsedLines.length - 1) {
      parsedLines[i].endTime = parsedLines[i + 1].time;
    } else {
      parsedLines[i].endTime = songDuration;
    }
  }

  return parsedLines.sort((a, b) => a.time - b.time);
}

export function parsePlainTextLyrics(rawText: string, duration: number): LyricLine[] {
  const rawLines = rawText
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  if (rawLines.length === 0) return [];

  const interval = Math.max(3, duration / (rawLines.length + 1));
  
  return rawLines.map((text, idx) => {
    const time = (idx + 1) * interval;
    const emotion = detectEmotion(text);
    return {
      id: `lyric-plain-${idx}`,
      time,
      endTime: time + interval,
      text,
      words: createWordTimestamps(text, time, interval),
      emotion
    };
  });
}

function detectEmotion(text: string): string {
  const lower = text.toLowerCase();
  for (const [emotion, keywords] of Object.entries(EMOTION_DICTIONARY)) {
    if (keywords.some((word) => lower.includes(word))) {
      return emotion;
    }
  }
  return 'neutral';
}

function createWordTimestamps(text: string, lineStartTime: number, lineDuration: number = 4.5): LyricWord[] {
  const words = text.split(/\s+/);
  const wordDuration = lineDuration / words.length;

  return words.map((word, idx) => {
    const cleanWord = word.replace(/[^\w\s]/gi, '').toLowerCase();
    let wordEmotion: string | undefined = undefined;
    for (const [emotion, keywords] of Object.entries(EMOTION_DICTIONARY)) {
      if (keywords.includes(cleanWord)) {
        wordEmotion = emotion;
        break;
      }
    }

    const startTime = lineStartTime + idx * wordDuration;
    return {
      word,
      startTime,
      endTime: startTime + wordDuration,
      emotion: wordEmotion
    };
  });
}

export function getCurrentLyricLine(lyrics: LyricLine[], currentTime: number): LyricLine | null {
  if (!lyrics || lyrics.length === 0) return null;
  return lyrics.find((line) => currentTime >= line.time && currentTime < (line.endTime || line.time + 6)) || null;
}
