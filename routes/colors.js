const express = require('express');
const router = express.Router();
const pool = require('../db');
const asyncHandler = require('../asyncHandler');

// Colors list
router.get('/colors', asyncHandler(async (req, res) => {
  const colors = await pool.query('SELECT ColorID, ColorName FROM OPC_Color ORDER BY ColorID DESC');
  res.render('colors/index', {
    colors,
    title: 'الألوان',
    header: 'إدارة الألوان'
  });
}));

// New color form
router.get('/colors/new', asyncHandler(async (req, res) => {
  res.render('colors/new', {
    title: 'إضافة لون',
    header: 'إضافة لون'
  });
}));

// Create color
router.post('/colors', asyncHandler(async (req, res) => {
  const { ColorName } = req.body;
  await pool.query('INSERT INTO OPC_Color (ColorName) VALUES (?)', [ColorName]);
  res.redirect('/nagl/colors');
}));

// Edit color form
router.get('/colors/:id/edit', asyncHandler(async (req, res) => {
  const { id } = req.params;
  const rows = await pool.query('SELECT ColorID, ColorName FROM OPC_Color WHERE ColorID = ?', [id]);
  const color = rows[0];
  if (!color) return res.redirect('/nagl/colors');
  res.render('colors/edit', {
    color,
    title: 'تعديل لون',
    header: 'تعديل لون'
  });
}));

// Update color
router.post('/colors/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { ColorName } = req.body;
  await pool.query('UPDATE OPC_Color SET ColorName = ? WHERE ColorID = ?', [ColorName, id]);
  res.redirect('/nagl/colors');
}));

// Delete color
router.post('/colors/:id/delete', asyncHandler(async (req, res) => {
  const { id } = req.params;
  await pool.query('DELETE FROM OPC_Color WHERE ColorID = ?', [id]);
  res.redirect('/nagl/colors');
}));

module.exports = router;
