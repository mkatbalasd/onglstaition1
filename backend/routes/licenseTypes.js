const express = require('express');
const router = express.Router();
const licenseTypeController = require('../controllers/licenseTypeController');

router.get('/', licenseTypeController.getAll);
router.get('/:id', licenseTypeController.getById);
router.post('/', licenseTypeController.create);
router.put('/:id', licenseTypeController.update);
router.delete('/:id', licenseTypeController.remove);

module.exports = router;
