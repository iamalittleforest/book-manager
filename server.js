const inquirer = require('inquirer');
const sequelize = require('./config/connection');
const Book = require('./models/Book');

const connection = async () => {
  try {
    await sequelize.sync({ force: false });
    console.log(`Loaded x books into the library.`);
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
      message: '==== Book Manager ====',
      choices: [
        'View all books',
        'Add a book',
        'Edit a book',
        'Search for a book',
        'Save and exit'
      ]
    })
    .then((res) => {
      switch (res.action) {
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
          console.log(`Library saved.`)
          connection.end();
          break;
      }
    });
};

const viewBooks = async () => {
  console.log('==== View Books ====');
  inquirer
    .prompt([
      {
        name: 'id',
        type: 'list',
        message: 'To view details, enter the book ID. To return, press <Enter>',
        choices: await bookChoices()
      }
    ])
    .then((res) => {
      viewBooks();
    });
};

const addBook = async () => {
  console.log('==== Add a Book ====');
  console.log('Please enter the following information:');
  inquirer
    .prompt([
      {
        name: 'title',
        type: 'input',
        message: 'Title:'
      },
      {
        name: 'author',
        type: 'input',
        message: 'Author:'
      },
      {
        name: 'description',
        type: 'input',
        message: 'Description:'
      }
    ])
    .then((res) => {

    });
};

const editBook = async () => {

};

const searchBook = async () => {

};

const bookChoices = async () => {

}

connection();