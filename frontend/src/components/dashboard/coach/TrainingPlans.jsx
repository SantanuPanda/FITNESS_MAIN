import React, { useState, useEffect } from 'react';

function TrainingPlans() {
  const [plans, setPlans] = useState([]);
  const [teamOptions, setTeamOptions] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showWorkoutModal, setShowWorkoutModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [newPlan, setNewPlan] = useState({
    name: '',
    targetTeam: '',
    duration: '',
    startDate: '',
    endDate: '',
    description: '',
    workouts: []
  });
  const [newWorkout, setNewWorkout] = useState({
    day: '',
    name: '',
    description: '',
    duration: ''
  });

  // Load plans from localStorage on component mount
  useEffect(() => {
    const savedPlans = localStorage.getItem('trainingPlans');
    if (savedPlans) {
      setPlans(JSON.parse(savedPlans));
    }
  }, []);

  // Load team options from localStorage (teams created in TeamManagement)
  useEffect(() => {
    const loadTeamOptions = () => {
      try {
        const savedTeams = localStorage.getItem('coachTeams');
        console.log('TrainingPlans - Loading teams from localStorage:', savedTeams);
        
        if (savedTeams && savedTeams !== 'undefined') {
          const teamsArray = JSON.parse(savedTeams);
          console.log('TrainingPlans - Parsed teams:', teamsArray);
          // Extract team names for dropdown options
          const teamNames = teamsArray.map(team => team.name);
          console.log('Team names for dropdown:', teamNames);
          setTeamOptions(teamNames);
        } else {
          console.log('TrainingPlans - No teams found in localStorage or invalid data');
          setTeamOptions([]);
        }
      } catch (error) {
        console.error('TrainingPlans - Error loading teams from localStorage:', error);
        setTeamOptions([]);
      }
    };

    // Load team options when component mounts
    loadTeamOptions();

    // Also set up an event listener to reload team options when localStorage changes
    // This ensures the dropdown updates if teams are added in another tab
    window.addEventListener('storage', loadTeamOptions);

    return () => {
      window.removeEventListener('storage', loadTeamOptions);
    };
  }, []);

  // Save plans to localStorage whenever plans state changes
  useEffect(() => {
    localStorage.setItem('trainingPlans', JSON.stringify(plans));
  }, [plans]);

  // Check for teams before showing add modal
  const handleCreatePlanClick = () => {
    if (teamOptions.length === 0) {
      alert('Please add teams in the "Manage Teams" section before creating a training plan.');
      return;
    }
    setShowAddModal(true);
  };

  const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPlan({
      ...newPlan,
      [name]: value,
    });
  };

  const handleWorkoutInputChange = (e) => {
    const { name, value } = e.target;
    setNewWorkout({
      ...newWorkout,
      [name]: value,
    });
  };

  const handleAddPlan = () => {
    if (!newPlan.name || !newPlan.targetTeam || !newPlan.startDate || !newPlan.endDate) {
      alert('Please fill all required fields');
      return;
    }

    // Calculate duration in weeks
    const start = new Date(newPlan.startDate);
    const end = new Date(newPlan.endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const durationWeeks = Math.ceil(diffDays / 7);

    const newPlanObj = {
      id: Date.now(), // Use timestamp as ID to ensure uniqueness
      name: newPlan.name,
      targetTeam: newPlan.targetTeam,
      duration: `${durationWeeks} weeks`,
      startDate: newPlan.startDate,
      endDate: newPlan.endDate,
      status: 'active',
      description: newPlan.description || 'No description provided.',
      workouts: []
    };

    setPlans([...plans, newPlanObj]);
    setNewPlan({
      name: '',
      targetTeam: '',
      duration: '',
      startDate: '',
      endDate: '',
      description: '',
      workouts: []
    });
    setShowAddModal(false);
  };

  const handleEditPlan = () => {
    if (!newPlan.name || !newPlan.targetTeam || !newPlan.startDate || !newPlan.endDate) {
      alert('Please fill all required fields');
      return;
    }

    // Calculate duration in weeks
    const start = new Date(newPlan.startDate);
    const end = new Date(newPlan.endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const durationWeeks = Math.ceil(diffDays / 7);

    const updatedPlans = plans.map(plan => {
      if (plan.id === selectedPlan.id) {
        return {
          ...plan,
          name: newPlan.name,
          targetTeam: newPlan.targetTeam,
          duration: `${durationWeeks} weeks`,
          startDate: newPlan.startDate,
          endDate: newPlan.endDate,
          description: newPlan.description || plan.description
        };
      }
      return plan;
    });

    setPlans(updatedPlans);
    setSelectedPlan({
      ...selectedPlan,
      name: newPlan.name,
      targetTeam: newPlan.targetTeam,
      duration: `${durationWeeks} weeks`,
      startDate: newPlan.startDate,
      endDate: newPlan.endDate,
      description: newPlan.description || selectedPlan.description
    });
    setShowEditModal(false);
  };

  const handleAddWorkout = () => {
    if (!newWorkout.day || !newWorkout.name || !newWorkout.duration) {
      alert('Please fill all required fields');
      return;
    }

    const workoutToAdd = {
      id: selectedPlan.workouts.length + 1,
      day: newWorkout.day,
      name: newWorkout.name,
      description: newWorkout.description || 'No description provided.',
      duration: newWorkout.duration
    };

    const updatedPlans = plans.map(plan => {
      if (plan.id === selectedPlan.id) {
        return {
          ...plan,
          workouts: [...plan.workouts, workoutToAdd]
        };
      }
      return plan;
    });

    setPlans(updatedPlans);
    setSelectedPlan({
      ...selectedPlan,
      workouts: [...selectedPlan.workouts, workoutToAdd]
    });
    
    setNewWorkout({
      day: '',
      name: '',
      description: '',
      duration: ''
    });
    
    setShowWorkoutModal(false);
  };

  const handleViewPlan = (plan) => {
    setSelectedPlan(plan);
    setEditMode(false);
  };

  const handleDeletePlan = (id) => {
    if (confirm('Are you sure you want to delete this training plan?')) {
      setPlans(plans.filter(plan => plan.id !== id));
      if (selectedPlan && selectedPlan.id === id) {
        setSelectedPlan(null);
      }
    }
  };

  const handleTogglePlanStatus = (id) => {
    const updatedPlans = plans.map(plan => {
      if (plan.id === id) {
        const newStatus = plan.status === 'active' ? 'completed' : 'active';
        return {
          ...plan,
          status: newStatus
        };
      }
      return plan;
    });

    setPlans(updatedPlans);
    
    if (selectedPlan && selectedPlan.id === id) {
      setSelectedPlan({
        ...selectedPlan,
        status: selectedPlan.status === 'active' ? 'completed' : 'active'
      });
    }
  };

  const handleDeleteWorkout = (workoutId) => {
    if (confirm('Are you sure you want to delete this workout?')) {
      const updatedPlans = plans.map(plan => {
        if (plan.id === selectedPlan.id) {
          return {
            ...plan,
            workouts: plan.workouts.filter(workout => workout.id !== workoutId)
          };
        }
        return plan;
      });

      setPlans(updatedPlans);
      setSelectedPlan({
        ...selectedPlan,
        workouts: selectedPlan.workouts.filter(workout => workout.id !== workoutId)
      });
    }
  };

  const openEditModal = (plan) => {
    setNewPlan({
      name: plan.name,
      targetTeam: plan.targetTeam,
      startDate: plan.startDate,
      endDate: plan.endDate,
      description: plan.description || ''
    });
    setShowEditModal(true);
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold text-gray-800">Training Plans</h2>
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center w-full sm:w-auto justify-center"
          onClick={handleCreatePlanClick}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Create Plan
        </button>
      </div>

      {/* Training Plans List - Desktop View */}
      <div className="bg-white rounded-lg shadow overflow-hidden hidden md:block">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Team</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {plans.map((plan) => (
              <tr key={plan.id} className={plan.status === 'completed' ? 'bg-gray-50' : ''}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{plan.name}</div>
                  <div className="text-xs text-gray-500">{plan.startDate} to {plan.endDate}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{plan.targetTeam}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{plan.duration}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    plan.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {plan.status === 'active' ? 'Active' : 'Completed'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button className="text-blue-600 hover:text-blue-900 mr-3" onClick={() => handleViewPlan(plan)}>View</button>
                  <button className="text-indigo-600 hover:text-indigo-900 mr-3" onClick={() => openEditModal(plan)}>Edit</button>
                  <button className="text-yellow-600 hover:text-yellow-900 mr-3" onClick={() => handleTogglePlanStatus(plan.id)}>
                    {plan.status === 'active' ? 'Complete' : 'Activate'}
                  </button>
                  <button className="text-red-600 hover:text-red-900" onClick={() => handleDeletePlan(plan.id)}>Delete</button>
                </td>
              </tr>
            ))}

            {plans.length === 0 && (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                  No training plans found. Click "Create Plan" to get started!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Training Plans List - Mobile & Tablet View */}
      <div className="bg-white rounded-lg shadow md:hidden">
        {plans.length === 0 ? (
          <div className="px-4 py-6 text-center text-sm text-gray-500">
            No training plans found. Click "Create Plan" to get started!
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {plans.map((plan) => (
              <div key={plan.id} className={`p-4 ${plan.status === 'completed' ? 'bg-gray-50' : ''}`}>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">{plan.name}</h3>
                    <p className="text-xs text-gray-500 mt-1">{plan.targetTeam} • {plan.duration}</p>
                    <p className="text-xs text-gray-500">{plan.startDate} to {plan.endDate}</p>
                  </div>
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    plan.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {plan.status === 'active' ? 'Active' : 'Completed'}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2 mt-3">
                  <button 
                    className="text-blue-600 bg-blue-50 hover:bg-blue-100 text-xs px-2 py-1 rounded"
                    onClick={() => handleViewPlan(plan)}
                  >
                    View
                  </button>
                  <button 
                    className="text-indigo-600 bg-indigo-50 hover:bg-indigo-100 text-xs px-2 py-1 rounded"
                    onClick={() => openEditModal(plan)}
                  >
                    Edit
                  </button>
                  <button 
                    className="text-yellow-600 bg-yellow-50 hover:bg-yellow-100 text-xs px-2 py-1 rounded"
                    onClick={() => handleTogglePlanStatus(plan.id)}
                  >
                    {plan.status === 'active' ? 'Complete' : 'Activate'}
                  </button>
                  <button 
                    className="text-red-600 bg-red-50 hover:bg-red-100 text-xs px-2 py-1 rounded"
                    onClick={() => handleDeletePlan(plan.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Plan Details Section (only shown when a plan is selected) */}
      {selectedPlan && (
        <div className="mt-6 bg-white rounded-lg shadow p-4 md:p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
            <div>
              <h3 className="text-lg font-bold text-gray-800">{selectedPlan.name}</h3>
              <p className="text-sm text-gray-500">
                {selectedPlan.targetTeam} • {selectedPlan.duration} • {selectedPlan.startDate} to {selectedPlan.endDate}
              </p>
            </div>
            <div className="flex mt-3 sm:mt-0">
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md text-sm mr-2"
                onClick={() => setShowWorkoutModal(true)}
              >
                Add Workout
              </button>
              <button
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-3 py-1 rounded-md text-sm"
                onClick={() => setSelectedPlan(null)}
              >
                Close
              </button>
            </div>
          </div>
          
          <div className="mb-4 p-4 bg-gray-50 rounded-md">
            <h4 className="font-medium text-gray-700 mb-2">Description</h4>
            <p className="text-sm text-gray-600">{selectedPlan.description}</p>
          </div>
          
          <h4 className="font-medium text-gray-700 mb-2">Workouts</h4>
          
          {selectedPlan.workouts && selectedPlan.workouts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {selectedPlan.workouts.map((workout) => (
                <div key={workout.id} className="border border-gray-200 rounded-md p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex justify-between items-start mb-1">
                    <h5 className="font-medium text-gray-800">{workout.name}</h5>
                    <button
                      className="text-red-500 hover:text-red-700 text-xs"
                      onClick={() => handleDeleteWorkout(workout.id)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                  <p className="text-sm text-blue-600 mb-1">{workout.day}</p>
                  <p className="text-xs text-gray-500 mb-1">{workout.duration}</p>
                  <p className="text-xs text-gray-600">{workout.description}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 italic">No workouts added yet.</p>
          )}
        </div>
      )}

      {/* Add Plan Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-5 sm:p-8 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Create New Training Plan</h3>
            
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                Plan Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={newPlan.name}
                onChange={handleInputChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Enter plan name"
                required
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="targetTeam">
                Target Team *
              </label>
              <select
                id="targetTeam"
                name="targetTeam"
                value={newPlan.targetTeam}
                onChange={handleInputChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              >
                <option value="">Select a team</option>
                {teamOptions.map((team, index) => (
                  <option key={index} value={team}>{team}</option>
                ))}
              </select>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="startDate">
                  Start Date *
                </label>
                <input
                  type="date"
                  id="startDate"
                  name="startDate"
                  value={newPlan.startDate}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="endDate">
                  End Date *
                </label>
                <input
                  type="date"
                  id="endDate"
                  name="endDate"
                  value={newPlan.endDate}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
            </div>
            
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={newPlan.description}
                onChange={handleInputChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Enter plan description"
                rows="3"
              ></textarea>
            </div>
            
            <div className="flex flex-col sm:flex-row sm:justify-end gap-2">
              <button
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded order-2 sm:order-1 sm:mr-2"
                onClick={() => setShowAddModal(false)}
              >
                Cancel
              </button>
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded order-1 sm:order-2 mb-2 sm:mb-0"
                onClick={handleAddPlan}
              >
                Create Plan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Plan Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-5 sm:p-8 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Edit Training Plan</h3>
            
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="edit-name">
                Plan Name *
              </label>
              <input
                type="text"
                id="edit-name"
                name="name"
                value={newPlan.name}
                onChange={handleInputChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Enter plan name"
                required
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="edit-targetTeam">
                Target Team *
              </label>
              <select
                id="edit-targetTeam"
                name="targetTeam"
                value={newPlan.targetTeam}
                onChange={handleInputChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              >
                <option value="">Select a team</option>
                {teamOptions.map((team, index) => (
                  <option key={index} value={team}>{team}</option>
                ))}
              </select>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="edit-startDate">
                  Start Date *
                </label>
                <input
                  type="date"
                  id="edit-startDate"
                  name="startDate"
                  value={newPlan.startDate}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="edit-endDate">
                  End Date *
                </label>
                <input
                  type="date"
                  id="edit-endDate"
                  name="endDate"
                  value={newPlan.endDate}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
            </div>
            
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="edit-description">
                Description
              </label>
              <textarea
                id="edit-description"
                name="description"
                value={newPlan.description}
                onChange={handleInputChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Enter plan description"
                rows="3"
              ></textarea>
            </div>
            
            <div className="flex flex-col sm:flex-row sm:justify-end gap-2">
              <button
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded order-2 sm:order-1 sm:mr-2"
                onClick={() => setShowEditModal(false)}
              >
                Cancel
              </button>
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded order-1 sm:order-2 mb-2 sm:mb-0"
                onClick={handleEditPlan}
              >
                Update Plan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Workout Modal */}
      {showWorkoutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-5 sm:p-8 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Add Workout</h3>
            
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="workout-day">
                Day *
              </label>
              <select
                id="workout-day"
                name="day"
                value={newWorkout.day}
                onChange={handleWorkoutInputChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              >
                <option value="">Select a day</option>
                {weekdays.map((day, index) => (
                  <option key={index} value={day}>{day}</option>
                ))}
              </select>
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="workout-name">
                Workout Name *
              </label>
              <input
                type="text"
                id="workout-name"
                name="name"
                value={newWorkout.name}
                onChange={handleWorkoutInputChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Enter workout name"
                required
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="workout-duration">
                Duration *
              </label>
              <input
                type="text"
                id="workout-duration"
                name="duration"
                value={newWorkout.duration}
                onChange={handleWorkoutInputChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="e.g. 45 minutes"
                required
              />
            </div>
            
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="workout-description">
                Description
              </label>
              <textarea
                id="workout-description"
                name="description"
                value={newWorkout.description}
                onChange={handleWorkoutInputChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Enter workout description"
                rows="3"
              ></textarea>
            </div>
            
            <div className="flex flex-col sm:flex-row sm:justify-end gap-2">
              <button
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded order-2 sm:order-1 sm:mr-2"
                onClick={() => setShowWorkoutModal(false)}
              >
                Cancel
              </button>
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded order-1 sm:order-2 mb-2 sm:mb-0"
                onClick={handleAddWorkout}
              >
                Add Workout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TrainingPlans; 