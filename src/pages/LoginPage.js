import { Box, Container } from '@mui/material';
import React from 'react';
import Login from '../components/Login';

const LoginPage = ({onLogin}) => {
  return (
    <Container>
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        {/* <Typography variant="h3" component="h1" gutterBottom>
          Login
        </Typography> */}
        <Login onLogin={onLogin}/>
      </Box>
    </Container>
  );
};

export default LoginPage;
