import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

// API URL from environment variables or fallback to localhost
const API_URL = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/auth` : 'http://localhost:5000/api/auth';

// Create the authentication context
const AuthContext = createContext();

// Create a custom hook to use the auth context
export function useAuth() {
  return useContext(AuthContext);
}

// Provider component that wraps the app and makes auth object available to any child component that calls useAuth()
export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token') || null);

  // Configure axios with token
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);

  // Sign up function
  async function signup(email, password, userData) {
    try {
      // Ensure userType is one of the expected values or default to 'athlete'
      const validUserTypes = ['athlete', 'coach', 'nutritionist'];
      const userType = userData.userType && validUserTypes.includes(userData.userType.toLowerCase()) 
        ? userData.userType.toLowerCase() 
        : 'athlete';
        
      const response = await axios.post(`${API_URL}/register`, {
        email,
        password,
        name: userData.name,
        userType: userType
      });

      // Save token to localStorage and state
      const { token } = response.data;
      localStorage.setItem('token', token);
      setToken(token);

      // Save user to state with userType included
      setCurrentUser({
        ...response.data,
        userType: userType  // Make sure userType is included in currentUser
      });
      
      // Initialize user data in storage
      try {
        const storageData = {
          email,
          name: userData.name,
          userType: userType,
          createdAt: new Date().toISOString(),
        };
        
        localStorage.setItem('fitness_app_users_data', JSON.stringify({
          [response.data.uid || response.data._id || response.data.id]: storageData
        }));
      } catch (storageError) {
        console.error('Error saving initial user data:', storageError);
      }
      
      return { success: true };
    } catch (error) {
      console.error('Signup error:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || error.message 
      };
    }
  }

  // Login function
  async function login(email, password) {
    try {
      const response = await axios.post(`${API_URL}/login`, {
        email,
        password
      });

      // Save token to localStorage and state
      const { token } = response.data;
      localStorage.setItem('token', token);
      setToken(token);

      // Get user type from storage if available
      let userType = 'athlete'; // Default to athlete
      try {
        const usersData = JSON.parse(localStorage.getItem('fitness_app_users_data') || '{}');
        const userId = response.data.uid || response.data._id || response.data.id;
        if (usersData[userId] && usersData[userId].userType) {
          userType = usersData[userId].userType;
        }
      } catch (storageError) {
        console.error('Error reading user type from storage:', storageError);
      }

      // Save user to state with userType included
      setCurrentUser({
        ...response.data,
        userType
      });
      
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || error.message 
      };
    }
  }

  // Forgot password function
  async function forgotPassword(email) {
    try {
      const response = await axios.post(`${API_URL}/forgot-password`, { email });
      return { 
        success: true,
        message: response.data.message
      };
    } catch (error) {
      console.error('Forgot password error:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || error.message 
      };
    }
  }

  // Verify OTP function
  async function verifyOtp(email, otp, purpose = 'verification') {
    try {
      const response = await axios.post(`${API_URL}/verify-otp`, { 
        email, 
        otp,
        purpose 
      });
      
      return { 
        success: true,
        message: response.data.message,
        tempToken: response.data.tempToken
      };
    } catch (error) {
      console.error('Verify OTP error:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || error.message 
      };
    }
  }

  // Reset password function
  async function resetPassword(email, tempToken, newPassword) {
    try {
      const response = await axios.post(`${API_URL}/reset-password`, { 
        email,
        tempToken, 
        password: newPassword 
      });
      
      return { 
        success: true,
        message: response.data.message
      };
    } catch (error) {
      console.error('Reset password error:', error);
      
      return { 
        success: false, 
        error: error.response?.data?.message || error.message 
      };
    }
  }

  // Logout function
  async function logout() {
    try {
      // Remove token from localStorage
      localStorage.removeItem('token');
      setToken(null);
      
      // Clear current user
      setCurrentUser(null);
      
      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      return { 
        success: false, 
        error: error.message 
      };
    }
  }

  // Update profile function
  async function updateProfile(data) {
    try {
      const response = await axios.put(`${API_URL}/profile`, data);
      
      // Update current user
      setCurrentUser({...currentUser, ...response.data});
      
      return { success: true };
    } catch (error) {
      console.error('Update profile error:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || error.message 
      };
    }
  }

  // Load user profile from token
  async function loadUserProfile() {
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(`${API_URL}/profile`);
      
      // Get user type from storage if available
      let userType = 'athlete'; // Default to athlete
      try {
        const usersData = JSON.parse(localStorage.getItem('fitness_app_users_data') || '{}');
        const userId = response.data.uid || response.data._id || response.data.id;
        if (usersData[userId] && usersData[userId].userType) {
          userType = usersData[userId].userType;
        }
      } catch (storageError) {
        console.error('Error reading user type from storage:', storageError);
      }
      
      // Set current user with userType
      setCurrentUser({
        ...response.data,
        userType
      });
    } catch (error) {
      console.error('Error loading user profile:', error);
      // If token is invalid, clear it
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        setToken(null);
      }
    } finally {
      setLoading(false);
    }
  }

  // Load user profile on mount
  useEffect(() => {
    loadUserProfile();
  }, [token]);

  // Auth context value
  const value = {
    currentUser,
    loading,
    token,
    signup,
    login,
    logout,
    updateProfile,
    forgotPassword,
    verifyOtp,
    resetPassword
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
} 