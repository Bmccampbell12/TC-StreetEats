const pg = require('pg');
const url = require('url');

let config = {};

if (process.env.DATABASE_URL) {
  // Parse the connection string
  const params = url.parse(process.env.DATABASE_URL);
  const auth = params.auth ? params.auth.split(':') : [];

  config = {
    user: auth[0],
    password: auth[1],
    host: params.hostname,
    port: params.port,
    database: params.pathname.split('/')[1],
    ssl: { rejectUnauthorized: false },
    max: 10, // max number of clients in the pool
    idleTimeoutMillis: 30000, // how long a client is allowed to remain idle before being closed
  };

  console.log('Using DATABASE_URL configuration');
} else {
  // Ensure all required environment variables are present
  const requiredEnvVars = ['DB_USER', 'DB_PASSWORD', 'DB_NAME'];
  const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);
  
  if (missingEnvVars.length > 0) {
    console.error('Missing required environment variables:', missingEnvVars.join(', '));
    process.exit(1);
  }

  config = {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'street_eats',
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    max: 10,
    idleTimeoutMillis: 30000,
  };

  console.log('Using local database configuration');
}

// Create the pool instance
const pool = new pg.Pool(config);

// Log successful connection
pool.on('connect', (client) => {
  console.log('Connected to the database:', config.database);
  
  // Test the connection by running a simple query
  client.query('SELECT NOW()')
    .then(() => {
      console.log('Database connection test successful');
    })
    .catch(err => {
      console.error('Database connection test failed:', err.message);
      // Don't exit here as the connection might recover
    });
});

// Handle errors
pool.on('error', (err, client) => {
  console.error('Unexpected error on idle client:', err.message);
  console.error('Error stack:', err.stack);
  
  if (err.code === 'PROTOCOL_CONNECTION_LOST') {
    console.error('Database connection was closed.');
  }
  if (err.code === 'ER_CON_COUNT_ERROR') {
    console.error('Database has too many connections.');
  }
  if (err.code === 'ECONNREFUSED') {
    console.error('Database connection was refused.');
  }
  
  // Only exit on critical errors
  if (err.severity === 'FATAL' || err.code === 'ECONNREFUSED') {
    process.exit(-1);
  }
});

// Add connection verification method
pool.verify = async () => {
  let client;
  try {
    client = await pool.connect();
    await client.query('SELECT 1'); // Simple query to test connection
    return true;
  } catch (err) {
    console.error('Database verification failed:', err.message);
    return false;
  } finally {
    if (client) client.release();
  }
};

// Export the pool instance
module.exports = pool;