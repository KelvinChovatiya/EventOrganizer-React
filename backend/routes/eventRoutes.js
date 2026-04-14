const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { 
  getEvents, 
  getEvent, 
  createEvent, 
  updateEvent, 
  deleteEvent, 
  toggleEventStatus,
  getAdminEvents 
} = require('../controllers/eventController');

// 1. Specific string routes MUST go first
router.get('/admin', protect, getAdminEvents);

// 2. Base routes
router.route('/')
  .get(getEvents)
  .post(protect, createEvent);

// 3. Dynamic ID routes MUST go last
router.patch('/:id/status', protect, toggleEventStatus);
router.route('/:id')
  .get(getEvent)
  .put(protect, updateEvent)
  .delete(protect, deleteEvent);

module.exports = router;