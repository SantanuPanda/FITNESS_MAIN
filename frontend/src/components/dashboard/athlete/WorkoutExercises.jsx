import React, { useState } from 'react';

const WorkoutExercises = ({ activeWorkout, setActiveWorkout }) => {
  const [newExercise, setNewExercise] = useState({ name: '', duration: '' });
  const [editingIndex, setEditingIndex] = useState(null);
  const [editFormData, setEditFormData] = useState({ name: '', duration: '' });

  // Add new exercise without confirmation
  const handleAddExercise = (e) => {
    e.preventDefault();
    if (newExercise.name && newExercise.duration) {
      const exercises = activeWorkout.details?.exercises || [];
      setActiveWorkout({
        ...activeWorkout,
        details: {
          ...activeWorkout.details,
          exercises: [...exercises, { ...newExercise, completed: false }]
        }
      });
      setNewExercise({ name: '', duration: '' });
    }
  };

  // Update exercise without confirmation
  const handleUpdateExercise = (e) => {
    e.preventDefault();
    if (editFormData.name && editFormData.duration && editingIndex !== null) {
      const updatedExercises = [...(activeWorkout.details?.exercises || [])];
      updatedExercises[editingIndex] = {
        ...updatedExercises[editingIndex],
        name: editFormData.name,
        duration: editFormData.duration
      };
      
      setActiveWorkout({
        ...activeWorkout,
        details: {
          ...activeWorkout.details,
          exercises: updatedExercises
        }
      });
      setEditingIndex(null);
    }
  };

  // Delete exercise without confirmation
  const handleDeleteExercise = (index) => {
    const updatedExercises = (activeWorkout.details?.exercises || []).filter((_, i) => i !== index);
    setActiveWorkout({
      ...activeWorkout,
      details: {
        ...activeWorkout.details,
        exercises: updatedExercises
      }
    });
  };

  // Toggle completion status
  const toggleExerciseCompletion = (index) => {
    const updatedExercises = [...(activeWorkout.details?.exercises || [])];
    updatedExercises[index] = {
      ...updatedExercises[index],
      completed: !updatedExercises[index].completed
    };
    
    setActiveWorkout({
      ...activeWorkout,
      details: {
        ...activeWorkout.details,
        exercises: updatedExercises
      }
    });
  };

  return (
    <div className="mt-6 p-4 border border-gray-100 rounded-lg bg-white shadow-sm">
      <h3 className="font-medium text-gray-800 mb-4">Exercises</h3>
      
      {/* Add Exercise Form */}
      <div className="mb-4 p-3 bg-gray-50 rounded-lg">
        <form onSubmit={handleAddExercise} className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            placeholder="Exercise name"
            value={newExercise.name}
            onChange={(e) => setNewExercise({...newExercise, name: e.target.value})}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
          <input
            type="text"
            placeholder="Duration/Reps (e.g., 5 min, 3×10)"
            value={newExercise.duration}
            onChange={(e) => setNewExercise({...newExercise, duration: e.target.value})}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            Add
          </button>
        </form>
      </div>
      
      {/* Exercise List */}
      {activeWorkout.details?.exercises && activeWorkout.details.exercises.length > 0 ? (
        <div className="space-y-3">
          {activeWorkout.details.exercises.map((exercise, index) => (
            <div key={index} className="border border-gray-100 rounded-lg p-3 hover:shadow-sm transition-shadow">
              {editingIndex === index ? (
                <form onSubmit={handleUpdateExercise} className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    value={editFormData.name}
                    onChange={(e) => setEditFormData({...editFormData, name: e.target.value})}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                  <input
                    type="text"
                    value={editFormData.duration}
                    onChange={(e) => setEditFormData({...editFormData, duration: e.target.value})}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm font-medium"
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingIndex(null)}
                      className="px-3 py-1 bg-gray-200 text-gray-700 rounded-md text-sm font-medium"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div 
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm mr-3 cursor-pointer ${
                        exercise.completed 
                          ? 'bg-green-100 text-green-600' 
                          : 'bg-blue-100 text-blue-600'
                      }`}
                      onClick={() => toggleExerciseCompletion(index)}
                    >
                      {exercise.completed ? '✓' : (index + 1)}
                    </div>
                    <div>
                      <h4 className={`font-medium ${exercise.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                        {exercise.name}
                      </h4>
                      <p className="text-sm text-gray-500">{exercise.duration}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditingIndex(index);
                        setEditFormData({
                          name: exercise.name,
                          duration: exercise.duration
                        });
                      }}
                      className="px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-700 hover:bg-blue-200"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteExercise(index)}
                      className="px-2 py-1 rounded text-xs font-medium bg-red-100 text-red-700 hover:bg-red-200"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-6">
          <p className="text-gray-500">No exercises added yet.</p>
        </div>
      )}
    </div>
  );
};

export default WorkoutExercises; 