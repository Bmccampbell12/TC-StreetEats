const pg = require('pg');
let pool;

// When our app is deployed to the internet 
// we'll use the DATABASE_URL environment variable
// to set the connection info: web address, username/password, db name
// eg: 
  //DATABASE_URL=postgresql://brucemccampbell:zd_NYUA8xamsRTV4%26ED%2BB2.db.com/street_eats

if (process.env.DATABASE_URL) {
    pool = new pg.Pool({
        connectionString: process.env.DATABASE_URL,
        
        ssl: {
            rejectUnauthorized: false},
        connectionTimeoutMillis: 20000, // 10 second timeout
        idleTimeoutMillis: 30000  // 30 second idle timeout
    });
}
// When we're running this app on our own computer
// we'll connect to the postgres database that is 
// also running on our computer (localhost)
else {
    pool = new pg.Pool({
        host: 'localhost',
        port: 5432,
        database: 'street_eats',
    });
}

module.exports = pool;
