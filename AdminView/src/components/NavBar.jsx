import React from 'react';
import { useNavigate } from 'react-router-dom';
import './NavBar.css';

const NavBar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/login');
  };

  return (
    <div className="navbar">
      <button className="nav-button" onClick={() => navigate('/')}>Home</button>
      <button className="nav-button" onClick={() => navigate('/view-file')}>View File</button>
      <button className="nav-button" onClick={() => navigate('/change-user-role')}>Change Role</button>
      <button className="nav-button" onClick={() => navigate('/biblioteca')}>Biblioteca</button>
      <button className="nav-button" onClick={() => navigate('/peticion-caso')}>Peticiones Casos</button>
      <button className="nav-button logout" onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default NavBar;
