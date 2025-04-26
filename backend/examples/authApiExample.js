// Example code for integrating with the authentication API

// API URL - replace with your actual API URL in production
const API_URL = 'http://localhost:5000/api';

// ============================================
// User Routes (/api/users/*)
// ============================================

// Function to register (signup) using User Routes
async function signupUser(userData) {
  try {
    const response = await fetch(`${API_URL}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to sign up');
    }

    // Store user data and token in localStorage or state management
    localStorage.setItem('userInfo', JSON.stringify(data));
    return data;
  } catch (error) {
    console.error('Signup error:', error.message);
    throw error;
  }
}

// Function to login using User Routes
async function loginUser(credentials) {
  try {
    const response = await fetch(`${API_URL}/users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to log in');
    }

    // Store user data and token in localStorage or state management
    localStorage.setItem('userInfo', JSON.stringify(data));
    return data;
  } catch (error) {
    console.error('Login error:', error.message);
    throw error;
  }
}

// ============================================
// Auth Routes (/api/auth/*)
// ============================================

// Function to register using Auth Routes
async function register(userData) {
  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to register');
    }

    // Store user data and token in localStorage or state management
    localStorage.setItem('userInfo', JSON.stringify(data));
    return data;
  } catch (error) {
    console.error('Registration error:', error.message);
    throw error;
  }
}

// Function to login using Auth Routes
async function login(credentials) {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to log in');
    }

    // Store user data and token in localStorage or state management
    localStorage.setItem('userInfo', JSON.stringify(data));
    return data;
  } catch (error) {
    console.error('Login error:', error.message);
    throw error;
  }
}

// Function to get user profile using Auth Routes
async function getProfile() {
  try {
    // Get user info from localStorage
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
    const token = userInfo.token;

    if (!token) {
      throw new Error('No token found. Please login first.');
    }

    const response = await fetch(`${API_URL}/auth/profile`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to get profile');
    }

    return data;
  } catch (error) {
    console.error('Get profile error:', error.message);
    throw error;
  }
}

// Function to log out user
function logout() {
  localStorage.removeItem('userInfo');
  // Additional cleanup if needed
}

// Example usage:
/*
// Using User Routes
const newUser = {
  name: "John Doe",
  email: "john@example.com",
  password: "password123"
};

signupUser(newUser)
  .then(data => console.log('Signup successful:', data))
  .catch(error => console.error('Signup failed:', error.message));

// OR using Auth Routes
register(newUser)
  .then(data => console.log('Registration successful:', data))
  .catch(error => console.error('Registration failed:', error.message));
*/

export { 
  // User Routes
  signupUser, 
  loginUser,
  
  // Auth Routes
  register,
  login,
  getProfile,
  
  // Common
  logout
}; 