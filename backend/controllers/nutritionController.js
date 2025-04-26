import Meal from '../models/nutritionModel.js';

// @desc    Create a new meal
// @route   POST /api/nutrition
// @access  Private
const createMeal = async (req, res) => {
  try {
    const { date, mealType, foods, notes } = req.body;

    const meal = await Meal.create({
      user: req.user._id,
      date,
      mealType,
      foods,
      notes
    });

    res.status(201).json(meal);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all meals for a user
// @route   GET /api/nutrition
// @access  Private
const getMeals = async (req, res) => {
  try {
    // Allow filter by date range
    const { startDate, endDate } = req.query;
    
    const filter = { user: req.user._id };
    
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }
    
    const meals = await Meal.find(filter).sort({ date: -1 });
    res.json(meals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get meal by ID
// @route   GET /api/nutrition/:id
// @access  Private
const getMealById = async (req, res) => {
  try {
    const meal = await Meal.findById(req.params.id);
    
    if (!meal) {
      return res.status(404).json({ message: 'Meal not found' });
    }

    // Check if meal belongs to user
    if (meal.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to access this meal' });
    }

    res.json(meal);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a meal
// @route   PUT /api/nutrition/:id
// @access  Private
const updateMeal = async (req, res) => {
  try {
    const { date, mealType, foods, notes } = req.body;

    const meal = await Meal.findById(req.params.id);
    
    if (!meal) {
      return res.status(404).json({ message: 'Meal not found' });
    }

    // Check if meal belongs to user
    if (meal.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this meal' });
    }

    // Update meal fields
    meal.date = date || meal.date;
    meal.mealType = mealType || meal.mealType;
    meal.foods = foods || meal.foods;
    meal.notes = notes !== undefined ? notes : meal.notes;

    const updatedMeal = await meal.save();
    res.json(updatedMeal);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a meal
// @route   DELETE /api/nutrition/:id
// @access  Private
const deleteMeal = async (req, res) => {
  try {
    const meal = await Meal.findById(req.params.id);
    
    if (!meal) {
      return res.status(404).json({ message: 'Meal not found' });
    }

    // Check if meal belongs to user
    if (meal.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this meal' });
    }

    await meal.deleteOne();
    res.json({ message: 'Meal removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get nutrition summary for date range
// @route   GET /api/nutrition/summary
// @access  Private
const getNutritionSummary = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    // Default to last 7 days if no dates provided
    const start = startDate ? new Date(startDate) : new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const end = endDate ? new Date(endDate) : new Date();
    
    // Get all meals in date range
    const meals = await Meal.find({
      user: req.user._id,
      date: { $gte: start, $lte: end }
    }).sort({ date: 1 });
    
    // Group by date
    const dailySummary = meals.reduce((acc, meal) => {
      const dateKey = meal.date.toISOString().split('T')[0];
      
      if (!acc[dateKey]) {
        acc[dateKey] = {
          date: dateKey,
          totalCalories: 0,
          totalProtein: 0,
          totalCarbs: 0,
          totalFat: 0,
          meals: []
        };
      }
      
      acc[dateKey].totalCalories += meal.totalCalories;
      acc[dateKey].totalProtein += meal.totalProtein;
      acc[dateKey].totalCarbs += meal.totalCarbs;
      acc[dateKey].totalFat += meal.totalFat;
      acc[dateKey].meals.push({
        id: meal._id,
        mealType: meal.mealType,
        totalCalories: meal.totalCalories
      });
      
      return acc;
    }, {});
    
    // Convert to array
    const summary = Object.values(dailySummary);
    
    res.json(summary);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export {
  createMeal,
  getMeals,
  getMealById,
  updateMeal,
  deleteMeal,
  getNutritionSummary
}; 