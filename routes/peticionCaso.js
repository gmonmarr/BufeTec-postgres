const express = require('express');
const router = express.Router();
const PeticionCaso = require('../model/PeticionCaso');
const verifyToken = require('../middleware/auth'); // Verificar JWT

// Crear una nueva petición
router.post('/', verifyToken(), async (req, res) => {
  try {
    const { descripcion } = req.body;
    const userId = req.user.id;

    const nuevaPeticion = await PeticionCaso.create({
      id_user: userId,
      descripcion,
    });

    res.status(201).json(nuevaPeticion);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error creating petition' });
  }
});

// Obtener todas las peticiones
router.get('/', verifyToken(['Alumno', 'Abogado', 'Admin']), async (req, res) => {
  try {
    const peticiones = await PeticionCaso.findAll();
    res.json(peticiones);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error fetching petitions' });
  }
});

// Modificar el estado de una petición
router.put('/:id', verifyToken(['Alumno', 'Abogado', 'Admin'])), async (req, res) => {
    try {
      const { id } = req.params;
      const { estado } = req.body;
  
      // Verificar que el estado sea válido
      const estadosValidos = ['Aceptado', 'Negado', 'En proceso'];
      if (!estadosValidos.includes(estado)) {
        return res.status(400).json({ error: 'Invalid estado value' });
      }
  
      // Buscar y actualizar la petición
      const peticion = await PeticionCaso.findByPk(id);
      if (!peticion) {
        return res.status(404).json({ error: 'Petition not found' });
      }
  
      peticion.estado = estado;
      await peticion.save();
  
      res.json({ message: 'Petition updated successfully', peticion });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Error updating petition' });
    }
};

module.exports = router;
