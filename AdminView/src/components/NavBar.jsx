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
      <button className="nav-button" onClick={() => navigate('/')}>Inicio</button>
      <button className="nav-button" onClick={() => navigate('/view-file')}>Ver Archivo</button>
      <button className="nav-button" onClick={() => navigate('/change-user-role')}>Cambiar Rol</button>
      <button className="nav-button" onClick={() => navigate('/biblioteca')}>Biblioteca</button>
      <button className="nav-button" onClick={() => navigate('/peticion-caso')}>Peticiones de Casos</button>
      <button className="nav-button logout" onClick={handleLogout}>Cerrar Sesión</button>
    </div>
  );
};

export default NavBar;
