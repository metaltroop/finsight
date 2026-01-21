const router = require('express').Router();
const authController = require('../controller/authController');

router.get('/google', authController.googleAuth);
router.get('/google/callback', authController.googleCallback);
router.get('/me', authController.getMe);
router.put('/profile', authController.updateProfile);
router.get('/logout', authController.logout);

module.exports = router;
