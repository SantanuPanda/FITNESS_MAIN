import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const MealPlans = ({ 
  mealPlans, 
  clients, 
  onAddMealPlan, 
  onDeleteMealPlan 
}) => {
  const [showMealPlanForm, setShowMealPlanForm] = useState(false);
  const [newMealPlan, setNewMealPlan] = useState({
    clientId: '',
    name: '',
    duration: '',
    calories: '',
    notes: ''
  });
  const [validationErrors, setValidationErrors] = useState({});
  const [selectedPlan, setSelectedPlan] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewMealPlan({ ...newMealPlan, [name]: value });
    
    // Clear validation error when field is updated
    if (validationErrors[name]) {
      const updatedErrors = { ...validationErrors };
      delete updatedErrors[name];
      setValidationErrors(updatedErrors);
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!newMealPlan.clientId) errors.clientId = "Client is required";
    if (!newMealPlan.name) errors.name = "Meal plan name is required";
    if (!newMealPlan.duration) errors.duration = "Duration is required";
    if (!newMealPlan.calories) errors.calories = "Calories is required";
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddMealPlan = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onAddMealPlan({
        ...newMealPlan,
        id: Math.floor(Math.random() * 10000),
        calories: parseInt(newMealPlan.calories)
      });
      
      // Reset form
      setNewMealPlan({
        clientId: '',
        name: '',
        duration: '',
        calories: '',
        notes: ''
      });
      setShowMealPlanForm(false);
    }
  };

  const togglePlanDetails = (plan) => {
    if (selectedPlan && selectedPlan.id === plan.id) {
      setSelectedPlan(null);
    } else {
      setSelectedPlan(plan);
    }
  };

  const getClientName = (clientId) => {
    const client = clients.find(c => c.id === clientId);
    return client ? client.name : 'Unknown Client';
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800 mb-2 sm:mb-0">Meal Plans</h2>
        <button
          onClick={() => setShowMealPlanForm(!showMealPlanForm)}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md transition-colors duration-300 w-full sm:w-auto"
        >
          {showMealPlanForm ? 'Cancel' : 'Create New Plan'}
        </button>
      </div>

      <AnimatePresence>
        {showMealPlanForm && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden mb-4"
          >
            <form onSubmit={handleAddMealPlan} className="bg-gray-50 p-4 rounded-md">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-gray-700 mb-1">Client</label>
                  <select
                    name="clientId"
                    value={newMealPlan.clientId}
                    onChange={handleInputChange}
                    className={`w-full p-2 border rounded-md ${validationErrors.clientId ? 'border-red-500' : 'border-gray-300'}`}
                  >
                    <option value="">Select Client</option>
                    {clients.map(client => (
                      <option key={client.id} value={client.id}>{client.name}</option>
                    ))}
                  </select>
                  {validationErrors.clientId && <p className="text-red-500 text-sm mt-1">{validationErrors.clientId}</p>}
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-1">Plan Name</label>
                  <input
                    type="text"
                    name="name"
                    value={newMealPlan.name}
                    onChange={handleInputChange}
                    placeholder="e.g., Weight Loss Plan"
                    className={`w-full p-2 border rounded-md ${validationErrors.name ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {validationErrors.name && <p className="text-red-500 text-sm mt-1">{validationErrors.name}</p>}
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-1">Duration</label>
                  <input
                    type="text"
                    name="duration"
                    value={newMealPlan.duration}
                    onChange={handleInputChange}
                    placeholder="e.g., 4 weeks"
                    className={`w-full p-2 border rounded-md ${validationErrors.duration ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {validationErrors.duration && <p className="text-red-500 text-sm mt-1">{validationErrors.duration}</p>}
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-1">Calories</label>
                  <input
                    type="number"
                    name="calories"
                    value={newMealPlan.calories}
                    onChange={handleInputChange}
                    placeholder="e.g., 2000"
                    className={`w-full p-2 border rounded-md ${validationErrors.calories ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {validationErrors.calories && <p className="text-red-500 text-sm mt-1">{validationErrors.calories}</p>}
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 mb-1">Notes</label>
                <textarea
                  name="notes"
                  value={newMealPlan.notes}
                  onChange={handleInputChange}
                  placeholder="Any special instructions or notes about this meal plan"
                  className="w-full p-2 border border-gray-300 rounded-md h-24"
                />
              </div>
              
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors duration-300"
                >
                  Add Plan
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {mealPlans.length === 0 ? (
        <div className="bg-gray-50 p-6 rounded-lg text-center">
          <p className="text-gray-500">No meal plans available. Create your first plan!</p>
        </div>
      ) : (
        <div>
          {/* Desktop View - Table */}
          <div className="hidden md:block">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg overflow-hidden">
              <thead className="bg-gray-50">
                <tr>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plan Name</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Calories</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {mealPlans.map((plan) => (
                  <React.Fragment key={plan.id}>
                    <tr 
                      className={`hover:bg-gray-50 cursor-pointer ${selectedPlan && selectedPlan.id === plan.id ? 'bg-blue-50' : ''}`}
                      onClick={() => togglePlanDetails(plan)}
                    >
                      <td className="py-3 px-4">{getClientName(plan.clientId)}</td>
                      <td className="py-3 px-4">{plan.name}</td>
                      <td className="py-3 px-4">{plan.duration}</td>
                      <td className="py-3 px-4">{plan.calories} kcal</td>
                      <td className="py-3 px-4">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteMealPlan(plan.id);
                          }}
                          className="text-red-500 hover:text-red-700"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                    {selectedPlan && selectedPlan.id === plan.id && (
                      <tr>
                        <td colSpan="5" className="py-4 px-6 bg-blue-50">
                          <div className="text-sm text-gray-700">
                            <h4 className="font-medium mb-2">Plan Details</h4>
                            <p className="mb-2"><span className="font-medium">Client:</span> {getClientName(plan.clientId)}</p>
                            <p className="mb-2"><span className="font-medium">Notes:</span> {plan.notes || 'No notes provided'}</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Mobile View - Cards */}
          <div className="md:hidden space-y-4">
            {mealPlans.map((plan) => (
              <div key={plan.id} className="border border-gray-200 rounded-lg overflow-hidden">
                <div 
                  className={`p-4 cursor-pointer ${selectedPlan && selectedPlan.id === plan.id ? 'bg-blue-50' : 'bg-white'}`}
                  onClick={() => togglePlanDetails(plan)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium">{plan.name}</h3>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteMealPlan(plan.id);
                      }}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      Delete
                    </button>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">Client: {getClientName(plan.clientId)}</p>
                  <p className="text-sm text-gray-600 mb-1">Duration: {plan.duration}</p>
                  <p className="text-sm text-gray-600">Calories: {plan.calories} kcal</p>
                </div>
                {selectedPlan && selectedPlan.id === plan.id && (
                  <div className="p-4 bg-blue-50 border-t border-gray-200">
                    <h4 className="font-medium mb-2 text-sm">Plan Details</h4>
                    <p className="text-sm text-gray-700 mb-2">
                      <span className="font-medium">Notes:</span> {plan.notes || 'No notes provided'}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MealPlans; 