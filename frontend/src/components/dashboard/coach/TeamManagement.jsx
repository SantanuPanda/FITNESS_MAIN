import React, { useState, useEffect } from 'react';

function TeamManagement() {
  const [teams, setTeams] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [newTeam, setNewTeam] = useState({
    name: '',
    sport: '',
    members: 0
  });

  // Load teams from localStorage on component mount
  useEffect(() => {
    try {
      const savedTeams = localStorage.getItem('coachTeams');
      console.log('Loading teams from localStorage:', savedTeams);
      
      if (savedTeams && savedTeams !== 'undefined') {
        const parsedTeams = JSON.parse(savedTeams);
        console.log('Parsed teams:', parsedTeams);
        setTeams(parsedTeams);
      } else {
        console.log('No teams found in localStorage or invalid data');
        setTeams([]);
      }
    } catch (error) {
      console.error('Error loading teams from localStorage:', error);
      setTeams([]);
    }
  }, []);

  // Save teams to localStorage whenever teams state changes
  useEffect(() => {
    try {
      console.log('Saving teams to localStorage:', teams);
      localStorage.setItem('coachTeams', JSON.stringify(teams));
      // Verify the save worked
      const savedData = localStorage.getItem('coachTeams');
      console.log('Verification - saved data:', savedData);
    } catch (error) {
      console.error('Error saving teams to localStorage:', error);
    }
  }, [teams]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTeam({
      ...newTeam,
      [name]: value,
    });
  };

  const handleAddTeam = () => {
    if (!newTeam.name || !newTeam.sport) {
      alert('Please fill all required fields');
      return;
    }

    const newTeamObj = {
      id: Date.now(), // Use timestamp as ID to ensure uniqueness
      name: newTeam.name,
      sport: newTeam.sport,
      members: parseInt(newTeam.members) || 0,
      createdAt: new Date().toISOString().split('T')[0],
    };

    console.log('Adding new team:', newTeamObj);
    const updatedTeams = [...teams, newTeamObj];
    setTeams(updatedTeams);
    
    // Directly save to localStorage as a backup
    try {
      localStorage.setItem('coachTeams', JSON.stringify(updatedTeams));
      console.log('Teams saved directly after add:', updatedTeams);
    } catch (error) {
      console.error('Error directly saving after add:', error);
    }
    
    setNewTeam({ name: '', sport: '', members: 0 });
    setShowAddModal(false);
  };

  const handleDeleteTeam = (id) => {
    if (window.confirm('Are you sure you want to delete this team?')) {
      const updatedTeams = teams.filter(team => team.id !== id);
      setTeams(updatedTeams);
      
      // Directly save to localStorage as a backup
      try {
        localStorage.setItem('coachTeams', JSON.stringify(updatedTeams));
        console.log('Teams saved directly after delete:', updatedTeams);
      } catch (error) {
        console.error('Error directly saving after delete:', error);
      }
      
      if (selectedTeam && selectedTeam.id === id) {
        setSelectedTeam(null);
        setShowViewModal(false);
      }
    }
  };

  const handleViewTeam = (team) => {
    setSelectedTeam(team);
    setShowViewModal(true);
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold text-gray-800">Manage Teams</h2>
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center w-full sm:w-auto justify-center"
          onClick={() => setShowAddModal(true)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Add Team
        </button>
      </div>

      {/* Teams List - Desktop view */}
      <div className="bg-white rounded-lg shadow overflow-hidden hidden md:block">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Team Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sport</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Members</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {teams.map((team) => (
              <tr key={team.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{team.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{team.sport}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{team.members}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{team.createdAt}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button className="text-blue-600 hover:text-blue-900 mr-3" onClick={() => handleViewTeam(team)}>View</button>
                  <button className="text-red-600 hover:text-red-900" onClick={() => handleDeleteTeam(team.id)}>Delete</button>
                </td>
              </tr>
            ))}

            {teams.length === 0 && (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                  No teams found. Create your first team to get started!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Teams List - Mobile & Tablet view */}
      <div className="bg-white rounded-lg shadow md:hidden">
        {teams.length === 0 ? (
          <div className="px-4 py-6 text-center text-sm text-gray-500">
            No teams found. Create your first team to get started!
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {teams.map((team) => (
              <div key={team.id} className="p-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-sm font-medium text-gray-900">{team.name}</h3>
                  <div className="flex space-x-2">
                    <button 
                      className="text-blue-600 hover:text-blue-900 text-sm font-medium"
                      onClick={() => handleViewTeam(team)}
                    >
                      View
                    </button>
                    <button 
                      className="text-red-600 hover:text-red-900 text-sm font-medium"
                      onClick={() => handleDeleteTeam(team.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-xs text-gray-500">
                    <span className="font-medium">Sport:</span> {team.sport}
                  </div>
                  <div className="text-xs text-gray-500">
                    <span className="font-medium">Members:</span> {team.members}
                  </div>
                  <div className="text-xs text-gray-500 col-span-2">
                    <span className="font-medium">Created:</span> {team.createdAt}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Team Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-5 sm:p-8 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Add New Team</h3>
            
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                Team Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={newTeam.name}
                onChange={handleInputChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Enter team name"
                required
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="sport">
                Sport *
              </label>
              <input
                type="text"
                id="sport"
                name="sport"
                value={newTeam.sport}
                onChange={handleInputChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Enter sport type"
                required
              />
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="members">
                Member Number
              </label>
              <input
                type="number"
                id="members"
                name="members"
                value={newTeam.members}
                onChange={handleInputChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Enter initial member count"
                min="0"
              />
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
                onClick={handleAddTeam}
              >
                Add Team
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Team Modal */}
      {showViewModal && selectedTeam && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-5 sm:p-8 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Team Details</h3>
              <button 
                onClick={() => setShowViewModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <div className="mb-2">
                <span className="font-semibold text-gray-600">Team Name:</span>
                <span className="ml-2 text-gray-800">{selectedTeam.name}</span>
              </div>
              <div className="mb-2">
                <span className="font-semibold text-gray-600">Sport:</span>
                <span className="ml-2 text-gray-800">{selectedTeam.sport}</span>
              </div>
              <div className="mb-2">
                <span className="font-semibold text-gray-600">Members:</span>
                <span className="ml-2 text-gray-800">{selectedTeam.members}</span>
              </div>
              <div>
                <span className="font-semibold text-gray-600">Created:</span>
                <span className="ml-2 text-gray-800">{selectedTeam.createdAt}</span>
              </div>
            </div>
            
            <div className="flex justify-end">
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={() => setShowViewModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TeamManagement; 