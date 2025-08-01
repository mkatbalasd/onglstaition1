const express = require('express');
const router = express.Router();
const pool = require('../db');
const asyncHandler = require('../asyncHandler');

// Facilities list
router.get('/facilities', asyncHandler(async (req, res) => {
  const facilities = await pool.query(
    'SELECT FacilityID, Name, IdentityNumber, LicenseType FROM OPC_Facility ORDER BY FacilityID DESC'
  );
  res.render('facilities/index', {
    facilities,
    title: 'المنشآت',
    header: 'إدارة المنشآت'
  });
}));

// New facility form
router.get('/facilities/new', (req, res) => {
  res.render('facilities/new', {
    identity: req.query.identity || '',
    next: req.query.next || '',
    title: 'إضافة منشأة',
    header: 'إضافة منشأة'
  });
});

// Create facility
router.post('/facilities', asyncHandler(async (req, res) => {
  const { IdentityNumber, Name, EnglishName, next } = req.body;
  const result = await pool.query(
    'INSERT INTO OPC_Facility (IdentityNumber, Name, EnglishName) VALUES (?, ?, ?)',
    [IdentityNumber, Name, EnglishName || null]
  );
  const fid = result.insertId;
  const redirectTo = next ? `${next}/${fid}/driver` : '/nagl/facilities';
  res.redirect(redirectTo);
}));

// API create facility
router.post('/api/facilities', asyncHandler(async (req, res) => {
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
}));

// API license types
router.get('/api/license-types', asyncHandler(async (req, res) => {
  const rows = await pool.query('SELECT LicenseTypeNameAR, LicenseTypeNameEN FROM OPC_LicenseType');
  res.json(rows);
}));

router.post('/api/license-types', asyncHandler(async (req, res) => {
  const { LicenseTypeNameAR, LicenseTypeNameEN } = req.body;
  const result = await pool.query(
    'INSERT INTO OPC_LicenseType (LicenseTypeNameAR, LicenseTypeNameEN) VALUES (?, ?)',
    [LicenseTypeNameAR, LicenseTypeNameEN || null]
  );
  const LicenseTypeID = result.insertId;
  res.json({ LicenseTypeID, LicenseTypeNameAR, LicenseTypeNameEN });
}));

module.exports = router;
