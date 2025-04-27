import express from 'express';
import { 
  register, 
  login, 
  getProfile, 
  sendVerificationOtp,
  verifyOtp,
  forgotPassword,
  resetPassword 
} from '../controllers/authController.js';
import { validateSignup, validateLogin } from '../middleware/validationMiddleware.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.post('/register', validateSignup, register);
router.post('/login', validateLogin, login);

// Email verification routes
router.post('/send-verification-otp', sendVerificationOtp);
router.post('/verify-otp', verifyOtp);

// Password reset routes
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

// Test endpoint for signup that doesn't require validation
router.post('/test-register', (req, res) => {
  console.log('Test register endpoint hit with body:', req.body);
  res.status(200).json({ 
    message: 'Test register endpoint working', 
    receivedData: req.body 
  });
});

// Protected routes
router.get('/profile', protect, getProfile);

export default router; 