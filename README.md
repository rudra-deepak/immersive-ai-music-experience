# VALENCE — Kinetic Audio & Lyric Intelligence

> **A production-quality, radically original music web application.**
> Sound is not played — sound is experienced.

---

## 1. CORE IDEA & VISUAL INTELLIGENCE ENGINE

Valence turns every audio track into a dynamic 60 FPS visual experience.

Instead of hardcoded visual templates, Valence includes a **Reusable Visual Intelligence Engine** that analyzes:
* Real-time Web Audio API frequencies, sub-bass pressure, mids, treble, and kick beats
* Sentiment & emotional keywords from lyrics
* Song metadata (BPM, Mood, Genre)

ONE ENGINE → INFINITE SONG EXPERIENCES.

---

## 2. ZERO-HASSLE LOCAL MUSIC IMPORT (`/music/`)

You can directly add your own music into the local project library without modifying code:

```text
VALENCE-PROJECT/
├── music/
│   ├── Arijit Singh/
│   │   ├── Midnight Memories.mp3
│   │   └── Midnight Memories.lrc
│   ├── The Weeknd/
│   │   ├── Blinding Echoes.mp3
│   │   └── Blinding Echoes.lrc
│   ├── Karan Aujla/
│   │   ├── Soft Voltage.mp3
│   │   └── Soft Voltage.lrc
│   └── Kendrick Lamar/
│       └── DNA Continuum.mp3
```

### Workflow:
1. Copy any legally obtained `.mp3`, `.wav`, `.flac`, or `.ogg` file into the `music/` folder.
2. (Optional) Place a matching `.lrc` file with the same filename in the same folder.
3. Open Valence and click **"FOLDER SCAN"** or **"SCAN LOCAL /music/"**.
4. The Scanner reads metadata, pairs `.lrc` lyrics, synthesizes a dynamic `VisualProfile`, and adds the song to the library automatically.

---

## 3. FEATURES

* **8 Cinematic Visual Modes**: `CINEMA`, `VOID`, `ARCHIVE`, `DREAM`, `RAW`, `NATURE`, `TYPOGRAPHIC`, `PARTICLE`.
* **AI Song Director ("Director Mode")**: Dynamic visual timeline generator for any track.
* **Gen-Z Vibe Check**: Emotional breakdown radar (% nostalgia, % heartbreak, % main character energy).
* **Main Character Mode**: Translucent full-viewport immersive experience.
* **Lyric Poster Studio**: Select any lyric phrase and create editorial shareable posters.
* **Song DNA**: Experimental spectral breakdown of bass, vocal clarity, and acousticness.
* **Express & MongoDB Backend**: Express REST server for MongoDB authentication and track storage in `backend/server.js`.

---

## 4. GETTING STARTED

### Client App:
```bash
npm install
npm run dev
```

### Optional Express / MongoDB Backend:
```bash
cd backend
npm install
npm start
```

---

## 5. KEYBOARD SHORTCUTS

* `SPACE` — Play / Pause current track
* `CMD + K` — Command Search (Tracks & Visual Modes)
* `M` — Mute / Unmute
* `L` — Toggle Lyric Overlay
* `D` — AI Director Mode Timeline
"# immersive-ai-music-experience" 
