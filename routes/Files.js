const express = require('express');
const { uploadToS3, deleteFromS3, getPresignedUrl } = require('../services/s3Service');
const File = require('../model/File');
const Caso = require('../model/Caso');
const CasoFile = require('../model/CasoFile');
const verifyToken = require('../middleware/auth');  // Verificamos el token
const router = express.Router();

router.post('/upload', verifyToken(['Admin', 'Abogado', 'Cliente', 'Alumno']), async (req, res) => {
  try {
    console.log('POST /upload called'); // Log when the route is hit

    const user_id = req.user.id; // Get the user ID from the token
    console.log(`User ID from token: ${user_id}`);

    const { numero_expediente } = req.body; // Get the case number from the request body
    console.log(`Case number from body: ${numero_expediente}`);

    if (!req.files || !req.files.file) {
      console.log('No file uploaded');
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    const file = req.files.file; // Get the uploaded file
    console.log(`File received: ${file.name}`);

    // Check if the case exists
    const caso = await Caso.findOne({ where: { numero_expediente } });
    console.log(`Case found: ${caso ? 'Yes' : 'No'}`);

    if (!caso) {
      console.log('Case not found');
      return res.status(404).json({ error: 'Case not found with the provided case number' });
    }

    // Rename the file to include user_id and case number
    file.name = `${user_id}_${numero_expediente}_${file.name}`;
    console.log(`Renamed file: ${file.name}`);

    // Upload the file to S3
    const result = await uploadToS3(file);
    console.log('File uploaded to S3:', result);

    // Save the file's metadata in the database
    const newFile = await File.create({
      user_id,
      url_del_pdf: result.Location,
    });
    console.log('File metadata saved in DB:', newFile);

    // Insert the association in the CasoFile join table
    await CasoFile.create({
      id_caso: caso.id,
      id_file: newFile.id
    });
    console.log('File associated with case in CasoFile');

    res.status(201).json(newFile);
  } catch (error) {
    console.error('Error occurred:', error);
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