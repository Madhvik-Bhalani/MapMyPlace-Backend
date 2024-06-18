const express = require('express');
const router = express.Router();
const passwordController = require('../Controllers/passwordController.js');
const auth = require("../Middleware/auth.js")

router.post('/forgot-password', passwordController.forgotPassword);
router.post('/reset-password', passwordController.resetPassword);
router.put('/change-password', auth, passwordController.changePassword);


module.exports = router;