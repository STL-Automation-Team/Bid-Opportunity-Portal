import { Add, Delete, Edit, PersonAdd, Visibility, VisibilityOff } from '@mui/icons-material';
import { BASE_URL } from '../constants';

import {
  Box,
  Button, Chip, Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid, IconButton, InputAdornment,
  MenuItem, Paper, Select,
  Snackbar, Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, TextField, Typography
} from '@mui/material';
import axios from 'axios';
import React, { useState } from 'react';

import { useEffect } from 'react';

import './AddEditUser.css';


const AddEditUser = () => {
  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    id: 0,
    employeeId: '',
    firstName: '',
    lastName: '',
    email: '',
    mobile: '',
    departmentId: '',
    passwordHash: '',
    createdAt: '',
    updatedAt: '',
    status: 'ACTIVE',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [page, setPage] = useState(0);
  const [rowsPerPage] = useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/allusers`);
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
      showSnackbar('Error fetching users', 'error');
    }
  };

  const handleOpen = (user = null) => {
    setEditingUser(user);
    setFormData(
      user
        ? {
            id: user.id,
            employeeId: user.employeeId,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            mobile: user.mobile,
            departmentId: user.departmentId,
            passwordHash: '',
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
            status: user.status,
          }
        : {
            id: 0,
            employeeId: '',
            firstName: '',
            lastName: '',
            email: '',
            mobile: '',
            departmentId: '',
            passwordHash: '',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            status: 'ACTIVE',
          }
    );
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    if (editingUser) {
      setEditingUser(editingUser);
    } else {
      setEditingUser(null);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const currentTime = new Date().toISOString();
      const data = {
        ...formData,
        createdAt: editingUser ? formData.createdAt : currentTime,
        updatedAt: currentTime,
      };
      if (editingUser) {
        await axios.put(`${BASE_URL}/api/${editingUser.id}`, data);
        showSnackbar('User updated successfully', 'success');
      } else {
        await axios.post(`${BASE_URL}/api/create`, data);
        showSnackbar('User created successfully', 'success');
      }
      fetchUsers();
      handleClose();
    } catch (error) {
      console.error('Error saving user:', error);
      showSnackbar('Error saving user', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await axios.delete(`${BASE_URL}/api/${id}`);
        showSnackbar('User deleted successfully', 'success');
        fetchUsers();
      } catch (error) {
        console.error('Error deleting user:', error);
        showSnackbar('Error deleting user', 'error');
      }
    }
  };

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const showSnackbar = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Box sx={{ padding: 3 }}>
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
      <PersonAdd sx={{ mr: 1, verticalAlign: 'middle' }} />

        User Management
      </Typography>
      <Button
        className="add-button"
        variant="contained"
        color="primary"
        startIcon={<Add />}
        onClick={() => handleOpen()}
      >
        Add New User
      </Button>
    </Box>

    <Paper sx={{ width: '100%', overflow: 'hidden', mb: 3 }}>
      {users.length > 0 ? (
        
          <TableContainer sx={{ maxHeight: 440 }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell><b>Employee ID</b></TableCell>
                  <TableCell><b>Name</b></TableCell>
                  <TableCell><b>Email</b></TableCell>
                  <TableCell><b>Mobile</b></TableCell>
                  <TableCell><b>Department ID</b></TableCell>
                  <TableCell><b>Status</b></TableCell>
                  <TableCell><b>Actions</b></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((user) => (
                    <TableRow key={user.id} hover>
                      <TableCell>{user.employeeId}</TableCell>
                      <TableCell>{`${user.firstName} ${user.lastName}`}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.mobile}</TableCell>
                      <TableCell>{user.departmentId}</TableCell>
                      <TableCell>
                        <Chip
                          label={user.status}
                          color={user.status === 'ACTIVE' ? 'success' : 'default'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <IconButton className="icon-button" onClick={() => handleOpen(user)} size="small">
                          <Edit />
                        </IconButton>
                        <IconButton className="icon-button" onClick={() => handleDelete(user.id)} size="small">
                          <Delete />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        
      ) : (
        <Typography variant="body1" sx={{ p: 2, textAlign: 'center' }}>
          No users found. Please add users to the system.
        </Typography>
      )}
    </Paper>

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle className="dialog-title1">{editingUser ? 'Edit User' : 'Add New User'}</DialogTitle>
        <DialogContent className="dialog-content1">
          <form onSubmit={handleSubmit} className="form1">
            <Grid container spacing={2} sx={{ mt: 1 }} className="grid-container1">
        <Grid item xs={12} sm={6} className="grid-item1">
          <TextField
            name="employeeId"
            label="Employee ID"
            fullWidth
            value={formData.employeeId}
            onChange={handleInputChange}
            className="text-field1"
          />
        </Grid>
        <Grid item xs={12} sm={6} className="grid-item1">
          <TextField
            name="firstName"
            label="First Name"
            fullWidth
            value={formData.firstName}
            onChange={handleInputChange}
            className="text-field1"
          />
        </Grid>
        <Grid item xs={12} sm={6} className="grid-item1">
          <TextField
            name="lastName"
            label="Last Name"
            fullWidth
            value={formData.lastName}
            onChange={handleInputChange}
            className="text-field1"
          />
        </Grid>
        <Grid item xs={12} sm={6} className="grid-item1">
          <TextField
            name="email"
            label="Email"
            fullWidth
            value={formData.email}
            onChange={handleInputChange}
            className="text-field1"
          />
        </Grid>
        <Grid item xs={12} sm={6} className="grid-item1">
          <TextField
            name="mobile"
            label="Mobile"
            fullWidth
            value={formData.mobile}
            onChange={handleInputChange}
            className="text-field1"
          />
        </Grid>
        <Grid item xs={12} sm={6} className="grid-item1">
          <TextField
            name="departmentId"
            label="Department ID"
            fullWidth
            value={formData.departmentId}
            onChange={handleInputChange}
            className="text-field1"
          />
        </Grid>
        <Grid item xs={12} className="grid-item1">
          <Select
            className="text-field1"
            name="status"
            fullWidth
            value={formData.status}
            onChange={handleInputChange}
          >
            <MenuItem value="ACTIVE">ACTIVE</MenuItem>
            <MenuItem value="INACTIVE">INACTIVE</MenuItem>
          </Select>
        </Grid>
        <Grid item xs={12} className="grid-item1">
                <TextField
                  name="passwordHash"
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  fullWidth
                  value={formData.passwordHash}
                  onChange={handleInputChange}
                  className="text-field1"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={handleShowPassword}>
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} className="grid-item1">
                <TextField
                  name="createdAt"
                  label="Created At"
                  type="datetime-local"
                  fullWidth
                  value={formData.createdAt}
                  disabled
                  className="text-field1"
                />
              </Grid>
              <Grid item xs={12} className="grid-item1">
                <TextField
                  name="updatedAt"
                  label="Updated At"
                  type="datetime-local"
                  fullWidth
                  value={formData.updatedAt}
                  disabled
                  className="text-field1"
                />
              </Grid>
            </Grid>
          </form>
        </DialogContent>
        <DialogActions className="dialog-actions1">
          <Button
            className="add-button"
            onClick={handleClose}
          >
            Cancel
          </Button>
          <Button
            className="add-button"
            onClick={handleSubmit}
            variant="contained"
            color="primary"
          >
            {editingUser ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
        severity={snackbarSeverity}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      />
    </Box>
  );
};

export default AddEditUser;