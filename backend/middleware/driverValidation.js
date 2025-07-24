const pool = require('../db');

async function checkUniqueIdentity(req, res, next) {
  try {
    const { IdentityNumber } = req.body;
    if (!IdentityNumber) {
      return res.status(400).json({ error: 'IdentityNumber is required' });
    }
    const [rows] = await pool.query(
      'SELECT COUNT(*) as count FROM OPC_Driver WHERE IdentityNumber = ?',
      [IdentityNumber]
    );
    if (rows[0].count > 0) {
      return res.status(400).json({ error: 'IdentityNumber must be unique' });
    }
    next();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { checkUniqueIdentity };
