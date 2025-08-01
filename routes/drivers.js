const express = require('express');
const router = express.Router();
const pool = require('../db');
const asyncHandler = require('../asyncHandler');

// Drivers list
router.get('/drivers', asyncHandler(async (req, res) => {
  const drivers = await pool.query(
    'SELECT d.DriverID, d.FirstName, d.LastName, d.IdentityNumber, f.Name AS FacilityName FROM OPC_Driver d LEFT JOIN OPC_Facility f ON d.FacilityID = f.FacilityID ORDER BY d.DriverID DESC'
  );
  res.render('drivers/index', {
    drivers,
    title: 'السائقون',
    header: 'إدارة السائقين'
  });
}));

// Driver details
router.get('/drivers/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  const rows = await pool.query(
    'SELECT d.DriverID, d.FirstName, d.LastName, d.IdentityNumber, f.Name AS FacilityName FROM OPC_Driver d LEFT JOIN OPC_Facility f ON d.FacilityID = f.FacilityID WHERE d.DriverID = ?',
    [id]
  );
  const driver = rows[0];
  if (!driver) return res.redirect('/nagl/drivers');
  res.render('drivers/show', {
    driver,
    title: 'تفاصيل السائق',
    header: 'تفاصيل السائق'
  });
}));

// New driver form
router.get('/drivers/new', asyncHandler(async (req, res) => {
  const facilities = await pool.query('SELECT FacilityID, Name FROM OPC_Facility');
  res.render('drivers/new', {
    facilities,
    facilityId: req.query.facilityId || '',
    identity: req.query.identity || '',
    next: req.query.next || '',
    title: 'إضافة سائق',
    header: 'إضافة سائق'
  });
}));

// Create driver
router.post('/drivers', asyncHandler(async (req, res) => {
  const { FacilityID, IdentityNumber, FirstName, LastName, next } = req.body;
  const result = await pool.query(
    'INSERT INTO OPC_Driver (FacilityID, IdentityNumber, FirstName, LastName) VALUES (?, ?, ?, ?)',
    [FacilityID, IdentityNumber, FirstName, LastName]
  );
  const id = result.insertId;
  const redirectTo = next ? `${next}/${id}` : '/nagl/drivers';
  res.redirect(redirectTo);
}));

// API drivers
router.get('/api/drivers', asyncHandler(async (req, res) => {
  const { facilityId } = req.query;
  const drivers = facilityId
    ? await pool.query('SELECT DriverID, FirstName, LastName, IdentityNumber FROM OPC_Driver WHERE FacilityID = ?', [facilityId])
    : await pool.query('SELECT DriverID, FirstName, LastName, IdentityNumber FROM OPC_Driver');
  res.json(drivers);
}));

router.post('/api/drivers', asyncHandler(async (req, res) => {
  const { FacilityID, FirstName, LastName } = req.body;
  const result = await pool.query(
    'INSERT INTO OPC_Driver (FacilityID, FirstName, LastName) VALUES (?, ?, ?)',
    [FacilityID || null, FirstName, LastName]
  );
  const DriverID = result.insertId;
  res.json({ DriverID, FirstName, LastName, IdentityNumber: req.body.IdentityNumber || null });
}));

module.exports = router;
