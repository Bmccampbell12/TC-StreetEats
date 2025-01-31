// No changes should be required in this file

const expressSession = require('express-session');
const PgSession = require('connect-pg-simple')(expressSession);
const pool = require('./pool.js');
const warnings = require('../constants/warnings');

/*
  The session makes it so a user can enters their username and password one time,
  and then we can keep them logged in. We do this by giving them a really long random string
  that the browser will pass back to us with every single request. The long random string is
  something the server can confirm, and then we know that we have the right user.

  You can see this string that gets passed back and forth in the
  `application` ->  `storage` -> `cookies` section of the chrome debugger
*/

const serverSessionSecret = () => {
  const secret = process.env.SERVER_SESSION_SECRET;
  if (!secret || secret.length < 8 || secret === warnings.exampleBadSecret) {
    // Warning if user doesn't have a good secret
    console.error(warnings.badSecret);
    
    if (process.env.NODE_ENV === 'production') {
      throw new Error('Missing SERVER_SESSION_SECRET. Please set this in your .env file.');
    }
  }

  return secret || 'dev_secret_for_testing_only';
};

// Create session table if it doesn't exist
const createSessionTable = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS "session" (
        "sid" varchar NOT NULL COLLATE "default",
        "sess" json NOT NULL,
        "expire" timestamp(6) NOT NULL,
        CONSTRAINT "session_pkey" PRIMARY KEY ("sid")
      )
    `);
    await pool.query(`
      CREATE INDEX IF NOT EXISTS "IDX_session_expire" ON "session" ("expire")
    `);
    console.log('Session table verified/created successfully');
  } catch (error) {
    console.error('Error creating session table:', error);
    throw error;
  }
};

// Configure session store
const sessionStore = new PgSession({
  pool,
  createTableIfMissing: true,
  tableName: 'session',
  pruneSessionInterval: process.env.NODE_ENV === 'test' ? false : 60 * 60
});

// Handle session store errors
sessionStore.on('error', (error) => {
  console.error('Session store error:', error);
});

// Create session table before exporting middleware
createSessionTable().catch(error => {
  console.error('Failed to create session table:', error);
  process.exit(1);
});

// Export session middleware
module.exports = expressSession({
  store: sessionStore,
  secret: serverSessionSecret(),
  name: 'user', // this is the name of the req.variable. 'user' is convention
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  }
});