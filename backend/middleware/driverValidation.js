const pool = require('../db');

async function checkUniqueIdentity(req, res, next) {
  try {
    const { identityNumber } = req.body;
    if (!identityNumber) {
      return res.status(400).json({ error: 'identityNumber is required' });
    }
    const [rows] = await pool.query(
      'SELECT COUNT(*) as count FROM driver WHERE identityNumber = ?',
      [identityNumber]
    );
    if (rows[0].count > 0) {
      return res.status(400).json({ error: 'Identity number must be unique' });
    }
    next();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { checkUniqueIdentity };
