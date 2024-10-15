import React from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from './NavBar';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="dashboard-layout">
      <NavBar />
      
      <div className="dashboard-container">
        {/* Sección de bienvenida */}
        <header className="welcome-section">
          <h1>Welcome to BufeteTec</h1>
          <p>Your platform for managing legal files and roles efficiently.</p>
        </header>
        
        {/* Sección de tarjetas de navegación */}
        <div className="cards-section">
          <div className="card" onClick={() => navigate('/view-file')}>
            <h2>View Files</h2>
            <p>Access and manage all your legal files.</p>
          </div>
          <div className="card" onClick={() => navigate('/change-user-role')}>
            <h2>Change Roles</h2>
            <p>Manage user roles in the system.</p>
          </div>
          <div className="card" onClick={() => navigate('/biblioteca')}>
            <h2>Biblioteca</h2>
            <p>Upload, view, and delete files from the library.</p>
          </div>
          <div className="card" onClick={() => navigate('/peticion-caso')}>
            <h2>Peticiones Casos</h2>
            <p>Review and respond to case requests.</p>
          </div>
        </div>
        
        {/* Sección de resumen */}
        <div className="summary-section">
          <h3>Summary</h3>
          <p>You have <strong>5 pending requests</strong> and <strong>3 new files</strong> to review.</p>
        </div>
      </div>

      {/* Pie de página */}
      <footer className="footer">
        <p>© 2024 BufeteTec - All rights reserved.</p>
        <a href="#">Privacy Policy</a> | <a href="#">Contact Us</a>
      </footer>
    </div>
  );
};

export default Dashboard;
