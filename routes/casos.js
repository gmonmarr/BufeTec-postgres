// routes/casos.js

const express = require('express');
const router = express.Router();
const Caso = require('../model/Caso');

// Get all Casos
router.get('/', async (req, res) => {
  try {
    const casos = await Caso.findAll();
    res.json(casos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a new Caso
router.post('/', async (req, res) => {
  try {
    const newCaso = await Caso.create(req.body);
    res.status(201).json(newCaso);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
