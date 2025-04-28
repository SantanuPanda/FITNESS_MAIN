import React, { useState } from 'react';
import { motion } from 'framer-motion';

const ResourceUploadModal = ({ isOpen, onClose, onUpload }) => {
  const [resourceData, setResourceData] = useState({
    title: '',
    description: '',
    category: 'Educational Materials',
    file: null,
    fileName: ''
  });
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setResourceData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    if (!e.target.files[0]) return;
    
    const file = e.target.files[0];
    const fileName = file.name;
    const fileSize = file.size;
    
    // Format file size
    let formattedSize;
    if (fileSize < 1024 * 1024) {
      formattedSize = `${(fileSize / 1024).toFixed(1)} KB`;
    } else {
      formattedSize = `${(fileSize / (1024 * 1024)).toFixed(1)} MB`;
    }
    
    // Determine file type
    const fileExtension = fileName.split('.').pop().toUpperCase();
    
    setResourceData(prev => ({
      ...prev,
      file,
      fileName,
      type: fileExtension,
      size: formattedSize
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validate
    if (!resourceData.title || !resourceData.category || !resourceData.file) {
      setError('Please fill all required fields and upload a file');
      return;
    }
    
    setIsUploading(true);
    try {
      await onUpload(resourceData);
      resetForm();
      onClose();
    } catch (error) {
      setError('Failed to upload resource. Please try again.');
      console.error('Upload error:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const resetForm = () => {
    setResourceData({
      title: '',
      description: '',
      category: 'Educational Materials',
      file: null,
      fileName: ''
    });
    setError('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-lg max-w-md w-full mx-4 overflow-hidden"
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-800">Upload Resource</h3>
            <button 
              onClick={() => {
                resetForm();
                onClose();
              }}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-md text-sm">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-medium mb-1">
                Title *
              </label>
              <input
                type="text"
                name="title"
                value={resourceData.title}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-medium mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={resourceData.description}
                onChange={handleInputChange}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              ></textarea>
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-medium mb-1">
                Category *
              </label>
              <select
                name="category"
                value={resourceData.category}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              >
                <option value="Educational Materials">Educational Materials</option>
                <option value="Meal Plans">Meal Plans</option>
                <option value="Video Resources">Video Resources</option>
                <option value="Client Handouts">Client Handouts</option>
                <option value="Recipes">Recipes</option>
              </select>
            </div>
            
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-medium mb-1">
                File *
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center">
                {resourceData.fileName ? (
                  <div className="text-sm">
                    <p className="font-medium">{resourceData.fileName}</p>
                    <p className="text-gray-500 mt-1">{resourceData.size} • {resourceData.type}</p>
                    <button 
                      type="button"
                      onClick={() => setResourceData(prev => ({ ...prev, file: null, fileName: '' }))}
                      className="mt-2 text-purple-600 hover:text-purple-800"
                    >
                      Choose a different file
                    </button>
                  </div>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <p className="mt-2 text-sm text-gray-600">
                      Drag and drop a file, or{" "}
                      <label className="text-purple-600 hover:text-purple-800 cursor-pointer">
                        browse
                        <input
                          type="file"
                          className="hidden"
                          onChange={handleFileChange}
                        />
                      </label>
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      Supports PDF, DOCX, JPG/PNG, MP4, etc. (Max 20MB)
                    </p>
                  </>
                )}
              </div>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => {
                  resetForm();
                  onClose();
                }}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                disabled={isUploading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className={`px-4 py-2 text-white ${
                  isUploading ? 'bg-purple-400 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700'
                } rounded-md flex items-center`}
                disabled={isUploading}
              >
                {isUploading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Uploading...
                  </>
                ) : (
                  'Upload Resource'
                )}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default ResourceUploadModal; 