import React from 'react';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        {/* Airline Management Title */}
        <Link className="navbar-brand" to="/">Airline Management</Link>

        {/* Navigation Links */}
        <div className="navbar-collapse"> {/* Ensure the links are always visible */}
          <ul className="navbar-nav ms-auto"> {/* Use ms-auto for right alignment */}
            <li className="nav-item">
              <Link className="nav-link" to="/home">Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/crew">Crew</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/aircrafts">Aircrafts</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/schedule">Schedule</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/balance">Balance Sheet</Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
