import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext'

// Function to wait for stylesheets to load before rendering
function waitForStylesheetsLoaded() {
  return new Promise(resolve => {
    const styleSheets = document.styleSheets;
    if (styleSheets.length > 0) {
      resolve();
      return;
    }

    // If no stylesheets yet, set up a listener
    const interval = setInterval(() => {
      if (document.styleSheets.length > 0) {
        clearInterval(interval);
        resolve();
      }
    }, 10);
    
    // Safety timeout
    setTimeout(() => {
      clearInterval(interval);
      resolve();
    }, 1000);
  });
}

// Render the app only after stylesheets are loaded
waitForStylesheetsLoaded().then(() => {
  const root = createRoot(document.getElementById('root'));
  
  // Use HashRouter instead of BrowserRouter to avoid full page reload issues
  // HashRouter works better in development and with static file serving
  root.render(
    <StrictMode>
      <HashRouter>
        <AuthProvider>
          <App />
        </AuthProvider>
      </HashRouter>
    </StrictMode>
  );
});
