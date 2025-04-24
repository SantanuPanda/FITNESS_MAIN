import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import logoImage from '../assets/logo.png';

const ResetPasswordPage = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');
  const [tempToken, setTempToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [validSession, setValidSession] = useState(true);
  
  const navigate = useNavigate();
  const location = useLocation();
  const { resetPassword } = useAuth();
  
  // Get email and tempToken from location state
  useEffect(() => {
    if (location.state && location.state.email && location.state.tempToken) {
      setEmail(location.state.email);
      setTempToken(location.state.tempToken);
    } else {
      setValidSession(false);
      setError('Invalid session. Please restart the password reset process.');
    }
  }, [location]);
  
  const handleResetPassword = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!password) {
      setError('Please enter a new password');
      return;
    }
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (!email || !tempToken) {
      setError('Invalid session. Please restart the password reset process.');
      return;
    }
    
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      const result = await resetPassword(email, tempToken, password);
      
      if (result.success) {
        setSuccess(result.message || 'Password reset successful! You can now log in with your new password.');
        // Redirect to login page after 3 seconds
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } else {
        setError(result.error || 'Failed to reset password. Please try again.');
      }
    } catch (error) {
      console.error('Reset password error:', error);
      setError(error.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        when: "beforeChildren", 
        staggerChildren: 0.1,
        duration: 0.5 
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };
  
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 px-6 sm:px-6 lg:px-8">
      <motion.div 
        className="sm:mx-auto sm:w-full sm:max-w-md"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-center">
          <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center">
            <img src={logoImage} alt="Fitness Logo" className="w-8 h-8" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Reset Your Password
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Enter your new password below
        </p>
      </motion.div>

      <motion.div 
        className="mt-8 sm:mx-auto sm:w-full sm:max-w-md"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="bg-white py-8 px-6 shadow sm:rounded-lg sm:px-10">
          {!validSession ? (
            <div className="text-center">
              <p className="text-red-500 mb-4">{error}</p>
              <Link 
                to="/forgot-password" 
                className="text-purple-600 hover:text-purple-500 font-medium"
              >
                Go Back to Forgot Password
              </Link>
            </div>
          ) : (
            <motion.form 
              className="space-y-6" 
              onSubmit={handleResetPassword}
              variants={containerVariants}
            >
              <motion.div variants={itemVariants}>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    disabled
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                    value={email}
                  />
                </div>
              </motion.div>

              <motion.div variants={itemVariants}>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  New Password
                </label>
                <div className="mt-1 relative">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    required
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </motion.div>

              <motion.div variants={itemVariants}>
                <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">
                  Confirm New Password
                </label>
                <div className="mt-1 relative">
                  <input
                    id="confirm-password"
                    name="confirm-password"
                    type="password"
                    autoComplete="new-password"
                    required
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
              </motion.div>

              {/* Error message */}
              {error && (
                <motion.div 
                  className="text-red-500 text-sm"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {error}
                </motion.div>
              )}
              
              {/* Success message */}
              {success && (
                <motion.div 
                  className="text-green-500 text-sm"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {success}
                </motion.div>
              )}

              <motion.div variants={itemVariants}>
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {loading ? 'Resetting...' : 'Reset Password'}
                </button>
              </motion.div>
              
              <motion.div 
                className="text-center mt-4"
                variants={itemVariants}
              >
                <Link 
                  to="/login" 
                  className="text-sm text-purple-600 hover:text-purple-500 font-medium"
                >
                  Back to Login
                </Link>
              </motion.div>
            </motion.form>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default ResetPasswordPage; 