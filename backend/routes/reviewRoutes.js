const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getAllReviews, getEventReviews, createReview } = require('../controllers/reviewController');

// Admin: Get all reviews
router.get('/', protect, getAllReviews);

// Public: Get reviews for a single event
router.get('/:eventId', getEventReviews);

// USER: Submit a new review (THIS IS THE ROUTE FAILING WITH 404)
router.post('/:eventId', protect, createReview);

module.exports = router;