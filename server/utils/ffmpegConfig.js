import ffmpeg from 'fluent-ffmpeg';
import ffmpegStatic from 'ffmpeg-static';

// Set the path to the FFmpeg binary
ffmpeg.setFfmpegPath(ffmpegStatic);

export { ffmpeg };
