import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import logo from '../images/itamlogo.png';
import '../styles/sidebar.css';

const Sidebar = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  const [permissions, setPermissions] = useState([]);
  useEffect(() => {
    const auth = localStorage.getItem('auth');
    if (auth) {
      setPermissions(auth); // Parse JSON string to array
    }
  }, []);
  
  const handleDropdownToggle = (e) => {
    const arrowParent = e.target.parentElement.parentElement;
    arrowParent.classList.toggle("showMenu");
  };

  const handleSidebarToggle = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const hasPermission = (requiredPermission) => {
    return permissions.includes(requiredPermission) || permissions.includes("ADMIN");
  };

    return (
    <div className={`sidebar ${isSidebarOpen ? "open" : "close"}`}>
      <div className="toggle-btn">
        <img className="logoimg" src={logo} alt="Logo" />
        <i className="bi bi-list" onClick={handleSidebarToggle}></i>
      </div>
      
      <ul className="nav-links">
        {hasPermission("VIEW") && (
          <li>
            <Link to="/analytics">
              <i className="bi bi-grid-1x2-fill"></i>
              <span className="link_name">Dashboard</span>
            </Link>
            <ul className="sub-menu blank">
              <li>
                <Link className="link_name" to="/analytics">Dashboard</Link>
              </li>
            </ul>
          </li>
        )}

        {hasPermission("EDIT") && (
          <li>
            <Link to="/addopportunity">
              <i className="bi bi-file-earmark-text-fill"></i>
              <span className="link_name">Add Opportunity</span>
            </Link>
            <ul className="sub-menu blank">
              <li>
                <Link className="link_name" to="/addopportunity">Opportunity</Link>
              </li>
            </ul>
          </li>
        )}

        {hasPermission("EDIT") && (
          <li>
            <Link to="/approvals">
              <i className="bi bi-check-circle-fill"></i>
              <span className="link_name">My Approvals</span>
            </Link>
            <ul className="sub-menu blank">
              <li>
                <Link className="link_name" to="/approvals">My Approvals</Link>
              </li>
            </ul>
          </li>
        )}

        {hasPermission("VIEW") && (
          <li>
            <Link to="/operationslist">
              <i className="bi bi-ticket-detailed-fill"></i>
              <span className="link_name">Track Status</span>
            </Link>
            <ul className="sub-menu blank">
              <li>
                <Link className="link_name" to="/operationslist">Track Status</Link>
              </li>
            </ul>
          </li>
        )}

        {hasPermission("VIEW") && (
          <li>
            <Link to="/sourcedBid">
            <i className="bi bi-info-circle-fill"></i>
            <span className="link_name">Auto-Sourced Bids</span>
            </Link>
            <ul className="sub-menu blank">
              <li>
                <Link className="link_name" to="/operationslist">Auto-Sourced Bids</Link>
              </li>
            </ul>
          </li>
        )}

        {hasPermission("EDIT") && (
          <li>
            <Link to="/userslist">
              <i className="bi bi-people-fill"></i>
              <span className="link_name">Manage User</span>
            </Link>
            <ul className="sub-menu blank">
              <li>
                <Link className="link_name" to="/userslist">Users</Link>
              </li>
            </ul>
          </li>
        )}

        {(hasPermission("EDIT")) && (
          <li>
            <div className="iocn-link">
              <Link>
                <i className="bi bi-gear-fill"></i>
                <span className="link_name">Settings</span>
              </Link>
              <i className="bi bi-chevron-down arrow" onClick={handleDropdownToggle}></i>
            </div>
            <ul className="sub-menu">
              <li>
                <Link className="link_name">Settings</Link>
              </li>
              <li>
                <Link to="/customfieldslist">Data Management</Link>
              </li>
            </ul>
          </li>
        )}
      </ul>
    </div>
  );
};

export default Sidebar;