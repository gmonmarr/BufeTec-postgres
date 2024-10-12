import React, { useState, useEffect } from 'react';
import { getBibliotecaFiles, deleteBibliotecaFile, uploadBibliotecaFile } from '../services/api'; // API para obtener, eliminar y subir archivos
import NavBar from './NavBar.jsx'; // Importamos la barra de navegación
import './Biblioteca.css'; // Estilos personalizados

const Biblioteca = () => {
  const [bibliotecaFiles, setBibliotecaFiles] = useState([]); // Almacena los archivos de la biblioteca
  const [message, setMessage] = useState(''); // Mensaje para el estado de operaciones (exitoso/error)
  const [fileToUpload, setFileToUpload] = useState(null); // Almacena el archivo que se subirá

  // Función para cargar los archivos de la biblioteca
  const fetchBibliotecaFiles = async () => {
    try {
      const response = await getBibliotecaFiles(); // Llamamos a la API para obtener los archivos
      setBibliotecaFiles(response.data); // Guardamos los archivos en el estado
      setMessage(''); // Limpiamos cualquier mensaje previo
    } catch (error) {
      setMessage('Error fetching biblioteca files');
    }
  };

  // Cargar los archivos de la biblioteca al montar el componente
  useEffect(() => {
    fetchBibliotecaFiles();
  }, []);

  // Manejar la eliminación de un archivo
  const handleDelete = async (fileId) => {
    try {
      await deleteBibliotecaFile(fileId); // Llamamos a la API para eliminar el archivo
      setMessage('File deleted successfully');
      setBibliotecaFiles((prevFiles) => prevFiles.filter((file) => file.id !== fileId)); // Actualizamos la lista de archivos
    } catch (error) {
      setMessage('Error deleting file');
    }
  };

  // Manejar la selección de archivo para subir
  const handleFileChange = (e) => {
    setFileToUpload(e.target.files[0]); // Guardamos el archivo seleccionado
  };

  // Manejar la subida del archivo
  const handleUpload = async () => {
    if (!fileToUpload) {
      setMessage('Please select a file to upload');
      return;
    }

    const formData = new FormData();
    formData.append('file', fileToUpload); // Añadimos el archivo al formData

    try {
      await uploadBibliotecaFile(formData); // Llamamos a la API para subir el archivo
      setMessage('File uploaded successfully');
      setFileToUpload(null); // Limpiamos el archivo seleccionado
      fetchBibliotecaFiles(); // Refrescamos el grid para mostrar el archivo recién subido
    } catch (error) {
      setMessage('Error uploading file');
    }
  };

  return (
    <div className="biblioteca-layout">
      <NavBar />
      <div className="biblioteca-container">
        <h1 className="page-title">Biblioteca Files</h1>
        <div className="content-wrapper">
          {/* Grid de archivos */}
          <div className="biblioteca-files-container">
            <h3 className="section-title">All Files in Biblioteca</h3>
            {message && (
              <div className={`confirmation-banner ${message.includes('successfully') ? 'success' : 'error'}`}>
                {message}
              </div>
            )}
            {bibliotecaFiles.length > 0 ? (
              <ul className="file-list">
                {bibliotecaFiles.map((file, index) => (
                  <li key={index} className="file-item">
                    <div className="file-info">
                      <a href={file.presignedUrl} target="_blank" rel="noopener noreferrer" className="file-name">
                        {file.fileName}
                      </a>
                      <button onClick={() => handleDelete(file.id)} className="delete-file-button">
                        Delete
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No files available in Biblioteca</p>
            )}
          </div>

          {/* Sección para subir archivos */}
          <div className="upload-file-container">
            <h3 className="section-title">Upload New File</h3>
            <input type="file" onChange={handleFileChange} />
            <button onClick={handleUpload} className="upload-file-button">
              Upload File
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Biblioteca;
