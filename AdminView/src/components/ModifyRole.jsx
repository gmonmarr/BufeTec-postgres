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
        setMessage('Error al obtener los usuarios');
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
      setMessage('El rol del usuario se ha actualizado correctamente');
      const response = await getUsers();
      setUsers(response.data);
      setFilteredUsers(response.data); 
    } catch (error) {
      setMessage('Error al actualizar el rol del usuario');
    }
  };

  return (
    <div className="modify-role-layout">
      <NavBar />
      <div className="modify-role-container">
        <h1 className="page-title">Cambiar Rol de Usuario</h1> {/* Título de la página */}
        <div className="content-wrapper">
          {/* Formulario a la izquierda */}
          <div className="modify-role-form-container">
            <h2 className="modify-role-title">Modificar Rol de Usuario</h2>
            {message && (
              <div className={`modify-role-confirmation-banner ${message === 'El rol del usuario se ha actualizado correctamente' ? 'success' : 'error'}`}>
                {message}
              </div>
            )}
            <form onSubmit={handleSubmit}>
              <div className="modify-role-input-container">
                <label className="modify-role-label">ID de Usuario Seleccionado</label>
                <input type="text" value={selectedUserId} className="modify-role-input" placeholder="ID de Usuario" readOnly />
              </div>

              <div className="modify-role-input-container">
                <label className="modify-role-label">Rol Actual</label>
                <input type="text" value={selectedUserRole} className="modify-role-input" placeholder="Rol Actual" readOnly />
              </div>

              <div className="modify-role-input-container">
                <label className="modify-role-label">Seleccionar Nuevo Rol</label>
                <select value={newRole} onChange={handleRoleChange} className="modify-role-input">
                  <option value="">Selecciona un rol</option>
                  <option value="Abogado">Abogado</option>
                  <option value="Cliente">Cliente</option>
                  <option value="Alumno">Alumno</option>
                </select>
              </div>

              {newRole === 'Abogado' && (
                <>
                  <div className="modify-role-input-container">
                    <label className="modify-role-label">Especialidad</label>
                    <input
                      type="text"
                      value={lawyerDetails.especialidad}
                      onChange={(e) => setLawyerDetails({ ...lawyerDetails, especialidad: e.target.value })}
                      className="modify-role-input"
                      placeholder="Ingresa la especialidad"
                    />
                  </div>
                  <div className="modify-role-input-container">
                    <label className="modify-role-label">Experiencia</label>
                    <input
                      type="text"
                      value={lawyerDetails.experiencia}
                      onChange={(e) => setLawyerDetails({ ...lawyerDetails, experiencia: e.target.value })}
                      className="modify-role-input"
                      placeholder="Ingresa la experiencia"
                    />
                  </div>
                </>
              )}

              {newRole === 'Cliente' && (
                <div className="modify-role-input-container">
                  <label className="modify-role-label">Dirección</label>
                  <input
                    type="text"
                    value={clientDetails.direccion}
                    onChange={(e) => setClientDetails({ ...clientDetails, direccion: e.target.value })}
                    className="modify-role-input"
                    placeholder="Ingresa la dirección"
                  />
                </div>
              )}

              <button type="submit" className="modify-role-button">Modificar Rol</button>
            </form>
          </div>

          {/* Grid de usuarios a la derecha */}
          <div className="users-grid-container">
            <h3 className="users-grid-title">Seleccionar Usuario</h3>
            <input
              type="text"
              placeholder="Buscar por nombre o email"
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
                      <th>Nombre</th>
                      <th>Email</th>
                      <th>Fecha de Nacimiento</th>
                      <th>Rol Actual</th>
                      <th>Seleccionar</th>
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
                            Seleccionar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="no-users">No hay usuarios disponibles</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModifyRole;
