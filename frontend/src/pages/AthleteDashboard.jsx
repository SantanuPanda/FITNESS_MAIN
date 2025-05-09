import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';

// Dashboard Components
import WorkoutTracker from '../components/dashboard/athlete/WorkoutTracker';
import ActivityLog from '../components/dashboard/athlete/ActivityLog';
import RecoveryStatus from '../components/dashboard/athlete/RecoveryStatus';
import GoalProgress from '../components/dashboard/athlete/GoalProgress';
import WorkoutSuggestions from '../components/dashboard/athlete/WorkoutSuggestions';
import WorkoutTimer from '../components/dashboard/athlete/WorkoutTimer';
import WorkoutExercises from '../components/dashboard/athlete/WorkoutExercises';

// Scroll helper component
const ScrollIndicator = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [scrollPosition, setScrollPosition] = useState(0);
  
  useEffect(() => {
    const handleScroll = () => {
      const position = window.scrollY;
      setScrollPosition(position);
      
      // Hide after scrolling down a bit
      if (position > 50) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    
    // Start visible
    setIsVisible(true);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  if (!isVisible) return null;
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-gray-900 to-emerald-800 text-white px-4 py-2 rounded-full shadow-lg z-50 flex items-center space-x-2 border border-emerald-500/30"
    >
      <svg className="w-5 h-5 animate-bounce text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
      </svg>
      <span className="text-sm font-medium">Scroll down to see all content</span>
    </motion.div>
  );
};

const AthleteDashboard = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  
  // State for dashboard data with localStorage persistence
  const [dashboardData, setDashboardData] = useState(() => {
    // Try to get data from localStorage first
    const savedData = localStorage.getItem('dashboardData');
    return savedData ? JSON.parse(savedData) : {
    recentWorkouts: [],
    activityLog: [],
    recoveryStatus: {},
    goals: []
    };
  });
  
  // Active workout state
  const [activeWorkout, setActiveWorkout] = useState(null);
  
  // Form states for creating new data
  const [showInlineWorkoutForm, setShowInlineWorkoutForm] = useState(false);
  const [showInlineGoalForm, setShowInlineGoalForm] = useState(false);
  const [newWorkoutData, setNewWorkoutData] = useState({
    name: '',
    duration: '',
    intensity: 'Medium',
    target: '',
    notes: ''
  });
  const [newGoalData, setNewGoalData] = useState({
    name: '',
    target: '',
    current: '',
    category: 'strength',
    deadline: ''
  });
  
  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState({
    title: '',
    content: null,
    onConfirm: null
  });
  
  // BMI Calculator state
  const [bmiData, setBmiData] = useState({
    height: '',
    weight: '',
    bmi: null,
    category: ''
  });

  // Today's Status state with localStorage persistence
  const [todayStatus, setTodayStatus] = useState(() => {
    // Try to get data from localStorage first
    const savedStatus = localStorage.getItem('todayStatus');
    return savedStatus ? JSON.parse(savedStatus) : {
      energyLevel: 85,
      hydration: 72,
      recovery: 78
    };
  });

  // AI Assistant state
  const [chatMessages, setChatMessages] = useState([
    { 
      sender: 'ai', 
      content: "Hello! I'm your AI fitness assistant. How can I help you with your fitness journey today?" 
    },
    { 
      sender: 'user', 
      content: "Can you recommend a workout routine for building more muscle?" 
    },
    {
      sender: 'ai',
      content: "I'd be happy to help! For muscle building, I recommend a split routine focusing on different muscle groups:\n\n• Monday: Chest and Triceps\n• Tuesday: Back and Biceps\n• Wednesday: Rest or Light Cardio\n• Thursday: Shoulders and Abs\n• Friday: Legs\n• Saturday/Sunday: Rest and Recovery\n\nFor each muscle group, perform 3-4 exercises with 3-4 sets of 8-12 reps. Make sure to progressively increase weight as you get stronger."
    }
  ]);
  const [messageInput, setMessageInput] = useState('');
  const chatEndRef = useRef(null);
  const [showScrollIndicator, setShowScrollIndicator] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  
  // Add useEffect for todayStatus persistence after the existing useEffect for dashboardData (line ~92)
  // Save dashboard data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('dashboardData', JSON.stringify(dashboardData));
  }, [dashboardData]);
  
  // Save today's status to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('todayStatus', JSON.stringify(todayStatus));
  }, [todayStatus]);

  // Scroll to bottom of chat when messages change
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  useEffect(() => {
    // DEMO MODE: Skip authentication check
    // In production, uncomment this code to require authentication
    // if (!currentUser) {
    //   navigate('/login');
    //   return;
    // }

    // Redirect from metrics tab (removed) to overview tab
    if (activeTab === 'metrics') {
      setActiveTab('overview');
    }

    // For demo purposes, setting mock data if no data exists
    // In a real app, this would fetch from backend API
    if (!localStorage.getItem('dashboardData')) {
    const mockData = {
      recentWorkouts: [
        { id: 1, name: 'Upper Body Strength', date: '2023-10-10', duration: '45 min', intensity: 'High' },
        { id: 2, name: 'Long-Distance Run', date: '2023-10-08', duration: '60 min', intensity: 'Medium' },
        { id: 3, name: 'HIIT Cardio', date: '2023-10-05', duration: '30 min', intensity: 'Very High' }
      ],
      activityLog: [
        { date: '2023-10-10', steps: 8500, calories: 2200, activeMinutes: 95 },
        { date: '2023-10-09', steps: 7200, calories: 2100, activeMinutes: 80 },
        { date: '2023-10-08', steps: 9100, calories: 2300, activeMinutes: 110 }
      ],
      recoveryStatus: {
        sleepQuality: 85,
        muscleRecovery: 72,
        readinessScore: 78,
        recommendedIntensity: 'Medium'
      },
      goals: [
        { id: 1, name: 'Bench Press Goal', target: '100kg', current: '85kg', progress: 85 },
        { id: 2, name: '5K Run Time', target: '22min', current: '24min', progress: 90 },
        { id: 3, name: 'Weekly Workouts', target: '5 sessions', current: '4 sessions', progress: 80 }
      ]
    };

      // Set the mock data in state and localStorage
      setDashboardData(mockData);
      localStorage.setItem('dashboardData', JSON.stringify(mockData));
    }

    // Simulate API call delay
    setTimeout(() => {
      setLoading(false);
    }, 800);
  }, [currentUser, navigate, activeTab]);

  // Handle input change for workout form
  const handleWorkoutInputChange = (e) => {
    const { name, value } = e.target;
    setNewWorkoutData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle adding a new workout
  const handleAddWorkout = (e) => {
    e.preventDefault();
    
    const today = new Date().toISOString().split('T')[0];
    const newWorkout = {
      id: Date.now(), // Generate unique ID
      name: newWorkoutData.name,
      date: today,
      duration: newWorkoutData.duration,
      intensity: newWorkoutData.intensity,
      target: newWorkoutData.target,
      notes: newWorkoutData.notes
    };
    
    setDashboardData(prev => ({
      ...prev,
      recentWorkouts: [newWorkout, ...prev.recentWorkouts]
    }));
    
    // Reset form
    setNewWorkoutData({
      name: '',
      duration: '',
      intensity: 'Medium',
      target: '',
      notes: ''
    });
    
    // Hide the inline form
    setShowInlineWorkoutForm(false);
    
    // Save to localStorage
    const updatedData = {
      ...dashboardData,
      recentWorkouts: [newWorkout, ...dashboardData.recentWorkouts]
    };
    localStorage.setItem('dashboardData', JSON.stringify(updatedData));
  };

  // Handle starting a workout from suggestions
  const handleStartWorkout = (workout) => {
    // Ensure duration is properly formatted for the timer
    let formattedDuration = workout.duration;
    if (workout.duration) {
      // If duration doesn't contain "min" or "hr", add " min" suffix
      if (!workout.duration.match(/min|hr|minute/i)) {
        formattedDuration = `${workout.duration} min`;
      }
    }
    
    setActiveWorkout({
      ...workout,
      duration: formattedDuration, // Use formatted duration
      startTime: new Date().toISOString(),
      isTimerActive: true,
      details: {
        description: workout.description || '',
        exercises: workout.details?.exercises || []
      }
    });
    // Automatically switch to workouts tab to show active workout
    setActiveTab('workouts');
  };

  // Handle ending/completing the active workout
  const handleFinishWorkout = () => {
    // Add the completed workout to recent workouts
    if (activeWorkout) {
      const completedWorkout = {
        id: Date.now(),
        name: activeWorkout.name,
        date: new Date().toISOString().split('T')[0],
        duration: activeWorkout.duration,
        intensity: activeWorkout.level === 'Beginner' ? 'Low' : 
                  activeWorkout.level === 'Intermediate' ? 'Medium' : 
                  activeWorkout.level === 'Light' ? 'Low' :
                  activeWorkout.level === 'High' ? 'High' : 'Medium',
        target: activeWorkout.focus || activeWorkout.target || 'General'
      };
      
      // Update dashboard data with the new workout
      const updatedData = {
        ...dashboardData,
        recentWorkouts: [completedWorkout, ...(dashboardData.recentWorkouts || [])]
      };
      
      // Update state and localStorage
      setDashboardData(updatedData);
      localStorage.setItem('dashboardData', JSON.stringify(updatedData));
      
      // Update recovery metrics if this was a recovery session
      if (activeWorkout.focus === 'Recovery') {
        const recoveryBoost = Math.floor(Math.random() * 10) + 10; // Random boost between 10-20
        const recoveryUpdate = {
          ...updatedData,
          recoveryStatus: {
            ...updatedData.recoveryStatus,
            muscleRecovery: Math.min(100, (updatedData.recoveryStatus?.muscleRecovery || 0) + recoveryBoost),
            readinessScore: Math.min(100, (updatedData.recoveryStatus?.readinessScore || 0) + recoveryBoost)
          }
        };
        
        // Update state and localStorage with recovery data
        setDashboardData(recoveryUpdate);
        localStorage.setItem('dashboardData', JSON.stringify(recoveryUpdate));
      }
      
      // Switch to dashboard tab to show recent workouts in overview
      setActiveTab('dashboard');
      
      // Don't show success message, just complete the workout
    }
    
    setActiveWorkout(null);
  };
  
  // Delete a workout
  const handleDeleteWorkout = (workoutId) => {
    // Directly delete without confirmation
    const updatedWorkouts = dashboardData.recentWorkouts.filter(workout => workout.id !== workoutId);
    
    const updatedData = {
      ...dashboardData,
      recentWorkouts: updatedWorkouts
    };
    
    // Update state and localStorage
    setDashboardData(updatedData);
    localStorage.setItem('dashboardData', JSON.stringify(updatedData));
  };

  // Add exercise to active workout
  const handleAddExercise = (exerciseName, exerciseDuration) => {
    if (activeWorkout && exerciseName && exerciseDuration) {
      const newExercise = {
        name: exerciseName,
        duration: exerciseDuration,
        completed: false
      };
      
      setActiveWorkout({
        ...activeWorkout,
        details: {
          ...activeWorkout.details,
          exercises: [...(activeWorkout.details?.exercises || []), newExercise]
        }
      });
    }
  };
  
  // Update existing exercise in active workout
  const handleUpdateExercise = (index, exerciseName, exerciseDuration) => {
    if (activeWorkout && activeWorkout.details?.exercises && index >= 0) {
      const updatedExercises = [...activeWorkout.details.exercises];
      updatedExercises[index] = {
        ...updatedExercises[index],
        name: exerciseName,
        duration: exerciseDuration
      };
      
      setActiveWorkout({
        ...activeWorkout,
        details: {
          ...activeWorkout.details,
          exercises: updatedExercises
        }
      });
    }
  };
  
  // Delete exercise from active workout
  const handleDeleteExercise = (index) => {
    if (activeWorkout && activeWorkout.details?.exercises && index >= 0) {
      const updatedExercises = activeWorkout.details.exercises.filter((_, i) => i !== index);
      
      setActiveWorkout({
        ...activeWorkout,
        details: {
          ...activeWorkout.details,
          exercises: updatedExercises
        }
      });
    }
  };

  // Calculate BMI 
  const calculateBMI = () => {
    const { height, weight } = bmiData;
    
    if (height && weight && height > 0 && weight > 0) {
      const heightInMeters = height / 100;
      const bmiValue = (weight / (heightInMeters * heightInMeters)).toFixed(1);
      
      let category = '';
      if (bmiValue < 18.5) {
        category = 'Underweight';
      } else if (bmiValue >= 18.5 && bmiValue < 25) {
        category = 'Normal';
      } else if (bmiValue >= 25 && bmiValue < 30) {
        category = 'Overweight';
      } else {
        category = 'Obese';
      }
      
      setBmiData(prev => ({ ...prev, bmi: bmiValue, category }));
      
      // Save BMI history
      const today = new Date().toISOString().split('T')[0];
      const bmiEntry = { date: today, bmi: bmiValue, weight: weight };
      
      const bmiHistory = JSON.parse(localStorage.getItem('bmiHistory') || '[]');
      localStorage.setItem('bmiHistory', JSON.stringify([...bmiHistory, bmiEntry]));
    }
  };

  // Delete BMI history
  const handleDeleteBmiHistory = () => {
    // Clear the BMI history from localStorage
    localStorage.removeItem('bmiHistory');
    
    // Show confirmation message
    const toast = document.createElement('div');
    toast.className = 'fixed bottom-4 right-4 bg-green-50 text-green-800 px-4 py-2 rounded-lg shadow-md text-sm border border-green-200';
    toast.textContent = 'BMI history deleted';
    document.body.appendChild(toast);
    
    // Remove notification after 2 seconds
    setTimeout(() => {
      toast.remove();
    }, 2000);
  };

  // Handle BMI input changes
  const handleBmiInputChange = (e) => {
    const { name, value } = e.target;
    setBmiData(prev => ({ ...prev, [name]: value }));
  };
  
  // Close any modal
  const closeModal = () => {
    setShowModal(false);
    setShowScrollIndicator(false);
  };

  // Handle goal input changes
  const handleGoalInputChange = (e) => {
    const { name, value } = e.target;
    setNewGoalData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle adding a new goal
  const handleAddGoal = (e) => {
    e.preventDefault();
    
    const goalWithId = {
      ...newGoalData,
      id: Date.now(),
      progress: Math.round((parseFloat(newGoalData.current) / parseFloat(newGoalData.target)) * 100) || 0
    };
    
    const updatedData = {
      ...dashboardData,
      goals: [...dashboardData.goals, goalWithId]
    };
    
    // Update state and localStorage
    setDashboardData(updatedData);
    localStorage.setItem('dashboardData', JSON.stringify(updatedData));
    
    // Reset form
    setNewGoalData({
      name: '',
      target: '',
      current: '',
      category: 'strength',
      deadline: ''
    });
    
    // Hide the inline form
    setShowInlineGoalForm(false);
  };
  
  // Handle updating goal progress
  const handleUpdateGoalProgress = (goalId, newProgress, newCurrent) => {
    setDashboardData(prev => ({
      ...prev,
      goals: prev.goals.map(goal => 
        goal.id === goalId 
          ? { ...goal, progress: newProgress, current: newCurrent }
          : goal
      )
    }));
  };
  
  // Handle deleting a goal
  const handleDeleteGoal = (goalId) => {
    // Directly delete without confirmation
    const updatedGoals = dashboardData.goals.filter(goal => goal.id !== goalId);
    
    const updatedData = {
      ...dashboardData,
      goals: updatedGoals
    };
    
    // Update state and localStorage
    setDashboardData(updatedData);
    localStorage.setItem('dashboardData', JSON.stringify(updatedData));
  };
  
  // Handle updating activity log
  const handleUpdateActivityLog = (newActivity) => {
    // Add date if not provided
    if (!newActivity.date) {
      newActivity.date = new Date().toISOString().split('T')[0];
    }
    
    setDashboardData(prev => ({
      ...prev,
      activityLog: [newActivity, ...prev.activityLog]
    }));
  };
  
  // Handle deleting activity from log
  const handleDeleteActivity = (date) => {
    setModalContent({
      title: 'Confirm Delete',
      content: <p>Are you sure you want to delete this activity record? This action cannot be undone.</p>,
      onConfirm: () => {
        setDashboardData(prev => ({
          ...prev,
          activityLog: prev.activityLog.filter(activity => activity.date !== date)
        }));
        
        setShowModal(false);
        
        // Show success message
        setTimeout(() => {
          setModalContent({
            title: 'Activity Deleted',
            content: <p>Your activity record has been deleted successfully.</p>,
            onConfirm: () => setShowModal(false)
          });
          setShowModal(true);
        }, 500);
      }
    });
    setShowModal(true);
  };
  
  // Handle updating recovery status
  const handleUpdateRecovery = (newRecoveryData) => {
    setDashboardData(prev => ({
      ...prev,
      recoveryStatus: {
        ...prev.recoveryStatus,
        ...newRecoveryData
      }
    }));
  };

  // Handle starting active recovery session
  const handleStartActiveRecovery = (recoverySession) => {
    // Set the active workout to be the recovery session
    setActiveWorkout(recoverySession);
    // Switch to workouts tab to show the active recovery session
    setActiveTab('workouts');
  };
  
  // Handle deleting recovery data
  const handleDeleteRecovery = () => {
    // Reset recovery data to default values without confirmation
    const updatedData = {
      ...dashboardData,
      recoveryStatus: {
        sleepQuality: 0,
        muscleRecovery: 0,
        readinessScore: 0,
        recommendedIntensity: 'Low'
      }
    };
    
    // Update state and localStorage
    setDashboardData(updatedData);
    localStorage.setItem('dashboardData', JSON.stringify(updatedData));
  };

  // Handle updating today's status
  const handleUpdateTodayStatus = (statusType, value) => {
    setTodayStatus(prev => ({
      ...prev,
      [statusType]: value
    }));
    
    // Optional: Show a small notification that status was updated
    const toast = document.createElement('div');
    toast.className = 'fixed bottom-4 right-4 bg-green-50 text-green-800 px-4 py-2 rounded-lg shadow-md text-sm border border-green-200';
    toast.textContent = `${statusType.charAt(0).toUpperCase() + statusType.slice(1)} updated`;
    document.body.appendChild(toast);
    
    // Remove notification after 2 seconds
    setTimeout(() => {
      toast.remove();
    }, 2000);
  };

  // Close notifications when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      const notificationButton = document.getElementById('athlete-notification-button');
      const notificationPanel = document.getElementById('athlete-notification-panel');
      
      if (showNotifications && 
          notificationButton && 
          notificationPanel && 
          !notificationButton.contains(event.target) && 
          !notificationPanel.contains(event.target)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showNotifications]);

  // Dashboard tabs
  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z' },
    { id: 'workouts', label: 'Workouts', icon: 'M9.17 17.17a4.002 4.002 0 015.66 0M9 12a1 1 0 110-2 1 1 0 010 2zm6 0a1 1 0 110-2 1 1 0 010 2z' },
    { id: 'goals', label: 'Goals', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
    { id: 'bmi', label: 'BMI Calculator', icon: 'M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z' },
    { id: 'ai', label: 'AI Assistance', icon: 'M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z M9.75 15.75a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM14.25 15.75a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM8.25 9.75a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM15.75 9.75a1.5 1.5 0 100-3 1.5 1.5 0 000 3z' }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-blue-600 font-medium">Loading your fitness dashboard...</p>
        </div>
      </div>
    );
  }

  // New Workout Form
  // This function has been replaced with an inline form approach
  
  // Modal component
  const renderModal = () => (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-start justify-center z-50 p-4">
      {showScrollIndicator && <ScrollIndicator />}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-gradient-to-br from-blue-50 via-white to-purple-50 rounded-xl shadow-xl w-full max-w-md overflow-hidden border border-blue-100/40"
        onAnimationComplete={() => {
          // Check if modal is taller than viewport
          const modalHeight = document.querySelector('.bg-gradient-to-br.rounded-xl')?.clientHeight || 0;
          const viewportHeight = window.innerHeight;
          if (modalHeight > viewportHeight - 50) {
            setShowScrollIndicator(true);
          }
        }}
      >
        <div className="p-6" style={{backgroundImage: "url('data:image/svg+xml,%3Csvg width=\"30\" height=\"30\" viewBox=\"0 0 30 30\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cpath d=\"M15 0C6.716 0 0 6.716 0 15c0 8.284 6.716 15 15 15 8.284 0 15-6.716 15-15 0-8.284-6.716-15-15-15zm0 2c7.18 0 13 5.82 13 13s-5.82 13-13 13S2 22.18 2 15 7.82 2 15 2z\" opacity=\".05\"/%3E%3C/svg%3E')", backgroundBlendMode: "soft-light"}}>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">{modalContent.title}</h2>
          <div className="mb-6">
            {modalContent.content}
          </div>
          <div className="flex justify-end gap-3">
            <button
              onClick={closeModal}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 hover:border-gray-400 transition-all"
            >
              Cancel
            </button>
            {modalContent.onConfirm && (
              <button
                onClick={modalContent.onConfirm}
                className="px-4 py-2 bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-500 text-white rounded-md hover:shadow-md hover:translate-y-[-1px] active:translate-y-0 transition-all"
              >
                Confirm
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );

  // New Goal Form component
  const GoalForm = ({ onSubmit, onCancel }) => {
    const [goalData, setGoalData] = useState({
      name: '',
      target: '',
      current: '',
      deadline: ''
    });
    
    const handleChange = (e) => {
      const { name, value } = e.target;
      setGoalData(prev => ({ ...prev, [name]: value }));
    };
    
    const handleSubmit = (e) => {
      e.preventDefault();
      onSubmit(goalData);
    };
    
    return (
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Create New Goal</h2>
          <button 
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Goal Name
              </label>
              <input
                type="text"
                name="name"
                value={goalData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Target Value
              </label>
              <input
                type="text"
                name="target"
                value={goalData.target}
                onChange={handleChange}
                placeholder="e.g. 100kg, 30min, 5 sessions"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Current Value
              </label>
              <input
                type="text"
                name="current"
                value={goalData.current}
                onChange={handleChange}
                placeholder="e.g. 80kg, 35min, 3 sessions"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Target Date (optional)
              </label>
              <input
                type="date"
                name="deadline"
                value={goalData.deadline}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>
          
          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Create Goal
            </button>
          </div>
        </form>
      </div>
    );
  };

  // Enhanced AI response generation with more categories
  const generateAiResponse = (userInput) => {
    const input = userInput.toLowerCase();
    
    // Expanded response patterns with more categories
    const responses = {
      weight: {
        patterns: ['lose weight', 'weight loss', 'fat loss', 'burn fat', 'slim down', 'diet plan', 'calorie deficit'],
        response: `For effective weight loss, I recommend a comprehensive approach:

• Nutrition:
  - Caloric deficit (300-500 calories below maintenance)
  - High protein intake (1.6-2g per kg of bodyweight)
  - Balanced macros: 40% carbs, 30% protein, 30% fat
  - Focus on whole, unprocessed foods
  - Stay hydrated (2-3L water daily)
  - Track your food intake
  - Plan meals in advance
  - Include fiber-rich foods

• Training:
  - 3-4 days of strength training
  - 2-3 days of cardio (HIIT + steady state)
  - Focus on compound movements
  - Progressive overload
  - Include full-body workouts
  - Track your progress
  - Vary your routine

• Lifestyle:
  - 7-8 hours of quality sleep
  - Stress management
  - Consistent meal timing
  - Regular activity throughout the day
  - Mindful eating
  - Stay consistent
  - Set realistic goals

Would you like me to create a personalized plan based on your current stats?`
      },
      nutrition: {
        patterns: ['meal', 'nutrition', 'diet', 'food', 'eat', 'macros', 'protein', 'carbs', 'fats', 'meal prep'],
        response: `Here's a comprehensive nutrition guide:

• Macronutrient Distribution:
  - Protein: 20-30% of calories
    Sources: lean meats, fish, eggs, dairy, legumes
    Timing: spread throughout the day
  - Carbs: 40-50% of calories
    Sources: whole grains, fruits, vegetables
    Focus on complex carbs
  - Fats: 20-30% of calories
    Sources: avocados, nuts, olive oil, fatty fish
    Include omega-3s

• Meal Planning:
  - 3-4 balanced meals per day
  - Include protein in every meal
  - 25-35g fiber daily
  - Pre/post workout nutrition
  - Healthy snacks between meals
  - Portion control
  - Meal prep tips

• Hydration:
  - Minimum 8 glasses water daily
  - More during workouts
  - Include electrolytes for intense sessions
  - Monitor urine color
  - Hydration schedule

• Supplements:
  - Protein powder (if needed)
  - Multivitamin
  - Omega-3
  - Vitamin D
  - Pre-workout (optional)

Would you like a sample meal plan or specific macro calculations?`
      },
      strength: {
        patterns: ['muscle', 'strength', 'stronger', 'build muscle', 'gains', 'powerlifting', 'bodybuilding'],
        response: `Muscle Building Strategy:

• Training Protocol:
  - Progressive overload program
  - 2-3 sessions per muscle group weekly
  - Focus on compound movements
  - 3-4 sets of 8-12 reps
  - 60-90 seconds rest between sets
  - Track your lifts
  - Periodize your training

• Key Exercises:
  - Lower Body: Squats, Deadlifts, Lunges, Leg Press
  - Upper Body: Bench Press, Rows, Pull-ups, Shoulder Press
  - Core: Planks, Hanging Leg Raises, Russian Twists
  - Accessory: Bicep Curls, Tricep Extensions, Calf Raises

• Nutrition:
  - Caloric surplus (200-300 calories)
  - 1.6-2.2g protein per kg
  - Post-workout nutrition
  - Proper hydration
  - Meal timing
  - Supplementation

• Recovery:
  - 48-72 hours between muscle groups
  - 7-9 hours sleep
  - Active recovery days
  - Proper warm-up/cool-down
  - Foam rolling
  - Stretching

Would you like a specific training program?`
      },
      cardio: {
        patterns: ['cardio', 'running', 'endurance', 'hiit', 'aerobic', 'cycling', 'swimming', 'interval'],
        response: `Cardio Training Guide:

• Training Structure:
  - 2-3 HIIT sessions weekly
  - 2-3 steady-state sessions
  - Progressive intensity increase
  - Cross-training variety
  - Track your progress
  - Vary your routine

• HIIT Protocol:
  - 20-30 minutes duration
  - 1:2 work:rest ratio
  - 4-6 exercises per session
  - Full body movements
  - Tabata intervals
  - Circuit training

• Steady State:
  - 30-45 minutes duration
  - Moderate intensity
  - Focus on form and breathing
  - Progressive duration increase
  - Heart rate zones
  - Endurance building

• Recovery:
  - Proper warm-up/cool-down
  - Hydration and nutrition
  - Active recovery days
  - Listen to your body
  - Stretching routine
  - Foam rolling

What's your current cardio routine?`
      },
      recovery: {
        patterns: ['recovery', 'sore', 'pain', 'injury', 'rest', 'stretch', 'mobility', 'flexibility'],
        response: `Recovery Protocol:

• Active Recovery:
  - Light cardio (walking, cycling)
  - Mobility exercises
  - Dynamic stretching
  - Foam rolling
  - Yoga
  - Pilates

• Nutrition:
  - Post-workout protein
  - Anti-inflammatory foods
  - Proper hydration
  - Electrolyte balance
  - BCAA supplementation
  - Tart cherry juice

• Rest:
  - 7-9 hours quality sleep
  - Rest days between intense sessions
  - Listen to your body
  - Stress management
  - Meditation
  - Breathing exercises

• Injury Prevention:
  - Proper warm-up
  - Progressive overload
  - Form focus
  - Regular mobility work
  - Strength imbalances
  - Movement patterns

Would you like specific recovery exercises?`
      },
      beginner: {
        patterns: ['beginner', 'start', 'new', 'first time', 'never worked out'],
        response: `Getting Started Guide:

• First Steps:
  - Start with bodyweight exercises
  - Focus on form and technique
  - Begin with 2-3 sessions per week
  - Keep workouts short (30-45 minutes)
  - Track your progress
  - Set realistic goals

• Basic Exercises:
  - Squats
  - Push-ups
  - Planks
  - Lunges
  - Rows
  - Core exercises

• Progression:
  - Start light
  - Focus on form
  - Gradually increase intensity
  - Add weight slowly
  - Track your progress
  - Celebrate small wins

Would you like a beginner workout plan?`
      },
      advanced: {
        patterns: ['advanced', 'experienced', 'plateau', 'next level', 'maximize'],
        response: `Advanced Training Strategies:

• Training Methods:
  - Supersets
  - Drop sets
  - Pyramid training
  - Rest-pause
  - Eccentric focus
  - Time under tension

• Periodization:
  - Strength phases
  - Hypertrophy phases
  - Power phases
  - Deload weeks
  - Progressive overload
  - Variation

• Advanced Techniques:
  - Pre-exhaustion
  - Post-exhaustion
  - Forced reps
  - Partial reps
  - Isometric holds
  - Tempo training

Would you like specific advanced training protocols?`
      },
      general: {
        patterns: ['help', 'advice', 'suggest', 'recommend', 'tips', 'guide'],
        response: `I'd be happy to help! To give you the best advice, please share:
• Your fitness goals
• Current experience level
• Available equipment
• Time commitment
• Any specific challenges
• Previous injuries
• Dietary restrictions
• Schedule constraints

This will help me create a personalized plan for you.`
      }
    };

    // Find matching response
    for (const [category, data] of Object.entries(responses)) {
      if (data.patterns.some(pattern => input.includes(pattern))) {
        return data.response;
      }
    }

    return "I'd love to help you with your fitness journey! Could you tell me more about your specific goals and current routine? This will help me provide more personalized advice.";
  };

  // Enhanced popular questions with more variety
  const popularQuestions = [
    "How can I lose weight effectively?",
    "What's the best nutrition plan for muscle gain?",
    "How often should I do cardio?",
    "What's a good recovery routine?",
    "How can I build strength?",
    "What should I eat before and after workouts?",
    "How do I prevent workout injuries?",
    "What's the best way to track progress?",
    "How much protein do I need?",
    "What's a good warm-up routine?",
    "How do I break through a plateau?",
    "What's the best workout split?",
    "How do I improve my mobility?",
    "What supplements should I take?",
    "How do I stay motivated?",
    "What's the best way to build endurance?",
    "How do I fix muscle imbalances?",
    "What's the best time to workout?",
    "How do I improve my form?",
    "What's the best way to track macros?"
  ];

  // Enhanced chat UI component
  const renderChatInterface = () => (
    <div className="flex flex-col h-full">
      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {chatMessages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                message.sender === 'user'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              <div className="whitespace-pre-line">{message.content}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Action Buttons */}
      <div className="p-4 border-t">
        <div className="grid grid-cols-2 gap-2 mb-4">
          {popularQuestions.slice(0, 4).map((question, index) => (
            <button
              key={index}
              onClick={() => handlePopularQuestionClick(question)}
              className="px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              {question}
            </button>
          ))}
        </div>

        {/* Message Input */}
        <div className="flex space-x-2">
          <input
            type="text"
            value={messageInput}
            onChange={handleMessageInputChange}
            onKeyDown={handleMessageKeyDown}
            placeholder="Ask me anything about fitness..."
            className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleSendMessage}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );

  // Handle sending a message to AI assistant
  const handleSendMessage = () => {
    if (!messageInput.trim()) return;
    
    // Add user message to chat
    setChatMessages(prev => [...prev, { sender: 'user', content: messageInput }]);
    
    // Clear input field
    const userQuestion = messageInput;
    setMessageInput('');
    
    // Simulate AI processing time
    setTimeout(() => {
      // Generate AI response based on user input
      const aiResponse = generateAiResponse(userQuestion);
      
      // Add AI response to chat
      setChatMessages(prev => [...prev, { sender: 'ai', content: aiResponse }]);
    }, 1000);
  };
  
  // Handle AI message input change
  const handleMessageInputChange = (e) => {
    setMessageInput(e.target.value);
  };
  
  // Handle pressing Enter to send message
  const handleMessageKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  // Handle clicking on popular questions
  const handlePopularQuestionClick = (question) => {
    // Add the question as a user message
    setChatMessages(prev => [...prev, { sender: 'user', content: question }]);
    
    // Generate and add AI response
    setTimeout(() => {
      const aiResponse = generateAiResponse(question);
      setChatMessages(prev => [...prev, { sender: 'ai', content: aiResponse }]);
    }, 1000);
  };
  
  // Handle generating workout plan
  const handleGenerateWorkoutPlan = () => {
    setChatMessages(prev => [...prev, { 
      sender: 'user', 
      content: "Can you generate a personalized workout plan for me?" 
    }]);
    
    setTimeout(() => {
      setChatMessages(prev => [...prev, { 
        sender: 'ai', 
        content: "I'd be happy to create a personalized workout plan for you! Here's a balanced 4-day split:\n\n**Day 1: Upper Body Push**\n• Bench Press: 4 sets of 8-10 reps\n• Overhead Press: 3 sets of 8-10 reps\n• Incline Dumbbell Press: 3 sets of 10-12 reps\n• Lateral Raises: 3 sets of 12-15 reps\n• Tricep Pushdowns: 3 sets of 12-15 reps\n• Overhead Tricep Extensions: 3 sets of 12-15 reps\n\n**Day 2: Lower Body**\n• Squats: 4 sets of 8-10 reps\n• Romanian Deadlifts: 3 sets of 8-10 reps\n• Leg Press: 3 sets of 10-12 reps\n• Walking Lunges: 3 sets of 10 each leg\n• Leg Curls: 3 sets of 12-15 reps\n• Calf Raises: 4 sets of 15-20 reps\n\n**Day 3: Rest or Active Recovery**\n\n**Day 4: Upper Body Pull**\n• Pull-ups/Assisted Pull-ups: 4 sets of 8-10 reps\n• Bent Over Rows: 4 sets of 8-10 reps\n• Lat Pulldowns: 3 sets of 10-12 reps\n• Face Pulls: 3 sets of 12-15 reps\n• Bicep Curls: 3 sets of 12-15 reps\n• Hammer Curls: 3 sets of 12-15 reps\n\n**Day 5: Full Body**\n• Deadlifts: 4 sets of 6-8 reps\n• Dumbbell Bench Press: 3 sets of 8-10 reps\n• Pull-ups: 3 sets of 8-10 reps\n• Walking Lunges: 3 sets of 10 each leg\n• Shoulder Press: 3 sets of 8-10 reps\n• Plank: 3 sets of 30-60 seconds\n\nWould you like me to adjust this plan based on your specific goals or available equipment?" 
      }]);
    }, 1000);
  };
  
  // Handle creating meal plan
  const handleCreateMealPlan = () => {
    setChatMessages(prev => [...prev, { 
      sender: 'user', 
      content: "Can you create a meal plan for me?" 
    }]);
    
    setTimeout(() => {
      setChatMessages(prev => [...prev, { 
        sender: 'ai', 
        content: "Here's a balanced meal plan to support your fitness goals:\n\n**Breakfast Options:**\n• Option 1: Greek yogurt with berries, honey, and granola\n• Option 2: Oatmeal with banana, almond butter, and chia seeds\n• Option 3: Vegetable omelet with whole grain toast\n\n**Lunch Options:**\n• Option 1: Grilled chicken salad with mixed vegetables and olive oil dressing\n• Option 2: Quinoa bowl with roasted vegetables and tofu\n• Option 3: Turkey and avocado wrap with side salad\n\n**Dinner Options:**\n• Option 1: Baked salmon with sweet potato and steamed broccoli\n• Option 2: Lean beef stir-fry with brown rice and mixed vegetables\n• Option 3: Chickpea and vegetable curry with brown rice\n\n**Snack Options:**\n• Apple or banana with natural peanut butter\n• Greek yogurt with berries\n• Handful of nuts and dried fruit\n• Protein smoothie with banana and spinach\n• Hummus with carrot and cucumber sticks\n\n**Hydration:**\n• 2-3 liters of water daily\n• Green tea (excellent antioxidants)\n• Limit sugary drinks and alcohol\n\nWould you like me to provide more specific portion sizes or macronutrient breakdowns based on your goals?" 
      }]);
    }, 1000);
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 min-h-screen flex flex-col">
      {/* Top Navigation Bar */}
      <div className="bg-white shadow-sm sticky top-0 z-30">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          {/* Website Logo */}
          <div className="flex items-center">
            <img src="/logo.png" alt="Fitness Logo" className="w-10 h-10" />
          </div>
          
          {/* User Profile and Actions */}
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center relative">
              <button 
                id="athlete-notification-button"
                className="flex items-center gap-2 text-gray-600 hover:text-blue-600 mr-4"
                onClick={() => setShowNotifications(!showNotifications)}
                aria-label="Notifications"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
                </svg>
              </button>
              
              {/* Notifications Dropdown */}
              {showNotifications && (
                <div 
                  id="athlete-notification-panel"
                  className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-lg py-2 top-full z-50 border border-gray-200"
                >
                  <div className="px-4 py-2 border-b border-gray-200">
                    <h3 className="text-sm font-semibold text-gray-700">Notifications</h3>
                  </div>
                  <div className="px-4 py-6 text-center text-gray-500">
                    <svg className="w-10 h-10 mx-auto text-gray-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
                    </svg>
                    <p className="text-sm">No notifications have arrived.</p>
                  </div>
                </div>
              )}
              
              <span className="text-sm text-gray-600 mr-2">Welcome back</span>
            </div>
            <div className="flex items-center gap-2 bg-gradient-to-r from-blue-50 to-indigo-50 py-1 px-3 rounded-full">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-md">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="hidden md:inline text-sm font-medium text-gray-700">Athlete</span>
            </div>
          </div>
        </div>

      </div>

        {/* Dashboard Content */}
        <div className="flex-1 flex flex-col md:flex-row">
          {/* Sidebar */}
          <motion.div 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-white shadow-lg md:w-64 md:min-h-screen z-20"
          >
            <div className="p-4 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
              <h1 className="text-xl font-bold">Athlete Dashboard</h1>
              <p className="text-sm mt-1 opacity-90">Performance Tracker</p>
            </div>
            <nav className="py-4">
              {tabs.map((tab) => (
                <motion.button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full px-4 py-3 flex items-center space-x-3 transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-blue-50 text-blue-600 font-medium border-l-4 border-blue-600'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <svg
                    className={`w-5 h-5 ${activeTab === tab.id ? 'text-blue-600' : 'text-gray-500'}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={tab.icon} />
                  </svg>
                  <span>{tab.label}</span>
                </motion.button>
              ))}
            </nav>
            
            {/* Quick Stats Card */}
            <div className="mt-6 mx-3 p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Today's Status</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">Energy Level</span>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => handleUpdateTodayStatus('energyLevel', Math.max(0, todayStatus.energyLevel - 5))}
                      className="text-xs text-gray-500 hover:text-gray-700"
                      title="Decrease"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4"></path>
                      </svg>
                    </button>
                    <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-green-500 rounded-full" style={{ width: `${todayStatus.energyLevel}%` }}></div>
                    </div>
                    <button 
                      onClick={() => handleUpdateTodayStatus('energyLevel', Math.min(100, todayStatus.energyLevel + 5))}
                      className="text-xs text-gray-500 hover:text-gray-700"
                      title="Increase"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">Hydration</span>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => handleUpdateTodayStatus('hydration', Math.max(0, todayStatus.hydration - 5))}
                      className="text-xs text-gray-500 hover:text-gray-700"
                      title="Decrease"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4"></path>
                      </svg>
                    </button>
                    <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full" style={{ width: `${todayStatus.hydration}%` }}></div>
                    </div>
                    <button 
                      onClick={() => handleUpdateTodayStatus('hydration', Math.min(100, todayStatus.hydration + 5))}
                      className="text-xs text-gray-500 hover:text-gray-700"
                      title="Increase"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">Recovery</span>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => handleUpdateTodayStatus('recovery', Math.max(0, todayStatus.recovery - 5))}
                      className="text-xs text-gray-500 hover:text-gray-700"
                      title="Decrease"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4"></path>
                      </svg>
                    </button>
                    <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${todayStatus.recovery}%` }}></div>
                    </div>
                    <button 
                      onClick={() => handleUpdateTodayStatus('recovery', Math.min(100, todayStatus.recovery + 5))}
                      className="text-xs text-gray-500 hover:text-gray-700"
                      title="Increase"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Main Content */}
          <div className="flex-1 p-4 md:p-6 lg:p-8 overflow-auto">
            {/* Header with breadcrumbs */}
            <motion.div 
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="bg-white shadow-sm rounded-xl p-4 md:p-6 mb-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                <div>
                  <div className="flex items-center text-sm text-gray-500 mb-1">
                    <span>Home</span>
                    <svg className="w-3 h-3 mx-2" fill="currentColor" viewBox="0 0 16 16">
                      <path fillRule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"/>
                    </svg>
                    <span className="font-medium text-blue-600">{tabs.find(t => t.id === activeTab)?.label}</span>
                  </div>
                  <h2 className="text-xl md:text-2xl font-bold text-gray-800 flex items-center">
                    {tabs.find(t => t.id === activeTab)?.label}
                    <span className="ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      Pro Athlete
                    </span>
                  </h2>
                  <p className="text-gray-600">Your fitness journey at a glance</p>
                </div>
                
                <div className="mt-4 sm:mt-0">
                </div>
              </div>
            </motion.div>

            {/* Dashboard Content Tabs */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              key={activeTab}
            >
              {activeTab === 'overview' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Recent Workouts - Interactive Card */}
                  <div className="lg:col-span-2 bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-shadow duration-300">
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-5">
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center text-white mr-3">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                            </svg>
                          </div>
                          <h2 className="text-lg font-semibold text-gray-800">Recent Workouts</h2>
                        </div>
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => setShowInlineWorkoutForm(!showInlineWorkoutForm)}
                            className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center"
                          >
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={showInlineWorkoutForm ? "M6 18L18 6M6 6l12 12" : "M12 6v6m0 0v6m0-6h6m-6 0H6"}></path>
                            </svg>
                            {showInlineWorkoutForm ? 'Cancel' : 'Add Workout'}
                          </button>
                        </div>
                      </div>
                      
                      {/* Inline Workout Form */}
                      <AnimatePresence>
                        {showInlineWorkoutForm && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="mb-6 p-4 border border-blue-100 rounded-lg bg-blue-50"
                          >
                            <h3 className="text-md font-medium mb-3 text-blue-700">Add New Workout</h3>
                            <form onSubmit={handleAddWorkout} className="space-y-3">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Workout Name
                                  </label>
                                  <input
                                    type="text"
                                    name="name"
                                    value={newWorkoutData.name}
                                    onChange={handleWorkoutInputChange}
                                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
                                    required
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Duration (min)
                                  </label>
                                  <input
                                    type="text"
                                    name="duration"
                                    value={newWorkoutData.duration}
                                    onChange={handleWorkoutInputChange}
                                    placeholder="e.g. 45 min"
                                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
                                    required
                                  />
                                </div>
                              </div>
                              
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Intensity
                                  </label>
                                  <select
                                    name="intensity"
                                    value={newWorkoutData.intensity}
                                    onChange={handleWorkoutInputChange}
                                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
                                  >
                                    <option value="Low">Low</option>
                                    <option value="Medium">Medium</option>
                                    <option value="High">High</option>
                                    <option value="Very High">Very High</option>
                                  </select>
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Target/Focus
                                  </label>
                                  <input
                                    type="text"
                                    name="target"
                                    value={newWorkoutData.target}
                                    onChange={handleWorkoutInputChange}
                                    placeholder="e.g. Strength, Cardio"
                                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
                                  />
                                </div>
                              </div>
                              
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Notes (optional)
                                </label>
                                <textarea
                                  name="notes"
                                  value={newWorkoutData.notes}
                                  onChange={handleWorkoutInputChange}
                                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
                                  rows="2"
                                />
                              </div>
                              
                              <div className="flex justify-end gap-2">
                                <button
                                  type="button"
                                  onClick={() => setShowInlineWorkoutForm(false)}
                                  className="px-3 py-1.5 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors text-sm"
                                >
                                  Cancel
                                </button>
                                <button
                                  type="submit"
                                  className="px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
                                >
                                  Save Workout
                                </button>
                              </div>
                            </form>
                          </motion.div>
                        )}
                      </AnimatePresence>
                      
                      <WorkoutTracker 
                        workouts={dashboardData.recentWorkouts} 
                        onDeleteWorkout={handleDeleteWorkout}
                        handleStartWorkout={handleStartWorkout}
                      />
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <button 
                          onClick={() => setActiveTab('workouts')}
                          className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center group"
                        >
                          View All Workouts
                          <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Recovery Status - Interactive Card */}
                  <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-shadow duration-300">
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-5">
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-lg bg-green-500 flex items-center justify-center text-white mr-3">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                            </svg>
                          </div>
                          <h2 className="text-lg font-semibold text-gray-800">Recovery Status</h2>
                        </div>
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => {
                              // Simulate updating recovery data
                              const newRecovery = {
                                sleepQuality: Math.min(100, dashboardData.recoveryStatus.sleepQuality + Math.floor(Math.random() * 5)),
                                muscleRecovery: Math.min(100, dashboardData.recoveryStatus.muscleRecovery + Math.floor(Math.random() * 5)),
                                readinessScore: Math.min(100, dashboardData.recoveryStatus.readinessScore + Math.floor(Math.random() * 5)),
                              };
                              handleUpdateRecovery(newRecovery);
                            }}
                            className="text-gray-400 hover:text-green-500 transition-colors" 
                            title="Refresh data"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                            </svg>
                          </button>
                        </div>
                      </div>
                      <RecoveryStatus 
                        recoveryData={dashboardData.recoveryStatus} 
                        onUpdate={handleUpdateRecovery} 
                        onStartActiveRecovery={handleStartActiveRecovery}
                        onDeleteRecovery={handleDeleteRecovery}
                      />
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <div className="text-sm text-gray-500 flex items-center">
                          <svg className="w-4 h-4 mr-1 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                          </svg>
                          Last updated: Today, {new Date().toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Goal Progress - Interactive Card */}
                  <div className="lg:col-span-2 bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-shadow duration-300">
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-5">
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center text-white mr-3">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
                            </svg>
                          </div>
                          <h2 className="text-lg font-semibold text-gray-800">Goal Progress</h2>
                        </div>
                        <button 
                          onClick={() => setShowInlineGoalForm(!showInlineGoalForm)}
                          className="px-2 py-1 bg-amber-50 text-amber-600 rounded-full text-xs font-medium hover:bg-amber-100 transition-colors flex items-center"
                        >
                          <svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={showInlineGoalForm ? "M6 18L18 6M6 6l12 12" : "M12 6v6m0 0v6m0-6h6m-6 0H6"}></path>
                          </svg>
                          {showInlineGoalForm ? 'Cancel' : 'Add Goal'}
                        </button>
                      </div>
                      
                      {/* Inline Goal Form */}
                      <AnimatePresence>
                        {showInlineGoalForm && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="mb-6 p-4 border border-amber-100 rounded-lg bg-amber-50"
                          >
                            <h3 className="text-md font-medium mb-3 text-amber-700">Add New Goal</h3>
                            <form onSubmit={handleAddGoal} className="space-y-3">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Goal Name
                                  </label>
                                  <input
                                    type="text"
                                    name="name"
                                    value={newGoalData.name}
                                    onChange={handleGoalInputChange}
                                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
                                    required
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Target Value
                                  </label>
                                  <input
                                    type="text"
                                    name="target"
                                    value={newGoalData.target}
                                    onChange={handleGoalInputChange}
                                    placeholder="e.g. 100kg, 30min, 5 sessions"
                                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
                                    required
                                  />
                                </div>
                              </div>
                              
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Current Value
                                  </label>
                                  <input
                                    type="text"
                                    name="current"
                                    value={newGoalData.current}
                                    onChange={handleGoalInputChange}
                                    placeholder="e.g. 80kg, 35min, 3 sessions"
                                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
                                    required
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Target Date
                                  </label>
                                  <input
                                    type="date"
                                    name="deadline"
                                    value={newGoalData.deadline}
                                    onChange={handleGoalInputChange}
                                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
                                  />
                                </div>
                              </div>
                              
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Category
                                  </label>
                                  <select
                                    name="category"
                                    value={newGoalData.category}
                                    onChange={handleGoalInputChange}
                                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
                                    required
                                  >
                                    <option value="strength">Strength</option>
                                    <option value="endurance">Endurance</option>
                                    <option value="nutrition">Nutrition</option>
                                    <option value="weight">Weight</option>
                                  </select>
                                </div>
                              </div>
                              
                              <div className="flex justify-end gap-2">
                                <button
                                  type="button"
                                  onClick={() => setShowInlineGoalForm(false)}
                                  className="px-3 py-1.5 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors text-sm"
                                >
                                  Cancel
                                </button>
                                <button
                                  type="submit"
                                  className="px-3 py-1.5 bg-amber-600 text-white rounded-md hover:bg-amber-700 transition-colors text-sm"
                                >
                                  Create Goal
                                </button>
                              </div>
                            </form>
                          </motion.div>
                        )}
                      </AnimatePresence>
                      
                      <GoalProgress 
                        goals={dashboardData.goals} 
                        onUpdateProgress={handleUpdateGoalProgress}
                        onDeleteGoal={handleDeleteGoal}
                      />
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <button 
                          onClick={() => setActiveTab('goals')}
                          className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center group"
                        >
                          View All Goals
                          <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  {/* BMI Calculator - Interactive Card */}
                  <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-shadow duration-300">
                    <div className="p-6">
                      <div className="flex items-center mb-4">
                        <div className="w-8 h-8 rounded-lg bg-purple-500 flex items-center justify-center text-white mr-3">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
                          </svg>
                        </div>
                        <h2 className="text-lg font-semibold text-gray-800">BMI Calculator</h2>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="flex flex-col sm:flex-row gap-4">
                          <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Height (cm)</label>
                            <div className="relative">
                              <input
                                type="number"
                                name="height"
                                value={bmiData.height}
                                onChange={handleBmiInputChange}
                                placeholder="175"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 pr-10"
                              />
                              <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 text-sm">cm</span>
                            </div>
                          </div>
                          <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Weight (kg)</label>
                            <div className="relative">
                              <input
                                type="number"
                                name="weight"
                                value={bmiData.weight}
                                onChange={handleBmiInputChange}
                                placeholder="70"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 pr-10"
                              />
                              <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 text-sm">kg</span>
                            </div>
                          </div>
                        </div>
                        
                        <button
                          onClick={calculateBMI}
                          className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transform hover:scale-[1.02] active:scale-[0.98] transition-transform"
                        >
                          Calculate BMI
                        </button>
                        
                        {bmiData.bmi && (
                          <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            className="mt-4 border-t pt-4"
                          >
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-sm text-gray-500">Your BMI</span>
                              <span className="text-xl font-bold text-blue-600">{bmiData.bmi}</span>
                            </div>
                            
                            <div className="relative w-full h-2 bg-gray-200 rounded-full">
                              <div className={`absolute top-0 left-0 h-full rounded-full ${
                                bmiData.category === 'Underweight' ? 'bg-blue-500' :
                                bmiData.category === 'Normal' ? 'bg-green-500' :
                                bmiData.category === 'Overweight' ? 'bg-yellow-500' :
                                'bg-red-500'
                              }`} style={{ 
                                width: `${Math.min(100, ((bmiData.bmi - 10) / 25) * 100)}%`
                              }}></div>
                            </div>
                            
                            <div className="flex justify-between text-xs text-gray-500 mt-1">
                              <span>Underweight</span>
                              <span>Normal</span>
                              <span>Overweight</span>
                              <span>Obese</span>
                            </div>
                            
                            <div className="mt-3 bg-gray-50 p-3 rounded-md">
                              <div className="flex items-center">
                                <div className={`w-3 h-3 rounded-full mr-2 ${
                                  bmiData.category === 'Underweight' ? 'bg-blue-500' :
                                  bmiData.category === 'Normal' ? 'bg-green-500' :
                                  bmiData.category === 'Overweight' ? 'bg-yellow-500' :
                                  'bg-red-500'
                                }`}></div>
                                <p className="text-sm font-medium text-gray-700">
                                  {bmiData.category} {bmiData.category === 'Normal' ? '(Healthy Range)' : ''}
                                </p>
                              </div>
                              <p className="text-xs text-gray-500 mt-1">
                                {bmiData.category === 'Underweight' && 'BMI less than 18.5. Consider consulting with a nutritionist.'}
                                {bmiData.category === 'Normal' && 'BMI between 18.5 and 24.9. You are in a healthy weight range.'}
                                {bmiData.category === 'Overweight' && 'BMI between 25 and 29.9. Consider healthy lifestyle changes.'}
                                {bmiData.category === 'Obese' && 'BMI 30 or greater. Consider consulting with a healthcare provider.'}
                              </p>
                            </div>
                            
                            <div className="mt-6">
                              <div className="flex justify-between items-center mb-3">
                                <h4 className="font-semibold text-gray-800">BMI History</h4>
                                <button 
                                  onClick={handleDeleteBmiHistory}
                                  className="text-red-600 hover:text-red-800 text-sm font-medium flex items-center"
                                >
                                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                  </svg>
                                  Delete History
                                </button>
                              </div>
                              
                              {(() => {
                                const bmiHistory = JSON.parse(localStorage.getItem('bmiHistory') || '[]');
                                return bmiHistory.length > 0 ? (
                                  <div className="max-h-60 overflow-y-auto border border-gray-200 rounded-lg">
                                    <table className="min-w-full divide-y divide-gray-200">
                                      <thead className="bg-gray-50 sticky top-0">
                                        <tr>
                                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Date</th>
                                          <th className="px-3 py-2 text-right text-xs font-medium text-gray-500">BMI</th>
                                          <th className="px-3 py-2 text-right text-xs font-medium text-gray-500">Weight</th>
                                        </tr>
                                      </thead>
                                      <tbody className="bg-white divide-y divide-gray-200">
                                        {bmiHistory.map((entry, index) => (
                                          <tr key={index}>
                                            <td className="px-3 py-2 text-sm text-gray-800">{entry.date}</td>
                                            <td className="px-3 py-2 text-sm text-right text-gray-800">{entry.bmi}</td>
                                            <td className="px-3 py-2 text-sm text-right text-gray-800">{entry.weight} kg</td>
                                          </tr>
                                        ))}
                                      </tbody>
                                    </table>
                                  </div>
                                ) : (
                                  <div className="text-sm text-gray-500 text-center p-4 bg-gray-50 rounded-lg">
                                    No BMI history found. Your history will appear here after calculating your BMI.
                                  </div>
                                );
                              })()}
                            </div>
                          </motion.div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'workouts' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {activeWorkout ? (
                    <div className="md:col-span-2 bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
                      <div className="p-6">
                        <div className="border-b border-gray-100 pb-4 mb-4">
                          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                            <div>
                              <h2 className="text-xl font-semibold">{activeWorkout.name}</h2>
                              <div className="flex items-center text-sm text-gray-500 mt-1">
                                <div className="flex items-center">
                                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                  <span>{activeWorkout.duration}</span>
                                </div>
                                <span className="mx-2">•</span>
                                <div className="flex items-center">
                                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                  </svg>
                                  <span>{activeWorkout.level}</span>
                                </div>
                                <span className="mx-2">•</span>
                                <div className="flex items-center">
                                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                  </svg>
                                  <span>{activeWorkout.focus || activeWorkout.target || 'General'}</span>
                                </div>
                              </div>
                            </div>
                            
                            <div className="mt-4 md:mt-0 flex gap-2">
                              <button 
                                onClick={() => {
                                  // Directly pause the workout without confirmation
                                  setActiveWorkout(null);
                                }}
                                className="px-4 py-2 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200"
                              >
                                Pause
                              </button>
                            <button 
                              onClick={handleFinishWorkout}
                                className="px-6 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-md hover:from-green-600 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 shadow-sm transition-all"
                            >
                              Complete Workout
                            </button>
                            </div>
                          </div>
                          
                          {/* Add the workout timer component */}
                          <div className="mt-4">
                            <WorkoutTimer 
                              duration={activeWorkout.duration} 
                              onFinish={handleFinishWorkout} 
                            />
                          </div>
                        </div>
                        
                        <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-6">
                          <div className="flex justify-between items-center mb-2">
                            <h3 className="font-medium text-blue-800 flex items-center">
                              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                              </svg>
                              Workout Details
                            </h3>
                            <button
                              onClick={() => {
                                // Show modal to edit workout details
                                setModalContent({
                                  title: 'Edit Workout Details',
                                  content: (
                                    <div className="space-y-4">
                                      <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                          Workout Name
                                        </label>
                                        <input
                                          type="text"
                                          id="edit-workout-name"
                                          defaultValue={activeWorkout.name}
                                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        />
                                      </div>
                                      <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                          Duration
                                        </label>
                                        <input
                                          type="text"
                                          id="edit-workout-duration"
                                          defaultValue={activeWorkout.duration}
                                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        />
                                      </div>
                                      <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                          Difficulty Level
                                        </label>
                                        <select
                                          id="edit-workout-level"
                                          defaultValue={activeWorkout.level}
                                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        >
                                          <option value="Beginner">Beginner</option>
                                          <option value="Intermediate">Intermediate</option>
                                          <option value="Advanced">Advanced</option>
                                          <option value="High">High</option>
                                        </select>
                                      </div>
                                      <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                          Target/Focus
                                        </label>
                                        <input
                                          type="text"
                                          id="edit-workout-target"
                                          defaultValue={activeWorkout.target || activeWorkout.focus || ''}
                                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        />
                                      </div>
                                      <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                          Description
                                        </label>
                                        <textarea
                                          id="edit-workout-description"
                                          defaultValue={activeWorkout.details.description}
                                          rows="3"
                                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        ></textarea>
                                      </div>
                                    </div>
                                  ),
                                  onConfirm: () => {
                                    // Get values from inputs
                                    const name = document.getElementById('edit-workout-name').value;
                                    const duration = document.getElementById('edit-workout-duration').value;
                                    const level = document.getElementById('edit-workout-level').value;
                                    const target = document.getElementById('edit-workout-target').value;
                                    const description = document.getElementById('edit-workout-description').value;
                                    
                                    // Format duration if needed
                                    let formattedDuration = duration;
                                    if (duration && !duration.match(/min|hr|minute/i)) {
                                      formattedDuration = `${duration} min`;
                                    }
                                    
                                    // Update workout details
                                    setActiveWorkout({
                                      ...activeWorkout,
                                      name,
                                      duration: formattedDuration,
                                      level,
                                      target,
                                      focus: target, // Keep both in sync
                                      details: {
                                        ...activeWorkout.details,
                                        description
                                      }
                                    });
                                    
                                    setShowModal(false);
                                  }
                                });
                                setShowModal(true);
                              }}
                              className="px-3 py-1 bg-blue-100 text-blue-700 rounded-md text-xs font-medium hover:bg-blue-200 transition-colors"
                            >
                              Edit Details
                            </button>
                          </div>
                          
                          <p className="text-sm text-blue-700 mb-3">
                            {activeWorkout.details.description}
                          </p>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                            <div className="bg-white p-3 rounded-lg shadow-sm">
                              <span className="text-xs text-gray-500">Duration</span>
                              <p className="font-semibold">{activeWorkout.duration}</p>
                            </div>
                            <div className="bg-white p-3 rounded-lg shadow-sm">
                              <span className="text-xs text-gray-500">Difficulty</span>
                              <p className="font-semibold">{activeWorkout.level}</p>
                            </div>
                            <div className="bg-white p-3 rounded-lg shadow-sm">
                              <span className="text-xs text-gray-500">Target</span>
                              <p className="font-semibold">{activeWorkout.target || activeWorkout.focus}</p>
                            </div>
                            <div className="bg-white p-3 rounded-lg shadow-sm">
                              <div className="flex justify-between items-center">
                                <span className="text-xs text-gray-500">Equipment</span>
                                <button
                                  onClick={() => {
                                    // Show modal to edit equipment
                                    setModalContent({
                                      title: 'Edit Equipment',
                                      content: (
                                        <div className="space-y-4">
                                          <p className="text-sm text-gray-600">
                                            Enter equipment needed for this workout (comma-separated):
                                          </p>
                                          <textarea
                                            id="edit-equipment"
                                            defaultValue={activeWorkout.equipment || ''}
                                            rows="3"
                                            placeholder="e.g., Dumbbells, Resistance Bands, Yoga Mat"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                          ></textarea>
                                        </div>
                                      ),
                                      onConfirm: () => {
                                        // Get equipment value
                                        const equipment = document.getElementById('edit-equipment').value;
                                        
                                        // Update workout equipment
                                        setActiveWorkout({
                                          ...activeWorkout,
                                          equipment
                                        });
                                        
                                        setShowModal(false);
                                      }
                                    });
                                    setShowModal(true);
                                  }}
                                  className="text-blue-600 hover:text-blue-800"
                                >
                                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                  </svg>
                                </button>
                              </div>
                              <p className="font-semibold">{activeWorkout.equipment || 'None'}</p>
                            </div>
                          </div>
                        </div>
                        
                        <WorkoutExercises 
                          activeWorkout={activeWorkout}
                          setActiveWorkout={setActiveWorkout}
                        />
                        
                      </div>
                    </div>
                  ) : (
                    <div className="md:col-span-2 bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
                      <div className="p-6">
                        <div className="flex items-center justify-between mb-5">
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center text-white mr-3">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                              </svg>
                            </div>
                            <h2 className="text-lg font-semibold text-gray-800">Recent Workouts</h2>
                          </div>
                          <div className="flex space-x-2">
                            <button 
                              onClick={() => setShowInlineWorkoutForm(!showInlineWorkoutForm)}
                              className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center"
                            >
                              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={showInlineWorkoutForm ? "M6 18L18 6M6 6l12 12" : "M12 6v6m0 0v6m0-6h6m-6 0H6"}></path>
                              </svg>
                              {showInlineWorkoutForm ? 'Cancel' : 'Add Workout'}
                            </button>
                          </div>
                        </div>
                        
                        {/* Inline Workout Form */}
                        <AnimatePresence>
                          {showInlineWorkoutForm && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.3 }}
                              className="mb-6 p-4 border border-blue-100 rounded-lg bg-blue-50"
                            >
                              <h3 className="text-md font-medium mb-3 text-blue-700">Add New Workout</h3>
                              <form onSubmit={handleAddWorkout} className="space-y-3">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                      Workout Name
                                    </label>
                                    <input
                                      type="text"
                                      name="name"
                                      value={newWorkoutData.name}
                                      onChange={handleWorkoutInputChange}
                                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
                                      required
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                      Duration (min)
                                    </label>
                                    <input
                                      type="text"
                                      name="duration"
                                      value={newWorkoutData.duration}
                                      onChange={handleWorkoutInputChange}
                                      placeholder="e.g. 45 min"
                                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
                                      required
                                    />
                                  </div>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                      Intensity
                                    </label>
                                    <select
                                      name="intensity"
                                      value={newWorkoutData.intensity}
                                      onChange={handleWorkoutInputChange}
                                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
                                    >
                                      <option value="Low">Low</option>
                                      <option value="Medium">Medium</option>
                                      <option value="High">High</option>
                                      <option value="Very High">Very High</option>
                                    </select>
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                      Target/Focus
                                    </label>
                                    <input
                                      type="text"
                                      name="target"
                                      value={newWorkoutData.target}
                                      onChange={handleWorkoutInputChange}
                                      placeholder="e.g. Strength, Cardio"
                                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
                                    />
                                  </div>
                                </div>
                                
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Notes (optional)
                                  </label>
                                  <textarea
                                    name="notes"
                                    value={newWorkoutData.notes}
                                    onChange={handleWorkoutInputChange}
                                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
                                    rows="2"
                                  />
                                </div>
                                
                                <div className="flex justify-end gap-2">
                                  <button
                                    type="button"
                                    onClick={() => setShowInlineWorkoutForm(false)}
                                    className="px-3 py-1.5 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors text-sm"
                                  >
                                    Cancel
                                  </button>
                                  <button
                                    type="submit"
                                    className="px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
                                  >
                                    Save Workout
                                  </button>
                                </div>
                              </form>
                            </motion.div>
                          )}
                        </AnimatePresence>
                        
                        <WorkoutTracker 
                          workouts={dashboardData.recentWorkouts} 
                          onDeleteWorkout={handleDeleteWorkout}
                          handleStartWorkout={handleStartWorkout}
                        />
                        <div className="mt-4 pt-4 border-t border-gray-100">
                          <button 
                            onClick={() => setActiveTab('workouts')}
                            className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center group"
                          >
                            View All Workouts
                            <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'goals' && (
                <div>
                  <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-xl font-semibold">Goal Tracking</h2>
                      <button 
                        onClick={() => setShowInlineGoalForm(!showInlineGoalForm)}
                        className="px-3 py-1.5 bg-blue-600 text-white rounded-md text-sm font-medium"
                      >
                        <div className="flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={showInlineGoalForm ? "M6 18L18 6M6 6l12 12" : "M12 6v6m0 0v6m0-6h6m-6 0H6"}></path>
                          </svg>
                          {showInlineGoalForm ? "Cancel" : "Add New Goal"}
                        </div>
                      </button>
                    </div>
                    
                    {/* Inline Goal Form */}
                    <AnimatePresence>
                      {showInlineGoalForm && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="mb-6 p-4 border border-blue-100 rounded-lg bg-blue-50"
                        >
                          <h3 className="text-md font-medium mb-3 text-blue-700">Add New Goal</h3>
                          <form onSubmit={handleAddGoal} className="space-y-3">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Goal Name
                                </label>
                                <input
                                  type="text"
                                  name="name"
                                  value={newGoalData.name}
                                  onChange={handleGoalInputChange}
                                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
                                  required
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Target Value
                                </label>
                                <input
                                  type="text"
                                  name="target"
                                  value={newGoalData.target}
                                  onChange={handleGoalInputChange}
                                  placeholder="e.g. 100kg, 30min, 5 sessions"
                                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
                                  required
                                />
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Current Value
                                </label>
                                <input
                                  type="text"
                                  name="current"
                                  value={newGoalData.current}
                                  onChange={handleGoalInputChange}
                                  placeholder="e.g. 80kg, 35min, 3 sessions"
                                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
                                  required
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Target Date
                                </label>
                                <input
                                  type="date"
                                  name="deadline"
                                  value={newGoalData.deadline}
                                  onChange={handleGoalInputChange}
                                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
                                />
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Category
                                </label>
                                <select
                                  name="category"
                                  value={newGoalData.category}
                                  onChange={handleGoalInputChange}
                                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
                                  required
                                >
                                  <option value="strength">Strength</option>
                                  <option value="endurance">Endurance</option>
                                  <option value="nutrition">Nutrition</option>
                                  <option value="weight">Weight</option>
                                </select>
                              </div>
                            </div>
                            
                            <div className="flex justify-end gap-2">
                              <button
                                type="button"
                                onClick={() => setShowInlineGoalForm(false)}
                                className="px-3 py-1.5 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors text-sm"
                              >
                                Cancel
                              </button>
                              <button
                                type="submit"
                                className="px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
                              >
                                Create Goal
                              </button>
                            </div>
                          </form>
                        </motion.div>
                      )}
                    </AnimatePresence>
                    
                    {dashboardData.goals.length > 0 ? (
                      <>
                        <GoalProgress 
                          goals={dashboardData.goals} 
                          detailed={true} 
                          onUpdateProgress={handleUpdateGoalProgress}
                          onDeleteGoal={handleDeleteGoal}
                        />
                        
                        {/* Goal Progress Update Form */}
                        <div className="mt-8 pt-6 border-t border-gray-200">
                          <h3 className="text-lg font-medium mb-4">Update Goal Progress</h3>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Select Goal
                              </label>
                              <select 
                                id="goalSelect"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                              >
                                {dashboardData.goals.map(goal => (
                                  <option key={goal.id} value={goal.id}>{goal.name}</option>
                                ))}
                              </select>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Current Value
                              </label>
                              <input 
                                id="goalCurrentValue"
                                type="text" 
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                placeholder="e.g. 90kg, 25min"
                              />
                            </div>
                            <div className="flex items-end">
                              <button 
                                onClick={() => {
                                  // Get selected goal and new value
                                  const select = document.getElementById('goalSelect');
                                  const input = document.getElementById('goalCurrentValue');
                                  
                                  if (select && input && input.value) {
                                    const goalId = parseInt(select.value);
                                    const newCurrent = input.value;
                                    
                                    // Find the goal
                                    const goal = dashboardData.goals.find(g => g.id === goalId);
                                    
                                    if (goal) {
                                      // Calculate new progress (simple calculation for demo)
                                      let newProgress = 0;
                                      
                                      // If target contains a number, try to extract progress
                                      const currentNum = parseInt(newCurrent.match(/\d+/)?.[0] || '0');
                                      const targetNum = parseInt(goal.target.match(/\d+/)?.[0] || '100');
                                      
                                      if (goal.target.includes('min') && currentNum > targetNum) {
                                        // For time goals (lower is better)
                                        newProgress = Math.min(100, Math.max(0, 100 - ((currentNum - targetNum) / targetNum * 100)));
                                      } else {
                                        // For regular goals (higher is better)
                                        newProgress = Math.min(100, Math.max(0, (currentNum / targetNum) * 100));
                                      }
                                      
                                      // Update the goal
                                      handleUpdateGoalProgress(goalId, Math.round(newProgress), newCurrent);
                                      
                                      // Reset input
                                      input.value = '';
                                      
                                      // Show a brief toast notification instead of a modal
                                      const toast = document.createElement('div');
                                      toast.className = 'fixed bottom-4 right-4 bg-green-50 text-green-800 px-4 py-2 rounded-lg shadow-md text-sm border border-green-200 z-50';
                                      toast.textContent = 'Goal progress updated';
                                      document.body.appendChild(toast);
                                      
                                      // Remove toast after 2 seconds
                                      setTimeout(() => {
                                        toast.remove();
                                      }, 2000);
                                    }
                                  }
                                }}
                                className="w-full h-10 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
                              >
                                Update Progress
                              </button>
                            </div>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="bg-gray-50 rounded-lg p-8 text-center">
                        <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-4">
                          <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                          </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No Goals Yet</h3>
                        <p className="text-gray-600 mb-6">Start creating fitness goals to track your progress and stay motivated.</p>
                        <button 
                          onClick={() => setShowInlineGoalForm(true)}
                          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                        >
                          Create Your First Goal
                        </button>
                      </div>
                    )}
                    
                    <div className="mt-8 pt-6 border-t border-gray-200">
                      <h3 className="text-lg font-medium mb-4">Goal Insights</h3>
                      <div className="bg-blue-50 rounded-lg p-4">
                        <div className="flex">
                          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-3">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                          </div>
                          <div>
                            <h4 className="font-medium text-blue-800">Smart Goal Setting</h4>
                            <p className="text-sm text-blue-700 mt-1">
                              The most successful fitness goals are specific, measurable, achievable, relevant, and time-bound (SMART).
                            </p>
                          </div>
                        </div>
                        
                        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="bg-white p-3 rounded-lg shadow-sm">
                            <h5 className="font-medium text-sm text-gray-800 mb-1">Goal Completion Rate</h5>
                            <div className="flex items-center">
                              <div className="text-xl font-bold text-blue-600 mr-2">
                                {dashboardData.goals.length > 0 
                                  ? `${Math.round(dashboardData.goals.filter(g => g.progress >= 100).length / dashboardData.goals.length * 100)}%` 
                                  : '0%'}
                              </div>
                              <div className="text-xs text-gray-500">of goals completed</div>
                            </div>
                          </div>
                          <div className="bg-white p-3 rounded-lg shadow-sm">
                            <h5 className="font-medium text-sm text-gray-800 mb-1">Average Progress</h5>
                            <div className="flex items-center">
                              <div className="text-xl font-bold text-blue-600 mr-2">
                                {dashboardData.goals.length > 0 
                                  ? `${Math.round(dashboardData.goals.reduce((sum, goal) => sum + goal.progress, 0) / dashboardData.goals.length)}%` 
                                  : '0%'}
                              </div>
                              <div className="text-xs text-gray-500">across all goals</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === 'bmi' && (
                <div>
                  <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-100">
                    <div className="flex items-center mb-6">
                      <div className="w-10 h-10 rounded-lg bg-purple-500 flex items-center justify-center text-white mr-4">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
                        </svg>
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-gray-800">BMI Calculator</h2>
                        <p className="text-gray-600">Calculate and track your Body Mass Index</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                        <h3 className="text-xl font-semibold mb-4">Calculate Your BMI</h3>
                        <p className="text-gray-600 mb-6">BMI is a measure of body fat based on height and weight that applies to adult men and women.</p>
                        
                        <div className="space-y-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Height (cm)</label>
                            <div className="relative">
                              <input
                                type="number"
                                name="height"
                                value={bmiData.height}
                                onChange={handleBmiInputChange}
                                placeholder="175"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 pr-10"
                              />
                              <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 text-sm">cm</span>
                            </div>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Weight (kg)</label>
                            <div className="relative">
                              <input
                                type="number"
                                name="weight"
                                value={bmiData.weight}
                                onChange={handleBmiInputChange}
                                placeholder="70"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 pr-10"
                              />
                              <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 text-sm">kg</span>
                            </div>
                          </div>
                          
                          <button
                            onClick={calculateBMI}
                            className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-lg hover:from-blue-700 hover:to-indigo-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-md transform hover:translate-y-[-2px] transition-all"
                          >
                            Calculate BMI
                          </button>
                        </div>
                      </div>
                      
                      <div>
                        {bmiData.bmi ? (
                          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm h-full">
                            <h3 className="text-xl font-semibold mb-4">Your Results</h3>
                            
                            <div className="flex justify-center mb-6">
                              <div className="w-32 h-32 rounded-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg">
                                <div className="text-center">
                                  <div className="text-3xl font-bold">{bmiData.bmi}</div>
                                  <div className="text-sm opacity-90">BMI</div>
                                </div>
                              </div>
                            </div>
                            
                            <div className="mb-6">
                              <div className="relative w-full h-3 bg-gray-200 rounded-full mb-2">
                                <div className={`absolute top-0 left-0 h-full rounded-full ${
                                  bmiData.category === 'Underweight' ? 'bg-blue-500' :
                                  bmiData.category === 'Normal' ? 'bg-green-500' :
                                  bmiData.category === 'Overweight' ? 'bg-yellow-500' :
                                  'bg-red-500'
                                }`} style={{ 
                                  width: `${Math.min(100, ((bmiData.bmi - 10) / 25) * 100)}%`
                                }}></div>
                              </div>
                              
                              <div className="flex justify-between text-xs text-gray-500">
                                <span>Underweight</span>
                                <span>Normal</span>
                                <span>Overweight</span>
                                <span>Obese</span>
                              </div>
                            </div>
                            
                            <div className={`p-4 rounded-lg mb-6 ${
                              bmiData.category === 'Underweight' ? 'bg-blue-50 text-blue-800' :
                              bmiData.category === 'Normal' ? 'bg-green-50 text-green-800' :
                              bmiData.category === 'Overweight' ? 'bg-yellow-50 text-yellow-800' :
                              'bg-red-50 text-red-800'
                            }`}>
                              <div className="font-semibold mb-1">
                                {bmiData.category} {bmiData.category === 'Normal' ? '(Healthy Range)' : ''}
                              </div>
                              <p className="text-sm">
                                {bmiData.category === 'Underweight' && 'BMI less than 18.5. Consider consulting with a nutritionist for healthy weight gain strategies.'}
                                {bmiData.category === 'Normal' && 'BMI between 18.5 and 24.9. You are in a healthy weight range. Maintain your balanced lifestyle.'}
                                {bmiData.category === 'Overweight' && 'BMI between 25 and 29.9. Consider consulting with a fitness professional for healthy lifestyle changes.'}
                                {bmiData.category === 'Obese' && 'BMI 30 or greater. Consider consulting with a healthcare provider for personalized advice.'}
                              </p>
                            </div>
                            
                            <div className="mt-6">
                              <div className="flex justify-between items-center mb-3">
                                <h4 className="font-semibold text-gray-800">BMI History</h4>
                                <button 
                                  onClick={handleDeleteBmiHistory}
                                  className="text-red-600 hover:text-red-800 text-sm font-medium flex items-center"
                                >
                                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                  </svg>
                                  Delete History
                                </button>
                              </div>
                              
                              {(() => {
                                const bmiHistory = JSON.parse(localStorage.getItem('bmiHistory') || '[]');
                                return bmiHistory.length > 0 ? (
                                  <div className="max-h-60 overflow-y-auto border border-gray-200 rounded-lg">
                                    <table className="min-w-full divide-y divide-gray-200">
                                      <thead className="bg-gray-50 sticky top-0">
                                        <tr>
                                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Date</th>
                                          <th className="px-3 py-2 text-right text-xs font-medium text-gray-500">BMI</th>
                                          <th className="px-3 py-2 text-right text-xs font-medium text-gray-500">Weight</th>
                                        </tr>
                                      </thead>
                                      <tbody className="bg-white divide-y divide-gray-200">
                                        {bmiHistory.map((entry, index) => (
                                          <tr key={index}>
                                            <td className="px-3 py-2 text-sm text-gray-800">{entry.date}</td>
                                            <td className="px-3 py-2 text-sm text-right text-gray-800">{entry.bmi}</td>
                                            <td className="px-3 py-2 text-sm text-right text-gray-800">{entry.weight} kg</td>
                                          </tr>
                                        ))}
                                      </tbody>
                                    </table>
                                  </div>
                                ) : (
                                  <div className="text-sm text-gray-500 text-center p-4 bg-gray-50 rounded-lg">
                                    No BMI history found. Your history will appear here after calculating your BMI.
                                  </div>
                                );
                              })()}
                            </div>
                          </div>
                        ) : (
                          <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col items-center justify-center h-full">
                            <svg className="w-16 h-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"></path>
                            </svg>
                            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Results Yet</h3>
                            <p className="text-gray-500 text-center">Enter your height and weight to calculate your BMI and see results here.</p>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="mt-8 bg-blue-50 p-6 rounded-xl">
                      <h3 className="text-lg font-semibold text-blue-800 mb-3">About BMI</h3>
                      <p className="text-blue-700 mb-4">
                        BMI is a measurement of a person's weight with respect to their height. It is a good indicator of body fatness for most people and is used to screen for weight categories that may lead to health problems.
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div className="bg-white p-3 rounded-lg shadow-sm">
                          <div className="font-medium mb-1 text-gray-800">BMI Categories</div>
                          <div className="text-gray-600">
                            <div>Underweight: less than 18.5</div>
                            <div>Normal weight: 18.5–24.9</div>
                            <div>Overweight: 25–29.9</div>
                            <div>Obesity: 30 or greater</div>
                          </div>
                        </div>
                        <div className="bg-white p-3 rounded-lg shadow-sm">
                          <div className="font-medium mb-1 text-gray-800">BMI Limitations</div>
                          <div className="text-gray-600">
                            BMI may not be accurate for athletes, pregnant women, the elderly, or those with high muscle mass. It's one tool among many for assessing health.
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === 'ai' && (
                <div>
                  <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-100">
                    <div className="flex items-center mb-6">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white mr-4">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 15.75a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM14.25 15.75a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM8.25 9.75a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM15.75 9.75a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"></path>
                        </svg>
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-gray-800">AI Fitness Assistant</h2>
                        <p className="text-gray-600">Your personal AI coach and fitness advisor</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                      <div className="lg:col-span-2">
                        <div className="bg-gray-50 rounded-xl p-4 h-96 overflow-y-auto border border-gray-200 mb-4">
                          <div className="space-y-4">
                            {chatMessages.map((message, index) => (
                              <div key={index} className={`flex ${message.sender === 'user' ? 'justify-end' : ''}`}>
                                {message.sender === 'ai' && (
                                  <div className="flex-shrink-0 h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm mr-3">
                                    AI
                                  </div>
                                )}
                                <div className={`p-3 rounded-lg shadow-sm max-w-3xl ${
                                  message.sender === 'user' 
                                    ? 'bg-blue-500 text-white' 
                                    : 'bg-white text-gray-700'
                                }`}>
                                  <p className="whitespace-pre-line">{message.content}</p>
                                </div>
                                {message.sender === 'user' && (
                                  <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-700 text-sm ml-3">
                                    You
                                  </div>
                                )}
                              </div>
                            ))}
                            <div ref={chatEndRef} />
                          </div>
                        </div>
                        
                        <div className="flex">
                          <input 
                            type="text" 
                            value={messageInput}
                            onChange={handleMessageInputChange}
                            onKeyDown={handleMessageKeyDown}
                            placeholder="Ask me anything about fitness, nutrition, or your goals..."
                            className="flex-1 px-4 py-3 border border-gray-300 rounded-l-lg focus:ring-blue-500 focus:border-blue-500"
                          />
                          <button 
                            onClick={handleSendMessage}
                            className="bg-blue-600 text-white px-4 rounded-r-lg hover:bg-blue-700 flex items-center justify-center">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                            </svg>
                          </button>
                        </div>
                      </div>
                      
                      <div>
                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                          <div className="p-4 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
                            <h3 className="text-lg font-semibold">AI Assistant Features</h3>
                          </div>
                          <div className="p-4">
                            <ul className="space-y-3">
                              <li className="flex">
                                <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                                <span className="text-gray-700">Personalized workout plans</span>
                              </li>
                              <li className="flex">
                                <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                                <span className="text-gray-700">Nutrition advice and meal planning</span>
                              </li>
                              <li className="flex">
                                <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                                <span className="text-gray-700">Form and technique guidance</span>
                              </li>
                              <li className="flex">
                                <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                                <span className="text-gray-700">Progress tracking insights</span>
                              </li>
                              <li className="flex">
                              <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                              </svg>
                              <span className="text-gray-700">Motivation and accountability</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                      
                      <div className="mt-6 space-y-4">
                        <button 
                          onClick={handleGenerateWorkoutPlan}
                          className="w-full py-3 px-4 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 font-medium flex items-center justify-center">
                          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
                          </svg>
                          Generate Workout Plan
                        </button>
                        
                        <button 
                          onClick={handleCreateMealPlan}
                          className="w-full py-3 px-4 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 font-medium flex items-center justify-center">
                          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                          </svg>
                          Create Meal Plan
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Popular Questions</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div 
                        onClick={() => handlePopularQuestionClick("How can I lose weight effectively?")}
                        className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                        <p className="font-medium text-blue-600">How can I lose weight effectively?</p>
                      </div>
                      <div 
                        onClick={() => handlePopularQuestionClick("What's the best pre-workout meal?")}
                        className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                        <p className="font-medium text-blue-600">What's the best pre-workout meal?</p>
                      </div>
                      <div 
                        onClick={() => handlePopularQuestionClick("How often should I change my workout routine?")}
                        className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                        <p className="font-medium text-blue-600">How often should I change my workout routine?</p>
                      </div>
                      <div 
                        onClick={() => handlePopularQuestionClick("What exercises are best for core strength?")}
                        className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                        <p className="font-medium text-blue-600">What exercises are best for core strength?</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
      
      {/* Forms and Modals */}
      {showModal && renderModal()}
    </div>
  );
};

export default AthleteDashboard;
