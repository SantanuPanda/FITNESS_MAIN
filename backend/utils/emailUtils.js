import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Create a transporter object
let transporter;
let testAccount;

// Initialize the email transporter
const initTransporter = async () => {
  // In development or if no email credentials provided, use Ethereal for testing
  if (process.env.NODE_ENV !== 'production' || !process.env.EMAIL_HOST) {
    // Create a test account
    testAccount = await nodemailer.createTestAccount();
    console.log('Created Ethereal test account:', testAccount.user);
    
    // Create a test transporter
    transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
    
    console.log('Using Ethereal email for testing. Check console for preview URLs.');
  } else {
    // Use configured email service for production
    transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT || 587,
      secure: process.env.EMAIL_SECURE === 'true',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
    console.log('Using production email configuration');
  }
};

// Initialize transporter on module load
initTransporter().catch(console.error);

// Function to send verification code email
export const sendVerificationEmail = async (to, code) => {
  try {
    // Ensure transporter is initialized
    if (!transporter) {
      await initTransporter();
    }
    
    // Email options
    const mailOptions = {
      from: process.env.EMAIL_FROM || '"Fitness App" <no-reply@fitness-app.com>',
      to,
      subject: 'Your Verification Code',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4f46e5;">Fitness App Verification</h2>
          <p>Your verification code is:</p>
          <div style="background-color: #f3f4f6; padding: 15px; border-radius: 5px; text-align: center; margin: 20px 0;">
            <span style="font-size: 24px; font-weight: bold; letter-spacing: 5px;">${code}</span>
          </div>
          <p>This code will expire in 10 minutes.</p>
          <p>If you didn't request this code, please ignore this email.</p>
        </div>
      `,
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);
    
    console.log('Verification email sent: %s', info.messageId);
    
    // For development, log the test URL (only works with Ethereal)
    if (testAccount) {
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    }
    
    return true;
  } catch (error) {
    console.error('Error sending verification email:', error);
    return false;
  }
};

// Function to send password reset email
export const sendPasswordResetEmail = async (to, code) => {
  try {
    // Ensure transporter is initialized
    if (!transporter) {
      await initTransporter();
    }
    
    // Email options
    const mailOptions = {
      from: process.env.EMAIL_FROM || '"Fitness App" <no-reply@fitness-app.com>',
      to,
      subject: 'Password Reset Request',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4f46e5;">Fitness App Password Reset</h2>
          <p>We received a request to reset your password. Here is your verification code:</p>
          <div style="background-color: #f3f4f6; padding: 15px; border-radius: 5px; text-align: center; margin: 20px 0;">
            <span style="font-size: 24px; font-weight: bold; letter-spacing: 5px;">${code}</span>
          </div>
          <p>This code will expire in 10 minutes.</p>
          <p>If you didn't request this password reset, please ignore this email.</p>
        </div>
      `,
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);
    
    console.log('Password reset email sent: %s', info.messageId);
    
    // For development, log the test URL (only works with Ethereal)
    if (testAccount) {
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    }
    
    return true;
  } catch (error) {
    console.error('Error sending password reset email:', error);
    return false;
  }
}; 