import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
// Use a placeholder logo since the original logo.png is missing
import logo from '../../assets/logo.png';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import * as storage from '../../services/storageService';

// Navigation icon components
const HomeIcon = () => (
  <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
);

const AboutIcon = () => (
  <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const ServicesIcon = () => (
  <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
  </svg>
);

const PricingIcon = () => (
  <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const ContactIcon = () => (
  <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

// Custom NavLink component with enhanced animations and scroll behavior
const NavLink = ({ to, sectionId, children, isScrolled, isActive, index, setActive }) => {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();
  
  const handleClick = (e) => {
    e.preventDefault();
    
    // Immediately set active section when clicked
    setActive(sectionId);
    
    // Special handling for home section
    if (sectionId === 'home') {
      window.scrollTo({ 
        top: 0, 
        behavior: 'smooth',
        // Add a longer duration for smoother scrolling
        duration: 1000
      });
      return;
    }
    
    const section = document.getElementById(sectionId);
    if (section) {
      // Calculate navbar height for offset
      const navbar = document.querySelector('header');
      const navbarHeight = navbar ? navbar.offsetHeight : 0;
      
      // Use scrollIntoView for smoother animation
      section.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
        inline: 'nearest'
      });
      
      // Apply offset for fixed header with a slight delay to ensure smooth animation
      setTimeout(() => {
        const elementPosition = section.getBoundingClientRect().top;
        const offsetPosition = window.pageYOffset + elementPosition - navbarHeight - 10;
        
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }, 50);
    } else {
      // Navigate to the route and then scroll to section if needed
      navigate(to);
    }
  };
  
  return (
    <motion.div
      className="overflow-hidden relative"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
    >
      <Link
        to={to}
        onClick={handleClick}
        className={`nav-link nav-link-shimmer group relative px-3 py-2 text-sm font-medium tracking-wide uppercase transition-all duration-300 flex items-center ${
          isScrolled ? 'text-white hover:text-blue-200' : 'text-white/90 hover:text-white'
        }`}
        aria-current={isActive ? 'page' : undefined}
      >
        {/* Hover bubble effect */}
        <motion.div
          className="absolute inset-0 rounded-lg pointer-events-none"
          initial={false}
          animate={{
            backgroundColor: isHovered 
              ? 'rgba(255, 255, 255, 0.15)' 
              : 'rgba(255, 255, 255, 0)',
            scale: isHovered ? 1 : 0.5,
            opacity: isHovered ? 1 : 0
          }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        />
        
        {/* Pulse animation */}
        <div className="nav-pulse"></div>
        
        {/* Icon and text with subtle lift and glow on hover */}
        <motion.div
          className="flex items-center z-10"
          whileHover={{ y: -2 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          style={{ textShadow: isHovered ? '0 0 8px rgba(255,255,255,0.5)' : 'none' }}
        >
          {children}
        </motion.div>
        
        {/* Animated underline */}
        <motion.span 
          initial={false}
          animate={{ 
            scaleX: isActive ? 1 : 0,
            opacity: isActive ? 1 : 0
          }}
          whileHover={{ scaleX: 1, opacity: 1 }}
          className="absolute left-0 bottom-0 h-0.5 w-full bg-current transform origin-left"
          style={{
            backgroundColor: isScrolled ? 'rgba(255,255,255,0.8)' : 'currentColor'
          }}
        />
        
        {/* Subtle animated particles on hover */}
        {isHovered && (
          <>
            <motion.div
              className="absolute w-1 h-1 rounded-full bg-white/60 nav-particle particle-1"
              animate={{ 
                x: [0, 5, 0], 
                y: [0, -5, 0],
                opacity: [0, 1, 0]
              }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              style={{ top: '30%', right: '15%' }}
            />
            <motion.div
              className="absolute w-1.5 h-1.5 rounded-full bg-white/80 nav-particle particle-2"
              animate={{ 
                x: [0, -7, 0], 
                y: [0, -3, 0],
                opacity: [0, 1, 0]
              }}
              transition={{ repeat: Infinity, duration: 2, delay: 0.3 }}
              style={{ top: '20%', left: '20%' }}
            />
            <motion.div
              className="absolute w-1 h-1 rounded-full bg-white/60 nav-particle particle-3"
              animate={{ 
                x: [0, 4, 0], 
                y: [0, 4, 0],
                opacity: [0, 1, 0]
              }}
              transition={{ repeat: Infinity, duration: 1.8, delay: 0.5 }}
              style={{ bottom: '30%', left: '30%' }}
            />
          </>
        )}
      </Link>
    </motion.div>
  );
};

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const navRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const userMenuRef = useRef(null);
  const { currentUser, logout } = useAuth();

  // Fetch user data when currentUser changes
  useEffect(() => {
    const fetchUserData = async () => {
      if (!currentUser) return;
      
      try {
        const result = await storage.getUserData(currentUser.uid);
        if (result.success) {
          setUserData(result.data);
        }
      } catch (error) {
        console.error('Error fetching user data in Navbar:', error);
      }
    };
    
    fetchUserData();
  }, [currentUser, location]); // Re-fetch when location changes (user might have updated profile)

  // Handle scroll events with throttling for better performance
  useEffect(() => {
    let lastScrollTime = 0;
    const throttleWait = 10; // 10ms throttle 
    let scrollAnimationFrameId = null;
    
    const handleScroll = () => {
      const now = Date.now();
      if (now - lastScrollTime >= throttleWait) {
        lastScrollTime = now;
        
        // Use requestAnimationFrame for smoother UI updates
        if (scrollAnimationFrameId) {
          cancelAnimationFrame(scrollAnimationFrameId);
        }
        
        scrollAnimationFrameId = requestAnimationFrame(() => {
          // Basic scroll detection
          setIsScrolled(window.scrollY > 20);
          
          // Calculate scroll progress (0-100) for animation intensity
          const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
          const progress = Math.min(100, Math.max(0, (window.scrollY / scrollHeight) * 100));
          setScrollProgress(progress);
          
          // Check which section is in view
          checkActiveSection();
        });
      }
    };
    
    // Function to determine which section is currently in view
    const checkActiveSection = () => {
      // Special case for top of the page (home section)
      if (window.scrollY < 100) {
        setActiveSection('home');
        return;
      }
      
      const sections = [
        'about',
        'services',
        'pricing',
        'contact',
        'workout-tips'
      ];
      
      // Get the navbar height for offset calculations
      const navbar = document.querySelector('header');
      const navbarHeight = navbar ? navbar.offsetHeight : 0;
      const scrollPosition = window.scrollY + navbarHeight + 50; // Add some offset
      
      // Find the section that is currently in view
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { top, bottom } = element.getBoundingClientRect();
          const elementTop = top + window.pageYOffset;
          const elementBottom = bottom + window.pageYOffset;
          
          if (scrollPosition >= elementTop && scrollPosition < elementBottom) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Trigger once to set initial state
    handleScroll();
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMobileMenuOpen && 
          mobileMenuRef.current && 
          !mobileMenuRef.current.contains(event.target) &&
          !navRef.current.contains(event.target)) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === 'Escape' && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('keydown', handleEscKey);
    return () => {
      window.removeEventListener('keydown', handleEscKey);
    };
  }, [isMobileMenuOpen]);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuOpen && 
          userMenuRef.current && 
          !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [userMenuOpen]);

  // Handle logout function
  const handleLogout = async () => {
    try {
      await logout();
      setUserMenuOpen(false);
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const navigationItems = [
    { name: 'Home', path: '/', sectionId: 'home', icon: <HomeIcon /> },
    { name: 'About', path: '/about', sectionId: 'about', icon: <AboutIcon /> },
    { name: 'Services', path: '/services', sectionId: 'services', icon: <ServicesIcon /> },
    { name: 'Pricing', path: '/pricing', sectionId: 'pricing', icon: <PricingIcon /> },
    { name: 'Contact', path: '/contact', sectionId: 'contact', icon: <ContactIcon /> }
  ];

  return (
    <header 
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
        isScrolled 
          ? 'py-2 sm:py-3 header-scrolled' 
          : 'py-3 sm:py-5 bg-gradient-to-b from-black/50 to-transparent backdrop-blur-sm'
      }`}
      style={{
        background: isScrolled 
          ? `linear-gradient(135deg, rgba(59, 130, 246, ${0.85 + (scrollProgress * 0.0015)}), rgba(37, 99, 235, ${0.9 + (scrollProgress * 0.001)})` 
          : 'linear-gradient(to bottom, rgba(0,0,0,0.5), rgba(0,0,0,0))',
        boxShadow: isScrolled ? '0 4px 20px rgba(0, 0, 0, 0.1)' : 'none'
      }}
      role="banner"
    >
      {/* Animated background elements */}
      {isScrolled && (
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20 z-0 pointer-events-none">
          <div className="nav-bubble nav-bubble-1"></div>
          <div className="nav-bubble nav-bubble-2"></div>
          <div className="nav-bubble nav-bubble-3"></div>
        </div>
      )}
      
      <div className="container mx-auto px-4 sm:px-6 flex items-center justify-between relative z-10" ref={navRef}>
        {/* Logo with animation */}
        <a 
          href="#home"
          className={`transition-all duration-500 flex items-center ${
            isScrolled ? 'scale-90' : 'scale-100'
          } hover:opacity-95`}
          aria-label="FitLife Home"
          onClick={(e) => {
            e.preventDefault();
            // Manually set active section to home when clicking the logo
            setActiveSection('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        >
          <motion.div
            className="text-white font-bold text-xl sm:text-2xl md:text-3xl transition-all duration-300"
            style={{
              textShadow: '0 0 8px rgba(255,255,255,0.3)'
            }}
            whileHover={{ 
              scale: 1.05,
              textShadow: '0 0 12px rgba(255,255,255,0.6)'
            }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <img src={logo} alt="FitLife Logo" className="h-16 w-auto" />
          </motion.div>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:block" aria-label="Main Navigation">
          <ul className="flex space-x-2 lg:space-x-5 items-center">
            {navigationItems.map((item, index) => (
              <li key={item.name}>
                <NavLink
                  to={item.path}
                  sectionId={item.sectionId}
                  isScrolled={isScrolled}
                  isActive={activeSection === item.sectionId}
                  index={index}
                  setActive={setActiveSection}
                >
                  {item.icon}
                  <span className="ml-1">{item.name}</span>
                </NavLink>
              </li>
            ))}
            <li>
              {currentUser ? (
                <div className="relative" ref={userMenuRef}>
                  <motion.button
                    className="ml-4 flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white rounded-lg px-3 py-2 transition-all duration-300"
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {currentUser.photoURL || (userData && userData.photoURL) ? (
                      <img 
                        src={userData?.photoURL || currentUser.photoURL} 
                        alt="User avatar" 
                        className="w-8 h-8 rounded-full object-cover border-2 border-white/30"
                        crossOrigin="anonymous"
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          console.error('Navbar profile image failed to load');
                          e.target.onerror = null;
                          // Try to fix Google photo URLs
                          if (currentUser.photoURL && currentUser.photoURL.includes('googleusercontent.com') && !currentUser.photoURL.includes('?')) {
                            e.target.src = `${currentUser.photoURL}?${Date.now()}`;
                          } else {
                            e.target.style.display = 'none';
                            // Show the fallback instead
                            const parent = e.target.parentNode;
                            if (parent) {
                              const fallback = document.createElement('div');
                              fallback.className = "w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium";
                              fallback.textContent = userData?.name ? userData.name.charAt(0).toUpperCase() : 
                                currentUser.displayName ? currentUser.displayName.charAt(0).toUpperCase() : 
                                currentUser.email ? currentUser.email.charAt(0).toUpperCase() : 'U';
                              parent.appendChild(fallback);
                            }
                          }
                        }}
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium">
                        {userData?.name ? userData.name.charAt(0).toUpperCase() : 
                         currentUser.displayName ? currentUser.displayName.charAt(0).toUpperCase() : 
                         currentUser.email ? currentUser.email.charAt(0).toUpperCase() : 'U'}
                      </div>
                    )}
                    <span className="font-medium max-w-[100px] truncate">
                      {userData?.name || currentUser.displayName || currentUser.email.split('@')[0]}
                    </span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </motion.button>

                  <AnimatePresence>
                    {userMenuOpen && (
                      <motion.div
                        className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg overflow-hidden z-50"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="px-4 py-3 border-b border-gray-100">
                          <p className="text-sm text-gray-500">Signed in as</p>
                          <p className="text-sm font-medium text-gray-800 truncate">{currentUser.email}</p>
                        </div>
                        <div className="py-1">
                          <Link 
                            to="/profile" 
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={() => setUserMenuOpen(false)}
                          >
                            Your Profile
                          </Link>
                          <button 
                            onClick={handleLogout} 
                            className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                          >
                            Sign out
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link 
                  to="/login"
                  className="ml-4 inline-flex items-center bg-white text-blue-600 hover:text-blue-700 font-medium py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
                >
                  <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path>
                  </svg>
                  Login
                </Link>
              )}
            </li>
          </ul>
        </nav>

        {/* Mobile Menu Button with animation */}
        <motion.button
          className="md:hidden flex items-center justify-center w-10 h-10 rounded-full bg-blue-600 shadow-lg hover:bg-blue-700 transition-all focus:outline-none focus:ring-2 focus:ring-white/50"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMobileMenuOpen}
          aria-controls="mobile-menu"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="relative w-6 h-6 flex items-center justify-center">
            <motion.span 
              animate={{ 
                rotate: isMobileMenuOpen ? 45 : 0,
                y: isMobileMenuOpen ? 0 : -5
              }}
              transition={{ duration: 0.2 }}
              className="absolute block w-6 h-0.75 bg-white rounded-full shadow-sm"
            />
            <motion.span 
              animate={{ 
                opacity: isMobileMenuOpen ? 0 : 1,
                x: isMobileMenuOpen ? 20 : 0
              }}
              transition={{ duration: 0.2 }}
              className="absolute block w-6 h-0.75 bg-white rounded-full shadow-sm"
            />
            <motion.span 
              animate={{ 
                rotate: isMobileMenuOpen ? -45 : 0,
                y: isMobileMenuOpen ? 0 : 5
              }}
              transition={{ duration: 0.2 }}
              className="absolute block w-6 h-0.75 bg-white rounded-full shadow-sm"
            />
          </div>
        </motion.button>
      </div>

      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            id="mobile-menu"
            ref={mobileMenuRef}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className={`md:hidden absolute top-full left-0 w-full shadow-lg z-50 overflow-hidden`}
            style={{
              background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.97), rgba(37, 99, 235, 0.97))'
            }}
          >
            <nav className="container mx-auto px-6 py-6" aria-label="Mobile Navigation">
              <ul className="space-y-4">
                {navigationItems.map((item, index) => (
                  <motion.li 
                    key={item.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 + index * 0.1 }}
                  >
                    <Link
                      to={item.path}
                      className={`flex items-center py-4 text-lg font-medium ${
                        activeSection === item.sectionId
                          ? 'text-white font-semibold'
                          : 'text-blue-100 hover:text-white'
                      }`}
                      aria-current={activeSection === item.sectionId ? 'page' : undefined}
                      onClick={(e) => {
                        // Close the mobile menu first
                        setIsMobileMenuOpen(false);
                        
                        // Set active section
                        setActiveSection(item.sectionId);
                        
                        // Special handling for home section
                        if (item.sectionId === 'home') {
                          e.preventDefault();
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                          return;
                        }
                        
                        // Check if the section exists on the current page
                        const section = document.getElementById(item.sectionId);
                        if (section) {
                          e.preventDefault();
                          const navbar = document.querySelector('header');
                          const navbarHeight = navbar ? navbar.offsetHeight : 0;
                          
                          // Use scrollIntoView for smooth scrolling
                          section.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                          });
                          
                          // Apply offset for fixed header with a slight delay
                          setTimeout(() => {
                            const elementPosition = section.getBoundingClientRect().top;
                            const offsetPosition = window.pageYOffset + elementPosition - navbarHeight;
                            
                            window.scrollTo({
                              top: offsetPosition,
                              behavior: 'smooth'
                            });
                          }, 50);
                        }
                        // If section doesn't exist, the default Link behavior will navigate to the path
                      }}
                    >
                      <motion.span 
                        className="mr-3 flex items-center justify-center"
                        whileHover={{ scale: 1.2, rotate: 5 }}
                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                      >
                        {item.icon}
                      </motion.span>
                      <motion.span
                        whileHover={{ x: 5 }}
                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                      >
                        {item.name}
                      </motion.span>
                    </Link>
                    <div className="h-px bg-blue-200/20 mt-4"></div>
                  </motion.li>
                ))}
                <motion.li
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.25 + navigationItems.length * 0.1 }}
                >
                  {currentUser ? (
                    <>
                      <div className="mb-4 flex items-center">
                        {currentUser.photoURL || (userData && userData.photoURL) ? (
                          <img 
                            src={userData?.photoURL || currentUser.photoURL} 
                            alt="User avatar" 
                            className="w-12 h-12 rounded-full object-cover border-2 border-white/30 mr-3"
                            crossOrigin="anonymous"
                            referrerPolicy="no-referrer"
                            onError={(e) => {
                              console.error('Mobile navbar profile image failed to load');
                              e.target.onerror = null;
                              e.target.style.display = 'none';
                              const parent = e.target.parentNode;
                              if (parent) {
                                const fallback = document.createElement('div');
                                fallback.className = "w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium mr-3";
                                fallback.textContent = userData?.name ? userData.name.charAt(0).toUpperCase() : 
                                  currentUser.displayName ? currentUser.displayName.charAt(0).toUpperCase() : 
                                  currentUser.email ? currentUser.email.charAt(0).toUpperCase() : 'U';
                                parent.appendChild(fallback);
                              }
                            }}
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium mr-3">
                            {userData?.name ? userData.name.charAt(0).toUpperCase() : 
                             currentUser.displayName ? currentUser.displayName.charAt(0).toUpperCase() : 
                             currentUser.email ? currentUser.email.charAt(0).toUpperCase() : 'U'}
                          </div>
                        )}
                        <div>
                          <div className="text-white font-medium">
                            {userData?.name || currentUser.displayName || currentUser.email.split('@')[0]}
                          </div>
                          <div className="text-blue-100 text-sm truncate max-w-[200px]">{currentUser.email}</div>
                        </div>
                      </div>
                      
                      <Link 
                        to="/profile" 
                        className="bg-white/10 hover:bg-white/20 text-white py-2 px-4 rounded-lg transition-colors duration-200 flex items-center mb-2"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        Your Profile
                      </Link>
                      
                      <button 
                        onClick={() => {
                          handleLogout();
                          setIsMobileMenuOpen(false);
                        }}
                        className="bg-red-500/80 hover:bg-red-500 text-white py-2 px-4 rounded-lg transition-colors duration-200 flex items-center mb-2"
                      >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Logout
                      </button>
                    </>
                  ) : (
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Link
                        to="/login"
                        className="flex justify-center items-center py-3 px-6 bg-white text-blue-600 font-semibold rounded-lg text-center shadow-lg"
                      >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path>
                        </svg>
                        Login
                      </Link>
                    </motion.div>
                  )}
                </motion.li>
              </ul>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar; 