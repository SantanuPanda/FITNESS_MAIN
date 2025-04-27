import dotenv from 'dotenv';
import { sendVerificationEmail } from './utils/emailUtils.js';
import readline from 'readline';

// Load environment variables
dotenv.config();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('Email Configuration Test');
console.log('------------------------');
console.log('Current Settings:');
console.log(`NODE_ENV: ${process.env.NODE_ENV || 'Not set (default: development)'}`);
console.log(`EMAIL_HOST: ${process.env.EMAIL_HOST || 'Not set (using Ethereal)'}`);
console.log(`EMAIL_USER: ${process.env.EMAIL_USER || 'Not set'}`);
console.log(`EMAIL_FROM: ${process.env.EMAIL_FROM || 'Not set (using default)'}`);
console.log('------------------------\n');

// Generate random OTP
const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const testEmail = async (recipient) => {
  try {
    console.log(`Sending test verification code to: ${recipient}`);
    const otp = generateOtp();
    console.log(`Generated OTP: ${otp}`);
    
    // Send the email
    const result = await sendVerificationEmail(recipient, otp);
    
    if (result) {
      console.log('\n✅ Email sent successfully!');
      
      if (process.env.NODE_ENV !== 'production') {
        console.log('Check your console for the Ethereal preview URL.');
      } else {
        console.log(`Check the inbox of ${recipient} for the verification code.`);
      }
    } else {
      console.log('\n❌ Failed to send email. Check your email configuration.');
    }
  } catch (error) {
    console.error('Error sending email:', error);
  } finally {
    rl.close();
  }
};

rl.question('Enter recipient email address: ', (email) => {
  testEmail(email);
});

// Handle CTRL+C
rl.on('SIGINT', () => {
  console.log('\nTest cancelled');
  rl.close();
  process.exit(0);
}); 