const { DataTypes, Sequelize } = require("sequelize");

const sequelize = require("../utils/database");

const Product = sequelize.define("product", {
  id: {
    type: DataTypes.UUID,
    defaultValue: Sequelize.UUIDV4,
    allowNull: false,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  price: {
    type: DataTypes.DOUBLE,
    allowNull: false,
  },
  main_img: {
    type: DataTypes.STRING,
  },
  product_imgs: {
    type: DataTypes.ARRAY(DataTypes.STRING),
  },
});

module.exports = Product;
