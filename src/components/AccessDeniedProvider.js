import axios from 'axios';
import React, { createContext, useContext, useEffect, useState } from 'react';

// Create a context for managing the popup state
const AccessDeniedContext = createContext();

// Custom hook to use the Access Denied context
export const useAccessDenied = () => useContext(AccessDeniedContext);

// Provider component
export const AccessDeniedProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const showAccessDenied = () => setIsOpen(true);
  const hideAccessDenied = () => setIsOpen(false);

  // Intercept all fetch and axios requests
  useEffect(() => {
    // Intercept fetch requests
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      const response = await originalFetch(...args);
      console.log('==============');
      console.log(response);
      if (response.status === 403) {
        showAccessDenied();
      }
      return response;
    };

    // Intercept axios requests
    const axiosInterceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response && error.response.status === 403) {
          showAccessDenied();
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
      {isOpen && (
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
            borderRadius: '15px', // Increased border radius for a more curved look
            maxWidth: '400px',
            textAlign: 'center',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' // Optional: adds a slight shadow for more depth
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
                borderRadius: '5px', // Slightly more rounded button
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
