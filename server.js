const inquirer = require('inquirer');
const sequelize = require('./config/connection');
const Book = require('./models/Book');

const connection = async () => {
  try {
    await sequelize.sync({ force: false });
    console.log(`\nLoaded x books into the library.`);
    start();
  } catch (err) {
    console.log(err);
  }
}

const start = () => {
  inquirer
    .prompt({
      name: 'action',
      message: '\n==== Book Manager ====\n',
      type: 'list',
      choices: [
        '1. View all books',
        '2. Add a book',
        '3. Edit a book',
        '4. Search for a book',
        '5. Save and exit'
      ],
      prefix: '',
      suffix: '\nChoose [1-5]:'
    })
    .then((res) => {
      switch (res.action) {
        case '1. View all books':
          console.log('\n==== View Books ====\n');
          viewBooks();
          break;
        case '2. Add a book':
          console.log('\n==== Add a Book ====\n');
          addBook();
          break;
        case '3. Edit a book':
          console.log('\n==== Edit a Book ====\n');
          editBook();
          break;
        case '4. Search for a book':
          console.log('\n==== Search for a Book ====\n');
          searchBook();
          break;
        case '5. Save and exit':
          console.log(`\nLibrary saved.\n`)
          process.exit();
      }
    });
};

const viewBooks = async () => {
  console.log('To view details, enter the book ID. To return, press <Enter>\n');
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
  console.log('Please enter the following information:\n');
  inquirer
    .prompt([
      {
        name: 'title',
        type: 'input',
        message: 'Title: ',
        prefix: ''
      },
      {
        name: 'author',
        type: 'input',
        message: 'Author: ',
        prefix: ''
      },
      {
        name: 'description',
        type: 'input',
        message: 'Description: ',
        prefix: ''
      }
    ])
    .then((res) => {

    });
};

const editBook = async () => {
  console.log('To edit a book, enter the book ID. To return, press <Enter>\n');
  inquirer
    .prompt([
      {
        name: 'id',
        type: 'list',
        message: 'Book ID: ',
        choices: await bookChoices(),
        prefix: ''
      }
    ])
    .then((res) => {
      editBook();
      start();
    });
};

const searchBook = async () => {
  console.log('Type in one or more keywords to search for.\n');
  inquirer
    .prompt([
      {
        name: 'id',
        type: 'input',
        message: 'Search: ',
        prefix: ''
      }
    ])
    .then((res) => {
      start();
    });
};

const bookChoices = async () => {

}

connection();