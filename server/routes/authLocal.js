const router = require('express').Router();
const authLocalController = require('../controller/authLocalController');

router.post('/register', authLocalController.register);
router.post('/verify', authLocalController.verifyOTP);
router.post('/login', authLocalController.login);

module.exports = router;
