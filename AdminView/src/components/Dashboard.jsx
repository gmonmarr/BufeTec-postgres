import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();

  const lawyers = [
    { id: 1, nombre: 'John Doe', especialidad: 'Criminal Law' },
    { id: 2, nombre: 'Jane Smith', especialidad: 'Corporate Law' },
    { id: 3, nombre: 'Michael Johnson', especialidad: 'Family Law' },
  ];

  const clients = [
    { id: 1, nombre: 'Alice Williams', direccion: '123 Main St' },
    { id: 2, nombre: 'Bob Brown', direccion: '456 Oak St' },
    { id: 3, nombre: 'Charlie Davis', direccion: '789 Pine St' },
  ];

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Admin Panel</h1>
      
      <div className="dashboard-grid-section">
        <div className="dashboard-section-header">
          <h2 className="dashboard-section-title">Lawyers</h2>
          <button className="dashboard-add-button" onClick={() => navigate('/add-lawyer')}>Add Lawyer</button>
        </div>
        <div className="dashboard-grid">
          {lawyers.map((lawyer) => (
            <div key={lawyer.id} className="dashboard-grid-item">
              <p><strong>{lawyer.nombre}</strong></p>
              <p>{lawyer.especialidad}</p>
            </div>
          ))}
        </div>
      </div>
      
      <div className="dashboard-grid-section">
        <div className="dashboard-section-header">
          <h2 className="dashboard-section-title">Clients</h2>
          <button className="dashboard-add-button" onClick={() => navigate('/add-client')}>Add Client</button>
        </div>
        <div className="dashboard-grid">
          {clients.map((client) => (
            <div key={client.id} className="dashboard-grid-item">
              <p><strong>{client.nombre}</strong></p>
              <p>{client.direccion}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
