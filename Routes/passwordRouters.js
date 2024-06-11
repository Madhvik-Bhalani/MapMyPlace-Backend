const express = require('express');
const router = express.Router();
const passwordController = require('../Controllers/passwordController.js');

router.post('/forgot-password', passwordController.forgotPassword);
router.post('/reset-password', passwordController.resetPassword);


module.exports = router;