// routes/usuarios.js

const express = require('express');
const Usuario = require('../model/Usuario');
const Abogado = require('../model/Abogado');  // Import Abogado model
const Alumno = require('../model/Alumno');    // Import Alumno model
const Cliente = require('../model/Cliente'); // Debes asegurarte que esto esté presente
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');             // Import bcrypt for password hashing
const router = express.Router();
const verifyToken = require('../middleware/auth');

// Get all Usuarios (Only Admin, Abogado, and Alumno)
router.get("/", verifyToken(['Admin', 'Abogado', 'Alumno']), async (req, res) => {
  try {
    const usuarios = await Usuario.findAll();
    res.status(200).json(usuarios);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update a Usuario (Only Admin, Abogado, and Alumno can update users)
router.put("/:id", verifyToken(['Admin', 'Abogado', 'Alumno']), async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.params.id);

    if (!usuario) {
      return res.status(404).json({ message: 'User not found' });
    }

    await usuario.update(req.body);
    res.status(200).json({ message: 'User updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.put("/:id/role", verifyToken(['Admin', 'Abogado', 'Alumno']), async (req, res) => {
  const transaction = await sequelize.transaction(); // Inicia la transacción
  try {
    const usuario = await Usuario.findByPk(req.params.id, { transaction });
    const { newRole, direccion, especialidad, experiencia } = req.body;

    if (!usuario) {
      await transaction.rollback(); // Revertir cambios si hay un error
      return res.status(404).json({ message: 'User not found' });
    }

    if (!newRole) {
      await transaction.rollback(); // Revertir si no se pasa el nuevo rol
      return res.status(400).json({ message: 'New role is required' });
    }

    // Verificar la jerarquía de roles antes de actualizar
    const userRole = req.user.role;
    const roleHierarchy = ['Usuario', 'Cliente', 'Alumno', 'Abogado', 'Admin'];

    if (roleHierarchy.indexOf(newRole) > roleHierarchy.indexOf(userRole)) {
      await transaction.rollback(); // Revertir si no tiene permisos para promover
      return res.status(403).json({ message: 'Cannot promote user to a higher role than your own' });
    }

    if (newRole === 'Admin' && userRole !== 'Admin') {
      await transaction.rollback(); // Revertir si no es Admin y trata de promover a Admin
      return res.status(403).json({ message: 'Only Admin can promote to Admin' });
    }

    // Actualizar el rol del usuario
    await usuario.update({ rol: newRole }, { transaction });

    // Manejar las promociones y degradaciones de rol
    if (newRole === 'Abogado') {
      const abogadoExists = await Abogado.findOne({ where: { id_usuario: usuario.id }, transaction });
      if (!abogadoExists) {
        await Abogado.create({
          id_usuario: usuario.id,
          especialidad: especialidad || null,  // Si no se proporciona, será null
          experiencia: experiencia || null     // Si no se proporciona, será null
        }, { transaction });
      }
      await Cliente.destroy({ where: { id_usuario: usuario.id }, transaction });
      await Alumno.destroy({ where: { id_usuario: usuario.id }, transaction });
    } else if (newRole === 'Alumno') {
      const alumnoExists = await Alumno.findOne({ where: { id_usuario: usuario.id }, transaction });
      if (!alumnoExists) {
        await Alumno.create({ id_usuario: usuario.id }, { transaction });
      }
      await Abogado.destroy({ where: { id_usuario: usuario.id }, transaction });
      await Cliente.destroy({ where: { id_usuario: usuario.id }, transaction });
    } else if (newRole === 'Cliente') {
      const clienteExists = await Cliente.findOne({ where: { id_usuario: usuario.id }, transaction });
      if (!clienteExists) {
        await Cliente.create({
          id_usuario: usuario.id,
          direccion: direccion || null  // Permitir que sea nulo si no se proporciona
        }, { transaction });
      }
      await Abogado.destroy({ where: { id_usuario: usuario.id }, transaction });
      await Alumno.destroy({ where: { id_usuario: usuario.id }, transaction });
    } else {
      await Abogado.destroy({ where: { id_usuario: usuario.id }, transaction });
      await Alumno.destroy({ where: { id_usuario: usuario.id }, transaction });
      await Cliente.destroy({ where: { id_usuario: usuario.id }, transaction });
    }

    await transaction.commit(); // Confirmar la transacción si todo salió bien
    res.status(200).json({ message: 'User role updated successfully' });
  } catch (err) {
    await transaction.rollback(); // Revertir la transacción en caso de error
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', verifyToken(['Admin']), async (req, res) => {
  try {
    const usuarioId = req.params.id;
    const usuario = await Usuario.findByPk(usuarioId);

    if (!usuario) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Eliminar el usuario de la base de datos
    await usuario.destroy();
    res.status(200).json({ message: 'User deleted successfully' });
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
      newUsuario.rol = 'Usuario';
      const createdUsuario = await Usuario.create(newUsuario);

      const token = jwt.sign(
        { id: createdUsuario.id, email: createdUsuario.email, role: createdUsuario.rol },
        process.env.SECRET,
        { expiresIn: "24h" }  // Token valid for 1 day
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
      const hashedPassword = await bcrypt.hash(loginUsuario.contrasena, 10);
      const valid = await bcrypt.compare(loginUsuario.contrasena, hashedPassword);

      if (valid) {
        const token = jwt.sign(
          { id: usuario.id, email: usuario.email, role: usuario.rol },
          process.env.SECRET,
          { expiresIn: "24h" }  // Token valid for 1 day
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
