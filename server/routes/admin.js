const express = require('express');
const router = express.Router();
const adminController = require('../controller/adminController');
const { isAdmin } = require('../middlewares/auth'); // Assuming this middleware exists from previous analysis

router.get('/stats', isAdmin, adminController.getStats);

module.exports = router;
