const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { 
  registerForEvent, 
  getUserRegistrations, 
  getAllRegistrations 
} = require('../controllers/registrationController');

// 1. GET ALL (Admin)
router.get('/', protect, getAllRegistrations);

// 2. GET MY TICKETS (User)
router.get('/my-tickets', protect, getUserRegistrations);

// 3. POST NEW TICKET (User Checkout)
// This is the route your frontend is looking for!
router.post('/:eventId', protect, registerForEvent);

module.exports = router;
