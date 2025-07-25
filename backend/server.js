require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

// Route imports
const driverRoutes = require('./routes/drivers');
const driverCardRoutes = require('./routes/driverCards');
const vehicleRoutes = require('./routes/vehicles');
const facilityRoutes = require('./routes/facilities');
const cardRoutes = require('./routes/cards');
const brandRoutes = require('./routes/brands');
const modelRoutes = require('./routes/models');
const colorRoutes = require('./routes/colors');
const licenseTypeRoutes = require('./routes/licenseTypes');
const supplierRoutes = require('./routes/suppliers');

const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Server is running');
});

// Mount routes under /api
app.use('/api/drivers', driverRoutes);
app.use('/api/driver-cards', driverCardRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/facilities', facilityRoutes);
app.use('/api/cards', cardRoutes);
app.use('/api/brands', brandRoutes);
app.use('/api/models', modelRoutes);
app.use('/api/colors', colorRoutes);
app.use('/api/license-types', licenseTypeRoutes);
app.use('/api/suppliers', supplierRoutes);

if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
}

module.exports = app;
