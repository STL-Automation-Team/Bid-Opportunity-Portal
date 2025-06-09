import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import App1 from './App1';
import { BASE_URL } from './components/constants';
import LoginPage from './pages/LoginPage';
import "./styles/basic.css";

// Move constants outside component to prevent recreation on each render
const IDLE_TIMEOUT = 10 * 60 * 1000; // 10 minutes
const CHECK_INTERVAL = 5000; // Check every 5 seconds instead of every second
const WARNING_TIME = 60; // Show warning 60 seconds before expiry

const ERROR_MESSAGES = {
  invalid_saml_response: 'Invalid SAML response received. Please try again.',
  email_not_found: 'Email not found in the SAML response.',
  user_not_found: 'User does not exist in the system. Please contact support.',
  account_inactive: 'Your account is inactive. Contact support for assistance.',
  no_roles_assigned: 'No roles are assigned to your account. Please contact support.',
  no_permissions: 'You do not have the required permissions. Contact support.',
  invalid_encoding: 'Invalid encoding in the SAML response.',
  internal_server_error: 'An unexpected server error occurred. Please try again.',
};

function App() {
  // Use refs for values that don't need to trigger renders
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [sessionState, setSessionState] = useState({
    showDialog: false,
    timeLeft: null
  });
  
  // Use refs for values that don't need to trigger re-renders
  const lastActivityRef = useRef(Date.now());
  const timerRef = useRef(null);
  const tokenExpiryRef = useRef(null);
  const refreshTokenRef = useRef(null);
  const accessTokenRef = useRef(null);

  // Decode and store token information
  const updateTokenInfo = useCallback(() => {
    const token = localStorage.getItem('token');
    if (!token) return false;
    
    try {
      const decodedToken = jwtDecode(token);
      tokenExpiryRef.current = decodedToken.exp;
      accessTokenRef.current = token;
      refreshTokenRef.current = localStorage.getItem('refreshToken');
      return true;
    } catch (error) {
      console.error('Error decoding token:', error);
      return false;
    }
  }, []);

  const performLocalLogout = useCallback(() => {
    // Clear all timers first
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    // Clear localStorage
    localStorage.removeItem('login');
    localStorage.removeItem('auth');
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user_id');
    
    // Set logout flag for other tabs
    localStorage.setItem('logout', Date.now().toString());
    
    // Reset refs
    tokenExpiryRef.current = null;
    accessTokenRef.current = null;
    refreshTokenRef.current = null;
    
    // Reset state
    setSessionState({
      showDialog: false,
      timeLeft: null
    });
    
    setIsAuthenticated(false);
    setIsLoading(false); // Ensure loading state is reset
  }, []);

  // Memoize error handling function
  const handleErrorsFromUrl = useCallback(() => {
    const query = new URLSearchParams(window.location.search);
    const error = query.get('error');

    if (error && ERROR_MESSAGES[error]) {
      toast.error(ERROR_MESSAGES[error]);
      window.history.replaceState({}, document.title, '/');
    }
  }, []);

  // Process tokens from URL - memoized to prevent recreation
  const getTokensFromUrl = useCallback(() => {
    const query = new URLSearchParams(window.location.search);
    const token = query.get('token');
    const refreshToken = query.get('refreshToken');

    if (token && refreshToken) {
      try {
        // Store tokens in localStorage
        localStorage.setItem('token', token);
        localStorage.setItem('refreshToken', refreshToken);

        // Decode token to fetch user data and permissions
        const decodedToken = jwtDecode(token);
        const userId = decodedToken.user_id;
        const permissions = decodedToken.permissions || [];

        localStorage.setItem('user_id', userId);
        localStorage.setItem('auth', permissions);

        // Update refs
        tokenExpiryRef.current = decodedToken.exp;
        accessTokenRef.current = token;
        refreshTokenRef.current = refreshToken;

        // Clean URL without causing a history entry
        window.history.replaceState({}, document.title, "/");
        
        return true;
      } catch (error) {
        console.error('Error processing tokens from URL:', error);
        return false;
      }
    }
    return false;
  }, []);

  // Update activity timestamp - use debounce pattern to reduce updates
  const updateActivity = useCallback(() => {
    lastActivityRef.current = Date.now();
  }, []);

  // Combined session check function - do all checks at once
  const checkSession = useCallback(() => {
    if (!tokenExpiryRef.current) return;
    
    const currentTime = Math.floor(Date.now() / 1000);
    const timeToExpiry = tokenExpiryRef.current - currentTime;
    
    // Check if token is expired
    if (timeToExpiry <= 0) {
      performLocalLogout();
      return;
    }
    
    // Check if user is idle
    const idleTime = Date.now() - lastActivityRef.current;
    if (idleTime >= IDLE_TIMEOUT) {
      toast.warn('Session ended due to inactivity');
      performLocalLogout();
      return;
    }
    
    // Check if within warning period
    if (timeToExpiry <= WARNING_TIME && !sessionState.showDialog) {
      setSessionState({
        showDialog: true,
        timeLeft: timeToExpiry
      });
    } 
    // Update countdown if dialog is already shown
    else if (sessionState.showDialog && timeToExpiry > 0) {
      setSessionState(prev => ({
        ...prev,
        timeLeft: timeToExpiry
      }));
    }
  }, [sessionState.showDialog]);

  // Token renewal function with built-in error handling and rate limiting
  const renewToken = useCallback(async () => {
    // Prevent multiple simultaneous renewal attempts
    if (refreshTokenRef.current === null) {
      console.error('No refresh token available');
      return false;
    }
    
    try {
      const response = await axios.post(`${BASE_URL}/api/user/renewToken`, {
        refreshToken: refreshTokenRef.current
      });

      if (response.status === 200) {
        const { token, refreshToken: newRefreshToken } = response.data;
        
        // Update localStorage
        localStorage.setItem('token', token);
        localStorage.setItem('refreshToken', newRefreshToken);

        // Update refs
        const decodedToken = jwtDecode(token);
        tokenExpiryRef.current = decodedToken.exp;
        accessTokenRef.current = token;
        refreshTokenRef.current = newRefreshToken;
        
        // Update localStorage for user info
        localStorage.setItem('user_id', decodedToken.user_id);
        localStorage.setItem('auth', decodedToken.permissions || []);

        // Reset session dialog state
        setSessionState({
          showDialog: false,
          timeLeft: null
        });
        
        // Update activity timestamp
        updateActivity();
        toast.success('Session renewed successfully');
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error renewing token:', error);
      toast.error('Session renewal failed');
      performLocalLogout();
      return false;
    }
  }, [updateActivity]);

  // Start session monitoring with optimized event listeners
  const startSessionMonitoring = useCallback(() => {
    // Clear any existing timers
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    // Use passive event listeners for better performance
    const listenerOptions = { passive: true };
    const events = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'];
    
    // Throttled activity handler
    let lastUpdateTime = 0;
    const throttledUpdateActivity = () => {
      const now = Date.now();
      if (now - lastUpdateTime > 1000) { // Update at most once per second
        lastUpdateTime = now;
        updateActivity();
      }
    };
    
    // Attach listeners
    events.forEach(event => {
      window.addEventListener(event, throttledUpdateActivity, listenerOptions);
    });
    
    // Handle tab visibility
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        updateActivity();
        checkSession();
      }
    });
    
    // Initial check
    checkSession();
    
    // Set interval with a longer delay to reduce CPU usage
    timerRef.current = setInterval(checkSession, CHECK_INTERVAL);
    
    // Cleanup function that removes all listeners
    return () => {
      events.forEach(event => {
        window.removeEventListener(event, throttledUpdateActivity);
      });
      
      clearInterval(timerRef.current);
      timerRef.current = null;
    };
  }, [checkSession, updateActivity]);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        handleErrorsFromUrl();
        
        // Check for tokens from URL or localStorage
        const hasTokens = getTokensFromUrl();
        const hasLocalToken = updateTokenInfo();

        if (hasTokens || hasLocalToken) {
          setIsAuthenticated(true);
          localStorage.setItem('login', 'true');
          lastActivityRef.current = Date.now();
          startSessionMonitoring();
        }
      } catch (error) {
        console.error('Initialization error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, [handleErrorsFromUrl, getTokensFromUrl, updateTokenInfo, startSessionMonitoring]);

  // Handler functions
  const handleLogin = useCallback(() => {
    updateTokenInfo();
    setIsAuthenticated(true);
    localStorage.setItem('login', 'true');
    lastActivityRef.current = Date.now();
    startSessionMonitoring();
  }, [updateTokenInfo, startSessionMonitoring]);

  useEffect(() => {
    // Add storage event listener for logout synchronization
    const handleStorageChange = (e) => {
      if (e.key === 'logout' && e.newValue) {
        performLocalLogout();
        window.location.reload(); // Optional: force refresh to clean up any state
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [performLocalLogout]);

  const handleLogout = useCallback(async () => {
    const toastId = toast.loading('Logging out...');
    
    try {
      if (accessTokenRef.current && refreshTokenRef.current) {
        await axios.post(
          `${BASE_URL}/api/user/logout`,
          {},
          {
            headers: {
              'Authorization': `Bearer ${accessTokenRef.current}`,
              'RefreshToken': `Bearer ${refreshTokenRef.current}`,
              'Content-Type': 'application/json'
            }
          }
        );
      }
      
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
        performLocalLogout();
      }
    }
  }, []);

  

  const renderComponent = useMemo(() => {
    if (isLoading) {
      return <div className="loading-screen">Loading...</div>; // Or a proper loading component
    }
    
    if (!isAuthenticated) {
      return <LoginPage onLogin={handleLogin} />;
    }
    
    return (
      <App1
        onLogout={handleLogout}
        showSessionDialog={sessionState.showDialog}
        setShowSessionDialog={(show) => 
          setSessionState(prev => ({...prev, showDialog: show}))
        }
        timeLeft={sessionState.timeLeft}
        renewToken={renewToken}
      />
    );
  }, [isLoading, isAuthenticated, handleLogin, handleLogout, renewToken, sessionState]);

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
      {renderComponent}
    </div>
  );
}

export default App;