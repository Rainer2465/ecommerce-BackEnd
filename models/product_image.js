const { DataTypes, Sequelize } = require('sequelize');

const sequelize = require('../utils/database');

const ProductImage = sequelize.define('product_image', {
  id: {
    type: DataTypes.UUID,
    defaultValue: Sequelize.UUIDV4,
    allowNull: false,
    primaryKey: true
  },
  mainImg: {
    type: DataTypes.STRING,
    allowNull: false
  },
  productImgList: {
    type: DataTypes.ARRAY(DataTypes.STRING)
  }
});

module.exports = ProductImage;