import express from 'express';
import { register, login, getProfile } from '../controllers/authController.js';
import { validateSignup, validateLogin } from '../middleware/validationMiddleware.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.post('/register', validateSignup, register);
router.post('/login', validateLogin, login);

// Protected routes
router.get('/profile', protect, getProfile);

export default router; 