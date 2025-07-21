const express = require('express');
const bodyParser = require('body-parser');
const expressLayouts = require('express-ejs-layouts');
const path = require('path');
const { pool, generateCardNumber } = require('./db');

const app = express();
const router = express.Router();

app.set('view engine', 'ejs');
app.use(expressLayouts);
app.set('layout', 'layout');
app.use('/nagl', express.static('public'));
app.use('/nagl/app', express.static(path.join(__dirname, 'frontend/dist')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());

// Mount route modules
router.use('/', require('./routes/home'));
router.use('/', require('./routes/facilities'));
router.use('/', require('./routes/drivers'));
router.use('/', require('./routes/vehicles'));
router.use('/', require('./routes/driverCards'));
router.use('/', require('./routes/cards'));
router.use('/', require('./routes/api'));

// Lightweight API routes
router.get('/api/facilities', async (req, res) => {
  const rows = await pool.query(
    'SELECT FacilityID, Name, IdentityNumber, LicenseType FROM OPC_Facility ORDER BY FacilityID DESC'
  );
  res.json(rows);
});

router.get('/api/driver-cards', async (req, res) => {
  const rows = await pool.query(
    'SELECT ID, CardNumber, DriverID, FacilityID, IssueDate, ExpirationDate FROM OPC_DriverCard ORDER BY ID DESC'
  );
  res.json(rows);
});

router.get('/api/cards', async (req, res) => {
  const rows = await pool.query(
    'SELECT ID, CardNumber, VehicleID, FacilityID, IssueDate, ExpirationDate FROM OPC_Card ORDER BY ID DESC'
  );
  res.json(rows);
});

router.post('/api/cards', async (req, res) => {
  const { FacilityID, VehicleID, IssueDate, ExpirationDate, RenewalDate, Supplier } = req.body;
  const CardNumber = await generateCardNumber('OPC_Card', FacilityID);
  const today = new Date().toISOString().slice(0, 10);
  const result = await pool.query(
    'INSERT INTO OPC_Card (CardNumber, FacilityID, VehicleID, IssueDate, ExpirationDate, RenewalDate, Supplier, addingDate, LastUpdate) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [CardNumber, FacilityID, VehicleID, IssueDate, ExpirationDate, RenewalDate || null, Supplier, today, today]
  );
  const ID = result.insertId;
  res.json({ ID, CardNumber, FacilityID, VehicleID, IssueDate, ExpirationDate, RenewalDate: RenewalDate || null, Supplier });
});

router.put('/api/cards/:id', async (req, res) => {
  const { id } = req.params;
  const { FacilityID, VehicleID, IssueDate, ExpirationDate, RenewalDate, Supplier } = req.body;
  const today = new Date().toISOString().slice(0, 10);
  await pool.query(
    'UPDATE OPC_Card SET FacilityID=?, VehicleID=?, IssueDate=?, ExpirationDate=?, RenewalDate=?, Supplier=?, LastUpdate=? WHERE ID=?',
    [FacilityID, VehicleID, IssueDate, ExpirationDate, RenewalDate || null, Supplier, today, id]
  );
  res.json({ ID: Number(id), FacilityID, VehicleID, IssueDate, ExpirationDate, RenewalDate: RenewalDate || null, Supplier });
});

router.delete('/api/cards/:id', async (req, res) => {
  const { id } = req.params;
  await pool.query('DELETE FROM OPC_Card WHERE ID = ?', [id]);
  res.json({ success: true });
});

router.get('/api/suppliers', async (req, res) => {
  const rows = await pool.query('SELECT id, name FROM Supplier');
  res.json(rows);
});

// Serve Vue SPA
app.get('/nagl/app/*path', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/dist/index.html'));
});

app.use('/nagl', router);

const port = process.env.PORT || 3002;

if (require.main === module) {
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}

app.pool = pool;
module.exports = app;
