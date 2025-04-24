/**
 * Local storage service for handling user data
 */

/**
 * Get user data from localStorage
 * @param {string} userId User ID
 * @returns {Object} Result with success status and user data
 */
export const getUserData = async (userId) => {
  try {
    // Get user data from localStorage
    const userData = JSON.parse(localStorage.getItem(`fitness_app_user_${userId}`) || 'null');
    
    if (userData) {
      return {
        success: true,
        data: userData
      };
    } else {
      return {
        success: false,
        error: 'User data not found'
      };
    }
  } catch (error) {
    console.error('Error getting user data:', error);
    return {
      success: false,
      error: error.message || 'Failed to get user data'
    };
  }
};

/**
 * Update user data in localStorage
 * @param {string} userId User ID
 * @param {Object} data User data to update
 * @returns {Object} Result with success status
 */
export const updateUserData = async (userId, data) => {
  try {
    // Get current user data
    const currentData = JSON.parse(localStorage.getItem(`fitness_app_user_${userId}`) || '{}');
    
    // Update user data
    const updatedData = {
      ...currentData,
      ...data,
      updatedAt: new Date().toISOString()
    };
    
    // Save to localStorage
    localStorage.setItem(`fitness_app_user_${userId}`, JSON.stringify(updatedData));
    
    return {
      success: true
    };
  } catch (error) {
    console.error('Error updating user data:', error);
    return {
      success: false,
      error: error.message || 'Failed to update user data'
    };
  }
};

/**
 * Upload profile photo (simulated)
 * @param {string} userId User ID
 * @param {File} file Photo file to upload
 * @param {Function} onProgress Progress callback
 * @returns {Object} Result with success status and photo URL
 */
export const uploadProfilePhoto = async (userId, file, onProgress) => {
  return new Promise((resolve, reject) => {
    try {
      // Simulate upload delay and progress updates
      const reader = new FileReader();
      
      reader.onloadstart = () => {
        onProgress && onProgress(0);
      };
      
      reader.onprogress = (event) => {
        if (event.lengthComputable) {
          const progress = Math.round((event.loaded / event.total) * 100);
          onProgress && onProgress(progress);
        }
      };
      
      reader.onload = async (event) => {
        // Simulate network delay
        await new Promise(r => setTimeout(r, 500));
        
        // Get the data URL
        const photoURL = event.target.result;
        
        // Update user data with the new photo URL
        const result = await updateUserData(userId, { photoURL });
        
        if (result.success) {
          resolve({
            success: true,
            photoURL
          });
        } else {
          reject(new Error(result.error || 'Failed to upload photo'));
        }
      };
      
      reader.onerror = () => {
        reject(new Error('Error reading file'));
      };
      
      // Read the file as a data URL
      reader.readAsDataURL(file);
    } catch (error) {
      reject(error);
    }
  });
}; 