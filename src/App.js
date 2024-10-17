import React, { useEffect, useState } from 'react';
import App1 from './App1';
import LoginPage from './pages/LoginPage';
import "./styles/basic.css";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if the user is authenticated by checking localStorage when the app loads
  useEffect(() => {
    const token = localStorage.getItem('login');
    if (token) {
      setIsAuthenticated(true); // User is authenticated
    }
  }, []); // Runs only once when the component mounts

  const handleLogin = () => {
    setIsAuthenticated(true);
    // Store the authentication state in localStorage
    localStorage.setItem('login', 'true');
  };

  const handleLogout = () => {
    // Clear authentication state and perform any additional logout actions
    setIsAuthenticated(false);
    // Clear tokens and localStorage
    localStorage.removeItem('login');
    localStorage.removeItem('auth');
    localStorage.removeItem('token');
    localStorage.removeItem('user_id');    
    // Redirect to the root URL
    window.location.href = '/';
  };

  return (
    <div>
      {!isAuthenticated ? (
        <LoginPage onLogin={handleLogin} />
      ) : (
        // <AccessDeniedProvider>
          <App1 onLogout={handleLogout} />
        // </AccessDeniedProvider>
      )}
    </div>
  );
}

export default App;
