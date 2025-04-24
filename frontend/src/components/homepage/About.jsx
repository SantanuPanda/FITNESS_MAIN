import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// Function to render icons based on icon name
const renderIcon = (iconName, colorClass) => {
  const iconMap = {
    'dumbbell': (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V6a2 2 0 012-2h12a2 2 0 012 2v2m-6 6h-4m2 4v-8m-6 4h2m16 0h-2" />
      </svg>
    ),
    'nutrition': (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    'coach': (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
    'heart': (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
    'community': (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    'equipment': (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
      </svg>
    )
  };

  return (
    <div className={colorClass}>
      {iconMap[iconName] || (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )}
    </div>
  );
};

const StatCard = ({ number, label, icon }) => {
  const [count, setCount] = useState(0);
  const finalNumber = parseInt(number.replace(/\D/g, '') || '0');
  const hasPlus = number.includes('+');
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6 }}
      whileHover={{ y: -5 }}
      className="bg-white/90 backdrop-blur-sm p-6 sm:p-8 rounded-xl shadow-xl border border-purple-100 relative overflow-hidden group"
      onViewportEnter={() => {
        // Start counter animation when element enters viewport
        let startValue = 0;
        const duration = 2000; // 2 seconds
        const increment = Math.ceil(finalNumber / (duration / 16)); // increment per frame
        
        const timer = setInterval(() => {
          startValue += increment;
          
          if (startValue > finalNumber) {
            startValue = finalNumber;
            clearInterval(timer);
          }
          
          setCount(startValue);
        }, 16); // ~60fps
        
        return () => clearInterval(timer);
      }}
    >
      <div className="absolute -right-6 -top-6 w-20 h-20 bg-purple-100 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-500"></div>
      <div className="relative z-10">
        <div className="text-4xl text-purple-500 mb-4">{icon}</div>
        <h3 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-2">
          {count}{hasPlus ? '+' : ''}
        </h3>
        <p className="text-gray-700 font-medium tracking-wide uppercase text-sm">{label}</p>
      </div>
    </motion.div>
  );
};

const FeatureCard = ({ title, description, icon, delay }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.03, y: -5 }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="bg-white/90 backdrop-blur-sm p-6 sm:p-8 rounded-xl shadow-lg border border-purple-100 h-full flex flex-col"
    >
      <div className="rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 w-16 h-16 flex items-center justify-center text-white text-2xl mb-6">{icon}</div>
      <h3 className="text-xl font-bold text-gray-800 mb-3">{title}</h3>
      <p className="text-gray-600 leading-relaxed flex-grow">{description}</p>
      <motion.button 
        whileHover={{ scale: 1.05, x: 5 }}
        whileTap={{ scale: 0.95 }}
        className="mt-6 text-purple-600 font-medium inline-flex items-center group"
      >
        Learn more 
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
        </svg>
      </motion.button>
    </motion.div>
  );
};

// Define the features array
const features = [
  {
    id: 1,
    title: "Expert Training",
    description: "Work with certified trainers who design personalized workout plans tailored to your goals and fitness level.",
    icon: "dumbbell",
    bgcolor: "from-purple-500 to-purple-700",
    bglight: "bg-purple-100",
    textcolor: "text-purple-700",
    hoverbg: "hover:bg-purple-200",
  },
  {
    id: 2,
    title: "Nutrition Guidance",
    description: "Receive customized meal plans and nutrition advice to complement your fitness routine and maximize results.",
    icon: "nutrition",
    bgcolor: "from-blue-500 to-blue-700",
    bglight: "bg-blue-100",
    textcolor: "text-blue-700",
    hoverbg: "hover:bg-blue-200",
  },
  {
    id: 3,
    title: "Personal Coaching",
    description: "Get one-on-one attention from dedicated coaches who will keep you motivated and accountable.",
    icon: "coach",
    bgcolor: "from-indigo-500 to-indigo-700",
    bglight: "bg-indigo-100",
    textcolor: "text-indigo-700",
    hoverbg: "hover:bg-indigo-200",
  },
  {
    id: 4,
    title: "Holistic Approach",
    description: "Our comprehensive method addresses physical fitness, mental wellness, and lifestyle habits.",
    icon: "heart",
    bgcolor: "from-pink-500 to-pink-700",
    bglight: "bg-pink-100",
    textcolor: "text-pink-700", 
    hoverbg: "hover:bg-pink-200",
  },
  {
    id: 5,
    title: "Community Support",
    description: "Join a motivating community of like-minded individuals who share your passion for health and fitness.",
    icon: "community",
    bgcolor: "from-green-500 to-green-700",
    bglight: "bg-green-100",
    textcolor: "text-green-700",
    hoverbg: "hover:bg-green-200",
  },
  {
    id: 6,
    title: "Modern Equipment",
    description: "Train with state-of-the-art fitness equipment in our clean, spacious, and welcoming facilities.",
    icon: "equipment",
    bgcolor: "from-purple-400 to-purple-600",
    bglight: "bg-purple-100",
    textcolor: "text-purple-700",
    hoverbg: "hover:bg-purple-200",
  }
];

