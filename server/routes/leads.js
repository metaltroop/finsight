const router = require('express').Router();
const leadController = require('../controller/leadController');
const { isAdmin } = require('../middlewares/auth');

router.post('/', leadController.submitLead);
router.get('/', isAdmin, leadController.getAllLeads);
router.get('/export', isAdmin, leadController.exportLeads);

module.exports = router;
