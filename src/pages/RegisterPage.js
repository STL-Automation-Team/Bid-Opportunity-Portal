import { Box, Container } from '@mui/material';
import React from 'react';
import Register from '../components/Register';

const RegisterPage = () => {
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
          Register
        </Typography> */}
        <Register />
      </Box>
    </Container>
  );
};

export default RegisterPage;
