// routes/usuarios.js

const express = require('express');
const router = express.Router();
const Usuario = require('../model/Usuario');  // Import the Usuario model
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// Get all Usuarios
router.get("/", async (req, res) => {
  try {
    const usuarios = await Usuario.findAll();
    res.status(200).json(usuarios);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Register a new Usuario
router.post("/register", async (req, res) => {
  try {
    const newUsuario = req.body;

    const usuario = await Usuario.findOne({ where: { email: newUsuario.email } });

    if (!usuario) {
      const hashedPassword = await bcrypt.hash(newUsuario.contrasena, 10);
      newUsuario.contrasena = hashedPassword;
      const createdUsuario = await Usuario.create(newUsuario);

      const token = jwt.sign(
        { id: createdUsuario.id, email: createdUsuario.email, role: createdUsuario.rol },
        process.env.SECRET,
        { expiresIn: "1h" }
      );

      res.status(201).json({ message: "Usuario created successfully", token: token });
    } else {
      return res.status(401).json({ message: "Usuario already exists" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Login a Usuario
router.post("/login", async (req, res) => {
  try {
    const loginUsuario = req.body;

    const usuario = await Usuario.findOne({ where: { email: loginUsuario.email } });

    if (!usuario) {
      return res.status(401).json({ message: 'Authentication failed' });
    } else {
      const valid = await bcrypt.compare(loginUsuario.contrasena, usuario.contrasena);

      if (valid) {
        const token = jwt.sign(
          { id: usuario.id, email: usuario.email, role: usuario.rol },
          process.env.SECRET,
          { expiresIn: "1h" }
        );

        res.status(200).json({ message: "Usuario logged in", token: token });
      } else {
        return res.status(401).json({ message: "Invalid credentials" });
      }
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
