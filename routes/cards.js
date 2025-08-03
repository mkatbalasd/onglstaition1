const express = require('express');
const router = express.Router();
const pool = require('../db');
const { generateCardNumber } = require('../utils');
const asyncHandler = require('../asyncHandler');
const { getLicenseTypes } = require('../licenseCache');

// List cards
router.get('/cards', asyncHandler(async (req, res) => {
  const cards = await pool.query(
    `SELECT c.ID, c.CardNumber, c.token, v.PlateNumber, f.Name,
            c.IssueDate, c.ExpirationDate, s.name AS SupplierName
     FROM OPC_Card c
     LEFT JOIN OPC_Vehicle v ON c.VehicleID = v.ID
     LEFT JOIN OPC_Facility f ON c.FacilityID = f.FacilityID
     LEFT JOIN Supplier s ON c.Supplier = s.id
     ORDER BY c.ID DESC`
  );
  res.render('cards/index', {
    cards,
    title: 'كروت التشغيل',
    header: 'إدارة كروت التشغيل'
  });
}));

// Start create card - facility identity
router.get('/cards/new', (req, res) => {
  res.render('cards/new', {
    title: 'إضافة كرت تشغيل',
    header: 'إدخال هوية المنشأة'
  });
});

router.post('/cards/new', asyncHandler(async (req, res) => {
  const { IdentityNumber } = req.body;
  const rows = await pool.query(
    'SELECT FacilityID FROM OPC_Facility WHERE IdentityNumber = ?',
    [IdentityNumber]
  );
  if (rows.length) {
    const fid = rows[0].FacilityID;
    return res.redirect(`/nagl/cards/new/${fid}/vehicle`);
  }
  const licenseTypes = await pool.query(
    'SELECT LicenseTypeID, LicenseTypeNameAR FROM OPC_LicenseType ORDER BY LicenseTypeID DESC'
  );
  res.render('facilities/new', {
    identity: IdentityNumber,
    next: '/nagl/cards/new',
    licenseTypes,
    title: 'إضافة منشأة',
    header: 'إضافة منشأة'
  });
}));

// Vehicle step
router.get('/cards/new/:facilityId/vehicle', asyncHandler(async (req, res) => {
  const { facilityId } = req.params;
  const [facilityRow] = await pool.query(
    'SELECT Name FROM OPC_Facility WHERE FacilityID = ?',
    [facilityId]
  );
  res.render('cards/vehicle', {
    facilityId,
    facilityName: facilityRow ? facilityRow.Name : '',
    title: 'إضافة كرت تشغيل',
    header: 'إدخال رقم هيكل المركبة'
  });
}));

router.post('/cards/new/:facilityId/vehicle', asyncHandler(async (req, res) => {
  const { facilityId } = req.params;
  const { SerialNumber } = req.body;
  const rows = await pool.query(
    'SELECT ID FROM OPC_Vehicle WHERE SerialNumber = ? AND FacilityID = ?',
    [SerialNumber, facilityId]
  );
  if (rows.length) {
    const vehicleId = rows[0].ID;
    const [cardRow] = await pool.query(
      'SELECT ID FROM OPC_Card WHERE VehicleID = ? ORDER BY ID DESC LIMIT 1',
      [vehicleId]
    );
    if (cardRow) {
      return res.redirect(`/nagl/cards/${cardRow.ID}/edit`);
    }
    return res.redirect(`/nagl/cards/new/${facilityId}/vehicle/${vehicleId}`);
  }
  const brands = await pool.query('SELECT BrandID, BrandName FROM OPC_Brand ORDER BY BrandID DESC');
  const colors = await pool.query('SELECT ColorID, ColorName FROM OPC_Color ORDER BY ColorID DESC');
  res.render('vehicles/new', {
    facilities: [],
    brands,
    colors,
    facilityId,
    serialNumber: SerialNumber,
    next: `/nagl/cards/new/${facilityId}/vehicle`,
    title: 'إضافة مركبة',
    header: 'إضافة مركبة'
  });
}));

