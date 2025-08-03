const express = require('express');
const router = express.Router();
const pool = require('../db');
const asyncHandler = require('../asyncHandler');

// List suppliers
router.get('/suppliers', asyncHandler(async (req, res) => {
  const suppliers = await pool.query('SELECT id, name FROM Supplier ORDER BY id DESC');
  res.render('suppliers/index', {
    suppliers,
    title: 'الموردون',
    header: 'إدارة الموردين'
  });
}));

// New supplier form
router.get('/suppliers/new', asyncHandler(async (req, res) => {
  res.render('suppliers/new', {
    title: 'إضافة مورد',
    header: 'إضافة مورد'
  });
}));

// Create supplier
router.post('/suppliers', asyncHandler(async (req, res) => {
  const { name } = req.body;
  await pool.query('INSERT INTO Supplier (name) VALUES (?)', [name]);
  res.redirect('/nagl/suppliers');
}));

// Edit supplier form
router.get('/suppliers/:id/edit', asyncHandler(async (req, res) => {
  const { id } = req.params;
  const rows = await pool.query('SELECT id, name FROM Supplier WHERE id = ?', [id]);
  const supplier = rows[0];
  if (!supplier) return res.redirect('/nagl/suppliers');
  res.render('suppliers/edit', {
    supplier,
    title: 'تعديل مورد',
    header: 'تعديل مورد'
  });
}));

// Update supplier
router.post('/suppliers/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  await pool.query('UPDATE Supplier SET name = ? WHERE id = ?', [name, id]);
  res.redirect('/nagl/suppliers');
}));

module.exports = router;
