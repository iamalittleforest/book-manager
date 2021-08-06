const inquirer = require('inquirer');
const sequelize = require('../config/connection');

const connection = async () => {
  try {
    await sequelize.sync({ force: false });
    console.log(`Loaded x books into the library`);
    start();
  } catch (err) {
    console.log(err);
  }
}

const start = () => {
  inquirer
    .prompt({
      name: 'action',
      type: 'rawlist',
      message: "=== Book Manager ===",
      choices: [
        'View all books',
        'Add a book',
        'Edit a book',
        'Search for a book',
        'Save and exit'
      ]
    })
    .then((answer) => {
      switch (answer.action) {
        case 'View all books':
          viewBooks();
          break;
        case 'Add a book':
          addBook();
          break;
        case 'Edit a book':
          editBook();
          break;
        case 'Search for a book':
          searchBook();
          break;
        case 'Save and exit':
          connection.end();
          break;
      }
    });
};

const viewBooks = () => {

};

const addBook = async () => {

};

const editBook = async () => {

};

const searchBook = async () => {

};

connection();