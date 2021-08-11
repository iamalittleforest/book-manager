// import modules
const inquirer = require('inquirer');
const { Op } = require("sequelize")
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
    console.log('Connection Error', err);
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
          editBooks();
          break;
        case '4. Search for a book':
          console.log('\n==== Search for a Book ====\n');
          searchBook();
          break;
        case '5. Save and exit':
          console.log('\nLibrary saved.')
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
        // initiate prompt to view one book
        viewOneBook();
      })
  } catch (err) {
    console.log('Unable to view all books (viewBooks)', err);
  }
}

const viewOneBook = async () => {
  inquirer
    .prompt([
      {
        name: 'id',
        type: 'input',
        message: '\nTo view book details, enter the book ID. To return, press <Enter>\n',
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
        // initiate prompt to view another book
        viewOneBook();
      });
  } catch (err) {
    console.log('Unable to find and view book details', err);
  }
}

// 2. Add a book
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
        console.log('Unable to create new book', err);
      }
    });
};

// 3. Edit a book
const editBooks = async () => {
  try {
    // get all books
    Book.findAll()
      .then(allBooks => {
        // display all books
        allBooks.forEach(book => {
          console.log(` [${book.id}] ${book.title}`);
        });
        // initiate prompt to edit one book
        editOneBook();
      })
  } catch (err) {
    console.log('Unable to view all books (editBooks)', err);
  }
}

const editOneBook = async () => {
  inquirer
    .prompt([
      {
        name: 'id',
        type: 'input',
        message: '\nTo edit a book, enter the book ID. To return, press <Enter>\n',
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
        // edit details of book using provided response
        editDetails(res);
      }
    });
};

const editDetails = async (res) => {
  // find book associated with provided id
  Book.findByPk(res.id)
    .then(book => {
      console.log('\nPlease enter the following information:\n');
      inquirer
        .prompt([
          {
            name: 'title',
            type: 'input',
            message: 'Title: ',
            default: `${book.title}`,
            prefix: ''
          },
          {
            name: 'author',
            type: 'input',
            message: 'Author: ',
            default: `${book.author}`,
            prefix: ''
          },
          {
            name: 'description',
            type: 'input',
            message: 'Description: ',
            default: `${book.description}`,
            prefix: ''
          }
        ])
        .then(res => {
          try {
            // update a book using provided details
            Book.update(res, { where: { id: book.id } })
              .then(() => {
                // display confirmation that book was updated
                console.log(`\nBook Updated`);
                // initiate prompt to edit one book
                editOneBook();
              })
          } catch (err) {
            console.log('Unable to update book', err);
          }
        });
    });
}

// 4. Search for a book
const searchBook = async () => {
  inquirer
    .prompt([
      {
        name: 'keyword',
        type: 'input',
        message: 'Type in one or more keywords to search for.\n',
        prefix: '',
        suffix: '\nSearch: '
      }
    ])
    .then(res => {
      try {
        // get all books that match the search criteria
        Book.findAll({
          where: {
            [Op.or]: [
              { title: { [Op.substring]: `%${res.keyword}%` } },
              { author: { [Op.substring]: `%${res.keyword}%` } },
              { description: { [Op.substring]: `%${res.keyword}%` } }
            ]
          }
        })
          .then(searchResults => {
            // checks for results from query
            if (searchResults.length > 0) {
              // display all books that match the search criteria
              console.log('\nThe following book(s) matched your query:\n')
              searchResults.forEach(book => {
                console.log(` [${book.id}] ${book.title}`);
              });
              // initiate prompt to view one book
              viewOneBook();
            } else {
              // inform user there are no results
              console.log('\n No books found')
              start();
            }
          })
      } catch (err) {
        console.log('Unable to perform search', err);
      }
    });
};

connection();