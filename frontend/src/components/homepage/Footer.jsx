import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import logo from '../../assets/logo.png';

const FitnessQuote = () => {
  const quotes = [
    "The only bad workout is the one that didn't happen.",
    "Fitness is not about being better than someone else. It's about being better than you used to be.",
    "Take care of your body. It's the only place you have to live.",
    "The hard part isn't getting your body in shape. The hard part is getting your mind in shape.",
    "Strength does not come from physical capacity. It comes from an indomitable will."
  ];
  
  const [currentQuote, setCurrentQuote] = useState(0);
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % quotes.length);
    }, 8000);
    
    return () => clearInterval(timer);
  }, [quotes.length]);
  
  return (
    <div className="relative h-20 overflow-hidden flex items-center">
      {quotes.map((quote, index) => (
        <motion.p
          key={index}
          initial={{ opacity: 0, y: 50 }}
          animate={{ 
            opacity: currentQuote === index ? 1 : 0,
            y: currentQuote === index ? 0 : 50
          }}
          transition={{ duration: 0.8 }}
          className="text-gray-300 text-lg italic absolute inset-0 flex items-center justify-center text-center px-4"
        >
          "{quote}"
        </motion.p>
      ))}
    </div>
  );
};

const AnimatedButton = ({ children, onClick, className }) => {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ 
        scale: 1.05,
        backgroundColor: "rgba(99, 102, 241, 0.9)",
        color: "#ffffff"
      }}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className={`transition-all duration-300 ${className}`}
    >
      {children}
    </motion.button>
  );
};

const FAQ = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mb-4">
      <AnimatedButton 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left p-4 bg-gray-800 rounded-lg flex justify-between items-center group"
      >
        <h3 className="text-sm font-medium text-white group-hover:text-white">{question}</h3>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="flex-shrink-0 ml-2"
        >
          <svg
            className="h-5 w-5 text-indigo-400"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </motion.span>
      </AnimatedButton>
      
      <motion.div
        initial={false}
        animate={{ 
          height: isOpen ? "auto" : 0,
          opacity: isOpen ? 1 : 0
        }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden bg-gray-700 rounded-b-lg"
      >
        <p className="p-4 text-gray-300 text-sm">{answer}</p>
      </motion.div>
    </div>
  );
};

const FooterShape = ({ className }) => (
  <svg
    className={`absolute inset-0 w-full h-full ${className}`}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 1440 320"
    preserveAspectRatio="none"
  >
    <path
      fill="currentColor"
      fillOpacity="1"
      d="M0,256L48,229.3C96,203,192,149,288,138.7C384,128,480,160,576,181.3C672,203,768,213,864,218.7C960,224,1056,224,1152,213.3C1248,203,1344,181,1392,170.7L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
    ></path>
  </svg>
);

