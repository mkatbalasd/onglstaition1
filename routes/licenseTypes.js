const express = require('express');
const router = express.Router();
const pool = require('../db');
const asyncHandler = require('../asyncHandler');
const { loadLicenseTypes } = require('../licenseCache');

// License types list
router.get('/license-types', asyncHandler(async (req, res) => {
  const licenseTypes = await pool.query('SELECT LicenseTypeID, LicenseTypeNameAR, LicenseTypeNameEN FROM OPC_LicenseType ORDER BY LicenseTypeID DESC');
  res.render('licenseTypes/index', {
    licenseTypes,
    title: 'أنواع التراخيص',
    header: 'إدارة أنواع التراخيص'
  });
}));

// New license type form
router.get('/license-types/new', asyncHandler(async (req, res) => {
  res.render('licenseTypes/new', {
    title: 'إضافة نوع ترخيص',
    header: 'إضافة نوع ترخيص'
  });
}));

// Create license type
router.post('/license-types', asyncHandler(async (req, res) => {
  const { LicenseTypeNameAR, LicenseTypeNameEN } = req.body;
  await pool.query('INSERT INTO OPC_LicenseType (LicenseTypeNameAR, LicenseTypeNameEN) VALUES (?, ?)', [LicenseTypeNameAR, LicenseTypeNameEN || null]);
  await loadLicenseTypes();
  res.redirect('/nagl/license-types');
}));

// Edit license type form
router.get('/license-types/:id/edit', asyncHandler(async (req, res) => {
  const { id } = req.params;
  const rows = await pool.query('SELECT LicenseTypeID, LicenseTypeNameAR, LicenseTypeNameEN FROM OPC_LicenseType WHERE LicenseTypeID = ?', [id]);
  const licenseType = rows[0];
  if (!licenseType) return res.redirect('/nagl/license-types');
  res.render('licenseTypes/edit', {
    licenseType,
    title: 'تعديل نوع ترخيص',
    header: 'تعديل نوع ترخيص'
  });
}));

// Update license type
router.post('/license-types/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { LicenseTypeNameAR, LicenseTypeNameEN } = req.body;
  await pool.query('UPDATE OPC_LicenseType SET LicenseTypeNameAR = ?, LicenseTypeNameEN = ? WHERE LicenseTypeID = ?', [LicenseTypeNameAR, LicenseTypeNameEN || null, id]);
  await loadLicenseTypes();
  res.redirect('/nagl/license-types');
}));

module.exports = router;
