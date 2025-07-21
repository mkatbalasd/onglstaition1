const express = require('express');
const router = express.Router();
const { pool, generateCardNumber } = require('../db');

router.get('/driver-cards', async (req, res) => {
  try {
    const cards = await pool.query(
      'SELECT d.ID, d.CardNumber, d.token, d.CardType, drv.FirstName, f.Name, d.IssueDate, d.ExpirationDate, s.name AS SupplierName ' +
        'FROM OPC_DriverCard d ' +
        'LEFT JOIN OPC_Driver drv ON d.DriverID = drv.DriverID ' +
        'LEFT JOIN OPC_Facility f ON d.FacilityID = f.FacilityID ' +
        'LEFT JOIN Supplier s ON d.Supplier = s.id ' +
        'ORDER BY d.ID DESC'
    );
    res.render('drivercards/index', {
      cards,
      title: 'بطاقات السائقين',
      header: 'إدارة بطاقات السائقين'
    });
  } catch (err) {
    console.error('Error fetching driver cards:', err);
    res.status(500).render('error', { message: 'Database error' });
  }
});

router.get('/driver-cards/new', (req, res) => {
  res.render('drivercards/new', {
    title: 'إضافة بطاقة سائق',
    header: 'إدخال هوية المنشأة'
  });
});

router.post('/driver-cards/new', async (req, res) => {
  try {
    const { IdentityNumber } = req.body;
    const rows = await pool.query(
      'SELECT FacilityID FROM OPC_Facility WHERE IdentityNumber = ?',
      [IdentityNumber]
    );
    if (rows.length) {
      const fid = rows[0].FacilityID;
      return res.redirect(`/nagl/driver-cards/new/${fid}/driver`);
    }
    res.render('facilities/new', {
      identity: IdentityNumber,
      next: '/nagl/driver-cards/new',
      title: 'إضافة منشأة',
      header: 'إضافة منشأة'
    });
  } catch (err) {
    console.error('Error processing facility identity:', err);
    res.status(500).render('error', { message: 'Database error' });
  }
});

router.get('/driver-cards/new/:facilityId/driver', async (req, res) => {
  try {
    const { facilityId } = req.params;
    const [facilityRow] = await pool.query(
      'SELECT Name FROM OPC_Facility WHERE FacilityID = ?',
      [facilityId]
    );
    res.render('drivercards/driver', {
      facilityId,
      facilityName: facilityRow ? facilityRow.Name : '',
      title: 'إضافة بطاقة سائق',
      header: 'إدخال هوية السائق'
    });
  } catch (err) {
    console.error('Error fetching facility for driver:', err);
    res.status(500).render('error', { message: 'Database error' });
  }
});

router.post('/driver-cards/new/:facilityId/driver', async (req, res) => {
  try {
    const { facilityId } = req.params;
    const { IdentityNumber } = req.body;
    const rows = await pool.query(
      'SELECT DriverID, FirstName, LastName FROM OPC_Driver WHERE IdentityNumber = ? AND FacilityID = ?',
      [IdentityNumber, facilityId]
    );
    if (rows.length) {
      const driver = rows[0];
      const [card] = await pool.query(
        'SELECT ID FROM OPC_DriverCard WHERE DriverID = ? ORDER BY ID DESC LIMIT 1',
        [driver.DriverID]
      );
      if (card) {
        return res.redirect(`/nagl/driver-cards/${card.ID}/edit`);
      }
      return res.redirect(`/nagl/driver-cards/new/${facilityId}/driver/${driver.DriverID}`);
    }
    res.render('drivers/new', {
      facilityId,
      identity: IdentityNumber,
      next: `/nagl/driver-cards/new/${facilityId}/driver`,
      title: 'إضافة سائق',
      header: 'إضافة سائق'
    });
  } catch (err) {
    console.error('Error processing driver identity:', err);
    res.status(500).render('error', { message: 'Database error' });
  }
});

