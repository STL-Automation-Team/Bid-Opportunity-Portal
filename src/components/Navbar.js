import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/List.css';
import '../styles/navbar.scss';

export default function Navbar({ onLogout }) {
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    if (isLoggingOut) return; // prevent multiple clicks

    setIsLoggingOut(true);

    try {
      // Simulate logout process or call actual logout function
      await new Promise(resolve => setTimeout(resolve, 1000)); // optional: fake delay
      onLogout(false);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <nav>
      <ul id="navbar">
        <a className="navbar-brand" href="/">
          {/* <img className="logoimg" src={logo} /> */}
        </a>

        <li className={`nav-menu logout-button ${isLoggingOut ? 'loading' : ''}`} onClick={handleLogout}>
          {isLoggingOut ? (
            <div className="spinner"></div>
          ) : (
            <>
              <i className="bi bi-gear-fill"></i> Logout
            </>
          )}
        </li>
        {/* <div id="marker"></div> */}
      </ul>
    </nav>
  );
}
