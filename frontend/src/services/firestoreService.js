/**
 * Mock database service for demo purposes
 * All operations are handled using local storage
 * This file is included for compatibility with existing code but
 * most functionality is now implemented in storageService.js
 */

// Re-export the functionality from storageService to maintain compatibility
import { getUserData, updateUserData } from './storageService';

/**
 * Get user workouts from localStorage
 * @param {string} userId User ID
 * @returns {Object} Result with success status and workouts data
 */
export const getUserWorkouts = async (userId) => {
  try {
    // Get workouts from localStorage
    const workouts = JSON.parse(localStorage.getItem('fitness_app_workouts') || '[]');
    const userWorkouts = workouts.filter(workout => workout.userId === userId);
    
    return {
      success: true,
      data: userWorkouts
    };
  } catch (error) {
    console.error('Error getting workouts:', error);
    return {
      success: false,
      error: error.message || 'Failed to get workouts'
    };
  }
};

/**
 * Create a new workout in localStorage
 * @param {Object} workoutData Workout data to create
 * @returns {Object} Result with success status and created workout
 */
export const createWorkout = async (workoutData) => {
  try {
    // Get workouts from localStorage
    const workouts = JSON.parse(localStorage.getItem('fitness_app_workouts') || '[]');
    
    // Create new workout
    const workout = {
      id: 'workout_' + Date.now(),
      ...workoutData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // Add to workouts
    workouts.push(workout);
    
    // Save back to localStorage
    localStorage.setItem('fitness_app_workouts', JSON.stringify(workouts));
    
    return {
      success: true,
      data: workout
    };
  } catch (error) {
    console.error('Error creating workout:', error);
    return {
      success: false,
      error: error.message || 'Failed to create workout'
    };
  }
};

/**
 * Get exercise library data from mock data
 * @returns {Object} Result with success status and exercises data
 */
export const getExerciseLibrary = async () => {
  // Mock exercise library data
  const exercises = [
    { id: '1', name: 'Push-up', category: 'Strength', muscle: 'Chest' },
    { id: '2', name: 'Squat', category: 'Strength', muscle: 'Legs' },
    { id: '3', name: 'Pull-up', category: 'Strength', muscle: 'Back' },
    { id: '4', name: 'Plank', category: 'Core', muscle: 'Abdominals' },
    { id: '5', name: 'Lunges', category: 'Strength', muscle: 'Legs' },
    { id: '6', name: 'Bicep Curl', category: 'Strength', muscle: 'Arms' },
    { id: '7', name: 'Tricep Extension', category: 'Strength', muscle: 'Arms' },
    { id: '8', name: 'Shoulder Press', category: 'Strength', muscle: 'Shoulders' },
    { id: '9', name: 'Deadlift', category: 'Strength', muscle: 'Back' },
    { id: '10', name: 'Running', category: 'Cardio', muscle: 'Full Body' }
  ];
  
  return {
    success: true,
    data: exercises
  };
};

// Re-export functions from storageService
export { getUserData, updateUserData }; 