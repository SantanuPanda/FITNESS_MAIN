import User from '../models/userModel.js';
import OTP from '../models/otpModel.js';
import jwt from 'jsonwebtoken';
import { sendVerificationEmail, sendPasswordResetEmail } from '../utils/emailUtils.js';

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback_secret', {
    expiresIn: '30d',
  });
};

// Generate temporary token for password reset (expires in 10 minutes)
const generateTempToken = (email) => {
  return jwt.sign({ email }, process.env.JWT_SECRET || 'fallback_secret', {
    expiresIn: '10m',
  });
};

// Generate random 6-digit OTP
const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res) => {
  try {
    console.log('Auth register request received:', req.body);
    const { name, email, password, role } = req.body;

    // Validation
    if (!name || !email || !password) {
      console.log('Missing required fields');
      return res.status(400).json({ message: 'Please provide name, email and password' });
    }

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      console.log('User already exists:', email);
      return res.status(400).json({ message: 'User already exists' });
    }

    // Prepare user data
    const userData = {
      name,
      email,
      password,
    };

    // Add role if provided
    if (role) {
      console.log('Setting user role:', role);
      userData.role = role;
    }

    // Create new user
    const user = await User.create(userData);

    if (user) {
      console.log('User created successfully through auth route:', user._id);
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      console.log('Invalid user data');
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    console.error('Auth registration error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  try {
    console.log('Auth login request received:', req.body);
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      console.log('Missing email or password');
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    // Find user by email
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      console.log('User not found:', email);
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      console.log('Invalid password for user:', email);
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    console.log('User logged in successfully through auth route:', user._id);
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error('Auth login error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/profile
// @access  Private
const getProfile = async (req, res) => {
  try {
    console.log('Get profile request received, user ID:', req.user._id);
    const user = await User.findById(req.user._id);
    if (user) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        height: user.height,
        weight: user.weight,
        age: user.age,
        goals: user.goals,
        profilePicture: user.profilePicture,
      });
    } else {
      console.log('User not found for profile:', req.user._id);
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Send OTP for verification
// @route   POST /api/auth/send-verification-otp
// @access  Public
const sendVerificationOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    // Generate a 6-digit OTP
    const otp = generateOtp();

    // Store OTP in database (remove any existing ones first)
    await OTP.deleteMany({ email, purpose: 'verification' });
    await OTP.create({
      email,
      code: otp,
      purpose: 'verification'
    });

    // Send the OTP via email
    const emailSent = await sendVerificationEmail(email, otp);

    if (emailSent) {
      res.status(200).json({ 
        message: 'Verification code sent to your email',
        email
      });
    } else {
      res.status(500).json({ message: 'Failed to send verification email' });
    }
  } catch (error) {
    console.error('Send verification OTP error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Verify OTP for account verification
// @route   POST /api/auth/verify-otp
// @access  Public
const verifyOtp = async (req, res) => {
  try {
    const { email, otp, purpose = 'verification' } = req.body;
    
    console.log('🔍 OTP Verification Request:', { email, otp, purpose });
    console.log('🔑 Verification code:', otp);
    console.log('📧 Email:', email);

    if (!email || !otp) {
      console.log('❌ Missing email or OTP');
      return res.status(400).json({ message: 'Email and OTP are required' });
    }

    // Find the OTP record
    const otpRecord = await OTP.findOne({ 
      email, 
      code: otp,
      purpose
    });

    console.log('🔎 OTP Record Found:', otpRecord ? 'YES' : 'NO');
    
    if (!otpRecord) {
      // Try to find any OTP for this email to see what might be wrong
      const anyOtpForEmail = await OTP.findOne({ email, purpose });
      if (anyOtpForEmail) {
        console.log('⚠️ Found OTP record for email but code doesn\'t match:');
        console.log('  Expected:', anyOtpForEmail.code);
        console.log('  Received:', otp);
        console.log('  Created at:', anyOtpForEmail.createdAt);
        console.log('  Age (minutes):', (Date.now() - anyOtpForEmail.createdAt) / (1000 * 60));
      } else {
        console.log('⚠️ No OTP records found for this email and purpose');
      }
      
      return res.status(400).json({ message: 'Invalid or expired verification code' });
    }

    // If verification is successful, delete the OTP
    await OTP.deleteOne({ _id: otpRecord._id });
    console.log('✅ OTP verified successfully and deleted from database');

    // If it's a password reset, generate a temporary token
    if (purpose === 'password-reset') {
      const tempToken = generateTempToken(email);
      return res.status(200).json({
        message: 'OTP verified successfully',
        tempToken
      });
    }

    // For regular verification
    res.status(200).json({ message: 'Email verified successfully' });
  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Send OTP for password reset
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User with this email does not exist' });
    }

    // Generate a 6-digit OTP
    const otp = generateOtp();

    // Store OTP in database (remove any existing ones first)
    await OTP.deleteMany({ email, purpose: 'password-reset' });
    await OTP.create({
      email,
      code: otp,
      purpose: 'password-reset'
    });

    // Send the OTP via email
    const emailSent = await sendPasswordResetEmail(email, otp);

    if (emailSent) {
      res.status(200).json({ 
        message: 'Password reset code sent to your email',
        email
      });
    } else {
      res.status(500).json({ message: 'Failed to send password reset email' });
    }
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Reset password with temporary token
// @route   POST /api/auth/reset-password
// @access  Public
const resetPassword = async (req, res) => {
  try {
    const { email, tempToken, password } = req.body;

    if (!email || !tempToken || !password) {
      return res.status(400).json({ 
        message: 'Email, temporary token, and new password are required' 
      });
    }

    // Verify the temporary token
    try {
      const decoded = jwt.verify(tempToken, process.env.JWT_SECRET || 'fallback_secret');
      
      // Check if the email in the token matches the email in the request
      if (decoded.email !== email) {
        return res.status(400).json({ message: 'Invalid token' });
      }
      
      // Find the user
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      // Update the password
      user.password = password;
      await user.save();
      
      res.status(200).json({ message: 'Password has been reset successfully' });
    } catch (error) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ message: error.message });
  }
};

export { 
  register, 
  login, 
  getProfile, 
  sendVerificationOtp, 
  verifyOtp, 
  forgotPassword, 
  resetPassword 
}; 