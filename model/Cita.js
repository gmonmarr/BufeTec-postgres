// model/Cita.js

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Caso = require('./Caso');
const Abogado = require('./Abogado');
const Cliente = require('./Cliente');

const Cita = sequelize.define('Cita', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'ID_Cita'
  },
  fecha: DataTypes.DATE,
  hora: DataTypes.TIME,
  tipo: DataTypes.STRING(50),
  descripcion: DataTypes.TEXT,
  id_caso: {
    type: DataTypes.INTEGER,
    references: {
      model: Caso,
      key: 'ID_Caso'
    },
    onDelete: 'CASCADE'
  },
  id_abogado: {
    type: DataTypes.INTEGER,
    references: {
      model: Abogado,
      key: 'ID_Abogado'
    },
    allowNull: false,
    onDelete: 'CASCADE'
  },
  id_cliente: {
    type: DataTypes.INTEGER,
    references: {
      model: Cliente,
      key: 'ID_Cliente'
    },
    allowNull: false,
    onDelete: 'CASCADE'
  }
});

module.exports = Cita;