const About = () => {
  // Initialize animation on scroll
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('show');
          entry.target.classList.remove('opacity-0', 'translate-y-8');
        }
      });
    }, { threshold: 0.1 });
    
    // Observe all feature cards
    setTimeout(() => {
      document.querySelectorAll('.feature-card').forEach(card => {
        observer.observe(card);
      });
    }, 100);
    
    return () => {
      if (document.querySelectorAll('.feature-card').length) {
        document.querySelectorAll('.feature-card').forEach(card => {
          observer.unobserve(card);
        });
      }
    };
  }, []);
  
  // Add useEffect for the section footer animation
  useEffect(() => {
    // Observer to show the section footer when it comes into view
    const footerObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.remove('opacity-0');
          entry.target.classList.add('opacity-100');
        }
      });
    }, { threshold: 0.1 });
    
    const sectionFooter = document.querySelector('.section-footer');
    if (sectionFooter) {
      footerObserver.observe(sectionFooter);
    }
    
    return () => {
      if (sectionFooter) {
        footerObserver.unobserve(sectionFooter);
      }
    };
  }, []);
  
  return (
    <section id="about" className="py-16 sm:py-20 md:py-24 bg-gradient-to-b from-gray-50 to-purple-50 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -right-24 w-64 sm:w-96 h-64 sm:h-96 rounded-full bg-purple-200 mix-blend-multiply opacity-20 blur-3xl"></div>
        <div className="absolute top-1/2 -left-24 w-60 sm:w-80 h-60 sm:h-80 rounded-full bg-indigo-200 mix-blend-multiply opacity-20 blur-3xl"></div>
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-16 relative z-10">

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-10 sm:mb-12 md:mb-16 text-center"
        >
          <h3 className="text-2xl sm:text-3xl font-semibold text-gray-800 mb-3">Why Choose Us</h3>
          <div className="h-1 w-20 bg-purple-500 mx-auto"></div>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {features.map((feature, index) => (
            <div 
              key={feature.id}
              className="feature-card opacity-0 translate-y-8 duration-700 bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transform hover:-translate-y-2 hover:scale-105 transition-all"
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="p-2">
                {/* Card top with icon and title */}
                <div className="relative overflow-hidden rounded-t-lg bg-white">
                  {/* Colored background stripe */}
                  <div className={`absolute top-0 left-0 right-0 h-24 bg-gradient-to-r ${feature.bgcolor} opacity-90`} style={{ height: "6.75rem" }}></div>
                  
                  {/* Icon circle */}
                  <div className="relative z-10 flex justify-center">
                    <div className="mt-4 w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white shadow-lg flex items-center justify-center transform-gpu hover:rotate-12 transition-all duration-300">
                      {renderIcon(feature.icon, feature.textcolor)}
                    </div>
                  </div>
                  
                  {/* Title */}
                  <h3 className={`relative z-10 text-center text-xl font-bold mt-8 mb-2 ${feature.textcolor}`}>
                    {feature.title}
                  </h3>
                </div>
                
                {/* Card content */}
                <div className="p-4 sm:p-6 pt-2">
                  <p className="text-gray-600 mb-6 text-center">{feature.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-16 sm:mt-20 text-center section-footer opacity-0 transition-all duration-1000">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            className="inline-block"
          >
            <button 
              onClick={() => {
                const workoutSection = document.getElementById('workout-tips');
                if (workoutSection) {
                  workoutSection.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-bold rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all inline-flex items-center"
            >
              Explore All Features
              <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About; 