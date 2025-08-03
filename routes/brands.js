const express = require('express');
const router = express.Router();
const pool = require('../db');
const asyncHandler = require('../asyncHandler');

// Brands list
router.get('/brands', asyncHandler(async (req, res) => {
  const brands = await pool.query('SELECT BrandID, BrandName FROM OPC_Brand ORDER BY BrandID DESC');
  res.render('brands/index', {
    brands,
    title: 'الماركات',
    header: 'إدارة الماركات'
  });
}));

// New brand form
router.get('/brands/new', asyncHandler(async (req, res) => {
  res.render('brands/new', {
    title: 'إضافة ماركة',
    header: 'إضافة ماركة'
  });
}));

// Create brand
router.post('/brands', asyncHandler(async (req, res) => {
  const { BrandName } = req.body;
  await pool.query('INSERT INTO OPC_Brand (BrandName) VALUES (?)', [BrandName]);
  res.redirect('/nagl/brands');
}));

// Edit brand form
router.get('/brands/:id/edit', asyncHandler(async (req, res) => {
  const { id } = req.params;
  const rows = await pool.query('SELECT BrandID, BrandName FROM OPC_Brand WHERE BrandID = ?', [id]);
  const brand = rows[0];
  if (!brand) return res.redirect('/nagl/brands');
  res.render('brands/edit', {
    brand,
    title: 'تعديل ماركة',
    header: 'تعديل ماركة'
  });
}));

// Update brand
router.post('/brands/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { BrandName } = req.body;
  await pool.query('UPDATE OPC_Brand SET BrandName = ? WHERE BrandID = ?', [BrandName, id]);
  res.redirect('/nagl/brands');
}));

// Delete brand
router.post('/brands/:id/delete', asyncHandler(async (req, res) => {
  const { id } = req.params;
  await pool.query('DELETE FROM OPC_Brand WHERE BrandID = ?', [id]);
  res.redirect('/nagl/brands');
}));

module.exports = router;
