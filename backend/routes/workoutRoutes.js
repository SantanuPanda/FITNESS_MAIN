import express from 'express';
import {
  createWorkout,
  getWorkouts,
  getWorkoutById,
  updateWorkout,
  deleteWorkout
} from '../controllers/workoutController.js';
import { protect, trainer } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes need authentication
router.use(protect);

// Routes
router.route('/')
  .post(createWorkout)
  .get(getWorkouts);

router.route('/:id')
  .get(getWorkoutById)
  .put(updateWorkout)
  .delete(deleteWorkout);

// The following routes can also be used by trainers
// router.route('/user/:userId')
//   .get(trainer, getWorkoutsByUser)
//   .post(trainer, createUserWorkout);

export default router; 