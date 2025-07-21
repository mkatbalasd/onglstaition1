const express = require('express');
const bodyParser = require('body-parser');
const expressLayouts = require('express-ejs-layouts');
const path = require('path');
const { pool } = require('./db');

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
