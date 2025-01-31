const express = require('express');
const {
  rejectUnauthenticated,
} = require('../modules/authentication-middleware');
const encryptLib = require('../modules/encryption');
const pool = require('../modules/pool');
const userStrategy = require('../strategies/user.strategy');
const router = express.Router();

/**
 * GET /api/user
 * Get user information if authenticated
 * @returns {Object} user object from session
 */
router.get('/', rejectUnauthenticated, (req, res) => {
  res.send(req.user);
});

/**
 * POST /api/user/register
 * Register a new user
 * @param {string} username - The username
 * @param {string} password - The password
 * @returns {number} user id
 */
router.post('/register', async (req, res) => {
  try {
    const { username, password, role = 'user' } = req.body;

    // Input validation
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }
    if (username.length < 3 || password.length < 6) {
      return res.status(400).json({ 
        message: 'Username must be at least 3 characters and password must be at least 6 characters' 
      });
    }

    // Check if username already exists
    const checkUser = await pool.query('SELECT id FROM "users" WHERE username = $1', [username]);
    if (checkUser.rows.length > 0) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    const encryptedPassword = encryptLib.encryptPassword(password);
    const queryText = `
      INSERT INTO "users" (username, password, role)
      VALUES ($1, $2, $3)
      RETURNING id
    `;
    
    const result = await pool.query(queryText, [username, encryptedPassword, role]);
    res.status(201).json({ id: result.rows[0].id });
  } catch (error) {
    console.error('User registration failed:', error);
    res.status(500).json({ message: 'Internal server error during registration' });
  }
});

/**
 * POST /api/user/login
 * Login user with provided credentials
 * Uses passport local strategy for authentication
 */
router.post('/login', (req, res, next) => {
  console.log('Login request received:', { 
    username: req.body.username,
    role: req.body.role 
  });

  userStrategy.authenticate('local', (err, user, info) => {
    if (err) {
      console.error('Authentication error:', err);
      return res.status(500).json({ 
        message: 'Internal server error during login',
        details: process.env.NODE_ENV === 'development' ? err.message : undefined
      });
    }

    if (!user) {
      console.log('Login failed:', info?.message || 'Unknown reason');
      return res.status(401).json({ 
        message: info?.message || 'Invalid username or password' 
      });
    }

    // Manually establish the session
    req.login(user, (loginErr) => {
      if (loginErr) {
        console.error('Session error:', loginErr);
        return res.status(500).json({ 
          message: 'Error establishing session',
          details: process.env.NODE_ENV === 'development' ? loginErr.message : undefined
        });
      }

      console.log('Login successful for user:', user.username);
      res.json({
        id: user.id,
        username: user.username,
        role: user.role,
        isAuthenticated: true
      });
    });
  })(req, res, next);
});

/**
 * POST /api/user/logout
 * Log out the user
 * Clears the session
 */
router.post('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error('Logout error:', err);
      return res.status(500).json({ message: 'Error during logout' });
    }
    res.sendStatus(200);
  });
});

module.exports = router;