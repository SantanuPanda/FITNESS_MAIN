import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

function WorkoutTipsSection() {
  const [activeQuote, setActiveQuote] = useState(0);
  const [visibleTip, setVisibleTip] = useState(0);
  const sectionRef = useRef(null);
  
  // Workout tips data
  const workoutTips = [
    {
      id: 1,
      title: "Full Body HIIT",
      duration: "20 min",
      level: "Intermediate",
      calories: "250-300",
      exercises: ["Jumping Jacks", "Burpees", "Mountain Climbers", "Push-ups"],
      tip: "Keep your rest periods short (20-30 seconds) to maximize calorie burn and cardiovascular benefits.",
      icon: "hiit"
    },
    {
      id: 2,
      title: "Core Strength",
      duration: "15 min",
      level: "All Levels",
      calories: "150-200",
      exercises: ["Planks", "Russian Twists", "Bicycle Crunches", "Leg Raises"],
      tip: "Focus on engaging your core throughout each movement for maximum effectiveness.",
      icon: "core"
    },
    {
      id: 3,
      title: "Mobility Flow",
      duration: "10 min",
      level: "Beginner",
      calories: "80-100",
      exercises: ["Hip Openers", "Shoulder Circles", "Cat-Cow", "World's Greatest Stretch"],
      tip: "Perform this routine before workouts to prepare your body or after to aid in recovery.",
      icon: "mobility"
    }
  ];
  
  // Motivational quotes
  const quotes = [
    {
      text: "The only bad workout is the one that didn't happen.",
      author: "Eldric Voss"
    },
    {
      text: "Your body can stand almost anything. It's your mind that you have to convince.",
      author: "Andrew Murphy"
    },
    {
      text: "The difference between try and triumph is just a little umph!",
      author: "Marvin Phillips"
    },
    {
      text: "The hard days are the best because that's when champions are made.",
      author: "Gabrielle Reece"
    }
  ];
  
  // Fitness metrics
  const metrics = [
    {
      value: "84%",
      label: "Recovery Rate",
      icon: "heart",
      color: "text-rose-500"
    },
    {
      value: "6-8",
      label: "Hours of Sleep",
      icon: "sleep",
      color: "text-indigo-500"
    },
    {
      value: "10K",
      label: "Daily Steps",
      icon: "steps",
      color: "text-blue-500"
    },
    {
      value: "2L",
      label: "Water Intake",
      icon: "water",
      color: "text-cyan-500"
    }
  ];

  // Auto rotate quotes
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveQuote(prev => (prev + 1) % quotes.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [quotes.length]);
  
  // Change visible tip every 8 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setVisibleTip(prev => (prev + 1) % workoutTips.length);
    }, 8000);
    
    return () => clearInterval(interval);
  }, [workoutTips.length]);
  
  // Scrolling animation
  useEffect(() => {
    // Add animate-section class to the section on mount to ensure visibility
    if (sectionRef.current) {
      sectionRef.current.classList.add('animate-section');
    }
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-section');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );
    
    // Manually add animation classes to fade-in elements
    const fadeElements = document.querySelectorAll('.fade-in-element');
    fadeElements.forEach((el, index) => {
      el.style.transitionDelay = `${index * 150}ms`;
      
      // Force reflow to ensure animations work
      setTimeout(() => {
        el.classList.add('animate-section');
      }, 100);
      
      observer.observe(el);
    });

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
      fadeElements.forEach(el => {
        observer.unobserve(el);
      });
    };
  }, []);

  // Helper function to render workout icons
  const renderWorkoutIcon = (iconName) => {
    switch (iconName) {
      case 'hiit':
        return (
          <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        );
      case 'core':
        return (
          <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        );
      case 'mobility':
        return (
          <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 013 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11" />
          </svg>
        );
      default:
        return null;
    }
  };

  // Helper function to render metric icons
  const renderMetricIcon = (iconName, color) => {
    switch (iconName) {
      case 'heart':
        return (
          <svg className={`w-8 h-8 ${color}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        );
      case 'sleep':
        return (
          <svg className={`w-8 h-8 ${color}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
        );
      case 'steps':
        return (
          <svg className={`w-8 h-8 ${color}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        );
      case 'water':
        return (
          <svg className={`w-8 h-8 ${color}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <section 
      ref={sectionRef}
      id="workout-tips"
      className="py-12 bg-gradient-to-b from-blue-50 to-white relative overflow-hidden"
    >
      {/* Background elements */}
      <div className="absolute inset-0 opacity-5 z-0" style={{ 
        background: 'radial-gradient(circle, rgba(59, 130, 246, 0.2) 0%, rgba(255, 255, 255, 0) 70%)' 
      }}></div>
      <div className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full bg-blue-400 opacity-10 blur-3xl"></div>
      <div className="absolute top-40 -right-20 w-80 h-80 rounded-full bg-indigo-400 opacity-10 blur-3xl"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        {/* Section header */}
        <div className="text-center mb-14 opacity-0 fade-in-element transition-all duration-1000">
          <span className="inline-block py-1 px-3 rounded-full bg-blue-100 text-blue-600 text-sm font-semibold mb-4">
            Workout Tips
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
            Daily <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-500">Fitness Inspiration</span>
          </h2>
          <div className="mx-auto w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-500 rounded mb-6"></div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Expert routines, motivational quotes, and key fitness metrics to keep you on track with your fitness goals.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Daily workout tips - left column */}
          <div className="lg:col-span-7 opacity-0 fade-in-element transition-all duration-1000">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-gray-900">
                    Today's Workout
                  </h3>
                  
                  {/* Tab indicators */}
                  <div className="flex space-x-2">
                    {workoutTips.map((_, index) => (
                      <button 
                        key={index}
                        onClick={() => setVisibleTip(index)}
                        className={`w-3 h-3 rounded-full transition-all ${
                          index === visibleTip 
                            ? 'bg-blue-500 w-8' 
                            : 'bg-gray-300 hover:bg-gray-400'
                        }`}
                        aria-label={`View workout tip ${index + 1}`}
                      />
                    ))}
                  </div>
                </div>
                
                {/* Workout cards with transition */}
                <div className="relative h-[400px] sm:h-[350px] md:h-[300px]">
                  {workoutTips.map((workout, index) => (
                    <div 
                      key={workout.id}
                      className={`absolute inset-0 transition-all duration-500 ${
                        index === visibleTip 
                          ? 'opacity-100 translate-y-0 z-10' 
                          : 'opacity-0 translate-y-8 -z-10'
                      }`}
                    >
                      <div className="flex flex-col md:flex-row md:items-start gap-6">
                        {/* Workout icon/illustration - Fixed alignment with start instead of center */}
                        <div className="flex-shrink-0 w-16 h-16 md:w-24 md:h-24 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center mt-1 mx-auto md:mx-0">
                          {renderWorkoutIcon(workout.icon)}
                        </div>
                        
                        <div className="flex-1">
                          <h4 className="text-xl font-bold text-gray-800 mb-2 text-center md:text-left">{workout.title}</h4>
                          
                          {/* Workout details */}
                          <div className="grid grid-cols-3 gap-2 md:gap-4 mb-4">
                            <div>
                              <p className="text-gray-500 text-xs sm:text-sm">Duration</p>
                              <p className="font-semibold text-sm sm:text-base">{workout.duration}</p>
                            </div>
                            <div>
                              <p className="text-gray-500 text-xs sm:text-sm">Level</p>
                              <p className="font-semibold text-sm sm:text-base">{workout.level}</p>
                            </div>
                            <div>
                              <p className="text-gray-500 text-xs sm:text-sm">Calories</p>
                              <p className="font-semibold text-sm sm:text-base">{workout.calories}</p>
                            </div>
                          </div>
                          
                          {/* Exercise list */}
                          <div className="mb-4">
                            <p className="text-gray-500 text-xs sm:text-sm mb-2">Exercises:</p>
                            <div className="flex flex-wrap gap-1 sm:gap-2">
                              {workout.exercises.map((exercise, i) => (
                                <span
                                  key={i}
                                  className="px-2 sm:px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs sm:text-sm"
                                >
                                  {exercise}
                                </span>
                              ))}
                            </div>
                          </div>
                          
                          {/* Pro tip */}
                          <div className="mt-4 p-3 sm:p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                            <p className="text-gray-700 text-xs sm:text-sm">
                              <span className="font-bold">Pro Tip:</span> {workout.tip}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* CTA Button */}
                <div className="mt-8 text-center">
                  <a
                    href="#services"
                    onClick={(e) => {
                      e.preventDefault();
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
                    }}
                    className="inline-flex items-center px-6 py-3 rounded-lg bg-blue-600 text-white font-medium transition-all hover:bg-blue-700 hover:shadow-md"
                  >
                    <span>Explore All Workouts</span>
                    <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right column - quote and metrics - Fixed heights to match */}
          <div className="lg:col-span-5 space-y-6">
            {/* Motivational quote - Responsive height */}
            <div className="opacity-0 fade-in-element transition-all duration-1000 delay-300">
              <div className="relative bg-gradient-to-br from-indigo-600 to-purple-600 text-white rounded-2xl p-4 sm:p-8 shadow-lg overflow-hidden h-[180px] sm:h-[220px] flex flex-col justify-center">
                {/* Quote decoration */}
                <div className="absolute top-4 left-4 text-white opacity-20">
                  <svg className="w-12 h-12 sm:w-16 sm:h-16" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                  </svg>
                </div>
                
                <div className="relative z-10">
                  <div className="flex items-center justify-center h-[80px] relative">
                    {quotes.map((quote, index) => (
                      <p 
                        key={index}
                        className={`text-lg sm:text-xl md:text-2xl font-medium italic text-center transition-all duration-500 absolute left-0 right-0 ${
                          index === activeQuote
                            ? 'opacity-100 translate-y-0'
                            : 'opacity-0 translate-y-8'
                        }`}
                      >
                        "{quote.text}"
                      </p>
                    ))}
                  </div>
                  
                  <div className="mt-4 sm:mt-6 text-center h-[30px] relative">
                    {quotes.map((quote, index) => (
                      <p 
                        key={index} 
                        className={`text-white/80 text-sm sm:text-base transition-all duration-500 absolute w-full left-0 ${
                          index === activeQuote
                            ? 'opacity-100 translate-y-0'
                            : 'opacity-0 translate-y-4'
                        }`}
                      >
                        — {quote.author}
                      </p>
                    ))}
                  </div>
                </div>
                
                <div className="absolute -bottom-10 -right-8 w-32 h-32 bg-white/10 rounded-full"></div>
                <div className="absolute -top-10 -left-10 w-40 h-40 bg-white/5 rounded-full"></div>
              </div>
            </div>
            
            {/* Key fitness metrics */}
            <div className="opacity-0 fade-in-element transition-all duration-1000 delay-500">
              <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4 sm:mb-6 text-center sm:text-left">Key Fitness Metrics</h3>
                
                <div className="grid grid-cols-2 gap-3 sm:gap-6">
                  {metrics.map((metric, index) => (
                    <div key={index} className="flex flex-col items-center p-2 sm:p-4 rounded-xl hover:bg-gray-50 transition-all">
                      <div className="w-8 h-8 sm:w-auto sm:h-auto">
                        {renderMetricIcon(metric.icon, metric.color)}
                      </div>
                      <p className={`text-xl sm:text-2xl font-bold mt-2 sm:mt-3 ${metric.color}`}>{metric.value}</p>
                      <p className="text-gray-500 text-xs sm:text-sm text-center">{metric.label}</p>
                    </div>
                  ))}
                </div>
                
                <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-gray-50 rounded-lg">
                  <p className="text-gray-700 text-xs sm:text-sm">
                    <span className="font-bold">Daily Goal Progress:</span> You're 75% towards your daily goals. Keep it up!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default WorkoutTipsSection; 