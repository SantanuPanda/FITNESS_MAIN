import fs from 'fs';
import readline from 'readline';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Default config template
const configTemplate = `# Server Configuration
NODE_ENV=production
PORT=5000

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/fitness

# JWT Configuration
JWT_SECRET=YOUR_JWT_SECRET

# Email Configuration (Production)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=YOUR_EMAIL
EMAIL_PASSWORD=YOUR_APP_PASSWORD
EMAIL_FROM=YOUR_EMAIL
`;

console.log('Setting up production environment for Fitness App');
console.log('------------------------------------------------');
console.log('You need a Gmail account with 2-Step Verification enabled and an App Password');
console.log('If you haven\'t set this up, please do so before continuing');
console.log('Visit: https://myaccount.google.com/security');
console.log('------------------------------------------------\n');

rl.question('Enter your Gmail address: ', (email) => {
  rl.question('Enter your Gmail App Password: ', (password) => {
    rl.question('Enter a secure JWT secret (or press Enter to generate one): ', (jwtSecret) => {
      // Generate a random JWT secret if not provided
      if (!jwtSecret) {
        jwtSecret = Math.random().toString(36).substring(2, 15) + 
                   Math.random().toString(36).substring(2, 15);
        console.log(`Generated JWT secret: ${jwtSecret}`);
      }

      // Create the .env content
      let envContent = configTemplate
        .replace(/YOUR_EMAIL/g, email) // Replace all occurrences of YOUR_EMAIL
        .replace('YOUR_APP_PASSWORD', password)
        .replace('YOUR_JWT_SECRET', jwtSecret);

      // Write to .env file
      fs.writeFileSync(path.join(__dirname, '.env'), envContent);
      
      console.log('\n✅ Production environment setup complete!');
      console.log('A new .env file has been created with your settings.');
      console.log('\nTo start the server in production mode, run:');
      console.log('npm start');
      
      rl.close();
    });
  });
});

// Handle CTRL+C
rl.on('SIGINT', () => {
  console.log('\nSetup cancelled');
  rl.close();
  process.exit(0);
}); 