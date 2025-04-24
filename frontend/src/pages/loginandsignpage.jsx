import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LoginComponent from '../components/loginandsignup/LoginComponent';
import SignUpComponent from '../components/loginandsignup/SignUpComponent';

const LoginAndSignPage = () => {
  const [isSignUp, setIsSignUp] = useState(false);

  const toggleForm = () => {
    setIsSignUp(!isSignUp);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
      <AnimatePresence mode="wait">
        {isSignUp ? (
          <motion.div
            key="signup"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col lg:flex-row min-h-[600px] max-w-5xl mx-auto rounded-xl overflow-hidden shadow-2xl"
          >
            <SignUpComponent onToggleForm={toggleForm} />
          </motion.div>
        ) : (
          <motion.div
            key="login"
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col lg:flex-row min-h-[600px] max-w-5xl mx-auto rounded-xl overflow-hidden shadow-2xl"
          >
            <LoginComponent onToggleForm={toggleForm} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LoginAndSignPage;
