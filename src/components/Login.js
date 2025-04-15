import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Added Google icon
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BASE_URL } from './constants';
import './LoginPage.css';
import logo from './stl_logo.png';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);


  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${BASE_URL}/api/user/loginUser`, {
        username: username,
        password: password,
      });

      if (response.status === 200) {
        const token = response.data.token;
        const refreshToken = response.data.refreshToken;
        localStorage.setItem('token', token);
        localStorage.setItem('refreshToken', refreshToken)

        const decodedToken = jwtDecode(token);
        const userId = decodedToken.user_id;
        localStorage.setItem('user_id', userId);

        const permissions = decodedToken.permissions || [];
        localStorage.setItem('auth', permissions);

        toast.success('Login successful!');
        onLogin();
      }
    } catch (error) {
      if (error.response) {
        switch (error.response.status) {
          case 401:
            toast.error('Invalid credentials. Please try again.');
            break;
          case 403:
            toast.error('Your account is inactive. Please contact support.');
            break;
          case 500:
            toast.error('An error occurred during login. Please try again later.');
            break;
          default:
            toast.error('An unexpected error occurred. Please try again.');
        }
      } else {
        toast.error('Login failed. Please check your internet connection and try again.');
      }
    }
  };

  const handleGoogleSignIn = () => {
    // Redirect to SAML authentication endpoint
    window.location.href = `${BASE_URL}/saml2/authenticate/google`;
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
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            marginTop: '20px'
          }}>
            <button
              type="submit"
              className="login-button login-button-primary"
            >
              Login
            </button>

            <div
              style={{
                width: '100%',
                textAlign: 'center',
                borderBottom: '1px solid #cacaca',
                lineHeight: '0.1em',
                margin: '20px 0'
              }}
            >
              <span
                style={{
                  background: '#fff',
                  padding: '0 10px',
                  color: '#888'
                }}
              >
                OR
              </span>
            </div>
            <button type="button" class="login-with-google-btn" onClick={handleGoogleSignIn} >
              Sign in with Google
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;