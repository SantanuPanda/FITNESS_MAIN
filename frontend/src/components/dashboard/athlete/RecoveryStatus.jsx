import React, { useState } from 'react';
import { motion } from 'framer-motion';

const RecoveryStatus = ({ 
  recoveryData = {}, 
  detailed = false, 
  onStartActiveRecovery = () => {}, 
  onDeleteRecovery = () => {} 
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  
  // Check if recovery data is available
  const hasData = recoveryData && Object.keys(recoveryData).length > 0;
  
  const getStatusColor = (value) => {
    if (value >= 80) return { bg: 'bg-green-100', text: 'text-green-800', ring: 'ring-green-400', progress: 'bg-green-500' };
    if (value >= 60) return { bg: 'bg-blue-100', text: 'text-blue-800', ring: 'ring-blue-400', progress: 'bg-blue-500' };
    if (value >= 40) return { bg: 'bg-yellow-100', text: 'text-yellow-800', ring: 'ring-yellow-400', progress: 'bg-yellow-500' };
    return { bg: 'bg-red-100', text: 'text-red-800', ring: 'ring-red-400', progress: 'bg-red-500' };
  };
  
  const getRecommendation = (type, value) => {
    if (type === 'sleepQuality') {
      if (value < 60) return "Consider going to bed earlier tonight";
      if (value < 80) return "Your sleep was adequate, but could be better";
      return "Great sleep quality, maintain your routine";
    }
    
    if (type === 'muscleRecovery') {
      if (value < 60) return "Take it easy today, focus on recovery";
      if (value < 80) return "Moderate intensity workouts recommended";
      return "Your muscles have recovered well, ready for high intensity";
    }
    
    if (type === 'readinessScore') {
      if (value < 60) return "Active recovery recommended today";
      if (value < 80) return "You're ready for moderate exercise";
      return "You're primed for peak performance today";
    }
    
    return "";
  };
  
  // Circular progress indicator component
  const CircularProgress = ({ value, size = 120, trackWidth = 10, label }) => {
    const radius = (size - trackWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (value / 100) * circumference;
    
    const statusColor = getStatusColor(value);
    
    return (
      <div className="flex flex-col items-center justify-center">
        <div className="relative" style={{ width: size, height: size }}>
          {/* Background track */}
          <svg className="w-full h-full" viewBox={`0 0 ${size} ${size}`}>
            <circle
              className="text-gray-200"
              stroke="currentColor"
              fill="none"
              strokeWidth={trackWidth}
              r={radius}
              cx={size / 2}
              cy={size / 2}
            />
            
            {/* Foreground track */}
            <motion.circle
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 1, ease: "easeOut" }}
              className={statusColor.progress}
              stroke="currentColor"
              fill="none"
              strokeWidth={trackWidth}
              strokeLinecap="round"
              strokeDasharray={circumference}
              r={radius}
              cx={size / 2}
              cy={size / 2}
              transform={`rotate(-90 ${size / 2} ${size / 2})`}
            />
          </svg>
          
          {/* Value text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold">{value}</span>
            <span className="text-xs text-gray-500">{label}</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-5">
        <div>
          <h2 className="text-xl font-semibold flex items-center">
            <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
            </svg>
            Recovery Status
          </h2>
          <p className="text-sm text-gray-500">Track your body's readiness for training</p>
        </div>
        
        {detailed && (
          <div className="bg-gray-100 rounded-lg p-1 flex text-xs">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-3 py-1.5 rounded-md transition-all ${
                activeTab === 'overview'
                  ? 'bg-white shadow-sm text-blue-600 font-medium'
                  : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-3 py-1.5 rounded-md transition-all ${
                activeTab === 'history'
                  ? 'bg-white shadow-sm text-blue-600 font-medium'
                  : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              History
            </button>
          </div>
        )}
      </div>

      {!hasData ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-100">
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
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No recovery data available</h3>
          <p className="mt-1 text-sm text-gray-500">Wear your fitness tracker during sleep to see recovery metrics.</p>
        </div>
      ) : (
        <>
          {activeTab === 'overview' && (
        <div>
              {/* Main Readiness Score */}
              <div className="mb-6 flex flex-col items-center justify-center">
                <CircularProgress 
                  value={recoveryData.readinessScore} 
                  size={150} 
                  trackWidth={12} 
                  label="Readiness" 
                />
                
                <div className={`mt-4 text-center px-4 py-2 rounded-lg ${getStatusColor(recoveryData.readinessScore).bg}`}>
                  <span className={`font-medium ${getStatusColor(recoveryData.readinessScore).text}`}>
                    {getRecommendation('readinessScore', recoveryData.readinessScore)}
                  </span>
                </div>
              </div>
              
              {/* Recovery Metrics Grid */}
              <div className="grid grid-cols-2 gap-4">
                {/* Sleep Quality */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className="bg-white rounded-xl p-4 border border-gray-100 hover:shadow-md transition-all"
                >
                  <div className="flex items-center mb-2">
                    <svg className="w-5 h-5 text-indigo-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>
                    </svg>
                    <span className="text-sm font-medium">Sleep Quality</span>
                  </div>
                  
                  <div className="mt-2">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-3xl font-bold">{recoveryData.sleepQuality}</span>
                      <span className="text-xs font-medium px-2 py-1 rounded-full bg-indigo-100 text-indigo-800">
                        {recoveryData.sleepQuality >= 80 ? 'Excellent' : 
                          recoveryData.sleepQuality >= 60 ? 'Good' : 
                          recoveryData.sleepQuality >= 40 ? 'Fair' : 'Poor'}
              </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <motion.div 
                        initial={{ width: 0 }} 
                        animate={{ width: `${recoveryData.sleepQuality}%` }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="h-2.5 rounded-full bg-indigo-500">
                      </motion.div>
                    </div>
                    
                    <p className="mt-3 text-xs text-gray-500">
                      {getRecommendation('sleepQuality', recoveryData.sleepQuality)}
                    </p>
                  </div>
                </motion.div>
                
                {/* Muscle Recovery */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: 0.1 }}
                  className="bg-white rounded-xl p-4 border border-gray-100 hover:shadow-md transition-all"
                >
                  <div className="flex items-center mb-2">
                    <svg className="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                    </svg>
                    <span className="text-sm font-medium">Muscle Recovery</span>
            </div>
            
                  <div className="mt-2">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-3xl font-bold">{recoveryData.muscleRecovery}</span>
                      <span className="text-xs font-medium px-2 py-1 rounded-full bg-red-100 text-red-800">
                        {recoveryData.muscleRecovery >= 80 ? 'Recovered' : 
                          recoveryData.muscleRecovery >= 60 ? 'Moderate' : 
                          recoveryData.muscleRecovery >= 40 ? 'Sore' : 'Very Sore'}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
              <motion.div
                initial={{ width: 0 }}
                        animate={{ width: `${recoveryData.muscleRecovery}%` }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="h-2.5 rounded-full bg-red-500">
                      </motion.div>
            </div>
            
                    <p className="mt-3 text-xs text-gray-500">
                      {getRecommendation('muscleRecovery', recoveryData.muscleRecovery)}
            </p>
                  </div>
                </motion.div>
          </div>
          
              {/* Workout Recommendation */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                className="mt-5 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100"
              >
                <div className="flex items-start">
                  <div className="mr-3 mt-1 bg-white p-2 rounded-lg shadow-sm">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Today's Workout Recommendation</h3>
                    <p className="mt-1 text-sm text-gray-600">Based on your recovery status, we recommend:</p>
                    <div className="mt-2 flex items-center bg-white px-3 py-2 rounded-lg shadow-sm">
                      <span className={`inline-block w-3 h-3 rounded-full mr-2 ${
                        recoveryData.recommendedIntensity === 'High' ? 'bg-red-500' :
                        recoveryData.recommendedIntensity === 'Medium' ? 'bg-yellow-500' : 'bg-green-500'
                      }`}></span>
                      <span className="font-medium">{recoveryData.recommendedIntensity} Intensity Workout</span>
                    </div>
                    
                    {/* Add Active Recovery and Delete Recovery buttons */}
                    <div className="mt-3 flex space-x-3">
                      <button
                        onClick={() => onStartActiveRecovery({
                          id: Date.now(),
                          name: 'Active Recovery Session',
                          duration: '20 min',
                          level: 'Light',
                          focus: 'Recovery',
                          details: {
                            description: 'A low-intensity session designed to promote recovery and reduce muscle soreness.',
                            exercises: [
                              { name: 'Light stretching', duration: '5 min', intensity: 'Very Light' },
                              { name: 'Foam rolling', duration: '10 min', intensity: 'Light' },
                              { name: 'Mobility exercises', duration: '5 min', intensity: 'Light' }
                            ]
                          }
                        })}
                        className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-md flex items-center"
                      >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        Start Active Recovery
                      </button>
                      
                      <button
                        onClick={onDeleteRecovery}
                        className="px-3 py-1.5 bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm font-medium rounded-md flex items-center"
                      >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                        </svg>
                        Reset Recovery
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
              
              {detailed && (
                <div className="mt-6 pt-5 border-t border-gray-200">
                  <h3 className="text-sm font-medium text-gray-800 mb-3">Recovery Tips</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      <span className="text-sm text-gray-600">Stay hydrated throughout the day</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      <span className="text-sm text-gray-600">Include protein in your post-workout meal</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      <span className="text-sm text-gray-600">Aim for 7-9 hours of quality sleep</span>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          )}
          
          {activeTab === 'history' && detailed && (
            <div className="mt-2">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Weekly Recovery Trend</h3>
              
              <div className="bg-white rounded-xl p-4 border border-gray-100">
                <div className="h-48">
                  <div className="relative h-full">
                    {/* Y-axis labels */}
                    <div className="absolute left-0 inset-y-0 flex flex-col justify-between text-xs text-gray-500 w-6">
                      <span>100</span>
                      <span>75</span>
                      <span>50</span>
                      <span>25</span>
                      <span>0</span>
                    </div>
                    
                    {/* Grid lines */}
                    <div className="absolute inset-y-0 left-6 right-0 flex flex-col justify-between">
                      {[0, 1, 2, 3, 4].map((i) => (
                        <div key={i} className="w-full h-px bg-gray-200"></div>
                      ))}
                    </div>
                    
                    {/* Lines for metrics */}
                    <div className="absolute inset-0 left-6 pt-5 pb-5">
                      <svg className="w-full h-full" viewBox="0 0 300 100" preserveAspectRatio="none">
                        {/* Sleep quality line */}
                        <motion.path
                          initial={{ pathLength: 0, opacity: 0 }}
                          animate={{ pathLength: 1, opacity: 1 }}
                          transition={{ duration: 1.5, ease: "easeInOut" }}
                          d="M 0,40 L 50,35 L 100,45 L 150,25 L 200,30 L 250,20 L 300,15"
                          fill="none"
                          stroke="rgba(79, 70, 229, 0.7)"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                        
                        {/* Muscle recovery line */}
                        <motion.path
                          initial={{ pathLength: 0, opacity: 0 }}
                          animate={{ pathLength: 1, opacity: 1 }}
                          transition={{ duration: 1.5, ease: "easeInOut", delay: 0.3 }}
                          d="M 0,50 L 50,60 L 100,55 L 150,45 L 200,40 L 250,30 L 300,28"
                          fill="none"
                          stroke="rgba(239, 68, 68, 0.7)"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                        
                        {/* Readiness score line */}
                        <motion.path
                          initial={{ pathLength: 0, opacity: 0 }}
                          animate={{ pathLength: 1, opacity: 1 }}
                          transition={{ duration: 1.5, ease: "easeInOut", delay: 0.6 }}
                          d="M 0,45 L 50,48 L 100,42 L 150,35 L 200,32 L 250,25 L 300,22"
                          fill="none"
                          stroke="rgba(59, 130, 246, 0.7)"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                      </svg>
                    </div>
                    
                    {/* X-axis labels (days) */}
                    <div className="absolute bottom-0 left-6 right-0 flex justify-between text-xs text-gray-500">
                      <span>Mon</span>
                      <span>Tue</span>
                      <span>Wed</span>
                      <span>Thu</span>
                      <span>Fri</span>
                      <span>Sat</span>
                      <span>Sun</span>
                    </div>
                    </div>
                  </div>
                  
                {/* Legend */}
                <div className="flex justify-center space-x-5 mt-4 pt-2 border-t border-gray-100">
                  <div className="flex items-center">
                    <span className="w-3 h-3 rounded-full bg-indigo-500 mr-2"></span>
                    <span className="text-xs text-gray-600">Sleep</span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-3 h-3 rounded-full bg-red-500 mr-2"></span>
                    <span className="text-xs text-gray-600">Muscle</span>
                      </div>
                  <div className="flex items-center">
                    <span className="w-3 h-3 rounded-full bg-blue-500 mr-2"></span>
                    <span className="text-xs text-gray-600">Readiness</span>
                  </div>
                </div>
          </div>
              </div>
            )}
        </>
      )}
    </div>
  );
};

export default RecoveryStatus; 