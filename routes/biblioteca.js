// routes/biblioteca.js

const express = require('express');
const router = express.Router();
const { uploadToS3, deleteFromS3, getPresignedUrl } = require('../services/s3Service');
const Biblioteca = require('../model/Biblioteca');
const verifyToken = require('../middleware/auth');

// Upload a file to Biblioteca
router.post('/upload', verifyToken(['Admin', 'Abogado', 'Alumno']), async (req, res) => {
  try {
    const user_id = req.user.id;
    const { titulo, descripcion, link } = req.body;

    let url_del_pdf = '';

    if (link) {
      url_del_pdf = link; // Guardamos el link si se proporciona
    } else if (req.files && req.files.file) {
      const file = req.files.file;
      file.name = `${user_id}_${file.name}`;
      const result = await uploadToS3(file);
      url_del_pdf = result.Location; // Guardamos la URL del archivo en S3
    } else {
      return res.status(400).json({ error: 'No file or link provided' });
    }

    const newEntry = await Biblioteca.create({
      user_id,
      titulo,
      descripcion,
      url_del_pdf,
    });

    res.status(201).json(newEntry);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error uploading to Biblioteca' });
  }
});


// Delete a file from Biblioteca
router.delete('/delete/:id', verifyToken(['Admin', 'Abogado', 'Alumno']), async (req, res) => {
  try {
    console.log('Attempting to find file with ID:', req.params.id);
    
    const file = await Biblioteca.findByPk(req.params.id);

    if (!file) {
      console.log('File not found with ID:', req.params.id);
      return res.status(404).json({ error: 'File not found in Biblioteca' });
    }

    console.log('File found:', file);
    console.log('Attempting to delete file from S3 with URL:', file.url_del_pdf);

    await deleteFromS3(file.url_del_pdf);

    console.log('File successfully deleted from S3. Now deleting from database:', file.id);

    await file.destroy();

    console.log('File successfully deleted from the database.');

    res.status(200).json({ message: 'File deleted successfully from Biblioteca' });
  } catch (error) {
    console.error('Error deleting file:', error.message);
    console.error('Stack trace:', error.stack);
    res.status(500).json({ error: 'Error deleting file from Biblioteca' });
  }
});


// Get all files from Biblioteca
router.get('/', async (req, res) => {
  try {
    const files = await Biblioteca.findAll({
      attributes: ['titulo', 'descripcion', 'url_del_pdf'], // Select only needed fields
    });

    if (files.length === 0) {
      return res.status(404).json({ message: 'No files found in Biblioteca' });
    }

    const filesData = await Promise.all(
      files.map(async (file) => {
        const presignedUrl = await getPresignedUrl(file.url_del_pdf);
        return {
          titulo: file.titulo,
          descripcion: file.descripcion,
          presignedUrl, // Include presigned URL directly
        };
      })
    );

    res.status(200).json(filesData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching files from Biblioteca' });
  }
});

module.exports = router;
