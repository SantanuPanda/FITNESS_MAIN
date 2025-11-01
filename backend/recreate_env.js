import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create a fresh .env file with the correct settings
const envContent = `# Server Configuration
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://ADMIN:Dyi5HSNTHNdiV0QD@test.doecbiu.mongodb.net/fitness

# JWT Configuration
JWT_SECRET=r6s9ji8ngmqfartokml04g

# Email Configuration (Production)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=santanupanda445@gmail.com
EMAIL_PASSWORD=hidu xvac vqxd unpo
EMAIL_FROM=santanupanda445@gmail.com
`;

// Write to .env file
fs.writeFileSync(path.join(__dirname, '.env'), envContent);

console.log('✅ .env file has been recreated with MongoDB Atlas connection string');
console.log('Your application is now configured to use the MongoDB Atlas database'); 