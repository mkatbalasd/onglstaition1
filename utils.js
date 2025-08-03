const pool = require('./db');

async function generateCardNumber(table, facilityId) {
  const rows = await pool.query(
    'SELECT LicenseNumber FROM OPC_Facility WHERE FacilityID = ?',
    [facilityId]
  );
  const facility = rows[0];
  let prefix = '54-00';
  if (facility && facility.LicenseNumber) {
    prefix = facility.LicenseNumber.slice(0, 5);
  }
  let cardNumber = '';
  let exists = true;
  while (exists) {
    const random = Math.floor(100000 + Math.random() * 900000);
    cardNumber = `${prefix}${random}`;
    const allowedTables = ['OPC_DriverCard', 'OPC_Card'];
    if (!allowedTables.includes(table)) {
      throw new Error('Invalid table name');
    }
    const rowsCheck = await pool.query(
      `SELECT 1 FROM ${table} WHERE CardNumber = ? LIMIT 1`,
      [cardNumber]
    );
    exists = rowsCheck.length > 0;
  }
  return cardNumber;
}

module.exports = {
  generateCardNumber
};
