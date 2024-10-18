// model/CasoFile.js

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Caso = require('./Caso');
const File = require('./File');

// Define the CasoFile join table and integrate associations
const CasoFile = sequelize.define('CasoFile', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  id_caso: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Caso, // Reference to the Caso model
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  id_file: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: File, // Reference to the File model
      key: 'id'
    },
    onDelete: 'CASCADE'
  }
}, {
  tableName: 'CasoFiles',
  timestamps: true // No need for timestamps if not required
});

// Integrate associations directly within the join table definition
Caso.belongsToMany(File, {
  through: CasoFile,
  foreignKey: 'id_caso',
  otherKey: 'id_file'
});

File.belongsToMany(Caso, {
  through: CasoFile,
  foreignKey: 'id_file',
  otherKey: 'id_caso'
});

module.exports = CasoFile;
