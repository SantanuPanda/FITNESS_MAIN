import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create .env.production file with production settings
const envContent = `# API URL - Set to your backend URL
VITE_API_URL=http://localhost:5000/api
VITE_ENV=production
`;

// Write to .env.production file
fs.writeFileSync(path.join(__dirname, '.env.production'), envContent);

console.log('✅ Frontend production environment settings created');
console.log('To build for production, run:');
console.log('npm run build');
console.log('\nThe frontend will now use the real backend API for email verification.');

// Create a file that forces production mode for development
const devContent = `// This file is used to force production mode for testing in development
window.process = { env: { NODE_ENV: 'production' } };
`;

// Write to public/force-production.js
const publicDir = path.join(__dirname, 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir);
}
fs.writeFileSync(path.join(publicDir, 'force-production.js'), devContent);

console.log('\n✅ Created force-production.js script');
console.log('Include this script in your HTML to force production mode for testing.'); 