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
  const [showPassword, setShowPassword] = useState(false);
  
  // States for the multi-step password reset process
  const [resetStep, setResetStep] = useState(1); // 1: Email, 2: OTP, 3: New Password, 4: Success
  const [resetOtp, setResetOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
  const [tempToken, setTempToken] = useState('');
  
  const navigate = useNavigate();
  const { login, forgotPassword, resetPassword, verifyOtp } = useAuth();

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
    setSuccess('Signing in...');
    
    try {
      const result = await login(email, password);
      
      if (result.success) {
        setSuccess('Login successful! Redirecting to Home...');
        setTimeout(() => {
          navigate('/');
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
      // Call the backend API to send OTP
      const result = await forgotPassword(forgotPasswordEmail);
      
      if (result.success) {
        setForgotPasswordMessage('A verification code has been sent to your email.');
        setResetStep(2); // Move to OTP verification step
      } else {
        setForgotPasswordError(result.error || 'Failed to send verification code. Please try again.');
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

  const handleOtpVerification = async (e) => {
    e.preventDefault();
    
    if (!resetOtp) {
      setForgotPasswordError('Please enter the verification code');
      return;
    }
    
    setLoading(true);
    setForgotPasswordError('');
    
    try {
      // Verify OTP with backend
      const result = await verifyOtp(forgotPasswordEmail, resetOtp, 'password-reset');
      
      if (result.success) {
        setForgotPasswordMessage('Code verified successfully. Set your new password.');
        setTempToken(result.tempToken);
        setResetStep(3); // Move to new password step
      } else {
        setForgotPasswordError(result.error || 'Invalid verification code. Please try again.');
      }
    } catch (error) {
      console.error('OTP verification error:', error);
      setForgotPasswordError(error.message || 'Failed to verify code');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    
    if (!newPassword) {
      setForgotPasswordError('Please enter a new password');
      return;
    }
    
    if (newPassword.length < 6) {
      setForgotPasswordError('Password must be at least 6 characters long');
      return;
    }
    
    if (newPassword !== confirmNewPassword) {
      setForgotPasswordError('Passwords do not match');
      return;
    }
    
    setLoading(true);
    setForgotPasswordError('');
    
    try {
      // Call backend to reset password with temp token
      const result = await resetPassword(forgotPasswordEmail, tempToken, newPassword);
      
      if (result.success) {
        setForgotPasswordMessage('Your password has been reset successfully!');
        setResetStep(4); // Move to success step
        
        // Auto close after 3 seconds on success
        setTimeout(() => {
          resetPasswordModal();
        }, 3000);
      } else {
        setForgotPasswordError(result.error || 'Failed to reset password. Please try again.');
      }
    } catch (error) {
      console.error('Password reset error:', error);
      setForgotPasswordError(error.message || 'Failed to reset password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetPasswordModal = () => {
    // Reset all password reset related states
    setShowForgotPassword(false);
    setForgotPasswordEmail('');
    setForgotPasswordMessage('');
    setForgotPasswordError('');
    setResetStep(1);
    setResetOtp('');
    setNewPassword('');
    setConfirmNewPassword('');
    setTempToken('');
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
              type={showPassword ? "text" : "password"}
              className="w-full pl-10 pr-12 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              whileFocus={{ scale: 1.01, boxShadow: "0 4px 10px -3px rgba(0, 0, 0, 0.1)" }}
            />
            <div 
              className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <svg className="w-5 h-5 text-gray-500 hover:text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-gray-500 hover:text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              )}
            </div>
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
              <button 
                type="button"
                onClick={() => setShowForgotPassword(true)}
                className="font-medium text-purple-600 hover:text-purple-500 bg-transparent border-none cursor-pointer"
              >
                Forgot your password?
              </button>
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
            onClick={() => resetPasswordModal()}
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
                onClick={() => resetPasswordModal()}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              
              <h3 className="text-2xl font-bold text-purple-600 mb-6">
                {resetStep === 1 && "Reset Your Password"}
                {resetStep === 2 && "Verify Your Email"}
                {resetStep === 3 && "Create New Password"}
                {resetStep === 4 && "Password Reset Complete"}
              </h3>
              
              {resetStep === 1 && (
                <>
              <p className="text-gray-600 mb-6">
                    Enter your email address and we'll send you a verification code to reset your password.
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
                      </div>
                    )}
                    
                    <button
                      type="submit"
                      className={`w-full py-2.5 px-4 text-white bg-purple-600 hover:bg-purple-700 rounded-md transition-all duration-200 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                      disabled={loading}
                    >
                      {loading ? 'Sending...' : 'Send Verification Code'}
                    </button>
                  </form>
                </>
              )}
              
              {resetStep === 2 && (
                <>
                  <p className="text-gray-600 mb-6">
                    We've sent a verification code to <span className="font-medium">{forgotPasswordEmail}</span>. 
                    Please enter the code below.
                  </p>
                  
                  <form onSubmit={handleOtpVerification}>
                    <div className="mb-4">
                      <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-1">
                        Verification Code
                      </label>
                      <input
                        type="text"
                        id="otp"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        placeholder="Enter 6-digit code"
                        value={resetOtp}
                        onChange={(e) => {
                          const value = e.target.value;
                          // Only allow digits and limit to 6 characters
                          if (/^\d*$/.test(value) && value.length <= 6) {
                            setResetOtp(value);
                            setForgotPasswordError('');
                          }
                        }}
                        maxLength={6}
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
                      </div>
                    )}
                    
                    <div className="flex flex-col space-y-3">
                      <button
                        type="submit"
                        className={`w-full py-2.5 px-4 text-white bg-purple-600 hover:bg-purple-700 rounded-md transition-all duration-200 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                        disabled={loading}
                      >
                        {loading ? 'Verifying...' : 'Verify Code'}
                      </button>
                      
                      <button
                        type="button"
                        className="text-sm text-purple-600 hover:text-purple-700 bg-transparent border-none cursor-pointer"
                        onClick={() => {
                          setResetStep(1);
                          setForgotPasswordMessage('');
                          setForgotPasswordError('');
                        }}
                      >
                        Change Email Address
                      </button>
                    </div>
                  </form>
                </>
              )}
              
              {resetStep === 3 && (
                <>
                  <p className="text-gray-600 mb-6">
                    Create a new password for your account. The password should be at least 6 characters long.
                  </p>
                  
                  <form onSubmit={handlePasswordReset}>
                    <div className="mb-4">
                      <label htmlFor="new-password" className="block text-sm font-medium text-gray-700 mb-1">
                        New Password
                      </label>
                      <div className="relative">
                        <input
                          type={showNewPassword ? "text" : "password"}
                          id="new-password"
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 pr-10"
                          placeholder="Enter new password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                        />
                        <div 
                          className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                        >
                          {showNewPassword ? (
                            <svg className="w-5 h-5 text-gray-500 hover:text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                            </svg>
                          ) : (
                            <svg className="w-5 h-5 text-gray-500 hover:text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-1">
                        Confirm New Password
                      </label>
                      <div className="relative">
                        <input
                          type={showConfirmNewPassword ? "text" : "password"}
                          id="confirm-password"
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 pr-10"
                          placeholder="Confirm new password"
                          value={confirmNewPassword}
                          onChange={(e) => setConfirmNewPassword(e.target.value)}
                        />
                        <div 
                          className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
                          onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)}
                        >
                          {showConfirmNewPassword ? (
                            <svg className="w-5 h-5 text-gray-500 hover:text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                            </svg>
                          ) : (
                            <svg className="w-5 h-5 text-gray-500 hover:text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {/* Password strength indicator could be added here */}
                    
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
                  </div>
                )}
                
                <button
                  type="submit"
                  className={`w-full py-2.5 px-4 text-white bg-purple-600 hover:bg-purple-700 rounded-md transition-all duration-200 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                  disabled={loading}
                >
                      {loading ? 'Resetting Password...' : 'Reset Password'}
                </button>
              </form>
                </>
              )}
              
              {resetStep === 4 && (
                <div className="text-center">
                  <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
                    <svg className="h-10 w-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  
                  <p className="text-gray-600 mb-6">
                    Your password has been reset successfully! You can now log in with your new password.
                  </p>
                  
                  <button
                    type="button"
                    className="w-full py-2.5 px-4 text-white bg-purple-600 hover:bg-purple-700 rounded-md transition-all duration-200"
                    onClick={() => resetPasswordModal()}
                  >
                    Back to Login
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default LoginComponent;
