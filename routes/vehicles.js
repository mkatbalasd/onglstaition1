const express = require('express');
const router = express.Router();
const { pool } = require('../db');

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

router.get('/vehicles/new', async (req, res) => {
  const facilities = await pool.query('SELECT FacilityID, Name FROM OPC_Facility');
  res.render('vehicles/new', {
    facilities,
    facilityId: req.query.facilityId || '',
    title: 'إضافة مركبة',
    header: 'إضافة مركبة'
  });
});

router.post('/vehicles', async (req, res) => {
  const { FacilityID, PlateNumber, SerialNumber } = req.body;
  await pool.query(
    'INSERT INTO OPC_Vehicle (FacilityID, PlateNumber, SerialNumber) VALUES (?, ?, ?)',
    [FacilityID || null, PlateNumber, SerialNumber]
  );
  res.redirect('/nagl/vehicles');
});

module.exports = router;
