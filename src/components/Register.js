import { Alert, Box, Button, Container, TextField, Typography } from '@mui/material';
import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [id, setId] = useState(0);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const response = await axios.post('http://localhost:8080/api/register', {
        "id": parseInt(id, 10),
        "username": username,
        "password": password,
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
        setSuccess('Registration successful! Redirecting to login...');
        // Redirect to login page after a short delay to show success message
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setError('Registration failed');
      }
    } catch (err) {
      setError('Registration failed');
      console.error(err);
    }
  };

  return (
    <Container maxWidth="xs">
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <Typography variant="h4" component="h1" gutterBottom>
          Register
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="ID"
            variant="outlined"
            margin="normal"
            type="number"
            fullWidth
            value={id}
            onChange={(e) => setId(e.target.value)}
          />
          <TextField
            label="Username"
            variant="outlined"
            margin="normal"
            fullWidth
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            label="Password"
            variant="outlined"
            margin="normal"
            type="password"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && (
            <Typography variant="body2" color="error">
              {error}
            </Typography>
          )}
          {success && (
            <Alert severity="success">
              {success}
            </Alert>
          )}
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Register
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default Register;
