import axios from 'axios';
import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Icons for visibility toggle
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BASE_URL } from './constants';
import './LoginPage.css';
import logo from './stl_logo.png'; // Update the path to your logo image


const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${BASE_URL}/api/login`, {
        email: username,
        passwordHash: password,
      });
  
      // Handle successful login
      if (response.status === 200) {
        console.log('Login successful');
        toast.success('Login successful!');
        onLogin(); // Call the onLogin function to proceed to the next page
      }
    } catch (error) {
      if (error.response) {
        // Handle different status codes returned by the backend
        switch (error.response.status) {
          case 401:
            console.error('Invalid credentials');
            toast.error('Invalid credentials. Please try again.');
            break;
          case 403:
            console.error('User is inactive');
            toast.error('Your account is inactive. Please contact support.');
            break;
          case 500:
            console.error('Internal server error');
            toast.error('An error occurred during login. Please try again later.');
            break;
          default:
            console.error('Unexpected error');
            toast.error('An unexpected error occurred. Please try again.');
        }
      } else {
        // Handle network errors or other issues
        console.error('Login failed:', error);
        toast.error('Login failed. Please check your internet connection and try again.');
      }
    }
  };
  

  const handleSignupClick = async () => {
    try {
      const response = await axios.post(`${BASE_URL}/api/register`, {
        username,
        password,
      },
        {
          headers: {
            'Content-Type': 'application/json',
            "Access-Control-Allow-Origin": "*",
          },
        }
      );

      console.log(username);
      if (response.status === 201 || response.status === 200) {
        toast.success('Registered Successfully!');
      } else {
        toast.error('Registration failed');
      }
    } catch (err) {
      toast.error('Registration failed');
      console.error(err);
    }
  };

  return (
    <div className="login-container">
      <div className="login-paper">
        <div className="login-logo">
          <img src={logo} alt="Logo" />
        </div>
        <ToastContainer 
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />
        <form onSubmit={handleSubmit} className="login-form">
          <input
            type="text"
            placeholder="Please enter email"
            className="login-input"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <div className="password-container">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="login-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span onClick={handleTogglePasswordVisibility} className="password-toggle-icon">
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
            <button type="submit" className="login-button login-button-primary">
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );             
}; 

export default Login;
