// client/src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage         from './components/LandingPage';
import LoginPage           from './components/LoginPage';
import DashboardPage       from './components/DashboardPage';
import UserManagementPage  from './components/UserManagementPage';
import UserProfilePage     from './components/UserProfilePage';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/"          element={<LandingPage />} />
        <Route path="/login"     element={<LoginPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />

        {/* Admin-only: user mgmt */}
        <Route path="/users"     element={<UserManagementPage />} />
        <Route path="/users/:id" element={<UserProfilePage />} />

        <Route path="/clubs"     element={<div>Club Activity</div>} />
        <Route path="/venues"    element={<div>Venue Management</div>} />
      </Routes>
    </Router>
  );
}

export default App;
