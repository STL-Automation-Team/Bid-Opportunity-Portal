import axios from 'axios';
import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './LoginPage.css';
import logo from './i1.png'; // Update the path to your logo image

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8080/api/login', {
        email: username,
        passwordHash: password,
      });
      if (response.status === 200) {
        console.log('success');
        onLogin();
      }
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const handleSignupClick = async () => {
    try {
      const response = await axios.post('http://localhost:8080/api/register', {
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
        <ToastContainer />
        <form onSubmit={handleSubmit} className="login-form">
          <input
            type="text"
            placeholder="Username"
            className="login-input"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="login-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
            <button type="submit" className="login-button login-button-primary">
              Login
            </button>
            <button type="button" className="login-button login-button-secondary" onClick={handleSignupClick}>
              Signup
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
