import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';

// Replace these with your actual EmailJS credentials
// You need to create an account on emailjs.com and set up a service and template
// const emailjsServiceId = "service_31tcv8d";
// const emailjsTemplateId = "template_g7cn6hi";
// const emailjsPublicKey = "u4zVgbosSNEw3TgIB"; // Public key

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [formStatus, setFormStatus] = useState({
    submitted: false,
    loading: false,
    error: null
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormStatus({ ...formStatus, loading: true });

    try {
      // Create a detailed HTML message body
      const messageBody = `
        <h2>New Message from Website Contact Form</h2>
        <p><strong>From:</strong> ${formData.name}</p>
        <p><strong>Email:</strong> ${formData.email}</p>
        <p><strong>Subject:</strong> ${formData.subject || "N/A"}</p>
        <p><strong>Message:</strong></p>
        <p>${formData.message.replace(/\n/g, '<br>')}</p>
        <hr>
        <p><small>This message was sent from your website contact form.</small></p>
      `;

      // For security, use a server-side API endpoint instead of exposing SMTP credentials client-side
      // This simulates form submission to a backend service
      fetch('https://formsubmit.co/santanupanda445@gmail.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          subject: formData.subject || "New contact form submission",
          message: formData.message
        })
      })
      .then(response => {
        if (response.ok) {
          console.log('Email sent successfully via FormSubmit.co!');
          setFormStatus({ submitted: true, loading: false, error: null });
          
          // Reset form data after successful submission
          setFormData({
            name: '',
            email: '',
            subject: '',
            message: ''
          });
        } else {
          throw new Error('Failed to send message through FormSubmit.co');
        }
      })
      .catch(error => {
        console.error('FormSubmit.co error:', error);
        setFormStatus({ 
          submitted: false, 
          loading: false, 
          error: error.message || "Failed to send email. Please try again later." 
        });
      });
    } catch (error) {
      console.error('Failed to send email:', error);
      setFormStatus({ 
        submitted: false, 
        loading: false, 
        error: error.message || "Failed to send email. Please try again later." 
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const inputClasses = "mt-1 block w-full px-5 py-4 bg-white rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-300 text-gray-700 text-base";

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onSubmit={handleSubmit}
      className="space-y-5"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label htmlFor="name" className="block font-medium text-gray-700 mb-1.5">
            Your Name <span className="text-purple-500">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={inputClasses}
            required
            placeholder="John Doe"
          />
        </div>

        <div>
          <label htmlFor="email" className="block font-medium text-gray-700 mb-1.5">
            Email Address <span className="text-purple-500">*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={inputClasses}
            required
            placeholder="john@example.com"
          />
        </div>
      </div>

      <div>
        <label htmlFor="subject" className="block font-medium text-gray-700 mb-1.5">
          Subject
        </label>
        <input
          type="text"
          id="subject"
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          className={inputClasses}
          placeholder="What's this about?"
        />
      </div>

      <div>
        <label htmlFor="message" className="block font-medium text-gray-700 mb-1.5">
          Your Message <span className="text-purple-500">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          rows={5}
          className={inputClasses}
          required
          placeholder="Tell us how we can help you..."
        />
      </div>

      <motion.button
        whileHover={{ scale: 1.02, boxShadow: "0 10px 25px -5px rgba(124, 58, 237, 0.5)" }}
        whileTap={{ scale: 0.98 }}
        disabled={formStatus.loading || formStatus.submitted}
        type="submit"
        className={`w-full mt-6 cursor-pointer py-4 px-8 rounded-xl font-semibold text-white transition-all duration-300 shadow-lg flex items-center justify-center space-x-2 ${
          formStatus.submitted 
            ? 'bg-green-600' 
            : formStatus.loading 
              ? 'bg-purple-400' 
              : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700'
        }`}
      >
        {formStatus.submitted ? (
          <>
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
            <span>Message Sent!</span>
          </>
        ) : formStatus.loading ? (
          <>
            <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Sending...</span>
          </>
        ) : (
          <>
            <span>Send Message</span>
            <svg className="w-5 h-5 ml-1 group-hover:translate-x-1 transition-transform" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </>
        )}
      </motion.button>
      
      {formStatus.error && (
        <div className="text-center text-sm text-red-500 mt-2">
          {formStatus.error}
        </div>
      )}
      
      <div className="text-center text-sm text-gray-500 mt-2">
        We'll never share your information with anyone. Messages are delivered directly to our inbox.
      </div>
    </motion.form>
  );
};

// 3D Membership Preview
const MembershipPreview = () => {
  const cardRef = useRef(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [selectedTier, setSelectedTier] = useState('premium');

  const membershipTiers = {
    basic: {
      name: "Basic",
      color: "from-blue-500 to-cyan-400",
      price: "$29",
      features: ["Gym Access", "Basic Equipment"]
    },
    premium: {
      name: "Premium",
      color: "from-purple-500 to-indigo-500",
      price: "$49",
      features: ["Full Access", "Group Classes", "Fitness Assessment"]
    },
    elite: {
      name: "Elite",
      color: "from-amber-500 to-rose-500",
      price: "$79",
      features: ["24/7 Access", "Personal Trainer", "Nutrition Plan", "Recovery Zone"]
    }
  };

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const mouseX = e.clientX;
    const mouseY = e.clientY;
    
    const rotateXValue = ((mouseY - centerY) / (rect.height / 2)) * -8;
    const rotateYValue = ((mouseX - centerX) / (rect.width / 2)) * 8;
    
    setRotateX(rotateXValue);
    setRotateY(rotateYValue);
  };
};

// Interactive Goal Tracker
const GoalTracker = () => {
  const [goalType, setGoalType] = useState('weight');
  const [progressValue, setProgressValue] = useState(67);
  const [isActive, setIsActive] = useState(false);
  
  const goals = {
    weight: {
      title: "Weight Loss",
      current: "176",
      target: "150",
      unit: "lbs",
      color: "from-amber-500 to-red-500"
    },
    strength: {
      title: "Strength Gain",
      current: "185",
      target: "225",
      unit: "lbs",
      color: "from-blue-500 to-indigo-600"
    },
    cardio: {
      title: "Cardio Endurance",
      current: "25",
      target: "45",
      unit: "min",
      color: "from-emerald-500 to-teal-600"
    }
  };

  useEffect(() => {
    if (isActive) {
      const interval = setInterval(() => {
        setProgressValue(prev => {
          const newValue = prev + (Math.random() * 4 - 2);
          return Math.min(Math.max(newValue, 0), 100);
        });
      }, 2000);
      
      return () => clearInterval(interval);
    }
  }, [isActive]);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-white/80 backdrop-blur-lg p-6 rounded-2xl shadow-xl border border-purple-100/70 relative overflow-hidden"
    >

      
      <div className="relative">
        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
          <svg className="w-6 h-6 text-purple-600 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          Fitness Goal Tracker
        </h3>
        
        <div className="flex space-x-3 mb-6">
          {Object.keys(goals).map((type) => (
            <motion.button
              key={type}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setGoalType(type)}
              className={`py-1.5 px-3 rounded-lg text-sm font-medium transition-all ${
                goalType === type 
                  ? `bg-gradient-to-r ${goals[type].color} text-white` 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {goals[type].title}
            </motion.button>
          ))}
        </div>
        
        <div className="bg-gray-50 p-5 rounded-xl">
          <div className="flex justify-between mb-2">
            <div className="text-gray-500 text-sm">Current</div>
            <div className="text-gray-500 text-sm">Target</div>
          </div>
          
          <div className="flex justify-between mb-4">
            <div className="text-2xl font-bold text-gray-900">{goals[goalType].current} {goals[goalType].unit}</div>
            <div className="text-2xl font-bold text-gray-900">{goals[goalType].target} {goals[goalType].unit}</div>
          </div>
          
          <div className="relative h-4 bg-gray-200 rounded-full overflow-hidden mb-4">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressValue}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className={`absolute top-0 left-0 h-full bg-gradient-to-r ${goals[goalType].color} rounded-full`}
            ></motion.div>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="text-sm font-medium">
              {progressValue.toFixed(1)}% Complete
            </div>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsActive(!isActive)}
              className={`py-1.5 px-4 rounded-lg text-sm font-medium ${
                isActive 
                  ? 'bg-gray-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {isActive ? 'Tracking...' : 'Simulate Progress'}
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Interactive Chat Simulation
const ChatSimulation = () => {
  const [chatActive, setChatActive] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  
  const handleStartChat = () => {
    setChatActive(true);
    // Initial greeting message
    setTimeout(() => {
      setMessages([
        { text: "Hi there! How can we help you today?", isUser: false }
      ]);
    }, 500);
  };
  
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    
    // Add user message
    setMessages(prev => [...prev, { text: inputValue, isUser: true }]);
    setInputValue('');
    
    // Simulate response after delay
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        text: "Thanks for reaching out! One of our team members will get back to you soon.", 
        isUser: false 
      }]);
    }, 1000);
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="bg-white mt-4 rounded-2xl shadow-lg border border-purple-100/50 overflow-hidden"
    >
      {!chatActive ? (
        <div className="p-6 text-center">
          <div className="inline-block bg-purple-100 p-4 rounded-full mb-4">
            <svg className="w-8 h-8 text-purple-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Live Chat Simulation</h3>
          <p className="text-gray-600 mb-4">Get a taste of our responsive customer service</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleStartChat}
            className="py-3 px-6 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-medium"
          >
            Start Chat Demo
          </motion.button>
        </div>
      ) : (
        <div className="h-80 flex flex-col">
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-4 text-white flex items-center">
            <div className="w-3 h-3 rounded-full bg-green-400 mr-2"></div>
            <h3 className="font-medium">FitLife Support</h3>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-3">
            {messages.map((msg, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`max-w-3/4 ${msg.isUser ? 'ml-auto' : 'mr-auto'}`}
              >
                <div className={`p-3 rounded-xl ${msg.isUser ? 'bg-purple-600 text-white' : 'bg-white border border-gray-200 text-gray-800'}`}>
                  {msg.text}
                </div>
              </motion.div>
            ))}
          </div>
          
          <form onSubmit={handleSendMessage} className="p-3 border-t border-gray-200 bg-white">
            <div className="flex">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-500"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-purple-600 text-white rounded-r-lg hover:bg-purple-700 transition-colors duration-300"
              >
                <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </form>
        </div>
      )}
    </motion.div>
  );
};

