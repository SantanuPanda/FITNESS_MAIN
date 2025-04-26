import React, { useState } from 'react';
import { motion } from 'framer-motion';

const PerformanceMetrics = ({ metricsData = {}, detailed = false, onStartWorkout }) => {
  const [timeframe, setTimeframe] = useState('weekly');
  const [selectedMetric, setSelectedMetric] = useState(null);
  
  // Simulated chart data for different timeframes
  // In a real app, this would come from API/backend
  const chartData = {
    weekly: [65, 67, 72, 68, 75, 74, 78],
    monthly: [60, 63, 68, 72, 74, 71, 73, 76, 78],
    yearly: [55, 57, 60, 62, 64, 68, 70, 72, 74, 76, 78]
  };
  
  const metricColors = {
    strength: {
      gradient: 'from-blue-400 to-blue-500',
      bg: 'bg-blue-100',
      text: 'text-blue-800',
      chartColor: 'rgba(59, 130, 246, 0.8)'
    },
    endurance: {
      gradient: 'from-green-400 to-green-500',
      bg: 'bg-green-100',
      text: 'text-green-800',
      chartColor: 'rgba(16, 185, 129, 0.8)'
    },
    speed: {
      gradient: 'from-purple-400 to-purple-500',
      bg: 'bg-purple-100',
      text: 'text-purple-800',
      chartColor: 'rgba(139, 92, 246, 0.8)'
    },
    flexibility: {
      gradient: 'from-orange-400 to-orange-500',
      bg: 'bg-orange-100',
      text: 'text-orange-800',
      chartColor: 'rgba(249, 115, 22, 0.8)'
    }
  };
  
  const metricIcons = {
    strength: 'M18 3a3 3 0 00-3 3v12a3 3 0 003 3 3 3 0 003-3 3 3 0 00-3-3H6a3 3 0 00-3 3 3 3 0 003 3 3 3 0 003-3V6a3 3 0 00-3-3 3 3 0 00-3 3 3 3 0 003 3h12a3 3 0 003-3 3 3 0 00-3-3z',
    endurance: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
    speed: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
    flexibility: 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'
  };

  // Calculate max value for chart scaling
  const maxValue = Math.max(...chartData[timeframe]);
  
  // Handle when a metric card is clicked
  const handleMetricClick = (metricKey) => {
    if (detailed) {
      setSelectedMetric(selectedMetric === metricKey ? null : metricKey);
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
        <div>
          <h2 className="text-xl font-semibold flex items-center">
            <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
            </svg>
            Performance Metrics
          </h2>
          <p className="text-gray-500 text-sm">Track your fitness progress over time</p>
        </div>
        
        {/* Timeframe selector */}
        <div className="bg-gray-100 rounded-lg p-1 flex text-sm self-start">
          {['weekly', 'monthly', 'yearly'].map((period) => (
            <button
              key={period}
              onClick={() => setTimeframe(period)}
              className={`px-3 py-1.5 rounded-md transition-all ${
                timeframe === period
                  ? 'bg-white shadow-sm text-blue-600 font-medium'
                  : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              {period.charAt(0).toUpperCase() + period.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {!metricsData || Object.keys(metricsData).length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-100">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No metrics data available</h3>
          <p className="mt-1 text-sm text-gray-500">Complete workouts to see your performance metrics.</p>
          <div className="mt-6">
            <button 
              onClick={() => {
                // Create a default workout to start
                const workout = {
                  id: 'quick-start',
                  name: 'Quick Start Workout',
                  duration: '30 min',
                  level: 'Medium',
                  focus: 'General',
                  target: 'Full Body',
                  details: {
                    description: 'A balanced full-body workout for all fitness levels.',
                    exercises: [
                      { name: 'Jumping Jacks', duration: '1 min', completed: false },
                      { name: 'Push-ups', sets: 3, reps: '10', completed: false },
                      { name: 'Squats', sets: 3, reps: '15', completed: false },
                      { name: 'Plank', duration: '30 sec', completed: false },
                      { name: 'Mountain Climbers', duration: '45 sec', completed: false },
                      { name: 'Rest', duration: '1 min', completed: false },
                      { name: 'Lunges', sets: 2, reps: '10 each leg', completed: false },
                      { name: 'Cool Down', duration: '2 min', completed: false }
                    ]
                  }
                };
                
                if (onStartWorkout) {
                  onStartWorkout(workout);
                }
              }}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <svg className="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
              Start a Workout
            </button>
          </div>
        </div>
      ) : (
        <div>
          {/* Metrics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {Object.entries(metricsData).map(([key, metric]) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                onClick={() => handleMetricClick(key)}
                className={`bg-white p-5 rounded-xl border ${
                  selectedMetric === key ? 'border-blue-300 shadow-lg' : 'border-gray-100 hover:shadow-md'
                } transition-all cursor-pointer`}
              >
                <div className="flex items-center mb-3">
                  <div className={`rounded-full w-10 h-10 flex items-center justify-center bg-gradient-to-r ${metricColors[key].gradient} text-white shadow-sm`}>
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={metricIcons[key]} />
                    </svg>
                  </div>
                  <span className="ml-2 text-sm text-gray-600 font-medium capitalize">{key}</span>
                </div>
                
                <div className="flex items-baseline mt-2">
                  <span className="text-2xl font-bold">{metric.current}</span>
                  <span className="ml-1 text-gray-500 text-sm">{metric.unit}</span>
                  
                  <div className="ml-auto flex items-center">
                    <span className={`text-xs font-medium ${
                      metric.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {metric.change}
                    </span>
                  </div>
                </div>
                
                <div className="mt-3 pt-3 border-t border-gray-50">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">Previous</span>
                    <span className="text-xs font-medium">{metric.previous} {metric.unit}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          
          {/* Chart Section */}
          {(detailed || selectedMetric) && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ duration: 0.3 }}
              className="mt-6"
            >
              <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-medium text-gray-800">
                    {selectedMetric 
                      ? `${selectedMetric.charAt(0).toUpperCase() + selectedMetric.slice(1)} Progress` 
                      : 'Overall Progress'}
                  </h3>
                  
                  {selectedMetric && (
                    <button 
                      onClick={() => setSelectedMetric(null)}
                      className="text-sm text-gray-500 hover:text-gray-700"
                    >
                      View All
                    </button>
                  )}
                </div>
                
                <div className="h-64">
                  <div className="flex items-end justify-between h-full relative">
                    {/* Y-axis labels */}
                    <div className="absolute left-0 inset-y-0 flex flex-col justify-between text-xs text-gray-500 pr-2">
                      <span>{maxValue}</span>
                      <span>{Math.round(maxValue * 0.75)}</span>
                      <span>{Math.round(maxValue * 0.5)}</span>
                      <span>{Math.round(maxValue * 0.25)}</span>
                      <span>0</span>
                    </div>
                    
                    {/* Grid lines */}
                    <div className="absolute inset-0 left-8 flex flex-col justify-between pointer-events-none">
                      {[0, 1, 2, 3, 4].map((i) => (
                        <div key={i} className="w-full h-px bg-gray-200"></div>
                      ))}
                    </div>
                    
                    {/* Chart bars */}
                    <div className="flex items-end justify-between h-full w-full pl-8">
                      {chartData[timeframe].map((value, index) => {
                        const height = `${(value / maxValue) * 100}%`;
                        const barColor = selectedMetric 
                          ? metricColors[selectedMetric].chartColor 
                          : `rgba(${59 + (index * 10)}, ${130 - (index * 5)}, 246, 0.8)`;
                          
                        return (
                          <div key={index} className="flex flex-col items-center w-full">
                            <div className="relative w-full flex justify-center">
                              <motion.div
                                initial={{ height: 0 }}
                                animate={{ height }}
                                transition={{ duration: 0.5, delay: index * 0.05 }}
                                className="w-6 sm:w-10 rounded-t-md"
                                style={{ backgroundColor: barColor }}
                              >
                                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none">
                                  {value}
                                </div>
                              </motion.div>
                            </div>
                            <span className="text-xs text-gray-500 mt-2">{
                              timeframe === 'weekly' 
                                ? ['M', 'T', 'W', 'T', 'F', 'S', 'S'][index] 
                                : timeframe === 'monthly'
                                  ? ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7', 'W8', 'W9'][index]
                                  : ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N'][index]
                            }</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
                
                {/* Analytics Insights */}
                <div className="mt-6 pt-4 border-t border-gray-100">
                  <h4 className="text-sm font-medium text-gray-800 mb-3">Performance Insights</h4>
                  <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 text-sm text-blue-800">
                    <div className="flex">
                      <svg className="w-5 h-5 text-blue-600 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      <p>
                        {selectedMetric 
                          ? `Your ${selectedMetric} has improved by ${metricsData[selectedMetric].change} compared to your previous session. Keep up the good work!` 
                          : 'Your overall performance is showing improvement across multiple metrics. Consistency is key to reaching your goals.'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
          
          {/* Comparison Section - Only in detailed view */}
          {detailed && !selectedMetric && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                <h3 className="font-medium text-gray-800 mb-4">Weekly Comparison</h3>
                <div className="space-y-4">
                  {Object.entries(metricsData).map(([key, metric]) => (
                    <div key={key} className="flex items-center">
                      <div className={`w-3 h-3 rounded-full ${metricColors[key].bg} mr-2`}></div>
                      <span className="text-sm text-gray-600 capitalize">{key}</span>
                      <div className="ml-auto flex items-center">
                        <span className={`text-xs font-medium ${
                          metric.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {metric.change}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                <h3 className="font-medium text-gray-800 mb-4">Recommendations</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <span>Increase weight in strength training by 5%</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <span>Add one HIIT session to improve endurance</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <span>Include more stretching to enhance flexibility</span>
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PerformanceMetrics; 