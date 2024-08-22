import { AssignmentInd, Edit } from '@mui/icons-material';
import { Autocomplete, Box, Button, Dialog, DialogContent, DialogTitle, Grid, IconButton, Paper, Snackbar, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { BASE_URL } from '../constants';
import './AddEditUser.css';


const AssignPermissionsToRole = () => {
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [roleMappings, setRoleMappings] = useState([]);
  const [selectedRole, setSelectedRole] = useState(null);
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [open, setOpen] = useState(false);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const fetchData = async () => {
    try {
      const rolesResponse = await axios.get(`${BASE_URL}/api/roles`);
      setRoles(rolesResponse.data);

      const permissionsResponse = await axios.get(`${BASE_URL}/api/permissions`);
      setPermissions(permissionsResponse.data);

      const mappingsResponse = await axios.get(`${BASE_URL}/api/roles-permission`);
      setRoleMappings(mappingsResponse.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      showSnackbar('Error fetching data', 'error');
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const rolesResponse = await axios.get(`${BASE_URL}/api/roles`);
        setRoles(rolesResponse.data);

        const permissionsResponse = await axios.get(`${BASE_URL}/api/permissions`);
        setPermissions(permissionsResponse.data);

        const mappingsResponse = await axios.get(`${BASE_URL}/api/roles-permission`);
        setRoleMappings(mappingsResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
        showSnackbar('Error fetching data', 'error');
      }
    };
    fetchData();
  }, []);

  const handleOpen = (role) => {
    setSelectedRole(role);
    setSelectedPermissions(roleMappings
      .filter((mapping) => mapping.roleId === role.id)
      .map((mapping) => permissions.find((permission) => permission.id === mapping.permissionId))
    );
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedRole(null);
    setSelectedPermissions([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Delete permissions that were removed
      const currentPermissions = roleMappings
        .filter((mapping) => mapping.roleId === selectedRole.id)
        .map((mapping) => mapping.permissionId);

      const permissionsToRemove = currentPermissions.filter((id) =>
        !selectedPermissions.some((permission) => permission.id === id)
      );

      for (const permissionId of permissionsToRemove) {
        const mapping = roleMappings.find(
          (mapping) => mapping.roleId === selectedRole.id && mapping.permissionId === permissionId
        );
        await axios.delete(`${BASE_URL}/api/roles-permission/${mapping.id}`);
      }

      // Add new permissions
      const newPermissions = selectedPermissions.filter(
        (permission) => !currentPermissions.includes(permission.id)
      );

      for (const permission of newPermissions) {
        await axios.post(`${BASE_URL}/api/roles-permission`, {
          roleId: selectedRole.id,
          permissionId: permission.id
        });
      }
      fetchData();
      showSnackbar('Permissions updated successfully', 'success');
      handleClose();
    } catch (error) {
      console.error('Error updating permissions:', error);
      showSnackbar('Error updating permissions', 'error');
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
    <Box sx={{ padding: 3 }} >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }} >
        <Typography variant="h4" component="h1" gutterBottom >
        <AssignmentInd sx={{ mr: 1, verticalAlign: 'middle' }} />
          Assign Permissions to Roles
        </Typography>
        
      </Box>

      <Paper sx={{ width: '100%', overflow: 'hidden', mb: 3, p: 3 }}>
      {roles.length > 0 ? (
      
          <TableContainer sx={{ maxHeight: 440 }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell><b>Role</b></TableCell>
                  <TableCell><b>Permissions</b></TableCell>
                  <TableCell><b>Actions</b></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {roles.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((role) => (
                  <TableRow key={role.id} hover>
                    <TableCell>{role.role}</TableCell>
                    <TableCell>
                      {roleMappings
                        .filter((mapping) => mapping.roleId === role.id)
                        .map((mapping) =>
                          permissions.find((permission) => permission.id === mapping.permissionId)?.permission_name
                        ).join(', ')}
                    </TableCell>
                    <TableCell>
                      <IconButton className="icon-button" onClick={() => handleOpen(role)} size="small">
                        <Edit />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          
      ) : (
        <Typography variant="h6" align="center" sx={{ p: 3 }}>
          No role-permission mappings available. Please assign permissions to roles.
        </Typography>
      )}
    </Paper>

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle className="dialog-title1">Edit Permissions for {selectedRole?.role}</DialogTitle>
        <DialogContent className="dialog-content1">
          <form onSubmit={handleSubmit} className="form1" style={{ marginTop: '20px'}}>
            <Grid container spacing={3} className="grid-container1">
              <Grid item xs={12} className="grid-item1">
                <Autocomplete
                  className="auto-complete1"
                  multiple
                  options={permissions}
                  getOptionLabel={(option) => option.permission_name}
                  value={selectedPermissions}
                  onChange={(event, newValue) => setSelectedPermissions(newValue)}
                  renderInput={(params) => (
                    <TextField {...params} label="Select Permissions" variant="outlined" className="text-field1" />
                  )}
                />
              </Grid>
              <Grid item xs={12} className="actions-container1" style={{ textAlign: 'right' }}>
                <Button
                  onClick={handleClose}
                  variant="outlined"
                  className="add-button"
                  style={{ marginRight: '8px' }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  className="add-button"
                >
                  Save
                </Button>
              </Grid>
            </Grid>
          </form>
        </DialogContent>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
        severity={snackbarSeverity}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        className="snackbar"
      />
    </Box>
  );
};

export default AssignPermissionsToRole;