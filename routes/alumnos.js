// routes/alumnos.js

const express = require('express');
const router = express.Router();
const Alumno = require('../model/Alumno');

// Get all Alumnos
router.get('/', async (req, res) => {
  try {
    const alumnos = await Alumno.findAll();
    res.json(alumnos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a new Alumno
router.post('/', async (req, res) => {
  try {
    const newAlumno = await Alumno.create(req.body);
    res.status(201).json(newAlumno);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
