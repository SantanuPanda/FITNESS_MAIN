import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ActivityLog = ({ activityData = [], onDeleteActivity }) => {
  const [activeTab, setActiveTab] = useState('steps');
  const [hoveredDay, setHoveredDay] = useState(null);
  
  // Define tabs with enhanced metadata
  const tabs = [
    { 
      id: 'steps', 
      label: 'Steps', 
      icon: 'M13 5l7 7-7 7M5 5l7 7-7 7', 
      unit: 'steps',
      color: {
        primary: 'bg-blue-500',
        light: 'bg-blue-100',
        text: 'text-blue-600',
        gradient: 'from-blue-400 to-blue-600'
      },
      target: 10000,
      description: 'Daily step count'
    },
    { 
      id: 'calories', 
      label: 'Calories', 
      icon: 'M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z', 
      unit: 'cal',
      color: {
        primary: 'bg-orange-500',
        light: 'bg-orange-100',
        text: 'text-orange-600',
        gradient: 'from-orange-400 to-orange-600'
      },
      target: 2500,
      description: 'Calories burned'
    },
    { 
      id: 'activeMinutes', 
      label: 'Active Time', 
      icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z', 
      unit: 'min',
      color: {
        primary: 'bg-green-500',
        light: 'bg-green-100',
        text: 'text-green-600',
        gradient: 'from-green-400 to-green-600'
      },
      target: 60,
      description: 'Minutes of activity'
    }
  ];
  
  // Helper function to get date in readable format
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };
  
  // Find the maximum value for the selected stat for chart scaling
  const maxValue = activityData.length > 0 
    ? Math.max(...activityData.map(day => day[activeTab]))
    : 100;
  
  // Get current tab data
  const currentTab = tabs.find(tab => tab.id === activeTab);
  
  // Calculate progress percentage for a given value against target
  const calculateProgress = (value, target) => {
    const percentage = (value / target) * 100;
    return Math.min(percentage, 100); // Cap at 100%
  };
  
  // Calculate average for current metric
  const calculateAverage = () => {
    if (activityData.length === 0) return 0;
    const sum = activityData.reduce((acc, day) => acc + day[activeTab], 0);
    return Math.round(sum / activityData.length);
  };
  
  // Get today's data or the most recent day
  const getLatestData = () => {
    if (activityData.length === 0) return null;
    return activityData[0]; // Assuming data is sorted with most recent first
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
        <div>
          <h2 className="text-xl font-semibold flex items-center">
            <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
            </svg>
            Daily Activity
          </h2>
          <p className="text-sm text-gray-500">Track your daily health metrics</p>
        </div>
        
        {activityData.length > 0 && (
          <div className="text-sm flex items-center bg-blue-50 px-3 py-1.5 rounded-full">
            <span className="text-blue-700 font-medium">Avg {currentTab.label}:</span>
            <span className="ml-1 text-blue-800 font-bold">{calculateAverage()} {currentTab.unit}</span>
          </div>
        )}
      </div>
      
      {activityData.length === 0 ? (
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
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3 className="mt-3 text-sm font-medium text-gray-900">No activity data available</h3>
          <p className="mt-1 text-sm text-gray-500 max-w-xs mx-auto">Connect your fitness devices to start tracking your daily activities.</p>
          <button className="mt-4 inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            <svg className="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
            Connect Device
          </button>
        </motion.div>
      ) : (
        <div>
          {/* Quick Stats Cards */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            {tabs.map((tab) => {
              const latest = getLatestData();
              const value = latest ? latest[tab.id] : 0;
              const progressPercentage = calculateProgress(value, tab.target);
              
              return (
                <motion.div
                  key={tab.id}
                  whileHover={{ y: -2, transition: { duration: 0.2 } }}
                  onClick={() => setActiveTab(tab.id)}
                  className={`p-4 rounded-xl border ${activeTab === tab.id ? 'bg-gradient-to-br ' + tab.color.gradient + ' text-white shadow-md border-transparent' : 'bg-white border-gray-100 hover:border-gray-200'} cursor-pointer transition-all`}
                >
                  <div className="flex items-center mb-2">
                    <div className={`w-8 h-8 rounded-lg ${activeTab === tab.id ? 'bg-white bg-opacity-30' : tab.color.light} flex items-center justify-center ${activeTab === tab.id ? 'text-white' : tab.color.text}`}>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={tab.icon} />
                      </svg>
                    </div>
                    <span className={`ml-2 text-sm font-medium ${activeTab === tab.id ? 'text-white' : 'text-gray-700'}`}>{tab.label}</span>
                  </div>
                  <div className="mt-1">
                    <div className="flex justify-between items-baseline">
                      <span className={`text-2xl font-bold ${activeTab === tab.id ? 'text-white' : 'text-gray-800'}`}>{value}</span>
                      <span className={`text-xs ${activeTab === tab.id ? 'text-white text-opacity-80' : 'text-gray-500'}`}>{tab.unit}</span>
                    </div>
                    <div className="mt-2 relative h-1.5 rounded-full overflow-hidden bg-gray-200 bg-opacity-40">
                      <div 
                        className={`absolute left-0 top-0 h-full rounded-full ${activeTab === tab.id ? 'bg-white' : tab.color.primary}`}
                        style={{ width: `${progressPercentage}%` }}
                      ></div>
                    </div>
                    <div className="mt-1 flex justify-between items-center">
                      <span className={`text-xs ${activeTab === tab.id ? 'text-white text-opacity-80' : 'text-gray-500'}`}>
                        {Math.round(progressPercentage)}% of goal
                      </span>
                      <span className={`text-xs ${activeTab === tab.id ? 'text-white text-opacity-80' : 'text-gray-500'}`}>
                        {tab.target} {tab.unit}
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
          
          {/* Activity Chart */}
          <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm mb-6">
            <div className="mb-4 flex justify-between items-center">
              <h3 className="text-sm font-medium text-gray-800">
                {currentTab.label} History
              </h3>
              <div className="text-xs text-gray-500 flex items-center">
                <span className="inline-block w-2 h-2 rounded-full bg-blue-400 mr-1"></span>
                <span>Target: {currentTab.target} {currentTab.unit}</span>
              </div>
            </div>
            
            <div className="relative h-64">
              {/* Y-axis labels */}
              <div className="absolute left-0 inset-y-0 flex flex-col justify-between text-xs text-gray-500 pr-2 py-4">
                <span>{maxValue}</span>
                <span>{Math.round(maxValue * 0.75)}</span>
                <span>{Math.round(maxValue * 0.5)}</span>
                <span>{Math.round(maxValue * 0.25)}</span>
                <span>0</span>
              </div>
              
              {/* Target line */}
              <div 
                className="absolute left-10 right-0 border-t border-dashed border-blue-400 pointer-events-none z-10" 
                style={{ top: `${100 - ((currentTab.target / maxValue) * 100)}%` }}
              >
                <div className="absolute left-0 -top-2 rounded-md bg-blue-50 text-xs px-1 text-blue-600 font-medium">
                  Target
                </div>
              </div>
              
              {/* Grid lines */}
              <div className="absolute inset-y-0 left-10 right-0 flex flex-col justify-between py-4 pointer-events-none">
                {[0, 1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-full h-px bg-gray-200"></div>
                ))}
              </div>
              
              {/* Chart bars */}
              <div className="absolute inset-0 left-10 flex items-end pt-4 pb-10">
                <div className="flex items-end justify-between h-full w-full">
                  {activityData.map((day, index) => {
                    const height = `${(day[activeTab] / maxValue) * 100}%`;
                    const isHovered = hoveredDay === index;
                    const value = day[activeTab];
                    const date = formatDate(day.date);
                    
                    return (
                      <div 
                        key={index} 
                        className="relative flex-1 flex flex-col items-center group"
                        onMouseEnter={() => setHoveredDay(index)}
                        onMouseLeave={() => setHoveredDay(null)}
                      >
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height }}
                          transition={{ duration: 0.5, delay: index * 0.05 }}
                          className={`relative w-5/6 max-w-[40px] rounded-t-md bg-gradient-to-t ${currentTab.color.gradient} group-hover:opacity-90`}
                        >
                          <AnimatePresence>
                            {isHovered && (
                              <motion.div 
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded shadow-lg whitespace-nowrap z-20"
                              >
                                <div className="text-center font-medium">{value} {currentTab.unit}</div>
                                <div className="text-gray-300 text-[10px]">{date}</div>
                                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-gray-800"></div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </motion.div>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              {/* X-axis labels */}
              <div className="absolute bottom-0 left-10 right-0 flex justify-between text-xs text-gray-500">
                {activityData.map((day, index) => (
                  <div key={index} className="text-center" style={{ width: `${100 / activityData.length}%` }}>
                    {formatDate(day.date).split(' ')[0]} {/* Just the day */}
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Daily Summary */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
              <svg className="w-4 h-4 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
              </svg>
              Daily Summary
            </h3>
            <div className="space-y-3">
              {activityData.map((day, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  whileHover={{ scale: 1.01, boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)" }}
                  className={`p-4 rounded-xl ${index === 0 ? 'bg-blue-50 border border-blue-100' : 'bg-white border border-gray-100'} transition-all`}
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                    <div className="flex items-center">
                      <div className={`w-10 h-10 rounded-lg ${index === 0 ? 'bg-blue-100' : 'bg-gray-100'} flex items-center justify-center mr-3`}>
                        <svg className={`w-5 h-5 ${index === 0 ? 'text-blue-600' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                        </svg>
                      </div>
                      <div>
                        <div className={`font-medium ${index === 0 ? 'text-blue-800' : 'text-gray-800'}`}>
                          {formatDate(day.date)}
                          {index === 0 && <span className="ml-2 text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">Today</span>}
                        </div>
                        <div className="text-xs text-gray-500">Daily Activity Summary</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm w-full sm:w-auto sm:justify-end justify-between">
                      {tabs.map((tab) => (
                        <div key={tab.id} className="flex items-center gap-1">
                          <div className={`w-2 h-2 rounded-full ${tab.color.primary}`}></div>
                          <span className="text-gray-700 font-medium">{day[tab.id]}</span>
                          <span className="text-gray-500 text-xs">{tab.unit}</span>
                        </div>
                      ))}
                      
                      {onDeleteActivity && (
                        <button 
                          onClick={() => onDeleteActivity(day.date)}
                          className="ml-2 p-1 text-gray-400 hover:text-red-500 transition-colors rounded-full hover:bg-red-50"
                          title="Delete activity"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActivityLog; 