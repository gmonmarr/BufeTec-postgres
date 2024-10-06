// routes/alumnos.js

const express = require('express');
const router = express.Router();
const Alumno = require('../model/Alumno');
const verifyToken = require('../middleware/auth');

// Get all Alumnos (Admin, Abogado, Alumno can access)
router.get('/', verifyToken(['Admin', 'Abogado', 'Alumno']), async (req, res) => {
  try {
    const alumnos = await Alumno.findAll();
    res.json(alumnos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a new Alumno (Admin, Abogado, Alumno can create)
router.post('/', verifyToken(['Admin', 'Abogado', 'Alumno']), async (req, res) => {
  try {
    const newAlumno = req.body;

    const createdAlumno = await Alumno.create(newAlumno);
    res.status(201).json(createdAlumno);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
