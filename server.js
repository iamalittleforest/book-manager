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
          console.log('==== View Books ====');
          viewBooks();
          break;
        case 'Add a book':
          console.log('==== Add a Book ====');
          addBook();
          break;
        case 'Edit a book':
          console.log('==== Edit a Book ====');
          editBook();
          break;
        case 'Search for a book':
          console.log('==== Search for a Book ====');
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
  console.log('To view details, enter the book ID. To return, press <Enter>');
  inquirer
    .prompt([
      {
        name: 'id',
        type: 'list',
        message: 'Book Id: ',
        choices: await bookChoices()
      }
    ])
    .then((res) => {
      viewBooks();
      start();
    });
};

const addBook = async () => {
  console.log('Please enter the following information:');
  inquirer
    .prompt([
      {
        name: 'title',
        type: 'input',
        message: 'Title: '
      },
      {
        name: 'author',
        type: 'input',
        message: 'Author: '
      },
      {
        name: 'description',
        type: 'input',
        message: 'Description: '
      }
    ])
    .then((res) => {
      start();
    });
};

const editBook = async () => {
  console.log('To edit a book, enter the book ID. To return, press <Enter>');
  inquirer
    .prompt([
      {
        name: 'id',
        type: 'list',
        message: 'Book ID: ',
        choices: await bookChoices()
      }
    ])
    .then((res) => {
      editBook();
      start();
    });
};

const searchBook = async () => {
  console.log('Type in one or more keywords to search for.');
  inquirer
    .prompt([
      {
        name: 'id',
        type: 'input',
        message: 'Search: ',
      }
    ])
    .then((res) => {
      start();
    });
};

const bookChoices = async () => {

}

connection();