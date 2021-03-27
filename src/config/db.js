require("dotenv").config();

const Pool = require("pg").Pool;

let pool;

if (process.env.SSL_ENABLE) {
  // dev mode
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: true,
  });
} else {
  // production mode
  pool = new Pool({
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    host: process.env.DATABASE_URL,
    port: process.env.DATABASE_PORT,
    database: process.env.DATABASE_NAME,
    ssl: false,
  });
}

module.exports = pool;
