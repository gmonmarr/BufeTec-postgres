import React, { useState, useEffect } from 'react';
import { getUsers, getUserFiles } from '../services/api'; // API para obtener usuarios y archivos
import NavBar from './NavBar.jsx'; // Importamos la barra de navegación
import './ViewFile.css'; // Puedes personalizar los estilos

const ViewFiles = () => {
    const [users, setUsers] = useState([]); // Almacena los usuarios
    const [filteredUsers, setFilteredUsers] = useState([]); // Almacena los usuarios filtrados por búsqueda
    const [selectedUserId, setSelectedUserId] = useState(''); // Almacena el ID del usuario seleccionado
    const [userFiles, setUserFiles] = useState([]); // Almacena los archivos del usuario seleccionado
    const [message, setMessage] = useState('Selecciona un usuario'); // Mensaje por defecto para la sección de archivos
    const [searchQuery, setSearchQuery] = useState(''); // Para el filtrado de usuarios
  
    // Cargar los usuarios al montar el componente
    useEffect(() => {
      const fetchUsers = async () => {
        try {
          const response = await getUsers(); // Llamamos a la API para obtener los usuarios
          setUsers(response.data); // Guardamos los usuarios
          setFilteredUsers(response.data); // Inicialmente mostramos todos los usuarios
        } catch (error) {
          setMessage('Error fetching users');
        }
      };
  
      fetchUsers();
    }, []);
  
    // Manejar la selección de un usuario
    const handleUserSelect = async (id) => {
      setSelectedUserId(id); // Establece el ID del usuario seleccionado
      try {
        const response = await getUserFiles(id); // Obtener archivos del usuario seleccionado
        setUserFiles(response.data); // Guardar los archivos en el estado
        setMessage('');
      } catch (error) {
        setMessage('Error fetching files');
        setUserFiles([]); // Si falla, limpiamos los archivos
      }
    };
  
    // Manejar la búsqueda de usuarios
    const handleSearchChange = (e) => {
      setSearchQuery(e.target.value);
      const query = e.target.value.toLowerCase();
      const filtered = users.filter((user) =>
        user.nombre.toLowerCase().includes(query) || user.email.toLowerCase().includes(query)
      );
      setFilteredUsers(filtered);
    };
  
    return (
      <div className="view-files-layout">
        <NavBar />
        <div className="view-files-container">
          <h1 className="page-title">View User Files</h1>
          <div className="content-wrapper">
            {/* Grid de usuarios a la izquierda */}
            <div className="user-select-container">
              <h3 className="section-title">Select User</h3>
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
                        <th>Select</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map((user) => (
                        <tr key={user.id}>
                          <td>{user.id}</td>
                          <td>{user.nombre}</td>
                          <td>{user.email}</td>
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
  
            {/* Archivos del usuario seleccionado a la derecha */}
            <div className="user-files-container">
              <h3 className="section-title">User Files</h3>
              {message ? (
                <p>{message}</p> // Mensaje si no hay archivos o no se ha seleccionado un usuario
              ) : (
                <ul className="file-list">
                  {userFiles.length > 0 ? (
                    userFiles.map((file, index) => (
                      <li key={index} className="file-item">
                        <a href={file} target="_blank" rel="noopener noreferrer">
                          {`File ${index + 1}`}
                        </a>
                      </li>
                    ))
                  ) : (
                    <p>No files available for this user</p>
                  )}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  export default ViewFiles;