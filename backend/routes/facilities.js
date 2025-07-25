const express = require('express');
const router = express.Router();
const facilityController = require('../controllers/facilityController');

router.get('/', facilityController.getAll);
router.get('/:id', facilityController.getById);
router.post('/', facilityController.create);
router.put('/:id', facilityController.update);
router.delete('/:id', facilityController.remove);

module.exports = router;
