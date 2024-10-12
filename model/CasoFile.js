const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Caso = require('./Caso');
const File = require('./File');

const CasoFile = sequelize.define('CasoFile', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  id_caso: {
    type: DataTypes.INTEGER,
    references: {
      model: Caso,
      key: 'id'
    },
    onDelete: 'CASCADE',
    allowNull: false
  },
  id_file: {
    type: DataTypes.INTEGER,
    references: {
      model: File,
      key: 'id'
    },
    onDelete: 'CASCADE',
    allowNull: false
  }
});

module.exports = CasoFile;
