const Review = require('../models/Review');
const Event = require('../models/Event');


const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find().populate('user', 'name email').populate('event', 'title').sort({ createdAt: -1 });
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch all reviews.' });
  }
};

const getEventReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ event: req.params.eventId }).populate('user', 'name').sort({ createdAt: -1 });
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch reviews for this event.' });
  }
};


const createReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const eventId = req.params.eventId;
    const userId = req.user._id;

    const alreadyReviewed = await Review.findOne({ user: userId, event: eventId });
    if (alreadyReviewed) {
      return res.status(400).json({ message: 'You have already reviewed this event.' });
    }

    const review = await Review.create({ user: userId, event: eventId, rating: Number(rating), comment });
    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: 'Server error while creating review.' });
  }
};

module.exports = { getAllReviews, getEventReviews, createReview };
