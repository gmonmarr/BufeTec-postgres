import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import AddLawyer from './components/AddLawyer';
import AddClient from './components/AddClient';
import Login from './components/Login';

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
          path="/add-lawyer"
          element={isAuthenticated ? <AddLawyer /> : <Navigate to="/login" />}
        />
        <Route
          path="/add-client"
          element={isAuthenticated ? <AddClient /> : <Navigate to="/login" />}
        />
      </Routes>
    </Router>
  );
};

export default App;
