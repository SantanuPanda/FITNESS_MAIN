import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const recaptchaRef = useRef(null);
  const otpInputRef = useRef(null);
  
  // Password requirements states
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [passwordRequirements, setPasswordRequirements] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false
  });
  
  // Generated OTP for demo purposes (in production this would be server-side)
  const [generatedOtp, setGeneratedOtp] = useState('');

  const navigate = useNavigate();
  const { signup } = useAuth();

  // Function to check password requirements
  const checkPasswordRequirements = (password) => {
    const requirements = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[^A-Za-z0-9]/.test(password)
    };
    
    setPasswordRequirements(requirements);
    return requirements;
  };

  // Calculate password strength
  const calculatePasswordStrength = () => {
    if (password.length === 0) return 0;
    
    // Count how many requirements are met
    const metCount = Object.values(passwordRequirements).filter(Boolean).length;
    
    // Calculate percentage (0 to 100)
    return (metCount / 5) * 100;
  };

  // Get strength text and color
  const getStrengthInfo = () => {
    const strength = calculatePasswordStrength();
    
    if (strength === 0) return { text: 'Very Weak', color: 'bg-gray-200' };
    if (strength <= 20) return { text: 'Very Weak', color: 'bg-red-500' };
    if (strength <= 40) return { text: 'Weak', color: 'bg-orange-500' };
    if (strength <= 60) return { text: 'Medium', color: 'bg-yellow-500' };
    if (strength <= 80) return { text: 'Strong', color: 'bg-blue-500' };
    return { text: 'Very Strong', color: 'bg-green-500' };
  };

  // Check password requirements whenever password changes
  useEffect(() => {
    checkPasswordRequirements(password);
  }, [password]);

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
  const sendOTP = async () => {
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      // Call the backend API to send verification OTP
      const response = await fetch(`${import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/auth` : 'http://localhost:5000/api/auth'}/send-verification-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setShowOtpVerification(true);
        setSuccess('A verification code has been sent to your email');
        setResendDisabled(true);
        setResendTimer(60); // 60 seconds cooldown before resend
        
        // Focus on OTP input field
        setTimeout(() => {
          otpInputRef.current?.focus();
        }, 300);
      } else {
        setError(data.message || 'Failed to send verification code');
      }
    } catch (error) {
      console.error('Error sending OTP:', error);
      setError('Failed to send verification code. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  // Handle OTP verification
  const verifyOtp = async () => {
    if (!otp || otp.length !== 6) {
      setError('Please enter a valid 6-digit code');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      // Call the backend API to verify the OTP
      const response = await fetch(`${import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/auth` : 'http://localhost:5000/api/auth'}/verify-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email, 
          otp,
          purpose: 'verification'
        }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setSuccess('Email verified successfully! Creating your account...');
        
        // Now proceed with account creation
        try {
          const signupResult = await signup(email, password, {
            name,
            userType
          });
          
          if (signupResult.success) {
            setSuccess('Account created successfully! Redirecting to login...');
            setTimeout(() => {
              onToggleForm();
            }, 2000);
          } else {
            setError(signupResult.error || 'Error creating account. Please try again.');
          }
        } catch (signupError) {
          console.error('Signup error:', signupError);
          setError(signupError.message || 'An unexpected error occurred');
        }
      } else {
        setError(data.message || 'Invalid verification code. Please try again.');
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      setError('Failed to verify code. Please try again.');
    } finally {
      setLoading(false);
    }
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
    
    // Check password requirements
    const requirements = checkPasswordRequirements(password);
    const allRequirementsMet = Object.values(requirements).every(req => req);
    
    if (!allRequirementsMet) {
      setError('Password does not meet all requirements');
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
    
    // If OTP verification is already showing, verify the OTP
    if (showOtpVerification) {
      verifyOtp();
      return;
    }
    
    // Otherwise, send OTP for verification
    sendOTP();
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
              type={showPassword ? "text" : "password"}
              className="w-full pl-10 pr-12 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setPasswordFocused(true)}
              onBlur={() => setPasswordFocused(false)}
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
          
          {/* Password requirements indicator */}
          {(passwordFocused || password.length > 0) && (
            <motion.div 
              className="mb-4 p-3 bg-gray-50 border border-gray-200 rounded-md text-sm"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <p className="font-medium text-gray-700 mb-2">Password must contain:</p>
              <ul className="space-y-1">
                <li className={`flex items-center ${passwordRequirements.length ? 'text-green-600' : 'text-gray-600'}`}>
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {passwordRequirements.length ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    )}
                  </svg>
                  At least 8 characters
                </li>
                <li className={`flex items-center ${passwordRequirements.uppercase ? 'text-green-600' : 'text-gray-600'}`}>
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {passwordRequirements.uppercase ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    )}
                  </svg>
                  At least one uppercase letter (A-Z)
                </li>
                <li className={`flex items-center ${passwordRequirements.lowercase ? 'text-green-600' : 'text-gray-600'}`}>
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {passwordRequirements.lowercase ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    )}
                  </svg>
                  At least one lowercase letter (a-z)
                </li>
                <li className={`flex items-center ${passwordRequirements.number ? 'text-green-600' : 'text-gray-600'}`}>
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {passwordRequirements.number ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    )}
                  </svg>
                  At least one number (0-9)
                </li>
                <li className={`flex items-center ${passwordRequirements.special ? 'text-green-600' : 'text-gray-600'}`}>
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {passwordRequirements.special ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    )}
                  </svg>
                  At least one special character (!@#$%^&*, etc.)
                </li>
              </ul>
              
              {/* Password strength indicator */}
              {password.length > 0 && (
                <div className="mt-4">
                  <div className="flex justify-between mb-1">
                    <span className="text-xs font-medium text-gray-700">Strength: </span>
                    <span className={`text-xs font-medium ${
                      calculatePasswordStrength() <= 40 ? 'text-red-700' : 
                      calculatePasswordStrength() <= 60 ? 'text-yellow-700' : 
                      calculatePasswordStrength() <= 80 ? 'text-blue-700' : 
                      'text-green-700'
                    }`}>
                      {getStrengthInfo().text}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div 
                      className={`${getStrengthInfo().color} h-1.5 rounded-full transition-all duration-300 ease-in-out`}
                      style={{ width: `${calculatePasswordStrength()}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </motion.div>
          )}
          
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
              type={showConfirmPassword ? "text" : "password"}
              className="w-full pl-10 pr-12 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              whileFocus={{ scale: 1.01, boxShadow: "0 4px 10px -3px rgba(0, 0, 0, 0.1)" }}
            />
            <div 
              className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? (
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

          {/* OTP Verification Field (conditionally rendered) */}
          {showOtpVerification && (
            <motion.div 
              className="mb-6 p-4 bg-blue-50 border border-blue-100 rounded-lg"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-center mb-4">
                <h3 className="text-md font-medium text-blue-800">Verify Your Email</h3>
                <p className="text-sm text-blue-600 mt-1">
                  Enter the 6-digit code sent to <span className="font-medium">{email}</span>
                </p>
              </div>
              
              <div className="mb-4">
                <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-1">
                  Verification Code
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 2a1 1 0 00-1 1v1a1 1 0 002 0V3a1 1 0 00-1-1zM4 4h3a3 3 0 006 0h3a2 2 0 012 2v9a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2zm2.5 7a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm2.45 4a2.5 2.5 0 10-4.9 0h4.9zM12 9a1 1 0 100 2h3a1 1 0 100-2h-3zm-1 4a1 1 0 011-1h2a1 1 0 110 2h-2a1 1 0 01-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    id="otp"
                    ref={otpInputRef}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-center tracking-widest text-lg"
                    placeholder="• • • • • •"
                    maxLength={6}
                    value={otp}
                    onChange={handleOtpChange}
                  />
                </div>
              </div>
              
              <div className="flex justify-between items-center text-sm">
                <button
                  type="button"
                  className="text-blue-600 hover:text-blue-800 font-medium"
                  onClick={() => {
                    if (resendDisabled) return;
                    setOtp('');
                    sendOTP();
                  }}
                  disabled={resendDisabled}
                >
                  {resendDisabled 
                    ? `Resend Code (${resendTimer}s)` 
                    : 'Resend Code'}
                </button>
                
                <button
                  type="button" 
                  className="bg-blue-600 text-white py-1 px-4 rounded hover:bg-blue-700 transition-colors"
                  onClick={verifyOtp}
                >
                  Verify
                </button>
              </div>
            </motion.div>
          )}

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
            disabled={loading || showOtpVerification}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {showOtpVerification ? 'Verifying...' : 'Creating Account...'}
              </div>
            ) : (showOtpVerification ? 'Enter Verification Code Above' : 'SIGN UP')}
          </motion.button>
        </motion.form>
      </motion.div>
    </>
  );
};

export default SignUpComponent; 