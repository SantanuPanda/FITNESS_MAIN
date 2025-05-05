import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const GoalProgress = ({ goals = [], detailed = false, onUpdateProgress, onDeleteGoal }) => {
  const [newGoal, setNewGoal] = useState({
    name: '',
    target: '',
    current: '',
    category: 'strength',
    date: new Date().toISOString().split('T')[0]
  });
  const [showForm, setShowForm] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  // Categories with icons and colors
  const categories = {
    all: {
      name: 'All Goals',
      icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z',
      color: 'text-gray-700',
      bg: 'bg-gray-100',
      accent: 'bg-gray-700'
    },
    strength: {
      name: 'Strength',
      icon: 'M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
      color: 'text-red-600',
      bg: 'bg-red-50',
      accent: 'bg-red-600'
    },
    endurance: {
      name: 'Endurance',
      icon: 'M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z',
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      accent: 'bg-blue-600'
    },
    nutrition: {
      name: 'Nutrition',
      icon: 'M21 15.999V9.999m0 0l-8-4-4 2-8 4m8 6v8',
      color: 'text-green-600',
      bg: 'bg-green-50',
      accent: 'bg-green-600'
    },
    weight: {
      name: 'Weight',
      icon: 'M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3',
      color: 'text-purple-600',
      bg: 'bg-purple-50',
      accent: 'bg-purple-600'
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewGoal(prev => ({ ...prev, [name]: value }));
  };

  const handleAddGoal = (e) => {
    e.preventDefault();
    // In a real app, this would send data to backend
    console.log('Adding new goal:', newGoal);
    alert('Goal added! (In a real app, this would be saved to the database)');
    
    // Reset form and hide it
    setNewGoal({
      name: '',
      target: '',
      current: '',
      category: 'strength',
      date: new Date().toISOString().split('T')[0]
    });
    setShowForm(false);
  };

  // Get progress color based on percentage and category
  const getProgressColor = (progress, category = 'strength') => {
    const baseColor = categories[category] ? categories[category].accent : 'bg-blue-600';
    
    if (progress >= 100) return 'bg-gradient-to-r from-green-400 to-green-600';
    return baseColor;
  };
  
  // Calculate days remaining
  const getDaysRemaining = (targetDate) => {
    const current = new Date();
    const target = new Date(targetDate);
    const diffTime = target - current;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };
  
  // Filter goals by category
  const filteredGoals = selectedCategory === 'all' 
    ? goals 
    : goals.filter(goal => goal.category === selectedCategory);

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
        <div>
          <p className="text-sm text-gray-500">Track and achieve your fitness targets</p>
        </div>
        
        <div className="flex gap-3">
          {!detailed && goals.length > 0 && (
            <button className="text-sm flex items-center px-3 py-1.5 text-blue-600 hover:text-blue-800 font-medium border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
              </svg>
              View All
            </button>
          )}
          
          {/* The detailed Add Goal button is removed since it's now handled in the parent component */}
        </div>
      </div>
      
      <AnimatePresence>
        {detailed && showForm && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden mb-6"
          >
            <div className="p-5 bg-purple-50 border border-purple-100 rounded-xl">
              <h3 className="text-lg font-medium mb-4 text-purple-800">Add New Goal</h3>
              <form onSubmit={handleAddGoal} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Goal Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={newGoal.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500"
                    placeholder="E.g., Bench Press Goal"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    name="category"
                    value={newGoal.category}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500"
                    required
                  >
                    {Object.entries(categories).filter(([key]) => key !== 'all').map(([key, { name }]) => (
                      <option key={key} value={key}>{name}</option>
                    ))}
                  </select>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Target
                    </label>
                    <input
                      type="text"
                      name="target"
                      value={newGoal.target}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500"
                      placeholder="E.g., 100kg or 5 sessions"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Current Progress
                    </label>
                    <input
                      type="text"
                      name="current"
                      value={newGoal.current}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500"
                      placeholder="E.g., 80kg or 3 sessions"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Target Date
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={newGoal.date}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500"
                    required
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                  >
                    Add Goal
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Category Filters */}
      {goals.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6 mt-4">
          {Object.entries(categories).map(([key, category]) => (
            <button
              key={key}
              onClick={() => setSelectedCategory(key)}
              className={`flex items-center px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === key 
                  ? `${category.bg} ${category.color} border-transparent shadow-sm` 
                  : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={category.icon}></path>
              </svg>
              {category.name}
              {selectedCategory === key && (
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              )}
            </button>
          ))}
        </div>
      )}

      {goals.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-300"
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
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
          <h3 className="mt-3 text-sm font-medium text-gray-900">No goals yet</h3>
          <p className="mt-1 text-sm text-gray-500 max-w-xs mx-auto">Get started by creating your first fitness goal to track your progress.</p>
        </motion.div>
      ) : (
        <div className="space-y-4">
          {filteredGoals.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <p className="text-gray-500">No goals found in this category.</p>
            </div>
          ) : (
            filteredGoals.map((goal) => {
              const daysRemaining = getDaysRemaining(goal.date);
              const category = goal.category || 'strength';
              const categoryInfo = categories[category] || categories.strength;
              
              return (
                <motion.div
                  key={goal.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -2, transition: { duration: 0.2 } }}
                  className="p-5 bg-white border border-gray-100 rounded-xl hover:shadow-md transition-all"
                >
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-3">
                    <div className="flex items-start">
                      <div className={`w-10 h-10 rounded-lg ${categoryInfo.bg} flex items-center justify-center mr-3 flex-shrink-0`}>
                        <svg className={`w-5 h-5 ${categoryInfo.color}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={categoryInfo.icon}></path>
                        </svg>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium text-gray-900">{goal.name}</h3>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${categoryInfo.bg} ${categoryInfo.color}`}>
                            {categoryInfo.name}
                          </span>
                        </div>
                        <div className="text-sm text-gray-500 flex items-center mt-1">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                          </svg>
                          Target: {new Date(goal.date).toLocaleDateString()}
                          {daysRemaining > 0 && (
                            <span className="ml-2 text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">
                              {daysRemaining} days left
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-sm flex items-baseline gap-1 justify-end">
                        <span className="text-2xl font-bold text-gray-900">{goal.current}</span>
                        <span className="text-gray-400">/</span>
                        <span className="text-base font-medium text-gray-600">{goal.target}</span>
                      </div>
                      {detailed && (
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => {
                              // Handle update progress directly
                              const newCurrent = prompt(`Update progress for "${goal.name}" (current: ${goal.current}):`, goal.current);
                              if (newCurrent && newCurrent !== goal.current) {
                                // Calculate new progress (simple calculation)
                                let newProgress = 0;
                                const currentNum = parseInt(newCurrent.match(/\d+/)?.[0] || '0');
                                const targetNum = parseInt(goal.target.match(/\d+/)?.[0] || '100');
                                
                                if (goal.target.includes('min') && currentNum > targetNum) {
                                  // For time goals (lower is better)
                                  newProgress = Math.min(100, Math.max(0, 100 - ((currentNum - targetNum) / targetNum * 100)));
                                } else {
                                  // For regular goals (higher is better)
                                  newProgress = Math.min(100, Math.max(0, (currentNum / targetNum) * 100));
                                }
                                
                                // Call the update function directly
                                onUpdateProgress(goal.id, Math.round(newProgress), newCurrent);
                              }
                            }}
                            className="text-xs text-purple-600 hover:text-purple-800 mt-1 flex items-center"
                          >
                            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
                            </svg>
                            Update Progress
                          </button>
                          {onDeleteGoal && (
                            <button 
                              onClick={() => onDeleteGoal(goal.id)}
                              className="text-xs text-red-600 hover:text-red-800 mt-1 flex items-center"
                            >
                              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                              Delete
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="relative w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(goal.progress, 100)}%` }}
                      transition={{ duration: 0.5 }}
                      className={`h-full rounded-full ${getProgressColor(goal.progress, category)}`}
                    ></motion.div>
                    
                    {/* For completed goals */}
                    {goal.progress >= 100 && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.5, type: 'spring' }}
                        className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-1 shadow-md"
                      >
                        <svg className="w-3 h-3 text-green-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                        </svg>
                      </motion.div>
                    )}
                  </div>
                  
                  <div className="flex justify-between mt-2 text-xs text-gray-500">
                    <span>Progress: {goal.progress}%</span>
                    {goal.progress >= 100 ? (
                      <span className="text-green-600 font-medium">Completed!</span>
                    ) : (
                      <span>{goal.current} of {goal.target}</span>
                    )}
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};

export default GoalProgress; 