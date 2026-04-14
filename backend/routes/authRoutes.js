const express = require('express');
const router = express.Router();
// ADD resetPassword to your imports
const { registerUser, loginUser, forgotPassword, resetPassword } = require('../controllers/authController');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/forgotpassword', forgotPassword);
// ADD the new PUT route. Note the :token parameter in the URL.
router.put('/resetpassword/:token', resetPassword);

module.exports = router;