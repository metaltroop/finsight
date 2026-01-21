const router = require('express').Router();
const userController = require('../controller/userController');
const { isAdmin } = require('../middlewares/auth');

router.get('/', isAdmin, userController.getAllUsers);

module.exports = router;
