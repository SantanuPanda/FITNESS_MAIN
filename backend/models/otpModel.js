import mongoose from 'mongoose';

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
  },
  code: {
    type: String,
    required: true,
  },
  purpose: {
    type: String,
    enum: ['verification', 'password-reset'],
    default: 'verification',
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 600, // 10 minutes (in seconds) - automatic document expiration
  },
});

// Create index on email and purpose fields
otpSchema.index({ email: 1, purpose: 1 });

const OTP = mongoose.model('OTP', otpSchema);

export default OTP; 