const SocialMediaIcons = () => {
  const socialIcons = [
    { name: "facebook", icon: "ri-facebook-circle-fill", url: "#", color: "hover:bg-pink-600" },
    { name: "Instagram", icon: "ri-instagram-line", url: "#", color: "hover:bg-pink-600" },
    { name: "Twitter", icon: "ri-twitter-x-fill", url: "#", color: "hover:bg-black" },
    { name: "LinkedIn", icon: "ri-linkedin-fill", url: "#", color: "hover:bg-blue-700" },
  ];

  return (
    <div className="flex flex-wrap gap-3">
      {socialIcons.map((social) => (
        <motion.a
          key={social.name}
          href={social.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Follow us on ${social.name}`}
          className={`w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-white transition-all ${social.color}`}
          whileHover={{ y: -5, scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <i className={`${social.icon} text-lg`}></i>
        </motion.a>
      ))}
    </div>
  );
};

const StatsCounter = ({ number, label }) => {
  const [count, setCount] = useState(0);
  const finalValue = parseInt(number);
  
  useEffect(() => {
    let startValue = 0;
    const duration = 2000;
    const increment = Math.ceil(finalValue / (duration / 16));
    
    const timer = setInterval(() => {
      startValue += increment;
      
      if (startValue > finalValue) {
        startValue = finalValue;
        clearInterval(timer);
      }
      
      setCount(startValue);
    }, 16);
    
    return () => clearInterval(timer);
  }, [finalValue]);
  
  return (
    <div className="text-center">
      <h3 className="text-3xl font-bold text-indigo-400 mb-1">{count}+</h3>
      <p className="text-gray-400 text-sm">{label}</p>
    </div>
  );
};

const Footer = () => {
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  const faqs = [
    {
      question: "How do I get started with a membership?",
      answer: "You can sign up for a membership by clicking the 'Join Now' button and following the registration process. We offer various plans to suit your needs and goals."
    },
    {
      question: "What are your operating hours?",
      answer: "We're open Monday-Friday from 6:00 AM to 10:00 PM, Saturday from 7:00 AM to 8:00 PM, and Sunday from 8:00 AM to 6:00 PM."
    },
    {
      question: "Do you offer personal trainers?",
      answer: "Yes, we have certified personal trainers available. You can book one-on-one sessions or join group classes led by our expert trainers."
    },
    {
      question: "Can I cancel my membership at any time?",
      answer: "Yes, you can cancel your membership with 30 days' notice. Please contact our support team for assistance with the cancellation process."
    }
  ];

  const quickLinks = [
    { name: "Home", section: "home" },
    { name: "About Us", section: "about" },
    { name: "Services", section: "services" },
    { name: "Membership", section: "pricing" },
    { name: "Contact", section: "contact" }
  ];

  const programLinks = [
    { name: "Personal Training", url: "#services" },
    { name: "Group Classes", url: "#services" },
    { name: "Nutrition Plans", url: "#services" },
    { name: "Recovery & Wellness", url: "#services" },
    { name: "Weight Loss Programs", url: "#services" }
  ];

  const statistics = [
    { number: "15", label: "Years of Excellence" },
    { number: "50", label: "Expert Trainers" },
    { number: "1200", label: "Happy Members" },
    { number: "30", label: "Weekly Classes" }
  ];

  return (
    <footer className="relative pt-20 bg-gradient-to-b from-gray-900 via-purple-950 to-black text-white overflow-hidden">
      {/* Wave shapes */}
      <FooterShape className="text-purple-900/20 top-0" />
      
      {/* Main footer content */}
      <div className="relative z-10 container mx-auto px-6 sm:px-8 md:px-12 lg:px-16">
        {/* Top section with animated quote */}
        
        
        {/* Statistics Counter Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          {statistics.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <StatsCounter number={stat.number} label={stat.label} />
            </motion.div>
          ))}
        </div>
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
          {/* Brand and About */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <img 
                src={logo} 
                alt="FitLife Logo" 
                className="h-16 mb-6" 
              />
              <p className="text-gray-400 mb-6 leading-relaxed">
                At FitLife, we're dedicated to helping you achieve your fitness goals and live your best life. Our state-of-the-art facilities and expert trainers are here to guide you every step of the way.
              </p>
              <div className="flex space-x-4">
                <motion.a 
                  href="#"
                  whileHover={{ y: -5, scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white hover:bg-blue-600"
                  aria-label="Facebook"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                  </svg>
                </motion.a>
                <motion.a 
                  href="#"
                  whileHover={{ y: -5, scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-10 h-10 rounded-full ml-2 bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white hover:from-purple-600 hover:to-pink-600"
                  aria-label="Instagram"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </motion.a>
                <motion.a 
                  href="#"
                  whileHover={{ y: -5, scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-10 h-10 rounded-full ml-2 bg-sky-400 flex items-center justify-center text-white hover:bg-sky-500"
                  aria-label="Twitter"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                  </svg>
                </motion.a>
                

                <motion.a 
                  href="#"
                  whileHover={{ y: -5, scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-10 h-10 rounded-full ml-2 bg-blue-600 flex items-center justify-center text-white hover:bg-blue-700"
                  aria-label="LinkedIn"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z" />
                  </svg>
                </motion.a>
              </div>
            </motion.div>
          </div>

          {/* Quick Links */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <h3 className="text-xl font-bold mb-6 text-white relative inline-block">
                Quick Links
                <span className="absolute -bottom-2 left-0 w-1/2 h-1 bg-purple-500 rounded-full"></span>
              </h3>
              <ul className="space-y-3">
                {quickLinks.map((link, index) => (
                  <motion.li 
                    key={link.name}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: 0.1 + (index * 0.05) }}
                  >
                    <button
                      onClick={() => scrollToSection(link.section)}
                      className="text-gray-400 hover:text-purple-400 transition-colors flex items-center group"
                    >
                      <span className="mr-2 text-purple-500 transform group-hover:translate-x-1 transition-transform">
                        <i className="fas fa-chevron-right text-xs"></i>
                      </span>
                      {link.name}
                    </button>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </div>

          {/* Programs */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h3 className="text-xl font-bold mb-6 text-white relative inline-block">
                Our Programs
                <span className="absolute -bottom-2 left-0 w-1/2 h-1 bg-purple-500 rounded-full"></span>
              </h3>
              <ul className="space-y-3">
                {programLinks.map((link, index) => (
                  <motion.li 
                    key={link.name}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: 0.2 + (index * 0.05) }}
                  >
                    <a
                      href={link.url}
                      className="text-gray-400 hover:text-purple-400 transition-colors flex items-center group"
                    >
                      <span className="mr-2 text-purple-500 transform group-hover:translate-x-1 transition-transform">
                        <i className="fas fa-chevron-right text-xs"></i>
                      </span>
                      {link.name}
                    </a>
                  </motion.li>
                ))}
              </ul>
              
              <div className="mt-8">
                <h4 className="text-md font-semibold text-white mb-4 relative inline-block">
                  Contact Us
                  <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-purple-500/50 rounded-full"></span>
                </h4>
                <div className="space-y-2">
                  <p className="text-gray-400 flex items-center">
                    <i className="fas fa-map-marker-alt text-purple-400 mr-3"></i>
                    123 Fitness Street, Gym City
                  </p>
                  <p className="text-gray-400 flex items-center">
                    <i className="fas fa-phone text-purple-400 mr-3"></i>
                    <a 
                      href="tel:+15551234567" 
                      className="hover:text-purple-400 transition-colors"
                    >
                      +1 (555) 123-4567
                    </a>
                  </p>
                  <p className="text-gray-400 flex items-center">
                    <i className="fas fa-envelope text-purple-400 mr-3"></i>
                    <a 
                      href="mailto:santanupanda445@gmail.com" 
                      className="hover:text-purple-400 transition-colors"
                    >
                      santanupanda445@gmail.com
                    </a>
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* FAQs */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <h3 className="text-xl font-bold mb-6 text-white relative inline-block">
                Common Questions
                <span className="absolute -bottom-2 left-0 w-1/2 h-1 bg-purple-500 rounded-full"></span>
              </h3>
              <div className="space-y-2">
                {faqs.map((faq, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: 0.3 + (index * 0.1) }}
                  >
                    <FAQ question={faq.question} answer={faq.answer} />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Bottom bar with copyright */}
        <div className="mt-16 pt-8 border-t border-gray-800/30 text-center">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">
              &copy; {new Date().getFullYear()} developed by santanu. All rights reserved.
            </p>
            <div className="flex flex-wrap justify-center space-x-4 text-sm text-gray-500">
              <a href="#" className="hover:text-purple-400 transition-colors">Privacy Policy</a>
              <span>|</span>
              <a href="#" className="hover:text-purple-400 transition-colors">Terms of Service</a>
              <span>|</span>
              <a href="#" className="hover:text-purple-400 transition-colors">Accessibility</a>
            </div>
          </div>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-6 text-gray-600 text-xs"
          >
            <span className="text-purple-500">♥</span> Designed to help you achieve your fitness goals.
          </motion.p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 