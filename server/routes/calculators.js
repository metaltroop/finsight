const router = require('express').Router();
const calculatorController = require('../controller/calculatorController');

router.post('/', calculatorController.saveEntry);
router.put('/:id', calculatorController.updateEntry);
router.get('/history', calculatorController.getHistory);

module.exports = router;
