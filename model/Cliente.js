// model/Cliente.js

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Usuario = require('./Usuario');

const Cliente = sequelize.define('Cliente', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'ID_Cliente'
  },
  direccion: DataTypes.TEXT,
  id_usuario: {
    type: DataTypes.INTEGER,
    references: {
      model: Usuario,
      key: 'ID_Usuario'
    },
    onDelete: 'CASCADE'
  }
});

module.exports = Cliente;
