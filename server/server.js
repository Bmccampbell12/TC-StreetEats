const express = require('express');
// const cors = require('cors');
const app = express();
require('dotenv').config();
const PORT = process.env.PORT || 5001;

// app.use(cors)
// Middleware Includes
const sessionMiddleware = require('./modules/session-middleware');
const passport = require('./strategies/user.strategy');

// Route Includes
const userRouter = require('./routes/user.router');

// PostgresSQL Database Pool setup
const { Pool } = require('pg');
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD, 
  port: process.env.DB_PORT,
}); 

// Express Middleware
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static('build'));

// Passport Session Configuration
app.use(sessionMiddleware);

// Start Passport Sessions
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/api/user', userRouter);

app.get('/api/trucks', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM "Trucks"');
    res.json(result.rows); // Sends food truck data as JSON
  } catch (err) {
    console.error('Error fetching food trucks:', err);
    res.status(500).send('Server error');
  }
});

// Listen Server & Port
app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});
