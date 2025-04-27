import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to the index.html file
const indexPath = path.join(__dirname, 'index.html');

// Read the current content of index.html
let htmlContent = fs.readFileSync(indexPath, 'utf8');

// Check if the script is already included
if (!htmlContent.includes('force-production.js')) {
  // Find the position to insert our script - right after the <head> tag
  const headPosition = htmlContent.indexOf('<head>') + 6;
  
  // Insert the script tag
  const scriptTag = '\n  <script src="/force-production.js"></script>';
  htmlContent = htmlContent.slice(0, headPosition) + scriptTag + htmlContent.slice(headPosition);
  
  // Write the modified content back to index.html
  fs.writeFileSync(indexPath, htmlContent);
  console.log('✅ Added production mode script to index.html');
} else {
  console.log('⚠️ Production mode script is already included in index.html');
}

console.log('\nYour frontend is now configured to use production mode and will send real emails');
console.log('To start the development server with production settings, run:');
console.log('npm run dev'); 