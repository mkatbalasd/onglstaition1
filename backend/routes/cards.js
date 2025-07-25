const express = require('express');
const router = express.Router();
const cardController = require('../controllers/cardController');

router.get('/', cardController.getAll);
router.get('/:id', cardController.getById);
router.post('/generate-number', cardController.generateNumber);
router.post('/', cardController.create);
router.put('/:id', cardController.update);
router.delete('/:id', cardController.remove);

module.exports = router;
