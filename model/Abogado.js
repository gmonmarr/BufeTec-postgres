// model/Abogado.js

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Usuario = require('./Usuario');

const Abogado = sequelize.define('Abogado', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'ID_Abogado'
  },
  especialidad: DataTypes.TEXT,
  experiencia: DataTypes.TEXT,
  id_usuario: {
    type: DataTypes.INTEGER,
    references: {
      model: Usuario,
      key: 'ID_Usuario'
    },
    onDelete: 'CASCADE'
  }
});

// Define the association between Abogado and Usuario
Abogado.belongsTo(Usuario, { foreignKey: 'id_usuario' });

module.exports = Abogado;
