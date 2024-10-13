// ./model/Biblioteca.js

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Biblioteca = sequelize.define(
  "Biblioteca",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    titulo: {  // New column for the title
      type: DataTypes.STRING,
      allowNull: false,
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    url_del_pdf: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    tableName: "Biblioteca",
    timestamps: true,
  }
);

module.exports = Biblioteca;
