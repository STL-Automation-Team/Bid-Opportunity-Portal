import { Button, Grid, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';

const AddEditUser = () => {
  const [user, setUser] = useState({
    id: '',
    username: '',
    email: '',
    role: '',
  });

  useEffect(() => {
    // Fetch user data if editing
    // Example: fetchUser(userId);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Submit user data
    // Example: submitUser(user);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            name="username"
            label="Username"
            value={user.username}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            name="email"
            label="Email"
            type="email"
            value={user.email}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            name="role"
            label="Role"
            value={user.role}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={12}>
          <Button type="submit" variant="contained" color="primary">
            {user.id ? 'Update User' : 'Add User'}
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default AddEditUser;