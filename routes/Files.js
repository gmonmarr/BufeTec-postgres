const express = require('express');
const { uploadToS3, deleteFromS3, getPresignedUrl } = require('../services/s3Service');
const File = require('../model/File');
const verifyToken = require('../middleware/auth');  // Verificamos el token
const router = express.Router();

// El ID del usuario "biblioteca" es 3
const BIBLIOTECA_USER_ID = 3;

// Ruta para subir un archivo al usuario con id 3 (biblioteca)
router.post('/uploadBibliotecaFile', verifyToken(['Admin', 'Abogado', 'Alumno']), async (req, res) => {
  try {
    const file = req.files.file; // Asume que usas un middleware como express-fileupload para manejar los archivos

    // Cambia el nombre del archivo para incluir el id del usuario biblioteca (3) al principio
    file.name = `${BIBLIOTECA_USER_ID}_${file.name}`;

    // Sube el archivo a S3
    const result = await uploadToS3(file);

    // Guarda la URL en la base de datos con el id del usuario biblioteca
    const newFile = await File.create({
      user_id: BIBLIOTECA_USER_ID,  // Usamos el ID 3 para biblioteca
      url_del_pdf: result.Location,
    });

    res.status(201).json(newFile);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error uploading file for Biblioteca' });
  }
});

