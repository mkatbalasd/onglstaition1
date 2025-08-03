const express = require('express');
const bodyParser = require('body-parser');
const expressLayouts = require('express-ejs-layouts');
const helmet = require('helmet');
const compression = require('compression');
require('dotenv').config();
const { loadLicenseTypes } = require('./licenseCache');

const app = express();
app.disable('x-powered-by');
app.use(helmet());
app.use(compression());
app.set('view engine', 'ejs');
app.use(expressLayouts);
app.set('layout', 'layout');
app.use('/nagl', express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));

const facilitiesRouter = require('./routes/facilities');
const driversRouter = require('./routes/drivers');
const vehiclesRouter = require('./routes/vehicles');
const driverCardsRouter = require('./routes/driverCards');
const cardsRouter = require('./routes/cards');
const brandsRouter = require('./routes/brands');
const modelsRouter = require('./routes/models');
const colorsRouter = require('./routes/colors');
const licenseTypesRouter = require('./routes/licenseTypes');
const suppliersRouter = require('./routes/suppliers');

// Preload license types into memory unless running tests
if (process.env.NODE_ENV !== 'test') {
  loadLicenseTypes().catch((err) => {
    console.error('Could not preload license types:', err);
  });
}

app.get('/nagl', (req, res) => {
  res.render('home', {
    title: 'لوحة التحكم',
    header: 'لوحة التحكم'
  });
});

app.use('/nagl', facilitiesRouter);
app.use('/nagl', driversRouter);
app.use('/nagl', vehiclesRouter);
app.use('/nagl', driverCardsRouter);
app.use('/nagl', cardsRouter);
app.use('/nagl', brandsRouter);
app.use('/nagl', modelsRouter);
app.use('/nagl', colorsRouter);
app.use('/nagl', licenseTypesRouter);
app.use('/nagl', suppliersRouter);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err);
  if (res.headersSent) {
    return next(err);
  }
  res.status(500).send('Server Error');
});

const port = process.env.PORT || 3002;

if (require.main === module) {
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}

module.exports = app;
