import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const WorkoutTracker = ({ workouts = [], showControls = false, onAddWorkout = null, onDeleteWorkout = null, handleFinishWorkout = null }) => {
  const [localWorkouts, setLocalWorkouts] = useState(workouts);
  const [newWorkout, setNewWorkout] = useState({
    name: '',
    date: new Date().toISOString().split('T')[0],
    duration: '',
    intensity: 'Medium'
  });
  const [isFormVisible, setIsFormVisible] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewWorkout(prev => ({ ...prev, [name]: value }));
  };

  const handleAddWorkout = (e) => {
    e.preventDefault();
    
    const workoutToAdd = {
      ...newWorkout,
      id: localWorkouts.length > 0 ? Math.max(...localWorkouts.map(w => w.id)) + 1 : 1
    };
    
    // Update local state
    setLocalWorkouts(prev => [workoutToAdd, ...prev]);
    
    // If parent component provided a callback, use it
    if (onAddWorkout) {
      onAddWorkout(workoutToAdd);
    } else {
      console.log('Adding new workout:', workoutToAdd);
    }
    
    // Reset form
    setNewWorkout({
      name: '',
      date: new Date().toISOString().split('T')[0],
      duration: '',
      intensity: 'Medium'
    });
    
    // Hide form after submitting
    if (showControls) {
      setIsFormVisible(false);
    }
  };

  const intensityColors = {
    'Low': {
      bg: 'bg-green-100',
      text: 'text-green-800',
      light: 'bg-green-50',
      border: 'border-green-200',
      icon: 'bg-green-400'
    },
    'Medium': {
      bg: 'bg-blue-100',
      text: 'text-blue-800',
      light: 'bg-blue-50',
      border: 'border-blue-200',
      icon: 'bg-blue-400'
    },
    'High': {
      bg: 'bg-orange-100',
      text: 'text-orange-800',
      light: 'bg-orange-50',
      border: 'border-orange-200',
      icon: 'bg-orange-400'
    },
    'Very High': {
      bg: 'bg-red-100',
      text: 'text-red-800',
      light: 'bg-red-50',
      border: 'border-red-200',
      icon: 'bg-red-400'
    }
  };

  // Get workout icon based on name
  const getWorkoutIcon = (name = '') => {
    const lowercaseName = name.toLowerCase();
    if (lowercaseName.includes('run') || lowercaseName.includes('cardio') || lowercaseName.includes('hiit')) {
      return (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
      );
    } else if (lowercaseName.includes('strength') || lowercaseName.includes('weight') || lowercaseName.includes('body')) {
      return (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 3a3 3 0 00-3 3v12a3 3 0 003 3 3 3 0 003-3 3 3 0 00-3-3H6a3 3 0 00-3 3 3 3 0 003 3 3 3 0 003-3V6a3 3 0 00-3-3 3 3 0 00-3 3 3 3 0 003 3h12a3 3 0 003-3 3 3 0 00-3-3z" />
      );
    } else if (lowercaseName.includes('yoga') || lowercaseName.includes('stretch') || lowercaseName.includes('flexibility')) {
      return (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      );
    }
    
    // Default icon
    return (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    );
  };

  // Use either local state or props for rendering
  const displayWorkouts = localWorkouts.length > 0 ? localWorkouts : workouts;

  // Format date to be more readable
  const formatDate = (dateString) => {
    const options = { weekday: 'short', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold flex items-center">
            <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Recent Workouts
          </h2>
          <p className="text-sm text-gray-500 mt-1">Track your fitness activities</p>
        </div>
        
        {!showControls && displayWorkouts.length > 0 ? (
          <button className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors">
            <span>View All</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        ) : showControls && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsFormVisible(!isFormVisible)}
            className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isFormVisible ? "M6 18L18 6M6 6l12 12" : "M12 6v6m0 0v6m0-6h6m-6 0H6"} />
            </svg>
            <span>{isFormVisible ? 'Cancel' : 'Log Workout'}</span>
          </motion.button>
        )}
      </div>

      {displayWorkouts.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-10 bg-gray-50 rounded-xl border border-dashed border-gray-300"
        >
          <svg
            className="mx-auto h-16 w-16 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
          <h3 className="mt-3 text-sm font-medium text-gray-900">No workouts recorded yet</h3>
          <p className="mt-1 text-sm text-gray-500 max-w-xs mx-auto">Track your fitness journey by logging your workouts here.</p>
          
          {showControls && (
            <button
              onClick={() => setIsFormVisible(true)}
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <svg className="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Start Tracking
            </button>
          )}
        </motion.div>
      ) : (
        <div className="space-y-3">
          {displayWorkouts.map((workout, index) => (
            <motion.div
              key={workout.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              whileHover={{ y: -2, boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)" }}
              className={`p-4 border rounded-xl transition-all ${intensityColors[workout.intensity].border} ${intensityColors[workout.intensity].light}`}
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className={`w-10 h-10 rounded-lg ${intensityColors[workout.intensity].bg} flex items-center justify-center mr-3 shadow-sm`}>
                    <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      {getWorkoutIcon(workout.name)}
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium flex items-center">
                      {workout.name}
                      <span className={`ml-2 w-2 h-2 rounded-full ${intensityColors[workout.intensity].icon}`}></span>
                    </h3>
                    <div className="flex items-center text-sm text-gray-500 mt-0.5">
                      <svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span>{formatDate(workout.date)}</span>
                      <span className="mx-2">•</span>
                      <svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{workout.duration}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center">
                  <span className={`${intensityColors[workout.intensity].bg} ${intensityColors[workout.intensity].text} text-xs px-2.5 py-1 rounded-full font-medium`}>
                    {workout.intensity}
                  </span>
                  <div className="flex ml-3">
                    {onDeleteWorkout && (
                      <button 
                        onClick={() => onDeleteWorkout(workout.id)}
                        className="text-gray-400 hover:text-red-600 transition-colors"
                        title="Delete workout"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    )}
                    <button className="ml-2 text-gray-400 hover:text-gray-600 transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
                    </svg>
                  </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {showControls && (
        <AnimatePresence>
          {isFormVisible && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-6 border-t pt-6 overflow-hidden"
            >
              <h3 className="text-lg font-medium mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Log New Workout
              </h3>
              <form onSubmit={handleAddWorkout} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Workout Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={newWorkout.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="E.g., Upper Body Strength"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date
                    </label>
                    <input
                      type="date"
                      name="date"
                      value={newWorkout.date}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Duration
                    </label>
                    <input
                      type="text"
                      name="duration"
                      value={newWorkout.duration}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="E.g., 45 min"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Intensity
                    </label>
                    <div className="relative">
                      <select
                        name="intensity"
                        value={newWorkout.intensity}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none transition-colors"
                        required
                      >
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                        <option value="Very High">Very High</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsFormVisible(false)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                  >
                    Cancel
                  </button>
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-sm transition-all"
                  >
                    Log Workout
                  </motion.button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
};

export default WorkoutTracker; 