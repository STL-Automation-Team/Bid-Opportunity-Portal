import React from 'react';

const SessionDialog = ({ isOpen, timeLeft, onLogout, onContinue, onClose }) => {
  if (!isOpen) return null;
  
  return (
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
        <div style={{ marginBottom: '15px' }}>
          <h2 style={{ 
            marginTop: 0, 
            color: 'black',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px'
          }}>
            <svg 
              width="24" 
              height="24" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
              style={{ color: '#f59e0b' }} // yellow warning color
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Session Expiring Soon
          </h2>
        </div>
        
        <p style={{ 
          color: 'black',
          marginBottom: '20px'
        }}>
          Your session will expire in {timeLeft} seconds. Would you like to continue?
        </p>
        
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '10px'
        }}>
          <button 
            onClick={onLogout}
            style={{
              padding: '10px 20px',
              backgroundColor: '#dc3545', // red for logout
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            Logout
          </button>
          <button 
            onClick={onContinue}
            style={{
              padding: '10px 20px',
              backgroundColor: '#007bff', // blue for continue
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            Continue Session
          </button>
        </div>
      </div>
    </div>
  );
};

export default SessionDialog;