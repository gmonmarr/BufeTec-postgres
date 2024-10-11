import React, { useState, useEffect } from 'react';
import { getUsers, modifyUserRole } from '../services/api'; // Importamos la API que se encargará de modificar el rol
import NavBar from './NavBar.jsx'; // Importamos la barra de navegación
import './ModifyRole.css'; // Estilos específicos

const ModifyRole = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [selectedUserRole, setSelectedUserRole] = useState('');
  const [newRole, setNewRole] = useState('');
  const [lawyerDetails, setLawyerDetails] = useState({ especialidad: '', experiencia: '' });
  const [clientDetails, setClientDetails] = useState({ direccion: '' });
  const [message, setMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState(''); // Para el filtrado

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await getUsers();
        setUsers(response.data);
        setFilteredUsers(response.data); // Inicialmente los usuarios no filtrados
      } catch (error) {
        setMessage('Error fetching users');
      }
    };

    fetchUsers();
  }, []);

  const handleUserSelect = (id, role) => {
    setSelectedUserId(id);
    setSelectedUserRole(role);
  };

  const handleRoleChange = (e) => {
    setNewRole(e.target.value);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    const query = e.target.value.toLowerCase();
    const filtered = users.filter((user) =>
      user.nombre.toLowerCase().includes(query) || user.email.toLowerCase().includes(query)
    );
    setFilteredUsers(filtered);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      newRole,
      ...(newRole === 'Abogado' ? lawyerDetails : {}),
      ...(newRole === 'Cliente' ? clientDetails : {}),
    };

    try {
      await modifyUserRole(selectedUserId, data);
      setMessage('User role updated successfully');
    } catch (error) {
      setMessage('Error updating user role');
    }
  };

  return (
    <div className="modify-role-layout">
      <NavBar />
      <div className="modify-role-container">
        <h1 className="page-title">Change User Role</h1> {/* Título de la página */}
        <div className="content-wrapper">
          {/* Formulario a la izquierda */}
          <div className="modify-role-form-container">
            <h2 className="modify-role-title">Modify User Role</h2>
            {message && (
              <div className={`modify-role-confirmation-banner ${message === 'User role updated successfully' ? 'success' : 'error'}`}>
                {message}
              </div>
            )}
            <form onSubmit={handleSubmit}>
              <div className="modify-role-input-container">
                <label className="modify-role-label">Selected User ID</label>
                <input type="text" value={selectedUserId} className="modify-role-input" placeholder="User ID" readOnly />
              </div>

              <div className="modify-role-input-container">
                <label className="modify-role-label">Current Role</label>
                <input type="text" value={selectedUserRole} className="modify-role-input" placeholder="Current Role" readOnly />
              </div>

              <div className="modify-role-input-container">
                <label className="modify-role-label">Select New Role</label>
                <select value={newRole} onChange={handleRoleChange} className="modify-role-input">
                  <option value="">Select a role</option>
                  <option value="Abogado">Abogado</option>
                  <option value="Cliente">Cliente</option>
                  <option value="Alumno">Alumno</option>
                </select>
              </div>

              {newRole === 'Abogado' && (
                <>
                  <div className="modify-role-input-container">
                    <label className="modify-role-label">Specialty</label>
                    <input
                      type="text"
                      value={lawyerDetails.especialidad}
                      onChange={(e) => setLawyerDetails({ ...lawyerDetails, especialidad: e.target.value })}
                      className="modify-role-input"
                      placeholder="Enter Specialty"
                    />
                  </div>
                  <div className="modify-role-input-container">
                    <label className="modify-role-label">Experience</label>
                    <input
                      type="text"
                      value={lawyerDetails.experiencia}
                      onChange={(e) => setLawyerDetails({ ...lawyerDetails, experiencia: e.target.value })}
                      className="modify-role-input"
                      placeholder="Enter Experience"
                    />
                  </div>
                </>
              )}

              {newRole === 'Cliente' && (
                <div className="modify-role-input-container">
                  <label className="modify-role-label">Address</label>
                  <input
                    type="text"
                    value={clientDetails.direccion}
                    onChange={(e) => setClientDetails({ ...clientDetails, direccion: e.target.value })}
                    className="modify-role-input"
                    placeholder="Enter Address"
                  />
                </div>
              )}

              <button type="submit" className="modify-role-button">Modify Role</button>
            </form>
          </div>

          {/* Grid de usuarios a la derecha */}
          <div className="users-grid-container">
            <h3 className="users-grid-title">Select User</h3>
            <input
              type="text"
              placeholder="Search by name or email"
              value={searchQuery}
              onChange={handleSearchChange}
              className="search-input"
            />
            {filteredUsers.length > 0 ? (
              <div className="users-grid-wrapper">
                <table className="users-grid-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Birth Date</th>
                      <th>Current Role</th>
                      <th>Select</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user) => (
                      <tr key={user.id}>
                        <td>{user.id}</td>
                        <td>{user.nombre}</td>
                        <td>{user.email}</td>
                        <td>{new Date(user.fecha_nacimiento).toLocaleDateString()}</td>
                        <td>{user.rol}</td>
                        <td>
                          <button onClick={() => handleUserSelect(user.id, user.rol)} className="select-user-button">
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
      </div>
    </div>
  );
};

export default ModifyRole;
