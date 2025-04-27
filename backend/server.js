import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import morgan from 'morgan';

// Import routes
import userRoutes from './routes/userRoutes.js';
import workoutRoutes from './routes/workoutRoutes.js';
import nutritionRoutes from './routes/nutritionRoutes.js';
import authRoutes from './routes/authRoutes.js';

// Import middleware
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// MongoDB Connection String - prioritize environment variable
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/fitness';

// Connect to MongoDB with updated options (removed deprecated options)
mongoose.connect(MONGODB_URI, {
  serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
  autoIndex: true, // Build indexes
  maxPoolSize: 10, // Maintain up to 10 socket connections
  family: 4 // Use IPv4, skip trying IPv6
})
.then(() => {
  console.log('MongoDB connected successfully');
  console.log(`MongoDB connection string: ${MONGODB_URI.replace(/mongodb(\+srv)?:\/\/([^:]+):([^@]+)@/, 'mongodb$1://$2:****@')}`);
})
.catch(err => {
  console.error('MongoDB connection error:', err);
  console.error('Please check your MongoDB URI in environment variables');
});

// Routes
app.use('/api/users', userRoutes);
app.use('/api/workouts', workoutRoutes);
app.use('/api/nutrition', nutritionRoutes);
app.use('/api/auth', authRoutes);

// Root route
app.get('/', (req, res) => {
  res.send('Fitness API is running...');
});

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Start server with error handling for port already in use
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}).on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    // Try with a different port if the default one is in use
    const newPort = parseInt(PORT) + 1;
    console.warn(`Port ${PORT} is already in use, trying with port ${newPort}`);
    app.listen(newPort, () => {
      console.log(`Server running on port ${newPort}`);
    });
  } else {
    console.error('Server error:', err);
  }
}); 