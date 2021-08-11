// import connection
const sequelize = require('../config/connection');

// import Book model and bookSeedData
const Book = require('../models/Book');
const bookSeedData = require('./bookSeedData.json');

const seedDatabase = async () => {
  await sequelize.sync({ force: true });
  await Book.bulkCreate(bookSeedData);
  console.log('Seed Completed!');
  process.exit(0);
};

seedDatabase();