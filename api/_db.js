const { Pool } = require("pg");

// Reused across warm invocations
const pool = global._pgPool || new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  max: 1,
});
global._pgPool = pool;

module.exports = pool;
