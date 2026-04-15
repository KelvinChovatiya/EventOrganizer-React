const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { submitContactForm, getAllContacts, updateContactStatus } = require('../controllers/contactController');

// PUBLIC: Submit a message
router.post('/', submitContactForm);

// ADMIN: Get all messages
router.get('/', protect, getAllContacts);

// ADMIN: Update message status
router.put('/:id', protect, updateContactStatus);

module.exports = router;
