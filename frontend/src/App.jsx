import './App.css';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { useEffect } from 'react';

import Homepage from './pages/homepage';
import LoginAndSignPage from './pages/loginandsignpage';
import ProfilePage from './pages/ProfilePage';
import CombinedPasswordResetPage from './pages/CombinedPasswordResetPage';
import AthleteDashboard from './pages/AthleteDashboard';
import CoachDashboard from './pages/CoachDashboard';
import NutritionistDashboard from './pages/NutritionistDashboard';

// Protected route component
const ProtectedRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();
  
  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>;
  }
  
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

// Athlete route component
const AthleteRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();
  
  // DEMO MODE: Skip authentication check and allow direct access
  const allowDemoAccess = true; // Set to true to bypass authentication
  
  if (allowDemoAccess) {
    return children;
  }
  
  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>;
  }
  
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }
  
  // Check if user is an athlete (default to athlete if type is not specified)
  const userType = (currentUser.userType || 'athlete').toLowerCase();
  if (userType !== 'athlete' && userType !== 'athletes' && userType !== 'player' && userType !== 'sport') {
    return <Navigate to="/profile" replace />;
  }
  
  return children;
};

// Coach route component
const CoachRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();
  
  // DEMO MODE: Skip authentication check and allow direct access
  const allowDemoAccess = true; // Set to true to bypass authentication
  
  if (allowDemoAccess) {
    return children;
  }
  
  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>;
  }
  
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }
  
  // Check if user is a coach
  const userType = (currentUser.userType || '').toLowerCase();
  if (userType !== 'coach') {
    return <Navigate to="/profile" replace />;
  }
  
  return children;
};

// Nutritionist route component
const NutritionistRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();
  
  // DEMO MODE: Skip authentication check and allow direct access
  const allowDemoAccess = true; // Set to true to bypass authentication
  
  if (allowDemoAccess) {
    return children;
  }
  
  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>;
  }
  
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }
  
  // Check if user is a nutritionist
  const userType = (currentUser.userType || '').toLowerCase();
  if (userType !== 'nutritionist') {
    return <Navigate to="/profile" replace />;
  }
  
  return children;
};

function App() {
  const { currentUser, loading } = useAuth();
  const location = useLocation();
  
  useEffect(() => {
    // Check if we're at /dashboard without the hash
    // This helps with direct URL access when using HashRouter
    if (window.location.pathname === '/dashboard' && window.location.hash === '') {
      window.location.replace('/#/dashboard');
      return;
    }

    console.log("App component rendered, auth state:", { 
      isLoggedIn: !!currentUser, 
      loading,
      currentPath: location.pathname
    });
    
    // This helps prevent page reload issues
    if (location.hash === '#home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentUser, loading, location]);

  console.log("Rendering App component, current path:", location.pathname);

  // While authentication state is loading, show nothing
  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>;
  }

  return (
    <Routes>
      <Route 
        path="/login" 
        element={currentUser ? <Navigate to="/" replace /> : <LoginAndSignPage />} 
      />
      {/* Password reset flow - all in one page now */}
      <Route 
        path="/forgot-password" 
        element={<CombinedPasswordResetPage />} 
      />
      <Route 
        path="/profile" 
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/dashboard" 
        element={
          <AthleteRoute>
            <AthleteDashboard />
          </AthleteRoute>
        } 
      />
      <Route 
        path="/coach-dashboard" 
        element={
          <CoachRoute>
            <CoachDashboard />
          </CoachRoute>
        } 
      />
      <Route 
        path="/nutritionist-dashboard" 
        element={
          <NutritionistRoute>
            <NutritionistDashboard />
          </NutritionistRoute>
        } 
      />
      <Route 
        path="/" 
        element={<Homepage />} 
      />
      <Route 
        path="*" 
        element={<Navigate to="/" replace />} 
      />
    </Routes>
  );
}

export default App;
