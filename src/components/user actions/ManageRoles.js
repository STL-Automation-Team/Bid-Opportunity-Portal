import { Add, Delete, Edit, SupervisorAccount } from '@mui/icons-material';
import { BASE_URL } from '../constants';
import './AddEditUser.css';

import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  MenuItem,
  Paper,
  Select,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography
} from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react';


const ManageRoles = () => {
  const [roles, setRoles] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [formData, setFormData] = useState({
    id: 0,
    role: '',
    createdAt: '',
    updatedAt: '',
    status: 'ACTIVE',
  });
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const token = localStorage.getItem('token');
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/roles`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setRoles(response.data);
    } catch (error) {
      console.error('Error fetching roles:', error);
      showSnackbar('Error fetching roles', 'error');
    }
  };

  const handleOpen = (role = null) => {
    setEditingRole(role);
    setFormData(
      role
        ? {
            id: role.id,
            role: role.role,
            createdAt: role.createdAt,
            updatedAt: role.updatedAt,
            status: role.status,
          }
        : {
            id: 0,
            role: '',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            status: 'ACTIVE',
          }
    );
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    if (editingRole) {
      setEditingRole(editingRole);
    } else {
      setEditingRole(null);
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
        createdAt: editingRole ? formData.createdAt : currentTime,
        updatedAt: currentTime,
      };
      if (editingRole) {
        await axios.put(`${BASE_URL}/api/roles/${editingRole.id}`, data, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        showSnackbar('Role updated successfully', 'success');
      } else {
        await axios.post(`${BASE_URL}/api/roles`, data, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        showSnackbar('Role created successfully', 'success');
      }
      fetchRoles();
      handleClose();
    } catch (error) {
      console.error('Error saving role:', error);
      showSnackbar('Error saving role', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this role?')) {
      try {
        await axios.delete(`${BASE_URL}/api/roles/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        showSnackbar('Role deleted successfully', 'success');
        fetchRoles();
      } catch (error) {
        console.error('Error deleting role:', error);
        showSnackbar('Error deleting role', 'error');
      }
    }
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
        <SupervisorAccount sx={{ mr: 1, verticalAlign: 'middle' }} />

          Manage Roles
        </Typography>
        <Button
          className="add-button"
          variant="contained"
          color="primary"
          startIcon={<Add />}
          onClick={() => handleOpen()}
        >
          Add New Role
        </Button>
      </Box>

      <Paper sx={{ width: '100%', overflow: 'hidden', mb: 3 }}>
        {roles.length > 0 ? (
         
          <TableContainer sx={{ maxHeight: 440 }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell><b>Role</b></TableCell>
                  <TableCell><b>Status</b></TableCell>
                  <TableCell><b>Actions</b></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {roles.map((role) => (
                  <TableRow key={role.id} hover>
                    <TableCell>{role.role}</TableCell>
                    <TableCell>
                      <Chip
                        label={role.status}
                        color={role.status === 'ACTIVE' ? 'success' : 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton className="icon-button" onClick={() => handleOpen(role)} size="small">
                        <Edit />
                      </IconButton>
                      <IconButton className="icon-button" onClick={() => handleDelete(role.id)} size="small">
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        
        ) : (
          <Typography variant="h6" align="center" sx={{ p: 3 }}>
            No roles available. Please add a new role.
          </Typography>
        )}
      </Paper>

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle className="dialog-title1">{editingRole ? 'Edit Role' : 'Add New Role'}</DialogTitle>
        <DialogContent className="dialog-content1">
          <form onSubmit={handleSubmit} className="form1">
            <Grid container spacing={2} sx={{ mt: 1 }} className="grid-container1">
              <Grid item xs={12} className="grid-item1">
                <TextField
                  name="role"
                  label="Role"
                  fullWidth
                  value={formData.role}
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
            {editingRole ? 'Update' : 'Add'}
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

export default ManageRoles;
