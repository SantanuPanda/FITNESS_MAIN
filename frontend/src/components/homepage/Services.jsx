import { motion } from 'framer-motion';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5 }
};

const ServiceCard = ({ title, description, imageUrl, features, index }) => {
  // Function to handle Learn More button click
  const handleLearnMore = () => {
    // Create a search query based on the service title
    const searchQuery = encodeURIComponent(`fitness ${title.toLowerCase()}`);
    // Open Google search in a new tab
    window.open(`https://www.google.com/search?q=${ `what is`+ searchQuery}`, '_blank');
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      whileHover={{ y: -8, transition: { duration: 0.3 } }}
      className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden h-full border border-purple-100 group"
    >
      <div className="h-52 overflow-hidden relative">
        <motion.div
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.6 }}
          className="h-full w-full"
        >
          <img 
            src={imageUrl} 
            alt={title} 
            className="w-full h-full object-cover transform transition-transform group-hover:scale-105 duration-700"
            loading="lazy"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://placehold.co/600x400/purple/white?text=Fitness';
            }}
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <h3 className="text-white font-bold text-xl">{title}</h3>
        </div>
      </div>
      <div className="p-6 relative">
        <h3 className="text-xl font-bold mb-3 text-gray-900 group-hover:text-purple-700 transition-colors duration-300">{title}</h3>
        <p className="text-gray-600 mb-5 leading-relaxed">{description}</p>
        {features && (
          <div className="mb-6">
            <h4 className="text-sm font-semibold text-purple-800 mb-3 uppercase tracking-wider">Features</h4>
            <ul className="space-y-2">
              {features.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-purple-600 mr-2 flex-shrink-0 mt-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                    </svg>
                  </span>
                  <span className="text-gray-700 text-sm">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        <motion.button
          whileHover={{ scale: 1.05, x: 5 }}
          whileTap={{ scale: 0.95 }}
          className="w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg text-sm font-medium shadow-md hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300 flex items-center justify-center group"
          onClick={handleLearnMore}
        >
          Learn More
          <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
          </svg>
        </motion.button>
      </div>
    </motion.div>
  );
};

const FeaturedService = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="mb-20 bg-gradient-to-r from-purple-50 via-fuchsia-50 to-violet-100 rounded-2xl overflow-hidden shadow-xl border border-purple-100"
    >
    </motion.div>
  );
};

const Services = () => {
  const services = [
    {
      title: "Personal Training",
      description: "One-on-one sessions with expert trainers to achieve your specific fitness goals.",
      imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      features: [
        "Customized workout plans",
        "Progress tracking",
        "Nutritional guidance",
        "Flexible scheduling"
      ]
    },
    {
      title: "Group Classes",
      description: "High-energy group workouts led by experienced instructors in a motivating environment.",
      imageUrl: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      features: [
        "HIIT workouts",
        "Spinning classes",
        "Yoga & pilates",
        "Bootcamp sessions"
      ]
    },
    {
      title: "Strength Training",
      description: "Build muscle, increase strength, and improve overall body composition with expert guidance.",
      imageUrl: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      features: [
        "Weightlifting techniques",
        "Muscle-specific routines",
        "Form correction",
        "Progressive overload plans"
      ]
    },
    {
      title: "Nutrition Planning",
      description: "Customized meal plans and nutritional guidance to support your fitness journey.",
      imageUrl: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      features: [
        "Personalized meal plans",
        "Macro calculation",
        "Supplement guidance",
        "Ongoing adjustments"
      ]
    },
    {
      title: "Weight Loss Programs",
      description: "Scientifically-backed weight loss programs that deliver sustainable results.",
      imageUrl: "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      features: [
        "Targeted fat loss",
        "Metabolic conditioning",
        "Habit formation",
        "Mental coaching"
      ]
    },
    {
      title: "Recovery & Wellness",
      description: "Comprehensive recovery services to optimize performance and prevent injuries.",
      imageUrl: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      features: [
        "Mobility sessions",
        "Massage therapy",
        "Stretching routines",
        "Injury prevention"
      ]
    }
  ];

  return (
    <section id="services" className="py-24 bg-gradient-to-b from-white via-gray-50 to-purple-50 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -right-32 w-96 h-96 rounded-full bg-purple-100 mix-blend-multiply opacity-30 blur-3xl"></div>
        <div className="absolute bottom-1/3 -left-32 w-80 h-80 rounded-full bg-indigo-100 mix-blend-multiply opacity-30 blur-3xl"></div>
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
          
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">Our Services</h2>
          <p className="text-xl text-gray-700 leading-relaxed">
            Discover our comprehensive range of fitness services designed to help you reach your goals,
            no matter where you are in your fitness journey.
          </p>
        </motion.div>

        <FeaturedService />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
          {services.map((service, index) => (
            <ServiceCard key={index} {...service} index={index} />
          ))}
        </div>
        
        {/* Call to action */}
        
      </div>
    </section>
  );
};

export default Services; 