router.get('/cards/new/:facilityId/vehicle/:vehicleId', asyncHandler(async (req, res) => {
  const { facilityId, vehicleId } = req.params;
  const facilities = await pool.query(
    'SELECT FacilityID, Name, IdentityNumber, LicenseType, LicenseNumber FROM OPC_Facility WHERE FacilityID = ?',
    [facilityId]
  );
  const suppliers = await pool.query('SELECT id, name FROM Supplier ORDER BY id DESC');
  const vehicles = await pool.query(
    'SELECT ID, PlateNumber, SerialNumber, FacilityID FROM OPC_Vehicle WHERE ID = ?',
    [vehicleId]
  );
  const licenseTypes = await getLicenseTypes();
  const facility = facilities[0];
  const vehicle = vehicles[0];
  res.render('cards/form', {
    facilities,
    suppliers,
    vehicles,
    licenseTypes,
    facility,
    vehicle,
    lockFacility: true,
    lockVehicle: true,
    card: null,
    title: 'إضافة كرت تشغيل',
    header: 'إضافة كرت تشغيل'
  });
}));

// Create card
router.post('/cards', asyncHandler(async (req, res) => {
  const { FacilityID, VehicleID, IssueDate, ExpirationDate, RenewalDate, Supplier } = req.body;
  const CardNumber = await generateCardNumber('OPC_Card', FacilityID);
  const today = new Date().toISOString().slice(0, 10);
  await pool.query(
    'INSERT INTO OPC_Card (CardNumber, FacilityID, VehicleID, IssueDate, ExpirationDate, RenewalDate, Supplier, addingDate, LastUpdate) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [CardNumber, FacilityID, VehicleID, IssueDate, ExpirationDate, RenewalDate || null, Supplier, today, today]
  );
  res.redirect('/nagl/cards');
}));

// Edit card form
router.get('/cards/:id/edit', asyncHandler(async (req, res) => {
  const { id } = req.params;
  const cardRows = await pool.query('SELECT * FROM OPC_Card WHERE ID = ?', [id]);
  const card = cardRows[0];
  if (!card) return res.redirect('/nagl/cards');
  const facilities = await pool.query('SELECT FacilityID, Name, IdentityNumber, LicenseType, LicenseNumber FROM OPC_Facility ORDER BY FacilityID DESC');
  const suppliers = await pool.query('SELECT id, name FROM Supplier ORDER BY id DESC');
  const vehicles = await pool.query('SELECT ID, PlateNumber, SerialNumber, FacilityID FROM OPC_Vehicle ORDER BY ID DESC');
  const licenseTypes = await getLicenseTypes();
  res.render('cards/form', {
    facilities,
    suppliers,
    vehicles,
    licenseTypes,
    facility: null,
    vehicle: null,
    lockFacility: false,
    lockVehicle: false,
    card,
    title: 'تعديل كرت تشغيل',
    header: 'تعديل كرت تشغيل'
  });
}));

// Update card
router.post('/cards/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { FacilityID, VehicleID, IssueDate, ExpirationDate, RenewalDate, Supplier } = req.body;
  const today = new Date().toISOString().slice(0, 10);
  await pool.query(
    'UPDATE OPC_Card SET FacilityID=?, VehicleID=?, IssueDate=?, ExpirationDate=?, RenewalDate=?, Supplier=?, LastUpdate=? WHERE ID=?',
    [FacilityID, VehicleID, IssueDate, ExpirationDate, RenewalDate || null, Supplier, today, id]
  );
  res.redirect('/nagl/cards');
}));

// Delete card
router.post('/cards/:id/delete', asyncHandler(async (req, res) => {
  const { id } = req.params;
  await pool.query('DELETE FROM OPC_Card WHERE ID = ?', [id]);
  res.redirect('/nagl/cards');
}));

module.exports = router;
