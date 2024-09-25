// routes/clientes.js

const express = require('express');
const router = express.Router();
const Cliente = require('../model/Cliente');

// Get all Clientes
router.get('/', async (req, res) => {
  try {
    const clientes = await Cliente.findAll();
    res.json(clientes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a new Cliente
router.post('/', async (req, res) => {
  try {
    const newCliente = await Cliente.create(req.body);
    res.status(201).json(newCliente);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
