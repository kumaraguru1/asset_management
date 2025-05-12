const { User } = require('../models'); // Correct the import to get User model from index.js
const bcrypt = require('bcryptjs');

class AuthController {
  // GET /register
  getRegister(req, res) {
    res.render('register');
  }

  // POST /register
  async postRegister(req, res) {
    const { username, password } = req.body;

    // Ensure the username is unique
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      await User.create({ username, password: hashedPassword });
      res.redirect('/login');
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  // GET /login
  getLogin(req, res) {
    res.render('login');
  }

  // POST /login
  async postLogin(req, res) {
    try {
      const { username, password } = req.body;

      // Debugging: Ensure the User model is working properly
      console.log(User);  // Check if the model is properly loaded

      // Check if the user exists
      const user = await User.findOne({ where: { username } });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Compare the password using bcrypt
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (passwordMatch) {
        // Save the user session
        req.session.userId = user.id;
        return res.redirect('/dashboard');
      } else {
        return res.send('Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  // GET /dashboard
  getDashboard(req, res) {
    res.render('dashboard', { user: req.session.userId });
  }

  // GET /logout
  logout(req, res) {
    req.session.destroy(() => res.redirect('/login'));
  }

  // Auth Middleware
  isAuthenticated(req, res, next) {
    if (req.session.userId) next();
    else res.redirect('/login');
  }
}

module.exports = new AuthController();
