const express = require('express');
const router = express.Router();
const { pool } = require('../db');

router.get('/facilities', async (req, res) => {
  try {
    const facilities = await pool.query(
      'SELECT FacilityID, Name, IdentityNumber, LicenseType FROM OPC_Facility ORDER BY FacilityID DESC'
    );
    res.render('facilities/index', {
      facilities,
      title: 'المنشآت',
      header: 'إدارة المنشآت'
    });
  } catch (err) {
    console.error('Error fetching facilities:', err);
    res.status(500).render('error', { message: 'Database error' });
  }
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
  try {
    const { IdentityNumber, Name, EnglishName, next } = req.body;
    const result = await pool.query(
      'INSERT INTO OPC_Facility (IdentityNumber, Name, EnglishName) VALUES (?, ?, ?)',
      [IdentityNumber, Name, EnglishName || null]
    );
    const fid = result.insertId;
    const redirectTo = next ? `${next}/${fid}/driver` : '/nagl/facilities';
    res.redirect(redirectTo);
  } catch (err) {
    console.error('Error creating facility:', err);
    res.status(500).render('error', { message: 'Database error' });
  }
});

module.exports = router;
