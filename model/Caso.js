const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const File = require('./File'); // Import the File model
const CasoFile = require('./CasoFile'); // Import the join table

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
    allowNull: false
  },
  id_cliente: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  id_alumno: {
    type: DataTypes.INTEGER
  }
});

module.exports = Caso;
