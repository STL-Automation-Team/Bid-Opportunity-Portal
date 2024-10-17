import { Add, Assessment, Delete, Edit } from '@mui/icons-material';
import {
  Box, Button, Dialog, DialogActions, DialogContent, DialogTitle,
  FormControl, Grid, IconButton, InputLabel, MenuItem, Paper, Select,
  Snackbar, Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, TextField, Typography
} from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { BASE_URL } from '../constants';
import './AddAGP.css';
import './AddEditUser.css';

const AGPManagement = () => {
  const [agpEntries, setAgpEntries] = useState([]);
  const [open, setOpen] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [businessSegments, setBusinessSegments] = useState([]);
  const [users, setUsers] = useState([]);
  const [childUsers, setChildUsers] = useState([]);
  const [formData, setFormData] = useState({
    id: null,
    departmentId: '',
    financialYear: '',
    quarter: '',
    businessSegmentId: '',
    parentUserId: '',
    parentAgpValue: '',
  });
  const [agpValues, setAgpValues] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    fetchAGPEntries();
    fetchDepartments();
    fetchBusinessSegments();
  }, []);

  const fetchAGPEntries = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/api/agp/allAgp`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAgpEntries(response.data);
    } catch (error) {
      console.error('Error fetching AGP entries:', error);
      showSnackbar('Error fetching AGP entries', 'error');
    }
  };

  const fetchDepartments = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/api/department`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDepartments(response.data);
    } catch (error) {
      console.error('Error fetching departments:', error);
      showSnackbar('Error fetching departments', 'error');
    }
  };

  const fetchBusinessSegments = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/api/business-segments`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBusinessSegments(response.data);
    } catch (error) {
      console.error('Error fetching business segments:', error);
      showSnackbar('Error fetching business segments', 'error');
    }
  };

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const { departmentId, financialYear, quarter, businessSegmentId } = formData;
      const response = await axios.get(`${BASE_URL}/api/allusers`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { departmentId, financialYear, quarter, businessSegmentId }
      });
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
      showSnackbar('Error fetching users', 'error');
    }
  };

  const fetchChildUsers = async (parentUserId) => {
    if (!isEditMode) {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${BASE_URL}/api/${parentUserId}/children`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const childUsers = response.data || [];
        setChildUsers(childUsers);

        if (childUsers.length > 0) {
          const agpResponse = await axios.get(`${BASE_URL}/api/agp`, {
            headers: { Authorization: `Bearer ${token}` },
            params: {
              userId: childUsers.map(user => user.id).join(','),
              departmentId: formData.departmentId,
              financialYear: formData.financialYear,
              quarter: formData.quarter,
              businessSegmentId: formData.businessSegmentId,
            },
          });

          const agpMap = new Map(
            (agpResponse.data || []).map(agp => [agp.user.id, agp.agpValue])
          );

          setAgpValues(
            childUsers.map(user => ({
              userId: user.id,
              agpValue: agpMap.get(user.id) || 0,
            }))
          );
        } else {
          setAgpValues([]);
        }
      } catch (error) {
        console.error('Error fetching child users:', error);
        showSnackbar('Error fetching child users', 'error');
        setChildUsers([]);
        setAgpValues([]);
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (['departmentId', 'financialYear', 'quarter', 'businessSegmentId'].includes(name)) {
      fetchUsers();
    }
    if (name === 'parentUserId' && !isEditMode) {
      fetchChildUsers(value);
      fetchParentAgpValue(value);
    }
  };

  const fetchParentAgpValue = async (parentUserId) => {
    if (!isEditMode) {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${BASE_URL}/api/agp/${parentUserId}`, {
          headers: { Authorization: `Bearer ${token}` },
          params: {
            departmentId: formData.departmentId,
            financialYear: formData.financialYear,
            quarter: formData.quarter,
            businessSegmentId: formData.businessSegmentId,
          },
        });
        const parentAgpValue = response.data?.agpValue || '0';
        setFormData((prev) => ({ ...prev, parentAgpValue }));
      } catch (error) {
        console.error('Error fetching parent AGP value:', error);
        setFormData((prev) => ({ ...prev, parentAgpValue: '0' }));
      }
    }
  };

  const handleAgpValueChange = (userId, value) => {
    if (!isEditMode) {
      const updatedAgpValues = agpValues.map(agp => 
        agp.userId === userId ? { ...agp, agpValue: value } : agp
      );
      setAgpValues(updatedAgpValues);
      
      const totalChildAgp = updatedAgpValues.reduce((sum, agp) => sum + Number(agp.agpValue), 0);
      const parentAgp = Number(formData.parentAgpValue || 0);
      
      if (parentAgp > totalChildAgp && updatedAgpValues.length > 0) {
        const remainingValue = parentAgp - totalChildAgp;
        const lastChild = updatedAgpValues[updatedAgpValues.length - 1];
        lastChild.agpValue = (Number(lastChild.agpValue) + remainingValue).toFixed(2);
        setAgpValues([...updatedAgpValues.slice(0, -1), lastChild]);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    
    try {
      if (isEditMode) {
        // Update existing entry
        const payload = {
          user: { id: formData.userId },
          department: { id: formData.departmentId },
          businessSegment: { id: formData.businessSegmentId },
          financialYear: formData.financialYear,
          quarter: formData.quarter,
          agpValue: formData.agpValue
        };
        await axios.put(`${BASE_URL}/api/agp/${formData.id}`, payload, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        console.log('AGP entry updated successfully');
        showSnackbar('AGP entry updated successfully', 'success');
      } else {
        // Prepare data for parent and children
        const agpDataPromises = [
          {
            userId: formData.parentUserId,
            departmentId: formData.departmentId,
            businessSegmentId: formData.businessSegmentId,
            financialYear: formData.financialYear,
            quarter: formData.quarter,
            agpValue: formData.parentAgpValue
          },
          ...agpValues.map(agp => ({
            userId: agp.userId,
            departmentId: formData.departmentId,
            businessSegmentId: formData.businessSegmentId,
            financialYear: formData.financialYear,
            quarter: formData.quarter,
            agpValue: agp.agpValue
          }))
        ];
  
        console.log('AGP data to process:', agpDataPromises);
  
        // Check for existing entries and update or create as needed
        const savePromises = agpDataPromises.map(async (data) => {
          try {
            // Check if an entry already exists
            const response = await axios.get(`${BASE_URL}/api/agp/${data.userId}`, {
              headers: { 'Authorization': `Bearer ${token}` },
              params: {
                departmentId: data.departmentId,
                financialYear: data.financialYear,
                quarter: data.quarter,
                businessSegmentId: data.businessSegmentId
              }
            });
  
            console.log('Search response:', response.data);
  
            if (response.data) {
              // Update existing entry
              console.log(`Updating existing entry for user ${data.userId}`);
              return axios.put(`${BASE_URL}/api/agp/${response.data.id}`, {
                user: { id: data.userId },
                department: { id: data.departmentId },
                businessSegment: { id: data.businessSegmentId },
                financialYear: data.financialYear,
                quarter: data.quarter,
                agpValue: data.agpValue
              }, {
                headers: {
                  'Authorization': `Bearer ${token}`,
                  'Content-Type': 'application/json'
                }
              });
            } else {
              // Create new entry
              console.log(`Creating new entry for user ${data.userId}`);
              return axios.post(`${BASE_URL}/api/agp`, {
                user: { id: data.userId },
                department: { id: data.departmentId },
                businessSegment: { id: data.businessSegmentId },
                financialYear: data.financialYear,
                quarter: data.quarter,
                agpValue: data.agpValue
              }, {
                headers: {
                  'Authorization': `Bearer ${token}`,
                  'Content-Type': 'application/json'
                }
              });
            }
          } catch (error) {
            if (error.response && error.response.status === 404) {
              // Entry not found, create new entry
              console.log(`Creating new entry for user ${data.userId}`);
              return axios.post(`${BASE_URL}/api/agp`, {
                user: { id: data.userId },
                department: { id: data.departmentId },
                businessSegment: { id: data.businessSegmentId },
                financialYear: data.financialYear,
                quarter: data.quarter,
                agpValue: data.agpValue
              }, {
                headers: {
                  'Authorization': `Bearer ${token}`,
                  'Content-Type': 'application/json'
                }
              });
            } else {
              console.error('Error checking/saving AGP entry:', error);
              console.error('Error response:', error.response?.data);
              throw error;
            }
          }
        });
        
        const results = await Promise.all(savePromises);
        console.log('Save operations results:', results);
        showSnackbar('AGP entries saved successfully', 'success');
      }
      
      fetchAGPEntries();
      handleClose();
    } catch (error) {
      console.error('Error saving AGP entries:', error);
      console.error('Error response:', error.response?.data);
      if (error.response && error.response.status === 422) {
        const errorMessage = error.response.headers['Error-Message'] || 'Operation not allowed at this time.';
        showSnackbar(errorMessage, 'error');
      } else {
        showSnackbar('Error saving AGP entries', 'error');
      }
    }
  };

  const handleOpen = (entry = null) => {
    if (entry) {
      // Edit mode
      setIsEditMode(true);
      setFormData({
        id: entry.id,
        departmentId: entry.department.id,
        financialYear: entry.financialYear,
        quarter: entry.quarter,
        businessSegmentId: entry.businessSegment.id,
        userId: entry.user.id,
        agpValue: entry.agpValue,
      });
    } else {
      // Add mode
      setIsEditMode(false);
      setFormData({
        id: null,
        departmentId: '',
        financialYear: '',
        quarter: '',
        businessSegmentId: '',
        parentUserId: '',
        parentAgpValue: '',
      });
      setAgpValues([]);
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setFormData({
      id: null,
      departmentId: '',
      financialYear: '',
      quarter: '',
      businessSegmentId: '',
      parentUserId: '',
      parentAgpValue: '',
    });
    setAgpValues([]);
    setIsEditMode(false);
  };

  const showSnackbar = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this AGP entry?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`${BASE_URL}/api/agp/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        showSnackbar('AGP entry deleted successfully', 'success');
        fetchAGPEntries();
      } catch (error) {
        console.error('Error deleting AGP entry:', error);
        showSnackbar('Error deleting AGP entry', 'error');
      }
    }
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

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Employee</TableCell>
              <TableCell>Department</TableCell>
              <TableCell>Business Segment</TableCell>
              <TableCell>Financial Year</TableCell>
              <TableCell>Quarter</TableCell>
              <TableCell>AGP Value</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {agpEntries.length > 0 ? (
              agpEntries.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell>{`${entry.user.firstName} ${entry.user.lastName}`}</TableCell>
                  <TableCell>{entry.department.dep_name}</TableCell>
                  <TableCell>{entry.businessSegment.name}</TableCell>
                  <TableCell>{entry.financialYear}</TableCell>
                  <TableCell>{entry.quarter}</TableCell>
                  <TableCell>{entry.agpValue}</TableCell>
                  <TableCell>
                    <IconButton className="icon-button" onClick={() => handleOpen(entry)}>
                      <Edit />
                    </IconButton>
                    <IconButton className="icon-button" onClick={() => handleDelete(entry.id)}>
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} align="center">No data available</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth scroll="paper">
        <DialogTitle className="dialog-title1">{isEditMode ? 'Edit AGP Entry' : 'Add New AGP Entry'}</DialogTitle>
        <DialogContent className="dialog-content1">
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2} sx={{ mt: 1 }} className="grid-container1">
              {!isEditMode ? (
               <>
               <Grid item xs={12} sm={6} className="grid-item1">
                 <FormControl fullWidth>
                   <InputLabel>Department</InputLabel>
                   <Select
                     name="departmentId"
                     className="text-field1"
                     value={formData.departmentId}
                     onChange={handleInputChange}
                   >
                     {departments.map((dept) => (
                       <MenuItem key={dept.id} value={dept.id}>{dept.dep_name}</MenuItem>
                     ))}
                   </Select>
                 </FormControl>
               </Grid>
               <Grid item xs={12} sm={6} className="grid-item1">
                 <FormControl fullWidth>
                   <InputLabel>Financial Year</InputLabel>
                   <Select
                     name="financialYear"
                     className="text-field1"
                     value={formData.financialYear}
                     onChange={handleInputChange}
                   >
                     {['FY24', 'FY25', 'FY26', 'FY27'].map((fy) => (
                       <MenuItem key={fy} value={fy}>{fy}</MenuItem>
                     ))}
                   </Select>
                 </FormControl>
               </Grid>
               <Grid item xs={12} sm={6} className="grid-item1">
                 <FormControl fullWidth>
                   <InputLabel>Quarter</InputLabel>
                   <Select
                     name="quarter"
                     value={formData.quarter}
                     className="text-field1"
                     onChange={handleInputChange}
                   >
                     {['Q1', 'Q2', 'Q3', 'Q4'].map((q) => (
                       <MenuItem key={q} value={q}>{q}</MenuItem>
                     ))}
                   </Select>
                 </FormControl>
               </Grid>
               <Grid item xs={12} sm={6} className="grid-item1">
                 <FormControl fullWidth>
                   <InputLabel>Business Segment</InputLabel>
                   <Select
                     name="businessSegmentId"
                     className="text-field1"
                     value={formData.businessSegmentId}
                     onChange={handleInputChange}
                   >
                     {businessSegments.map((segment) => (
                       <MenuItem key={segment.id} value={segment.id}>
                         {segment.name}
                       </MenuItem>
                     ))}
                   </Select>
                 </FormControl>
               </Grid>
               <Grid item xs={12} sm={6} className="grid-item1">
                 <FormControl fullWidth>
                   <InputLabel>Parent User</InputLabel>
                   <Select
                     className="text-field1"
                     name="parentUserId"
                     value={formData.parentUserId}
                     onChange={handleInputChange}
                   >
                     {users.map((user) => (
                       <MenuItem key={user.id} value={user.id}>
                         {`${user.firstName} ${user.lastName}`}
                       </MenuItem>
                     ))}
                   </Select>
                 </FormControl>
               </Grid>
               <Grid item xs={12} className="grid-item1">
                 <TextField
                   className="text-field1"
                   fullWidth
                   label="Parent AGP Value"
                   name="parentAgpValue"
                   value={formData.parentAgpValue}
                   onChange={handleInputChange}
                 />
               </Grid>
               {childUsers.map((child, index) => (
                 <Grid item xs={12} key={child.id} className="grid-item1">
                   <TextField
                     className="text-field1"
                     fullWidth
                     label={`AGP Value for ${child.firstName} ${child.lastName}`}
                     value={
                       agpValues.find((agp) => agp.userId === child.id)?.agpValue || ''
                     }
                     onChange={(e) =>
                       handleAgpValueChange(child.id, e.target.value)
                     }
                   />
                 </Grid>
               ))}
             </>
           ) : (
             <Grid item xs={12} className="grid-item1">
               <TextField
                 className="text-field1"
                 fullWidth
                 label="AGP Value"
                 name="agpValue"
                 value={formData.agpValue}
                 onChange={handleInputChange}
               />
             </Grid>
           )}
         </Grid>
       </form>
     </DialogContent>
     <DialogActions className="dialog-actions1">
       <Button className="add-button" onClick={handleClose} color="secondary">
         Cancel
       </Button>
       <Button className="add-button" onClick={handleSubmit} variant="contained" color="primary">
         {isEditMode ? 'Update' : 'Save'}
       </Button>
     </DialogActions>
   </Dialog>

   <Snackbar
     open={snackbarOpen}
     autoHideDuration={6000}
     onClose={handleSnackbarClose}
     message={snackbarMessage}
     severity={snackbarSeverity}
     anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
   />
 </Box>
);
};

export default AGPManagement;