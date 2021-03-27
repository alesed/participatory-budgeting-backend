require("dotenv").config();

const Pool = require("pg").Pool;

const pool = new Pool({
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  host: process.env.DATABASE_URL,
  port: process.env.DATABASE_PORT,
  database: process.env.DATABASE_NAME,
  ssl: process.env.SSL_ENABLE ? true : false,
});

module.exports = pool;
