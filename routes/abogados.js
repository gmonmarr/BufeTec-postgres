// routes/abogados.js

const express = require('express');
const router = express.Router();
const Abogado = require('../model/Abogado');

// Get all Abogados
router.get('/', async (req, res) => {
  try {
    const abogados = await Abogado.findAll();
    res.json(abogados);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a new Abogado
router.post('/', async (req, res) => {
  try {
    const newAbogado = await Abogado.create(req.body);
    res.status(201).json(newAbogado);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
