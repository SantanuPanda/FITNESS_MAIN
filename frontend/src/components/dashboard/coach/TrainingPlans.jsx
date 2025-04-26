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
    <div className="flex flex-col lg:flex-row gap-6 w-full">
      {/* Training Plans List */}
      <div className="lg:w-2/3 w-full">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Training Plans</h2>
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center"
            onClick={handleCreatePlanClick}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Create Plan
          </button>
        </div>

        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plan Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Team</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {plans.length > 0 ? (
                plans.map((plan) => (
                  <tr 
                    key={plan.id} 
                    className={`${selectedPlan?.id === plan.id ? 'bg-blue-50' : ''} hover:bg-gray-50 cursor-pointer`}
                  >
                    <td 
                      className="px-6 py-4 whitespace-nowrap"
                      onClick={() => handleViewPlan(plan)}
                    >
                      <div className="text-sm font-medium text-gray-900">{plan.name}</div>
                    </td>
                    <td 
                      className="px-6 py-4 whitespace-nowrap"
                      onClick={() => handleViewPlan(plan)}
                    >
                      <div className="text-sm text-gray-500">{plan.targetTeam}</div>
                    </td>
                    <td 
                      className="px-6 py-4 whitespace-nowrap"
                      onClick={() => handleViewPlan(plan)}
                    >
                      <div className="text-sm text-gray-500">{plan.duration}</div>
                    </td>
                    <td 
                      className="px-6 py-4 whitespace-nowrap"
                      onClick={() => handleViewPlan(plan)}
                    >
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        plan.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {plan.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button 
                        className="text-blue-600 hover:text-blue-900 mr-3"
                        onClick={() => handleViewPlan(plan)}
                      >
                        View
                      </button>
                      <button 
                        className="text-yellow-600 hover:text-yellow-900 mr-3"
                        onClick={() => handleTogglePlanStatus(plan.id)}
                      >
                        {plan.status === 'active' ? 'Complete' : 'Reactivate'}
                      </button>
                      <button 
                        className="text-red-600 hover:text-red-900"
                        onClick={() => handleDeletePlan(plan.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center">
                    <div className="text-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                      <p className="text-gray-500 text-sm mb-2">No training plans found.</p>
                      <p className="text-gray-600 text-sm">Create your first plan to get started!</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Plan Details */}
      <div className="lg:w-1/3 w-full mt-6 lg:mt-0">
        {selectedPlan ? (
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-start">
              <h3 className="text-xl font-bold mb-4">{selectedPlan.name}</h3>
              <button 
                className="text-blue-600 hover:text-blue-800"
                onClick={() => openEditModal(selectedPlan)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
              </button>
            </div>
            
            <div className="mt-2 text-sm text-gray-600 border-b pb-4">
              {selectedPlan.description}
            </div>
            
            <div className="mt-4">
              <p className="text-sm text-gray-500 mb-1">Team</p>
              <p className="font-medium">{selectedPlan.targetTeam}</p>
            </div>
            
            <div className="mt-4">
              <p className="text-sm text-gray-500 mb-1">Duration</p>
              <p className="font-medium">{selectedPlan.duration}</p>
            </div>
            
            <div className="mt-4">
              <p className="text-sm text-gray-500 mb-1">Period</p>
              <p className="font-medium">{selectedPlan.startDate} to {selectedPlan.endDate}</p>
            </div>
            
            <div className="mt-4">
              <p className="text-sm text-gray-500 mb-1">Status</p>
              <p className={`font-medium capitalize ${
                selectedPlan.status === 'active' ? 'text-green-600' : 'text-gray-600'
              }`}>
                {selectedPlan.status}
              </p>
            </div>
            
            <div className="mt-6 pt-4 border-t">
              <div className="flex justify-between items-center">
                <h4 className="font-bold">Workout Schedule</h4>
                <button 
                  className="text-sm bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded-md"
                  onClick={() => setShowWorkoutModal(true)}
                >
                  Add Workout
                </button>
              </div>
              
              {selectedPlan.workouts && selectedPlan.workouts.length > 0 ? (
                <div className="mt-3 space-y-3 max-h-[350px] overflow-y-auto pr-2">
                  {selectedPlan.workouts.map((workout) => (
                    <div key={workout.id} className="bg-gray-50 p-3 rounded-lg">
                      <div className="flex justify-between">
                        <div className="font-medium">{workout.day}: {workout.name}</div>
                        <button 
                          className="text-red-500 hover:text-red-700"
                          onClick={() => handleDeleteWorkout(workout.id)}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">{workout.description}</p>
                      <p className="text-xs text-gray-400 mt-1">Duration: {workout.duration}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm mt-3">
                  No workouts added yet. Add workouts to create a schedule.
                </p>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p>Select a training plan to view details</p>
          </div>
        )}
      </div>

      {/* Add Plan Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full max-h-[90vh] overflow-y-auto">
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
              {teamOptions.length > 0 ? (
                <select
                  id="targetTeam"
                  name="targetTeam"
                  value={newPlan.targetTeam}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                >
                  <option value="">Select a team</option>
                  {teamOptions.map((team) => (
                    <option key={team} value={team}>{team}</option>
                  ))}
                </select>
              ) : (
                <div className="text-orange-500 text-sm p-2 bg-orange-50 rounded">
                  No teams available. Please add teams in the "Manage Teams" section first.
                </div>
              )}
            </div>
            
            <div className="mb-4">
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
              />
            </div>
            
            <div className="mb-4">
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
            
            <div className="mb-6">
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
            
            <div className="flex justify-end">
              <button
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded mr-2"
                onClick={() => setShowAddModal(false)}
              >
                Cancel
              </button>
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">Edit Training Plan</h3>
            
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
              {teamOptions.length > 0 ? (
                <select
                  id="targetTeam"
                  name="targetTeam"
                  value={newPlan.targetTeam}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                >
                  <option value="">Select a team</option>
                  {teamOptions.map((team) => (
                    <option key={team} value={team}>{team}</option>
                  ))}
                </select>
              ) : (
                <div className="text-orange-500 text-sm p-2 bg-orange-50 rounded">
                  No teams available. Please add teams in the "Manage Teams" section first.
                </div>
              )}
            </div>
            
            <div className="mb-4">
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
              />
            </div>
            
            <div className="mb-4">
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
            
            <div className="mb-6">
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
            
            <div className="flex justify-end">
              <button
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded mr-2"
                onClick={() => setShowEditModal(false)}
              >
                Cancel
              </button>
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={handleEditPlan}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Workout Modal */}
      {showWorkoutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Add Workout</h3>
            
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="day">
                Day *
              </label>
              <select
                id="day"
                name="day"
                value={newWorkout.day}
                onChange={handleWorkoutInputChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              >
                <option value="">Select a day</option>
                {weekdays.map((day) => (
                  <option key={day} value={day}>{day}</option>
                ))}
              </select>
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="workoutName">
                Workout Name *
              </label>
              <input
                type="text"
                id="workoutName"
                name="name"
                value={newWorkout.name}
                onChange={handleWorkoutInputChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Enter workout name"
                required
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="workoutDescription">
                Description
              </label>
              <textarea
                id="workoutDescription"
                name="description"
                value={newWorkout.description}
                onChange={handleWorkoutInputChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Enter workout description"
                rows="3"
              />
            </div>
            
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="duration">
                Duration *
              </label>
              <input
                type="text"
                id="duration"
                name="duration"
                value={newWorkout.duration}
                onChange={handleWorkoutInputChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="e.g. 45 min"
                required
              />
            </div>
            
            <div className="flex justify-end">
              <button
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded mr-2"
                onClick={() => setShowWorkoutModal(false)}
              >
                Cancel
              </button>
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
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