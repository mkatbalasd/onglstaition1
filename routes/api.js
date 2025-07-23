const express = require('express');
const router = express.Router();
const { pool } = require('../db');
const { asyncHandler } = require('../middleware/errorHandler');

router.get(
  '/api/drivers',
  asyncHandler(async (req, res) => {
    const { facilityId } = req.query;
    const drivers = facilityId
      ? await pool.query('SELECT DriverID, FirstName, LastName, IdentityNumber FROM OPC_Driver WHERE FacilityID = ?', [facilityId])
      : await pool.query('SELECT DriverID, FirstName, LastName, IdentityNumber FROM OPC_Driver');
    res.json(drivers);
  })
);

router.post(
  '/api/drivers',
  asyncHandler(async (req, res) => {
    const { FacilityID, FirstName, LastName } = req.body;
    const result = await pool.query(
      'INSERT INTO OPC_Driver (FacilityID, FirstName, LastName) VALUES (?, ?, ?)',
      [FacilityID || null, FirstName, LastName]
    );
    const DriverID = result.insertId;
    res.json({ DriverID, FirstName, LastName, IdentityNumber: req.body.IdentityNumber || null });
  })
);

router.get(
  '/api/vehicles',
  asyncHandler(async (req, res) => {
    const { facilityId } = req.query;
    const vehicles = facilityId
      ? await pool.query('SELECT ID, PlateNumber, SerialNumber FROM OPC_Vehicle WHERE FacilityID = ?', [facilityId])
      : await pool.query('SELECT ID, PlateNumber, SerialNumber FROM OPC_Vehicle');
    res.json(vehicles);
  })
);

router.post(
  '/api/vehicles',
  asyncHandler(async (req, res) => {
    const { FacilityID, PlateNumber, SerialNumber } = req.body;
    const result = await pool.query(
      'INSERT INTO OPC_Vehicle (FacilityID, PlateNumber, SerialNumber) VALUES (?, ?, ?)',
      [FacilityID || null, PlateNumber, SerialNumber]
    );
    const ID = result.insertId;
    res.json({ ID, PlateNumber, SerialNumber });
  })
);

router.post(
  '/api/facilities',
  asyncHandler(async (req, res) => {
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
  })
);

router.get(
  '/api/license-types',
  asyncHandler(async (req, res) => {
    const rows = await pool.query('SELECT LicenseTypeNameAR, LicenseTypeNameEN FROM OPC_LicenseType');
    res.json(rows);
  })
);

router.post(
  '/api/license-types',
  asyncHandler(async (req, res) => {
    const { LicenseTypeNameAR, LicenseTypeNameEN } = req.body;
    const result = await pool.query(
      'INSERT INTO OPC_LicenseType (LicenseTypeNameAR, LicenseTypeNameEN) VALUES (?, ?)',
      [LicenseTypeNameAR, LicenseTypeNameEN || null]
    );
    const LicenseTypeID = result.insertId;
    res.json({ LicenseTypeID, LicenseTypeNameAR, LicenseTypeNameEN });
  })
);

module.exports = router;
