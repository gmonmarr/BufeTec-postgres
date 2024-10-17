import React, { useState, useEffect } from 'react';
import { getBibliotecaFiles, deleteBibliotecaFile, uploadBibliotecaFile, uploadBibliotecaLink } from '../services/api';
import NavBar from './NavBar.jsx';
import './Biblioteca.css';

const Biblioteca = () => {
  const [bibliotecaFiles, setBibliotecaFiles] = useState([]);
  const [message, setMessage] = useState('');
  const [fileToUpload, setFileToUpload] = useState(null);
  const [linkToUpload, setLinkToUpload] = useState('');
  const [uploadType, setUploadType] = useState('file');
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');

  const fetchBibliotecaFiles = async () => {
    try {
      const response = await getBibliotecaFiles();
      setBibliotecaFiles(response.data);
      setMessage('');
    } catch (error) {
      setMessage('Error al obtener los archivos de la biblioteca');
    }
  };

  useEffect(() => {
    fetchBibliotecaFiles();
  }, []);

  const handleDelete = async (fileId) => {
    try {
      await deleteBibliotecaFile(fileId);
      setMessage('Archivo eliminado con éxito');
      setBibliotecaFiles((prevFiles) => prevFiles.filter((file) => file.id !== fileId));
    } catch (error) {
      setMessage('Error al eliminar el archivo');
    }
  };

  const handleFileChange = (e) => {
    setFileToUpload(e.target.files[0]);
    setLinkToUpload('');
  };

  const handleLinkChange = (e) => {
    setLinkToUpload(e.target.value);
    setFileToUpload(null);
  };

  const handleUpload = async () => {
    if ((uploadType === 'file' && !fileToUpload) || (uploadType === 'link' && !linkToUpload)) {
      setMessage('Por favor, selecciona un archivo o ingresa un enlace para subir');
      return;
    }

    if (!titulo || !descripcion) {
      setMessage('Por favor, proporciona un título y una descripción');
      return;
    }

    const formData = new FormData();
    formData.append('titulo', titulo);
    formData.append('descripcion', descripcion);

    try {
      if (uploadType === 'file') {
        formData.append('file', fileToUpload);
        await uploadBibliotecaFile(formData);  // Subir archivo a S3
      } else {
        formData.append('link', linkToUpload);
        await uploadBibliotecaLink(formData);  // Subir solo el link a la base de datos
      }

      setMessage('Subida exitosa');
      setFileToUpload(null);
      setLinkToUpload('');
      setTitulo('');
      setDescripcion('');
      fetchBibliotecaFiles();
    } catch (error) {
      setMessage('Error al subir');
    }
  };

  return (
    <div className="biblioteca-layout">
      <NavBar />
      <div className="biblioteca-container">
        <h1 className="page-title">Biblioteca</h1>
        <div className="content-wrapper">
          <div className="biblioteca-files-container">
            <h3 className="section-title">Todos los archivos en la Biblioteca</h3>
            {message && (
              <div className={`confirmation-banner ${message.includes('successful') ? 'success' : 'error'}`}>
                {message}
              </div>
            )}
            {bibliotecaFiles.length > 0 ? (
              <table className="files-grid">
                <thead>
                  <tr>
                    <th>Título</th>
                    <th>Descripción</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {bibliotecaFiles.map((file, index) => (
                    <tr key={index}>
                      <td>
                        <a href={file.presignedUrl} target="_blank" rel="noopener noreferrer">
                          {file.titulo}
                        </a>
                      </td>
                      <td>{file.descripcion}</td>
                      <td className="file-actions">
                        <button onClick={() => handleDelete(file.id)} className="delete-button">
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="no-files-message">No hay archivos disponibles en la Biblioteca</p>
            )}
          </div>

          {/* Sección para subir archivos o enlaces */}
          <div className="upload-file-container">
            <h3 className="section-title">Subir nuevo archivo o enlace</h3>

            <input
              type="text"
              placeholder="Ingresa el título"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              className="upload-title-input"
            />
            <textarea
              placeholder="Ingresa la descripción"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              className="upload-description-input"
            />

            {/* Desplegable para seleccionar archivo o enlace */}
            <select
              value={uploadType}
              onChange={(e) => setUploadType(e.target.value)}
              className="upload-type-dropdown"
            >
              <option value="file">Archivo</option>
              <option value="link">Enlace</option>
            </select>

            {/* Renderizado condicional basado en la selección */}
            {uploadType === 'file' ? (
              <input type="file" onChange={handleFileChange} className="upload-file-input" />
            ) : (
              <input
                type="text"
                placeholder="Ingresa un enlace"
                value={linkToUpload}
                onChange={handleLinkChange}
                className="upload-link-input"
              />
            )}

            <button onClick={handleUpload} className="upload-button">
              Subir
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Biblioteca;
