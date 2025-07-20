const express = require('express');
const router = express.Router();
const { pool, generateCardNumber } = require('../db');

router.get('/cards', async (req, res) => {
  const cards = await pool.query(
    'SELECT c.ID, c.CardNumber, v.PlateNumber, f.Name, c.IssueDate, c.ExpirationDate, s.name AS SupplierName FROM OPC_Card c LEFT JOIN OPC_Vehicle v ON c.VehicleID = v.ID LEFT JOIN OPC_Facility f ON c.FacilityID = f.FacilityID LEFT JOIN Supplier s ON c.Supplier = s.id'
  );
  res.render('cards/index', {
    cards,
    title: 'كروت التشغيل',
    header: 'إدارة كروت التشغيل'
  });
});

router.get('/cards/new', async (req, res) => {
  const facilities = await pool.query('SELECT FacilityID, Name, IdentityNumber, LicenseType, LicenseNumber FROM OPC_Facility');
  const suppliers = await pool.query('SELECT id, name FROM Supplier');
  const vehicles = await pool.query('SELECT ID, PlateNumber, SerialNumber, FacilityID FROM OPC_Vehicle');
  const licenseTypes = await pool.query('SELECT LicenseTypeNameAR FROM OPC_LicenseType');
  res.render('cards/new', {
    facilities,
    suppliers,
    vehicles,
    licenseTypes,
    title: 'إضافة كرت تشغيل',
    header: 'إضافة كرت تشغيل'
  });
});

router.post('/cards', async (req, res) => {
  const {
    FacilityID,
    VehicleID,
    IssueDate,
    ExpirationDate,
    RenewalDate,
    Supplier
  } = req.body;
  const CardNumber = await generateCardNumber('OPC_Card', FacilityID);
  const today = new Date().toISOString().slice(0, 10);
  await pool.query(
    'INSERT INTO OPC_Card (CardNumber, FacilityID, VehicleID, IssueDate, ExpirationDate, RenewalDate, Supplier, addingDate, LastUpdate) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [CardNumber, FacilityID, VehicleID, IssueDate, ExpirationDate, RenewalDate || null, Supplier, today, today]
  );
  res.redirect('/nagl/cards');
});

router.get('/cards/:id/edit', async (req, res) => {
  const { id } = req.params;
  const cardRows = await pool.query('SELECT * FROM OPC_Card WHERE ID = ?', [id]);
  const card = cardRows[0];
  if (!card) return res.redirect('/nagl/cards');
  const facilities = await pool.query('SELECT FacilityID, Name, IdentityNumber, LicenseType, LicenseNumber FROM OPC_Facility');
  const suppliers = await pool.query('SELECT id, name FROM Supplier');
  const vehicles = await pool.query('SELECT ID, PlateNumber, SerialNumber, FacilityID FROM OPC_Vehicle');
  const licenseTypes = await pool.query('SELECT LicenseTypeNameAR FROM OPC_LicenseType');
  res.render('cards/new', {
    facilities,
    suppliers,
    vehicles,
    licenseTypes,
    card,
    title: 'تعديل كرت تشغيل',
    header: 'تعديل كرت تشغيل'
  });
});

router.post('/cards/:id', async (req, res) => {
  const { id } = req.params;
  const { FacilityID, VehicleID, IssueDate, ExpirationDate, RenewalDate, Supplier } = req.body;
  const today = new Date().toISOString().slice(0, 10);
  await pool.query(
    'UPDATE OPC_Card SET FacilityID=?, VehicleID=?, IssueDate=?, ExpirationDate=?, RenewalDate=?, Supplier=?, LastUpdate=? WHERE ID=?',
    [FacilityID, VehicleID, IssueDate, ExpirationDate, RenewalDate || null, Supplier, today, id]
  );
  res.redirect('/nagl/cards');
});

router.post('/cards/:id/delete', async (req, res) => {
  const { id } = req.params;
  await pool.query('DELETE FROM OPC_Card WHERE ID = ?', [id]);
  res.redirect('/nagl/cards');
});

module.exports = router;
