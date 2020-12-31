const express = require('express');

const router = express.Router();

const AuthController = require('../controller/authController');

router.get('/register', AuthController.register);
router.post('/register', AuthController.registerPost);

router.get('/login', AuthController.login);
router.post('/login', AuthController.loginPost);

router.get('/logout', AuthController.logout);
module.exports = router;