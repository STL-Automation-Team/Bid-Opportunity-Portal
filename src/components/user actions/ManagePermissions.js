import { Add, Delete, Edit, Security } from '@mui/icons-material';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Paper,
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
import './AddEditUser.css';

const BASE_URL = 'http://localhost:8080';

const ManagePermissions = () => {
  const [permissions, setPermissions] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingPermission, setEditingPermission] = useState(null);
  const [formData, setFormData] = useState({
    id: 0,
    permission_name: '',
    createdAt: new Date().toISOString(),
    createdBy: 'Admin',
    updatedAt: new Date().toISOString(),
    updatedBy: 'Admin'
  });
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  useEffect(() => {
    fetchPermissions();
  }, []);

  const fetchPermissions = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/permissions`);
      setPermissions(response.data);
    } catch (error) {
      console.error('Error fetching permissions:', error);
      showSnackbar('Error fetching permissions', 'error');
    }
  };

  const handleOpen = (permission = null) => {
    setEditingPermission(permission);
    setFormData(
      permission
        ? {
            id: permission.id,
            permission_name: permission.permission_name,
            createdAt: permission.createdAt,
            createdBy: permission.createdBy,
            updatedAt: permission.updatedAt,
            updatedBy: permission.updatedBy
          }
        : {
            id: 0,
            permission_name: '',
            createdAt: new Date().toISOString(),
            createdBy: 'Admin',
            updatedAt: new Date().toISOString(),
            updatedBy: 'Admin'
          }
    );
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    if (editingPermission) {
      setEditingPermission(editingPermission);
    } else {
      setEditingPermission(null);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        ...formData,
        updatedAt: new Date().toISOString()
      };
      if (editingPermission) {
        await axios.put(`${BASE_URL}/api/permissions/${editingPermission.id}`, data);
        showSnackbar('Permission updated successfully', 'success');
      } else {
        await axios.post(`${BASE_URL}/api/permissions`, data);
        showSnackbar('Permission created successfully', 'success');
      }
      fetchPermissions();
      handleClose();
    } catch (error) {
      console.error('Error saving permission:', error);
      showSnackbar('Error saving permission', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this permission?')) {
      try {
        await axios.delete(`${BASE_URL}/api/permissions/${id}`);
        showSnackbar('Permission deleted successfully', 'success');
        fetchPermissions();
      } catch (error) {
        console.error('Error deleting permission:', error);
        showSnackbar('Error deleting permission', 'error');
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
      {/* Similar structure as ManageRoles component */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
        <Security sx={{ mr: 1, verticalAlign: 'middle' }} />
          Manage Permissions
        </Typography>
        <Button
          className="add-button"
          variant="contained"
          color="primary"
          startIcon={<Add />}
          onClick={() => handleOpen()}
        >
          Add New Permission
        </Button>
      </Box>

      <Paper sx={{ width: '100%', overflow: 'hidden', mb: 3 }}>
  {permissions.length > 0 ? (
    <TableContainer sx={{ maxHeight: 440 }}>
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell><b>Permission</b></TableCell>
            <TableCell><b>Created By</b></TableCell>
            <TableCell><b>Created At</b></TableCell>
            <TableCell><b>Updated By</b></TableCell>
            <TableCell><b>Updated At</b></TableCell>
            <TableCell><b>Actions</b></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {permissions.map((permission) => (
            <TableRow key={permission.id} hover>
              <TableCell>{permission.permission_name}</TableCell>
              <TableCell>{permission.createdBy}</TableCell>
              <TableCell>{new Date(permission.createdAt).toLocaleString()}</TableCell>
              <TableCell>{permission.updatedBy}</TableCell>
              <TableCell>{new Date(permission.updatedAt).toLocaleString()}</TableCell>
              <TableCell>
                <IconButton className="icon-button" onClick={() => handleOpen(permission)} size="small">
                  <Edit />
                </IconButton>
                <IconButton className="icon-button" onClick={() => handleDelete(permission.id)} size="small">
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
      No permissions available. Please add a new permission.
    </Typography>
  )}
</Paper>

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle className="dialog-title1">{editingPermission ? 'Edit Permission' : 'Add New Permission'}</DialogTitle>
        <DialogContent className="dialog-content1">
          <form onSubmit={handleSubmit} className="form1">
            <Grid container spacing={2} sx={{ mt: 1 }} className="grid-container1">
              <Grid item xs={12} className="grid-item1">
                <TextField
                  name="permission_name"
                  label="Permission Name"
                  fullWidth
                  value={formData.permission_name}
                  onChange={handleInputChange}
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
            {editingPermission ? 'Update' : 'Add'}
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

export default ManagePermissions;






{/* <Grid item xs={12} className="grid-item1">
                <TextField
                  name="createdAt"
                  label="Created At"
                  type="datetime-local"
                  fullWidth
                  value={formData.createdAt}
                  disabled
                  className="text-field1"
                />
              </Grid> */}
              {/* <Grid item xs={12} className="grid-item1">
                <TextField
                  name="createdBy"
                  label="Created By"
                  fullWidth
                  value={formData.createdBy}
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
              <Grid item xs={12} className="grid-item1">
                <TextField
                  name="updatedBy"
                  label="Updated By"
                  fullWidth
                  value={formData.updatedBy}
                  disabled
                  className="text-field1"
                />
              </Grid> */}