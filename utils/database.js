const dotenv = require('dotenv');
const { Sequelize } = require('sequelize');

// LOAD ENV VARS
dotenv.config({ path: './config/config.env' });

const sequelize = new Sequelize(process.env.PSQL_DATABASE, process.env.PSQL_USERNAME, process.env.PSQL_PASSWORD, {
  host: process.env.PSQL_HOST,
  dialect: 'postgres',
  logging: false
});

module.exports = sequelize;