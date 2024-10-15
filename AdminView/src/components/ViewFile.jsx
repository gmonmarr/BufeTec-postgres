import React, { useState, useEffect } from 'react';
import { getAbogadosWithId, getCasesByAbogado, getCaseFiles, uploadFileToCase } from '../services/api'; // Importar nueva API de subida de archivos
import NavBar from './NavBar.jsx'; // Importamos la barra de navegación
import './ViewFile.css'; // Personalizar los estilos

const ViewFiles = () => {
  const [abogados, setAbogados] = useState([]); // Almacena los abogados
  const [selectedAbogadoId, setSelectedAbogadoId] = useState(''); // Almacena el abogado seleccionado
  const [cases, setCases] = useState([]); // Almacena los casos del abogado seleccionado
  const [selectedCaseId, setSelectedCaseId] = useState(''); // Almacena el ID del caso seleccionado
  const [caseFiles, setCaseFiles] = useState([]); // Almacena los archivos del caso seleccionado
  const [message, setMessage] = useState('Selecciona un abogado y expediente'); // Mensaje por defecto
  const [selectedFile, setSelectedFile] = useState(null); // Almacena el archivo a subir

  // Cargar los abogados al montar el componente
  useEffect(() => {
    const fetchAbogados = async () => {
      try {
        const response = await getAbogadosWithId(); // Llamamos a la API para obtener los abogados
        setAbogados(response.data); // Guardamos los abogados en el estado
      } catch (error) {
        setMessage('Error fetching abogados');
      }
    };

    fetchAbogados();
  }, []);

  // Manejar la selección de un abogado
  const handleAbogadoSelect = async (abogadoId) => {
    setSelectedAbogadoId(abogadoId); // Establece el ID del abogado seleccionado
    setSelectedCaseId(''); // Reinicia el caso seleccionado
    setCaseFiles([]); // Limpia los archivos del caso anterior
    setMessage('Selecciona un expediente');
    
    try {
      const response = await getCasesByAbogado(abogadoId); // Obtener casos del abogado seleccionado
      setCases(response.data); // Guardar los casos en el estado
    } catch (error) {
      setMessage('Error fetching cases for abogado');
      setCases([]); // Si falla, limpiamos los casos
    }
  };

  // Manejar la selección de un expediente
  const handleCaseSelect = async (caseId) => {
    setSelectedCaseId(caseId); // Establece el ID del expediente seleccionado
    try {
      const response = await getCaseFiles(caseId); // Obtener archivos del expediente seleccionado
      setCaseFiles(response.data); // Guardar los archivos en el estado
      setMessage('');
    } catch (error) {
      setMessage('Error fetching case files');
      setCaseFiles([]); // Si falla, limpiamos los archivos
    }
  };

  // Manejar la subida de archivos
  const handleFileUpload = async () => {
    if (!selectedFile || !selectedCaseId || !selectedAbogadoId) {
      setMessage('Selecciona un archivo, un expediente y un abogado antes de subir');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('numero_expediente', selectedCaseId); // Agregamos el número de expediente
      formData.append('id_abogado', selectedAbogadoId); // Agregamos el ID del abogado

      await uploadFileToCase(formData); // Llamar a la API para subir el archivo
      setMessage('Archivo subido correctamente');
      setSelectedFile(null); // Reinicia el campo de archivo
    } catch (error) {
      setMessage('Error subiendo el archivo');
    }
  };

  return (
    <div className="view-files-layout">
      <NavBar />
      <div className="view-files-container">
        <h1 className="page-title">View Case Files</h1>
        
        <div className="form-and-grid">
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

          <div className="case-select-container">
            <h3 className="section-title">Seleccionar Expediente</h3>
            {cases.length > 0 ? (
              <div className="cases-grid-wrapper">
                <table className="cases-grid-table">
                  <thead>
                    <tr>
                      <th>Expediente</th>
                      <th>Descripción</th>
                      <th>Estado</th>
                      <th>Select</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cases.map((caseItem) => (
                      <tr 
                        key={caseItem.id} 
                        className={selectedCaseId === caseItem.id ? 'highlighted' : ''}
                      >
                        <td>{caseItem.numero_expediente}</td>
                        <td>{caseItem.descripcion}</td>
                        <td>{caseItem.estado}</td>
                        <td>
                          <button
                            onClick={() => handleCaseSelect(caseItem.id)}
                            className="select-case-button"
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
              <div className="no-cases">No cases available</div>
            )}
          </div>
        </div>

        <div className="case-files-container">
          <h3 className="section-title">Archivos del Expediente</h3>
          {message ? (
            <p>{message}</p> // Mensaje si no hay archivos o no se ha seleccionado un caso
          ) : (
            <ul className="file-list">
              {caseFiles.length > 0 ? (
                caseFiles.map((file, index) => (
                  <li key={index} className="file-item">
                    <a href={file.presignedUrl} target="_blank" rel="noopener noreferrer">
                      {file.fileName} {/* Mostrar el nombre del archivo */} 
                    </a>
                  </li>
                ))
              ) : (
                <p>No files available for this case</p>
              )}
            </ul>
          )}

          {/* Subir archivo para el expediente seleccionado */}
          {selectedCaseId && (
            <div className="upload-file-section">
              <h3 className="section-title">Subir archivo al expediente</h3>
              <input
                type="file"
                onChange={(e) => setSelectedFile(e.target.files[0])}
              />
              <button onClick={handleFileUpload} className="upload-button">
                Subir archivo
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewFiles;
