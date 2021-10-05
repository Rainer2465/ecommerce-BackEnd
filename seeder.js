const fs = require('fs');
const colors = require('colors');

const sequelize = require('./utils/database');

// LOAD MODELS
const User = require('./models/user');
const TargetGroup = require('./models/target_group');
const Category = require('./models/category');
const Product = require('./models/product');

// READ JSON FILES
const users = JSON.parse(fs.readFileSync(`${__dirname}/_data/users.json`, 'utf-8'));
const targetGroups = JSON.parse(fs.readFileSync(`${__dirname}/_data/target_groups.json`, 'utf-8'));
const categories = JSON.parse(fs.readFileSync(`${__dirname}/_data/categories.json`, 'utf-8'));
const products = JSON.parse(fs.readFileSync(`${__dirname}/_data/products.json`, 'utf-8'));

// RELATIONS
Category.hasMany(Product);
Product.belongsTo(Category);

TargetGroup.hasMany(Product);
Product.belongsTo(TargetGroup);

// IMPORT INTO DB
const importData = async () => {
  try {
    await sequelize.sync({ force: true }).then(() => {
      console.log('SYNC WAS SUCCESSFUL'.green.inverse);
    });
    await User.bulkCreate(users);
    await TargetGroup.bulkCreate(targetGroups);
    await Category.bulkCreate(categories);
    await Product.bulkCreate(products);
    console.log('Data imported...'.green.inverse);
    process.exit();
  } catch (error) {
    console.log(error);
  }
};

// DELETE FROM DB
const deleteData = async () => {
  try {
    // await sequelize.sync({ force: true });
    // await sequelize.drop();
    await User.drop({ searchPath: false });
    await Product.drop({ searchPath: false });
    await TargetGroup.drop({ searchPath: false });
    await Category.drop({ searchPath: false });
    console.log('Data destroyed...'.red.inverse);
    process.exit();
  } catch (error) {
    console.log(error);
  }
};

if (process.argv[2] === '-i') {
  importData();
} else if (process.argv[2] === '-d') {
  deleteData();
}