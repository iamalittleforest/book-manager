// import modules
const inquirer = require('inquirer');
const sequelize = require('./config/connection');
const Book = require('./models/Book');

// create connection
const connection = async () => {
  try {
    await sequelize.sync({ force: false });
    Book.findAll()
      .then(allBooks => {
        console.log(`\nLoaded ${allBooks.length} books into the library.`);
        start();
      })
  } catch (err) {
    console.log(err);
  }
}

// start menu prompts
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
        case '5. Save and exit\n':
          console.log(`Library saved.\n`)
          process.exit();
      }
    });
};

// 1. View all books
const viewBooks = async () => {
  try {
    
    // get all books
    Book.findAll()
      .then(allBooks => {

        // display all books
        allBooks.forEach(book => {
          console.log(` [${book.id}] ${book.title}`);
        });

        // initiate prompt for one book
        viewOneBook();
      })
  } catch (err) {
    console.log(err);
  }
}

const viewOneBook = async () => {
  inquirer
    .prompt([
      {
        name: 'id',
        type: 'input',
        message: '\nTo view details, enter the book ID. To return, press <Enter>',
        default: '',
        prefix: '',
        suffix: '\nBook ID:'
      }
    ])
    .then(res => {

      // checks to see if enter is pressed (using default value)
      if (res.id === '') {
        
        // return to start
        start();
        return;
      } else {

        // view details of book using provided response
        viewDetails(res);
      }
    });
};

const viewDetails = async (res) => {
  try {

    // find book associated with provided id
    Book.findByPk(res.id)
      .then(book => {
        
        // display book details
        console.log(`
        ID: ${book.id} 
        Title: ${book.title} 
        Author: ${book.author} 
        Description: ${book.description}`);

        // return to view one book
        viewOneBook();
      });
  } catch (err) {
    console.log(err);
  }
}

// 2. Add a Book
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
    .then(res => {
      try {

        // create a book using provided details
        Book.create(res)
          .then(newBook => {
            
            // display confirmation that book was created
            console.log(`\nBook [${newBook.id}] Saved`);

            // return to start
            start();
          })
      } catch (err) {
        console.log(err);
      }
    });
};

// 3. Edit a Book
const editBook = async () => {
  inquirer
    .prompt([
      {
        name: 'id',
        type: 'input',
        message: '\nTo edit a book, enter the book ID. To return, press <Enter>',
        prefix: '',
        suffix: '\nBook ID:'
      }
    ])
    .then(res => {
      editBook();
      start();
    });
};

// 4. Search for a Book
const searchBook = async () => {
  inquirer
    .prompt([
      {
        name: 'id',
        type: 'input',
        message: '\nType in one or more keywords to search for.',
        prefix: '',
        suffix: '\nSearch: '
      }
    ])
    .then(res => {
      start();
    });
};

connection();