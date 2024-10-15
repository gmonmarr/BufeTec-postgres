import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './NavBar.css';

const NavBar = () => {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/login');
  };

  // Función para detectar si se ha hecho scroll en la página
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <button className="nav-button" onClick={() => navigate('/')}>Home</button>
      <button className="nav-button" onClick={() => navigate('/view-file')}>View File</button>
      <button className="nav-button" onClick={() => navigate('/change-user-role')}>Change Role</button>
      <button className="nav-button" onClick={() => navigate('/biblioteca')}>Biblioteca</button>
      <button className="nav-button" onClick={() => navigate('/peticion-caso')}>Peticiones Casos</button>
      <button className="nav-button logout" onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default NavBar;
