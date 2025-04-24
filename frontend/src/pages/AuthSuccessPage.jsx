import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const AuthSuccessPage = () => {
  const [searchParams] = useSearchParams();
  const { setToken, setCurrentUser, setIsAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthSuccess = async () => {
      try {
        // Get token from URL
        const token = searchParams.get('token');
        
        if (!token) {
          console.error('No token found in URL');
          navigate('/login');
          return;
        }
        
        // Save token to localStorage
        localStorage.setItem('token', token);
        setToken(token);
        
        // Set authorization header for all future requests
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        // Get user profile
        const response = await axios.get('http://localhost:3000/api/auth/profile');
        setCurrentUser(response.data);
        setIsAuthenticated(true);
        
        // Redirect to home page
        setTimeout(() => {
          navigate('/');
        }, 1500);
      } catch (error) {
        console.error('Error processing authentication:', error);
        navigate('/login');
      }
    };
    
    handleAuthSuccess();
  }, [searchParams, navigate, setToken, setCurrentUser, setIsAuthenticated]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Authentication Successful</h2>
        <p className="text-gray-600">Please wait while we log you in...</p>
      </div>
    </div>
  );
};

export default AuthSuccessPage; 