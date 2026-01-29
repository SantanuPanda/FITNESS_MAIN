import mongoose from 'mongoose';

const exerciseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  sets: {
    type: Number,
    default: 1
  },
  reps: {
    type: Number,
    default: 1
  },
  weight: {
    type: Number,
    default: 0
  },
  duration: {
    type: Number, // in seconds
    default: 0
  },
  notes: String
});

const workoutSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  exercises: [exerciseSchema],
  duration: {
    type: Number, // Total duration in minutes
    default: 0
  },
  caloriesBurned: {
    type: Number,
    default: 0
  },
  date: {
    type: Date,
    default: Date.now
  },
  isCompleted: {
    type: Boolean,
    default: false
  },
  workoutType: {
    type: String,
    enum: ['strength', 'cardio', 'flexibility', 'balance', 'other'],
    default: 'other'
  }
}, {
  timestamps: true
});

const Workout = mongoose.model('Workout', workoutSchema);

export default Workout; 
