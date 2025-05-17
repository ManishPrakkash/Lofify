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

## Deployment Instructions

### Backend Deployment (Railway)

1. Create a new project on [Railway](https://railway.app)
2. Connect your GitHub repository
3. Configure the deployment:
   - Root directory: `server`
   - Start command: `node server.js`
4. Add the following environment variables:
   - `PORT`: 5000 (or let Railway set it automatically)
   - `CLIENT_URL`: Your Vercel app URL (after deploying the frontend)

### Frontend Deployment (Vercel)

1. Push your code to a GitHub repository
2. Create a new project on [Vercel](https://vercel.com)
3. Import your GitHub repository
4. Configure the project:
   - Framework preset: Vite
   - Root directory: `client`
   - Build command: `npm run build`
   - Output directory: `dist`
5. Add the following environment variables:
   - `VITE_API_URL`: Your Railway app URL (after deploying the backend)

## License

MIT
