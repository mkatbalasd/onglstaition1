const express = require('express');
const router = express.Router();
const pool = require('../db');

// Vehicles list
router.get('/vehicles', async (req, res) => {
  const vehicles = await pool.query(
    'SELECT v.ID, v.PlateNumber, v.SerialNumber, f.Name FROM OPC_Vehicle v LEFT JOIN OPC_Facility f ON v.FacilityID = f.FacilityID ORDER BY v.ID DESC'
  );
  res.render('vehicles/index', {
    vehicles,
    title: 'المركبات',
    header: 'إدارة المركبات'
  });
});

// New vehicle form
router.get('/vehicles/new', async (req, res) => {
  const facilities = await pool.query('SELECT FacilityID, Name FROM OPC_Facility');
  res.render('vehicles/new', {
    facilities,
    facilityId: req.query.facilityId || '',
    title: 'إضافة مركبة',
    header: 'إضافة مركبة'
  });
});

// Create vehicle
router.post('/vehicles', async (req, res) => {
  const { FacilityID, PlateNumber, SerialNumber } = req.body;
  await pool.query(
    'INSERT INTO OPC_Vehicle (FacilityID, PlateNumber, SerialNumber) VALUES (?, ?, ?)',
    [FacilityID || null, PlateNumber, SerialNumber]
  );
  res.redirect('/nagl/vehicles');
});

// API vehicles
router.get('/api/vehicles', async (req, res) => {
  const { facilityId } = req.query;
  const vehicles = facilityId
    ? await pool.query('SELECT ID, PlateNumber, SerialNumber FROM OPC_Vehicle WHERE FacilityID = ?', [facilityId])
    : await pool.query('SELECT ID, PlateNumber, SerialNumber FROM OPC_Vehicle');
  res.json(vehicles);
});

router.post('/api/vehicles', async (req, res) => {
  const { FacilityID, PlateNumber, SerialNumber } = req.body;
  const result = await pool.query(
    'INSERT INTO OPC_Vehicle (FacilityID, PlateNumber, SerialNumber) VALUES (?, ?, ?)',
    [FacilityID || null, PlateNumber, SerialNumber]
  );
  const ID = result.insertId;
  res.json({ ID, PlateNumber, SerialNumber });
});

module.exports = router;
