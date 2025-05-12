const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/AuthController');

// Register
router.get('/register', AuthController.getRegister);
router.post('/register', AuthController.postRegister);

// Login
router.get('/login', AuthController.getLogin);
router.post('/login', AuthController.postLogin);

// Dashboard (protected)
router.get('/dashboard', AuthController.isAuthenticated, AuthController.getDashboard);

// Logout
router.get('/logout', AuthController.logout);

module.exports = router;
