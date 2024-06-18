const express = require('express');
const router = express.Router();
const userController = require('../Controllers/userController.js');
const auth = require('../Middleware/auth.js');

router.post('/signin', userController.signin);
router.post('/signup', userController.signup);
router.get('/fetch-user', auth, userController.fetchUser);
router.put('/edit-profile', auth, userController.editProfile);
router.put('/delete-account', auth, userController.deleteAccount);
router.put('/add-fav-facility', auth, userController.addFavFacility);
router.put('/remove-fav-facility', auth, userController.removeFavFacility);
router.put('/add-home-address', auth, userController.addHomeAddress);

module.exports = router;