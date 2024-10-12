const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Caso = require('./Caso'); // Import the Caso model
const CasoFile = require('./CasoFile'); // Import the join table

const File = sequelize.define('File', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  url_del_pdf: {
    type: DataTypes.TEXT,
    allowNull: false
  }
});

module.exports = File;