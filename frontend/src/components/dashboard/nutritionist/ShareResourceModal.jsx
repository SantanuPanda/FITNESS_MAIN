import React, { useState } from 'react';
import { motion } from 'framer-motion';

const ShareResourceModal = ({ isOpen, onClose, resource, onShare }) => {
  const [shareData, setShareData] = useState({
    email: '',
    message: '',
    sendCopy: true
  });
  const [isSharing, setIsSharing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setShareData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    // Validate email
    if (!shareData.email || !shareData.email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }
    
    setIsSharing(true);
    try {
      await onShare(resource.id, shareData);
      setSuccess(`Resource has been shared with ${shareData.email}`);
      
      // Reset form but don't close modal yet so the user can see the success message
      setShareData({
        email: '',
        message: '',
        sendCopy: true
      });
      
      // Auto-close after a delay
      setTimeout(() => {
        onClose();
        setSuccess('');
      }, 3000);
    } catch (error) {
      setError('Failed to share resource. Please try again.');
      console.error('Share error:', error);
    } finally {
      setIsSharing(false);
    }
  };

  if (!isOpen || !resource) return null;

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
            <h3 className="text-xl font-semibold text-gray-800">Share Resource</h3>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="mb-4 p-3 bg-gray-50 rounded-md">
            <h4 className="font-medium text-gray-800">{resource.title}</h4>
            <p className="text-sm text-gray-500 mt-1">{resource.type} • {resource.size}</p>
          </div>
          
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-md text-sm">
              {error}
            </div>
          )}
          
          {success && (
            <div className="mb-4 p-3 bg-green-50 text-green-600 rounded-md text-sm">
              {success}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-medium mb-1">
                Recipient Email *
              </label>
              <input
                type="email"
                name="email"
                value={shareData.email}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="client@example.com"
                required
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-medium mb-1">
                Message (Optional)
              </label>
              <textarea
                name="message"
                value={shareData.message}
                onChange={handleInputChange}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Add a personal message to include with the resource..."
              ></textarea>
            </div>
            
            <div className="mb-4">
              <label className="flex items-center text-gray-700 text-sm">
                <input
                  type="checkbox"
                  name="sendCopy"
                  checked={shareData.sendCopy}
                  onChange={handleInputChange}
                  className="mr-2 h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                />
                Send me a copy
              </label>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                disabled={isSharing}
              >
                Cancel
              </button>
              <button
                type="submit"
                className={`px-4 py-2 text-white ${
                  isSharing ? 'bg-purple-400 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700'
                } rounded-md flex items-center`}
                disabled={isSharing}
              >
                {isSharing ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sharing...
                  </>
                ) : (
                  'Share Resource'
                )}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default ShareResourceModal; 