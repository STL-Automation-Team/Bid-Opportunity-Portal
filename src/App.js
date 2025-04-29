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
  const IDLE_TIMEOUT = 10 * 60 * 1000; // 15 minutes
  const CHECK_INTERVAL = 1000; // Check every second
  const WARNING_TIME = 60; // Show warning 60 seconds before expiry
  const errorMessages = {
    invalid_saml_response: 'Invalid SAML response received. Please try again.',
    email_not_found: 'Email not found in the SAML response.',
    user_not_found: 'User does not exist in the system. Please contact support.',
    account_inactive: 'Your account is inactive. Contact support for assistance.',
    no_roles_assigned: 'No roles are assigned to your account. Please contact support.',
    no_permissions: 'You do not have the required permissions. Contact support.',
    invalid_encoding: 'Invalid encoding in the SAML response.',
    internal_server_error: 'An unexpected server error occurred. Please try again.',
  };

  const getTokenExpiry = useCallback(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      // console.log('No token found');
      return null;
    }

    try {
      const decodedToken = jwtDecode(token);
      // // console.log('Token expiry timestamp:', decodedToken.exp);
      // // console.log('Current timestamp:', Math.floor(Date.now() / 1000));
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
      // // console.log('Token expired, logging out');
      performLocalLogout();
      return;
    }

    // If within warning period and dialog not shown
    if (timeToExpiry <= WARNING_TIME && !showSessionDialog) {
      // // console.log('Showing session warning dialog');
      setShowSessionDialog(true);
      setTimeLeft(timeToExpiry);
    }
    // Update countdown if dialog is shown
    else if (showSessionDialog && timeToExpiry > 0) {
      // // console.log('Updating countdown:', timeToExpiry);
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
      // console.log('User idle timeout reached');
      toast.warn('Session ended due to inactivity');
      performLocalLogout();
    }
  }, [lastActivity]);

  // Reset timers and start monitoring
  const startSessionMonitoring = useCallback(() => {
    // console.log('Starting session monitoring');

    // Set up activity listeners
    const events = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'];
    events.forEach(event => {
      window.addEventListener(event, updateActivity);
    });

    // Set up visibility change listener
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        // console.log('Tab became visible, checking token');
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
      // console.log('Cleaning up session monitoring');
      events.forEach(event => {
        window.removeEventListener(event, updateActivity);
      });
      clearInterval(intervalId);
    };
  }, [checkTokenExpiration, checkIdle, updateActivity]);

  const handleErrorsFromUrl = useCallback(() => {
    const query = new URLSearchParams(window.location.search);
    const error = query.get('error');

    if (error && errorMessages[error]) {
      toast.error(errorMessages[error]);
      setTimeout(() => {
        window.history.replaceState({}, document.title, '/');
      }, 0);
    }
  }, []);

  const getTokensFromUrl = () => {
    const query = new URLSearchParams(window.location.search);
    const token = query.get('token');
    const refreshToken = query.get('refreshToken');

    if (token && refreshToken) {
      // console.log("Tokens found in URL.");

      // Store tokens in localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('refreshToken', refreshToken);

      // Decode token to fetch user data and permissions
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.user_id;
      const permissions = decodedToken.permissions || [];

      localStorage.setItem('user_id', userId);
      localStorage.setItem('auth', permissions);

      // Delay URL cleanup to avoid interfering with rendering
      setTimeout(() => {
        window.history.replaceState({}, document.title, "/");
        // console.log("Query parameters removed from URL.");
      }, 0);

      return true;
    }

    // console.log("Tokens not found in URL.");
    return false;
  };
  useEffect(() => {
    handleErrorsFromUrl();

    const hasTokens = getTokensFromUrl();
    const token = localStorage.getItem('token');

    if (hasTokens || token) {
      setIsAuthenticated(true);
      localStorage.setItem('login', 'true');
      startSessionMonitoring();
      updateActivity();
    } else {
      setIsAuthenticated(false);
    }
  }, [handleErrorsFromUrl, startSessionMonitoring, updateActivity]);

  


  // Initialize on component mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    const loginStatus = localStorage.getItem('login');

    // console.log('Initializing app - Token exists:', !!token, 'Login status:', !!loginStatus);

    if (token && loginStatus) {
      setIsAuthenticated(true);
      const cleanup = startSessionMonitoring();
      return cleanup;
    }
  }, [startSessionMonitoring]);

  const renewToken = async () => {
    try {
      // console.log('Attempting to renew token');
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

        // console.log('Token renewed successfully');
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
    // console.log('Login successful');
    setIsAuthenticated(true);
    localStorage.setItem('login', 'true');
    startSessionMonitoring();
    updateActivity();
  };

  const handleLogout = async () => {
    const accessToken = localStorage.getItem('token');
    const refreshToken = localStorage.getItem('refreshToken');
  
    const toastId = toast.loading('Logging out...');
  
    try {
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
  
      // As soon as the response is received, no timeout
      toast.dismiss(toastId);
      performLocalLogout();
      toast.success('Logged out successfully');
  
    } catch (error) {
      console.error('Logout error:', error);
      toast.dismiss(toastId);
  
      if (error.response?.data === 'Token has expired') {
        performLocalLogout();
        toast.success('Session expired. Logged out successfully.');
      } else {
        const errorMessage = error.response?.data?.message || 'An error occurred during logout';
        toast.error(errorMessage);
      }
    }
  };
  

  const performLocalLogout = () => {
    // console.log('Performing local logout');
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
