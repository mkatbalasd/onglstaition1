const mariadb = require('mariadb');
require('dotenv').config();

let pool;
try {
  pool = mariadb.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'test',
    connectionLimit: parseInt(process.env.DB_POOL_LIMIT, 10) || 5,
    connectTimeout: parseInt(process.env.DB_CONNECT_TIMEOUT, 10) || 2000,
    acquireTimeout: parseInt(process.env.DB_ACQUIRE_TIMEOUT, 10) || 10000
  });
} catch (err) {
  console.error('Error creating database pool:', err);
  throw err;
}

const originalGetConnection = pool.getConnection.bind(pool);
pool.getConnection = async function (...args) {
  try {
    return await originalGetConnection(...args);
  } catch (err) {
    console.error('Error acquiring connection from pool:', err);
    throw err;
  }
};

pool.getConnection()
  .then((conn) => conn.release())
  .catch((err) => console.error('Error acquiring initial connection:', err));

module.exports = pool;
