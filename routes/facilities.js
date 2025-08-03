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
router.get('/facilities/new', asyncHandler(async (req, res) => {
  const licenseTypes = await pool.query(
    'SELECT LicenseTypeID, LicenseTypeNameAR FROM OPC_LicenseType ORDER BY LicenseTypeID DESC'
  );
  res.render('facilities/new', {
    identity: req.query.identity || '',
    next: req.query.next || '',
    licenseTypes,
    title: 'إضافة منشأة',
    header: 'إضافة منشأة'
  });
}));

// Edit facility form
router.get('/facilities/:id/edit', asyncHandler(async (req, res) => {
  const { id } = req.params;
  const facilityRows = await pool.query(
    'SELECT FacilityID, IdentityNumber, Name, EnglishName, LicenseNumber, LicenseTypeID, LicenseType, LicenseCity, LicenseCityEn, LicenseIssueDate, LicenseExpirationDate FROM OPC_Facility WHERE FacilityID = ?',
    [id]
  );
  if (facilityRows.length === 0) {
    return res.status(404).send('Facility not found');
  }
  const licenseTypes = await pool.query(
    'SELECT LicenseTypeID, LicenseTypeNameAR FROM OPC_LicenseType ORDER BY LicenseTypeID DESC'
  );
  res.render('facilities/edit', {
    facility: facilityRows[0],
    licenseTypes,
    title: 'تعديل منشأة',
    header: 'تعديل منشأة'
  });
}));

// Create facility
router.post('/facilities', asyncHandler(async (req, res) => {
  const {
    IdentityNumber,
    Name,
    EnglishName,
    LicenseNumber,
    LicenseTypeID,
    LicenseType,
    LicenseCity,
    LicenseCityEn,
    LicenseIssueDate,
    LicenseExpirationDate,
    next
  } = req.body;
  const result = await pool.query(
    'INSERT INTO OPC_Facility (IdentityNumber, Name, EnglishName, LicenseNumber, LicenseTypeID, LicenseType, LicenseCity, LicenseCityEn, LicenseIssueDate, LicenseExpirationDate) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [
      IdentityNumber,
      Name,
      EnglishName || null,
      LicenseNumber || null,
      LicenseTypeID || null,
      LicenseType || null,
      LicenseCity || null,
      LicenseCityEn || null,
      LicenseIssueDate || null,
      LicenseExpirationDate || null
    ]
  );
  const fid = result.insertId;
  const redirectTo = next ? `${next}/${fid}/vehicle` : '/nagl/facilities';
  res.redirect(redirectTo);
}));

// Update facility
router.post('/facilities/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  const {
    IdentityNumber,
    Name,
    EnglishName,
    LicenseNumber,
    LicenseTypeID,
    LicenseType,
    LicenseCity,
    LicenseCityEn,
    LicenseIssueDate,
    LicenseExpirationDate
  } = req.body;
  await pool.query(
    'UPDATE OPC_Facility SET IdentityNumber = ?, Name = ?, EnglishName = ?, LicenseNumber = ?, LicenseTypeID = ?, LicenseType = ?, LicenseCity = ?, LicenseCityEn = ?, LicenseIssueDate = ?, LicenseExpirationDate = ? WHERE FacilityID = ?',
    [
      IdentityNumber,
      Name,
      EnglishName || null,
      LicenseNumber || null,
      LicenseTypeID || null,
      LicenseType || null,
      LicenseCity || null,
      LicenseCityEn || null,
      LicenseIssueDate || null,
      LicenseExpirationDate || null,
      id
    ]
  );
  res.redirect('/nagl/facilities');
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
  const rows = await pool.query('SELECT LicenseTypeNameAR, LicenseTypeNameEN FROM OPC_LicenseType ORDER BY LicenseTypeID DESC');
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
