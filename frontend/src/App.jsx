import './App.css';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { useEffect } from 'react';

import Homepage from './pages/homepage';
import LoginAndSignPage from './pages/loginandsignpage';
import ProfilePage from './pages/ProfilePage';
import CombinedPasswordResetPage from './pages/CombinedPasswordResetPage';

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

function App() {
  const { currentUser, loading } = useAuth();
  const location = useLocation();
  
  useEffect(() => {
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
