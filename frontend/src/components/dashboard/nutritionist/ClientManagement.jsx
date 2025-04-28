import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ClientManagement = ({ clients, onAddClient, onDeleteClient, onUpdateClient }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterGoal, setFilterGoal] = useState('All Goals');
  const [sortOption, setSortOption] = useState('Sort by: Name');
  const [selectedClient, setSelectedClient] = useState(null);
  const [showClientDetails, setShowClientDetails] = useState(false);
  const [editClientData, setEditClientData] = useState(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [clientToDelete, setClientToDelete] = useState(null);
  const [showAddClientForm, setShowAddClientForm] = useState(false);

  // Function to filter and sort clients
  const getFilteredAndSortedClients = () => {
    let filteredClients = [...clients];
    
    // Apply search filter
    if (searchQuery) {
      filteredClients = filteredClients.filter(client => 
        client.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Apply goal filter
    if (filterGoal !== 'All Goals') {
      filteredClients = filteredClients.filter(client => 
        client.goal === filterGoal
      );
    }
    
    // Apply sorting
    if (sortOption === 'Sort by: Name') {
      filteredClients.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortOption === 'Sort by: Progress') {
      filteredClients.sort((a, b) => (b.progress || 0) - (a.progress || 0));
    } else if (sortOption === 'Sort by: Recent') {
      // Assuming client ID increases with time, newer clients have higher IDs
      filteredClients.sort((a, b) => b.id - a.id);
    }
    
    return filteredClients;
  };

  // Function to handle viewing client details
  const handleViewClient = (client) => {
    setSelectedClient(client);
    setShowClientDetails(true);
  };

  // Function to handle editing a client
  const handleEditClient = (client) => {
    setEditClientData({...client});
    setShowEditForm(true);
  };

  // Function to handle saving client edits
  const handleSaveEdit = (updatedClient) => {
    // If the onUpdateClient prop is provided, use it to update the client
    if (typeof onUpdateClient === 'function') {
      onUpdateClient(updatedClient);
    } else {
      console.log('No onUpdateClient prop provided. Updated client:', updatedClient);
    }
    
    // Close the edit form and reset state
    setShowEditForm(false);
    setEditClientData(null);
  };

  // Function to handle delete confirmation
  const handleDeleteConfirmation = (client) => {
    setClientToDelete(client);
    setShowDeleteConfirmation(true);
  };

  // Function to confirm deletion
  const confirmDelete = () => {
    if (clientToDelete) {
      onDeleteClient(clientToDelete.id);
      setShowDeleteConfirmation(false);
      setClientToDelete(null);
    }
  };

  // Function to cancel deletion
  const cancelDelete = () => {
    setShowDeleteConfirmation(false);
    setClientToDelete(null);
  };

  // Function to handle adding a new client
  const handleAddClient = (clientData) => {
    onAddClient(clientData);
    setShowAddClientForm(false);
  };

  // ClientForm component for adding a new client
  const ClientForm = ({ onSubmit, onCancel, initialData = null }) => {
    const [clientData, setClientData] = useState(initialData || {
      name: '',
      age: '',
      goal: 'Weight Loss',
      allergies: '',
      progress: 0,
      adherence: 0
    });
    
    const handleChange = (e) => {
      const { name, value } = e.target;
      setClientData(prev => ({
        ...prev,
        [name]: value
      }));
    };
    
    const handleSubmit = (e) => {
      e.preventDefault();
      
      // Basic validation
      if (!clientData.name || !clientData.age) {
        alert('Please fill out all required fields');
        return;
      }
      
      // Create or update client
      const clientToSubmit = {
        ...clientData,
        id: clientData.id || Date.now(),
        age: parseInt(clientData.age),
        progress: parseInt(clientData.progress) || 0,
        adherence: parseInt(clientData.adherence) || 0
      };
      
      onSubmit(clientToSubmit);
    };
    
    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Client Name*
            </label>
            <input
              type="text"
              name="name"
              value={clientData.name}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-purple-200"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Age*
            </label>
            <input
              type="number"
              name="age"
              value={clientData.age}
              onChange={handleChange}
              min="1"
              max="120"
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-purple-200"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nutrition Goal
            </label>
            <select
              name="goal"
              value={clientData.goal}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-purple-200"
            >
              <option>Weight Loss</option>
              <option>Muscle Gain</option>
              <option>Diabetes Management</option>
              <option>Athletic Performance</option>
              <option>Health Management</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Allergies
            </label>
            <input
              type="text"
              name="allergies"
              value={clientData.allergies || ''}
              onChange={handleChange}
              placeholder="e.g. Peanuts, Dairy"
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-purple-200"
            />
          </div>
        </div>
        
        {initialData && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Progress (%)
              </label>
              <input
                type="number"
                name="progress"
                value={clientData.progress || 0}
                onChange={handleChange}
                min="0"
                max="100"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-purple-200"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Adherence (%)
              </label>
              <input
                type="number"
                name="adherence"
                value={clientData.adherence || 0}
                onChange={handleChange}
                min="0"
                max="100"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-purple-200"
              />
            </div>
          </div>
        )}
        
        <div className="flex justify-end space-x-2 pt-4 border-t border-gray-200 gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
          >
            {initialData ? 'Update Client' : 'Add Client'}
          </button>
        </div>
      </form>
    );
  };

  // Client Details component
  const ClientDetails = ({ client, onClose, onEdit }) => {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <div className="h-12 w-12 bg-purple-100 rounded-full text-purple-600 flex items-center justify-center font-semibold text-lg">
              {client.name.charAt(0)}
            </div>
            <h3 className="text-xl font-semibold text-gray-800 ml-3">{client.name}</h3>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <p className="text-sm text-gray-500 mb-1">Age</p>
            <p className="font-medium">{client.age} years</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Goal</p>
            <p className="font-medium">{client.goal}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Allergies</p>
            <p className="font-medium">{client.allergies || 'None'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Client Progress</p>
            <div className="flex items-center">
              <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                <div className="bg-purple-600 h-2.5 rounded-full" style={{ width: `${client.progress}%` }}></div>
              </div>
              <span className="text-xs font-medium text-gray-500">{client.progress}%</span>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-200 pt-4">
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => onEdit(client)}
              className="px-4 py-2 bg-purple-50 text-purple-600 rounded-md hover:bg-purple-100 transition-colors"
            >
              Edit Client
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Delete Confirmation Modal
  const DeleteConfirmationModal = ({ client, onConfirm, onCancel }) => {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center mb-4 text-red-500">
          <svg className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h3 className="text-lg font-medium">Delete Client</h3>
        </div>
        
        <p className="mb-6 text-gray-600">
          Are you sure you want to delete <span className="font-medium">{client.name}</span>? This action cannot be undone.
        </p>
        
        <div className="flex justify-end space-x-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    );
  };

  const filteredAndSortedClients = getFilteredAndSortedClients();

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Client Management</h2>
        <button 
          onClick={() => setShowAddClientForm(true)}
          className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add New Client
        </button>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-6">
          <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input 
                type="text" 
                placeholder="Search clients..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 w-full sm:w-auto"
              />
            </div>
            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2 gap-2">
              <select 
                value={filterGoal}
                onChange={(e) => setFilterGoal(e.target.value)}
                className="border border-gray-300 rounded-lg p-2 focus:ring-purple-500 focus:border-purple-500 text-sm w-full sm:w-auto"
              >
                <option>All Goals</option>
                <option>Weight Loss</option>
                <option>Muscle Gain</option>
                <option>Diabetes Management</option>
                <option>Athletic Performance</option>
                <option>Health Management</option>
              </select>
              <select 
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="border border-gray-300 rounded-lg p-2 focus:ring-purple-500 focus:border-purple-500 text-sm w-full sm:w-auto"
              >
                <option>Sort by: Name</option>
                <option>Sort by: Progress</option>
                <option>Sort by: Recent</option>
              </select>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            {filteredAndSortedClients.length > 0 ? (
              <>
                {/* Desktop View - Table */}
                <div className="hidden md:block">
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
                      {filteredAndSortedClients.map(client => (
                        <tr key={client.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10 bg-purple-100 rounded-full text-purple-600 flex items-center justify-center font-semibold">
                                {client.name.charAt(0)}
                              </div>
                              <div className="ml-3">
                                <div className="text-sm font-medium text-gray-800">{client.name}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{client.age}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
                              {client.goal}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{client.allergies || 'None'}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex flex-col">
                              <div className="flex items-center">
                                <div className="w-full bg-gray-200 rounded-full h-2.5">
                                  <div className="bg-purple-600 h-2.5 rounded-full" style={{ width: `${client.progress}%` }}></div>
                                </div>
                                <span className="ml-2 text-xs text-gray-500">{client.progress}%</span>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button 
                              onClick={() => handleViewClient(client)}
                              className="text-purple-600 hover:text-purple-800 mr-3"
                            >
                              View
                            </button>
                            <button 
                              onClick={() => handleEditClient(client)}
                              className="text-purple-600 hover:text-purple-800 mr-3"
                            >
                              Edit
                            </button>
                            <button 
                              onClick={() => handleDeleteConfirmation(client)}
                              className="text-red-600 hover:text-red-800"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                {/* Mobile View - Cards */}
                <div className="md:hidden space-y-4">
                  {filteredAndSortedClients.map(client => (
                    <div key={client.id} className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                      <div className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center">
                            <div className="h-10 w-10 bg-purple-100 rounded-full text-purple-600 flex items-center justify-center font-semibold">
                              {client.name.charAt(0)}
                            </div>
                            <div className="ml-3">
                              <div className="text-sm font-medium text-gray-800">{client.name}</div>
                              <div className="text-xs text-gray-500">{client.age} years old</div>
                            </div>
                          </div>
                          <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
                            {client.goal}
                          </span>
                        </div>
                        
                        <div className="mt-2 space-y-2">
                          <div>
                            <p className="text-xs text-gray-500">Allergies</p>
                            <p className="text-sm">{client.allergies || 'None'}</p>
                          </div>
                          
                          <div>
                            <div className="flex justify-between items-center mb-1">
                              <p className="text-xs text-gray-500">Progress</p>
                              <span className="text-xs font-medium">{client.progress}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-purple-600 h-2 rounded-full" 
                                style={{ width: `${client.progress}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between">
                          <button 
                            onClick={() => handleViewClient(client)}
                            className="text-purple-600 text-sm font-medium"
                          >
                            View
                          </button>
                          <button 
                            onClick={() => handleEditClient(client)}
                            className="text-purple-600 text-sm font-medium"
                          >
                            Edit
                          </button>
                          <button 
                            onClick={() => handleDeleteConfirmation(client)}
                            className="text-red-600 text-sm font-medium"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="py-12 text-center">
                <svg className="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                <h3 className="text-lg font-medium text-gray-700 mb-1">No clients found</h3>
                {clients.length === 0 ? (
                  <>
                    <p className="text-gray-500 mb-4">Get started by adding your first client.</p>
                    <button 
                      onClick={() => setShowAddClientForm(true)}
                      className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg flex items-center mx-auto"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Add New Client
                    </button>
                  </>
                ) : (
                  <p className="text-gray-500">No clients match your search criteria.</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showAddClientForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-2xl mx-auto bg-white rounded-lg shadow-xl overflow-hidden"
            >
              <div className="px-6 py-4 bg-purple-600 text-white">
                <h3 className="text-lg font-medium">Add New Client</h3>
              </div>
              <div className="p-6">
                <ClientForm 
                  onSubmit={handleAddClient}
                  onCancel={() => setShowAddClientForm(false)}
                />
              </div>
            </motion.div>
          </div>
        )}

        {showClientDetails && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-2xl mx-auto"
            >
              <ClientDetails 
                client={selectedClient} 
                onClose={() => setShowClientDetails(false)}
                onEdit={handleEditClient}
              />
            </motion.div>
          </div>
        )}

        {showEditForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-2xl mx-auto bg-white rounded-lg shadow-xl overflow-hidden"
            >
              <div className="px-6 py-4 bg-purple-600 text-white">
                <h3 className="text-lg font-medium">Edit Client</h3>
              </div>
              <div className="p-6">
                <ClientForm 
                  initialData={editClientData}
                  onSubmit={handleSaveEdit}
                  onCancel={() => setShowEditForm(false)}
                />
              </div>
            </motion.div>
          </div>
        )}

        {showDeleteConfirmation && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-md mx-auto"
            >
              <DeleteConfirmationModal 
                client={clientToDelete}
                onConfirm={confirmDelete}
                onCancel={cancelDelete}
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ClientManagement; 