import mongoose from 'mongoose';

const foodItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  calories: {
    type: Number,
    required: true
  },
  protein: {
    type: Number,
    default: 0
  },
  carbs: {
    type: Number,
    default: 0
  },
  fat: {
    type: Number,
    default: 0
  },
  servingSize: {
    type: String
  },
  quantity: {
    type: Number,
    default: 1
  }
});

const mealSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  mealType: {
    type: String,
    enum: ['breakfast', 'lunch', 'dinner', 'snack'],
    required: true
  },
  foods: [foodItemSchema],
  totalCalories: {
    type: Number,
    default: 0
  },
  totalProtein: {
    type: Number,
    default: 0
  },
  totalCarbs: {
    type: Number,
    default: 0
  },
  totalFat: {
    type: Number,
    default: 0
  },
  notes: {
    type: String
  }
}, {
  timestamps: true
});

// Middleware to calculate totals
mealSchema.pre('save', function(next) {
  let totalCal = 0;
  let totalPro = 0;
  let totalCrb = 0;
  let totalFt = 0;

  this.foods.forEach(food => {
    totalCal += food.calories * food.quantity;
    totalPro += food.protein * food.quantity;
    totalCrb += food.carbs * food.quantity;
    totalFt += food.fat * food.quantity;
  });

  this.totalCalories = totalCal;
  this.totalProtein = totalPro;
  this.totalCarbs = totalCrb;
  this.totalFat = totalFt;

  next();
});

const Meal = mongoose.model('Meal', mealSchema);

export default Meal; 