// import modules
const Sequelize = require('sequelize');
require('dotenv').config();

// initialize sequelize to connect to db
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: 'localhost',
    dialect: 'mysql',
    port: 3306,
    logging: false
  }
);

module.exports = sequelize;