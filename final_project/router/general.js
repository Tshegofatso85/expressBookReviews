const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  return res.status(200).json(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn]
  return book ? res.status(200).json(books[`${isbn}`]) : res.status(404).json({ message: "Book not found for the given ISBN" });
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  const keys = Object.keys(books);
  const findAuthor = keys.filter(key => books[key].author.toLowerCase() === author.toLowerCase()).map(key => books[key]);

  return findAuthor.length > 0 ? res.status(200).json(findAuthor) : res.status(404).json({message: "Author is not found"})
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  const keys = Object.keys(books);
  const findTitle = keys.find(key => books[key].title.toLowerCase() === title.toLowerCase())  
  return findTitle ? res.status(200).json(books[findTitle]) : res.status(404).json({message: "Title not found"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];
  return book ? res.status(200).json({reviews:book.reviews}) : res.status(404).json({message: "Book not found for the given ISBN"})
});

module.exports.general = public_users;
