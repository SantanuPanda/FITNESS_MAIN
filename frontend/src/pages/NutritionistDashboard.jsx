import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import { 
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line, Bar, Pie } from 'react-chartjs-2';

// Import our new components
import MealPlans from '../components/dashboard/nutritionist/MealPlans';
import ClientManagement from '../components/dashboard/nutritionist/ClientManagement';
import NutritionAnalytics from '../components/dashboard/nutritionist/NutritionAnalytics';
import AiAssistant from '../components/dashboard/nutritionist/AiAssistant';
import ResourceLibrary from '../components/dashboard/nutritionist/ResourceLibrary';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const NutritionistDashboard = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  
  // State for dashboard data with localStorage persistence
  const [dashboardData, setDashboardData] = useState(() => {
    // Try to get data from localStorage first
    const savedData = localStorage.getItem('nutritionistData');
    return savedData ? JSON.parse(savedData) : {
      clients: [],
      mealPlans: [],
      nutritionMetrics: {}
    };
  });
  
  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState({
    title: '',
    content: null,
    onConfirm: null
  });
  
  // Form states - removed showMealPlanForm since we moved that to the MealPlans component
  const [newMealPlanData, setNewMealPlanData] = useState({
    name: '',
    clientId: '',
    duration: '',
    calories: '',
    notes: ''
  });
  
  // Stats for quick view
  const [nutritionStats, setNutritionStats] = useState({
    clientProgress: 0,
    mealPlanAdherence: 0,
    nutritionScore: 0
  });
  
  // AI Assistant state
  const [chatMessages, setChatMessages] = useState([
    { 
      sender: 'ai', 
      content: "Hello! I'm your AI nutrition assistant. How can I help you with your nutrition planning today?" 
    }
  ]);
  const [messageInput, setMessageInput] = useState('');
  const chatEndRef = useRef(null);
  const [showNotifications, setShowNotifications] = useState(false);
  
  // Save dashboard data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('nutritionistData', JSON.stringify(dashboardData));
  }, [dashboardData]);
  
  // Scroll to bottom of chat when messages change
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  // Mock data - would be replaced with actual API calls
  useEffect(() => {
    // For demo purposes, setting mock data if no data exists
    const savedData = localStorage.getItem('nutritionistData');
    const hasInitialized = localStorage.getItem('hasInitializedDashboard');
    
    if (!hasInitialized) {
      const mockNutritionMetrics = {
        macroDistribution: {
          labels: ['Protein', 'Carbs', 'Fat'],
          datasets: [{
            label: 'Recommended Macro Distribution',
            data: [30, 40, 30],
            backgroundColor: ['#9333ea', '#14b8a6', '#a78bfa'],
          }]
        },
        clientProgress: {
          labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6'],
          datasets: [
            {
              label: 'Average Weight (kg)',
              data: [85, 84.2, 83.5, 82.8, 82.1, 81.5],
              borderColor: '#9333ea',
              backgroundColor: 'rgba(147, 51, 234, 0.2)',
            },
            {
              label: 'Average BMI',
              data: [28, 27.8, 27.5, 27.3, 27.1, 26.9],
              borderColor: '#14b8a6',
              backgroundColor: 'rgba(20, 184, 166, 0.2)',
            }
          ]
        },
        nutrientIntake: {
          labels: ['Vitamin A', 'Vitamin C', 'Vitamin D', 'Iron', 'Calcium', 'Potassium'],
          datasets: [{
            label: 'Average Daily Intake (% of RDI)',
            data: [85, 120, 65, 75, 90, 80],
            backgroundColor: 'rgba(147, 51, 234, 0.6)',
          }]
        }
      };
      
      // Set the mock data in state without clients
      setDashboardData({
        clients: [], // Start with an empty clients array
        mealPlans: [], // No meal plans initially
        nutritionMetrics: mockNutritionMetrics
      });
      
      // Mark as initialized
      localStorage.setItem('hasInitializedDashboard', 'true');
    }
    
    // Simulate API call delay
    setTimeout(() => {
      setLoading(false);
    }, 800);
  }, []); // Empty dependency array to run only once
  
  // Calculate nutrition statistics
  useEffect(() => {
    if (dashboardData.clients.length === 0) {
      setNutritionStats({
        clientProgress: 0,
        mealPlanAdherence: 0,
        nutritionScore: 0
      });
      return;
    }
    
    // Calculate client progress
    let totalProgress = 0;
    dashboardData.clients.forEach(client => {
      totalProgress += client.progress || 0;
    });
    const avgProgress = Math.round(totalProgress / dashboardData.clients.length);
    
    // Calculate meal plan adherence
    let totalAdherence = 0;
    dashboardData.clients.forEach(client => {
      totalAdherence += client.adherence || 0;
    });
    const avgAdherence = Math.round(totalAdherence / dashboardData.clients.length);
    
    // Calculate nutrition score (could be based on various metrics)
    // For this demo, let's create a score from 0-100 based on progress and adherence
    const nutritionScore = Math.round((avgProgress + avgAdherence) / 2);
    
    setNutritionStats({
      clientProgress: avgProgress,
      mealPlanAdherence: avgAdherence,
      nutritionScore: nutritionScore
    });
  }, [dashboardData.clients]);

  // Handle input change for meal plan form
  const handleMealPlanInputChange = (e) => {
    const { name, value } = e.target;
    setNewMealPlanData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle adding a new meal plan
  const handleAddMealPlan = (e) => {
    e.preventDefault();
    
    const newMealPlan = {
      id: Date.now(), // Generate unique ID
      clientId: parseInt(newMealPlanData.clientId),
      name: newMealPlanData.name,
      duration: newMealPlanData.duration,
      calories: parseInt(newMealPlanData.calories),
      notes: newMealPlanData.notes
    };
    
    setDashboardData(prev => ({
      ...prev,
      mealPlans: [...prev.mealPlans, newMealPlan]
    }));
    
    // Reset form
    setNewMealPlanData({
      name: '',
      clientId: '',
      duration: '',
      calories: '',
      notes: ''
    });
  };

  // Handle deleting a meal plan
  const handleDeleteMealPlan = (mealPlanId) => {
    setDashboardData(prev => ({
      ...prev,
      mealPlans: prev.mealPlans.filter(plan => plan.id !== mealPlanId)
    }));
  };
  
  // Handle adding a new client
  const handleAddClient = (newClient) => {
    setDashboardData(prev => ({
      ...prev,
      clients: [...prev.clients, { id: Date.now(), progress: 0, adherence: 0, ...newClient }]
    }));
    closeModal();
  };
  
  // Handle deleting a client
  const handleDeleteClient = (clientId) => {
    setDashboardData(prev => ({
      ...prev,
      clients: prev.clients.filter(client => client.id !== clientId),
      // Also remove any meal plans associated with this client
      mealPlans: prev.mealPlans.filter(plan => plan.clientId !== clientId)
    }));
  };
  
  // Handle updating client data
  const handleUpdateClient = (updatedClient) => {
    setDashboardData(prev => {
      // Find the client index
      const clientIndex = prev.clients.findIndex(c => c.id === updatedClient.id);
      
      if (clientIndex === -1) return prev;
      
      // Create a new clients array with the updated client
      const updatedClients = [...prev.clients];
      updatedClients[clientIndex] = updatedClient;
      
      return {
        ...prev,
        clients: updatedClients
      };
    });
  };
  
  // Close modal helper
  const closeModal = () => {
    setShowModal(false);
    setModalContent({ title: '', content: null, onConfirm: null });
  };

  // Handle sending a message in the AI assistant
  const handleSendMessage = () => {
    if (messageInput.trim() === '') return;
    
    // Add user message
    setChatMessages(prev => [...prev, { sender: 'user', content: messageInput }]);
    
    // Generate AI response
    generateAiResponse(messageInput);
    
    // Clear input
    setMessageInput('');
  };

  // Handle message input change
  const handleMessageInputChange = (e) => {
    setMessageInput(e.target.value);
  };

  // Handle message key down (for Enter key)
  const handleMessageKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Generate AI response based on user input
  const generateAiResponse = (userInput) => {
    // Simulate AI thinking with a delay
    setTimeout(() => {
      // Sample responses based on keywords
      let response;
      
      if (userInput.toLowerCase().includes('meal plan')) {
        response = "I can help you create a personalized meal plan! To get started, I'll need some information about your client's goals, preferences, and any dietary restrictions they might have.";
      } else if (userInput.toLowerCase().includes('diet') || userInput.toLowerCase().includes('nutrition')) {
        response = "Nutrition is key to achieving any health goal. What specific nutrition advice are you looking for? I can provide recommendations for weight loss, muscle gain, or managing specific health conditions.";
      } else if (userInput.toLowerCase().includes('recipe') || userInput.toLowerCase().includes('food')) {
        response = "I have many healthy recipe ideas! What types of foods or dietary preferences would you like recipes for?";
      } else {
        response = "I'm here to help with any nutrition or meal planning questions. Could you provide more details about what you're looking for?";
      }
      
      setChatMessages(prev => [...prev, { sender: 'ai', content: response }]);
    }, 1000);
  };

  // Handle popular question click
  const handlePopularQuestionClick = (question) => {
    setChatMessages(prev => [...prev, { sender: 'user', content: question }]);
    generateAiResponse(question);
  };

  // Handle generating a meal plan with AI
  const handleGenerateMealPlan = () => {
    handlePopularQuestionClick("Can you help me create a balanced meal plan for weight loss?");
  };

  // Tabs configuration
  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z' },
    { id: 'mealPlans', label: 'Meal Plans', icon: 'M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z' },
    { id: 'nutrition', label: 'Nutrition Analytics', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
    { id: 'clients', label: 'Client Management', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' },
    { id: 'education', label: 'Education Resources', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' },
    { id: 'ai', label: 'AI Assistance', icon: 'M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z M9.75 15.75a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM14.25 15.75a1.5 1.5 0 100-3 1.5 1.5 0 000 3z' }
  ];

  // Close notifications when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      const notificationButton = document.getElementById('nutritionist-notification-button');
      const notificationPanel = document.getElementById('nutritionist-notification-panel');
      
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

  // Function to clear all data (for testing/reset purposes)
  const clearAllData = () => {
    // Clear localStorage data
    localStorage.removeItem('nutritionistData');
    localStorage.removeItem('hasInitializedDashboard');
    
    // Reset state
    setDashboardData({
      clients: [],
      mealPlans: [],
      nutritionMetrics: {}
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
          <p className="mt-4 text-purple-600 font-medium">Loading your nutrition dashboard...</p>
          </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-50">
      {/* Header with user info */}
      <header className="bg-white shadow-sm py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center">
            <img src="/logo.png" alt="Nutrition Coach Logo" className="h-10 w-10 mr-3" />
            <h1 className="text-xl font-bold text-gray-800">Nutrition Dashboard</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center relative">
              <button 
                id="nutritionist-notification-button"
                className="flex items-center gap-2 text-gray-600 hover:text-teal-600 mr-4"
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
                  id="nutritionist-notification-panel"
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
              
              <span className="text-sm text-gray-600">Welcome back</span>
            </div>
            
            <div className="flex items-center gap-2 bg-gradient-to-r from-green-50 to-teal-50 py-1 px-3 rounded-full">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-500 to-teal-600 flex items-center justify-center text-white">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="hidden md:inline text-sm font-medium">Nutritionist</span>
            </div>
          </div>
        </div>
      </header>

      {/* Rest of the dashboard content */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Sidebar */}
        <motion.div 
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="bg-white shadow-lg md:w-64 md:min-h-screen z-20"
        >
          <div className="p-4 bg-gradient-to-r from-purple-600 to-teal-500 text-white">
            <h1 className="text-xl font-bold">Nutritionist Dashboard</h1>
            <p className="text-sm mt-1 opacity-90">Nutrition Management</p>
          </div>
          <nav className="py-4">
            {tabs.map((tab) => (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                whileTap={{ scale: 0.98 }}
                className={`w-full px-4 py-3 flex items-center space-x-3 transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-purple-50 text-purple-600 font-medium border-l-4 border-purple-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <svg
                  className={`w-5 h-5 ${activeTab === tab.id ? 'text-purple-600' : 'text-gray-500'}`}
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
          <div className="mt-6 mx-3 p-4 bg-gradient-to-br from-purple-50 to-teal-50 rounded-lg">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Nutrition Status</h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">Client Progress</span>
                <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 rounded-full" style={{ width: `${nutritionStats.clientProgress}%` }}></div>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">Meal Plan Adherence</span>
                <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-purple-500 rounded-full" style={{ width: `${nutritionStats.mealPlanAdherence}%` }}></div>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">Nutrition Score</span>
                <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-teal-500 rounded-full" style={{ width: `${nutritionStats.nutritionScore}%` }}></div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Main Content Area */}
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
                  <span className="font-medium text-purple-600">{tabs.find(t => t.id === activeTab)?.label}</span>
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-gray-800 flex items-center">
                  {tabs.find(t => t.id === activeTab)?.label}
                  <span className="ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                    Nutritionist
                  </span>
                </h2>
                <p className="text-gray-600">Your nutrition management dashboard</p>
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
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Overview Stats */}
                <div className="lg:col-span-3 bg-white rounded-xl shadow-sm overflow-hidden">
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Nutrition Dashboard Overview</h3>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                      <div className="bg-purple-50 rounded-lg p-4">
                        <div className="text-purple-500 mb-2">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                          </svg>
                        </div>
                        <p className="text-xs text-gray-500">Total Clients</p>
                        <p className="text-xl font-bold text-gray-800">{dashboardData.clients.length}</p>
                      </div>
                      <div className="bg-green-50 rounded-lg p-4">
                        <div className="text-green-500 mb-2">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                          </svg>
                        </div>
                        <p className="text-xs text-gray-500">Active Meal Plans</p>
                        <p className="text-xl font-bold text-gray-800">{dashboardData.mealPlans.length}</p>
                      </div>
                      <div className="bg-yellow-50 rounded-lg p-4">
                        <div className="text-yellow-500 mb-2">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                          </svg>
                        </div>
                        <p className="text-xs text-gray-500">Avg. Client Progress</p>
                        <p className="text-xl font-bold text-gray-800">82%</p>
                      </div>
                      <div className="bg-purple-50 rounded-lg p-4">
                        <div className="text-purple-500 mb-2">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </div>
                        <p className="text-xs text-gray-500">Upcoming Consultations</p>
                        <p className="text-xl font-bold text-gray-800">8</p>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <div className="text-sm text-gray-500 flex items-center">
                        <svg className="w-4 h-4 mr-1 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        Last updated: Today, {new Date().toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Recent Meal Plans */}
                <div className="lg:col-span-2 bg-white rounded-xl shadow-sm overflow-hidden">
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold text-gray-800">Recent Meal Plans</h3>
                      <button 
                        onClick={() => setActiveTab('mealPlans')}
                        className="text-sm text-purple-600 hover:text-purple-800"
                      >
                        View All
                      </button>
                    </div>
                    <div className="space-y-4">
                      {dashboardData.mealPlans.slice(0, 3).map(plan => (
                        <div key={plan.id} className="flex justify-between items-center p-3 hover:bg-gray-50 rounded-lg transition-colors">
                          <div>
                            <h4 className="font-medium text-gray-800">{plan.name}</h4>
                            <p className="text-sm text-gray-500">
                              Client: {dashboardData.clients.find(c => c.id === plan.clientId)?.name || 'Unknown'} • {plan.duration}
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-semibold text-purple-600">{plan.calories} kcal</div>
                          </div>
                        </div>
                      ))}
                      {dashboardData.mealPlans.length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                          <svg 
                            className="w-12 h-12 mx-auto text-gray-300 mb-3" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                          </svg>
                          <p className="text-md font-medium mb-1">No meal plans yet</p>
                          <button 
                            onClick={() => setShowMealPlanForm(true)}
                            className="text-sm text-purple-600 hover:text-purple-800 font-medium mt-2"
                          >
                            Create your first one
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Nutrition Metrics */}
                <div className="lg:col-span-1 bg-white rounded-xl shadow-sm overflow-hidden">
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold text-gray-800">Nutrition Metrics</h3>
                      <button 
                        onClick={() => setActiveTab('nutrition')}
                        className="text-sm text-blue-600 hover:text-blue-800"
                      >
                        View Details
                      </button>
                    </div>
                    <div className="h-52">
                      <Pie 
                        data={dashboardData.nutritionMetrics.macroDistribution}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          plugins: {
                            legend: {
                              position: 'bottom',
                            }
                          }
                        }}
                      />
                    </div>
                  </div>
                </div>
                
                {/* Client Management Quick Access */}
                <div className="lg:col-span-3 bg-white rounded-xl shadow-sm overflow-hidden">
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold text-gray-800">Recent Clients</h3>
                      <button 
                        onClick={() => {
                          setModalContent({
                            title: 'Add New Client',
                            content: <ClientForm onSubmit={handleAddClient} onCancel={closeModal} />
                          });
                          setShowModal(true);
                        }}
                        className="flex items-center text-sm text-blue-600 hover:text-blue-800"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Add Client
                      </button>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Age</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Goal</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Allergies</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {dashboardData.clients.slice(0, 3).map(client => (
                            <tr key={client.id}>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <div className="flex-shrink-0 h-8 w-8 bg-blue-100 rounded-full text-blue-600 flex items-center justify-center">
                                    {client.name.charAt(0)}
                                  </div>
                                  <div className="ml-3">
                                    <div className="text-sm font-medium text-gray-800">{client.name}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{client.age}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{client.goal}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{client.allergies}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                                <button className="text-blue-600 hover:text-blue-800 mr-3">Profile</button>
                                <button className="text-blue-600 hover:text-blue-800">Plan</button>
                              </td>
                            </tr>
                          ))}
                          {dashboardData.clients.length === 0 && (
                            <tr>
                              <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                                No clients yet. Add your first client to get started.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Meal Plans Tab - Use the new component */}
            {activeTab === 'mealPlans' && (
              <MealPlans 
                mealPlans={dashboardData.mealPlans}
                clients={dashboardData.clients}
                onAddMealPlan={handleAddMealPlan}
                onDeleteMealPlan={handleDeleteMealPlan}
              />
            )}

            {/* Nutrition Analytics Tab - Use the new component */}
            {activeTab === 'nutrition' && (
              <NutritionAnalytics 
                nutritionMetrics={dashboardData.nutritionMetrics}
              />
            )}

            {/* Client Management Tab - Use the new component */}
            {activeTab === 'clients' && (
              <ClientManagement 
                clients={dashboardData.clients}
                onAddClient={handleAddClient}
                onDeleteClient={handleDeleteClient}
                onUpdateClient={handleUpdateClient}
              />
            )}

            {/* Education Resources Tab - Use the new component */}
            {activeTab === 'education' && (
              <ResourceLibrary />
            )}
            
            {/* AI Assistance Tab - Use the new component */}
            {activeTab === 'ai' && (
              <AiAssistant />
            )}
          </motion.div>
      </div>
      </div>
      
      {/* Modal */}
      {showModal && renderModal()}
    </div>
  );
};

export default NutritionistDashboard; 