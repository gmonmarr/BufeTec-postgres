import React, { useState, useEffect } from 'react';
import { getPeticionCasos, getAbogadosWithId, updatePeticionCaso } from '../services/api'; // API para obtener peticiones, abogados y actualizar estado
import NavBar from './NavBar.jsx'; // Importamos la barra de navegación
import './PeticionCaso.css'; // Puedes personalizar los estilos

const PeticionCasoGrid = () => {
  const [peticiones, setPeticiones] = useState([]); // Almacena las peticiones de casos
  const [abogados, setAbogados] = useState([]); // Almacena los abogados
  const [selectedAbogadoId, setSelectedAbogadoId] = useState(''); // Abogado seleccionado
  const [message, setMessage] = useState(''); // Mensaje de estado
  const [messageType, setMessageType] = useState(''); // Tipo de mensaje ('success' o 'error')

  // Cargar las peticiones al montar el componente
  useEffect(() => {
    const fetchPeticiones = async () => {
      try {
        const response = await getPeticionCasos(); // Llamamos a la API para obtener las peticiones
        setPeticiones(response.data); // Guardamos las peticiones en el estado
      } catch (error) {
        setMessage('Error al obtener las peticiones');
        setMessageType('error');
      }
    };

    const fetchAbogados = async () => {
      try {
        const response = await getAbogadosWithId(); // Llamamos a la API para obtener los abogados
        setAbogados(response.data); // Guardamos los abogados en el estado
      } catch (error) {
        setMessage('Error al obtener los abogados');
        setMessageType('error');
      }
    };

    fetchPeticiones();
    fetchAbogados();
  }, []);

  // Manejar la selección de un abogado
  const handleAbogadoSelect = (abogadoId) => {
    setSelectedAbogadoId(abogadoId); // Establece el ID del abogado seleccionado
  };

  // Manejar la actualización del estado de la petición
  const handleUpdateEstado = async (peticionId, newEstado) => {
    if (!selectedAbogadoId) {
      setMessage('Selecciona un abogado antes de aceptar una petición');
      setMessageType('error');
      return;
    }

    try {
      const response = await updatePeticionCaso(peticionId, { estado: newEstado, id_abogado: selectedAbogadoId }); // Llamada PUT
      setMessage('Petición actualizada correctamente');
      setMessageType('success');
      
      // Actualizamos el estado de las peticiones después de la actualización
      setPeticiones((prevPeticiones) =>
        prevPeticiones.map((peticion) =>
          peticion.id === peticionId ? { ...peticion, estado: newEstado } : peticion
        )
      );
    } catch (error) {
      setMessage('Error al actualizar la petición');
      setMessageType('error');
    }
  };

  return (
    <div className="peticion-caso-grid">
      <NavBar />
      <div className="container">
        <h1 className="page-title">Peticiones de Caso</h1>

        {/* Dropdown de abogados */}
        <div className="abogado-select-container">
          <h3 className="section-title">Seleccionar Abogado</h3>
          <select
            onChange={(e) => handleAbogadoSelect(e.target.value)}
            value={selectedAbogadoId}
            className="abogado-dropdown"
          >
            <option value="">Selecciona un abogado</option>
            {abogados.map((abogado) => (
              <option key={abogado.id} value={abogado.id}>
                {abogado.nombre}
              </option>
            ))}
          </select>
        </div>

        {/* Mensaje de estado */}
        {message && (
          <p className={messageType === 'success' ? 'success-message' : 'status-message'}>
            {message}
          </p>
        )}

        {/* Grid de peticiones de casos */}
        {peticiones.length > 0 ? (
          <div className="peticiones-grid-wrapper">
            <table className="peticiones-grid-table">
              <thead>
                <tr>
                  <th>Nombre del Usuario</th>
                  <th>Email</th>
                  <th>Descripción</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {peticiones.map((peticion) => (
                  <tr key={peticion.id}>
                    <td>{peticion.usuario.nombre}</td>
                    <td>{peticion.usuario.email}</td>
                    <td>{peticion.descripcion}</td>
                    <td>{peticion.estado}</td>
                    <td>
                      {/* Botones para cambiar el estado */}
                      <button
                        onClick={() => handleUpdateEstado(peticion.id, 'Aceptado')}
                        className="accept-button"
                        disabled={peticion.estado === 'Aceptado'}
                      >
                        Aceptar
                      </button>
                      <button
                        onClick={() => handleUpdateEstado(peticion.id, 'Negado')}
                        className="reject-button"
                        disabled={peticion.estado === 'Negado'}
                      >
                        Negar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="no-peticiones">No hay peticiones disponibles</div>
        )}
      </div>
    </div>
  );
};

export default PeticionCasoGrid;
