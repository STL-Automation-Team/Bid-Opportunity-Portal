import React from 'react';
import { useNavigate } from 'react-router-dom'; // Assuming you're using React Router
import logo from '../images/itamlogo.png';
import '../styles/List.css';
import '../styles/navbar.scss';


export default function Navbar({onLogout}) {
  const navigate = useNavigate();

    const handleLogout = () => {
        // Perform logout actions here, such as clearing local storage, resetting state, etc.
        // For example, clear any tokens or session data
        onLogout(false);
    };
    
  return (
<nav>
  <ul id="navbar">
  <a className="navbar-brand" href="/">
    <img className="logoimg" src={logo} />
  </a>
  {/* <div class="search-box">
    <button class="btn-search"><i class="bi bi-search"></i></button>
    <input type="text" class="input-search" placeholder="Type to Search..."/>
  </div> */}
    {/* <li className="nav-menu"><i class="bi bi-plus-circle-fill"></i>Create New<i class="bi bi-caret-down-fill"></i>
      <ul class="drop">
        <div>
        <li><i class="bi bi-menu-button-wide-fill"></i>Network Asset</li>
        <li><i class="bi bi-server"></i>Virtual Server</li>
        <li><i class="bi bi-people-fill"></i>User</li>
        <li><i class="bi bi-briefcase-fill"></i>Service</li>
        <li><i class="bi bi-file-earmark-text-fill"></i>License</li>
        </div>
      </ul>
    </li>
    <li className="nav-menu"><i class="bi bi-person-bounding-box"></i>Admin Profile<i class="bi bi-caret-down-fill"></i>
      <ul class="drop">
        <div>
        <li><i class="bi bi-person-fill"></i>Edit Profile</li>
        <li><i class="bi bi-pencil-fill"></i>Change Password</li>
        <li><i class="bi bi-card-checklist"></i>Your Assets</li>
        </div>
      </ul>
    </li> */}
    <li className="nav-menu"  onClick={handleLogout}><i class="bi bi-gear-fill"></i>Logout</li>
    {/* <div id="marker"></div> */}
  </ul>
</nav>

  )
}
