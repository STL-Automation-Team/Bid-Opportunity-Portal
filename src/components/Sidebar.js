import React, { useState } from "react";
import { Link } from "react-router-dom";
import logo from '../images/itamlogo.png';
import '../styles/sidebar.css';

const Sidebar = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  const handleDropdownToggle = (e) => {
    const arrowParent = e.target.parentElement.parentElement;
    arrowParent.classList.toggle("showMenu");
  };

  const handleSidebarToggle = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className={`sidebar ${isSidebarOpen ? "open" : "close"}`}>
        <div className="toggle-btn">
        <img className="logoimg" src={logo} />
          <i
            className="bi bi-list"
            onClick={handleSidebarToggle}
          ></i>
        </div>
      
      <ul className="nav-links">
      
        
        <li>
          <Link to="/analytics">
            <i className="bi bi-grid-1x2-fill"></i>
            <span className="link_name">Dashboard</span>
          </Link>
          <ul className="sub-menu blank">
            <li>
              <Link className="link_name" href="#" to="/">
                Dashboard
              </Link>
            </li>
          </ul>
        </li>

        {/* <li>
          <div className="iocn-link">
            <Link >
              <i className="bi bi-stack"></i>
              <span className="link_name">Assets</span>
            </Link>
            <i
              className="bi bi-chevron-down arrow"
              onClick={handleDropdownToggle}
            ></i>
          </div>
          <ul className="sub-menu">
            <li>
              <Link className="link_name">
                Assets
              </Link>
            </li>
            <li>
              <Link to="/assetslist">Network Assets</Link>
            </li>
            <li>
              <Link to="/assetslist">Virtual Servers</Link>
            </li>
          </ul>
        </li> */}

        {/* <li>
          <Link to="/licenseslist">
            <i className="bi bi-file-earmark-text-fill"></i>
            <span className="link_name">Licenses</span>
          </Link>
          <ul className="sub-menu blank">
            <li>
              <Link className="link_name" to="/licenseslist">
                Licenses
              </Link>
            </li>
          </ul>
        </li> */}

        <li>
          <Link to="/addopportunity">
            <i className="bi bi-file-earmark-text-fill"></i>
            <span className="link_name">Add Opportunity</span>
          </Link>
          <ul className="sub-menu blank">
            <li>
              <Link className="link_name" to="/addopportunity">
              Opportunity
              </Link>
            </li>
          </ul>
        </li>


        <li>
          <Link to="/operationslist">
            <i className="bi bi-ticket-detailed-fill"></i>
            <span className="link_name">Track Status</span>
          </Link>
          <ul className="sub-menu blank">
            <li>
              <Link className="link_name" to="/operationslist">
                Track Status
              </Link>
            </li>
          </ul>
        </li>

        <li>
          <Link to="/userslist">
            <i className="bi bi-people-fill"></i>
            <span className="link_name">Manage User</span>
          </Link>
          <ul className="sub-menu blank">
            <li>
              <Link className="link_name" to="/userslist">
                Users
              </Link>
            </li>
          </ul>
        </li>
        <li>
          <div className="iocn-link">
            <Link >
              <i className="bi bi-gear-fill"></i>
              <span className="link_name">Settings</span>
            </Link>
            <i
              className="bi bi-chevron-down arrow"
              onClick={handleDropdownToggle}
            ></i>
          </div>
          <ul className="sub-menu">
            <li>
              <Link className="link_name">
                Settings
              </Link>
            </li>
            {/* <li>
              <Link to="/modellist">User Management</Link>
            </li> */}
            <li>
              <Link to="/customfieldslist">Data Management</Link>
            </li>
          </ul>
        </li>
      </ul>
      {/* <section >
        <div >
          <i
            className="bi bi-list"
            onClick={handleSidebarToggle}
          ></i>
          <span className="text">Drop Down Sidebar</span>
        </div>
      </section> */}
    </div>
  );
};

export default Sidebar;
