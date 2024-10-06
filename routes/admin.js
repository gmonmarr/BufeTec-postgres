// routes/admins.js

const express = require('express');
const router = express.Router();
const Admin = require('../model/Admin');
const Usuario = require('../model/Usuario');
const verifyToken = require('../middleware/auth');

// Get all Admins (Only Admin can access)
router.get('/', verifyToken(['Admin']), async (req, res) => {
  try {
    const admins = await Admin.findAll({
      include: {
        model: Usuario,
        attributes: ['nombre', 'apellido', 'email']  // Include related Usuario data
      }
    });
    res.json(admins);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get a specific Admin by ID (Only Admin can access)
router.get('/:id', verifyToken(['Admin']), async (req, res) => {
  try {
    const admin = await Admin.findByPk(req.params.id, {
      include: {
        model: Usuario,
        attributes: ['nombre', 'apellido', 'email']
      }
    });

    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    res.json(admin);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a new Admin (Only Admin can create)
router.post('/', verifyToken(['Admin']), async (req, res) => {
  try {
    const { id_usuario } = req.body;

    // Ensure the user exists before making them an admin
    const usuario = await Usuario.findByPk(id_usuario);
    if (!usuario) {
      return res.status(404).json({ message: 'Usuario not found' });
    }

    const newAdmin = await Admin.create({
      id_usuario
    });

    res.status(201).json(newAdmin);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete an Admin (Only Admin can delete, Admin cannot delete another Admin)
router.delete('/:id', verifyToken(['Admin']), async (req, res) => {
  try {
    const admin = await Admin.findByPk(req.params.id);

    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    await admin.destroy();
    res.json({ message: 'Admin deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
