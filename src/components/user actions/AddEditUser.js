import { Add, Delete, Edit, PersonAdd, Visibility, VisibilityOff } from '@mui/icons-material';
import {
  Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle,
  Grid, IconButton, InputAdornment, MenuItem, Paper, Select, Snackbar,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  TextField, Typography
} from '@mui/material';
import axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react';
import { BASE_URL } from '../constants';
import './AddEditUser.css';

const AddEditUser = () => {
  const [users, setUsers] = useState([]);
  const [depts, setDepts] = useState([]);
  const [loading, setLoading] = useState(true);
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
    hierarchy_level: '',
    passwordHash: '',
    createdAt: '',
    updatedAt: '',
    status: 'ACTIVE',
    parentId: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const [usersResponse, deptsResponse] = await Promise.all([
        axios.get(`${BASE_URL}/api/allusers`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${BASE_URL}/api/department`, { headers: { Authorization: `Bearer ${token}` } })
      ]);
      setUsers(usersResponse.data);
      setDepts(deptsResponse.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      showSnackbar('Error fetching data. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleOpen = (user = null) => {
    setEditingUser(user);
    setFormData(user ? {
      ...user,
      parentId: user.parent ? user.parent.id : '',
      passwordHash: ''
    } : {
      id: 0,
      employeeId: '',
      firstName: '',
      lastName: '',
      email: '',
      mobile: '',
      departmentId: '',
      hierarchy_level: '',
      passwordHash: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'ACTIVE',
      parentId: ''
    });
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'parentId' ? (value === '' ? null : Number(value)) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const currentTime = new Date().toISOString();
      const data = {
        ...formData,
        createdAt: editingUser ? formData.createdAt : currentTime,
        updatedAt: currentTime,
        parent: formData.parentId ? { id: formData.parentId } : null
      };
      delete data.parentId;

      const url = editingUser ? `${BASE_URL}/api/${editingUser.id}` : `${BASE_URL}/user/saveUser`;
      const method = editingUser ? 'put' : 'post';

      await axios({
        method,
        url,
        data,
        headers: { Authorization: `Bearer ${token}` },
      });

      showSnackbar(`User ${editingUser ? 'updated' : 'created'} successfully`, 'success');
      fetchData();
      handleClose();
    } catch (error) {
      console.error('Error saving user:', error);
      showSnackbar('Error saving user. Please try again.', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`${BASE_URL}/api/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        showSnackbar('User deleted successfully', 'success');
        fetchData();
      } catch (error) {
        console.error('Error deleting user:', error);
        showSnackbar('Error deleting user. Please try again.', 'error');
      }
    }
  };

  const handleShowPassword = () => setShowPassword(!showPassword);

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

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
                  <TableCell><b>Department</b></TableCell>
                  <TableCell><b>Hierarchy Level</b></TableCell>
                  <TableCell><b>Status</b></TableCell>
                  <TableCell><b>Parent</b></TableCell>
                  <TableCell><b>Actions</b></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id} hover>
                    <TableCell>{user.employeeId}</TableCell>
                    <TableCell>{`${user.firstName} ${user.lastName}`}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.mobile}</TableCell>
                    <TableCell>{depts.find(dept => dept.id === user.departmentId)?.dep_name}</TableCell>
                    <TableCell>{user.hierarchy_level}</TableCell>
                    <TableCell>
                      <Chip
                        label={user.status}
                        color={user.status === 'ACTIVE' ? 'success' : 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{user.parent ? `${user.parent.firstName} ${user.parent.lastName}` : ''}</TableCell>
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
                  className="text-field1"
                  name="employeeId"
                  label="Employee ID"
                  fullWidth
                  value={formData.employeeId}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} sm={6} className="grid-item1">
                <TextField
                  className="text-field1"
                  name="firstName"
                  label="First Name"
                  fullWidth
                  value={formData.firstName}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} sm={6} className="grid-item1">
                <TextField
                  className="text-field1"
                  name="lastName"
                  label="Last Name"
                  fullWidth
                  value={formData.lastName}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} sm={6} className="grid-item1">
                <TextField
                  className="text-field1"
                  name="email"
                  label="Email"
                  fullWidth
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} sm={6} className="grid-item1">
                <TextField
                  className="text-field1"
                  name="mobile"
                  label="Mobile"
                  fullWidth
                  value={formData.mobile}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} sm={6} className="grid-item1">
                <Select
                  className="text-field1"
                  name="departmentId"
                  fullWidth
                  value={formData.departmentId === null ? '' : formData.departmentId}
                  onChange={handleInputChange}
                  displayEmpty
                >
                  <MenuItem value="">
                    <em>Select Department</em>
                  </MenuItem>
                  {depts.map((dept) => (
                    <MenuItem key={dept.id} value={dept.id}>
                      {dept.dep_name}
                    </MenuItem>
                  ))}
                </Select>
              </Grid>
              <Grid item xs={12} className="grid-item1">
                <Select
                  className="text-field1"
                  name="hierarchy_level"
                  fullWidth
                  value={formData.hierarchy_level}
                  onChange={handleInputChange}
                  displayEmpty
                >
                  <MenuItem value="">
                    <em>Select Hierarchy Level</em>
                  </MenuItem>
                  {['L1', 'L2', 'L3', 'L4', 'L5'].map((level) => (
                    <MenuItem key={level} value={level}>
                      {level}
                    </MenuItem>
                  ))}
                </Select>
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
                  className="text-field1"
                  name="passwordHash"
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  fullWidth
                  value={formData.passwordHash}
                  onChange={handleInputChange}
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
              <Grid item xs={12} sm={6} className="grid-item1">
                <Select
                  className="text-field1"
                  name="parentId"
                  fullWidth
                  value={formData.parentId === null ? '' : formData.parentId}
                  onChange={handleInputChange}
                  displayEmpty
                >
                  <MenuItem value="">
                    <em>Select Parent User</em>
                  </MenuItem>
                  {users.map((user) => (
                    <MenuItem key={user.id} value={user.id}>
                      {`${user.firstName} ${user.lastName}`}
                    </MenuItem>
                  ))}
                </Select>
              </Grid>
            </Grid>
          </form>
        </DialogContent>
        <DialogActions className="dialog-actions1">
          <Button className="add-button" onClick={handleClose}>
            Cancel
          </Button>
          <Button className="add-button" onClick={handleSubmit} variant="contained" color="primary">
            {editingUser ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
        message={snackbar.message}
        severity={snackbar.severity}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      />
    </Box>
  );
};

export default AddEditUser;