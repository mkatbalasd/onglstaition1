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


// New driver form
router.get('/drivers/new', asyncHandler(async (req, res) => {
  const facilities = await pool.query('SELECT FacilityID, Name FROM OPC_Facility ORDER BY FacilityID DESC');
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
  if (!IdentityNumber) {
    return res.status(400).send('رقم الهوية مطلوب');
  }
  const result = await pool.query(
    'INSERT INTO OPC_Driver (FacilityID, IdentityNumber, FirstName, LastName) VALUES (?, ?, ?, ?)',
    [FacilityID, IdentityNumber, FirstName, LastName]
  );
  const id = result.insertId;
  const redirectTo = next ? `${next}/${id}` : '/nagl/drivers';
  res.redirect(redirectTo);
}));

// Edit driver form
router.get('/drivers/:id/edit', asyncHandler(async (req, res) => {
  const { id } = req.params;
  const rows = await pool.query(
    'SELECT DriverID, FacilityID, IdentityNumber, FirstName, LastName FROM OPC_Driver WHERE DriverID = ?',
    [id]
  );
  const driver = rows[0];
  if (!driver) return res.redirect('/nagl/drivers');
  const facilities = await pool.query('SELECT FacilityID, Name FROM OPC_Facility ORDER BY FacilityID DESC');
  res.render('drivers/edit', {
    driver,
    facilities,
    title: 'تعديل سائق',
    header: 'تعديل سائق'
  });
}));

// Update driver
router.post('/drivers/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { FacilityID, IdentityNumber, FirstName, LastName } = req.body;
  await pool.query(
    'UPDATE OPC_Driver SET FacilityID = ?, IdentityNumber = ?, FirstName = ?, LastName = ? WHERE DriverID = ?',
    [FacilityID || null, IdentityNumber, FirstName, LastName, id]
  );
  res.redirect('/nagl/drivers');
}));

// Delete driver
router.post('/drivers/:id/delete', asyncHandler(async (req, res) => {
  const { id } = req.params;
  await pool.query('DELETE FROM OPC_Driver WHERE DriverID = ?', [id]);
  res.redirect('/nagl/drivers');
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

// API drivers
router.get('/api/drivers', asyncHandler(async (req, res) => {
  const { facilityId } = req.query;
  const drivers = facilityId
    ? await pool.query('SELECT DriverID, FirstName, LastName, IdentityNumber FROM OPC_Driver WHERE FacilityID = ? ORDER BY DriverID DESC', [facilityId])
    : await pool.query('SELECT DriverID, FirstName, LastName, IdentityNumber FROM OPC_Driver ORDER BY DriverID DESC');
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
