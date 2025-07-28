const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
  const validUser = users.find(user => user.username === username && user.password === password);
  return validUser ? true : false; 
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if(!username || !password) return res.status(404).json({ message: "Error logging in" });
  if(!authenticatedUser(username,password)) return res.status(208).json({ message: "Invalid Login. Check username and password" });

  let accessToken = jwt.sign({data: password}, 'access', { expiresIn: 60 * 60 });
  req.session.accessToken = accessToken;
  req.session.username = username;

  return res.status(200).send("User successfully logged in");
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const isbn = req.params.isbn;
  const book = books[isbn];
  const review = req.query.review;
  const username = req.session.username;
  
  if(!book) return res.status(404).json({message: `Number ${isbn} book not found`});
  if(!review) return res.status(400).json({message: "Review query is required"});
  if(!username) return res.status(401).json({ message: "Unauthorized. Please log in first." });

  book.reviews[username] = review;
  return res.status(200).json({ message: "Review successfully added or updated", reviews: book.reviews });
});

regd_users.delete("/auth/review/:isbn", (req,res) => {
  const isbn = req.params.isbn;
  const book = books[isbn];
  const username = req.session.username;

  if(!book) return res.status(404).json({message: `Number ${isbn} book not found`});
  if(!username) return res.status(401).json({ message: "Unauthorized. Please log in first." });
  if(!book.reviews[username]) return res.status(404).json({ message: "No review found from this user to delete" });

  delete book.reviews[username];
  return res.status(200).json({ message: "Review successfully deleted"});
})

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
