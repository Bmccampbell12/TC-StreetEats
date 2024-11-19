// user.router.js: Enhanced Authentication Routes
const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const passport = require('../strategies/user.strategy');
const pool = require('../modules/pool');
const encryptLib = require('../modules/encryption');

// Validation middleware
const validateLogin = [
  body('username').isEmail().withMessage('Invalid email format'),
  body('password').notEmpty().withMessage('Password is required')
];

// Login Route with Enhanced Error Handling
router.post('/login', validateLogin, (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return res.status(500).json({ message: 'Authentication error' });
    }
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    req.login(user, (loginErr) => {
      if (loginErr) {
        return res.status(500).json({ message: 'Session creation failed' });
      }
      res.json({ 
        id: user.id, 
        username: user.username, 
        role: user.role 
      });
    });
  })(req, res, next);
});

// Registration Route with Improved Validation
router.post('/register', [
  body('username').isEmail().withMessage('Invalid email'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, password, role = 'user' } = req.body;

  try {
    const existingUser = await pool.query(
      'SELECT * FROM "user" WHERE username = $1', 
      [username]
    );

    if (existingUser.rows.length > 0) {
      return res.status(409).json({ message: 'Username already exists' });
    }

    const encryptedPassword = encryptLib.encryptPassword(password);
    await pool.query(
      'INSERT INTO "user" (username, password, role) VALUES ($1, $2, $3)', 
      [username, encryptedPassword, role]
    );

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Registration failed' });
  }
});

// Secure User Retrieval
router.get('/', (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(403).json({ message: 'Not authenticated' });
  }
  
  res.json({
    id: req.user.id,
    username: req.user.username,
    role: req.user.role
  });
});

module.exports = router;