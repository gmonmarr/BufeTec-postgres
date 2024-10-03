import React, { useState, useEffect } from 'react';
import { addLawyer, getUsers } from '../services/api.js';
import './AddLawyer.css';

const AddLawyer = () => {
  const [lawyer, setLawyer] = useState({
    especialidad: '',
    experiencia: ''
  });

  const [idUsuario, setIdUsuario] = useState('');
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await getUsers();
        console.log('Users fetched:', response.data); 
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
        setMessage('Error fetching users');
      }
    };
  
    fetchUsers();
  }, []);

  const handleChange = (e) => {
    setLawyer({ ...lawyer, [e.target.name]: e.target.value });
  };

  const handleUserSelect = (id) => {
    setIdUsuario(id);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await addLawyer({
        id_usuario: idUsuario,
        especialidad: lawyer.especialidad,
        experiencia: lawyer.experiencia
      });

      setMessage('Lawyer added successfully');
    } catch (error) {
      setMessage('Error adding lawyer');
    }
  };

  return (
    <div className="add-lawyer-container">
      <div className="add-lawyer-form-container">
        <h2 className="add-lawyer-title">Add Lawyer</h2>
        {message && <div className={`add-lawyer-confirmation-banner ${message === 'Lawyer added successfully' ? 'success' : 'error'}`}>{message}</div>}
        <form onSubmit={handleSubmit}>
          <div className="add-lawyer-input-container">
            <label className="add-lawyer-label">Specialty</label>
            <input
              type="text"
              name="especialidad"
              value={lawyer.especialidad}
              onChange={handleChange}
              className="add-lawyer-input"
              placeholder="Enter Specialty"
            />
          </div>
          <div className="add-lawyer-input-container">
            <label className="add-lawyer-label">Experience</label>
            <input
              type="text"
              name="experiencia"
              value={lawyer.experiencia}
              onChange={handleChange}
              className="add-lawyer-input"
              placeholder="Enter Experience"
            />
          </div>
          <div className="add-lawyer-input-container">
            <label className="add-lawyer-label">Selected User ID</label>
            <input
              type="text"
              name="idUsuario"
              value={idUsuario}
              className="add-lawyer-input"
              placeholder="User ID"
              readOnly
            />
          </div>
          <button type="submit" className="add-lawyer-button">Add Lawyer</button>
        </form>
      </div>

      {/* Grid de usuarios */}
      <div className="users-grid-container">
        <h3 className="users-grid-title">Select User</h3>
        {users.length > 0 ? (
          <div className="users-grid-wrapper">
            <table className="users-grid-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Birth Date</th> {/* Cambiado de "Role" a "Birth Date" */}
                  <th>Select</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.nombre}</td>
                    <td>{user.email}</td>
                    <td>{new Date(user.fecha_nacimiento).toLocaleDateString()}</td> {/* Mostrar fecha en formato legible */}
                    <td>
                      <button
                        onClick={() => handleUserSelect(user.id)}
                        className="select-user-button"
                      >
                        Select
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="no-users">No users available</div>
        )}
      </div>
    </div>
  );
};

export default AddLawyer;
