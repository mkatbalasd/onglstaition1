const express = require('express');
const router = express.Router();
const driverCardController = require('../controllers/driverCardController');

router.get('/', driverCardController.getAll);
router.get('/:id', driverCardController.getById);
router.post('/', driverCardController.create);
router.put('/:id', driverCardController.update);
router.delete('/:id', driverCardController.remove);

module.exports = router;
