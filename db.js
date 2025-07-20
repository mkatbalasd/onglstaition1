const mariadb = require('mariadb');
require('dotenv').config();

const pool = mariadb.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'test',
  connectionLimit: 5
});

async function generateCardNumber(table, facilityId) {
  const rows = await pool.query(
    'SELECT LicenseNumber FROM OPC_Facility WHERE FacilityID = ?',
    [facilityId]
  );
  const facility = rows[0];
  let prefix = '33.00';
  if (facility && facility.LicenseNumber) {
    prefix = facility.LicenseNumber.slice(0, 5);
  }
  let cardNumber = '';
  let exists = true;
  while (exists) {
    const random = Math.floor(100000 + Math.random() * 900000);
    cardNumber = `${prefix}${random}`;
    const rowsCheck = await pool.query(
      `SELECT 1 FROM ${table} WHERE CardNumber = ? LIMIT 1`,
      [cardNumber]
    );
    exists = rowsCheck.length > 0;
  }
  return cardNumber;
}

module.exports = { pool, generateCardNumber };
