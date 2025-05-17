import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// ES module fix for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Directories to ensure exist
const dirs = [
  path.join(__dirname, 'uploads'),
  path.join(__dirname, 'processed'),
  path.join(__dirname, 'example-songs')
];

// Create directories if they don't exist
dirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    console.log(`Creating directory: ${dir}`);
    fs.mkdirSync(dir, { recursive: true });
  } else {
    console.log(`Directory already exists: ${dir}`);
  }
});

console.log('All required directories have been created.');
