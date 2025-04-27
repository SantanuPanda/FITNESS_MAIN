import React, { useState, useEffect, useRef, useCallback, Suspense } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import * as storage from '../services/storageService';
import * as uploadService from '../services/storageService';

// Dummy data for profile page if real data fails to load
const fallbackUserData = {
  name: 'Fitness User',
  email: 'user@example.com',
  userType: 'User',
  joinedDate: new Date().toLocaleDateString(),
  photoURL: 'https://via.placeholder.com/150?text=Profile'
};

// Optimized Profile Page Component
const ProfilePage = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const fileInputRef = useRef(null);
  
  // State management
  const [userData, setUserData] = useState(() => {
    // Initialize with basic data from auth to show something immediately
    let initialUserType = 'athlete';
    
    // Try to get the user type from localStorage if available
    try {
      if (currentUser) {
        const userId = currentUser.uid || currentUser._id || currentUser.id;
        
        // First check user-specific storage format
        const userSpecificData = JSON.parse(localStorage.getItem(`fitness_app_user_${userId}`) || 'null');
        if (userSpecificData && userSpecificData.userType) {
          initialUserType = userSpecificData.userType;
        } else {
          // Then check the global users data format
          const usersData = JSON.parse(localStorage.getItem('fitness_app_users_data') || '{}');
          if (usersData[userId] && usersData[userId].userType) {
            initialUserType = usersData[userId].userType;
          } else if (currentUser.userType) {
            // Finally fall back to auth context
            initialUserType = currentUser.userType;
          }
        }
      }
    } catch (error) {
      console.error('Error getting initial user type:', error);
    }
    
    return currentUser ? {
      name: currentUser.displayName || '',
      email: currentUser.email || '',
      userType: initialUserType, // Use the determined user type
      joinedDate: 'Loading...',
      photoURL: currentUser.photoURL || '',
    } : {
      name: '',
      email: '',
      userType: '',
      joinedDate: '',
      photoURL: '',
    };
  });
  
  const [isEditing, setIsEditing] = useState(false);
  const [nameInput, setNameInput] = useState(currentUser?.displayName || '');
  const [loading, setLoading] = useState(true);
  const [loadingState, setLoadingState] = useState('initial'); // 'initial', 'loading', 'success', 'error', 'partial'
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // If not logged in, redirect to login
  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    }
  }, [currentUser, navigate]);

  // Fetch user data with optimization
  useEffect(() => {
    let isMounted = true;
    let timeout;
    
    const fetchUserData = async () => {
      if (!currentUser) return;
      
      // Set loading state but keep displaying existing data
      setLoadingState('loading');
      
      try {
        // First set initial data from auth to show something immediately
        if (isMounted && currentUser.photoURL) {
          setUserData(prevData => ({
            ...prevData,
            photoURL: currentUser.photoURL
          }));
        }
        
        // Add timeout to prevent long loading
        const timeoutPromise = new Promise((_, reject) => {
          timeout = setTimeout(() => {
            reject(new Error('Loading timeout - using cached data'));
          }, 3000); // 3 seconds timeout
        });
        
        // Get user data from storage service
        const userDataResult = await Promise.race([
          storage.getUserData(currentUser.uid),
          timeoutPromise
        ]);
        
        // Clear timeout if we got data
        clearTimeout(timeout);
        
        // If component is unmounted, don't update state
        if (!isMounted) return;
        
        // Try to get the most accurate user type from multiple sources
        let bestUserType = null;
        try {
          // Try to get user type from all available sources
          const userId = currentUser.uid || currentUser._id || currentUser.id;
          
          // First check user-specific storage format
          const userSpecificData = JSON.parse(localStorage.getItem(`fitness_app_user_${userId}`) || 'null');
          if (userSpecificData && userSpecificData.userType) {
            bestUserType = userSpecificData.userType;
          } else {
            // Then check the global users data format
            const usersData = JSON.parse(localStorage.getItem('fitness_app_users_data') || '{}');
            if (usersData[userId] && usersData[userId].userType) {
              bestUserType = usersData[userId].userType;
            }
          }
        } catch (error) {
          console.error('Error getting best user type:', error);
        }
        
        if (userDataResult.success) {
          const data = userDataResult.data;
          
          // Use cached data first then update with new data
          // Use photoURL from data or from auth
          const photoFromStorage = data.photoURL || currentUser.photoURL;
          
          setUserData(prevData => ({
            name: data.name || currentUser.displayName || prevData.name || '',
            email: currentUser.email || prevData.email || '',
            userType: bestUserType || data.userType || currentUser.userType || prevData.userType || 'athlete',
            joinedDate: data.createdAt ? new Date(data.createdAt).toLocaleDateString() : prevData.joinedDate || 'N/A',
            photoURL: photoFromStorage || prevData.photoURL || '',
          }));
          
          setNameInput(data.name || currentUser.displayName || '');
          setLoadingState('success');
        } else {
          // User data not found - create default values with user photo
          const defaultUserData = {
            name: currentUser.displayName || '',
            email: currentUser.email || '',
            userType: bestUserType || currentUser.userType || 'athlete', // Use best user type if available
            joinedDate: 'New User',
            photoURL: currentUser.photoURL || '',
          };
          
          setUserData(defaultUserData);
          setNameInput(defaultUserData.name);
          setLoadingState('partial');
          
          // Create user data if it doesn't exist (non-blocking)
          storage.updateUserData(currentUser.uid, {
            name: defaultUserData.name,
            email: defaultUserData.email,
            userType: defaultUserData.userType,
            createdAt: new Date().toISOString(),
            photoURL: defaultUserData.photoURL,
          }).catch(error => {
            console.log('Error creating user data:', error);
          });
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        
        // If component is unmounted, don't update state
        if (!isMounted) return;
        
        // Use cached data from auth if available
        if (currentUser) {
          setLoadingState('partial');
          setUserData(prevData => ({
            ...prevData,
            photoURL: currentUser.photoURL || prevData.photoURL
          }));
          
          // Auto-clear error after 3 seconds
          setTimeout(() => {
            if (isMounted) setErrorMessage('');
          }, 3000);
        } else {
          setLoadingState('error');
          setErrorMessage('Failed to load profile. Please check your connection.');
        }
      } finally {
        // If component is unmounted, don't update state
        if (isMounted) {
          setLoading(false);
        }
      }
    };
    
    // Show basic profile immediately, then fetch details
    if (currentUser) {
      setLoading(false);
      fetchUserData();
    }
    
    // Cleanup function to prevent memory leaks and state updates after unmount
    return () => {
      isMounted = false;
      clearTimeout(timeout);
    };
  }, [currentUser]);

  // Memoized save profile function
  const handleSaveProfile = useCallback(async () => {
    if (!currentUser || !nameInput.trim()) {
      setErrorMessage('Name cannot be empty');
      return;
    }
    
    setIsSaving(true);
    setSuccessMessage('');
    setErrorMessage('');
    
    // Record start time to ensure minimum feedback time
    const startTime = Date.now();
    const minimumSaveTime = 1500; // 1.5 seconds minimum save time for better feedback
    
    try {
      console.log('Saving profile...', { nameInput });
      
      // Update user data with new name
      const result = await storage.updateUserData(currentUser.uid, {
        name: nameInput,
        updatedAt: new Date().toISOString()
      });
      
      if (result.success) {
        // Ensure minimum save time for better UX
        const elapsedTime = Date.now() - startTime;
        if (elapsedTime < minimumSaveTime) {
          await new Promise(resolve => setTimeout(resolve, minimumSaveTime - elapsedTime));
        }
        
        // Update local state
        setUserData(prev => ({
          ...prev,
          name: nameInput
        }));
        
        setIsEditing(false);
        setSuccessMessage('Profile updated successfully!');
        
        // Auto clear success message
        setTimeout(() => {
          setSuccessMessage('');
        }, 3000);
      } else {
        throw new Error(result.error || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      setErrorMessage('Failed to save profile. Please try again.');
      
      // Auto clear error message
      setTimeout(() => {
        setErrorMessage('');
      }, 5000);
    } finally {
      setIsSaving(false);
    }
  }, [currentUser, nameInput]);

  // Handle photo upload with optimistic UI update
  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    
    if (!file || !currentUser) return;
    
    // Validate file type
    const fileType = file.type;
    if (!fileType.startsWith('image/')) {
      setErrorMessage('Only image files are allowed.');
      return;
    }
    
    // Validate file size (max 2MB)
    const MAX_SIZE = 2 * 1024 * 1024; // 2MB
    if (file.size > MAX_SIZE) {
      setErrorMessage('File size must be less than 2MB.');
      return;
    }
    
    // Start upload
    setIsUploading(true);
    setUploadProgress(0);
    setErrorMessage('');
    
    try {
      // Show progress simulation
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          const next = prev + Math.random() * 15;
          return next > 90 ? 90 : next; // Cap at 90% until actual completion
        });
      }, 300);
      
      // Upload the photo using the storage service
      const uploadResult = await uploadService.uploadProfilePhoto(
        currentUser.uid,
        file,
        (progress) => {
          if (progress === 100) {
            clearInterval(progressInterval);
          }
          setUploadProgress(progress);
        }
      );
      
      // Clear interval just in case
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      if (uploadResult.success) {
        // Update UI immediately
        setUserData(prev => ({
          ...prev,
          photoURL: uploadResult.photoURL
        }));
        
        setSuccessMessage('Profile photo updated!');
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        throw new Error(uploadResult.error || 'Failed to update profile photo');
      }
    } catch (error) {
      console.error('Error uploading photo:', error);
      setErrorMessage('Failed to upload photo. Please try again.');
      setTimeout(() => setErrorMessage(''), 5000);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const getUserTypeLabel = () => {
    // Get userType from all possible sources for logging
    const authUserType = currentUser?.userType;
    const stateUserType = userData?.userType;
    
    // Try to get user type directly from localStorage as the most reliable source
    let storageUserType = null;
    try {
      // Try both storage formats
      const usersData = JSON.parse(localStorage.getItem('fitness_app_users_data') || '{}');
      const userId = currentUser?.uid || currentUser?._id || currentUser?.id;
      
      if (userId && usersData[userId]) {
        storageUserType = usersData[userId].userType;
      }
      
      // Also check user-specific storage
      const userData = JSON.parse(localStorage.getItem(`fitness_app_user_${userId}`) || 'null');
      if (userData && userData.userType) {
        // This should be the most reliable source
        storageUserType = userData.userType;
      }
    } catch (error) {
      console.error('Error getting user type from storage:', error);
    }
    
    console.log("User type sources:", { 
      fromAuth: authUserType, 
      fromState: stateUserType, 
      fromStorage: storageUserType 
    });
    
    // Prioritize storage value, then auth value, then state value
    // Handle case variations (Athlete, athlete, ATHLETE, etc.)
    const userType = (storageUserType || authUserType || stateUserType || 'athlete')?.toLowerCase()?.trim();
    console.log("Final user type used:", userType);
    
    switch (userType) {
      case 'athlete':
      case 'athletes':
      case 'player':
      case 'sport':
        return (
          <span className="bg-blue-100 text-blue-800 text-sm font-semibold px-4 py-2 rounded-full border border-blue-200 flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Athlete
          </span>
        );
      case 'nutritionist':
      case 'nutrition':
      case 'dietitian':
        return (
          <span className="bg-green-100 text-green-800 text-sm font-semibold px-4 py-2 rounded-full border border-green-200 flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 15.75c-3.75-1.5-6-4.5-6-10.5M3 15.75c3.75-1.5 6-4.5 6-10.5M10.5 19.5c2.25 0 4.5-1.5 5.25-4.5M10.5 19.5c-2.25 0-4.5-1.5-5.25-4.5" />
            </svg>
            Nutritionist
          </span>
        );
      case 'coach':
      case 'trainer':
      case 'instructor':
        return (
          <span className="bg-orange-100 text-orange-800 text-sm font-semibold px-4 py-2 rounded-full border border-orange-200 flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
            </svg>
            Coach
          </span>
        );
      default:
        // If we couldn't determine the type, default to Athlete
        return (
          <span className="bg-blue-100 text-blue-800 text-sm font-semibold px-4 py-2 rounded-full border border-blue-200 flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Athlete
          </span>
        );
    }
  };

  if (!currentUser) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-16 px-4 sm:px-6" onClick={e => e.stopPropagation()}>
      <div className="max-w-3xl mx-auto">
        {/* Back button - fixed to avoid splash screen */}
        <div className="mb-6">
          <button 
            className="flex items-center text-blue-600 hover:text-blue-800 bg-transparent border-none cursor-pointer"
            onClick={(e) => {
              e.preventDefault();
              // Clean up any resources before navigating
              if (userData.photoURL && userData.photoURL.startsWith('blob:')) {
                URL.revokeObjectURL(userData.photoURL);
              }
              
              // Use navigate with state to indicate we're coming from profile page
              navigate('/', { state: { skipSplash: true } });
            }}
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </button>
        </div>
        
        {/* Profile card */}
        <motion.div 
          className="bg-white rounded-xl shadow-lg overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Loading overlay */}
          <AnimatePresence>
            {loading && (
              <motion.div 
                className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10"
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex flex-col items-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                  <p className="mt-2 text-gray-600">Loading profile...</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-16 flex flex-col items-center justify-center relative">
            {/* Profile photo */}
            <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2">
              <div className="relative group">
                <img
                  src={userData.photoURL || 'https://via.placeholder.com/150'}
                  alt="Profile"
                  className="h-32 w-32 rounded-full object-cover border-4 border-white shadow-md"
                  onError={(e) => {
                    // If image fails to load (like CORS issues), use a fallback
                    e.target.onerror = null;
                    e.target.src = 'https://via.placeholder.com/150?text=Profile';
                  }}
                  crossOrigin="anonymous"
                  referrerPolicy="no-referrer"
                />
                
                {/* Upload button overlay */}
                <div 
                  className="absolute inset-0 rounded-full bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (!isUploading) {
                      // Reset the file input before opening it
                      if (fileInputRef.current) {
                        fileInputRef.current.value = '';
                      }
                      fileInputRef.current?.click();
                    }
                  }}
                >
                  {isUploading ? (
                    <div className="text-white text-sm">
                      <svg className="animate-spin h-6 w-6 text-white mx-auto mb-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Uploading...
                    </div>
                  ) : (
                    <div className="text-white text-sm">
                      <svg className="mx-auto h-6 w-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      </svg>
                      {userData.photoURL ? 'Change Photo' : 'Add Photo'}
                    </div>
                  )}
                </div>
                
                {/* Hidden file input */}
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  disabled={isUploading}
                  onClick={(e) => {
                    // Force the input to reset its value to ensure onChange fires even if 
                    // the same file is selected twice in a row
                    e.target.value = '';
                  }}
                />
              </div>
            </div>
          </div>
          
          {/* Profile details */}
          <div className="px-6 pt-20 pb-8">
            {/* Success and error messages */}
            <AnimatePresence>
              {successMessage && (
                <motion.div 
                  className="mb-4 p-2 bg-green-100 text-green-700 rounded"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {successMessage}
                </motion.div>
              )}
              
              {errorMessage && (
                <motion.div 
                  className="mb-4 p-2 bg-red-100 text-red-700 rounded"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {errorMessage}
                </motion.div>
              )}
            </AnimatePresence>
            
            <div className="py-1">
              {/* Display name */}
              <div className="mb-6">
                <h3 className="text-gray-500 text-sm font-medium mb-2">Display Name</h3>
                
                {isEditing ? (
                  <div className="flex items-center">
                    <input
                      type="text"
                      className="flex-1 h-10 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={nameInput}
                      onChange={e => setNameInput(e.target.value)}
                      placeholder="Your name"
                      disabled={isSaving}
                    />
                    <div className="flex space-x-2 ml-2">
                      <button
                        className="h-10 px-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50"
                        onClick={handleSaveProfile}
                        disabled={isSaving || !nameInput.trim()}
                      >
                        {isSaving ? (
                          <span className="flex items-center">
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Saving...
                          </span>
                        ) : (
                          'Save'
                        )}
                      </button>
                      <button
                        className="h-10 px-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
                        onClick={() => {
                          setIsEditing(false);
                          setNameInput(userData.name || '');
                        }}
                        disabled={isSaving}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-between items-center">
                    <p className="text-gray-800 text-lg font-medium">
                      {userData.name || 'Add your name'}
                    </p>
                    <button
                      className="text-blue-500 hover:text-blue-700 text-sm font-medium focus:outline-none"
                      onClick={() => setIsEditing(true)}
                    >
                      Edit
                    </button>
                  </div>
                )}
              </div>
              
              {/* User Type - Not Editable */}
              <div className="mb-6">
                <h3 className="text-gray-500 text-sm font-medium mb-2">Account Type</h3>
                <div className="flex flex-col">
                  <div className="flex items-center">
                    {getUserTypeLabel()}
                    <span className="ml-2 text-gray-500 text-sm">(Selected during signup - not editable)</span>
                  </div>
                  
                  <div className="mt-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-gray-600">
                        Not seeing the correct account type? Try refreshing your login session.
                      </p>
                      <button 
                        onClick={() => {
                          // Force a refresh of the component
                          setLoadingState('loading');
                          
                          // Attempt to refresh user data
                          const fetchUserType = async () => {
                            try {
                              const userId = currentUser?.uid || currentUser?._id || currentUser?.id;
                              if (!userId) return;
                              
                              // Try to get the most recent user type from storage
                              const usersData = JSON.parse(localStorage.getItem('fitness_app_users_data') || '{}');
                              const userSpecificData = JSON.parse(localStorage.getItem(`fitness_app_user_${userId}`) || 'null');
                              
                              let mostRecentUserType = null;
                              
                              // Check both storage locations
                              if (userSpecificData && userSpecificData.userType) {
                                mostRecentUserType = userSpecificData.userType;
                              } else if (usersData[userId] && usersData[userId].userType) {
                                mostRecentUserType = usersData[userId].userType;
                              }
                              
                              if (mostRecentUserType) {
                                // Update local state with the latest user type
                                setUserData(prevData => ({
                                  ...prevData,
                                  userType: mostRecentUserType
                                }));
                                
                                setSuccessMessage('Account type refreshed!');
                                setTimeout(() => setSuccessMessage(''), 3000);
                              }
                            } catch (error) {
                              console.error('Error refreshing user type:', error);
                              setErrorMessage('Could not refresh account type. Please try logging out and back in.');
                              setTimeout(() => setErrorMessage(''), 5000);
                            } finally {
                              setLoadingState('success');
                            }
                          };
                          
                          fetchUserType();
                        }}
                        className="text-sm px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors"
                      >
                        Refresh Type
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Email */}
              <div className="mb-6">
                <h3 className="text-gray-500 text-sm font-medium mb-2">Email Address</h3>
                <p className="text-gray-800">{userData.email}</p>
              </div>
              
              {/* Joined date */}
              <div className="mb-6">
                <h3 className="text-gray-500 text-sm font-medium mb-2">Member Since</h3>
                <p className="text-gray-800">{userData.joinedDate}</p>
              </div>
              
              {/* Dashboard Button based on user type */}
              <div className="mt-8 mb-4">
                {userData.userType?.toLowerCase() === 'athlete' || 
                 userData.userType?.toLowerCase() === 'athletes' ||
                 userData.userType?.toLowerCase() === 'player' ||
                 userData.userType?.toLowerCase() === 'sport' ? (
                  <Link
                    to="/dashboard"
                    className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors flex items-center justify-center"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                    Go to Athlete Dashboard
                  </Link>
                ) : userData.userType?.toLowerCase() === 'coach' || 
                   userData.userType?.toLowerCase() === 'trainer' || 
                   userData.userType?.toLowerCase() === 'instructor' ? (
                  <Link
                    to="/coach-dashboard"
                    className="w-full py-3 px-4 bg-orange-600 hover:bg-orange-700 text-white font-medium rounded-lg transition-colors flex items-center justify-center"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    Go to Coach Dashboard
                  </Link>
                ) : userData.userType?.toLowerCase() === 'nutritionist' || 
                   userData.userType?.toLowerCase() === 'nutrition' || 
                   userData.userType?.toLowerCase() === 'dietitian' ? (
                  <Link
                    to="/nutritionist-dashboard"
                    className="w-full py-3 px-4 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors flex items-center justify-center"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 15.75c-3.75-1.5-6-4.5-6-10.5M3 15.75c3.75-1.5 6-4.5 6-10.5M10.5 19.5c2.25 0 4.5-1.5 5.25-4.5M10.5 19.5c-2.25 0-4.5-1.5-5.25-4.5" />
                    </svg>
                    Go to Nutritionist Dashboard
                  </Link>
                ) : (
                  <Link
                    to="/dashboard"
                    className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors flex items-center justify-center"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                    Go to Dashboard
                  </Link>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProfilePage; 