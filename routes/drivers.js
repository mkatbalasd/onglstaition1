const express = require('express');
const router = express.Router();
const { pool } = require('../db');

router.get('/drivers', async (req, res) => {
  const drivers = await pool.query(
    'SELECT d.DriverID, d.FirstName, d.LastName, d.IdentityNumber, f.Name AS FacilityName FROM OPC_Driver d LEFT JOIN OPC_Facility f ON d.FacilityID = f.FacilityID ORDER BY d.DriverID DESC'
  );
  res.render('drivers/index', {
    drivers,
    title: 'السائقون',
    header: 'إدارة السائقين'
  });
});

router.get('/drivers/new', async (req, res) => {
  const facilities = await pool.query('SELECT FacilityID, Name FROM OPC_Facility');
  res.render('drivers/new', {
    facilities,
    facilityId: req.query.facilityId || '',
    identity: req.query.identity || '',
    next: req.query.next || '',
    title: 'إضافة سائق',
    header: 'إضافة سائق'
  });
});

router.post('/drivers', async (req, res) => {
  const { FacilityID, IdentityNumber, FirstName, LastName, next } = req.body;
  const result = await pool.query(
    'INSERT INTO OPC_Driver (FacilityID, IdentityNumber, FirstName, LastName) VALUES (?, ?, ?, ?)',
    [FacilityID, IdentityNumber, FirstName, LastName]
  );
  const id = result.insertId;
  const redirectTo = next ? `${next}/${id}` : '/nagl/drivers';
  res.redirect(redirectTo);
});

module.exports = router;
