/**
 * Mock authentication service for demo purposes
 * Uses localStorage to simulate authentication
 */

// Storage key for mock auth data
const STORAGE_KEY = 'fitness_app_auth';

// Get current auth data from localStorage
const getAuthData = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
  } catch (error) {
    console.error('Error parsing auth data:', error);
    return null;
  }
};

// Set auth data in localStorage
const setAuthData = (data) => {
  try {
    if (data) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  } catch (error) {
    console.error('Error setting auth data:', error);
  }
};

// List of auth change listeners
const listeners = [];

/**
 * Register a new user with email and password
 * @param {string} email User email
 * @param {string} password User password
 * @param {string} displayName User display name
 * @returns {Object} Result with success status and user data
 */
export const registerWithEmail = async (email, password, displayName) => {
  try {
    // Check if user already exists
    const users = JSON.parse(localStorage.getItem('fitness_app_users') || '[]');
    const existingUser = users.find(user => user.email === email);
    
    if (existingUser) {
      return {
        success: false,
        error: 'Email already in use'
      };
    }
    
    // Create new user
    const user = {
      uid: 'user_' + Date.now(),
      email,
      displayName: displayName || email.split('@')[0],
      photoURL: null
    };
    
    // Save user to localStorage
    users.push({ ...user, password });
    localStorage.setItem('fitness_app_users', JSON.stringify(users));
    
    // Set auth data
    setAuthData(user);
    
    // Initialize user data
    const usersData = JSON.parse(localStorage.getItem('fitness_app_users_data') || '{}');
    usersData[user.uid] = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      createdAt: new Date().toISOString()
    };
    localStorage.setItem('fitness_app_users_data', JSON.stringify(usersData));
    
    // Notify listeners
    listeners.forEach(callback => callback(user));
    
    return {
      success: true,
      user
    };
  } catch (error) {
    console.error('Error registering user:', error);
    return {
      success: false,
      error: error.message || 'Failed to register user'
    };
  }
};

/**
 * Sign in with email and password
 * @param {string} email User email
 * @param {string} password User password
 * @returns {Object} Result with success status and user data
 */
export const signInWithEmail = async (email, password) => {
  try {
    // Get users from localStorage
    const users = JSON.parse(localStorage.getItem('fitness_app_users') || '[]');
    const user = users.find(user => user.email === email && user.password === password);
    
    if (!user) {
      return {
        success: false,
        error: 'Invalid email or password'
      };
    }
    
    // Remove password from user object
    const { password: _, ...userData } = user;
    
    // Set auth data
    setAuthData(userData);
    
    // Notify listeners
    listeners.forEach(callback => callback(userData));
    
    return {
      success: true,
      user: userData
    };
  } catch (error) {
    console.error('Error signing in:', error);
    return {
      success: false,
      error: error.message || 'Failed to sign in'
    };
  }
};

/**
 * Sign in with Google (mock)
 * @returns {Object} Result with success status and user data
 */
export const signInWithGoogle = async () => {
  try {
    // Create a mock Google user
    const user = {
      uid: 'google_user_' + Date.now(),
      email: 'demo.user@example.com',
      displayName: 'Demo User',
      photoURL: 'https://via.placeholder.com/150'
    };
    
    // Set auth data
    setAuthData(user);
    
    // Initialize user data if not exists
    const usersData = JSON.parse(localStorage.getItem('fitness_app_users_data') || '{}');
    if (!usersData[user.uid]) {
      usersData[user.uid] = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        createdAt: new Date().toISOString()
      };
      localStorage.setItem('fitness_app_users_data', JSON.stringify(usersData));
    }
    
    // Notify listeners
    listeners.forEach(callback => callback(user));
    
    return {
      success: true,
      user
    };
  } catch (error) {
    console.error('Error signing in with Google:', error);
    return {
      success: false,
      error: error.message || 'Failed to sign in with Google'
    };
  }
};

/**
 * Send password reset email (mock)
 * @param {string} email User email
 * @returns {Object} Result with success status
 */
export const resetPassword = async (email) => {
  // Simulate a successful password reset email
  console.log(`Password reset email sent to: ${email}`);
  
  return {
    success: true
  };
};

/**
 * Sign out user
 * @returns {Object} Result with success status
 */
export const logout = async () => {
  try {
    // Clear auth data
    setAuthData(null);
    
    // Notify listeners
    listeners.forEach(callback => callback(null));
    
    return {
      success: true
    };
  } catch (error) {
    console.error('Error signing out:', error);
    return {
      success: false,
      error: error.message || 'Failed to sign out'
    };
  }
};

/**
 * Get current user
 * @returns {Object|null} Current user or null
 */
export const getCurrentUser = () => {
  return getAuthData();
};

/**
 * Listen for auth state changes
 * @param {Function} callback Callback function to handle auth state changes
 * @returns {Function} Unsubscribe function
 */
export const subscribeToAuthChanges = (callback) => {
  listeners.push(callback);
  
  // Call callback with current auth state
  const currentUser = getAuthData();
  callback(currentUser);
  
  // Return unsubscribe function
  return () => {
    const index = listeners.indexOf(callback);
    if (index !== -1) {
      listeners.splice(index, 1);
    }
  };
}; 