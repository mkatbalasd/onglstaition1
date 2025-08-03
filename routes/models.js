const express = require('express');
const router = express.Router();
const pool = require('../db');
const asyncHandler = require('../asyncHandler');

// Models list
router.get('/models', asyncHandler(async (req, res) => {
  const models = await pool.query('SELECT ModelID, ModelName FROM OPC_Model ORDER BY ModelID DESC');
  res.render('models/index', {
    models,
    title: 'الموديلات',
    header: 'إدارة الموديلات'
  });
}));

// New model form
router.get('/models/new', asyncHandler(async (req, res) => {
  const brands = await pool.query('SELECT BrandID, BrandName FROM OPC_Brand ORDER BY BrandID DESC');
  res.render('models/new', {
    brands,
    title: 'إضافة موديل',
    header: 'إضافة موديل'
  });
}));

// Create model
router.post('/models', asyncHandler(async (req, res) => {
  const { BrandID, ModelName } = req.body;
  await pool.query('INSERT INTO OPC_Model (BrandID, ModelName) VALUES (?, ?)', [BrandID || null, ModelName]);
  res.redirect('/nagl/models');
}));

// Edit model form
router.get('/models/:id/edit', asyncHandler(async (req, res) => {
  const { id } = req.params;
  const rows = await pool.query('SELECT ModelID, BrandID, ModelName FROM OPC_Model WHERE ModelID = ?', [id]);
  const model = rows[0];
  if (!model) return res.redirect('/nagl/models');
  const brands = await pool.query('SELECT BrandID, BrandName FROM OPC_Brand ORDER BY BrandID DESC');
  res.render('models/edit', {
    model,
    brands,
    title: 'تعديل موديل',
    header: 'تعديل موديل'
  });
}));

// Update model
router.post('/models/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { BrandID, ModelName } = req.body;
  await pool.query('UPDATE OPC_Model SET BrandID = ?, ModelName = ? WHERE ModelID = ?', [BrandID || null, ModelName, id]);
  res.redirect('/nagl/models');
}));

// Delete model
router.post('/models/:id/delete', asyncHandler(async (req, res) => {
  const { id } = req.params;
  await pool.query('DELETE FROM OPC_Model WHERE ModelID = ?', [id]);
  res.redirect('/nagl/models');
}));

module.exports = router;
