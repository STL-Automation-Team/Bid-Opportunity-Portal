import { Add, Assessment, Delete, Edit } from '@mui/icons-material';
import {
    Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle,
    FormControl,
    Grid, IconButton,
    InputLabel,
    MenuItem, Paper, Select, Snackbar, Table, TableBody,
    TableCell, TableContainer, TableHead, TableRow, TextField, Typography
} from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { BASE_URL } from '../constants';
import './AddEditUser.css';

const AddAGP = () => {
  const [agpEntries, setAGPEntries] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);
  const [users, setUsers] = useState([]);
  const [fiscalYears, setFiscalYears] = useState([]);
  const [businessSegments, setBusinessSegments] = useState([]);
  const [formData, setFormData] = useState({
    id: 0,
    employeeID: '',
    accountName: '',
    obFY: '',
    obQT: '',
    agpValue: 0,
    status: 'ACTIVE',
  });
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  useEffect(() => {
    fetchAGPEntries();
    fetchUsers();
    fetchFiscalYears();
    fetchBusinessSegments();
  }, []);

  const fetchAGPEntries = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/agp`);
      setAGPEntries(response.data);
    } catch (error) {
      console.error('Error fetching AGP entries:', error);
      showSnackbar('Error fetching AGP entries', 'error');
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/allusers`);
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
      showSnackbar('Error fetching users', 'error');
    }
  };

  const fetchFiscalYears = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/fy`);
      setFiscalYears(response.data);
    } catch (error) {
      console.error('Error fetching fiscal years:', error);
      showSnackbar('Error fetching fiscal years', 'error');
    }
  };

  const fetchBusinessSegments = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/business-segments`);
      setBusinessSegments(response.data);
    } catch (error) {
      console.error('Error fetching business segments:', error);
      showSnackbar('Error fetching business segments', 'error');
    }
  };

  const handleOpen = (entry = null) => {
    setEditingEntry(entry);
    setFormData(
      entry
        ? { ...entry }
        : {
            id: 0,
            employeeID: '',
            accountName: '',
            obFY: '',
            obQT: '',
            agpValue: 0,
            status: 'ACTIVE',
          }
    );
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingEntry(null);
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
        createdAt: editingEntry ? formData.createdAt : currentTime,
        updatedAt: currentTime,
        createdBy: 'admin',
        updatedBy: 'admin',
      };
      if (editingEntry) {
        await axios.put(`${BASE_URL}/api/agp/${editingEntry.id}`, data);
        showSnackbar('AGP entry updated successfully', 'success');
      } else {
        await axios.post(`${BASE_URL}/api/agp`, data);
        showSnackbar('AGP entry created successfully', 'success');
      }
      fetchAGPEntries();
      handleClose();
    } catch (error) {
      console.error('Error saving AGP entry:', error);
      showSnackbar('Error saving AGP entry', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this AGP entry?')) {
      try {
        await axios.delete(`${BASE_URL}/api/agp/${id}`);
        showSnackbar('AGP entry deleted successfully', 'success');
        fetchAGPEntries();
      } catch (error) {
        console.error('Error deleting AGP entry:', error);
        showSnackbar('Error deleting AGP entry', 'error');
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
          <Assessment sx={{ mr: 1, verticalAlign: 'middle' }} />
          Manage AGP Entries
        </Typography>
        <Button
          className="add-button"
          variant="contained"
          color="primary"
          startIcon={<Add />}
          onClick={() => handleOpen()}
        >
          Add New AGP Entry
        </Button>
      </Box>

      <Paper sx={{ width: '100%', overflow: 'hidden', mb: 3 }}>
        {agpEntries.length > 0 ? (
          <TableContainer sx={{ maxHeight: 440 }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell><b>Employee</b></TableCell>
                  <TableCell><b>Account Name</b></TableCell>
                  <TableCell><b>FY</b></TableCell>
                  <TableCell><b>QT</b></TableCell>
                  <TableCell><b>AGP Value</b></TableCell>
                  <TableCell><b>Status</b></TableCell>
                  <TableCell><b>Actions</b></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {agpEntries.map((entry) => (
                  <TableRow key={entry.id} hover>
                    <TableCell>{entry.employeeID}</TableCell>
                    <TableCell>{entry.accountName}</TableCell>
                    <TableCell>{entry.obFY}</TableCell>
                    <TableCell>{entry.obQT}</TableCell>
                    <TableCell>{entry.agpValue}</TableCell>
                    <TableCell>
                      <Chip
                        label={entry.status}
                        color={entry.status === 'ACTIVE' ? 'success' : 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton className="icon-button" onClick={() => handleOpen(entry)} size="small">
                        <Edit />
                      </IconButton>
                      <IconButton className="icon-button" onClick={() => handleDelete(entry.id)} size="small">
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
            No AGP entries available. Please add a new entry.
          </Typography>
        )}
      </Paper>

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle className="dialog-title1">{editingEntry ? 'Edit AGP Entry' : 'Add New AGP Entry'}</DialogTitle>
        <DialogContent className="dialog-content1">
          <form onSubmit={handleSubmit} className="form1">
            <Grid container spacing={2} sx={{ mt: 1 }} className="grid-container1">
              <Grid item xs={12} className="grid-item1">
                <FormControl fullWidth>
                  <InputLabel id="employee-label">Employee</InputLabel>
                  <Select
                    className="text-field1"
                    labelId="employee-label"
                    name="employeeID"
                    label="Employee"
                    fullWidth
                    value={formData.employeeID}
                    onChange={handleInputChange}
                  >
                    {users.map((user) => (
                      <MenuItem key={user.id} value={user.employeeId}>
                        {`${user.firstName} ${user.lastName}`}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} className="grid-item1">
                <FormControl fullWidth>
                  <InputLabel id="account-label">Account Name</InputLabel>
                  <Select
                    className="text-field1"
                    labelId="account-label"
                    name="accountName"
                    label="Account Name"
                    fullWidth
                    value={formData.accountName}
                    onChange={handleInputChange}
                  >
                    {businessSegments.map((segment) => (
                      <MenuItem key={segment.id} value={segment.name}>
                        {segment.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6} className="grid-item1">
                <FormControl fullWidth>
                  <InputLabel id="fy-label">Financial Year</InputLabel>
                  <Select
                    className="text-field1"
                    labelId="fy-label"
                    name="obFY"
                    label="Financial Year"
                    fullWidth
                    value={formData.obFY}
                    onChange={handleInputChange}
                  >
                    {fiscalYears.map((fy) => (
                      <MenuItem key={fy.id} value={`FY${fy.obFy.toString().slice(-2)}`}>
                        {`FY${fy.obFy.toString().slice(-2)}`}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6} className="grid-item1">
                <FormControl fullWidth>
                  <InputLabel id="qt-label">Quarter</InputLabel>
                  <Select
                    className="text-field1"
                    labelId="qt-label"
                    name="obQT"
                    label="Quarter"
                    fullWidth
                    value={formData.obQT}
                    onChange={handleInputChange}
                  >
                    {['Q1', 'Q2', 'Q3', 'Q4'].map((qt) => (
                      <MenuItem key={qt} value={qt}>{qt}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} className="grid-item1">
                <TextField
                  className="text-field1"
                  name="agpValue"
                  label="AGP Value"
                  type="number"
                  fullWidth
                  value={formData.agpValue}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} className="grid-item1">
                <FormControl fullWidth>
                  <InputLabel id="status-label">Status</InputLabel>
                  <Select
                    className="text-field1"
                    labelId="status-label"
                    name="status"
                    label="Status"
                    fullWidth
                    value={formData.status}
                    onChange={handleInputChange}
                  >
                    <MenuItem value="ACTIVE">ACTIVE</MenuItem>
                    <MenuItem value="INACTIVE">INACTIVE</MenuItem>
                  </Select>
                </FormControl>
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
            {editingEntry ? 'Update' : 'Add'}
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

export default AddAGP;