// model/Caso.js

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Abogado = require('./Abogado');
const Cliente = require('./Cliente');
const Alumno = require('./Alumno');

const Caso = sequelize.define('Caso', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'ID_Caso'
  },
  folio: {
    type: DataTypes.INTEGER,
    unique: true
  },
  numero_expediente: {
    type: DataTypes.INTEGER,
    unique: true
  },
  descripcion: DataTypes.TEXT,
  estado: DataTypes.STRING(50),
  id_abogado: {
    type: DataTypes.INTEGER,
    references: {
      model: Abogado,
      key: 'ID_Abogado'
    },
    allowNull: false,
    onDelete: 'SET NULL'
  },
  id_cliente: {
    type: DataTypes.INTEGER,
    references: {
      model: Cliente,
      key: 'ID_Cliente'
    },
    allowNull: false,
    onDelete: 'CASCADE'
  },
  id_alumno: {
    type: DataTypes.INTEGER,
    references: {
      model: Alumno,
      key: 'ID_Alumno'
    },
    onDelete: 'SET NULL'
  }
});

module.exports = Caso;
