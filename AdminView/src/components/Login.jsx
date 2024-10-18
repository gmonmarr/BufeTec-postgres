import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api'; // Importamos la API
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/usuarios/login', { email, contrasena: password });
      const { token } = response.data;
  
      // Guardamos el token en localStorage
      localStorage.setItem('authToken', token);
  
      // Verificamos el rol del usuario
      const { role } = JSON.parse(atob(token.split('.')[1])); // Decodificar el JWT
  
      if (role === 'Admin' || role === 'Abogado' || role === 'Alumno') {
        navigate('/');
      } else {
        setErrorMessage('No tienes permiso para acceder.');
        localStorage.removeItem('authToken'); // Limpiamos el token si el rol no es válido
      }
    } catch (error) {
      setErrorMessage('Error al iniciar sesión. Por favor verifica tus credenciales.');
    }
  };

  return (
    <div className="login-container">
      <h2>Iniciar Sesión</h2>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      <form onSubmit={handleLogin}>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Contraseña:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Iniciar Sesión</button>
      </form>
    </div>
  );
};

export default Login;
