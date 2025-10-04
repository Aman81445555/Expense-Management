// index.js

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config(); // This line loads the .env file

// Initialize our app
const app = express();

// Use middleware
app.use(cors());
app.use(express.json());

// --- Database Connection ---
const uri = process.env.MONGO_URI;
mongoose.connect(uri);
const connection = mongoose.connection;
connection.once('open', () => {
  console.log("MongoDB database connection established successfully");
});

// --- Routes ---
// Define your routes BEFORE starting the server
app.get('/', (req, res) => {
  res.send('Your backend server is connected to the database!');
});

// User routes
const usersRouter = require('./routes/users');
app.use('/api/users', usersRouter);

// Expense routes (THESE ARE THE NEW LINES)
const expensesRouter = require('./routes/expenses');
app.use('/api/expenses', expensesRouter);


// --- Start Server ---
// This should be the LAST part of the file
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});