import {
    AssignmentInd,
    PersonAdd,
    Security,
    SupervisorAccount
} from '@mui/icons-material';
import {
    AppBar,
    Tab,
    Tabs
} from '@mui/material';
import React, { useState } from 'react';
import AddEditUser from './user actions/AddEditUser';
import AssignPermissionsToRole from './user actions/AssignPermissionsToRole';
import AssignRoleToUser from './user actions/AssignRoleToUser';
import ManagePermissions from './user actions/ManagePermissions';
import ManageRoles from './user actions/ManageRoles';
import './UserManagement.css';

const UserManagement = () => {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 0:
        return <AddEditUser />;
      case 1:
        return <ManageRoles />;
      case 2:
        return <ManagePermissions />;
      case 3:
        return <AssignRoleToUser />;
      case 4:
        return <AssignPermissionsToRole />;
      default:
        return <AddEditUser />;
    }
  };

  return (
    <div className="user-management">
      <AppBar position="static" color="default">
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab icon={<PersonAdd />} label="Add/Edit User" />
          <Tab icon={<SupervisorAccount />} label="Manage Roles" />
          <Tab icon={<Security />} label="Manage Permissions" />
          <Tab icon={<AssignmentInd />} label="Assign Role to User" />
          <Tab icon={<Security />} label="Assign Permissions to Role" />
        </Tabs>
      </AppBar>
      
      <div className="content">
        {renderContent()}
      </div>
    </div>
  );
};

export default UserManagement;