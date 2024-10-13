import React, { useState, useEffect } from 'react';
import { getBibliotecaFiles, deleteBibliotecaFile, uploadBibliotecaFile } from '../services/api';
import NavBar from './NavBar.jsx';
import './Biblioteca.css';

const Biblioteca = () => {
  const [bibliotecaFiles, setBibliotecaFiles] = useState([]);
  const [message, setMessage] = useState('');
  const [fileToUpload, setFileToUpload] = useState(null);
  const [linkToUpload, setLinkToUpload] = useState('');
  const [uploadType, setUploadType] = useState('file'); // Dropdown control for selecting file or link
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');

  const fetchBibliotecaFiles = async () => {
    try {
      const response = await getBibliotecaFiles();
      setBibliotecaFiles(response.data);
      setMessage('');
    } catch (error) {
      setMessage('Error fetching biblioteca files');
    }
  };

  useEffect(() => {
    fetchBibliotecaFiles();
  }, []);

  const handleDelete = async (fileId) => {
    try {
      await deleteBibliotecaFile(fileId);
      setMessage('File deleted successfully');
      setBibliotecaFiles((prevFiles) => prevFiles.filter((file) => file.id !== fileId));
    } catch (error) {
      setMessage('Error deleting file');
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
      setMessage('Please select a file or enter a link to upload');
      return;
    }

    if (!titulo || !descripcion) {
      setMessage('Please provide a title and description');
      return;
    }

    const formData = new FormData();
    formData.append('titulo', titulo);
    formData.append('descripcion', descripcion);

    if (uploadType === 'link') {
      formData.append('link', linkToUpload);
    } else {
      formData.append('file', fileToUpload);
    }

    try {
      await uploadBibliotecaFile(formData);
      setMessage('Upload successful');
      setFileToUpload(null);
      setLinkToUpload('');
      setTitulo('');
      setDescripcion('');
      fetchBibliotecaFiles();
    } catch (error) {
      setMessage('Error uploading');
    }
  };

  return (
    <div className="biblioteca-layout">
      <NavBar />
      <div className="biblioteca-container">
        <h1 className="page-title">Biblioteca</h1>
        <div className="content-wrapper">
          <div className="biblioteca-files-container">
            <h3 className="section-title">All Files in Biblioteca</h3>
            {message && (
              <div className={`confirmation-banner ${message.includes('successful') ? 'success' : 'error'}`}>
                {message}
              </div>
            )}
            {bibliotecaFiles.length > 0 ? (
              <div className="file-grid">
                {bibliotecaFiles.map((file, index) => (
                  <div key={index} className="file-item">
                    <div className="file-details">
                      <a href={file.presignedUrl} target="_blank" rel="noopener noreferrer" className="file-name">
                        {file.titulo}
                      </a>
                      <p className="file-description">{file.descripcion}</p>
                    </div>
                    <button onClick={() => handleDelete(file.id)} className="delete-file-button">
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p>No files available in Biblioteca</p>
            )}
          </div>

          {/* Upload Section with Dropdown */}
          <div className="upload-file-container">
            <h3 className="section-title">Upload New File or Link</h3>

            <input
              type="text"
              placeholder="Enter title"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              className="upload-title-input"
            />
            <textarea
              placeholder="Enter description"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              className="upload-description-input"
            />

            {/* Dropdown to select file or link */}
            <select
              value={uploadType}
              onChange={(e) => setUploadType(e.target.value)}
              className="upload-type-dropdown"
            >
              <option value="file">File</option>
              <option value="link">Link</option>
            </select>

            {/* Conditional rendering based on selection */}
            {uploadType === 'file' ? (
              <input type="file" onChange={handleFileChange} />
            ) : (
              <input
                type="text"
                placeholder="Enter a link"
                value={linkToUpload}
                onChange={handleLinkChange}
                className="upload-link-input"
              />
            )}

            <button onClick={handleUpload} className="upload-file-button">
              Upload
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Biblioteca;
