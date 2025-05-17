# Lofify - Lofi Audio Converter

Lofify is a full-stack web application that allows users to upload MP3/WAV files, convert them into lofi versions using audio filters, and download the processed files.

## Features

- Upload MP3/WAV audio files
- Convert audio to lofi style with various audio effects
- Preview the converted audio
- Download the processed lofi version
- Listen to example tracks with toggle between original and lofi versions

## Tech Stack

- **Frontend**: React (Vite), Tailwind CSS, Framer Motion
- **Backend**: Node.js, Express
- **Audio Processing**: FFmpeg

## Project Structure

```
lofify/
├── client/                 # Frontend React application
│   ├── public/             # Static assets
│   ├── src/                # React source code
│   │   ├── components/     # React components
│   │   │   ├── ui/         # UI components
│   │   ├── lib/            # Utility functions
│   │   ├── App.jsx         # Main App component
│   │   └── main.jsx        # Entry point
│   ├── index.html          # HTML template
│   ├── package.json        # Frontend dependencies
│   └── vite.config.js      # Vite configuration
└── server/                 # Backend Node.js application
    ├── uploads/            # Temporary storage for uploaded files
    ├── processed/          # Temporary storage for processed files
    ├── utils/              # Utility functions
    ├── server.js           # Express server
    └── package.json        # Backend dependencies
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- FFmpeg (installed automatically via dependencies)

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/lofify.git
   cd lofify
   ```

2. Install backend dependencies:
   ```
   cd server
   npm install
   ```

3. Install frontend dependencies:
   ```
   cd ../client
   npm install
   ```

### Running the Application

1. Start the backend server:
   ```
   cd server
   npm run dev
   ```

2. In a separate terminal, start the frontend development server:
   ```
   cd client
   npm run dev
   ```

3. Open your browser and navigate to `http://localhost:5173`

## Building for Production

1. Build the frontend:
   ```
   cd client
   npm run build
   ```

2. Start the production server:
   ```
   cd ../server
   npm start
   ```

## License

MIT
