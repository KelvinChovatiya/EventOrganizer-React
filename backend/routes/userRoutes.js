const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getUserProfile, getAllUsers } = require('../controllers/userController');

router.get('/profile', protect, getUserProfile);

router.get('/', protect, getAllUsers);
module.exports = router;