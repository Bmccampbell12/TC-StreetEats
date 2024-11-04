const express = require('express');
const { body, validationResult } = require('express-validator'); // Validation middleware
const {
  rejectUnauthenticated,
} = require('../modules/authentication-middleware');
const encryptLib = require('../modules/encryption');
const pool = require('../modules/pool');
const userStrategy = require('../strategies/user.strategy');

const router = express.Router();

// Handles Ajax request for user information if user is authenticated
router.get('/', rejectUnauthenticated, (req, res) => {
  // Send back user object from the session (previously queried from the database)
  res.send(req.user);
});
// registers a new user with validation
router.post('/api/user/register', 
  // validation rules
  body('username').isEmail().withMessage('Please provide a valid username.'),
  body('password').isLength({ min: 6}).withMessage('Password must be at least 6 characters long'),
  body('role').optional().isString().withMessage('role must be a string.'),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // Sends validation error response
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, password, role } = req.body;
    const encryptedPassword = encryptLib.encryptPassword(password);

    try {
      // Checks if username already exists
      const existingUser = await pool.query(`SELECT * FROM "user" WHERE username = $1`, [username])
      if (existingUser.rows.length > 0) {
        return res.status(409).json({ message: "username already in use" })
      }

        // Inserts new user
        const queryText = `INSERT INTO "user" (username, password, role) VALUES ($1, $2, $3) RETURNING id`;
        await pool.query(queryText, [username, encryptedPassword, role || 'user']);
        res.sendStatus(201);
    } catch (err) {
      console.error('User registration failed: ', err);
      res.status(500).json({ message: 'Server error: Unable to register user' })
    }
  }
)
// Handles POST request with new user data
// The only thing different from this and every other post we've seen
// is that the password gets encrypted before being inserted
// router.post('/register', (req, res, next) => {
//   const username = req.body.username;
//   const password = encryptLib.encryptPassword(req.body.password);

//   const queryText = `INSERT INTO "user" (username, password)
//     VALUES ($1, $2) RETURNING id`;
//   pool
//     .query(queryText, [username, password])
//     .then(() => res.sendStatus(201))
//     .catch((err) => {
//       console.log('User registration failed: ', err);
//       res.sendStatus(500);
//     });
// });

// Handles login form authenticate/login POST
// userStrategy.authenticate('local') is middleware that we run on this route
// this middleware will run our POST if successful
// this middleware will send a 404 if not successful
router.post('/login', 
  body('username').isEmail().withMessage('Please provide a valid email password.'),
  body('password').notEmpty().withMessage('Password is required.'), 
  (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
      // Sends validation error response
      return res.status(400).json({ errors: errors.array() });
    }
  
  
  userStrategy.authenticate('local', (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });
    req.login(user, (loginErr) => {
      if (loginErr) return next(loginErr);
      res.sendStatus(200);
      })
    })(req, res, next);
  }
)
// clear all server session information about this user
router.post('/logout', (req, res, next) => {
  // Use passport's built-in method to log out the user
  req.logout((err) => {
    if (err) { return next(err); }
    res.sendStatus(200);
  });
});

module.exports = router;
