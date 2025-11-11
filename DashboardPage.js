// client/src/components/DashboardPage.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './DashboardPage.css';

const DashboardPage = () => {
  const navigate = useNavigate();
  const raw = localStorage.getItem('user');
  if (!raw) {
    navigate('/login');
    return null;
  }
  const user = JSON.parse(raw);
  const displayName = user.name || user.email;

  return (
    <div className="dashboard-container">
      <h1 className="welcome-title">Welcome, {displayName}!</h1>
      <p className="role-text">Your role: <strong>{user.role.toUpperCase()}</strong></p>

      <div className="button-container">
        {user.role === 'admin' && (
          <>
            <Link to="/users"  className="nav-button">User Management</Link>
            <Link to="/clubs"  className="nav-button">Club Activity</Link>
            <Link to="/venues" className="nav-button">Venue Management</Link>
          </>
        )}
        {(user.role === 'student' || user.role === 'staff') && (
          <>
            <Link to="/clubs"  className="nav-button">Club Activity</Link>
            <Link to="/venues" className="nav-button">Venue Management</Link>
          </>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
