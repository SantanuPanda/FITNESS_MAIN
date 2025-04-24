import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import logoImage from '../assets/logo.png';

const CombinedPasswordResetPage = () => {
  // Form state
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Process state
  const [currentStep, setCurrentStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [tempToken, setTempToken] = useState('');
  
  const navigate = useNavigate();
  const { forgotPassword, verifyOtp, resetPassword } = useAuth();
  
  // Handle email submission
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      setError('Please enter your email address');
      return;
    }
    
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      const result = await forgotPassword(email);
      
      if (result.success) {
        setSuccess('OTP has been sent to your email address');
        setTimeout(() => {
          setCurrentStep(2);
          setSuccess('');
        }, 1500);
      } else {
        setError(result.error || 'Failed to send OTP. Please try again.');
      }
    } catch (error) {
      console.error('Forgot password error:', error);
      setError(error.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };
  
  // Handle OTP verification
  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    
    if (!otp) {
      setError('Please enter the OTP sent to your email');
      return;
    }
    
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      const result = await verifyOtp(email, otp);
      
      if (result.success) {
        setSuccess('OTP verified successfully!');
        setTempToken(result.tempToken);
        setTimeout(() => {
          setCurrentStep(3);
          setSuccess('');
        }, 1500);
      } else {
        setError(result.error || 'Failed to verify OTP. Please try again.');
      }
    } catch (error) {
      console.error('Verify OTP error:', error);
      setError(error.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };
  
  // Handle password reset
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
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
    
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      const result = await resetPassword(email, tempToken, password);
      
      if (result.success) {
        setSuccess('Password reset successful! You will be redirected to login.');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
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
        duration: 0.3
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.3 } }
  };
  
  // Determine title and description based on current step
  const getStepTitle = () => {
    switch(currentStep) {
      case 1: return "Forgot Password";
      case 2: return "Verify OTP";
      case 3: return "Reset Password";
      default: return "Password Reset";
    }
  };
  
  const getStepDescription = () => {
    switch(currentStep) {
      case 1: return "Enter your email to receive a verification code";
      case 2: return "Enter the OTP sent to your email";
      case 3: return "Create a new password for your account";
      default: return "";
    }
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
          {getStepTitle()}
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          {getStepDescription()}
        </p>
        
        {/* Step indicator */}
        <div className="flex justify-center mt-6">
          <div className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 1 ? 'bg-purple-600 text-white' : 'bg-gray-300 text-gray-600'}`}>
              1
            </div>
            <div className={`w-10 h-1 ${currentStep >= 2 ? 'bg-purple-600' : 'bg-gray-300'}`}></div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 2 ? 'bg-purple-600 text-white' : 'bg-gray-300 text-gray-600'}`}>
              2
            </div>
            <div className={`w-10 h-1 ${currentStep >= 3 ? 'bg-purple-600' : 'bg-gray-300'}`}></div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 3 ? 'bg-purple-600 text-white' : 'bg-gray-300 text-gray-600'}`}>
              3
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div 
        className="mt-8 sm:mx-auto sm:w-full sm:max-w-md"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="bg-white py-8 px-6 shadow sm:rounded-lg sm:px-10">
          {/* Email form - Step 1 */}
          {currentStep === 1 && (
            <motion.form 
              className="space-y-6" 
              onSubmit={handleEmailSubmit}
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
                    autoComplete="email"
                    required
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </motion.div>

              {/* Button */}
              <motion.div variants={itemVariants}>
                <button
                style={{marginTop: '0.5rem'}}
                  type="submit"
                  disabled={loading}
                  className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {loading ? 'Sending...' : 'Send Verification Code'}
                </button>
              </motion.div>
            </motion.form>
          )}

          {/* OTP form - Step 2 */}
          {currentStep === 2 && (
            <motion.form 
              className="space-y-6" 
              onSubmit={handleOtpSubmit}
              variants={containerVariants}
            >
              <motion.div variants={itemVariants}>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <div className="mt-1">
                  <input
                    id="email-display"
                    type="email"
                    disabled
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                    value={email}
                  />
                </div>
              </motion.div>

              <motion.div variants={itemVariants}>
                <label htmlFor="otp" className="block text-sm font-medium text-gray-700">
                  One-Time Password (OTP)
                </label>
                <div className="mt-1">
                  <input
                    id="otp"
                    name="otp"
                    type="text"
                    required
                    autoComplete="off"
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="Enter 6-digit OTP"
                    maxLength={6}
                  />
                </div>
              </motion.div>

              {/* Button */}
              <motion.div variants={itemVariants}>
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {loading ? 'Verifying...' : 'Verify OTP'}
                </button>
              </motion.div>
              
              <motion.div 
                className="text-center mt-4"
                variants={itemVariants}
              >
                <button 
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="text-sm text-purple-600 hover:text-purple-500 font-medium"
                >
                  Didn't receive OTP? Go back
                </button>
              </motion.div>
            </motion.form>
          )}

          {/* Password reset form - Step 3 */}
          {currentStep === 3 && (
            <motion.form 
              className="space-y-6" 
              onSubmit={handlePasswordSubmit}
              variants={containerVariants}
            >
              <motion.div variants={itemVariants}>
                <label htmlFor="email-display" className="block text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <div className="mt-1">
                  <input
                    id="email-display-reset"
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

              {/* Button */}
              <motion.div variants={itemVariants}>
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {loading ? 'Resetting...' : 'Reset Password'}
                </button>
              </motion.div>
            </motion.form>
          )}

          {/* Error and success messages */}
          {error && (
            <div 
              className="mt-4 text-red-500 text-sm"
            >
              {error}
            </div>
          )}
          
          {success && (
            <div 
              className="mt-4 text-green-500 text-sm"
            >
              {success}
            </div>
          )}
          
          {/* Back to login link */}
          <div className="text-center mt-6">
            <Link 
              to="/login" 
              className="text-sm text-purple-600 hover:text-purple-500 font-medium"
            >
              Back to Login
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default CombinedPasswordResetPage; 