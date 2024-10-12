// model/PeticionCaso.js

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Usuario = require('./Usuario'); // Asegúrate de tener un modelo Usuario definido

const PeticionCaso = sequelize.define('PeticionCaso', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  id_user: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Usuario, // Asegúrate de que esta tabla exista
      key: 'id'
    },
    onDelete: 'CASCADE' // Si se elimina el usuario, elimina la petición
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  estado: {
    type: DataTypes.ENUM('Aceptado', 'Negado', 'En proceso'), // Estado de la petición
    defaultValue: 'En proceso'
  }
}, {
  tableName: 'PeticionesCasos', // Nombre personalizado de la tabla
  timestamps: true // createdAt y updatedAt
});

module.exports = PeticionCaso;
