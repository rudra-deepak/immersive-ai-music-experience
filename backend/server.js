/**
 * VALENCE — Backend Server (Express + MongoDB)
 * 
 * Instructions to run:
 * 1. Ensure MongoDB is running locally (or supply MONGODB_URI)
 * 2. cd backend && npm install && npm start
 * 
 * Default PORT: 5000
 */

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/valence_db';

// MongoDB Connection
mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('✓ Connected to MongoDB database (valence_db)'))
  .catch((err) => console.warn('MongoDB notice (Running in offline fallback mode):', err.message));

// User Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  listeningArchetype: { type: String, default: 'The Midnight Architect' },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

// Track Schema
const trackSchema = new mongoose.Schema({
  title: String,
  artist: String,
  album: String,
  artwork: String,
  duration: Number,
  bpm: Number,
  genre: String,
  mood: String,
  folderPath: String,
  lyrics: Array,
  visualProfile: Object,
  songDna: Object,
  vibeCheck: Object,
  playCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

const Track = mongoose.model('Track', trackSchema);

// API Routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }
    const user = new User({ name, email, password });
    await user.save();
    res.json({ success: true, user: { id: user._id, name: user.name, email: user.email, listeningArchetype: user.listeningArchetype } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email, password });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    res.json({ success: true, user: { id: user._id, name: user.name, email: user.email, listeningArchetype: user.listeningArchetype } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/tracks', async (req, res) => {
  try {
    const tracks = await Track.find().sort({ createdAt: -1 });
    res.json({ tracks });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Scan /music/ directory endpoint
app.post('/api/scan', (req, res) => {
  const musicDir = path.join(__dirname, '../music');
  let discovered = [];

  function scanDir(dir) {
    if (!fs.existsSync(dir)) return;
    const files = fs.readdirSync(dir);
    files.forEach(file => {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        scanDir(fullPath);
      } else if (/\.(mp3|wav|ogg|m4a|flac)$/i.test(file)) {
        discovered.push({
          fileName: file,
          fullPath,
          relPath: path.relative(path.join(__dirname, '..'), fullPath)
        });
      }
    });
  }

  scanDir(musicDir);
  res.json({ success: true, total: discovered.length, files: discovered });
});

app.listen(PORT, () => {
  console.log(`VALENCE API server running on port ${PORT}`);
});
