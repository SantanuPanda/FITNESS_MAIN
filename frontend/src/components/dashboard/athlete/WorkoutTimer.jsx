import React, { useState, useEffect, useCallback } from 'react';

const WorkoutTimer = ({ duration, onFinish }) => {
  const [timeLeft, setTimeLeft] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // Parse duration string (e.g., "30 min") into seconds
  const parseDuration = useCallback((durationStr) => {
    if (!durationStr) return 0;
    
    // Try to match "X min" format
    let match = durationStr.match(/(\d+)\s*min/i);
    if (match && match[1]) {
      return parseInt(match[1]) * 60; // Convert minutes to seconds
    }
    
    // Try to match "X minutes" format
    match = durationStr.match(/(\d+)\s*minutes?/i);
    if (match && match[1]) {
      return parseInt(match[1]) * 60; // Convert minutes to seconds
    }
    
    // Try to match "X hr Y min" format
    match = durationStr.match(/(\d+)\s*hr\s*(?:(\d+)\s*min)?/i);
    if (match) {
      const hours = parseInt(match[1] || 0);
      const minutes = parseInt(match[2] || 0);
      return (hours * 60 * 60) + (minutes * 60);
    }
    
    // Try to match just numbers (assuming minutes)
    match = durationStr.match(/^(\d+)$/);
    if (match && match[1]) {
      return parseInt(match[1]) * 60; // Assume it's minutes
    }
    
    // Default to 30 minutes (1800 seconds) if no format matches
    console.log("Duration format not recognized, defaulting to 30 min:", durationStr);
    return 30 * 60;
  }, []);

  // Format seconds into MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Initialize timer when duration changes
  useEffect(() => {
    const totalSeconds = parseDuration(duration);
    setTimeLeft(totalSeconds);
  }, [duration, parseDuration]);

  // Start, pause, resume timer
  const toggleTimer = () => {
    if (!isActive) {
      setIsActive(true);
      setIsPaused(false);
    } else if (isPaused) {
      setIsPaused(false);
    } else {
      setIsPaused(true);
    }
  };

  // Reset timer
  const resetTimer = () => {
    setIsActive(false);
    setIsPaused(false);
    setTimeLeft(parseDuration(duration));
  };

  // Timer countdown effect
  useEffect(() => {
    let interval = null;

    if (isActive && !isPaused) {
      interval = setInterval(() => {
        setTimeLeft((timeLeft) => {
          if (timeLeft <= 1) {
            clearInterval(interval);
            setIsActive(false);
            if (onFinish) onFinish();
            return 0;
          }
          return timeLeft - 1;
        });
      }, 1000);
    } else {
      clearInterval(interval);
    }

    return () => {
      clearInterval(interval);
    };
  }, [isActive, isPaused, onFinish]);

  // Calculate progress percentage
  const progress = timeLeft ? (timeLeft / parseDuration(duration)) * 100 : 0;

  return (
    <div className="workout-timer p-4 border border-gray-200 rounded-lg bg-white shadow-sm">
      <div className="flex flex-col items-center">
        <h3 className="text-lg font-medium text-gray-800 mb-2">Workout Timer</h3>
        
        {/* Timer display */}
        <div className="w-full relative mb-4">
          <div className="w-32 h-32 mx-auto rounded-full border-8 border-gray-100 flex items-center justify-center">
            <span className="text-2xl font-bold">{formatTime(timeLeft)}</span>
          </div>
          <svg className="absolute top-0 left-1/2 transform -translate-x-1/2" width="132" height="132" viewBox="0 0 132 132">
            <circle
              cx="66"
              cy="66"
              r="62"
              fill="none"
              stroke="#f3f4f6"
              strokeWidth="8"
            />
            <circle
              cx="66"
              cy="66"
              r="62"
              fill="none"
              stroke="#4f46e5"
              strokeWidth="8"
              strokeDasharray="389.56"
              strokeDashoffset={389.56 * (1 - progress / 100)}
              transform="rotate(-90 66 66)"
            />
          </svg>
        </div>
        
        {/* Controls */}
        <div className="flex space-x-3">
          <button
            onClick={toggleTimer}
            className={`px-4 py-2 rounded-md font-medium ${
              !isActive || isPaused
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-yellow-500 hover:bg-yellow-600 text-white'
            }`}
          >
            {!isActive ? 'Start' : isPaused ? 'Resume' : 'Pause'}
          </button>
          <button
            onClick={resetTimer}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md font-medium hover:bg-gray-300"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
};

export default WorkoutTimer; 