const express = require('express');
const router = express.Router();
const pool = require('../db');
const asyncHandler = require('../asyncHandler');

// Vehicles list
router.get('/vehicles', asyncHandler(async (req, res) => {
  const vehicles = await pool.query(
    'SELECT v.ID, v.PlateNumber, v.SerialNumber, f.Name FROM OPC_Vehicle v LEFT JOIN OPC_Facility f ON v.FacilityID = f.FacilityID ORDER BY v.ID DESC'
  );
  res.render('vehicles/index', {
    vehicles,
    title: 'المركبات',
    header: 'إدارة المركبات'
  });
}));

// New vehicle form
router.get('/vehicles/new', asyncHandler(async (req, res) => {
  const facilities = await pool.query('SELECT FacilityID, Name FROM OPC_Facility');
  const brands = await pool.query('SELECT BrandID, BrandName FROM OPC_Brand');
  const colors = await pool.query('SELECT ColorID, ColorName FROM OPC_Color');
  const models = await pool.query('SELECT ModelID, ModelName FROM OPC_Model');
  const { facilityId = '', serialNumber = '', next = '' } = req.query;
  res.render('vehicles/new', {
    facilities,
    brands,
    colors,
    models,
    facilityId,
    serialNumber,
    next,
    title: 'إضافة مركبة',
    header: 'إضافة مركبة'
  });
}));

// Edit vehicle form
router.get('/vehicles/:id/edit', asyncHandler(async (req, res) => {
  const { id } = req.params;
  const vehicleRows = await pool.query(
    'SELECT ID, FacilityID, PlateNumber, SerialNumber, BrandID, ModelID, ColorID, ManufacturingYear FROM OPC_Vehicle WHERE ID = ?',
    [id]
  );
  if (vehicleRows.length === 0) {
    return res.status(404).send('Vehicle not found');
  }
  const facilities = await pool.query('SELECT FacilityID, Name FROM OPC_Facility');
  const brands = await pool.query('SELECT BrandID, BrandName FROM OPC_Brand');
  const colors = await pool.query('SELECT ColorID, ColorName FROM OPC_Color');
  const models = await pool.query('SELECT ModelID, ModelName FROM OPC_Model');
  res.render('vehicles/edit', {
    vehicle: vehicleRows[0],
    facilities,
    brands,
    colors,
    models,
    title: 'تعديل مركبة',
    header: 'تعديل مركبة'
  });
}));

// Create vehicle
router.post('/vehicles', asyncHandler(async (req, res) => {
  const { FacilityID, PlateNumber, SerialNumber, BrandID, ModelID, ColorID, ManufacturingYear, next } = req.body;
  const query = 'INSERT INTO OPC_Vehicle (FacilityID, PlateNumber, SerialNumber, BrandID, ModelID, ColorID, ManufacturingYear) VALUES (?, ?, ?, ?, ?, ?, ?)';
  const result = await pool.query(query, [
    FacilityID || null,
    PlateNumber,
    SerialNumber,
    BrandID || null,
    ModelID || null,
    ColorID || null,
    ManufacturingYear || null
  ]);
  const ID = result.insertId;
  res.redirect(next ? `${next}/${ID}` : '/nagl/vehicles');
}));

// Update vehicle
router.post('/vehicles/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { FacilityID, PlateNumber, SerialNumber, BrandID, ModelID, ColorID, ManufacturingYear } = req.body;
  await pool.query(
    'UPDATE OPC_Vehicle SET FacilityID = ?, PlateNumber = ?, SerialNumber = ?, BrandID = ?, ModelID = ?, ColorID = ?, ManufacturingYear = ? WHERE ID = ?',
    [
      FacilityID || null,
      PlateNumber,
      SerialNumber,
      BrandID || null,
      ModelID || null,
      ColorID || null,
      ManufacturingYear || null,
      id
    ]
  );
  res.redirect('/nagl/vehicles');
}));

// API vehicles
router.get('/api/vehicles', asyncHandler(async (req, res) => {
  const { facilityId } = req.query;
  const vehicles = facilityId
    ? await pool.query('SELECT ID, PlateNumber, SerialNumber FROM OPC_Vehicle WHERE FacilityID = ?', [facilityId])
    : await pool.query('SELECT ID, PlateNumber, SerialNumber FROM OPC_Vehicle');
  res.json(vehicles);
}));

// Vehicle models by brand
router.get('/api/vehicle-models', asyncHandler(async (req, res) => {
  const { brandId } = req.query;
  const models = brandId
    ? await pool.query('SELECT ModelID, ModelName FROM OPC_Model WHERE BrandID = ?', [brandId])
    : await pool.query('SELECT ModelID, ModelName FROM OPC_Model');
  res.json(models);
}));

router.post('/api/vehicles', asyncHandler(async (req, res) => {
  const { FacilityID, PlateNumber, SerialNumber } = req.body;
  const result = await pool.query(
    'INSERT INTO OPC_Vehicle (FacilityID, PlateNumber, SerialNumber) VALUES (?, ?, ?)',
    [FacilityID || null, PlateNumber, SerialNumber]
  );
  const ID = result.insertId;
  res.json({ ID, PlateNumber, SerialNumber });
}));

module.exports = router;
