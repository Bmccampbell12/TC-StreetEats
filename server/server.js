const express = require('express');
const app = express();
require('dotenv').config();
const PORT = process.env.PORT || 5001;

const sessionMiddleware = require('./modules/session-middleware');
const passport = require('./strategies/user.strategy');
const userRouter = require('./routes/user.router');
const pool = require('./modules/pool');

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('build'));

// Session middleware
app.use((req, res, next) => {
  try {
    sessionMiddleware(req, res, next);
  } catch (err) {
    console.error('Session middleware error:', err);
    res.status(500).json({ message: 'Session error', error: err.message });
  }
});

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/api/user', userRouter);

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  console.error('Stack trace:', err.stack);
  
  // Don't leak error details in production
  const errorMessage = process.env.NODE_ENV === 'development' 
    ? err.message 
    : 'An unexpected error occurred';
    
  res.status(500).json({ 
    message: errorMessage,
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

// Start server only if database connection is successful
const startServer = async () => {
  try {
    // Verify database connection
    const isConnected = await pool.verify();
    if (!isConnected) {
      console.error('Failed to connect to database. Server will not start.');
      process.exit(1);
    }

    // Start server
    app.listen(PORT, () => {
      console.log(`Listening on port: ${PORT}`);
      console.log('Node environment:', process.env.NODE_ENV);
    });
  } catch (error) {
    console.error('Error starting server:', error);
    process.exit(1);
  }
};

startServer();