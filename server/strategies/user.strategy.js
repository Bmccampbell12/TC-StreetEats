const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const encryptLib = require('../modules/encryption');
const pool = require('../modules/pool');

passport.serializeUser((user, done) => {
  console.log('Serializing user:', user.id);
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  console.log('Deserializing user:', id);
  pool
    .query('SELECT * FROM "users" WHERE id = $1', [id])
    .then((result) => {
      const user = result && result.rows && result.rows[0];
      if (user) {
        delete user.password;
        console.log('Found user:', user.username);
        done(null, user);
      } else {
        console.log('User not found in deserialize');
        done(null, null);
      }
    })
    .catch((error) => {
      console.error('Error in deserializeUser:', error);
      done(error, null);
    });
});

passport.use(
  'local',
  new LocalStrategy(
    {
      usernameField: 'username',
      passwordField: 'password',
      passReqToCallback: true
    },
    async (req, username, password, done) => {
      console.log('Starting authentication for user:', username);
      console.log('Request body:', req.body);
      
      try {
        const result = await pool.query('SELECT * FROM "users" WHERE username = $1', [username]);
        console.log('Database query result:', result.rows.length ? 'User found' : 'No user found');
        
        const user = result && result.rows && result.rows[0];
        
        if (!user) {
          console.log('No user found with username:', username);
          return done(null, false, { message: 'Incorrect username or password' });
        }

        // If role is specified, verify it matches
        if (req.body.role && user.role !== req.body.role) {
          console.log('Role mismatch. Expected:', req.body.role, 'Got:', user.role);
          return done(null, false, { message: 'Invalid role for this user' });
        }

        // Verify password
        const isValidPassword = encryptLib.comparePassword(password, user.password);
        console.log('Password validation result:', isValidPassword);

        if (!isValidPassword) {
          console.log('Invalid password for user:', username);
          return done(null, false, { message: 'Incorrect username or password' });
        }

        // Remove password before sending to client
        delete user.password;
        console.log('Authentication successful for user:', username);
        return done(null, user);
      } catch (error) {
        console.error('Error in local strategy:', error);
        console.error('Stack trace:', error.stack);
        return done(error);
      }
    }
  )
);

module.exports = passport;