// Main Contact Component
const Contact = () => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState({ message: "", success: false });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  return (
    <section id="contact" className="py-24 bg-gradient-to-b from-gray-50 via-purple-50 to-violet-100 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ 
            scale: [1, 1.05, 1],
            opacity: [0.3, 0.4, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 -right-32 w-96 h-96 rounded-full bg-purple-200 mix-blend-multiply opacity-30 blur-3xl"
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-1/3 -left-32 w-80 h-80 rounded-full bg-indigo-200 mix-blend-multiply opacity-30 blur-3xl"
        />
      </div>
      
      <div className="container mx-auto px-6 sm:px-8 md:px-12 lg:px-16 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <motion.div 
            initial={{ width: 0 }}
            whileInView={{ width: '120px' }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="h-1.5 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full mx-auto mb-6"
          />
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">Get in Touch</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Have questions about our fitness programs or membership plans? We're here to help!
          </p>
          
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          <div className="order-2 lg:order-1 lg:col-span-2 space-y-6">
            <MembershipPreview />
            <GoalTracker />
            <ChatSimulation />
          </div>

          <div className="order-1 lg:order-2 lg:col-span-3">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="bg-white p-8 sm:p-10 rounded-2xl shadow-xl border border-purple-100/50 relative overflow-hidden"
            >
              {/* Decorative corner accent */}
              <div className="absolute -top-10 -right-10 w-20 h-20 bg-purple-500/10 rounded-full"></div>
              <div className="absolute -bottom-10 -left-10 w-20 h-20 bg-indigo-500/10 rounded-full"></div>
              
              <div className="relative">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Send us a Message</h3>
                <p className="text-gray-600 mb-6">
                  We'll get back to you as soon as possible. Messages will be sent to our email address.
                </p>
                
                <ContactForm />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact; 