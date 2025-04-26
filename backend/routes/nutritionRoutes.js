import express from 'express';
import {
  createMeal,
  getMeals,
  getMealById,
  updateMeal,
  deleteMeal,
  getNutritionSummary
} from '../controllers/nutritionController.js';
import { protect, nutritionist } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes need authentication
router.use(protect);

// Routes
router.route('/')
  .post(createMeal)
  .get(getMeals);

router.route('/summary')
  .get(getNutritionSummary);

router.route('/:id')
  .get(getMealById)
  .put(updateMeal)
  .delete(deleteMeal);

// The following routes can also be used by nutritionists
// router.route('/user/:userId')
//   .get(nutritionist, getMealsByUser)
//   .post(nutritionist, createUserMeal);

export default router; 