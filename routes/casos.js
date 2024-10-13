// routes/casos.js

const express = require('express');
const router = express.Router();
const Caso = require('../model/Caso');
const Abogado = require('../model/Abogado');
const Cliente = require('../model/Cliente');
const Usuario = require('../model/Usuario');
const verifyToken = require('../middleware/auth'); // Import the existing middleware

// Get all Casos for the Abogado from the token
router.get('/abogadoCasos', verifyToken(['Admin', 'Abogado']), async (req, res) => {
  try {
    const abogadoUserId = req.user.id; // Extract the Abogado ID from the verified JWT token

    const abogadoId = await Abogado.findOne({ where: { id_usuario: abogadoUserId } });
    
    if (req.user.role === 'Abogado') {
      // Return only cases that belong to the Abogado
      const casos = await Caso.findAll({
        where: { id_abogado: abogadoId.id }
      });
      res.json(casos);
    } else {
      // If the user is Admin, return all cases
      const casos = await Caso.findAll();
      res.json(casos);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/', verifyToken(['Admin', 'Abogado']), async (req, res) => {
  try {
    // Obtiene todos los casos de la base de datos
    const casos = await Caso.findAll();

    // Formatea la respuesta incluyendo los campos necesarios
    const formattedCasos = casos.map(caso => ({
      id: caso.id,
      numero_expediente: caso.numero_expediente,
      descripcion: caso.descripcion,
      estado: caso.estado,
      id_abogado: caso.id_abogado,
      id_cliente: caso.id_cliente,
      id_alumno: caso.id_alumno
    }));

    res.json(formattedCasos); // Envía la respuesta con los casos formateados
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/usuarioCaso', verifyToken(['Cliente']), async (req, res) => {
  try {
    const userId = req.user.id; // Extract user ID from token

    // Find the Cliente based on user ID
    const cliente = await Cliente.findOne({ where: { id_usuario: userId } });

    if (!cliente) {
      return res.status(404).json({ message: 'Cliente not found' });
    }

    // Find all cases associated with the Cliente
    const casos = await Caso.findAll({
      where: { id_cliente: cliente.id },
      attributes: ['numero_expediente', 'descripcion', 'estado', 'id_abogado'], // Select only required fields
    });

    if (casos.length === 0) {
      return res.status(404).json({ message: 'No cases found for this Cliente' });
    }

    // Map through the cases and fetch the abogadoName for each case
    const casosWithAbogadoName = await Promise.all(
      casos.map(async (caso) => {
        const abogado = await Abogado.findOne({ where: { id: caso.id_abogado } });

        if (!abogado) {
          return { ...caso.get(), abogadoName: 'Unknown' }; // Handle missing Abogado
        }

        const usuario = await Usuario.findOne({ where: { id: abogado.id_usuario } });

        return {
          numero_expediente: caso.numero_expediente,
          descripcion: caso.descripcion,
          estado: caso.estado,
          abogadoName: usuario ? usuario.nombre : 'Unknown',
        };
      })
    );

    res.status(200).json(casosWithAbogadoName);
  } catch (err) {
    console.error('Error fetching cases for Cliente:', err.message);
    res.status(500).json({ error: 'Error fetching cases' });
  }
});

// Create a new Caso
router.post('/', verifyToken(['Admin', 'Abogado']), async (req, res) => {
  try {
    const newCaso = await Caso.create(req.body);
    res.status(201).json(newCaso);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Route to get files for a specific case based on ID_Caso
router.get('/:id/files', verifyToken(['Cliente', 'Alumno', 'Abogado', 'Admin']), async (req, res) => {
  try {
    const casoId = req.params.id;
    const userId = req.user.id;  // Extract the user ID from the token
    const userRole = req.user.role;  // Extract the user role from the token

    // Find the case by ID
    const caso = await Caso.findOne({
      where: { id: casoId },
      include: {
        model: File,  // Include associated Files
        through: { attributes: [] }  // Avoid extra attributes from join table
      }
    });

    if (!caso) {
      return res.status(404).json({ message: 'Case not found' });
    }

    // Check if the user is associated with the case
    const hasAccess = 
      (userRole === 'Cliente' && caso.id_cliente === userId) ||
      (userRole === 'Abogado' && caso.id_abogado === userId) ||
      (userRole === 'Alumno' && caso.id_alumno === userId) ||
      userRole === 'Admin';

    if (!hasAccess) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // If user has access, return the files associated with the case
    const files = caso.Files;
    res.json(files);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', verifyToken(['Admin', 'Abogado']), async (req, res) => {
  try {
    const casoId = req.params.id;

    // Busca el caso por ID
    const caso = await Caso.findByPk(casoId);

    if (!caso) {
      return res.status(404).json({ message: 'Caso not found' });
    }

    // Elimina el caso
    await caso.destroy();
    res.status(200).json({ message: 'Caso deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
module.exports = router;