// Ruta para eliminar un archivo del usuario con id 3 (biblioteca)
router.delete('/deleteBibliotecaFile/:id', verifyToken(['Admin', 'Abogado', 'Alumno']), async (req, res) => {
  try {
    const file = await File.findByPk(req.params.id);
    if (!file || file.user_id !== BIBLIOTECA_USER_ID) {
      return res.status(404).json({ error: 'File not found or not associated with Biblioteca' });
    }

    // Elimina el archivo de S3
    await deleteFromS3(file.url_del_pdf);

    // Elimina la entrada de la base de datos
    await file.destroy();

    res.status(200).json({ message: 'File deleted successfully from Biblioteca' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error deleting file from Biblioteca' });
  }
});

// Ruta para obtener todos los archivos del usuario con id 3 (biblioteca)
router.get('/getBibliotecaFiles', async (req, res) => {
  try {
    // Buscamos todos los archivos subidos por el usuario con id 3
    const files = await File.findAll({
      where: { user_id: BIBLIOTECA_USER_ID },
      attributes: ['url_del_pdf'] // Solo seleccionamos la URL del PDF
    });

    if (files.length === 0) {
      return res.status(404).json({ message: 'No files found for Biblioteca' });
    }

    // Generamos las URLs presignadas y extraemos el nombre del archivo
    const filesData = await Promise.all(files.map(async (file) => {
      const presignedUrl = await getPresignedUrl(file.url_del_pdf);

      // Extraemos el nombre del archivo
      let fileName = file.url_del_pdf.substring(
        file.url_del_pdf.lastIndexOf('/') + 1,
        file.url_del_pdf.indexOf('?') !== -1 ? file.url_del_pdf.indexOf('?') : file.url_del_pdf.length
      );

      // Removemos el prefijo del user_id (antes del primer guion bajo '_')
      fileName = fileName.substring(fileName.indexOf('_') + 1); // Remueve el "3_" del nombre del archivo

      return {
        presignedUrl,  // La URL presignada
        fileName       // El nombre del archivo sin el user_id
      };
    }));

    res.status(200).json(filesData); // Devolvemos la lista de archivos con URL y nombre
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching files for Biblioteca' });
  }
});

// Ruta para subir un archivo (solo usuarios autenticados pueden subir archivos)
router.post('/upload', verifyToken(['Admin', 'Abogado', 'Cliente', 'Alumno']), async (req, res) => {
  try {
    const user_id = req.user.id; // Obtenemos el ID del usuario desde el token
    const file = req.files.file; // Asume que usas un middleware como express-fileupload para manejar los archivos

    // Cambia el nombre del archivo para incluir el user_id al principio
    file.name = `${user_id}_${file.name}`;

    // Sube el archivo a S3
    const result = await uploadToS3(file);

    // Guarda la URL en la base de datos
    const newFile = await File.create({
      user_id,  // El ID del usuario se obtiene del token
      url_del_pdf: result.Location,
    });

    res.status(201).json(newFile);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error uploading file' });
  }
});


// Ruta para eliminar un archivo (solo usuarios autenticados pueden eliminar archivos)
router.delete('/delete/:id', verifyToken(['Admin', 'Abogado']), async (req, res) => {
  try {
    const file = await File.findByPk(req.params.id);
    if (!file) return res.status(404).json({ error: 'File not found' });

    // Elimina el archivo de S3
    await deleteFromS3(file.url_del_pdf);

    // Elimina la entrada de la base de datos
    await file.destroy();

    res.status(200).json({ message: 'File deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error deleting file' });
  }
});

// Nueva ruta para obtener todos los archivos subidos por el usuario autenticado
router.get('/getFiles', verifyToken(['Admin', 'Abogado', 'Cliente', 'Alumno']), async (req, res) => {
  try {
    const user_id = req.user.id; // Obtenemos el ID del usuario desde el token

    // Buscamos todos los archivos subidos por el usuario
    const files = await File.findAll({
      where: { user_id },
      attributes: ['url_del_pdf'] // Solo seleccionamos la URL del PDF
    });

    if (files.length === 0) {
      return res.status(404).json({ message: 'No files found for this user' });
    }

    // Generamos las URLs presignadas y extraemos el nombre del archivo
    const filesData = await Promise.all(files.map(async (file) => {
      const presignedUrl = await getPresignedUrl(file.url_del_pdf);

      // Extraemos el nombre del archivo
      let fileName = file.url_del_pdf.substring(
        file.url_del_pdf.lastIndexOf('/') + 1, 
        file.url_del_pdf.indexOf('?') !== -1 ? file.url_del_pdf.indexOf('?') : file.url_del_pdf.length
      );

      // Removemos el prefijo del user_id (antes del primer guion bajo '_')
      fileName = fileName.substring(fileName.indexOf('_') + 1); // Remueve el "user_id_" del nombre del archivo

      return {
        presignedUrl,  // La URL presignada
        fileName       // El nombre del archivo sin el user_id
      };
    }));

    res.status(200).json(filesData); // Devolvemos la lista de archivos con URL y nombre
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching files' });
  }
});


// Ruta para obtener todos los archivos de un usuario específico (solo para Admin, Abogado, Alumno)
router.get('/userFiles/:userId', verifyToken(['Admin', 'Abogado', 'Alumno']), async (req, res) => {
  try {
    const { userId } = req.params;  // Obtenemos el userId de los parámetros de la URL

    // Buscamos todos los archivos subidos por el usuario especificado
    const files = await File.findAll({
      where: { user_id: userId },
      attributes: ['url_del_pdf'] // Solo seleccionamos la URL del PDF
    });

    if (files.length === 0) {
      return res.status(404).json({ message: 'No files found for this user' });
    }

    // Generamos las URLs presignadas y extraemos el nombre del archivo
    const filesData = await Promise.all(files.map(async (file) => {
      const presignedUrl = await getPresignedUrl(file.url_del_pdf);

      // Extraemos el nombre del archivo
      let fileName = file.url_del_pdf.substring(
        file.url_del_pdf.lastIndexOf('/') + 1,
        file.url_del_pdf.indexOf('?') !== -1 ? file.url_del_pdf.indexOf('?') : file.url_del_pdf.length
      );

      // Removemos el prefijo del user_id (antes del primer guion bajo '_')
      fileName = fileName.substring(fileName.indexOf('_') + 1); // Remueve el "user_id_" del nombre del archivo

      return {
        presignedUrl,  // La URL presignada
        fileName       // El nombre del archivo sin el user_id
      };
    }));

    res.status(200).json(filesData); // Devolvemos la lista de archivos con URL y nombre
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching files' });
  }
});

module.exports = router;
