import axios from 'axios';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // For navigation to login page

// Create a context for managing the popup state
const AccessDeniedContext = createContext();

// Custom hook to use the Access Denied context
export const useAccessDenied = () => useContext(AccessDeniedContext);

// Provider component
export const AccessDeniedProvider = ({onLogout, children }) => {
  const [isAccessDeniedOpen, setIsAccessDeniedOpen] = useState(false);
  const [isSessionExpiredOpen, setIsSessionExpiredOpen] = useState(false);
  const navigate = useNavigate();

  const showAccessDenied = () => setIsAccessDeniedOpen(true);
  const hideAccessDenied = () => setIsAccessDeniedOpen(false);

  const showSessionExpired = () => setIsSessionExpiredOpen(true);
  const hideSessionExpired = () => {
    handleLogout();
    setIsSessionExpiredOpen(false);
    navigate('/'); // Redirect to login page on closing the session expired popup
  };
  const handleLogout = () => {
    // Perform logout actions here, such as clearing local storage, resetting state, etc.
    // For example, clear any tokens or session data
    onLogout(false);
};
  // Intercept all fetch and axios requests
  useEffect(() => {
    // Intercept fetch requests
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      const response = await originalFetch(...args);
      if (response.status === 403) {
        showAccessDenied();
      } else if (response.status === 401) {
        showSessionExpired();
      }
      return response;
    };

    // Intercept axios requests
    const axiosInterceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response) {
          if (error.response.status === 403 && !isAccessDeniedOpen) {
            showAccessDenied();
          } else if (error.response.status === 401 && !isSessionExpiredOpen) {
            showSessionExpired();
          }
        }
        return Promise.reject(error);
      }
    );
    

    // Clean up interceptors on component unmount
    return () => {
      window.fetch = originalFetch; // Restore original fetch
      axios.interceptors.response.eject(axiosInterceptor); // Remove axios interceptor
    };
  }, []);

  return (
    <AccessDeniedContext.Provider value={{ showAccessDenied, hideAccessDenied }}>
      {children}
      {/* Access Denied Popup for 403 */}
      {isAccessDeniedOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '15px',
            maxWidth: '400px',
            textAlign: 'center',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
          }}>
            <h2 style={{ marginTop: 0, color: 'black' }}>Access Denied</h2>
            <p style={{ color: 'black' }}>
              You do not have access to this resource. Please log in or contact an administrator.
            </p>
            <button 
              onClick={hideAccessDenied}
              style={{
                padding: '10px 20px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
            >
              OK
            </button>
          </div>
        </div>
      )}

      {/* Session Expired Popup for 401 */}
      {isSessionExpiredOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '15px',
            maxWidth: '400px',
            textAlign: 'center',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
          }}>
            <h2 style={{ marginTop: 0, color: 'black' }}>Session Expired</h2>
            <p style={{ color: 'black' }}>
              Your session has expired. Please log in again.
            </p>
            <button 
              onClick={hideSessionExpired}
              style={{
                padding: '10px 20px',
                backgroundColor: '#dc3545', // Use a red color for session expiry warning
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
            >
              OK
            </button>
          </div>
        </div>
      )}
    </AccessDeniedContext.Provider>
  );
};

// Optional: Create a HOC for class components
export const withAccessDenied = (WrappedComponent) => {
  return (props) => (
    <AccessDeniedProvider>
      <WrappedComponent {...props} />
    </AccessDeniedProvider>
  );
};
