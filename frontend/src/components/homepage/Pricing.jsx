import { motion } from 'framer-motion';
import { useState } from 'react';

const PricingCard = ({ title, price, features, isPopular, delay, onGetStarted }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  // Convert USD to INR (approximate conversion rate)
  const inrPrice = Math.round(price * 83);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
      whileHover={{ 
        y: -12, 
        boxShadow: isPopular 
          ? "0 30px 60px -15px rgba(124, 58, 237, 0.35)" 
          : "0 30px 60px -15px rgba(124, 58, 237, 0.25)"
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={`relative p-6 sm:p-8 rounded-3xl overflow-hidden h-full flex flex-col ${
        isPopular 
          ? 'bg-gradient-to-br from-purple-600 to-indigo-700 text-white border-2 border-purple-400/30 shadow-xl shadow-purple-500/30' 
          : 'bg-white/95 backdrop-blur-lg text-gray-800 border border-purple-100/80 shadow-lg shadow-purple-200/30'
      }`}
    >
      {/* Decorative elements */}
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-purple-400/10 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-indigo-400/10 rounded-full blur-3xl"></div>
      
      {/* Diagonal stripe decorations */}
      <div className={`absolute -top-2 -right-2 w-24 h-24 rotate-45 ${isPopular ? 'bg-indigo-500/10' : 'bg-purple-200/30'}`}></div>
      <div className={`absolute -bottom-2 -left-2 w-24 h-24 rotate-45 ${isPopular ? 'bg-indigo-500/10' : 'bg-purple-200/30'}`}></div>
      
      {isPopular && (
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
          className="absolute top-[calc(var(--spacing) * 5)] -right-22 rotate-45 w-64 bg-gradient-to-r from-amber-400 to-yellow-500 py-1.5 text-center text-sm font-bold text-black shadow-md shadow-amber-500/20"
        >
           POPULAR
        </motion.div>
      )}
      
      <div className="relative z-10 mb-6">
        <motion.span 
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: delay + 0.1 }}
          className={`inline-block mb-2 text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full ${
            isPopular ? 'bg-white/20 text-white' : 'bg-purple-100 text-purple-700'
          }`}
        >
          {title}
        </motion.span>
        <h3 className={`text-2xl font-bold mb-4 ${isPopular ? 'text-white' : 'text-gray-800'}`}>{title} Plan</h3>
        
        <div className="flex items-baseline mb-1">
          <span className={`text-lg font-medium mr-1 ${isPopular ? 'text-purple-200' : 'text-purple-500'}`}>₹</span>
          <span className={`text-5xl font-extrabold ${isPopular ? 'text-white' : 'text-gray-800'}`}>{inrPrice}</span>
          <span className={`text-lg ml-1 ${isPopular ? 'text-purple-200' : 'text-gray-500'}`}>/month</span>
        </div>
        
        <div className={`h-1 w-16 rounded-full mb-6 ${isPopular ? 'bg-purple-300/40' : 'bg-purple-200'}`}></div>
      </div>

      <ul className="space-y-3 mb-8 flex-grow relative z-10">
        {features.map((feature, index) => (
          <motion.li
            key={index}
            initial={{ opacity: 0, x: -15 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: delay + index * 0.08 }}
            className="flex items-start"
          >
            <span className={`flex-shrink-0 mr-3 mt-1 ${isPopular ? 'text-yellow-300' : 'text-purple-500'}`}>
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7 13L10 16L17 9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
            <span className={`text-base leading-relaxed ${isPopular ? 'text-gray-100' : 'text-gray-600'}`}>{feature}</span>
          </motion.li>
        ))}
      </ul>

      <motion.button
        onClick={onGetStarted}
        whileHover={{ 
          scale: 1.03,
          boxShadow: isPopular 
            ? "0 10px 25px -5px rgba(255, 255, 255, 0.2)" 
            : "0 10px 25px -5px rgba(124, 58, 237, 0.3)",
        }}
        whileTap={{ scale: 0.97 }}
        className={`relative z-10 w-full py-4 px-6 rounded-xl font-semibold text-base transition-all duration-300 ${
          isPopular
            ? 'bg-white text-purple-700 hover:bg-gray-50 shadow-lg shadow-white/10'
            : 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/20'
        } flex items-center justify-center group overflow-hidden`}
      >
        <span className="relative z-10">Get Started</span>
        <motion.span
          animate={{
            x: isHovered ? 4 : 0
          }}
          transition={{ type: "spring", stiffness: 400, damping: 15 }}
          className="relative z-10 ml-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
          </svg>
        </motion.span>
        
        {/* Button background animation */}
        <motion.div 
          className={`absolute inset-0 ${
            isPopular ? 'bg-gray-100' : 'bg-gradient-to-r from-indigo-600 to-purple-600'
          }`}
          initial={{ x: "-100%" }}
          animate={{ x: isHovered ? "0%" : "-100%" }}
          transition={{ type: "tween", ease: "easeInOut", duration: 0.3 }}
          style={{ zIndex: 1 }}
        />
      </motion.button>
      
      {/* Sale badge for non-popular plans */}
      {!isPopular && (
        <div className="absolute top-8 right-8">
          <motion.div 
            initial={{ rotate: -10, scale: 0.9, opacity: 0 }}
            animate={{ rotate: 0, scale: 1, opacity: 1 }}
            transition={{ delay: delay + 0.3, duration: 0.4 }}
            className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-1 rounded-full flex items-center"
          >
            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1.464-6.428a.75.75 0 11-1.06-1.06l2.5-2.5a.75.75 0 011.137.02l2.5 2.75a.75.75 0 01-1.106 1.016l-1.971-2.168L8.536 11.57z" clipRule="evenodd" />
            </svg>
            SAVE ₹{title === "Basic" ? "830" : "1660"}
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-md border border-purple-100/30 overflow-hidden">
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-6 text-left flex justify-between items-center"
        whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.9)" }}
      >
        <h4 className="text-lg font-semibold text-gray-900">{question}</h4>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="text-purple-600"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
          </svg>
        </motion.div>
      </motion.button>
      
      <motion.div
        initial={false}
        animate={{ 
          height: isOpen ? "auto" : 0,
          opacity: isOpen ? 1 : 0
        }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden bg-gray-50/50"
      >
        <p className="p-6 text-gray-700">{answer}</p>
      </motion.div>
    </div>
  );
};

const Pricing = () => {
  const [showPopup, setShowPopup] = useState(false);
  
  const handleGetStarted = () => {
    setShowPopup(true);
    
    // Hide popup after 3 seconds
    setTimeout(() => {
      setShowPopup(false);
    }, 3000);
  };

  const plans = [
    {
      title: "Basic",
      price: 29,
      features: [
        "Access to gym facilities",
        "Basic equipment usage",
        "Locker room access",
        "Free parking",
        "2 group classes/month",
        "Mobile app access"
      ],
      isPopular: false,
      delay: 0.2
    },
    {
      title: "Premium",
      price: 49,
      features: [
        "All Basic features",
        "Unlimited group classes",
        "Personal trainer (2x/month)",
        "Nutrition consultation",
        "Spa access",
        "Advanced fitness tracking"
      ],
      isPopular: true,
      delay: 0.4
    },
    {
      title: "Elite",
      price: 79,
      features: [
        "All Premium features",
        "Unlimited personal training",
        "Custom meal planning",
        "Priority booking for classes",
        "Exclusive member events",
        "VIP lounge access"
      ],
      isPopular: false,
      delay: 0.6
    }
  ];

  const faqs = [
    {
      question: "Can I cancel my membership anytime?",
      answer: "Yes, you can cancel your membership at any time. We offer a 30-day money-back guarantee for all new members. To cancel, simply log into your account or visit our gym location in person."
    },
    {
      question: "How do I upgrade my plan?",
      answer: "You can easily upgrade your plan through your account dashboard or by speaking with our membership services team. Any upgrade will be prorated for the remainder of your billing cycle."
    },
    {
      question: "Do you offer corporate memberships?",
      answer: "Yes, we offer special rates for corporate memberships. Our corporate plans include custom packages based on company size and needs. Please contact our sales team for more information and to discuss options that would work best for your organization."
    },
    {
      question: "What amenities are included in each plan?",
      answer: "Each plan includes different amenities as outlined in the plan details. The Basic plan includes essential gym access, while Premium adds unlimited classes and certain wellness services. The Elite plan includes all amenities including personalized training and VIP access to all facilities."
    }
  ];

  return (
    <section id="pricing" className="py-24 bg-gradient-to-b from-gray-50 via-purple-50 to-violet-100 relative overflow-hidden">
      {/* Global Popup Notification */}
      {showPopup && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center"
        >
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowPopup(false)}></div>
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="bg-blue-500 text-white py-4 px-8 rounded-xl shadow-2xl relative z-10 max-w-md text-center"
          >
            <div className="flex items-center justify-center mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-xl font-bold">Coming Soon</h3>
            </div>
            <p className="mb-4">We're working on this feature. Please check back later!</p>
            <button 
              onClick={() => setShowPopup(false)}
              className="bg-white text-blue-500 px-4 py-2 rounded-lg font-medium hover:bg-blue-50 transition-colors"
            >
              Close
            </button>
          </motion.div>
        </motion.div>
      )}
      
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
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20 max-w-3xl mx-auto"
        >
          <motion.div 
            initial={{ width: 0 }}
            whileInView={{ width: '120px' }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="h-1.5 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full mx-auto mb-6"
          />
          
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">Membership Plans</h2>
          <p className="text-xl text-gray-700 leading-relaxed">
            Select the perfect membership plan that fits your fitness goals and budget. 
            Upgrade or downgrade anytime with no hassle.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
          {plans.map((plan, index) => (
            <PricingCard 
              key={index} 
              {...plan} 
              onGetStarted={handleGetStarted}
            />
          ))}
        </div>
        
        {/* Comparison table (visible on mobile) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mt-20 md:hidden"
        >
          <h3 className="text-2xl font-bold text-center text-gray-900 mb-6">Compare Plans</h3>
          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-md border border-purple-100/30">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="text-left py-3 px-4 border-b border-gray-200">Feature</th>
                    <th className="text-center py-3 px-4 border-b border-gray-200">Basic</th>
                    <th className="text-center py-3 px-4 border-b border-gray-200">Premium</th>
                    <th className="text-center py-3 px-4 border-b border-gray-200">Elite</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="py-3 px-4 border-b border-gray-200">Price</td>
                    <td className="text-center py-3 px-4 border-b border-gray-200">$29</td>
                    <td className="text-center py-3 px-4 border-b border-gray-200 font-bold text-purple-700">$49</td>
                    <td className="text-center py-3 px-4 border-b border-gray-200">$79</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 border-b border-gray-200">Group Classes</td>
                    <td className="text-center py-3 px-4 border-b border-gray-200">2/month</td>
                    <td className="text-center py-3 px-4 border-b border-gray-200">Unlimited</td>
                    <td className="text-center py-3 px-4 border-b border-gray-200">Unlimited</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 border-b border-gray-200">Personal Training</td>
                    <td className="text-center py-3 px-4 border-b border-gray-200">—</td>
                    <td className="text-center py-3 px-4 border-b border-gray-200">2/month</td>
                    <td className="text-center py-3 px-4 border-b border-gray-200">Unlimited</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Pricing; 