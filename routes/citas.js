// routes/citas.js

const express = require('express');
const router = express.Router();
const Cita = require('../model/Cita');

// Get all Citas
router.get('/', async (req, res) => {
  try {
    const citas = await Cita.findAll();
    res.json(citas);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a new Cita
router.post('/', async (req, res) => {
  try {
    const newCita = await Cita.create(req.body);
    res.status(201).json(newCita);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
