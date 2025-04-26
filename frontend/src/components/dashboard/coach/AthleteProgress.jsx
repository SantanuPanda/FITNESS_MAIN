import React, { useState, useEffect } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function AthleteProgress() {
  // Sample initial athletes data
  const initialAthletes = [
    {
      id: 1,
      name: 'John Smith',
      team: 'Track Team',
      position: 'Sprinter',
      attendance: 92,
      performanceRating: 88,
      recentActivity: 'Completed interval training',
      stats: {
        speed: [75, 78, 80, 82, 85, 87],
        endurance: [65, 68, 72, 75, 78, 80],
        strength: [70, 72, 74, 76, 78, 80],
        technique: [60, 65, 70, 72, 75, 78],
      },
      notes: 'Focusing on improving technique and start acceleration'
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      team: 'Swimming Elite',
      position: 'Freestyle',
      attendance: 95,
      performanceRating: 91,
      recentActivity: 'Personal best in 100m freestyle',
      stats: {
        speed: [80, 82, 83, 85, 87, 90],
        endurance: [75, 78, 80, 83, 85, 88],
        strength: [65, 68, 70, 73, 75, 78],
        technique: [85, 86, 87, 88, 89, 91],
      },
      notes: 'Working on optimizing turn technique and breathing patterns'
    },
    {
      id: 3,
      name: 'Mike Williams',
      team: 'Basketball Juniors',
      position: 'Point Guard',
      attendance: 88,
      performanceRating: 85,
      recentActivity: 'Shooting drill practice',
      stats: {
        speed: [82, 83, 84, 85, 86, 87],
        endurance: [70, 72, 74, 76, 78, 80],
        strength: [68, 70, 73, 75, 77, 80],
        technique: [75, 77, 79, 81, 83, 85],
      },
      notes: 'Need to focus on defensive positioning and court awareness'
    },
  ];

  const [athletes, setAthletes] = useState([]);
  const [selectedAthlete, setSelectedAthlete] = useState(null);
  const [statFilter, setStatFilter] = useState('speed');
  const [teamFilter, setTeamFilter] = useState('all');
  const [teamOptions, setTeamOptions] = useState(['all']);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [athleteNotes, setAthleteNotes] = useState('');
  const [newAthlete, setNewAthlete] = useState({
    name: '',
    team: '',
    position: '',
    attendance: 85,
    performanceRating: 80,
    recentActivity: 'Started training',
    stats: {
      speed: [70, 70, 70, 70, 70, 70],
      endurance: [70, 70, 70, 70, 70, 70],
      strength: [70, 70, 70, 70, 70, 70],
      technique: [70, 70, 70, 70, 70, 70],
    },
    notes: ''
  });
  const [editStats, setEditStats] = useState({
    speed: 0,
    endurance: 0,
    strength: 0,
    technique: 0
  });
  
  // Load athletes from localStorage on component mount
  useEffect(() => {
    try {
      const savedAthletes = localStorage.getItem('coachAthletes');
      console.log('Loading athletes from localStorage:', savedAthletes);
      
      if (savedAthletes && savedAthletes !== 'undefined') {
        const parsedAthletes = JSON.parse(savedAthletes);
        console.log('Parsed athletes:', parsedAthletes);
        setAthletes(parsedAthletes);
      } else {
        console.log('No athletes found in localStorage, using initial data');
        setAthletes(initialAthletes);
      }
    } catch (error) {
      console.error('Error loading athletes from localStorage:', error);
      setAthletes(initialAthletes);
    }
  }, []);
  
  // Load teams from TeamManagement component
  useEffect(() => {
    try {
      const savedTeams = localStorage.getItem('coachTeams');
      if (savedTeams && savedTeams !== 'undefined') {
        const teamsArray = JSON.parse(savedTeams);
        const teamNames = teamsArray.map(team => team.name);
        setTeamOptions(['all', ...teamNames]);
      }
    } catch (error) {
      console.error('Error loading teams:', error);
    }
  }, []);

  // Save athletes to localStorage whenever they change
  useEffect(() => {
    try {
      console.log('Saving athletes to localStorage:', athletes);
      localStorage.setItem('coachAthletes', JSON.stringify(athletes));
    } catch (error) {
      console.error('Error saving athletes to localStorage:', error);
    }
  }, [athletes]);

  // Set athlete notes when an athlete is selected
  useEffect(() => {
    if (selectedAthlete) {
      setAthleteNotes(selectedAthlete.notes || '');
    }
  }, [selectedAthlete]);

  // Filter athletes based on team
  const filteredAthletes = teamFilter === 'all' 
    ? athletes 
    : athletes.filter(athlete => athlete.team === teamFilter);

  // Handle athlete selection
  const handleSelectAthlete = (athlete) => {
    setSelectedAthlete(athlete);
  };

  // Handle input change for new athlete form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAthlete({
      ...newAthlete,
      [name]: value,
    });
  };

  // Handle input change for notes
  const handleNotesChange = (e) => {
    setAthleteNotes(e.target.value);
  };

  // Handle saving notes
  const handleSaveNotes = () => {
    if (!selectedAthlete) return;
    
    const updatedAthletes = athletes.map(athlete => {
      if (athlete.id === selectedAthlete.id) {
        return {
          ...athlete,
          notes: athleteNotes
        };
      }
      return athlete;
    });
    
    setAthletes(updatedAthletes);
    setSelectedAthlete({
      ...selectedAthlete,
      notes: athleteNotes
    });
    
    // Show save confirmation
    alert('Notes saved successfully!');
  };

  // Handle adding new athlete
  const handleAddAthlete = () => {
    if (!newAthlete.name || !newAthlete.team || !newAthlete.position) {
      alert('Please fill all required fields');
      return;
    }

    const newAthleteObj = {
      ...newAthlete,
      id: Date.now(), // Use timestamp as ID to ensure uniqueness
      attendance: parseInt(newAthlete.attendance) || 85,
      performanceRating: parseInt(newAthlete.performanceRating) || 80,
    };

    const updatedAthletes = [...athletes, newAthleteObj];
    setAthletes(updatedAthletes);
    setShowAddModal(false);
    
    // Reset new athlete form
    setNewAthlete({
      name: '',
      team: '',
      position: '',
      attendance: 85,
      performanceRating: 80,
      recentActivity: 'Started training',
      stats: {
        speed: [70, 70, 70, 70, 70, 70],
        endurance: [70, 70, 70, 70, 70, 70],
        strength: [70, 70, 70, 70, 70, 70],
        technique: [70, 70, 70, 70, 70, 70],
      },
      notes: ''
    });
  };

  // Handle editing athlete
  const handleEditAthlete = () => {
    if (!selectedAthlete) return;
    
    // Pre-fill the edit form with the selected athlete's data
    setNewAthlete({
      name: selectedAthlete.name,
      team: selectedAthlete.team,
      position: selectedAthlete.position,
      attendance: selectedAthlete.attendance,
      performanceRating: selectedAthlete.performanceRating,
      recentActivity: selectedAthlete.recentActivity,
      stats: selectedAthlete.stats,
      notes: selectedAthlete.notes || ''
    });
    
    setShowEditModal(true);
  };

  // Handle updating athlete
  const handleUpdateAthlete = () => {
    if (!selectedAthlete || !newAthlete.name || !newAthlete.team || !newAthlete.position) {
      alert('Please fill all required fields');
      return;
    }

    const updatedAthletes = athletes.map(athlete => {
      if (athlete.id === selectedAthlete.id) {
        return {
          ...athlete,
          name: newAthlete.name,
          team: newAthlete.team,
          position: newAthlete.position,
          attendance: parseInt(newAthlete.attendance) || athlete.attendance,
          performanceRating: parseInt(newAthlete.performanceRating) || athlete.performanceRating,
          recentActivity: newAthlete.recentActivity,
          notes: newAthlete.notes
        };
      }
      return athlete;
    });
    
    setAthletes(updatedAthletes);
    
    // Update selected athlete
    const updatedAthlete = updatedAthletes.find(a => a.id === selectedAthlete.id);
    setSelectedAthlete(updatedAthlete);
    
    setShowEditModal(false);
  };

  // Handle deleting athlete
  const handleDeleteAthlete = () => {
    if (!selectedAthlete) return;
    
    if (window.confirm(`Are you sure you want to delete ${selectedAthlete.name}?`)) {
      const updatedAthletes = athletes.filter(athlete => athlete.id !== selectedAthlete.id);
      setAthletes(updatedAthletes);
      setSelectedAthlete(null);
    }
  };

  // Handle opening stats modal
  const handleOpenStatsModal = () => {
    if (!selectedAthlete) return;
    
    setEditStats({
      speed: selectedAthlete.stats.speed[selectedAthlete.stats.speed.length - 1],
      endurance: selectedAthlete.stats.endurance[selectedAthlete.stats.endurance.length - 1],
      strength: selectedAthlete.stats.strength[selectedAthlete.stats.strength.length - 1],
      technique: selectedAthlete.stats.technique[selectedAthlete.stats.technique.length - 1]
    });
    
    setShowStatsModal(true);
  };

  // Handle stats input change
  const handleStatsChange = (e) => {
    const { name, value } = e.target;
    setEditStats({
      ...editStats,
      [name]: parseInt(value) || 0
    });
  };

  // Handle updating stats
  const handleUpdateStats = () => {
    if (!selectedAthlete) return;
    
    // Validate input values (must be between 50-100)
    for (const stat in editStats) {
      if (editStats[stat] < 50 || editStats[stat] > 100) {
        alert('All stats must be between 50 and 100');
        return;
      }
    }
    
    const updatedAthletes = athletes.map(athlete => {
      if (athlete.id === selectedAthlete.id) {
        // Create updated stats by shifting array and adding new value
        const updatedStats = {
          speed: [...athlete.stats.speed.slice(1), editStats.speed],
          endurance: [...athlete.stats.endurance.slice(1), editStats.endurance],
          strength: [...athlete.stats.strength.slice(1), editStats.strength],
          technique: [...athlete.stats.technique.slice(1), editStats.technique],
        };
        
        return {
          ...athlete,
          stats: updatedStats,
          recentActivity: 'Stats updated on ' + new Date().toLocaleDateString()
        };
      }
      return athlete;
    });
    
    setAthletes(updatedAthletes);
    
    // Update selected athlete
    const updatedAthlete = updatedAthletes.find(a => a.id === selectedAthlete.id);
    setSelectedAthlete(updatedAthlete);
    
    setShowStatsModal(false);
  };

  // Generate chart data for selected athlete
  const getChartData = () => {
    if (!selectedAthlete) return null;

    const labels = ['6 Weeks Ago', '5 Weeks Ago', '4 Weeks Ago', '3 Weeks Ago', '2 Weeks Ago', 'Last Week'];
    
    return {
      labels,
      datasets: [
        {
          label: statFilter.charAt(0).toUpperCase() + statFilter.slice(1),
          data: selectedAthlete.stats[statFilter],
          borderColor: 'rgb(59, 130, 246)',
          backgroundColor: 'rgba(59, 130, 246, 0.5)',
          tension: 0.3,
        },
      ],
    };
  };

  // Chart options
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Progress Over Time',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `${context.dataset.label}: ${context.parsed.y}%`;
          }
        }
      }
    },
    scales: {
      y: {
        min: 50,
        max: 100,
        ticks: {
          callback: function(value) {
            return value + '%';
          }
        }
      }
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Athlete List */}
      <div className="lg:w-2/5">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Athletes</h2>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 text-sm rounded-md flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Add Athlete
            </button>
            <select
              id="teamFilter"
              value={teamFilter}
              onChange={(e) => setTeamFilter(e.target.value)}
              className="border border-gray-300 rounded py-1 px-2 text-sm"
            >
              {teamOptions.map((team) => (
                <option key={team} value={team}>
                  {team === 'all' ? 'All Teams' : team}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <ul className="divide-y divide-gray-200">
            {filteredAthletes.map((athlete) => (
              <li 
                key={athlete.id}
                className={`px-6 py-4 cursor-pointer hover:bg-gray-50 ${
                  selectedAthlete?.id === athlete.id ? 'bg-blue-50' : ''
                }`}
                onClick={() => handleSelectAthlete(athlete)}
              >
                <div className="flex justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">{athlete.name}</h3>
                    <p className="text-sm text-gray-500">{athlete.team} • {athlete.position}</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center">
                      <span className="text-xs font-medium text-gray-500 mr-2">Attendance:</span>
                      <span className={`text-xs font-semibold ${
                        athlete.attendance >= 90 ? 'text-green-600' : 
                        athlete.attendance >= 80 ? 'text-yellow-600' : 'text-red-600'
                      }`}>{athlete.attendance}%</span>
                    </div>
                    <div className="flex items-center mt-1">
                      <span className="text-xs font-medium text-gray-500 mr-2">Performance:</span>
                      <span className={`text-xs font-semibold ${
                        athlete.performanceRating >= 90 ? 'text-green-600' : 
                        athlete.performanceRating >= 80 ? 'text-yellow-600' : 'text-red-600'
                      }`}>{athlete.performanceRating}%</span>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">{athlete.recentActivity}</p>
              </li>
            ))}

            {filteredAthletes.length === 0 && (
              <li className="px-6 py-4 text-center text-sm text-gray-500">
                No athletes found for the selected filter.
              </li>
            )}
          </ul>
        </div>
      </div>

      {/* Athlete Details and Progress */}
      <div className="lg:w-3/5">
        {selectedAthlete ? (
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">{selectedAthlete.name}</h3>
              <div className="flex items-center gap-2">
                <div className="text-sm text-gray-600">
                  {selectedAthlete.team} • {selectedAthlete.position}
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={handleOpenStatsModal}
                    className="text-sm text-blue-600 hover:text-blue-800"
                    title="Update Stats"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                    </svg>
                  </button>
                  <button 
                    onClick={handleEditAthlete}
                    className="text-sm text-blue-600 hover:text-blue-800"
                    title="Edit Athlete"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                  </button>
                  <button 
                    onClick={handleDeleteAthlete}
                    className="text-sm text-red-600 hover:text-red-800"
                    title="Delete Athlete"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500 mb-1">Attendance</p>
                <div className="flex items-center">
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                    <div className={`h-2.5 rounded-full ${
                      selectedAthlete.attendance >= 90 ? 'bg-green-600' : 
                      selectedAthlete.attendance >= 80 ? 'bg-yellow-500' : 'bg-red-600'
                    }`} style={{ width: `${selectedAthlete.attendance}%` }}></div>
                  </div>
                  <span className="text-sm font-semibold">{selectedAthlete.attendance}%</span>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500 mb-1">Performance Rating</p>
                <div className="flex items-center">
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                    <div className={`h-2.5 rounded-full ${
                      selectedAthlete.performanceRating >= 90 ? 'bg-green-600' : 
                      selectedAthlete.performanceRating >= 80 ? 'bg-yellow-500' : 'bg-red-600'
                    }`} style={{ width: `${selectedAthlete.performanceRating}%` }}></div>
                  </div>
                  <span className="text-sm font-semibold">{selectedAthlete.performanceRating}%</span>
                </div>
              </div>
            </div>
            
            <div className="mb-6">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-bold">Progress Tracking</h4>
                <div>
                  <select
                    value={statFilter}
                    onChange={(e) => setStatFilter(e.target.value)}
                    className="border border-gray-300 rounded py-1 px-2 text-sm"
                  >
                    <option value="speed">Speed</option>
                    <option value="endurance">Endurance</option>
                    <option value="strength">Strength</option>
                    <option value="technique">Technique</option>
                  </select>
                </div>
              </div>
              
              <div className="h-64">
                {getChartData() && <Line options={chartOptions} data={getChartData()} />}
              </div>
            </div>
            
            <div className="mt-6 border-t pt-4">
              <h4 className="font-bold mb-2">Notes & Recommendations</h4>
              <textarea
                className="w-full border border-gray-300 rounded-md p-2 text-sm"
                rows="3"
                placeholder="Add notes or recommendations for this athlete..."
                value={athleteNotes}
                onChange={handleNotesChange}
              ></textarea>
              <div className="flex justify-end mt-2">
                <button 
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-sm rounded-md"
                  onClick={handleSaveNotes}
                >
                  Save Notes
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500 h-full flex flex-col items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <p>Select an athlete to view progress details</p>
          </div>
        )}
      </div>

      {/* Add Athlete Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Add New Athlete</h3>
            
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                Athlete Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={newAthlete.name}
                onChange={handleInputChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Enter athlete name"
                required
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="team">
                Team *
              </label>
              <select
                id="team"
                name="team"
                value={newAthlete.team}
                onChange={handleInputChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              >
                <option value="">Select a team</option>
                {teamOptions.filter(team => team !== 'all').map((team) => (
                  <option key={team} value={team}>{team}</option>
                ))}
              </select>
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="position">
                Position *
              </label>
              <input
                type="text"
                id="position"
                name="position"
                value={newAthlete.position}
                onChange={handleInputChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Enter position"
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="attendance">
                  Attendance (%)
                </label>
                <input
                  type="number"
                  id="attendance"
                  name="attendance"
                  value={newAthlete.attendance}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  min="0"
                  max="100"
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="performanceRating">
                  Performance (%)
                </label>
                <input
                  type="number"
                  id="performanceRating"
                  name="performanceRating"
                  value={newAthlete.performanceRating}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  min="0"
                  max="100"
                />
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="recentActivity">
                Recent Activity
              </label>
              <input
                type="text"
                id="recentActivity"
                name="recentActivity"
                value={newAthlete.recentActivity}
                onChange={handleInputChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Enter recent activity"
              />
            </div>
            
            <div className="flex justify-end mt-6">
              <button
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded mr-2"
                onClick={() => setShowAddModal(false)}
              >
                Cancel
              </button>
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={handleAddAthlete}
              >
                Add Athlete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Athlete Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Edit Athlete</h3>
            
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                Athlete Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={newAthlete.name}
                onChange={handleInputChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Enter athlete name"
                required
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="team">
                Team *
              </label>
              <select
                id="team"
                name="team"
                value={newAthlete.team}
                onChange={handleInputChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              >
                <option value="">Select a team</option>
                {teamOptions.filter(team => team !== 'all').map((team) => (
                  <option key={team} value={team}>{team}</option>
                ))}
              </select>
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="position">
                Position *
              </label>
              <input
                type="text"
                id="position"
                name="position"
                value={newAthlete.position}
                onChange={handleInputChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Enter position"
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="attendance">
                  Attendance (%)
                </label>
                <input
                  type="number"
                  id="attendance"
                  name="attendance"
                  value={newAthlete.attendance}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  min="0"
                  max="100"
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="performanceRating">
                  Performance (%)
                </label>
                <input
                  type="number"
                  id="performanceRating"
                  name="performanceRating"
                  value={newAthlete.performanceRating}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  min="0"
                  max="100"
                />
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="recentActivity">
                Recent Activity
              </label>
              <input
                type="text"
                id="recentActivity"
                name="recentActivity"
                value={newAthlete.recentActivity}
                onChange={handleInputChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Enter recent activity"
              />
            </div>
            
            <div className="flex justify-end mt-6">
              <button
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded mr-2"
                onClick={() => setShowEditModal(false)}
              >
                Cancel
              </button>
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={handleUpdateAthlete}
              >
                Update Athlete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Update Stats Modal */}
      {showStatsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Update Latest Stats</h3>
            <p className="text-sm text-gray-600 mb-4">Enter the latest statistics for {selectedAthlete?.name}</p>
            
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="speed">
                Speed (50-100)
              </label>
              <input
                type="number"
                id="speed"
                name="speed"
                value={editStats.speed}
                onChange={handleStatsChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                min="50"
                max="100"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="endurance">
                Endurance (50-100)
              </label>
              <input
                type="number"
                id="endurance"
                name="endurance"
                value={editStats.endurance}
                onChange={handleStatsChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                min="50"
                max="100"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="strength">
                Strength (50-100)
              </label>
              <input
                type="number"
                id="strength"
                name="strength"
                value={editStats.strength}
                onChange={handleStatsChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                min="50"
                max="100"
              />
            </div>
            
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="technique">
                Technique (50-100)
              </label>
              <input
                type="number"
                id="technique"
                name="technique"
                value={editStats.technique}
                onChange={handleStatsChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                min="50"
                max="100"
              />
            </div>
            
            <div className="flex justify-end">
              <button
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded mr-2"
                onClick={() => setShowStatsModal(false)}
              >
                Cancel
              </button>
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={handleUpdateStats}
              >
                Update Stats
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AthleteProgress; 