const express = require('express');
const router = express.Router();
const { pool } = require('../db');

router.get('/api/drivers', async (req, res) => {
  try {
    const { facilityId } = req.query;
    const drivers = facilityId
      ? await pool.query('SELECT DriverID, FirstName, LastName, IdentityNumber FROM OPC_Driver WHERE FacilityID = ?', [facilityId])
      : await pool.query('SELECT DriverID, FirstName, LastName, IdentityNumber FROM OPC_Driver');
    res.json(drivers);
  } catch (err) {
    console.error('Error fetching drivers:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

router.post('/api/drivers', async (req, res) => {
  try {
    const { FacilityID, FirstName, LastName } = req.body;
    const result = await pool.query(
      'INSERT INTO OPC_Driver (FacilityID, FirstName, LastName) VALUES (?, ?, ?)',
      [FacilityID || null, FirstName, LastName]
    );
    const DriverID = result.insertId;
    res.json({ DriverID, FirstName, LastName, IdentityNumber: req.body.IdentityNumber || null });
  } catch (err) {
    console.error('Error creating driver:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

router.get('/api/vehicles', async (req, res) => {
  try {
    const { facilityId } = req.query;
    const vehicles = facilityId
      ? await pool.query('SELECT ID, PlateNumber, SerialNumber FROM OPC_Vehicle WHERE FacilityID = ?', [facilityId])
      : await pool.query('SELECT ID, PlateNumber, SerialNumber FROM OPC_Vehicle');
    res.json(vehicles);
  } catch (err) {
    console.error('Error fetching vehicles:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

router.post('/api/vehicles', async (req, res) => {
  try {
    const { FacilityID, PlateNumber, SerialNumber } = req.body;
    const result = await pool.query(
      'INSERT INTO OPC_Vehicle (FacilityID, PlateNumber, SerialNumber) VALUES (?, ?, ?)',
      [FacilityID || null, PlateNumber, SerialNumber]
    );
    const ID = result.insertId;
    res.json({ ID, PlateNumber, SerialNumber });
  } catch (err) {
    console.error('Error creating vehicle:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

router.post('/api/facilities', async (req, res) => {
  try {
    const {
      Name,
      EnglishName,
      IdentityNumber,
      LicenseNumber,
      LicenseType,
      LicenseIssueDate,
      LicenseExpirationDate,
      LicenseCity,
      LicenseCityEn
    } = req.body;
    const result = await pool.query(
      'INSERT INTO OPC_Facility (Name, EnglishName, IdentityNumber, LicenseNumber, LicenseType, LicenseIssueDate, LicenseExpirationDate, LicenseCity, LicenseCityEn) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [
        Name,
        EnglishName || null,
        IdentityNumber,
        LicenseNumber || null,
        LicenseType || null,
        LicenseIssueDate || null,
        LicenseExpirationDate || null,
        LicenseCity || null,
        LicenseCityEn || null
      ]
    );
    const FacilityID = result.insertId;
    res.json({ FacilityID, Name, IdentityNumber, LicenseType });
  } catch (err) {
    console.error('Error creating facility:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

router.get('/api/license-types', async (req, res) => {
  try {
    const rows = await pool.query('SELECT LicenseTypeNameAR, LicenseTypeNameEN FROM OPC_LicenseType');
    res.json(rows);
  } catch (err) {
    console.error('Error fetching license types:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

router.post('/api/license-types', async (req, res) => {
  try {
    const { LicenseTypeNameAR, LicenseTypeNameEN } = req.body;
    const result = await pool.query(
      'INSERT INTO OPC_LicenseType (LicenseTypeNameAR, LicenseTypeNameEN) VALUES (?, ?)',
      [LicenseTypeNameAR, LicenseTypeNameEN || null]
    );
    const LicenseTypeID = result.insertId;
    res.json({ LicenseTypeID, LicenseTypeNameAR, LicenseTypeNameEN });
  } catch (err) {
    console.error('Error creating license type:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

module.exports = router;
