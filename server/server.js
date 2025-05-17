import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import ffmpeg from 'fluent-ffmpeg';
import ffmpegStatic from 'ffmpeg-static';
import { createRequire } from 'module';

// Use createRequire to handle CommonJS modules
const require = createRequire(import.meta.url);

// Set up ffmpeg path
ffmpeg.setFfmpegPath(ffmpegStatic);

// Try to import ffprobe-static for the ffprobe path
try {
  // Import ffprobe-static for the ffprobe path
  const ffprobeStatic = require('ffprobe-static');
  ffmpeg.setFfprobePath(ffprobeStatic.path);
  console.log('ffprobe path set successfully');
} catch (error) {
  console.warn('Warning: ffprobe-static not found. Some functionality may be limited.');
  // Try to continue without ffprobe
}

// Environment variables
const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

// ES module fix for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Create processed directory if it doesn't exist
const processedDir = path.join(__dirname, 'processed');
if (!fs.existsSync(processedDir)) {
  fs.mkdirSync(processedDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 15 * 1024 * 1024 }, // 15MB limit
  fileFilter: function (req, file, cb) {
    // Accept only audio files
    if (file.mimetype.startsWith('audio/')) {
      cb(null, true);
    } else {
      cb(new Error('Only audio files are allowed!'), false);
    }
  }
});

// Initialize Express app
const app = express();

// Middleware
// In production, allow requests from any origin since frontend and backend are on the same domain
// In development, only allow requests from the specified CLIENT_URL
app.use(cors({
  origin: process.env.NODE_ENV === 'production' ? '*' : CLIENT_URL,
  credentials: true
}));
app.use(express.json());
app.use('/processed', express.static(processedDir));

// Let's skip the noise generation and use a simpler approach
// Instead of generating a noise file, we'll apply the lofi effects directly to the input file
const processAudio = async (inputFile, outputFile) => {
  return new Promise((resolve, reject) => {
    ffmpeg(inputFile)
      // Apply a subtle pitch shift
      .audioFilters('asetrate=44100*0.95')
      // Add a gentle reverb (less echo than before)
      .audioFilters('areverse,aecho=0.5:0.3:20:0.3,areverse')
      // Apply EQ for lofi sound
      .audioFilters('equalizer=f=60:width_type=h:width=50:g=2')  // Boost bass slightly
      .audioFilters('equalizer=f=1000:width_type=h:width=100:g=-2')  // Cut some mids
      .audioFilters('equalizer=f=3000:width_type=h:width=100:g=-1')  // Gentle high cut
      .audioFilters('equalizer=f=10000:width_type=h:width=100:g=-3')  // More high cut
      // Apply a subtle warming effect
      .audioFilters('bass=g=2:f=100:w=0.5')
      // Apply a gentle low-pass filter for that lofi feel
      .audioFilters('lowpass=f=4000')
      // Output format with higher quality
      .audioCodec('libmp3lame')
      .audioBitrate('192k')
      .output(outputFile)
      .on('end', () => resolve())
      .on('error', (err) => reject(err))
      .run();
  });
};

// Create a directory for example songs if it doesn't exist
const exampleSongsDir = path.join(__dirname, 'example-songs');
if (!fs.existsSync(exampleSongsDir)) {
  fs.mkdirSync(exampleSongsDir, { recursive: true });
}

// Copy example songs from client assets to server if they don't exist
const copyExampleSongs = async () => {
  const clientAssetsDir = path.join(__dirname, '../client/src/assets');
  const songs = [
    'Aaruyire (PenduJatt.Com.Se).mp3',
    'Marudaani (PenduJatt.Com.Se).mp3',
    'Nenjukkule (PenduJatt.Com.Se).mp3'
  ];

  for (const song of songs) {
    const sourcePath = path.join(clientAssetsDir, song);
    const destPath = path.join(exampleSongsDir, song);

    if (!fs.existsSync(destPath) && fs.existsSync(sourcePath)) {
      fs.copyFileSync(sourcePath, destPath);
      console.log(`Copied ${song} to example-songs directory`);
    }
  }
};

// Call the function to copy example songs
copyExampleSongs().catch(err => console.error('Error copying example songs:', err));

// Routes
// Endpoint for lofi preview of example songs
app.get('/api/lofi-preview', async (req, res) => {
  const songName = req.query.song;
  if (!songName) {
    return res.status(400).json({ error: 'No song specified' });
  }

  let songFileName;
  switch (songName.toLowerCase()) {
    case 'aaruyire':
      songFileName = 'Aaruyire (PenduJatt.Com.Se).mp3';
      break;
    case 'marudaani':
      songFileName = 'Marudaani (PenduJatt.Com.Se).mp3';
      break;
    case 'nenjukulle':
      songFileName = 'Nenjukkule (PenduJatt.Com.Se).mp3';
      break;
    default:
      return res.status(404).json({ error: 'Song not found' });
  }

  const inputFile = path.join(exampleSongsDir, songFileName);
  const outputFileName = `lofi_${songFileName}`;
  const outputFile = path.join(processedDir, outputFileName);

  // Check if the lofi version already exists
  if (fs.existsSync(outputFile)) {
    return res.sendFile(outputFile);
  }

  // Process the audio file
  try {
    await processAudio(inputFile, outputFile);
    console.log(`Lofi preview generated for ${songFileName}`);
    res.sendFile(outputFile);
  } catch (err) {
    console.error(`Error processing lofi preview for ${songFileName}:`, err);
    res.status(500).json({ error: 'Error processing audio' });
  }
});

// Main conversion endpoint
app.post('/api/convert', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  try {
    const inputFile = req.file.path;
    const outputFileName = 'lofi_' + path.basename(inputFile);
    const outputFile = path.join(processedDir, outputFileName);

    // Process the audio file
    try {
      await processAudio(inputFile, outputFile);

      console.log('Processing finished successfully');
      // Clean up the uploaded file
      try {
        fs.unlinkSync(inputFile);
      } catch (err) {
        console.error('Error deleting input file:', err);
      }

      // Send the processed file
      res.download(outputFile, outputFileName, (err) => {
        if (err) {
          console.error('Error sending file:', err);
        } else {
          // Clean up the processed file after sending
          setTimeout(() => {
            try {
              fs.unlinkSync(outputFile);
            } catch (err) {
              console.error('Error deleting processed file:', err);
            }
          }, 1000);
        }
      });
    } catch (err) {
      console.error('Error processing audio:', err);
      // Clean up any temp files
      try {
        if (fs.existsSync(inputFile)) fs.unlinkSync(inputFile);
      } catch (cleanupErr) {
        console.error('Error cleaning up temp files:', cleanupErr);
      }
      res.status(500).json({ error: 'Error processing audio' });
    }
  } catch (error) {
    console.error('Error in conversion process:', error);
    res.status(500).json({ error: 'Error processing audio' });
  }
});

// Serve static files from the React app in production
if (process.env.NODE_ENV === 'production') {
  const clientBuildPath = path.join(__dirname, '../client/dist');
  app.use(express.static(clientBuildPath));

  app.get('*', (req, res) => {
    res.sendFile(path.join(clientBuildPath, 'index.html'));
  });
}

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Accepting requests from: ${CLIENT_URL}`);
  console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
  console.log(`Current working directory: ${process.cwd()}`);
});
