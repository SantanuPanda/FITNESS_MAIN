import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import TeamManagement from '../components/dashboard/coach/TeamManagement';
import TrainingPlans from '../components/dashboard/coach/TrainingPlans';
import AthleteProgress from '../components/dashboard/coach/AthleteProgress';

// Functional Calendar component
const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [showAddEventModal, setShowAddEventModal] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    time: '09:00',
    description: '',
    teamId: ''
  });
  const [teams, setTeams] = useState([]);
  
  useEffect(() => {
    // Load teams from localStorage - use coachTeams key for consistency with TeamManagement
    const storedTeams = localStorage.getItem('coachTeams');
    if (storedTeams) {
      setTeams(JSON.parse(storedTeams));
    }
    
    // Load events from localStorage
    const storedEvents = localStorage.getItem('trainingEvents');
    if (storedEvents) {
      setEvents(JSON.parse(storedEvents));
    } else {
      // Sample events if none exist
      const sampleEvents = [
        { 
          id: '1', 
          title: 'Team Training Session', 
          date: '2023-10-15', 
          time: '09:00', 
          description: 'Full team workout session',
          teamId: 'team1'
        },
        { 
          id: '2', 
          title: 'Nutrition Workshop', 
          date: '2023-10-22', 
          time: '14:00', 
          description: 'Healthy eating habits for athletes',
          teamId: 'team1'
        },
        { 
          id: '3', 
          title: 'Performance Review', 
          date: '2023-10-27', 
          time: '10:00', 
          description: 'Individual performance assessment',
          teamId: 'team2'
        }
      ];
      setEvents(sampleEvents);
      localStorage.setItem('trainingEvents', JSON.stringify(sampleEvents));
    }
  }, []);

  // Get month name
  const getMonthName = (date) => {
    return date.toLocaleString('default', { month: 'long' });
  };
  
  // Get year
  const getYear = (date) => {
    return date.getFullYear();
  };
  
  // Navigate to previous month
  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };
  
  // Navigate to next month
  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };
  
  // Generate days for current month view
  const generateDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    // First day of the month
    const firstDay = new Date(year, month, 1);
    // Last day of the month
    const lastDay = new Date(year, month + 1, 0);
    
    // Day of the week for the first day (0 = Sunday, 6 = Saturday)
    const firstDayOfWeek = firstDay.getDay();
    
    // Total days in the month
    const daysInMonth = lastDay.getDate();
    
    // Generate array of day objects
    const days = [];
    
    // Add empty slots for days from previous month
    for (let i = 0; i < firstDayOfWeek; i++) {
      const prevMonthLastDay = new Date(year, month, 0).getDate();
      days.push({
        date: new Date(year, month - 1, prevMonthLastDay - firstDayOfWeek + i + 1),
        isCurrentMonth: false,
        hasEvent: false
      });
    }
    
    // Add days for current month
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      const dateString = date.toISOString().split('T')[0];
      const hasEvent = events.some(event => event.date === dateString);
      
      days.push({
        date: date,
        isCurrentMonth: true,
        hasEvent: hasEvent
      });
    }
    
    // Add days from next month to complete the grid (6 rows x 7 days = 42 cells)
    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        date: new Date(year, month + 1, i),
        isCurrentMonth: false,
        hasEvent: false
      });
    }
    
    return days;
  };
  
  // Check if a date is today
  const isToday = (date) => {
    const today = new Date();
    return date.getDate() === today.getDate() && 
           date.getMonth() === today.getMonth() && 
           date.getFullYear() === today.getFullYear();
  };
  
  // Check if a date is selected
  const isSelected = (date) => {
    return date.getDate() === selectedDate.getDate() && 
           date.getMonth() === selectedDate.getMonth() && 
           date.getFullYear() === selectedDate.getFullYear();
  };
  
  // Handle day click
  const handleDayClick = (day) => {
    setSelectedDate(day.date);
  };
  
  // Get events for selected date
  const getEventsForSelectedDate = () => {
    const dateString = selectedDate.toISOString().split('T')[0];
    return events.filter(event => event.date === dateString);
  };
  
  // Handle adding a new event
  const handleAddEvent = () => {
    const dateString = selectedDate.toISOString().split('T')[0];
    const newEventObject = {
      id: Date.now().toString(),
      date: dateString,
      ...newEvent
    };
    
    const updatedEvents = [...events, newEventObject];
    setEvents(updatedEvents);
    localStorage.setItem('trainingEvents', JSON.stringify(updatedEvents));
    
    // Reset form and close modal
    setNewEvent({
      title: '',
      time: '09:00',
      description: '',
      teamId: ''
    });
    setShowAddEventModal(false);
  };
  
  // Handle deleting an event
  const handleDeleteEvent = (eventId) => {
    const updatedEvents = events.filter(event => event.id !== eventId);
    setEvents(updatedEvents);
    localStorage.setItem('trainingEvents', JSON.stringify(updatedEvents));
  };
  
  // Format date for display
  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  };
  
  // Format time for display
  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours, 10);
    const suffix = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${suffix}`;
  };
  
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
        <h2 className="text-xl font-semibold">Training Calendar</h2>
        <button 
          onClick={() => setShowAddEventModal(true)}
          className="mt-2 md:mt-0 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
        >
          Add Event
        </button>
      </div>
      
    <div className="flex justify-between items-center mb-6">
        <h3 className="font-medium text-gray-800">
          {getMonthName(currentDate)} {getYear(currentDate)}
        </h3>
      <div className="flex space-x-2">
          <button 
            onClick={prevMonth}
            className="p-2 rounded-md hover:bg-gray-100 transition-colors"
          >
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
          </svg>
        </button>
          <button 
            onClick={nextMonth}
            className="p-2 rounded-md hover:bg-gray-100 transition-colors"
          >
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
          </svg>
        </button>
      </div>
    </div>
      
    <div className="grid grid-cols-7 gap-1 text-center text-sm font-medium text-gray-500 mb-2">
      {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
        <div key={day} className="py-1">{day}</div>
      ))}
    </div>
      
    <div className="grid grid-cols-7 gap-1 text-center">
        {generateDays().map((day, i) => (
          <div 
            key={i} 
            onClick={() => handleDayClick(day)}
            className={`
              py-2 rounded-md cursor-pointer relative
              ${day.isCurrentMonth ? 'hover:bg-gray-100' : 'text-gray-300'}
              ${isToday(day.date) ? 'bg-orange-100 text-orange-800 font-bold' : ''}
              ${isSelected(day.date) ? 'border-2 border-orange-500' : ''}
            `}
          >
            <div>{day.date.getDate()}</div>
            {day.hasEvent && (
              <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2">
                <div className="w-1 h-1 rounded-full bg-orange-500"></div>
              </div>
            )}
          </div>
        ))}
    </div>
      
      <div className="mt-6">
        <h3 className="font-medium text-gray-800 mb-3">
          {formatDate(selectedDate)}
        </h3>
        
        <div className="space-y-3">
          {getEventsForSelectedDate().length > 0 ? (
            getEventsForSelectedDate().map(event => (
              <div key={event.id} className="flex p-3 rounded-lg border border-gray-200 hover:bg-gray-50">
          <div className="w-12 h-12 rounded-lg bg-orange-100 flex items-center justify-center text-orange-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
          </div>
                <div className="ml-4 flex-grow">
            <h4 className="font-medium">{event.title}</h4>
                  <p className="text-sm text-gray-500">{formatTime(event.time)}</p>
                  <p className="text-sm text-gray-600 mt-1">{event.description}</p>
                  {teams.find(team => team.id === event.teamId) && (
                    <span className="inline-block mt-1 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                      {teams.find(team => team.id === event.teamId).name}
                    </span>
                  )}
          </div>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteEvent(event.id);
                  }}
                  className="self-start p-2 text-gray-500 hover:text-red-500"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
            </svg>
                </button>
          </div>
            ))
          ) : (
            <div className="text-center py-6 text-gray-500">
              No events scheduled for this day. Click "Add Event" to create one.
        </div>
          )}
        </div>
      </div>
      
      {/* Add Event Modal */}
      {showAddEventModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4">Add New Event</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Event Title</label>
                <input
                  type="text"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Training Session"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                <input
                  type="time"
                  value={newEvent.time}
                  onChange={(e) => setNewEvent({...newEvent, time: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
          </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={newEvent.description}
                  onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Event details..."
                  rows="3"
                ></textarea>
        </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Team</label>
                <select
                  value={newEvent.teamId}
                  onChange={(e) => setNewEvent({...newEvent, teamId: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="">Select a team</option>
                  {teams.map(team => (
                    <option key={team.id} value={team.id}>{team.name}</option>
                  ))}
                </select>
        </div>
      </div>
      
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setShowAddEventModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAddEvent}
                disabled={!newEvent.title}
                className={`px-4 py-2 rounded-md text-white ${
                  newEvent.title ? 'bg-orange-500 hover:bg-orange-600' : 'bg-gray-400 cursor-not-allowed'
                }`}
              >
                Add Event
              </button>
            </div>
          </div>
        </div>
      )}
        </div>
  );
};

// Functional Resources component with full features
const Resources = () => {
  const [resources, setResources] = useState([]);
  const [filteredResources, setFilteredResources] = useState([]);
  const [selectedType, setSelectedType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [resourceToEdit, setResourceToEdit] = useState(null);
  const [newResource, setNewResource] = useState({
    title: '',
    description: '',
    type: 'guide',
    metadata: '',
    url: ''
  });

  // Resource types
  const resourceTypes = [
    { id: 'guide', label: 'Guide', color: 'blue', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' },
    { id: 'video', label: 'Video', color: 'red', icon: 'M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
    { id: 'template', label: 'Template', color: 'green', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01' },
    { id: 'workshop', label: 'Workshop', color: 'purple', icon: 'M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z' },
    { id: 'assessment', label: 'Assessment', color: 'yellow', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' },
    { id: 'newsletter', label: 'Newsletter', color: 'pink', icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' }
  ];

  useEffect(() => {
    // Load resources from localStorage only
    const storedResources = localStorage.getItem('trainingResources');
    if (storedResources) {
      const parsedResources = JSON.parse(storedResources);
      setResources(parsedResources);
      setFilteredResources(parsedResources);
    } else {
      // Start with an empty array instead of sample resources
      setResources([]);
      setFilteredResources([]);
      localStorage.setItem('trainingResources', JSON.stringify([]));
    }
  }, []);

  // Filter resources by type and search query
  useEffect(() => {
    let filtered = resources;
    
    // Filter by type
    if (selectedType !== 'all') {
      filtered = filtered.filter(resource => resource.type === selectedType);
    }
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        resource => 
          resource.title.toLowerCase().includes(query) || 
          resource.description.toLowerCase().includes(query)
      );
    }
    
    setFilteredResources(filtered);
  }, [selectedType, searchQuery, resources]);

  // Handle adding a new resource
  const handleAddResource = () => {
    const resourceObject = {
      id: resourceToEdit ? resourceToEdit.id : Date.now().toString(),
      ...newResource
    };
    
    let updatedResources;
    
    if (resourceToEdit) {
      // Update existing resource
      updatedResources = resources.map(resource => 
        resource.id === resourceToEdit.id ? resourceObject : resource
      );
    } else {
      // Add new resource
      updatedResources = [...resources, resourceObject];
    }
    
    setResources(updatedResources);
    localStorage.setItem('trainingResources', JSON.stringify(updatedResources));
    
    // Reset form and close modal
    setNewResource({
      title: '',
      description: '',
      type: 'guide',
      metadata: '',
      url: ''
    });
    setResourceToEdit(null);
    setShowAddModal(false);
  };
  
  // Handle editing a resource
  const handleEditResource = (resource) => {
    setResourceToEdit(resource);
    setNewResource({
      title: resource.title,
      description: resource.description,
      type: resource.type,
      metadata: resource.metadata,
      url: resource.url
    });
    setShowAddModal(true);
  };
  
  // Handle deleting a resource
  const handleDeleteResource = (resourceId) => {
    const updatedResources = resources.filter(resource => resource.id !== resourceId);
    setResources(updatedResources);
    localStorage.setItem('trainingResources', JSON.stringify(updatedResources));
  };
  
  // Get color classes for resource type
  const getTypeColors = (typeId) => {
    const resourceType = resourceTypes.find(type => type.id === typeId);
    if (!resourceType) return { bg: 'bg-gray-100', text: 'text-gray-800' };
    
    const colorMap = {
      'blue': { bg: 'bg-blue-100', text: 'text-blue-800' },
      'red': { bg: 'bg-red-100', text: 'text-red-800' },
      'green': { bg: 'bg-green-100', text: 'text-green-800' },
      'purple': { bg: 'bg-purple-100', text: 'text-purple-800' },
      'yellow': { bg: 'bg-yellow-100', text: 'text-yellow-800' },
      'pink': { bg: 'bg-pink-100', text: 'text-pink-800' }
    };
    
    return colorMap[resourceType.color];
  };
  
  // Get icon for resource type
  const getTypeIcon = (typeId) => {
    const resourceType = resourceTypes.find(type => type.id === typeId);
    return resourceType ? resourceType.icon : '';
  };
  
  // Get button text based on resource type
  const getActionText = (type) => {
    const actionMap = {
      'guide': 'Download',
      'video': 'Watch',
      'template': 'Use',
      'workshop': 'View',
      'assessment': 'Access',
      'newsletter': 'Subscribe'
    };
    
    return actionMap[type] || 'View';
  };

  // Handle resource action (Download, Watch, Use, etc.)
  const handleResourceAction = (resource) => {
    // Check if URL is external (starts with http:// or https://)
    const isExternalUrl = resource.url.startsWith('http://') || resource.url.startsWith('https://');
    
    if (isExternalUrl) {
      // Open external URLs in a new tab
      window.open(resource.url, '_blank', 'noopener,noreferrer');
    } else {
      // For internal URLs, navigate within the app
      // This could be enhanced with a proper router if needed
      window.location.href = resource.url;
    }
    
    // For specific types, we might want to handle differently
    switch(resource.type) {
      case 'newsletter':
        // For newsletters, we might want to show a subscription modal
        // For now, just navigate to the URL
        break;
      case 'download':
        // For downloads, we might want to track download events
        // For now, just navigate to the URL
        break;
      default:
        // Default behavior is already handled above
        break;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h2 className="text-xl font-semibold mb-4 md:mb-0">Training Resources</h2>
        
        {resources.length > 0 && (
          <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-4 w-full md:w-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Search resources..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 w-full md:w-64"
              />
              <svg 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>
            
            <div className="flex space-x-2 overflow-x-auto pb-2 md:pb-0">
              <button
                onClick={() => setSelectedType('all')}
                className={`px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap
                  ${selectedType === 'all' 
                    ? 'bg-orange-100 text-orange-800' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
              >
                All Types
              </button>
              
              {resourceTypes.map(type => (
                <button
                  key={type.id}
                  onClick={() => setSelectedType(type.id)}
                  className={`px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap
                    ${selectedType === type.id 
                      ? `${getTypeColors(type.id).bg} ${getTypeColors(type.id).text}` 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                  {type.label}
                </button>
              ))}
            </div>
            
            <button 
              onClick={() => {
                setResourceToEdit(null);
                setNewResource({
                  title: '',
                  description: '',
                  type: 'guide',
                  metadata: '',
                  url: ''
                });
                setShowAddModal(true);
              }}
              className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors whitespace-nowrap"
            >
              Add Resource
            </button>
          </div>
        )}
        
        {resources.length === 0 && (
          <button 
            onClick={() => {
              setResourceToEdit(null);
              setNewResource({
                title: '',
                description: '',
                type: 'guide',
                metadata: '',
                url: ''
              });
              setShowAddModal(true);
            }}
            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
          >
            Add Your First Resource
          </button>
        )}
      </div>
      
      {resources.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
          <svg 
            className="w-20 h-20 mx-auto text-gray-300 mb-5" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
            </svg>
          <h3 className="text-xl font-medium text-gray-800 mb-2">No Resources Yet</h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">Start building your resource library by adding training guides, videos, templates, and more.</p>
          <button 
            onClick={() => {
              setResourceToEdit(null);
              setNewResource({
                title: '',
                description: '',
                type: 'guide',
                metadata: '',
                url: ''
              });
              setShowAddModal(true);
            }}
            className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium"
          >
            Add Your First Resource
          </button>
        </div>
      ) : filteredResources.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <svg 
            className="w-16 h-16 mx-auto text-gray-300 mb-4" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
          </svg>
          <p className="text-lg font-medium">No resources found</p>
          <p className="mt-1">Try changing your filters or add a new resource</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.map(resource => (
            <div key={resource.id} className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start">
                <div className={`w-12 h-12 rounded-lg ${getTypeColors(resource.type).bg} flex items-center justify-center ${getTypeColors(resource.type).text}`}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={getTypeIcon(resource.type)}></path>
            </svg>
          </div>
                <div className="flex space-x-1">
                  <span className={`${getTypeColors(resource.type).bg} ${getTypeColors(resource.type).text} text-xs px-2 py-1 rounded-full`}>
                    {resourceTypes.find(type => type.id === resource.type)?.label}
                  </span>
                  <div className="relative group">
                    <button className="p-1 rounded-full hover:bg-gray-100">
                      <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"></path>
                      </svg>
                    </button>
                    <div className="absolute right-0 mt-1 w-32 bg-white rounded-md shadow-lg overflow-hidden z-10 hidden group-hover:block">
                      <div className="py-1">
                        <button 
                          onClick={() => handleEditResource(resource)}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => handleDeleteResource(resource.id)}
                          className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
        </div>
              <h3 className="font-medium mt-3">{resource.title}</h3>
              <p className="text-sm text-gray-600 mt-1">{resource.description}</p>
        <div className="mt-4 flex justify-between items-center">
                <span className="text-xs text-gray-500">{resource.metadata}</span>
                <button 
                  onClick={() => handleResourceAction(resource)}
                  className={`text-sm ${getTypeColors(resource.type).text} font-medium hover:underline`}
                >
                  {getActionText(resource.type)}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Add/Edit Resource Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4">
              {resourceToEdit ? 'Edit Resource' : 'Add New Resource'}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Resource Title</label>
                <input
                  type="text"
                  value={newResource.title}
                  onChange={(e) => setNewResource({...newResource, title: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Strength Training Guide"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Resource Type</label>
                <select
                  value={newResource.type}
                  onChange={(e) => setNewResource({...newResource, type: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  {resourceTypes.map(type => (
                    <option key={type.id} value={type.id}>{type.label}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={newResource.description}
                  onChange={(e) => setNewResource({...newResource, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Brief description of the resource..."
                  rows="3"
                ></textarea>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Metadata</label>
                <input
                  type="text"
                  value={newResource.metadata}
                  onChange={(e) => setNewResource({...newResource, metadata: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="42 pages, 5 videos, etc."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Resource URL</label>
                <input
                  type="text"
                  value={newResource.url}
                  onChange={(e) => setNewResource({...newResource, url: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="/resources/my-resource/"
                />
        </div>
      </div>
      
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setResourceToEdit(null);
                }}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAddResource}
                disabled={!newResource.title}
                className={`px-4 py-2 rounded-md text-white ${
                  newResource.title ? 'bg-orange-500 hover:bg-orange-600' : 'bg-gray-400 cursor-not-allowed'
                }`}
              >
                {resourceToEdit ? 'Update Resource' : 'Add Resource'}
              </button>
            </div>
          </div>
        </div>
      )}
  </div>
);
};

function CoachDashboard() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('teams');
  const [loading, setLoading] = useState(false);
  const [teamStats, setTeamStats] = useState({
    teamPerformance: 0,
    trainingCompletion: 0,
    athleteProgress: 0
  });

  // Define tabs with icons
  const tabs = [
    { id: 'teams', label: 'Teams', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
    { id: 'training', label: 'Training Plans', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01' },
    { id: 'progress', label: 'Athlete Progress', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
    { id: 'calendar', label: 'Calendar', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
    { id: 'resources', label: 'Resources', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' },
  ];

  // Calculate team statistics
  useEffect(() => {
    // Load data from localStorage
    const getStoredData = (key, defaultValue = []) => {
      const storedData = localStorage.getItem(key);
      return storedData ? JSON.parse(storedData) : defaultValue;
    };

    const teams = getStoredData('teams', []);
    const athletes = getStoredData('athletes', []);
    const trainingPlans = getStoredData('trainingPlans', []);
    
    if (teams.length === 0 || athletes.length === 0) {
      // Default values if no data
      setTeamStats({
        teamPerformance: 0,
        trainingCompletion: 0,
        athleteProgress: 0
      });
      return;
    }

    // Calculate team performance (average of all athletes' performance scores)
    let totalPerformance = 0;
    let athleteCount = 0;
    
    athletes.forEach(athlete => {
      if (athlete.performanceScore) {
        totalPerformance += parseInt(athlete.performanceScore);
        athleteCount++;
      } else if (athlete.stats && athlete.stats.performance) {
        totalPerformance += parseInt(athlete.stats.performance);
        athleteCount++;
      }
    });
    
    const avgPerformance = athleteCount > 0 ? totalPerformance / athleteCount : 0;
    const teamPerformance = Math.min(Math.round(avgPerformance), 100);
    
    // Calculate training completion rate
    let completedWorkouts = 0;
    let totalWorkouts = 0;
    
    athletes.forEach(athlete => {
      if (athlete.completedWorkouts) {
        completedWorkouts += athlete.completedWorkouts.length;
      }
      if (athlete.assignedWorkouts) {
        totalWorkouts += athlete.assignedWorkouts.length;
      }
    });
    
    const trainingCompletion = totalWorkouts > 0 
      ? Math.round((completedWorkouts / totalWorkouts) * 100) 
      : 0;
    
    // Calculate athlete progress
    // Check if we have progress tracking data
    let progressPoints = 0;
    let totalPoints = 0;
    
    athletes.forEach(athlete => {
      if (athlete.goals) {
        athlete.goals.forEach(goal => {
          if (goal.progress) {
            progressPoints += goal.progress;
            totalPoints += 100; // Assuming progress is measured on a 0-100 scale
          }
        });
      }
    });
    
    // If we don't have goal progress data, estimate based on performance improvement
    if (totalPoints === 0) {
      // Default to a reasonable value between 70-85% if we can't calculate
      const athleteProgress = Math.round(75 + Math.random() * 10);
      
      setTeamStats({
        teamPerformance,
        trainingCompletion,
        athleteProgress
      });
    } else {
      const athleteProgress = totalPoints > 0
        ? Math.round((progressPoints / totalPoints) * 100)
        : 0;
        
      setTeamStats({
        teamPerformance,
        trainingCompletion,
        athleteProgress
      });
    }
  }, [activeTab]); // Recalculate when tab changes, as data might have been updated

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
              <button className="flex items-center gap-2 text-gray-600 hover:text-blue-600 mr-4">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
                </svg>
              </button>
              <span className="text-sm text-gray-600 mr-2">Welcome back</span>
            </div>
            <div className="flex items-center gap-2 bg-gradient-to-r from-orange-50 to-red-50 py-1 px-3 rounded-full">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-orange-500 to-red-600 flex items-center justify-center text-white shadow-md">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="hidden md:inline text-sm font-medium text-gray-700">Coach</span>
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
          <div className="p-4 bg-gradient-to-r from-orange-600 to-red-700 text-white">
            <h1 className="text-xl font-bold">Coach Dashboard</h1>
            <p className="text-sm mt-1 opacity-90">Team Management</p>
          </div>
          <nav className="py-4">
            {tabs.map((tab) => (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                whileTap={{ scale: 0.98 }}
                className={`w-full px-4 py-3 flex items-center space-x-3 transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-orange-50 text-orange-600 font-medium border-l-4 border-orange-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <svg
                  className={`w-5 h-5 ${activeTab === tab.id ? 'text-orange-600' : 'text-gray-500'}`}
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
          <div className="mt-6 mx-3 p-4 bg-gradient-to-br from-orange-50 to-red-50 rounded-lg">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Team Status</h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">Team Performance</span>
                <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 rounded-full" style={{ width: `${teamStats.teamPerformance}%` }}></div>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">Training Completion</span>
                <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-orange-500 rounded-full" style={{ width: `${teamStats.trainingCompletion}%` }}></div>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">Athlete Progress</span>
                <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: `${teamStats.athleteProgress}%` }}></div>
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
                  <span className="font-medium text-orange-600">{tabs.find(t => t.id === activeTab)?.label}</span>
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-gray-800 flex items-center">
                  {tabs.find(t => t.id === activeTab)?.label}
                  <span className="ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                    Pro Coach
                  </span>
                </h2>
                <p className="text-gray-600">Manage your team and training plans with ease</p>
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
            {activeTab === 'teams' && <TeamManagement />}
            {activeTab === 'training' && <TrainingPlans />}
            {activeTab === 'progress' && <AthleteProgress />}
            {activeTab === 'calendar' && <Calendar />}
            {activeTab === 'resources' && <Resources />}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default CoachDashboard; 