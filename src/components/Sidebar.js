import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import logo from '../images/itamlogo.png';
import '../styles/sidebar.css';

const Sidebar = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [permissions, setPermissions] = useState([]);
  const sidebarRef = useRef(null);

  useEffect(() => {
    const auth = localStorage.getItem('auth');
    if (auth) {
      setPermissions(auth); // Parse JSON string to array
    }

    // Event delegation for dropdown toggles
    const handleClick = (e) => {
      const arrow = e.target.closest('.arrow');
      if (!arrow) return;

      const listItem = arrow.closest("li");
      if (!listItem?.classList) {
        console.warn("Toggle: could not find list item for", arrow);
        return;
      }

      listItem.classList.toggle("showMenu");
    };

    const sidebar = sidebarRef.current;
    if (sidebar) {
      sidebar.addEventListener('click', handleClick);
    }

    // Cleanup
    return () => {
      if (sidebar) {
        sidebar.removeEventListener('click', handleClick);
      }
    };
  }, []);

  const handleSidebarToggle = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const hasPermission = (requiredPermission) => {
    return permissions.includes(requiredPermission) || permissions.includes("ADMIN");
  };

    return (
      <div className={`sidebar ${isSidebarOpen ? "open" : "close"}`} ref={sidebarRef}>
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

        {hasPermission("VIEW") && (
          <li>
            <Link to="/BidProgressOverview">
              <i className="bi bi-ticket-detailed-fill"></i>
              <span className="link_name">Current Bid Status</span>
            </Link>
            <ul className="sub-menu blank">
              <li>
                <Link className="link_name" to="/BidProgressOverview">Current Bid Status</Link>
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
                <Link className="link_name" to="/addopportunity">Add Opportunity</Link>
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
              <span className="link_name">Bid Funnel</span>
            </Link>
            <ul className="sub-menu blank">
              <li>
                <Link className="link_name" to="/operationslist">Bid Funnel</Link>
              </li>
            </ul>
          </li>
        )}

      {hasPermission("VIEW") && (
        <li>
          <a href="https://pgp.sterliteapps.com/" target="_blank" rel="noopener noreferrer">
            <i className="bi bi-ticket-detailed-fill"></i>
            <span className="link_name">CRM</span>
          </a>
          <ul className="sub-menu blank">
            <li>
              <a className="link_name" href="https://pgp.sterliteapps.com/" target="_blank" rel="noopener noreferrer">
                CRM
              </a>
            </li>
          </ul>
        </li>
      )}


        {/* {hasPermission("VIEW") && (
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
        )} */}

        {hasPermission("ADMIN") && (
          <li>
            <Link to="/userslist">
              <i className="bi bi-people-fill"></i>
              <span className="link_name">Manage User</span>
            </Link>
            <ul className="sub-menu blank">
              <li>
                <Link className="link_name" to="/userslist">Manage Users</Link>
              </li>
            </ul>
          </li>
        )}

{hasPermission("ADMIN") && (
          <li>
            <div className="iocn-link">
              <Link>
                <i className="bi bi-gear-fill"></i>
                <span className="link_name">Settings</span>
              </Link>
              <i className="bi bi-chevron-down arrow"></i>
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