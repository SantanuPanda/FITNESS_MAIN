import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import logoImage from '../assets/logo.png';

const VerifyOtpPage = () => {
  const [otp, setOtp] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const navigate = useNavigate();
  const location = useLocation();
  const { verifyOtp } = useAuth();
  
  // Get email from location state
  useEffect(() => {
    if (location.state && location.state.email) {
      setEmail(location.state.email);
    }
  }, [location]);
  
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!otp) {
      setError('Please enter the OTP sent to your email');
      return;
    }
    
    if (!email) {
      setError('Email address is missing. Please go back to the forgot password page.');
      return;
    }
    
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      const result = await verifyOtp(email, otp);
      
      if (result.success) {
        setSuccess('OTP verified successfully! You will be redirected to reset your password.');
        
        // Redirect to reset password page
        setTimeout(() => {
          navigate('/reset-password', { 
            state: { 
              email,
              tempToken: result.tempToken
            } 
          });
        }, 2000);
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
          Verify OTP
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Enter the OTP sent to your email
        </p>
      </motion.div>

      <motion.div 
        className="mt-8 sm:mx-auto sm:w-full sm:max-w-md"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="bg-white py-8 px-6 shadow sm:rounded-lg sm:px-10">
          <motion.form 
            className="space-y-6" 
            onSubmit={handleVerifyOtp}
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
                  required
                  disabled
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                {loading ? 'Verifying...' : 'Verify OTP'}
              </button>
            </motion.div>
            
            <motion.div 
              className="text-center mt-4"
              variants={itemVariants}
            >
              <Link 
                to="/forgot-password" 
                className="text-sm text-purple-600 hover:text-purple-500 font-medium"
              >
                Didn't receive OTP? Try again
              </Link>
            </motion.div>
          </motion.form>
        </div>
      </motion.div>
    </div>
  );
};

export default VerifyOtpPage; 