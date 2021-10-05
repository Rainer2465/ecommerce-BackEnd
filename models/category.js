const { DataTypes, Sequelize } = require('sequelize');

const sequelize = require('../utils/database');

const Category = sequelize.define('category', {
  id: {
    type: DataTypes.UUID,
    defaultValue: Sequelize.UUIDV4,
    allowNull: false,
    primaryKey: true
  },
  title: {
    type: DataTypes.ENUM('t-shirts', 'shirts', 'pants', 'shoes'),
    allowNull: false
  }
});

module.exports = Category;