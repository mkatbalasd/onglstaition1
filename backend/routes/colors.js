const express = require('express');
const router = express.Router();
const colorController = require('../controllers/colorController');

router.get('/', colorController.getAll);
router.get('/:id', colorController.getById);
router.post('/', colorController.create);
router.put('/:id', colorController.update);
router.delete('/:id', colorController.remove);

module.exports = router;
