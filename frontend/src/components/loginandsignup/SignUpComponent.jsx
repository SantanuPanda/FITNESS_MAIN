import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import logoImage from '../../assets/logo.png';


const SignUpComponent = ({ onToggleForm }) => {
  // State for form fields and OTP verification
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [userType, setUserType] = useState('');
  const [showOtpVerification, setShowOtpVerification] = useState(false);
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [resendDisabled, setResendDisabled] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const recaptchaRef = useRef(null);
  const otpInputRef = useRef(null);
  
  // Generated OTP for demo purposes (in production this would be server-side)
  const [generatedOtp, setGeneratedOtp] = useState('');

  const navigate = useNavigate();
  const { signup } = useAuth();

  // Timer for OTP resend
  useEffect(() => {
    let interval;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer(prev => prev - 1);
      }, 1000);
    } else {
      setResendDisabled(false);
    }
    
    return () => clearInterval(interval);
  }, [resendTimer]);

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

  const handleCaptchaChange = (value) => {
    setCaptchaVerified(!!value);
    setError('');
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!name || !email || !password || !userType) {
      setError('Please fill in all fields');
      return;
    }
    
    if (!captchaVerified) {
      setError('Please verify that you are human');
      return;
    }
    
    sendOTP();
  };
  
  // Send OTP to user's email
  const sendOTP = () => {
    setLoading(true);
    setError('');
    setSuccess('');
    
    // Simulate API call to send OTP
    setTimeout(() => {
      // For demo purposes, generate a random 6-digit OTP
      const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
      console.log('Generated OTP:', newOtp); // For testing only
      setGeneratedOtp(newOtp);
      
      setShowOtpVerification(true);
      setSuccess('A verification code has been sent to your email');
      setLoading(false);
      setResendDisabled(true);
      setResendTimer(60); // 60 seconds cooldown before resend
      
      // Focus on OTP input field
      setTimeout(() => {
        otpInputRef.current?.focus();
      }, 300);
    }, 1500);
  };
  
  // Handle OTP verification
  const verifyOtp = () => {
    if (!otp || otp.length !== 6) {
      setOtpError('Please enter a valid 6-digit code');
      return;
    }
    
    setLoading(true);
    setError('');
    
    // Simulate OTP verification (in production, you'd verify against your backend)
    setTimeout(() => {
      // For testing, accept any 6-digit code for now
      // In production, you'd compare against the actual sent OTP
      if (process.env.NODE_ENV === 'development' || otp === generatedOtp) {
        setSuccess('Email verified successfully! Your account has been created.');
        setLoading(false);
        
        // Here you would typically redirect the user or show a success screen
        // For demo purpose, we'll just reset the form after 3 seconds
        setTimeout(() => {
          setShowOtpVerification(false);
          setName('');
          setEmail('');
          setPassword('');
          setUserType('');
          setOtp('');
          setSuccess('');
          setCaptchaVerified(false);
          if (recaptchaRef.current) {
            recaptchaRef.current.reset();
          }
        }, 3000);
      } else {
        setError('Invalid verification code. Please try again.');
        setLoading(false);
      }
    }, 1500);
  };
  
  // Handle resend OTP
  const handleResendOtp = () => {
    if (resendDisabled) return;
    setOtp('');
    sendOTP();
  };
  
  // Handle OTP input change
  const handleOtpChange = (e) => {
    const value = e.target.value;
    // Only allow digits and limit to 6 characters
    if (/^\d*$/.test(value) && value.length <= 6) {
      setOtp(value);
      setError('');
    }
  };

  // Set error specific to OTP verification
  const setOtpError = (message) => {
    setError(message);
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!name) {
      setError('Please enter your name');
      return;
    }
    
    if (!email) {
      setError('Please enter your email');
      return;
    }
    
    if (!password) {
      setError('Please enter a password');
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
    
    if (!userType) {
      setError('Please select a user type');
      return;
    }
    
    setLoading(true);
    setError('');
    setSuccess('Creating your account...');
    
    try {
      const result = await signup(email, password, {
        name,
        userType
      });
      
      if (result.success) {
        setSuccess('Account created successfully! Redirecting to login...');
        setTimeout(() => {
          onToggleForm();
        }, 2000);
      } else {
        setError(result.error || 'Error creating account. Please try again.');
        setSuccess('');
      }
    } catch (error) {
      console.error('Signup error:', error);
      setError(error.message || 'An unexpected error occurred');
      setSuccess('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Left Side - Welcome Message */}
      <motion.div 
        className="w-full lg:w-2/5 bg-gradient-to-br from-purple-600 to-blue-600 p-12 flex flex-col justify-center items-start text-white relative"
        initial={{ x: -50, opacity: 0 }}
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
            Create Account
          </motion.h2>
          <motion.p 
            className="text-lg mb-12 text-blue-100 leading-relaxed"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            Join our fitness community and start tracking your progress. Sign up to access personalized workout plans and nutrition guidance.
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
            SIGN IN
          </motion.button>
        </div>
      </motion.div>

      {/* Right Side - Sign Up Form */}
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
          Sign Up
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
          <span className="px-4 text-gray-500 text-sm">Sign up with email:</span>
          <span className="h-px bg-gray-300 w-full max-w-[100px]"></span>
        </motion.div>
        
        {/* Form fields */}
        <motion.form 
          className="space-y-6"
          variants={containerVariants}
          onSubmit={handleSignUp}
        >
          <motion.div 
            className="relative"
            variants={itemVariants}
            transition={{ duration: 0.4 }}
            style={{ marginBottom: "1rem" }}
            
          >
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
            </div>
            <motion.input
              type="text"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
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
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              whileFocus={{ scale: 1.01, boxShadow: "0 4px 10px -3px rgba(0, 0, 0, 0.1)" }}
            />
          </motion.div>
          
          {/* User Type Selection */}
          <motion.div 
            className="space-y-3"
            variants={itemVariants}
            transition={{ duration: 0.4 }}
          >
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select User Type <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { id: 'athlete', label: 'Athlete', icon: 'M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122' },
                { id: 'coach', label: 'Coach', icon: 'M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z' },
                { id: 'nutritionist', label: 'Nutritionist', icon: 'M21 15.75c-3.75-1.5-6-4.5-6-10.5M3 15.75c3.75-1.5 6-4.5 6-10.5M10.5 19.5c2.25 0 4.5-1.5 5.25-4.5M10.5 19.5c-2.25 0-4.5-1.5-5.25-4.5' }
              ].map(type => (
                <motion.div 
                  key={type.id}
                  className={`cursor-pointer p-4 rounded-lg border-2 transition-all shadow-sm hover:shadow-md ${
                    userType === type.id 
                      ? 'border-purple-500 bg-purple-50 shadow-md' 
                      : 'border-gray-200 hover:border-purple-300'
                  }`}
                  onClick={() => setUserType(type.id)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex flex-col items-center space-y-2">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      userType === type.id ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-500'
                    }`}>
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        strokeWidth={1.5} 
                        stroke="currentColor" 
                        className="w-6 h-6"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d={type.icon} />
                      </svg>
                    </div>
                    <span className={`font-medium text-sm ${userType === type.id ? 'text-purple-700' : 'text-gray-700'}`}>
                      {type.label}
                    </span>
                    <div className={`h-1.5 w-1.5 rounded-full ${
                      userType === type.id ? 'bg-purple-500' : 'bg-transparent'
                    }`}></div>
                  </div>
                </motion.div>
              ))}
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
            className="w-full bg-purple-600 text-white py-2 px-4 rounded-full hover:bg-purple-700 transition-colors font-medium mt-4"
            variants={itemVariants}
            transition={{ duration: 0.4 }}
            whileHover={{ 
              scale: 1.02,
              boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)"
            }}
            whileTap={{ scale: 0.98 }}
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating Account...
              </div>
            ) : 'SIGN UP'}
          </motion.button>
        </motion.form>
      </motion.div>
    </>
  );
};

export default SignUpComponent; 