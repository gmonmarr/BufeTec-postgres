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
    const { titulo, descripcion } = req.body;

    if (!req.files || !req.files.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const file = req.files.file;
    file.name = `${user_id}_${file.name}`;

    const result = await uploadToS3(file);

    const newFile = await Biblioteca.create({
      user_id,
      titulo,
      descripcion,
      url_del_pdf: result.Location,
    });

    res.status(201).json(newFile);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error uploading file to Biblioteca' });
  }
});

// Delete a file from Biblioteca
router.delete('/delete/:id', verifyToken(['Admin', 'Abogado', 'Alumno']), async (req, res) => {
  try {
    const file = await Biblioteca.findByPk(req.params.id);

    if (!file) {
      return res.status(404).json({ error: 'File not found in Biblioteca' });
    }

    await deleteFromS3(file.url_del_pdf);
    await file.destroy();

    res.status(200).json({ message: 'File deleted successfully from Biblioteca' });
  } catch (error) {
    console.error(error);
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
