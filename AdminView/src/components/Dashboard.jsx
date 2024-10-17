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
          <h1>Bienvenido a BufeteTec</h1>
          <p>Tu plataforma para gestionar archivos legales y roles de manera eficiente.</p>
        </header>
        
        {/* Sección de tarjetas de navegación */}
        <div className="cards-section">
          <div className="card" onClick={() => navigate('/view-file')}>
            <h2>Ver Archivos</h2>
            <p>Accede y gestiona todos tus archivos legales.</p>
          </div>
          <div className="card" onClick={() => navigate('/change-user-role')}>
            <h2>Cambiar Roles</h2>
            <p>Administra los roles de usuarios en el sistema.</p>
          </div>
          <div className="card" onClick={() => navigate('/biblioteca')}>
            <h2>Biblioteca</h2>
            <p>Sube, visualiza y elimina archivos de la biblioteca.</p>
          </div>
          <div className="card" onClick={() => navigate('/peticion-caso')}>
            <h2>Peticiones de Casos</h2>
            <p>Revisa y responde a las solicitudes de casos.</p>
          </div>
        </div>
        
        {/* Sección de resumen */}
        <div className="summary-section">
          <h3>Resumen</h3>
          <p>Tienes <strong>5 solicitudes pendientes</strong> y <strong>3 archivos nuevos</strong> para revisar.</p>
        </div>
      </div>

      {/* Pie de página */}
      <footer className="footer">
        <p>© 2024 BufeteTec - Todos los derechos reservados.</p>
        <a href="#">Política de Privacidad</a> | <a href="#">Contáctanos</a>
      </footer>
    </div>
  );
};

export default Dashboard;
