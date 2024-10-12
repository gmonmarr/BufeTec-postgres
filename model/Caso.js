const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Caso = sequelize.define('Caso', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'ID_Caso'
  },
  expediente: {
    type: DataTypes.STRING(10),
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
