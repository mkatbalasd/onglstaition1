const express = require('express');
const router = express.Router();
const { pool } = require('../db');

router.get('/facilities', async (req, res) => {
  const facilities = await pool.query(
    'SELECT FacilityID, Name, IdentityNumber, LicenseType FROM OPC_Facility ORDER BY FacilityID DESC'
  );
  res.render('facilities/index', {
    facilities,
    title: 'المنشآت',
    header: 'إدارة المنشآت'
  });
});

router.get('/facilities/new', (req, res) => {
  res.render('facilities/new', {
    identity: req.query.identity || '',
    next: req.query.next || '',
    title: 'إضافة منشأة',
    header: 'إضافة منشأة'
  });
});

router.post('/facilities', async (req, res) => {
  const { IdentityNumber, Name, EnglishName, next } = req.body;
  const result = await pool.query(
    'INSERT INTO OPC_Facility (IdentityNumber, Name, EnglishName) VALUES (?, ?, ?)',
    [IdentityNumber, Name, EnglishName || null]
  );
  const fid = result.insertId;
  const redirectTo = next ? `${next}/${fid}/driver` : '/nagl/facilities';
  res.redirect(redirectTo);
});

module.exports = router;
