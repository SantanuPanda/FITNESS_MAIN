import React, { useState } from 'react';
import { motion } from 'framer-motion';

const WorkoutSuggestions = ({ detailed = false, onStartWorkout = null }) => {
  const [activeTab, setActiveTab] = useState('forYou');
  
  // Simulated suggested workouts
  // In a real app, these would come from an API with personalized recommendations
  const suggestedWorkouts = {
    forYou: [
      {
        id: 1,
        name: 'Upper Body Power',
        duration: '45 min',
        level: 'Intermediate',
        focus: 'Strength',
        image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80'
      },
      {
        id: 2,
        name: 'Recovery Run',
        duration: '30 min',
        level: 'Beginner',
        focus: 'Cardio',
        image: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80'
      }
    ],
    trending: [
      {
        id: 3,
        name: 'HIIT Challenge',
        duration: '25 min',
        level: 'Advanced',
        focus: 'Cardio',
        image: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80'
      },
      {
        id: 4,
        name: 'Yoga Flow',
        duration: '40 min',
        level: 'All Levels',
        focus: 'Flexibility',
        image: 'https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80'
      }
    ],
    recovery: [
      {
        id: 5,
        name: 'Active Recovery',
        duration: '20 min',
        level: 'Beginner',
        focus: 'Recovery',
        image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80'
      },
      {
        id: 6,
        name: 'Mobility Flow',
        duration: '15 min',
        level: 'All Levels',
        focus: 'Mobility',
        image: 'https://images.unsplash.com/photo-1616699002805-0741e1e4a523?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80'
      }
    ]
  };

  const tabs = [
    { id: 'forYou', label: 'For You' },
    { id: 'trending', label: 'Trending' },
    { id: 'recovery', label: 'Recovery' }
  ];

  // Simulated workout details
  const workoutDetails = {
    1: {
      description: 'Focus on building upper body strength with compound movements targeting chest, shoulders, and back.',
      exercises: [
        { name: 'Bench Press', sets: 4, reps: '8-10', rest: '90 sec' },
        { name: 'Shoulder Press', sets: 3, reps: '10-12', rest: '60 sec' },
        { name: 'Bent Over Rows', sets: 4, reps: '8-10', rest: '90 sec' },
        { name: 'Lat Pulldowns', sets: 3, reps: '10-12', rest: '60 sec' },
        { name: 'Tricep Pushdowns', sets: 3, reps: '12-15', rest: '45 sec' },
        { name: 'Bicep Curls', sets: 3, reps: '12-15', rest: '45 sec' }
      ]
    },
    2: {
      description: 'A light-intensity run designed to promote recovery while maintaining cardiovascular fitness.',
      exercises: [
        { name: 'Warm-Up', duration: '5 min', intensity: 'Very Light' },
        { name: 'Easy Run', duration: '20 min', intensity: 'Light' },
        { name: 'Cool Down', duration: '5 min', intensity: 'Very Light' }
      ]
    }
  };

  const handleViewWorkout = (workout) => {
    // In a real app, this would navigate to a detailed workout page
    alert(`Viewing ${workout.name} details (In a real app, this would show a detailed view)`);
  };

  const handleStartWorkout = (workout) => {
    // If parent component provided a callback, use it
    if (onStartWorkout) {
      const workoutWithDetails = {
        ...workout,
        details: workoutDetails[workout.id] || {
          description: 'Standard workout routine',
          exercises: [{ name: 'General exercise routine', duration: workout.duration }]
        }
      };
      onStartWorkout(workoutWithDetails);
    } else {
      // Fallback for when no callback is provided
      alert(`Starting ${workout.name} workout (In a real app, this would launch a workout tracker)`);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Workout Suggestions</h2>
        {!detailed && (
          <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
            View All
          </button>
        )}
      </div>

      {detailed && (
        <div className="flex border-b mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === tab.id
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}

      <div className="space-y-4">
        {(detailed ? suggestedWorkouts[activeTab] : suggestedWorkouts.forYou.slice(0, 1)).map((workout) => (
          <motion.div
            key={workout.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
          >
            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/3 h-48 md:h-auto relative">
                <img
                  src={workout.image}
                  alt={workout.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 left-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    workout.focus === 'Strength' 
                      ? 'bg-blue-100 text-blue-800' 
                      : workout.focus === 'Cardio'
                        ? 'bg-orange-100 text-orange-800'
                        : workout.focus === 'Recovery' || workout.focus === 'Mobility'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-purple-100 text-purple-800'
                  }`}>
                    {workout.focus}
                  </span>
                </div>
              </div>
              
              <div className="p-4 md:w-2/3">
                <h3 className="font-medium text-lg mb-2">{workout.name}</h3>
                <div className="flex flex-wrap gap-y-1 gap-x-4 text-sm text-gray-500 mb-4">
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {workout.duration}
                  </div>
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    {workout.level}
                  </div>
                </div>
                
                {detailed && workoutDetails[workout.id] && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-3">
                      {workoutDetails[workout.id].description}
                    </p>
                    
                    <h4 className="font-medium text-sm mb-2">Workout Plan:</h4>
                    <div className="space-y-2">
                      {workoutDetails[workout.id].exercises.map((exercise, index) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span className="font-medium">{exercise.name}</span>
                          <span className="text-gray-500">
                            {exercise.sets && exercise.reps 
                              ? `${exercise.sets} × ${exercise.reps}`
                              : exercise.duration}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="flex space-x-3">
                  <button
                    onClick={() => handleViewWorkout(workout)}
                    className="px-3 py-1.5 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 text-sm font-medium"
                  >
                    Details
                  </button>
                  
                  <button
                    onClick={() => handleStartWorkout(workout)}
                    className="px-3 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm font-medium"
                  >
                    Start Workout
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      
      {!detailed && (
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500 mb-4">
            These suggestions are based on your recent activity and goals.
          </p>
          <button className="px-4 py-2 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 text-sm font-medium">
            See More Suggestions
          </button>
        </div>
      )}
    </div>
  );
};

export default WorkoutSuggestions; 