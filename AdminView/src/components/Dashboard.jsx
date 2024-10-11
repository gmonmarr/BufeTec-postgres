import React from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from './NavBar'; // Importamos la barra de navegación
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="dashboard-layout">
      <NavBar />
      <div className="dashboard-container">
        <h1 className="dashboard-title">Admin Panel</h1>
        <p className="dashboard-subtitle">Select one of the following functionalities:</p>
        
        <div className="dashboard-options">
          <div className="dashboard-option" onClick={() => navigate('/change-user-role')}>
            <h2 className="option-title">Change User Role</h2>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
