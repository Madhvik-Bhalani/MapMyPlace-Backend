const express = require('express');
const router = express.Router();
const mapController = require('../Controllers/mapController.js');
const auth = require("../Middleware/auth.js")

router.get('/fetch-map-data', auth, mapController.fetchMapData);


module.exports = router;