router.get('/driver-cards/new/:facilityId/driver/:driverId', async (req, res) => {
  try {
    const { facilityId, driverId } = req.params;
    const facilities = await pool.query(
      'SELECT FacilityID, Name, IdentityNumber, LicenseType, LicenseNumber FROM OPC_Facility WHERE FacilityID = ?',
      [facilityId]
    );
    const suppliers = await pool.query('SELECT id, name FROM Supplier');
    const drivers = await pool.query(
      'SELECT DriverID, FirstName, LastName FROM OPC_Driver WHERE DriverID = ?',
      [driverId]
    );
    const licenseTypes = await pool.query(
      'SELECT LicenseTypeNameAR FROM OPC_LicenseType'
    );
    const facility = facilities[0];
    const driver = drivers[0];
    res.render('drivercards/form', {
      facilities,
      suppliers,
      drivers,
      licenseTypes,
      facility,
      driver,
      lockFacility: true,
      lockDriver: true,
      card: null,
      title: 'إضافة بطاقة سائق',
      header: 'إضافة بطاقة سائق'
    });
  } catch (err) {
    console.error('Error preparing driver card form:', err);
    res.status(500).render('error', { message: 'Database error' });
  }
});

router.post('/driver-cards', async (req, res) => {
  try {
    const {
      CardType,
      FacilityID,
      DriverID,
      IssueDate,
      ExpirationDate,
      Supplier
    } = req.body;
    const CardNumber = await generateCardNumber('OPC_DriverCard', FacilityID);
    const today = new Date().toISOString().slice(0, 10);
    await pool.query(
      'INSERT INTO OPC_DriverCard (CardNumber, CardType, FacilityID, DriverID, IssueDate, ExpirationDate, Supplier, addingDate, LastUpdate) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [CardNumber, CardType, FacilityID, DriverID, IssueDate, ExpirationDate, Supplier, today, today]
    );
    res.redirect('/nagl/driver-cards');
  } catch (err) {
    console.error('Error creating driver card:', err);
    res.status(500).render('error', { message: 'Database error' });
  }
});

router.get('/driver-cards/:id/edit', async (req, res) => {
  try {
    const { id } = req.params;
    const cardRows = await pool.query('SELECT * FROM OPC_DriverCard WHERE ID = ?', [id]);
    const facilities = await pool.query('SELECT FacilityID, Name, IdentityNumber, LicenseType, LicenseNumber FROM OPC_Facility');
    const suppliers = await pool.query('SELECT id, name FROM Supplier');
    const drivers = await pool.query('SELECT DriverID, FirstName, LastName FROM OPC_Driver');
    const licenseTypes = await pool.query('SELECT LicenseTypeNameAR FROM OPC_LicenseType');
    const card = cardRows[0];
    if (!card) return res.redirect('/nagl/driver-cards');
    res.render('drivercards/form', {
      facilities,
      suppliers,
      drivers,
      licenseTypes,
      facility: null,
      driver: null,
      card,
      lockFacility: false,
      lockDriver: false,
      title: 'تعديل بطاقة سائق',
      header: 'تعديل بطاقة سائق'
    });
  } catch (err) {
    console.error('Error loading driver card for edit:', err);
    res.status(500).render('error', { message: 'Database error' });
  }
});

router.post('/driver-cards/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { CardType, FacilityID, DriverID, IssueDate, ExpirationDate, Supplier } = req.body;
    const today = new Date().toISOString().slice(0, 10);
    await pool.query(
      'UPDATE OPC_DriverCard SET CardType=?, FacilityID=?, DriverID=?, IssueDate=?, ExpirationDate=?, Supplier=?, LastUpdate=? WHERE ID=?',
      [CardType, FacilityID, DriverID, IssueDate, ExpirationDate, Supplier, today, id]
    );
    res.redirect('/nagl/driver-cards');
  } catch (err) {
    console.error('Error updating driver card:', err);
    res.status(500).render('error', { message: 'Database error' });
  }
});

router.post('/driver-cards/:id/delete', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM OPC_DriverCard WHERE ID = ?', [id]);
    res.redirect('/nagl/driver-cards');
  } catch (err) {
    console.error('Error deleting driver card:', err);
    res.status(500).render('error', { message: 'Database error' });
  }
});

module.exports = router;
