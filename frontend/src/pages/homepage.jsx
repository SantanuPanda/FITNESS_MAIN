import { useLocation } from 'react-router-dom';
import { useEffect, useState, useRef, useCallback } from 'react';
import Navbar from '../components/homepage/Navbar';
import Home from '../components/homepage/Home';
import About from '../components/homepage/About';
import Services from '../components/homepage/Services';
import Pricing from '../components/homepage/Pricing';
import Contact from '../components/homepage/Contact';
import WorkoutTipsSection from '../components/homepage/WorkoutTipsSection';
import Footer from '../components/homepage/Footer';
import SplashScreen from '../components/homepage/SplashScreen';

// Add smooth scrolling CSS
const smoothScrollStyles = `
  html {
    scroll-behavior: smooth;
    -webkit-overflow-scrolling: touch;
  }
  
  body {
    overflow-x: hidden;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-rendering: optimizeLegibility;
  }
  
  .section-glass-indigo,
  .section-glass-purple,
  .section-glass-blue,
  .section-with-blobs {
    will-change: transform;
    transform: translateZ(0);
    backface-visibility: hidden;
    perspective: 1000;
  }
`;

const Homepage = () => {
    const location = useLocation();
    const mainRef = useRef(null);
    const [showSplash, setShowSplash] = useState(() => {
      // Check if we're navigating from another page that wants to skip splash
      // This handles navigation from profile and other internal pages
      if (location.state && location.state.skipSplash) {
        return false;
      }
      
      // Also check session storage to avoid showing splash on browser back/forward
      try {
        const hasSeenSplash = sessionStorage.getItem('hasSeenSplash');
        return !hasSeenSplash;
      } catch (e) {
        // Fallback if sessionStorage is unavailable
        return true;
      }
    });
  
    // Add smooth scroll styles to document
    useEffect(() => {
      const style = document.createElement('style');
      style.textContent = smoothScrollStyles;
      document.head.appendChild(style);
      return () => {
        document.head.removeChild(style);
      };
    }, []);

    // Optimized scroll handler with debounce
    const handleScroll = useCallback(() => {
      if (!mainRef.current) return;
      
      const sections = mainRef.current.querySelectorAll('section');
      const scrollPosition = window.scrollY + window.innerHeight / 2;
      
      sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        
        if (scrollPosition >= sectionTop && scrollPosition <= sectionTop + sectionHeight) {
          section.style.transform = 'translateY(0)';
          section.style.opacity = '1';
        }
      });
    }, []);

    // Add optimized scroll event listener
    useEffect(() => {
      let timeoutId;
      const optimizedScroll = () => {
        if (timeoutId) {
          window.cancelAnimationFrame(timeoutId);
        }
        timeoutId = window.requestAnimationFrame(handleScroll);
      };

      window.addEventListener('scroll', optimizedScroll, { passive: true });
      return () => {
        window.removeEventListener('scroll', optimizedScroll);
        if (timeoutId) {
          window.cancelAnimationFrame(timeoutId);
        }
      };
    }, [handleScroll]);

    // Smooth scroll to top when route changes
    useEffect(() => {
      window.scrollTo({ 
        top: 0, 
        behavior: 'smooth' 
      });
    }, [location.pathname]);

    // Smooth scroll to section when hash changes
    useEffect(() => {
      if (location.hash && !showSplash) {
        const id = location.hash.substring(1);
        const element = document.getElementById(id);
        if (element) {
          setTimeout(() => {
            element.scrollIntoView({
              behavior: 'smooth',
              block: 'start'
            });
          }, 100);
        }
      }
    }, [location.hash, showSplash]);

    const handleSplashComplete = () => {
      setShowSplash(false);
      // Store that user has seen splash screen
      try {
        sessionStorage.setItem('hasSeenSplash', 'true');
      } catch (e) {
        console.warn('Unable to use sessionStorage:', e);
      }
    };
  
    // Determine which content to render based on the current path
    const renderContent = () => {
      const path = location.pathname;
      
      if (path === '/about') {
        return (
          <div className="section-glass-purple" id="about">
            <About />
          </div>
        );
      } else if (path === '/services') {
        return (
          <div className="section-with-blobs" id="services">
            <Services />
          </div>
        );
      } else if (path === '/pricing') {
        return (
          <div className="section-glass-blue" id="pricing">
            <Pricing />
          </div>
        );
      } else if (path === '/contact') {
        return (
          <div className="section-glass-purple" id="contact">
            <Contact />
          </div>
        );
      } else {
        // Default homepage content
        return (
          <>
            <div className="section-glass-indigo" id="home">
              <Home />
            </div>
            <div className="section-glass-purple" id="about">
              <About />
            </div>
            <div className="section-glass-indigo" id="workout-tips">
              <WorkoutTipsSection />
            </div>
            <div className="section-with-blobs" id="services">
              <Services />
            </div>
            <div className="section-glass-blue" id="pricing">
              <Pricing />
            </div>
            <div className="section-glass-purple" id="contact">
              <Contact />
            </div>
          </>
        );
      }
    };
  
    return (
      <div className="min-h-screen">
        {showSplash ? (
          <SplashScreen onComplete={handleSplashComplete} />
        ) : (
          <>
            <Navbar />
            <main ref={mainRef}>
              {renderContent()}
            </main>
            <Footer />
          </>
        )}
      </div>
    );
  };
  
  export default Homepage;