import { Edit, Person, Security } from '@mui/icons-material';
import { Autocomplete, Box, Button, Dialog, DialogContent, DialogTitle, Grid, IconButton, Paper, Snackbar, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import './AddEditUser.css';

const BASE_URL = 'http://localhost:8080';

const AssignRoleToUser = () => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [userRoleMappings, setUserRoleMappings] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedRoles, setSelectedRoles] = useState([]);
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
      const usersResponse = await axios.get(`${BASE_URL}/api`);
      setUsers(usersResponse.data);

      const rolesResponse = await axios.get(`${BASE_URL}/api/roles`);
      setRoles(rolesResponse.data);

      const mappingsResponse = await axios.get(`${BASE_URL}/api/user-roles`);
      setUserRoleMappings(mappingsResponse.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      showSnackbar('Error fetching data', 'error');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpen = (user) => {
    setSelectedUser(user);
    setSelectedRoles(userRoleMappings
      .filter((mapping) => mapping.userID === user.id)
      .map((mapping) => roles.find((role) => role.id === mapping.roleID))
    );
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedUser(null);
    setSelectedRoles([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Delete roles that were removed
      const currentRoles = userRoleMappings
        .filter((mapping) => mapping.userID === selectedUser.id)
        .map((mapping) => mapping.roleID);

      const rolesToRemove = currentRoles.filter((id) =>
        !selectedRoles.some((role) => role.id === id)
      );

      for (const roleId of rolesToRemove) {
        const mapping = userRoleMappings.find(
          (mapping) => mapping.userID === selectedUser.id && mapping.roleID === roleId
        );
        await axios.delete(`${BASE_URL}/api/user-roles/${mapping.id}`);
      }

      // Add new roles
      const newRoles = selectedRoles.filter(
        (role) => !currentRoles.includes(role.id)
      );

      for (const role of newRoles) {
        await axios.post(`${BASE_URL}/api/user-roles`, {
          userID: selectedUser.id,
          roleID: role.id
        });
      }
      fetchData();
      showSnackbar('Roles updated successfully', 'success');
      handleClose();
    } catch (error) {
      console.error('Error updating roles:', error);
      showSnackbar('Error updating roles', 'error');
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
          <Person sx={{ mr: 1, verticalAlign: 'middle' }} />
          Assign Roles to Users
        </Typography>
      </Box>

      <Paper sx={{ width: '100%', overflow: 'hidden', mb: 3, p: 3 }}>
        {users.length > 0 ? (
       
          <TableContainer sx={{ maxHeight: 440 }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell><b>Employee ID</b></TableCell>
                  <TableCell><b>Name</b></TableCell>
                  <TableCell><b>Email</b></TableCell>
                  <TableCell><b>Roles</b></TableCell>
                  <TableCell><b>Actions</b></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id} hover>
                    <TableCell>{user.employeeId}</TableCell>
                    <TableCell>{`${user.firstName} ${user.lastName}`}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      {userRoleMappings
                        .filter((mapping) => mapping.userID === user.id)
                        .map((mapping) => roles.find((role) => role.id === mapping.roleID)?.role)
                        .join(', ')}
                    </TableCell>
                    <TableCell>
                      <IconButton className="icon-button" onClick={() => handleOpen(user)} size="small">
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
            No users available. Please add users to the system.
          </Typography>
        )}
      </Paper>

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle className="dialog-title1">
          <Security sx={{ mr: 1, verticalAlign: 'middle' }} />
          Edit Roles for {selectedUser?.firstName} {selectedUser?.lastName}
        </DialogTitle>
        <DialogContent className="dialog-content1">
          <form onSubmit={handleSubmit} className="form1" style={{ marginTop: '20px'}}>
            <Grid container spacing={3} className="grid-container1">
              <Grid item xs={12} className="grid-item1">
                <Autocomplete
                  className="auto-complete1"
                  multiple
                  options={roles}
                  getOptionLabel={(option) => option.role}
                  value={selectedRoles}
                  onChange={(event, newValue) => setSelectedRoles(newValue)}
                  renderInput={(params) => (
                    <TextField {...params} label="Select Roles" variant="outlined" className="text-field1" />
                  )}
                />
              </Grid>
              <Grid item xs={12} className="actions-container1" style={{ textAlign: 'right' }}>
                <Button
                  onClick={handleClose}
                  variant="outlined"
                  className="cancel-button"
                  style={{ marginRight: '8px' }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  className="save-button"
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

export default AssignRoleToUser;