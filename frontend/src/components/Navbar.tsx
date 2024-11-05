import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import '../styles/Navbar.css';

const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    // Navigate to login page on logout
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg elegant-navbar">
      <div className="container-fluid">
        {/* Airline Management Title */}
        <Link className="navbar-brand" to="/home">Airline Management</Link>

        {/* Navigation Links */}
        <div className="navbar-collapse">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className={`nav-link ${location.pathname === "/home" ? "active" : ""}`} to="/home">Home</Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${location.pathname === "/crew" ? "active" : ""}`} to="/crew">Crew</Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${location.pathname === "/aircrafts" ? "active" : ""}`} to="/aircrafts">Aircrafts</Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${location.pathname === "/schedule" ? "active" : ""}`} to="/schedule">Schedule</Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${location.pathname === "/balance" ? "active" : ""}`} to="/balance">Balance Sheet</Link>
            </li>
          </ul>
          {/* Distinct Logout Button */}
          <button className="btn logout-button" onClick={handleLogout}>Logout</button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
