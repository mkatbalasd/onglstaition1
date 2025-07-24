const pool = require('../db');

async function generateCardNumber(prefix) {
  let unique = false;
  let cardNumber;
  while (!unique) {
    const random = Math.floor(100000 + Math.random() * 900000); // six digits
    cardNumber = `${prefix}${random}`;

    // Ensure the generated number is not already present in OPC_Card
    const query =
      'SELECT COUNT(*) AS count FROM OPC_Card WHERE CardNumber = ?';
    const [rows] = await pool.query(query, [cardNumber]);
    if (rows[0].count === 0) {
      unique = true;
    }
  }
  return cardNumber;
}

module.exports = generateCardNumber;
