import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import logoImage from '../../assets/logo.png';

const LoginComponent = ({ onToggleForm }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  const [forgotPasswordMessage, setForgotPasswordMessage] = useState('');
  const [forgotPasswordError, setForgotPasswordError] = useState('');
  
  const navigate = useNavigate();
  const { login, forgotPassword } = useAuth();

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
  
  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { type: "spring", stiffness: 300, damping: 30 }
    },
    exit: { opacity: 0, scale: 0.8 }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!email) {
      setError('Please enter your email');
      return;
    }
    
    if (!password) {
      setError('Please enter your password');
      return;
    }
    
    setLoading(true);
    setError('');
    setSuccess('Logging in...');
    
    try {
      const result = await login(email, password);
      
      if (result.success) {
        setSuccess('Login successful! Redirecting...');
        setTimeout(() => {
          navigate('/dashboard');
        }, 1000);
      } else {
        setError(result.error || 'Invalid email or password');
        setSuccess('');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError(error.message || 'An unexpected error occurred');
      setSuccess('');
    } finally {
      setLoading(false);
    }
  };
  
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    
    if (!forgotPasswordEmail) {
      setForgotPasswordError('Please enter your email');
      return;
    }
    
    setLoading(true);
    setForgotPasswordError('');
    setForgotPasswordMessage('Processing your request...');
    
    try {
      const result = await forgotPassword(forgotPasswordEmail);
      
      if (result.success) {
        // Create message with preview link if available
        let message = result.message || 'Password reset instructions sent to your email';
        
        // If preview URL is available (for development), show it
        if (result.previewUrl) {
          message = `${message} You can view the email here: `;
        }
        
        setForgotPasswordMessage(message);
        
        // If preview URL is available, render it as clickable link
        if (result.previewUrl) {
          // Wait for state to update before adding the link to prevent losing it
          setTimeout(() => {
            const linkContainer = document.getElementById('preview-link-container');
            if (linkContainer) {
              const link = document.createElement('a');
              link.href = result.previewUrl;
              link.target = '_blank';
              link.rel = 'noopener noreferrer';
              link.textContent = 'Open Email Preview';
              link.className = 'text-purple-600 hover:text-purple-700 underline';
              linkContainer.appendChild(link);
            }
          }, 100);
        }
        
        // Clear form after 5 seconds and close modal only if no preview URL
        // If preview URL is present, let user manually close to see the link
        if (!result.previewUrl) {
          setTimeout(() => {
            setForgotPasswordEmail('');
            setForgotPasswordMessage('');
            setShowForgotPassword(false);
          }, 5000);
        }
      } else {
        setForgotPasswordError(result.error || 'Error processing your request');
        setForgotPasswordMessage('');
      }
    } catch (error) {
      console.error('Forgot password error:', error);
      setForgotPasswordError(error.message || 'An unexpected error occurred');
      setForgotPasswordMessage('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Right Side - Welcome Message */}
      <motion.div 
        className="w-full lg:w-2/5 bg-gradient-to-br from-blue-600 to-purple-600 p-12 flex flex-col justify-center items-start text-white relative"
        initial={{ x: 50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ 
          duration: 0.6, 
          ease: "easeOut" 
        }}
      >
        {/* Logo */}
        <motion.div 
          className="absolute top-8 left-8"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <div className="flex items-center">
            <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded flex items-center justify-center">
              <img src={logoImage} alt="Fitness Logo" className="w-5 h-5" />
            </div>
            <span className="ml-2 text-sm font-medium">Fitness</span>
          </div>
        </motion.div>
        
        {/* Decorative elements */}
        <div className="pt-20">
          <motion.h2 
            className="text-4xl font-bold mb-6 text-white"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            Welcome Back!
          </motion.h2>
          <motion.p 
            className="text-lg mb-12 text-blue-100 leading-relaxed"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            Ready to continue your fitness journey? Sign in to access your personalized dashboard.
          </motion.p>
          <motion.button 
            onClick={onToggleForm} 
            className="px-10 py-3 border-2 border-white rounded-full text-white font-medium transition-all hover:bg-white hover:text-purple-600 uppercase tracking-wide text-sm"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            whileHover={{ 
              scale: 1.05, 
              boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)"
            }}
            whileTap={{ scale: 0.95 }}
          >
            CREATE ACCOUNT
          </motion.button>
        </div>
      </motion.div>

      {/* Left Side - Login Form */}
      <motion.div 
        className="w-full lg:w-3/5 bg-white p-12 flex flex-col justify-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h2 
          className="text-3xl font-bold text-purple-600 mb-6 text-center"
          variants={itemVariants}
          transition={{ duration: 0.5 }}
        >
          Sign In
        </motion.h2>
        
        {/* Logo display (non-functional) */}
        <motion.div 
          className="flex justify-center mb-6"
          variants={itemVariants}
          transition={{ duration: 0.4 }}
        >
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center shadow-sm">
              <img src={logoImage} alt="Fitness Logo" className="w-10 h-10" />
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="flex items-center justify-center mb-6"
          variants={itemVariants}
          transition={{ duration: 0.4 }}
        >
          <span className="h-px bg-gray-300 w-full max-w-[100px]"></span>
          <span className="px-4 text-gray-500 text-sm">Sign in with email:</span>
          <span className="h-px bg-gray-300 w-full max-w-[100px]"></span>
        </motion.div>
        
        {/* Form fields */}
        <motion.form 
          className="space-y-6"
          variants={containerVariants}
          onSubmit={handleLogin}
        >
          <motion.div 
            className="relative"
            variants={itemVariants}
            transition={{ duration: 0.4 }}
            style={{ marginBottom: "1rem" }}
          >
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
            </div>
            <motion.input
              type="email"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              whileFocus={{ scale: 1.01, boxShadow: "0 4px 10px -3px rgba(0, 0, 0, 0.1)" }}
            />
          </motion.div>
          
          <motion.div 
            className="relative"
            variants={itemVariants}
            transition={{ duration: 0.4 }}
            style={{ marginBottom: "1rem" }}
          >
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
            </div>
            <motion.input
              type="password"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              whileFocus={{ scale: 1.01, boxShadow: "0 4px 10px -3px rgba(0, 0, 0, 0.1)" }}
            />
          </motion.div>
          
          <motion.div 
            className="flex items-center justify-between mt-2"
            variants={itemVariants}
            transition={{ duration: 0.4 }}
          >
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                Remember me
              </label>
            </div>
            <div className="text-sm">
              <Link to="/forgot-password" className="font-medium text-purple-600 hover:text-purple-500">
                Forgot your password?
              </Link>
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

          <motion.button
            type="submit"
            className={`w-full py-3 px-6 mt-4 text-white bg-purple-600 hover:bg-purple-700 rounded-md transition-all duration-200 ease-in-out ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            variants={itemVariants}
            transition={{ duration: 0.4 }}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.95 }}
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </motion.button>
        </motion.form>
      </motion.div>
      
      {/* Forgot Password Modal */}
      <AnimatePresence>
        {showForgotPassword && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowForgotPassword(false)}
          >
            <motion.div
              className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full relative"
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                onClick={() => setShowForgotPassword(false)}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              
              <h3 className="text-2xl font-bold text-purple-600 mb-6">Reset Your Password</h3>
              <p className="text-gray-600 mb-6">
                Enter your email address and we'll send you instructions to reset your password.
              </p>
              
              <form onSubmit={handleForgotPassword}>
                <div className="mb-4">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    placeholder="Enter your email"
                    value={forgotPasswordEmail}
                    onChange={(e) => setForgotPasswordEmail(e.target.value)}
                  />
                </div>
                
                {/* Error message */}
                {forgotPasswordError && (
                  <div className="text-red-500 text-sm mb-4">
                    {forgotPasswordError}
                  </div>
                )}
                
                {/* Success message */}
                {forgotPasswordMessage && (
                  <div className="text-green-500 text-sm mb-4">
                    {forgotPasswordMessage}
                    {/* Container for preview link */}
                    <div id="preview-link-container" className="mt-2"></div>
                  </div>
                )}
                
                <button
                  type="submit"
                  className={`w-full py-2.5 px-4 text-white bg-purple-600 hover:bg-purple-700 rounded-md transition-all duration-200 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                  disabled={loading}
                >
                  {loading ? 'Sending...' : 'Send Reset Instructions'}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default LoginComponent;
