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
  TablePagination,
  TableRow,
  TextField,
  Typography
} from '@mui/material';
import axios from 'axios';
import DOMPurify from 'dompurify';
import React, { useEffect, useState } from 'react';
import { BASE_URL } from '../constants';
import './AddEditUser.css';


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
  const [formErrors, setFormErrors] = useState({});
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  // Input validation rules
  const permissionNameRegex = /^[a-zA-Z0-9_-]{3,50}$/;

  const validateFormData = () => {
    const errors = {};
    
    // Sanitize and validate permission name
    const sanitizedName = DOMPurify.sanitize(formData.permission_name.trim());
    
    if (!sanitizedName) {
      errors.permission_name = 'Permission name is required';
    } else if (!permissionNameRegex.test(sanitizedName)) {
      errors.permission_name = 'Permission name must be 3-50 characters and contain only letters, numbers, underscores, and hyphens';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // Sanitize input value
    const sanitizedValue = DOMPurify.sanitize(value);
    setFormData({ ...formData, [name]: sanitizedValue });
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors({ ...formErrors, [name]: '' });
    }
  };

  const token = localStorage.getItem('token'); // Retrieve the token from storage

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedPermissions = permissions.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  useEffect(() => {
    fetchPermissions();
  }, []);

  const fetchPermissions = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/permissions`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
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

  // const handleInputChange = (e) => {
  //   setFormData({ ...formData, [e.target.name]: e.target.value });
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const sanitizedData = {
        ...formData,
        permission_name: DOMPurify.sanitize(formData.permission_name.trim()),
        updatedAt: new Date().toISOString()
      };
  
      const url = editingPermission 
        ? `${BASE_URL}/api/permissions/${editingPermission.id}`
        : `${BASE_URL}/api/permissions`;
  
      const response = await axios({
        method: editingPermission ? 'put' : 'post',
        url: url,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        data: sanitizedData
      });
        
      showSnackbar(
        `Permission ${editingPermission ? 'updated' : 'created'} successfully`,
        'success'
      );
      fetchPermissions();
      handleClose();
    } catch (error) {
      console.error('Error saving permission:', error);
      
      // Handle validation errors
      if (error.response?.status === 400) {
        // Validation errors
        const validationErrors = error.response.data;
        const errorMessages = Object.values(validationErrors).join('\n');
        showSnackbar(errorMessages, 'error');
      } 
      // Handle not found errors
      else if (error.response?.status === 404) {
        showSnackbar('Permission not found', 'error');
      }
      // Handle unauthorized errors
      else if (error.response?.status === 401) {
        showSnackbar('Unauthorized access. Please login again.', 'error');
        // Optionally redirect to login
        // navigate('/login');
      }
      // Handle server errors
      else if (error.response?.status === 500) {
        const errorMessage = error.response.data?.message || 'Internal server error occurred';
        showSnackbar(errorMessage, 'error');
      }
      // Handle network errors
      else if (error.request) {
        showSnackbar('Network error. Please check your connection.', 'error');
      }
      // Handle other errors
      else {
        showSnackbar('Error saving permission. Please try again.', 'error');
      }
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this permission?')) {
      try {
        await axios.delete(`${BASE_URL}/api/permissions/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
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
        <>
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
                {paginatedPermissions.map((permission) => (
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
          <TablePagination
            rowsPerPageOptions={[10, 25, 50]}
            component="div"
            count={permissions.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </>
      ) : (
        <p>No permissions available.</p>
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
                 {formErrors.permission_name && (
                  <p className="mt-1 text-sm text-red-500">{formErrors.permission_name}</p>
                )}
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