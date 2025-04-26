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
  
  // Form states
  const [showMealPlanForm, setShowMealPlanForm] = useState(false);
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
    if (!dashboardData.clients.length) {
      const mockClients = [
        { id: 1, name: 'John Doe', age: 28, goal: 'Weight loss', allergies: 'Peanuts', progress: 75, adherence: 82 },
        { id: 2, name: 'Jane Smith', age: 34, goal: 'Muscle gain', allergies: 'Dairy', progress: 88, adherence: 94 },
        { id: 3, name: 'Mike Johnson', age: 45, goal: 'Diabetes management', allergies: 'None', progress: 65, adherence: 70 },
        { id: 4, name: 'Sara Williams', age: 30, goal: 'Athletic performance', allergies: 'Gluten', progress: 92, adherence: 88 },
      ];
      
      const mockMealPlans = [
        { id: 1, clientId: 1, name: 'Weight Loss Plan', duration: '4 weeks', calories: 1800 },
        { id: 2, clientId: 2, name: 'Muscle Building Plan', duration: '6 weeks', calories: 2500 },
        { id: 3, clientId: 3, name: 'Diabetes Management Plan', duration: '12 weeks', calories: 2000 },
        { id: 4, clientId: 4, name: 'Athletic Performance Plan', duration: '8 weeks', calories: 2200 },
      ];

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
      
      // Set the mock data in state
      setDashboardData({
        clients: mockClients,
        mealPlans: mockMealPlans, 
        nutritionMetrics: mockNutritionMetrics
      });
    }
    
    // Simulate API call delay
    setTimeout(() => {
      setLoading(false);
    }, 800);
  }, [dashboardData.clients.length]);
  
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
    
    // Hide form
    setShowMealPlanForm(false);
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

  // Render meal plan form
  const renderMealPlanForm = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white p-6 rounded-xl shadow-md mb-6"
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Create New Meal Plan</h3>
        <button
          onClick={() => setShowMealPlanForm(false)}
          className="text-gray-500 hover:text-gray-700"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
        </div>
      
      <form onSubmit={handleAddMealPlan} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Meal Plan Name</label>
          <input
            type="text"
            name="name"
            value={newMealPlanData.name}
            onChange={handleMealPlanInputChange}
            className="w-full p-2 border border-gray-300 rounded focus:ring-orange-500 focus:border-orange-500"
            required
          />
      </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Client</label>
          <select
            name="clientId"
            value={newMealPlanData.clientId}
            onChange={handleMealPlanInputChange}
            className="w-full p-2 border border-gray-300 rounded focus:ring-orange-500 focus:border-orange-500"
            required
          >
            <option value="">Select a client</option>
            {dashboardData.clients.map(client => (
              <option key={client.id} value={client.id}>{client.name}</option>
            ))}
          </select>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
            <input
              type="text"
              name="duration"
              value={newMealPlanData.duration}
              onChange={handleMealPlanInputChange}
              placeholder="e.g. 4 weeks"
              className="w-full p-2 border border-gray-300 rounded focus:ring-orange-500 focus:border-orange-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Daily Calories</label>
            <input
              type="number"
              name="calories"
              value={newMealPlanData.calories}
              onChange={handleMealPlanInputChange}
              placeholder="e.g. 2000"
              className="w-full p-2 border border-gray-300 rounded focus:ring-orange-500 focus:border-orange-500"
              required
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
          <textarea
            name="notes"
            value={newMealPlanData.notes}
            onChange={handleMealPlanInputChange}
            rows="3"
            className="w-full p-2 border border-gray-300 rounded focus:ring-orange-500 focus:border-orange-500"
          ></textarea>
        </div>
        
        <div className="flex justify-end space-x-2">
          <button 
            type="button"
            onClick={() => setShowMealPlanForm(false)}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
          >
            Cancel
          </button>
          <button 
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-purple-600 border border-transparent rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
          >
            Create Meal Plan
          </button>
        </div>
      </form>
    </motion.div>
  );
  
  // Render modal for various forms
  const renderModal = () => (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
        className="bg-white rounded-xl shadow-xl w-full max-w-md"
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">{modalContent.title}</h3>
          <button 
              onClick={closeModal}
              className="text-gray-500 hover:text-gray-700"
          >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
          </button>
          </div>
          
          {modalContent.content}
        </div>
      </motion.div>
    </div>
  );
  
  // Client Form component
  const ClientForm = ({ onSubmit, onCancel }) => {
    const [clientData, setClientData] = useState({
      name: '',
      age: '',
      goal: '',
      allergies: 'None'
    });
    
    const handleChange = (e) => {
      const { name, value } = e.target;
      setClientData(prev => ({ ...prev, [name]: value }));
    };
    
    const handleSubmit = (e) => {
      e.preventDefault();
      onSubmit(clientData);
    };
    
    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Client Name</label>
          <input
            type="text"
            name="name"
            value={clientData.name}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded focus:ring-orange-500 focus:border-orange-500"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
          <input
            type="number"
            name="age"
            value={clientData.age}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded focus:ring-orange-500 focus:border-orange-500"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Goal</label>
          <select
            name="goal"
            value={clientData.goal}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded focus:ring-orange-500 focus:border-orange-500"
            required
          >
            <option value="">Select a goal</option>
            <option value="Weight loss">Weight loss</option>
            <option value="Muscle gain">Muscle gain</option>
            <option value="Maintenance">Maintenance</option>
            <option value="Athletic performance">Athletic performance</option>
            <option value="Diabetes management">Diabetes management</option>
            <option value="Heart health">Heart health</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Allergies or Restrictions</label>
          <input
            type="text"
            name="allergies"
            value={clientData.allergies}
            onChange={handleChange}
            placeholder="e.g. Peanuts, Dairy, Gluten (or None)"
            className="w-full p-2 border border-gray-300 rounded focus:ring-orange-500 focus:border-orange-500"
          />
        </div>
        
        <div className="flex justify-end space-x-2">
          <button 
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
          >
            Cancel
          </button>
          <button 
            type="submit"
            className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
          >
            Add Client
          </button>
        </div>
      </form>
    );
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
    <div className="bg-gray-50 min-h-screen flex flex-col">
      {/* Top Navigation Bar */}
      <div className="bg-white shadow-sm sticky top-0 z-30">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          {/* Website Logo */}
          <div className="flex items-center">
            <img src={logo} alt="logo" className="w-10 h-10" />
          </div>
          
          {/* User Profile and Actions */}
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center">
              <button className="flex items-center gap-2 text-gray-600 hover:text-orange-600 mr-4">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
                </svg>
              </button>
              <span className="text-sm text-gray-600 mr-2">Welcome back</span>
            </div>
            <div className="flex items-center gap-2 bg-gradient-to-r from-purple-50 to-teal-50 py-1 px-3 rounded-full">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-teal-600 flex items-center justify-center text-white shadow-md">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="hidden md:inline text-sm font-medium text-gray-700">Nutritionist</span>
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
                        <div className="text-center py-4 text-gray-500">
                          No meal plans yet. Create your first one!
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
            
            {/* Meal Plans Tab */}
            {activeTab === 'mealPlans' && (
              <div>
                {showMealPlanForm ? renderMealPlanForm() : (
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-gray-800">Meal Plans</h2>
                    <button 
                      onClick={() => setShowMealPlanForm(true)}
                      className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg flex items-center"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    Create New Plan
                  </button>
                </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {dashboardData.mealPlans.map(plan => (
                    <motion.div 
                      key={plan.id} 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
                    >
                      <h3 className="text-xl font-semibold text-gray-800">{plan.name}</h3>
                      <p className="text-gray-600 mt-2">Client: {dashboardData.clients.find(c => c.id === plan.clientId)?.name || 'Unknown'}</p>
                      <div className="mt-4 space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Duration:</span>
                          <span className="font-medium">{plan.duration}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Daily Calories:</span>
                          <span className="font-medium">{plan.calories} kcal</span>
                        </div>
                        {plan.notes && (
                          <div className="pt-2 text-sm text-gray-500">
                            <p className="font-medium text-gray-600">Notes:</p>
                            <p>{plan.notes}</p>
                          </div>
                        )}
                      </div>
                      <div className="mt-6 flex space-x-2">
                        <button className="bg-blue-100 text-blue-600 hover:bg-blue-200 py-1 px-3 rounded text-sm">
                          Edit
                        </button>
                        <button className="bg-green-100 text-green-600 hover:bg-green-200 py-1 px-3 rounded text-sm">
                          Share
                        </button>
                        <button 
                          onClick={() => handleDeleteMealPlan(plan.id)}
                          className="bg-red-100 text-red-600 hover:bg-red-200 py-1 px-3 rounded text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </motion.div>
                  ))}
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                    onClick={() => setShowMealPlanForm(true)}
                    className="bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100"
                  >
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </div>
                    <span className="mt-2 text-sm font-medium text-blue-600">Add New Meal Plan</span>
                  </motion.div>
                </div>
              </div>
            )}

            {/* Nutrition Analytics Tab */}
            {activeTab === 'nutrition' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-3 bg-white rounded-xl shadow-sm p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-gray-800">Nutrition Analytics Dashboard</h2>
                    <div className="flex space-x-2">
                      <select className="bg-white border border-gray-300 rounded-md px-3 py-1.5 text-sm">
                        <option>Last 7 days</option>
                        <option>Last 30 days</option>
                        <option>Last 3 months</option>
                        <option>Last 6 months</option>
                        <option>Custom</option>
                      </select>
                      <button className="bg-orange-500 hover:bg-orange-600 text-white rounded-md px-3 py-1.5 text-sm">
                        Export Report
                      </button>
                        </div>
                        </div>
                  </div>

                {/* Macro Distribution */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Client Macro Distribution</h3>
                  <div className="h-64">
                    <Pie 
                      data={dashboardData.nutritionMetrics.macroDistribution}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          title: {
                            display: true,
                            text: 'Average Macro Nutrients Distribution',
                            font: { size: 14 }
                          },
                          legend: {
                            position: 'bottom'
                          }
                        }
                      }}
                    />
                        </div>
                  </div>

                {/* Client Progress */}
                <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Client Progress Trends</h3>
                    <div className="h-64">
                      <Line 
                      data={dashboardData.nutritionMetrics.clientProgress}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          scales: {
                            y: {
                              beginAtZero: false
                            }
                        },
                        plugins: {
                          legend: {
                            position: 'top',
                          }
                          }
                        }}
                      />
                    </div>
                  </div>
                  
                {/* Nutrient Intake */}
                <div className="lg:col-span-3 bg-white rounded-xl shadow-sm p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Average Daily Nutrient Intake</h3>
                  <div className="h-72">
                    <Bar 
                      data={dashboardData.nutritionMetrics.nutrientIntake}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          scales: {
                            y: {
                              beginAtZero: true,
                            max: 150,
                            title: {
                              display: true,
                              text: 'Percentage of Recommended Daily Intake'
                            }
                          }
                        },
                        plugins: {
                          legend: {
                            display: false
                            }
                          }
                        }}
                      />
                  </div>
                </div>

                {/* Insights */}
                <div className="lg:col-span-3 bg-white rounded-xl shadow-sm p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Key Nutrition Insights</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-orange-50 p-4 rounded-lg">
                      <div className="flex items-center mb-2">
                        <div className="bg-orange-100 p-2 rounded-md text-orange-600 mr-3">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </div>
                        <h4 className="font-medium text-gray-800">Protein Intake</h4>
                    </div>
                      <p className="text-sm text-gray-600">Client protein intake is averaging 85% of targets. Consider recommending additional protein sources.</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <div className="flex items-center mb-2">
                        <div className="bg-green-100 p-2 rounded-md text-green-600 mr-3">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                    </div>
                        <h4 className="font-medium text-gray-800">Weight Progress</h4>
                      </div>
                      <p className="text-sm text-gray-600">Clients are showing consistent weight management progress, averaging 0.5kg per week.</p>
                    </div>
                    <div className="bg-red-50 p-4 rounded-lg">
                      <div className="flex items-center mb-2">
                        <div className="bg-red-100 p-2 rounded-md text-red-600 mr-3">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                        <h4 className="font-medium text-gray-800">Nutrient Deficiencies</h4>
                      </div>
                      <p className="text-sm text-gray-600">Vitamin D levels are below target for 65% of clients. Consider supplementation recommendations.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Client Management Tab */}
            {activeTab === 'clients' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-800">Client Management</h2>
                  <button 
                    onClick={() => {
                      setModalContent({
                        title: 'Add New Client',
                        content: <ClientForm onSubmit={handleAddClient} onCancel={closeModal} />
                      });
                      setShowModal(true);
                    }}
                    className="bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-lg flex items-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Add New Client
                  </button>
                </div>
                
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                  <div className="p-6">
                    <div className="mb-4 flex justify-between items-center">
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                          </svg>
                        </div>
                        <input 
                          type="text" 
                          placeholder="Search clients..." 
                          className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <select className="border border-gray-300 rounded-lg p-2 focus:ring-orange-500 focus:border-orange-500 text-sm">
                          <option>All Goals</option>
                          <option>Weight Loss</option>
                          <option>Muscle Gain</option>
                          <option>Athletic Performance</option>
                          <option>Health Management</option>
                        </select>
                        <select className="border border-gray-300 rounded-lg p-2 focus:ring-orange-500 focus:border-orange-500 text-sm">
                          <option>Sort by: Name</option>
                          <option>Sort by: Progress</option>
                          <option>Sort by: Recent</option>
                        </select>
                      </div>
                    </div>
                    
                    <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Age</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Goal</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Allergies</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Progress</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                          {dashboardData.clients.map(client => (
                            <tr key={client.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                                  <div className="flex-shrink-0 h-10 w-10 bg-orange-100 rounded-full text-orange-600 flex items-center justify-center font-semibold">
                                {client.name.charAt(0)}
                              </div>
                                  <div className="ml-3">
                                    <div className="text-sm font-medium text-gray-800">{client.name}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{client.age}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-orange-100 text-orange-800">
                                  {client.goal}
                            </span>
                          </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{client.allergies}</td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex flex-col">
                                  <div className="flex items-center">
                                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                                      <div className="bg-orange-600 h-2.5 rounded-full" style={{ width: `${client.progress}%` }}></div>
                                    </div>
                                    <span className="ml-2 text-xs text-gray-500">{client.progress}%</span>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <button className="text-orange-600 hover:text-orange-800 mr-3">
                                  View
                                </button>
                                <button className="text-orange-600 hover:text-orange-800 mr-3">
                                  Edit
                                </button>
                                <button 
                                  onClick={() => handleDeleteClient(client.id)}
                                  className="text-red-600 hover:text-red-800"
                                >
                                  Delete
                                </button>
                          </td>
                        </tr>
                      ))}
                          {dashboardData.clients.length === 0 && (
                            <tr>
                              <td colSpan="6" className="px-6 py-12 text-center text-sm text-gray-500">
                                <div className="flex flex-col items-center">
                                  <svg className="w-12 h-12 text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                  </svg>
                                  <h3 className="text-lg font-medium text-gray-700 mb-1">No clients found</h3>
                                  <p className="text-gray-500 mb-4">Get started by adding your first client.</p>
                                  <button 
                                    onClick={() => {
                                      setModalContent({
                                        title: 'Add New Client',
                                        content: <ClientForm onSubmit={handleAddClient} onCancel={closeModal} />
                                      });
                                      setShowModal(true);
                                    }}
                                    className="bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-lg flex items-center"
                                  >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                    </svg>
                                    Add New Client
                                  </button>
                                </div>
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

            {/* Education Resources Tab - Fixing layout issues */}
            {activeTab === 'education' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-800">Nutrition Education Resources</h2>
                  <button className="bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-lg flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                    Upload Resource
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="col-span-1 md:col-span-2">
                    <div className="bg-white rounded-xl shadow-sm p-6">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Resources</h3>
                      
                      <div className="space-y-4">
                        {/* Resource Card */}
                        <motion.div 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.3 }}
                          className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-start">
                            <div className="bg-orange-100 rounded-lg p-2 mr-4">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                    </div>
                            <div className="flex-1">
                              <h4 className="text-md font-medium text-gray-800">Comprehensive Macro Nutrition Guide</h4>
                              <p className="text-sm text-gray-500 mt-1">
                                Complete guide to understanding macronutrients and their role in nutrition planning.
                              </p>
                              <div className="mt-2 flex justify-between items-center">
                                <span className="text-xs text-gray-500">PDF • 2.4 MB • Added 2 days ago</span>
                                <div className="flex space-x-2">
                                  <button className="text-orange-600 hover:text-orange-800 text-sm">
                                    View
                                  </button>
                                  <button className="text-orange-600 hover:text-orange-800 text-sm">
                                    Share
                        </button>
                      </div>
                    </div>
                  </div>
                          </div>
                        </motion.div>
                        
                        <motion.div 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.3, delay: 0.1 }}
                          className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-start">
                            <div className="bg-green-100 rounded-lg p-2 mr-4">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </div>
                            <div className="flex-1">
                              <h4 className="text-md font-medium text-gray-800">Meal Planning Techniques Video</h4>
                              <p className="text-sm text-gray-500 mt-1">
                                Advanced techniques for creating effective meal plans for various client needs.
                              </p>
                              <div className="mt-2 flex justify-between items-center">
                                <span className="text-xs text-gray-500">MP4 • 18 minutes • Added 5 days ago</span>
                                <div className="flex space-x-2">
                                  <button className="text-orange-600 hover:text-orange-800 text-sm">
                                    Watch
                                  </button>
                                  <button className="text-orange-600 hover:text-orange-800 text-sm">
                                    Share
                        </button>
                      </div>
                    </div>
                  </div>
                          </div>
                        </motion.div>
                        
                        <motion.div 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.3, delay: 0.2 }}
                          className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-start">
                            <div className="bg-purple-100 rounded-lg p-2 mr-4">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                      </svg>
                    </div>
                            <div className="flex-1">
                              <h4 className="text-md font-medium text-gray-800">7-Day Detox Meal Plan Template</h4>
                              <p className="text-sm text-gray-500 mt-1">
                                Customizable template for creating 7-day detox plans for clients looking to reset their nutrition.
                              </p>
                              <div className="mt-2 flex justify-between items-center">
                                <span className="text-xs text-gray-500">DOCX • 3.1 MB • Added 1 week ago</span>
                                <div className="flex space-x-2">
                                  <button className="text-orange-600 hover:text-orange-800 text-sm">
                                    Download
                                  </button>
                                  <button className="text-orange-600 hover:text-orange-800 text-sm">
                                    Share
                        </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="col-span-1">
                    <div className="bg-white rounded-xl shadow-sm p-6">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">Resource Categories</h3>
                      
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                          <div className="flex items-center">
                            <div className="bg-orange-100 p-2 rounded-md mr-3">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                            <span className="font-medium text-gray-800">Meal Plans</span>
                      </div>
                          <span className="text-sm text-gray-500">12 items</span>
                    </div>
                        
                        <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                          <div className="flex items-center">
                            <div className="bg-blue-100 p-2 rounded-md mr-3">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                              </svg>
                            </div>
                            <span className="font-medium text-gray-800">Educational Materials</span>
                          </div>
                          <span className="text-sm text-gray-500">8 items</span>
                  </div>
                  
                        <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                          <div className="flex items-center">
                            <div className="bg-green-100 p-2 rounded-md mr-3">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </div>
                            <span className="font-medium text-gray-800">Video Resources</span>
                          </div>
                          <span className="text-sm text-gray-500">5 items</span>
                        </div>
                        
                        <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                          <div className="flex items-center">
                            <div className="bg-purple-100 p-2 rounded-md mr-3">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                              </svg>
                            </div>
                            <div className="flex-1">
                              <h4 className="text-md font-medium text-gray-800">Client Handouts</h4>
                              <p className="text-sm text-gray-500 mt-1">
                                Customizable template for creating 7-day detox plans for clients looking to reset their nutrition.
                              </p>
                              <div className="mt-2 flex justify-between items-center">
                                <span className="text-xs text-gray-500">DOCX • 3.1 MB • Added 1 week ago</span>
                                <div className="flex space-x-2">
                                  <button className="text-orange-600 hover:text-orange-800 text-sm">
                                    Download
                                  </button>
                                  <button className="text-orange-600 hover:text-orange-800 text-sm">
                                    Share
                        </button>
                                </div>
                              </div>
                      </div>
                    </div>
                  </div>
                  
                        <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                          <div className="flex items-center">
                            <div className="bg-yellow-100 p-2 rounded-md mr-3">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                            <span className="font-medium text-gray-800">Recipes</span>
                          </div>
                          <span className="text-sm text-gray-500">24 items</span>
                        </div>
                      </div>
                      
                      <div className="mt-6 pt-6 border-t border-gray-200">
                        <h4 className="text-md font-medium text-gray-800 mb-3">Quick Actions</h4>
                        <div className="space-y-2">
                          <button className="w-full flex items-center justify-center p-2 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                            </svg>
                            Upload New Resource
                          </button>
                          <button className="w-full flex items-center justify-center p-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V7a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                            </svg>
                            Create New Folder
                        </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* AI Assistance Tab */}
            {activeTab === 'ai' && (
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Nutrition AI Assistant</h3>
                  <div className="flex flex-col h-[600px]">
                    <div className="flex-1 overflow-y-auto mb-4 p-4 bg-gray-50 rounded-lg">
                      {chatMessages.map((msg, index) => (
                        <div key={index} className={`mb-4 ${msg.sender === 'ai' ? 'flex' : 'flex justify-end'}`}>
                          <div className={`max-w-3/4 p-3 rounded-lg ${
                            msg.sender === 'ai' 
                              ? 'bg-white border border-gray-200 text-gray-800' 
                              : 'bg-orange-600 text-white'
                          }`}>
                            <div className={`whitespace-pre-wrap ${msg.sender === 'ai' ? 'text-gray-800' : 'text-white'}`}>
                              {msg.content}
                            </div>
                          </div>
                        </div>
                      ))}
                      <div ref={chatEndRef} />
                    </div>
                    
                    {/* Chat Input */}
                    <div className="border-t border-gray-200 pt-4">
                      <div className="mb-2">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Popular Questions:</h4>
                        <div className="flex flex-wrap gap-2">
                          <button 
                            onClick={() => handlePopularQuestionClick("How do I create a balanced meal plan?")}
                            className="bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs py-1 px-2 rounded-full"
                          >
                            How do I create a balanced meal plan?
                          </button>
                          <button 
                            onClick={() => handlePopularQuestionClick("What are good protein sources for vegetarians?")}
                            className="bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs py-1 px-2 rounded-full"
                          >
                            Protein for vegetarians?
                          </button>
                          <button 
                            onClick={() => handlePopularQuestionClick("How can I help clients reduce sugar intake?")}
                            className="bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs py-1 px-2 rounded-full"
                          >
                            Reducing sugar intake
                          </button>
                        </div>
                      </div>
                      <div className="relative">
                        <textarea
                          value={messageInput}
                          onChange={handleMessageInputChange}
                          onKeyDown={handleMessageKeyDown}
                          placeholder="Ask your nutrition question here..."
                          className="w-full border border-gray-300 rounded-lg py-3 px-4 pr-12 focus:ring-orange-500 focus:border-orange-500 resize-none"
                          rows="3"
                        ></textarea>
                        <button
                          onClick={handleSendMessage}
                          className="absolute right-3 bottom-3 bg-orange-600 text-white rounded-full p-2 hover:bg-orange-700"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                          </svg>
                        </button>
                      </div>
                      <div className="mt-3 flex justify-between">
                        <button
                          onClick={handleGenerateMealPlan}
                          className="text-sm text-orange-600 hover:text-orange-800 flex items-center"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                          Generate Meal Plan
                        </button>
                        <button 
                          className="text-sm text-gray-500 hover:text-gray-700"
                          onClick={() => setChatMessages([{ 
                            sender: 'ai', 
                            content: "Hello! I'm your AI nutrition assistant. How can I help you with your nutrition planning today?" 
                          }])}
                        >
                          Clear Chat
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
          </div>
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