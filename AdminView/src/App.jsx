import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import ModifyRole from './components/ModifyRole';
import ViewFile from './components/ViewFile';
import Login from './components/Login';
import Biblioteca from './components/Biblioteca';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Verificar si el usuario está autenticado
  const checkAuth = () => {
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        const { role } = JSON.parse(atob(token.split('.')[1])); // Decodificar el JWT
        if (role === 'Admin' || role === 'Abogado') {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Error al decodificar el token", error);
        setIsAuthenticated(false);
      }
    } else {
      setIsAuthenticated(false);
    }
    setLoading(false); // Terminar la verificación de autenticación
  };

  useEffect(() => {
    checkAuth(); // Verificar autenticación al montar el componente
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Muestra un mensaje de carga mientras verificamos el token
  }

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />}
        />
        <Route
          path="/change-user-role"
          element={isAuthenticated ? <ModifyRole /> : <Navigate to="/login" />}
        />
        <Route
          path="/view-file"
          element={isAuthenticated ? <ViewFile /> : <Navigate to="/login" />}
        />
        <Route
          path="/biblioteca"
          element={isAuthenticated ? <Biblioteca /> : <Navigate to="/login" />}
        />
      </Routes>
    </Router>
  );
};

export default App;
