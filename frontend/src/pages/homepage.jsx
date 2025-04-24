import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Navbar from '../components/homepage/Navbar';
import Home from '../components/homepage/Home';
import About from '../components/homepage/About';
import Services from '../components/homepage/Services';
import Pricing from '../components/homepage/Pricing';
import Contact from '../components/homepage/Contact';
import WorkoutTipsSection from '../components/homepage/WorkoutTipsSection';
import Footer from '../components/homepage/Footer';
import SplashScreen from '../components/homepage/SplashScreen';

const Homepage = () => {
    const location = useLocation();
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
  
    // Scroll to top when route changes
    useEffect(() => {
      window.scrollTo(0, 0);
    }, [location.pathname]);

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
            <main>
              {renderContent()}
            </main>
            <Footer />
          </>
        )}
      </div>
    );
  };
  
  export default Homepage;