// model/Usuario.js

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const bcrypt = require('bcrypt');

const Usuario = sequelize.define('Usuario', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'ID_Usuario'
  },
  nombre: DataTypes.TEXT,
  apellido: DataTypes.TEXT,
  fecha_nacimiento: DataTypes.DATE,
  sexo: DataTypes.STRING(10),
  email: {
    type: DataTypes.TEXT,
    allowNull: false,
    unique: true,
  },
  contrasena: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  rol: {
    type: DataTypes.STRING(50),
    defaultValue: 'usuario'
  },
  numero_telefono: DataTypes.STRING(20)
}, {
  hooks: {
    beforeCreate: async (usuario) => {
      const salt = await bcrypt.genSalt(10);
      usuario.contrasena = await bcrypt.hash(usuario.contrasena, salt);
    }
  }
});

module.exports = Usuario;
