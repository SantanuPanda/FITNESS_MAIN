import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  // Function to redirect to signup page
  const goToSignup = () => {
    navigate('/login', { state: { showSignup: true } });
  };

  // Function to scroll to services section
  const scrollToServices = () => {
    const servicesSection = document.getElementById('services');
    if (servicesSection) {
      // Calculate navbar height for offset
      const navbar = document.querySelector('header');
      const navbarHeight = navbar ? navbar.offsetHeight : 0;
      
      // Calculate position and account for navbar height
      const elementPosition = servicesSection.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navbarHeight;
      
      // Smooth scroll to element
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className="relative min-h-screen overflow-hidden bg-gradient-to-r from-blue-600 to-blue-800 pb-0">
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-900/20 to-blue-950/70 z-10"></div>
      <div className="absolute inset-0 bg-[url('/images/fitness-pattern.svg')] opacity-5 z-0"></div>
      
      {/* Animated shapes */}
      <motion.div 
        animate={{ 
          scale: [1, 1.1, 1],
          opacity: [0.1, 0.15, 0.1] 
        }}
        transition={{ 
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-1/4 left-10 w-64 h-64 rounded-full bg-blue-400 z-0"
      ></motion.div>
      
      <motion.div 
        animate={{ 
          scale: [1, 1.15, 1],
          opacity: [0.1, 0.15, 0.1] 
        }}
        transition={{ 
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
        className="absolute bottom-1/4 right-10 w-80 h-80 rounded-full bg-blue-300 z-0"
      ></motion.div>
      
      {/* Main content */}
      <div className="container mx-auto px-6 pt-24 pb-12 relative z-20">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center justify-center min-h-[80vh] text-center"
        >
          <motion.h4
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="text-blue-200 font-medium tracking-wider uppercase mb-4"
          >
            Transform Your Body & Mind
          </motion.h4>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight"
          >
            Elevate Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-white">Fitness Journey</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.7 }}
            className="text-blue-100 text-xl md:text-2xl max-w-3xl mb-10"
          >
            Personalized workouts, expert trainers, and a supportive community to help you achieve your fitness goals.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.9 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <motion.button
              whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.5)" }}
              whileTap={{ scale: 0.98 }}
              className="px-8 py-4 bg-white text-blue-800 font-bold rounded-lg hover:bg-blue-50 transition-all shadow-lg hover:shadow-xl"
              onClick={goToSignup}
            >
              Start Your Journey
            </motion.button>
            <motion.button
              whileHover={{ y: -5, backgroundColor: "rgba(255, 255, 255, 0.1)" }}
              whileTap={{ scale: 0.98 }}
              className="px-8 py-4 bg-transparent border-2 border-white text-white font-bold rounded-lg hover:bg-white/10 transition-all"
              onClick={scrollToServices}
            >
              Explore Programs
            </motion.button>
          </motion.div>
          
          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 1.1 }}
            className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-12"
          >
            <div className="text-center">
              <h3 className="text-4xl font-bold text-white mb-2">5K+</h3>
              <p className="text-blue-200">Happy Members</p>
            </div>
            <div className="text-center">
              <h3 className="text-4xl font-bold text-white mb-2">15+</h3>
              <p className="text-blue-200">Expert Trainers</p>
            </div>
            <div className="text-center">
              <h3 className="text-4xl font-bold text-white mb-2">50+</h3>
              <p className="text-blue-200">Fitness Programs</p>
            </div>
            <div className="text-center">
              <h3 className="text-4xl font-bold text-white mb-2">24/7</h3>
              <p className="text-blue-200">Support Access</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Home; 