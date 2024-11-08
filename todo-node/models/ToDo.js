// models/ToDo.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Adjust this import to your config path

const ToDo = sequelize.define('ToDo', {
 id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  taskName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = ToDo;
