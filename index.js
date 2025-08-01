const express = require('express');
const bodyParser = require('body-parser');
const expressLayouts = require('express-ejs-layouts');
require('dotenv').config();

const app = express();
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

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send('Server Error');
});

const port = process.env.PORT || 3002;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
