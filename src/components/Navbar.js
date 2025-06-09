// import React, { useState } from 'react';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../components/constants';
import '../styles/List.css';
import '../styles/navbar.scss';

export default function Navbar({ onLogout }) {
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [username, setUsername] = useState('');
  const userId = localStorage.getItem('user_id'); // Get user_id from localStorage
  const token = localStorage.getItem('token'); // Get the token from localStorage

  // Fetch the username when the component is mounted
  useEffect(() => {
    const fetchUsername = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const userData = await response.json();
          setUsername(userData.firstName+" "+userData.lastName); // Assuming 'username' is the key in the response
        } else {
          console.error('Failed to fetch user data');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    if (userId) {
      fetchUsername();
    }
  }, [userId, token]);

  const handleLogout = async () => {
    if (isLoggingOut) return; // prevent multiple clicks

    setIsLoggingOut(true);

    try {
      // Simulate logout process or call actual logout function
      await new Promise(resolve => setTimeout(resolve, 500)); // optional: fake delay
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
              <span>{username ? `Hello, ${username}` : 'Loading...'}</span> {/* Display the username */}
              <i className="bi bi-gear-fill"></i> Logout
            </>
          )}
        </li>
        {/* <div id="marker"></div> */}
      </ul>
    </nav>
  );
}
