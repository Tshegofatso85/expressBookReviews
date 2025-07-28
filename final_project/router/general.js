const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if(username && password){
    const doesExist = users.find(user => user.username === username);
    if(!doesExist){
        users.push({"username" : username, "password": password});
        res.status(200).json({message: "User successfully registered. Now you can login"})
    }else{
        return res.status(404).json({message: "User already exists!"});
    }
  }
  return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/', (req, res) => {  
    const getBooks = () => new Promise((resovle) => resovle(books));

    getBooks()
      .then(books => {
        books ? res.status(200).json(books) : res.status(404).json({ message: "Books not found" }) 
      })
      .catch(() => {
        res.status(500).json({ message: "Internal server error"});
      })
});

public_users.get('/isbn/:isbn', (req, res) => {
    const isbn = req.params.isbn;
    const getBookByIsbn = (isbn) => new Promise((resolve) => resolve(books[isbn]));
  
    getBookByIsbn(isbn)
      .then((book) => {
        book ? res.status(200).json(book) : res.status(404).json({ message: "Book not found for the given ISBN" });
      })
      .catch(() => {
        res.status(500).json({ message: "Internal server error"});
      });
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author;
    const keys = Object.keys(books);

    const findAuthor = (author, keys) => new Promise((resolve) => {
     resolve(keys.filter(key => books[key].author.toLowerCase() === author.toLowerCase()).map(key => books[key]))
    })

    findAuthor(author, keys)
      .then((foundAuthor) => {
        foundAuthor.length > 0 ? res.status(200).json(foundAuthor) : res.status(404).json({message: "Author is not found"});
      })
      .catch(() => {
        res.status(500).json({ message: "Internal server error"});
      })

});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  const keys = Object.keys(books);

  const findTitle = (title, keys) => new Promise((resolve) => {
    resolve(keys.find(key => books[key].title.toLowerCase() === title.toLowerCase()))
  })
  
  findTitle(title, keys)
    .then((foundTitle) => {
      foundTitle ? res.status(200).json(books[foundTitle]) : res.status(404).json({message: "Title not found"});
    })
    .catch(() => {
      res.status(500).json({ message: "Internal server error"});
    })
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];
  return book ? res.status(200).json({reviews:book.reviews}) : res.status(404).json({message: "Book not found for the given ISBN"})
});

module.exports.general = public_users;
