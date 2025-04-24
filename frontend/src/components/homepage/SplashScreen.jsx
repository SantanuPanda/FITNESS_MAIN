import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import logo from '../../assets/logo.png';

const SplashScreen = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const canvasRef = useRef(null);
  
  // Handle canvas animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    
    // Set canvas dimensions
    const setCanvasDimensions = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    setCanvasDimensions();
    window.addEventListener('resize', setCanvasDimensions);
    
    // Create particles
    const particles = [];
    const particleCount = 80;
    
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 5 + 1,
        speedX: Math.random() * 1 - 0.5,
        speedY: Math.random() * 1 - 0.5,
        color: `rgba(${80 + Math.random() * 50}, ${70 + Math.random() * 40}, ${230 + Math.random() * 25}, ${0.2 + Math.random() * 0.3})`,
      });
    }
    
    // Draw gradient background
    const drawBackground = () => {
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, '#0f172a');
      gradient.addColorStop(1, '#1e293b');
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Add grid
      ctx.strokeStyle = 'rgba(99, 102, 241, 0.1)';
      ctx.lineWidth = 0.5;
      
      const gridSize = 50;
      
      // Horizontal grid lines
      for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }
      
      // Vertical grid lines
      for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
    };
    
    // Animate particles
    const animateParticles = () => {
      particles.forEach(particle => {
        particle.x += particle.speedX;
        particle.y += particle.speedY;
        
        // Wrap around edges
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.y > canvas.height) particle.y = 0;
        if (particle.y < 0) particle.y = canvas.height;
        
        // Draw particle
        ctx.fillStyle = particle.color;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
      });
    };
    
    // Add glow effects
    const addGlowEffects = () => {
      // Top left corner glow
      const gradient1 = ctx.createRadialGradient(0, 0, 0, 0, 0, 500);
      gradient1.addColorStop(0, 'rgba(79, 70, 229, 0.3)');
      gradient1.addColorStop(1, 'rgba(79, 70, 229, 0)');
      ctx.fillStyle = gradient1;
      ctx.fillRect(0, 0, 500, 500);
      
      // Bottom right corner glow
      const gradient2 = ctx.createRadialGradient(canvas.width, canvas.height, 0, canvas.width, canvas.height, 500);
      gradient2.addColorStop(0, 'rgba(139, 92, 246, 0.2)');
      gradient2.addColorStop(1, 'rgba(139, 92, 246, 0)');
      ctx.fillStyle = gradient2;
      ctx.fillRect(canvas.width - 500, canvas.height - 500, 500, 500);
      
      // Center pulsating glow
      const centerGradient = ctx.createRadialGradient(
        canvas.width / 2,
        canvas.height / 2,
        0,
        canvas.width / 2,
        canvas.height / 2,
        200 + Math.sin(Date.now() * 0.001) * 50
      );
      centerGradient.addColorStop(0, 'rgba(99, 102, 241, 0.1)');
      centerGradient.addColorStop(0.5, 'rgba(79, 70, 229, 0.05)');
      centerGradient.addColorStop(1, 'rgba(79, 70, 229, 0)');
      ctx.fillStyle = centerGradient;
      ctx.beginPath();
      ctx.arc(canvas.width / 2, canvas.height / 2, 200 + Math.sin(Date.now() * 0.001) * 50, 0, Math.PI * 2);
      ctx.fill();
    };
    
    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawBackground();
      animateParticles();
      addGlowEffects();
      animationFrameId = requestAnimationFrame(animate);
    };
    
    animate();
    
    // Clean up
    return () => {
      window.removeEventListener('resize', setCanvasDimensions);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);
  
  // Simulate loading progress
  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + Math.random() * 5;
        return newProgress >= 100 ? 100 : newProgress;
      });
    }, 150);
    
    return () => clearInterval(progressInterval);
  }, []);
  
  // Complete splash screen when progress reaches 100%
  useEffect(() => {
    if (progress === 100) {
      const timer = setTimeout(() => {
        onComplete && onComplete();
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [progress, onComplete]);
  
  return (
    <div className="fixed inset-0 w-full h-screen flex flex-col items-center justify-center overflow-hidden bg-slate-900 z-50">
      {/* Canvas background */}
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 z-0"
      />
      
      {/* 3D Animated Logo */}
      <div style={{ perspective: "1000px" }}>
        <motion.div 
          className="relative mb-16"
          style={{ transformStyle: "preserve-3d" }}
          animate={{
            y: [0, -15, 0],
            scale: [1, 1.05, 1]
          }}
          transition={{
            y: { duration: 3, repeat: Infinity, ease: "easeInOut" },
            scale: { duration: 4, repeat: Infinity, ease: "easeInOut" }
          }}
        >
          {/* Logo Image with 3D Effect */}
          <motion.img 
            src={logo} 
            alt="Fitness Logo" 
            className="relative w-48 h-48 object-contain"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ 
              opacity: 1, 
              scale: 1,
              filter: [
                'drop-shadow(0 0 20px rgba(99, 102, 241, 0.7))',
                'drop-shadow(0 0 30px rgba(99, 102, 241, 0.9))',
                'drop-shadow(0 0 20px rgba(99, 102, 241, 0.7))'
              ]
            }}
            transition={{ 
              opacity: { duration: 0.5, delay: 0.2 },
              scale: { duration: 0.5, delay: 0.2 },
              filter: { duration: 3, repeat: Infinity, ease: "easeInOut" }
            }}
            style={{
              filter: 'drop-shadow(0 0 20px rgba(99, 102, 241, 0.7))'
            }}
          />
          
          {/* Orbiting particles */}
          {[...Array(12)].map((_, i) => (
            <motion.div 
              key={i}
              className="absolute rounded-full"
              style={{
                width: `${6 + i % 3 * 2}px`,
                height: `${6 + i % 3 * 2}px`,
                background: `rgba(${120 + i * 20}, ${100 + i * 10}, 255, 0.8)`,
                top: '50%',
                left: '50%',
                boxShadow: `0 0 10px rgba(79, 70, 229, 0.8), 0 0 20px rgba(79, 70, 229, 0.4)`
              }}
              animate={{ 
                x: `calc(-50% + ${Math.cos(2 * Math.PI * i / 12) * (100 + i * 5)}px)`,
                y: `calc(-50% + ${Math.sin(2 * Math.PI * i / 12) * (100 + i * 5)}px)`,
                scale: [1, 1.5, 1],
                opacity: [0.7, 1, 0.7]
              }}
              transition={{ 
                x: { duration: 10, repeat: Infinity, ease: "linear", delay: i * 0.2 },
                y: { duration: 10, repeat: Infinity, ease: "linear", delay: i * 0.2 },
                scale: { duration: 2, repeat: Infinity, ease: "easeInOut", delay: i * 0.2 },
                opacity: { duration: 2, repeat: Infinity, ease: "easeInOut", delay: i * 0.2 }
              }}
            />
          ))}
          
          {/* 3D Glow effect */}
          <motion.div 
            className="absolute rounded-full blur-3xl"
            style={{
              width: "200px",
              height: "200px",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%) translateZ(-30px)",
              background: "radial-gradient(circle, rgba(99, 102, 241, 0.8) 0%, rgba(79, 70, 229, 0.3) 50%, transparent 70%)"
            }}
            animate={{ 
              scale: [1, 1.3, 1],
              opacity: [0.4, 0.7, 0.4]
            }}
            transition={{ 
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </motion.div>
      </div>
      
      {/* 3D Progress Bar */}
      <div className="relative w-64 z-10">
        <motion.div 
          className="w-full h-2 bg-gray-800/50 rounded-full overflow-hidden"
          style={{
            perspective: "1000px",
            transformStyle: "preserve-3d",
            transform: "rotateX(45deg)",
            boxShadow: "0 5px 15px rgba(0, 0, 0, 0.2)"
          }}
        >
          <motion.div 
            className="h-full rounded-full"
            initial={{ width: "0%" }}
            animate={{ width: `${progress}%` }}
            style={{
              background: "linear-gradient(90deg, rgba(79, 70, 229, 0.9), rgba(139, 92, 246, 0.9))",
              boxShadow: "inset 0 0 10px rgba(255, 255, 255, 0.3)"
            }}
          />
        </motion.div>
        
        {/* Loading Text */}
        <motion.div 
          className="text-center mt-4 text-indigo-300 text-sm font-medium tracking-wider"
          animate={{ 
            opacity: [0.7, 1, 0.7],
            y: [0, -3, 0]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{
            textShadow: "0 0 10px rgba(79, 70, 229, 0.6)"
          }}
        >
          {progress < 100 ? "LOADING..." : "READY"}
        </motion.div>
      </div>
    </div>
  );
};

export default SplashScreen; 