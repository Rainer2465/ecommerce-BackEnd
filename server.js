const path = require('path');
const express = require('express');
const morgan = require('morgan');
const fileupload = require('express-fileupload');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const errorHandler = require('./middleware/error');

const sequelize = require('./utils/database');

// LOAD ENV VARS
dotenv.config({ path: './config/config.env' });

// MODELS
const Product = require('./models/product');
const Category = require('./models/category');
const TargetGroup = require('./models/target_group');

// ROUTE FILES
const products = require('./routes/products');
const auth = require('./routes/auth');
const targetGroups = require('./routes/targetGroups');

const app = express();

// BODY PARSER
app.use(express.json());

// Cookie parser
app.use(cookieParser());

// DEV LOGGING MIDDLEWARE
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// File uploading
app.use(fileupload());

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// ENABLE CORS
app.use(cors());

// MOUNT ROUTES
app.use('/api/v1/products', products);
app.use('/api/v1/auth', auth);
app.use('/api/v1/target-groups', targetGroups);

// SYNC MODELS
sequelize.sync().then(() => {
  console.log('SYNC WAS SUCCESSFUL');
  // Category.hasMany(Product);
  // Product.belongsTo(Category);

  // TargetGroup.hasMany(Product);
  // Product.belongsTo(TargetGroup);
  // console.log('RELATIONS ESTABLISHED');
});

// MODEL RELATIONS
Category.hasMany(Product);
Product.belongsTo(Category);

TargetGroup.hasMany(Product);
Product.belongsTo(TargetGroup);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`App listening on port ${process.env.PORT} on mode ${process.env.NODE_ENV}`);
});

//HANDLE UNHANDELED PROMISE REJECTIONS
process.on('unhandledRejection', (error, promise) => {
  console.log(`Error: ${error.message}`);
  //CLOSE SERVER & EXIT PROCESS
  server.close(() => process.exit(1));
});