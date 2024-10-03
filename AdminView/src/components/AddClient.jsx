import React, { useState } from 'react';
import { addClient, registerUser } from '../services/api';
import './AddClient.css';

const AddClient = () => {
  const [client, setClient] = useState({
    nombre: '',
    email: '',
    contrasena: '',
    direccion: '',
    fecha_nacimiento: '',
    sexo: '',
    numero_telefono: ''
  });

  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setClient({ ...client, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const userResponse = await registerUser({
        nombre: client.nombre,
        email: client.email,
        contrasena: client.contrasena,
        fecha_nacimiento: client.fecha_nacimiento,
        sexo: client.sexo,
        numero_telefono: client.numero_telefono,
        rol: 'cliente'
      });

      const id_usuario = userResponse.data.id;

      await addClient({
        id_usuario,
        direccion: client.direccion
      });

      setMessage('Client added successfully');
    } catch (error) {
      setMessage('Error adding client');
    }
  };

  return (
    <div className="add-client-form-container">
      <h2 className="add-client-title">Add Client</h2>
      {message && <div className="add-client-confirmation-banner">{message}</div>}
      <form onSubmit={handleSubmit}>
        <div className="add-client-input-container">
          <input type="text" name="nombre" value={client.nombre} onChange={handleChange} className="add-client-input" placeholder=" " />
          <label className="add-client-label">Name:</label>
        </div>
        <div className="add-client-input-container">
          <input type="email" name="email" value={client.email} onChange={handleChange} className="add-client-input" placeholder=" " />
          <label className="add-client-label">Email:</label>
        </div>
        <div className="add-client-input-container">
          <input type="password" name="contrasena" value={client.contrasena} onChange={handleChange} className="add-client-input" placeholder=" " />
          <label className="add-client-label">Password:</label>
        </div>
        <div className="add-client-input-container">
          <input type="date" name="fecha_nacimiento" value={client.fecha_nacimiento} onChange={handleChange} className="add-client-input" placeholder=" " />
          <label className="add-client-label">Date of Birth:</label>
        </div>
        <div className="add-client-input-container">
          <input type="text" name="sexo" value={client.sexo} onChange={handleChange} className="add-client-input" placeholder=" " />
          <label className="add-client-label">Sex:</label>
        </div>
        <div className="add-client-input-container">
          <input type="text" name="numero_telefono" value={client.numero_telefono} onChange={handleChange} className="add-client-input" placeholder=" " />
          <label className="add-client-label">Phone Number:</label>
        </div>
        <div className="add-client-input-container">
          <input type="text" name="direccion" value={client.direccion} onChange={handleChange} className="add-client-input" placeholder=" " />
          <label className="add-client-label">Address:</label>
        </div>
        <button type="submit" className="add-client-button">Add Client</button>
      </form>
    </div>
  );
};

export default AddClient;
