const { DataTypes, Sequelize } = require('sequelize');

const sequelize = require('../utils/database');

const TargetGroup = sequelize.define('target_group', {
  id: {
    type: DataTypes.UUID,
    defaultValue: Sequelize.UUIDV4,
    allowNull: false,
    primaryKey: true
  },
  title: {
    type: DataTypes.ENUM('men', 'women', 'boys', 'girls'),
    allowNull: false
  }
});

module.exports = TargetGroup;