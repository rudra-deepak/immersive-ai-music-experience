import { Song, Playlist, User } from '../types';
import { PRESET_SONGS } from './presetSongs';

const STORAGE_KEYS = {
  SONGS: 'valence_songs_v1',
  PLAYLISTS: 'valence_playlists_v1',
  USER: 'valence_user_v1',
  FAVORITES: 'valence_favorites_v1',
  HISTORY: 'valence_history_v1'
};

export class DbService {
  public static getSongs(): Song[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.SONGS);
      if (!stored) {
        localStorage.setItem(STORAGE_KEYS.SONGS, JSON.stringify(PRESET_SONGS));
        return PRESET_SONGS;
      }
      const customSongs: Song[] = JSON.parse(stored);
      // Merge preset songs with custom songs ensuring no duplicate IDs
      const map = new Map<string, Song>();
      PRESET_SONGS.forEach((s) => map.set(s.id, s));
      customSongs.forEach((s) => map.set(s.id, s));
      return Array.from(map.values());
    } catch {
      return PRESET_SONGS;
    }
  }

  public static saveSong(song: Song): Song[] {
    const songs = this.getSongs();
    const idx = songs.findIndex((s) => s.id === song.id);
    if (idx >= 0) {
      songs[idx] = song;
    } else {
      songs.unshift(song);
    }
    localStorage.setItem(STORAGE_KEYS.SONGS, JSON.stringify(songs));
    return songs;
  }

  public static toggleFavorite(songId: string): Song[] {
    const songs = this.getSongs();
    const song = songs.find((s) => s.id === songId);
    if (song) {
      song.isFavorite = !song.isFavorite;
      this.saveSong(song);
    }
    return songs;
  }

  public static getPlaylists(): Playlist[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.PLAYLISTS);
      if (!stored) {
        const defaultPlaylists: Playlist[] = [
          {
            id: 'pl-late-night',
            name: 'Late Night Noir',
            description: 'Atmospheric sonic landscape for deep focus after midnight.',
            coverArt: PRESET_SONGS[0].artwork,
            songIds: ['song-arijit-midnight', 'song-ambient-celestial'],
            createdAt: new Date().toISOString()
          },
          {
            id: 'pl-high-voltage',
            name: 'Kinetic Energy',
            description: 'Unfiltered adrenaline, heavy bass, and high-frequency velocity.',
            coverArt: PRESET_SONGS[1].artwork,
            songIds: ['song-weeknd-blinding', 'song-aujla-voltage', 'song-kendrick-dna'],
            createdAt: new Date().toISOString()
          }
        ];
        localStorage.setItem(STORAGE_KEYS.PLAYLISTS, JSON.stringify(defaultPlaylists));
        return defaultPlaylists;
      }
      return JSON.parse(stored);
    } catch {
      return [];
    }
  }

  public static savePlaylist(playlist: Playlist): Playlist[] {
    const playlists = this.getPlaylists();
    const idx = playlists.findIndex((p) => p.id === playlist.id);
    if (idx >= 0) {
      playlists[idx] = playlist;
    } else {
      playlists.unshift(playlist);
    }
    localStorage.setItem(STORAGE_KEYS.PLAYLISTS, JSON.stringify(playlists));
    return playlists;
  }

  public static getUser(): User | null {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.USER);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  }

  public static setUser(user: User | null) {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.USER);
    }
  }

  public static recordPlayHistory(songId: string) {
    try {
      const historyStr = localStorage.getItem(STORAGE_KEYS.HISTORY);
      const history: string[] = historyStr ? JSON.parse(historyStr) : [];
      const updated = [songId, ...history.filter((id) => id !== songId)].slice(0, 30);
      localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(updated));
    } catch (e) {
      console.warn('Failed to save history', e);
    }
  }
}
