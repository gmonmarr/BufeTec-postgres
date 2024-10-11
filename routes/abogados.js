// routes/abogados.js

const express = require('express');
const router = express.Router();
const Abogado = require('../model/Abogado');
const verifyToken = require('../middleware/auth');
const Usuario = require('../model/Usuario');

// Get all Abogados (Only Admin and Abogado can access)
router.get('/', verifyToken(['Admin', 'Abogado']), async (req, res) => {
  try {
    const abogados = await Abogado.findAll({
      include: {
        model: Usuario, // Join with Usuario table
        attributes: ['nombre', 'email', 'numero_telefono']  // Select specific fields from Usuario
      }
    });

    // Format the response to include only the relevant fields
    const formattedAbogados = abogados.map(abogado => ({
      especialidad: abogado.especialidad,
      experiencia: abogado.experiencia,
      nombre: abogado.Usuario.nombre,
      email: abogado.Usuario.email,
      numero_telefono: abogado.Usuario.numero_telefono
    }));

    res.json(formattedAbogados);  // Send the formatted response
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Create a new Abogado (Only Admin can promote to Admin, Abogado can promote up to their level)
router.post('/', verifyToken(['Admin', 'Abogado']), async (req, res) => {
  try {
    // Ensure only Admin can create another Admin
    const { rol } = req.user;
    const newAbogado = req.body;

    if (newAbogado.rol === 'Admin' && rol !== 'Admin') {
      return res.status(403).json({ message: 'Only Admin can promote to Admin' });
    }

    const createdAbogado = await Abogado.create(newAbogado);
    res.status(201).json(createdAbogado);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;