const express = require('express');
const session = require('express-session');
const path = require('path');
const userRoutes = require('./routes/users');

const app = express();

// Use Pug (formerly Jade) as the view engine
app.set('view engine', 'pug'); // or 'jade' if you're using jade
app.set('views', path.join(__dirname, 'views')); // Specify the views directory

// Middleware to parse incoming request bodies
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public'))); // Static files

// Session middleware
app.use(session({
  secret: 'secretKey', // Change this to a secure secret in production
  resave: false,
  saveUninitialized: true,
}));

// Use user routes
app.use('/', userRoutes);

// Routes
const employeeRoutes = require('./routes/employees');
app.use('/employees', employeeRoutes);

const assetCategoryRoutes = require('./routes/assetCategory');
app.use('/asset-categories', assetCategoryRoutes);

const assetRoutes = require('./routes/asset');
app.use('/assets', assetRoutes);

const transactionRoutes = require('./routes/transactionRoutes'); // ✅ New route
app.use('/transactions', transactionRoutes);                // ✅ Mount it

// Export the app instance so that bin/www can use it
module.exports = app;
