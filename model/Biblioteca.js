const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const File = sequelize.define('File', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  descripcion:{
    type: DataTypes.TEXT,
    allowNull: false
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  url_del_pdf: {
    type: DataTypes.TEXT,
    allowNull: false
  }
},{
    tableName: 'Files',
    timestamps: true
});

module.exports = File;