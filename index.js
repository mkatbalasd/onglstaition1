const express = require('express');
const bodyParser = require('body-parser');
const expressLayouts = require('express-ejs-layouts');
const path = require('path');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const { pool, generateCardNumber } = require('./db');
const { asyncHandler, errorHandler } = require('./middleware/errorHandler');

const app = express();
const router = express.Router();

// Base path used by the Vite build. It should match the `base` option in
// `frontend/vite.config.js` so that static assets resolve correctly when the
// app is deployed under a subpath. Default to `/nagl/app/`.
const viteBasePath = process.env.VITE_BASE_PATH || '/nagl/app/';
const basePath = viteBasePath.replace(/\/$/, '');

app.set('view engine', 'ejs');
app.use(expressLayouts);
app.set('layout', 'layout');
app.use('/nagl', express.static('public'));
app.use(basePath, express.static(path.join(__dirname, 'frontend/dist')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(helmet());
app.use(cors());
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
app.use(limiter);

// Mount route modules
router.use('/', require('./routes/home'));
router.use('/', require('./routes/facilities'));
router.use('/', require('./routes/drivers'));
router.use('/', require('./routes/vehicles'));
router.use('/', require('./routes/driverCards'));
router.use('/', require('./routes/cards'));
router.use('/', require('./routes/api'));

// Lightweight API routes
router.get(
  '/api/facilities',
  asyncHandler(async (req, res) => {
    const rows = await pool.query(
      'SELECT FacilityID, Name, IdentityNumber, LicenseType FROM OPC_Facility ORDER BY FacilityID DESC'
    );
    res.json(rows);
  })
);

router.get(
  '/api/driver-cards',
  asyncHandler(async (req, res) => {
    const pageSize = 10;
    const {
      name,
      identity,
      facility,
      supplier,
      issueFrom,
      issueTo,
      expFrom,
      expTo,
      page
    } = req.query;

    const conditions = [];
    const params = [];
    if (name) {
      conditions.push('drv.FirstName LIKE ?');
      params.push(`%${name}%`);
    }
    if (identity) {
      conditions.push('drv.IdentityNumber LIKE ?');
      params.push(`%${identity}%`);
    }
    if (facility) {
      conditions.push('f.Name LIKE ?');
      params.push(`%${facility}%`);
    }
    if (supplier) {
      conditions.push('s.name LIKE ?');
      params.push(`%${supplier}%`);
    }
    if (issueFrom) {
      conditions.push('d.IssueDate >= ?');
      params.push(issueFrom);
    }
    if (issueTo) {
      conditions.push('d.IssueDate <= ?');
      params.push(issueTo);
    }
    if (expFrom) {
      conditions.push('d.ExpirationDate >= ?');
      params.push(expFrom);
    }
    if (expTo) {
      conditions.push('d.ExpirationDate <= ?');
      params.push(expTo);
    }

    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
    const pageNum = parseInt(page, 10) || 1;
    const offset = (pageNum - 1) * pageSize;

    const [countRow] = await pool.query(
      'SELECT COUNT(*) AS count ' +
        'FROM OPC_DriverCard d ' +
        'LEFT JOIN OPC_Driver drv ON d.DriverID = drv.DriverID ' +
        'LEFT JOIN OPC_Facility f ON d.FacilityID = f.FacilityID ' +
        'LEFT JOIN Supplier s ON d.Supplier = s.id ' +
        where,
      params
    );
    const count = countRow ? countRow.count : 0;

    const rows = await pool.query(
      'SELECT d.ID, d.CardNumber, d.token, d.CardType, drv.FirstName, drv.IdentityNumber AS DriverIdentity, ' +
        'f.Name, f.IdentityNumber AS FacilityIdentity, d.IssueDate, d.ExpirationDate, s.name AS SupplierName ' +
        'FROM OPC_DriverCard d ' +
        'LEFT JOIN OPC_Driver drv ON d.DriverID = drv.DriverID ' +
        'LEFT JOIN OPC_Facility f ON d.FacilityID = f.FacilityID ' +
        'LEFT JOIN Supplier s ON d.Supplier = s.id ' +
        where +
        ' ORDER BY d.ID DESC LIMIT ? OFFSET ?',
      [...params, pageSize, offset]
    );

    res.json({ items: rows, pageCount: Math.ceil(count / pageSize) });
  })
);

router.get(
  '/api/driver-cards/:id',
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const rows = await pool.query(
      'SELECT d.ID, d.CardNumber, d.token, d.CardType, d.FacilityID, d.DriverID, d.IssueDate, d.ExpirationDate, d.Supplier, ' +
        'drv.FirstName, drv.IdentityNumber AS DriverIdentity, f.Name, f.IdentityNumber AS FacilityIdentity, s.name AS SupplierName ' +
        'FROM OPC_DriverCard d ' +
        'LEFT JOIN OPC_Driver drv ON d.DriverID = drv.DriverID ' +
        'LEFT JOIN OPC_Facility f ON d.FacilityID = f.FacilityID ' +
        'LEFT JOIN Supplier s ON d.Supplier = s.id ' +
        'WHERE d.ID = ?',
      [id]
    );
    const card = rows[0];
    if (!card) return res.status(404).json({ error: 'Not Found' });
    res.json(card);
  })
);

