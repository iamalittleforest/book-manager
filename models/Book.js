// import model, datatypes, and db connection
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

// create sequelize model for books
class Book extends Model { }

Book.init(
  {
    // define model attributes
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    author: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },
  {
    // set model options
    sequelize,
    freezeTableName: true,
    timestamps: false,
    modelName: 'book'
  }
);

module.exports = Book;