import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import React, { useCallback, useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import App1 from './App1';
import { BASE_URL } from './components/constants';
import LoginPage from './pages/LoginPage';
import "./styles/basic.css";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showSessionDialog, setShowSessionDialog] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null);
  const [lastActivity, setLastActivity] = useState(Date.now());
  
  // Constants for timing (in milliseconds)
  const IDLE_TIMEOUT = 15 * 60 * 1000; // 15 minutes
  const CHECK_INTERVAL = 1000; // Check every second
  const WARNING_TIME = 0; // Show warning 60 seconds before expiry

  const getTokenExpiry = useCallback(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.log('No token found');
      return null;
    }
    
    try {
      const decodedToken = jwtDecode(token);
      // console.log('Token expiry timestamp:', decodedToken.exp);
      // console.log('Current timestamp:', Math.floor(Date.now() / 1000));
      return decodedToken.exp; // Keep as seconds
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }, []);

  // Check token expiration
  const checkTokenExpiration = useCallback(() => {
    const expiryTime = getTokenExpiry();
    if (!expiryTime) return;

    const currentTime = Math.floor(Date.now() / 1000);
    const timeToExpiry = expiryTime - currentTime;

    // console.log('Time to expiry (seconds):', timeToExpiry);
    // console.log('Warning threshold:', WARNING_TIME);
    // console.log('Show dialog status:', showSessionDialog);

    // If token is expired
    if (timeToExpiry <= 0) {
      // console.log('Token expired, logging out');
      performLocalLogout();
      return;
    }

    // If within warning period and dialog not shown
    if (timeToExpiry <= WARNING_TIME && !showSessionDialog) {
      // console.log('Showing session warning dialog');
      setShowSessionDialog(true);
      setTimeLeft(timeToExpiry);
    } 
    // Update countdown if dialog is shown
    else if (showSessionDialog && timeToExpiry > 0) {
      // console.log('Updating countdown:', timeToExpiry);
      setTimeLeft(timeToExpiry);
    }
  }, [getTokenExpiry, showSessionDialog]);

  // Update last activity timestamp
  const updateActivity = useCallback(() => {
    setLastActivity(Date.now());
  }, []);

  // Check if user is idle
  const checkIdle = useCallback(() => {
    const timeSinceLastActivity = Date.now() - lastActivity;
    if (timeSinceLastActivity >= IDLE_TIMEOUT) {
      console.log('User idle timeout reached');
      toast.warn('Session ended due to inactivity');
      performLocalLogout();
    }
  }, [lastActivity]);

  // Reset timers and start monitoring
  const startSessionMonitoring = useCallback(() => {
    console.log('Starting session monitoring');
    
    // Set up activity listeners
    const events = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'];
    events.forEach(event => {
      window.addEventListener(event, updateActivity);
    });

    // Set up visibility change listener
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        console.log('Tab became visible, checking token');
        checkTokenExpiration();
        updateActivity();
      }
    });

    // Immediate check
    checkTokenExpiration();

    // Start interval checks
    const intervalId = setInterval(() => {
      checkTokenExpiration();
      checkIdle();
    }, CHECK_INTERVAL);

    return () => {
      console.log('Cleaning up session monitoring');
      events.forEach(event => {
        window.removeEventListener(event, updateActivity);
      });
      clearInterval(intervalId);
    };
  }, [checkTokenExpiration, checkIdle, updateActivity]);

  // Initialize on component mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    const loginStatus = localStorage.getItem('login');
    
    console.log('Initializing app - Token exists:', !!token, 'Login status:', !!loginStatus);
    
    if (token && loginStatus) {
      setIsAuthenticated(true);
      const cleanup = startSessionMonitoring();
      return cleanup;
    }
  }, [startSessionMonitoring]);

  const renewToken = async () => {
    try {
      console.log('Attempting to renew token');
      const refreshToken = localStorage.getItem('refreshToken');
      const response = await axios.post(`${BASE_URL}/api/user/renewToken`, {
        refreshToken: refreshToken
      });

      if (response.status === 200) {
        const { token, refreshToken: newRefreshToken } = response.data;
        localStorage.setItem('token', token);
        localStorage.setItem('refreshToken', newRefreshToken);
        
        const decodedToken = jwtDecode(token);
        localStorage.setItem('user_id', decodedToken.user_id);
        localStorage.setItem('auth', decodedToken.permissions || []);

        console.log('Token renewed successfully');
        setShowSessionDialog(false);
        updateActivity();
        toast.success('Session renewed successfully');
      }
    } catch (error) {
      console.error('Error renewing token:', error);
      toast.error('Session renewal failed');
      performLocalLogout();
    }
  };

  const handleLogin = () => {
    console.log('Login successful');
    setIsAuthenticated(true);
    localStorage.setItem('login', 'true');
    startSessionMonitoring();
    updateActivity();
  };

  const handleLogout = async () => {
    try {
      console.log('Initiating logout');
      const accessToken = localStorage.getItem('token');
      const refreshToken = localStorage.getItem('refreshToken');
      
      toast.info('Logging out...', {
        toastId: 'logoutLoading'
      });
      
      const response = await axios.post(
        `${BASE_URL}/api/user/logout`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'RefreshToken': `Bearer ${refreshToken}`,
            'Content-Type': 'application/json'
          }
        }
      );
  
      setTimeout(() => {
        if (response.status === 200) {
          toast.dismiss('logoutLoading');
          performLocalLogout();
          toast.success('Logged out successfully');
        }
      }, 1000);
  
    } catch (error) {
      console.error('Logout error:', error);
      toast.dismiss('logoutLoading');
      if(error.response?.data === 'Token has expired'){
        performLocalLogout();
      }
      setTimeout(() => {
        const errorMessage = error.response?.data?.message || 'An error occurred during logout';
        toast.error(errorMessage);
      }, 1000);
    }
  };

  const performLocalLogout = () => {
    console.log('Performing local logout');
    localStorage.removeItem('login');
    localStorage.removeItem('auth');
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user_id');
    setShowSessionDialog(false);
    setIsAuthenticated(false);
    window.location.href = '/';
  };

  return (
    <div>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      
      {!isAuthenticated ? (
        <LoginPage onLogin={handleLogin} />
      ) : (
        <App1 
          onLogout={handleLogout}
          showSessionDialog={showSessionDialog}
          setShowSessionDialog={setShowSessionDialog}
          timeLeft={timeLeft}
          renewToken={renewToken}
        />
      )}
    </div>
  );
}

export default App;