router.post(
  '/api/driver-cards',
  asyncHandler(async (req, res) => {
    const { CardType, FacilityID, DriverID, IssueDate, ExpirationDate, Supplier } = req.body;
    const CardNumber = await generateCardNumber('OPC_DriverCard', FacilityID);
    const today = new Date().toISOString().slice(0, 10);
    const result = await pool.query(
      'INSERT INTO OPC_DriverCard (CardNumber, CardType, FacilityID, DriverID, IssueDate, ExpirationDate, Supplier, addingDate, LastUpdate) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [CardNumber, CardType, FacilityID, DriverID, IssueDate, ExpirationDate, Supplier, today, today]
    );
    const ID = result.insertId;
    res.json({ ID, CardNumber, CardType, FacilityID, DriverID, IssueDate, ExpirationDate, Supplier });
  })
);

router.put(
  '/api/driver-cards/:id',
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { CardType, FacilityID, DriverID, IssueDate, ExpirationDate, Supplier } = req.body;
    const today = new Date().toISOString().slice(0, 10);
    await pool.query(
      'UPDATE OPC_DriverCard SET CardType=?, FacilityID=?, DriverID=?, IssueDate=?, ExpirationDate=?, Supplier=?, LastUpdate=? WHERE ID=?',
      [CardType, FacilityID, DriverID, IssueDate, ExpirationDate, Supplier, today, id]
    );
    res.json({ ID: Number(id), CardType, FacilityID, DriverID, IssueDate, ExpirationDate, Supplier });
  })
);

router.delete(
  '/api/driver-cards/:id',
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    await pool.query('DELETE FROM OPC_DriverCard WHERE ID = ?', [id]);
    res.json({ success: true });
  })
);

router.get(
  '/api/cards',
  asyncHandler(async (req, res) => {
    const rows = await pool.query(
      'SELECT c.ID, c.CardNumber, v.PlateNumber, f.Name, c.IssueDate, c.ExpirationDate, s.name AS SupplierName ' +
        'FROM OPC_Card c ' +
        'LEFT JOIN OPC_Vehicle v ON c.VehicleID = v.ID ' +
        'LEFT JOIN OPC_Facility f ON c.FacilityID = f.FacilityID ' +
        'LEFT JOIN Supplier s ON c.Supplier = s.id'
    );
    res.json(rows);
  })
);

router.post(
  '/api/cards',
  asyncHandler(async (req, res) => {
    const { FacilityID, VehicleID, IssueDate, ExpirationDate, RenewalDate, Supplier } = req.body;
    const CardNumber = await generateCardNumber('OPC_Card', FacilityID);
    const today = new Date().toISOString().slice(0, 10);
    const result = await pool.query(
      'INSERT INTO OPC_Card (CardNumber, FacilityID, VehicleID, IssueDate, ExpirationDate, RenewalDate, Supplier, addingDate, LastUpdate) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [CardNumber, FacilityID, VehicleID, IssueDate, ExpirationDate, RenewalDate || null, Supplier, today, today]
    );
    const ID = result.insertId;
    res.json({ ID, CardNumber, FacilityID, VehicleID, IssueDate, ExpirationDate, RenewalDate: RenewalDate || null, Supplier });
  })
);

router.put(
  '/api/cards/:id',
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { FacilityID, VehicleID, IssueDate, ExpirationDate, RenewalDate, Supplier } = req.body;
    const today = new Date().toISOString().slice(0, 10);
    await pool.query(
      'UPDATE OPC_Card SET FacilityID=?, VehicleID=?, IssueDate=?, ExpirationDate=?, RenewalDate=?, Supplier=?, LastUpdate=? WHERE ID=?',
      [FacilityID, VehicleID, IssueDate, ExpirationDate, RenewalDate || null, Supplier, today, id]
    );
    res.json({ ID: Number(id), FacilityID, VehicleID, IssueDate, ExpirationDate, RenewalDate: RenewalDate || null, Supplier });
  })
);

router.delete(
  '/api/cards/:id',
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    await pool.query('DELETE FROM OPC_Card WHERE ID = ?', [id]);
    res.json({ success: true });
  })
);

router.get(
  '/api/suppliers',
  asyncHandler(async (req, res) => {
    const rows = await pool.query('SELECT id, name FROM Supplier');
    res.json(rows);
  })
);

// Serve Vue SPA for any route under the configured base path.
// Express 5 uses path-to-regexp v6 which accepts the `{*param}` syntax
// for wildcards, so `${basePath}{/*path}` correctly matches subroutes.
app.get(`${basePath}{/*path}`, (req, res) =>
  res.sendFile(path.join(__dirname, 'frontend/dist/index.html'))
);

app.use('/nagl', router);
app.use(errorHandler);

const port = process.env.PORT || 3002;

if (require.main === module) {
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}

app.pool = pool;
module.exports = app;
