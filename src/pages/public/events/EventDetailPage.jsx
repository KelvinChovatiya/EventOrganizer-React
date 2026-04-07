import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getEventById } from '../../../services/eventService';
import { getEventReviews, submitReview } from '../../../services/reviewService';
import { Calendar, MapPin, User, CheckCircle2, Star } from 'lucide-react';

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');


  // New State for the Feedback Form
  const [newComment, setNewComment] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);
  const [feedbackError, setFeedbackError] = useState('');

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        const eventData = await getEventById(id);
        setEvent(eventData);

        try {
          const reviewData = await getEventReviews(id);
          setReviews(reviewData);
        } catch (err) {
          console.log("Reviews not loaded yet.");
        }

        setLoading(false);
      } catch (err) {
        setError('Failed to load event details.');
        setLoading(false);
      }
    };
    fetchEventData();
  }, [id]);


  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setIsSubmittingFeedback(true);
    setFeedbackError('');

    try {
      await submitReview(id, newRating, newComment);

      const updatedReviews = await getEventReviews(id);
      setReviews(updatedReviews);

      setNewComment('');
      setNewRating(5);
    } catch (err) {
      setFeedbackError(err.response?.data?.message || err.message || 'Failed to submit feedback.');
    } finally {
      setIsSubmittingFeedback(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center font-bold text-slate-500">Loading Event...</div>;
  if (error) return <div className="min-h-screen flex items-center justify-center font-bold text-red-500">{error}</div>;
  if (!event) return null;

  const isCompleted = new Date(event.date) < new Date();
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 font-sans text-slate-900">
      <div className="max-w-5xl mx-auto space-y-8">

        {/* MAIN EVENT CARD */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-10 shadow-sm">
          <div className="h-[400px] w-full bg-slate-50 border border-slate-100 rounded-xl mb-10 overflow-hidden">
            <img
              src={event.imageUrl || `https://via.placeholder.com/1200x600?text=Eventalk`}
              alt={event.title}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8">
            <div>
              <span className="inline-block bg-orange-50 text-[#F95A00] text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider mb-4 border border-orange-100">
                {event.category}
              </span>
              <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight">
                {event.title}
              </h1>
            </div>

            {isCompleted ? (
              <button
                disabled
                className="shrink-0 bg-slate-300 text-slate-500 font-bold py-3.5 px-8 rounded-lg cursor-not-allowed"
              >
                Event Completed
              </button>
            ) : (
              <button
                onClick={() => navigate(`/events/${event._id}/confirm`)}
                disabled={event.availableSeats <= 0}
                className="shrink-0 bg-[#F95A00] hover:bg-orange-600 disabled:bg-slate-300 disabled:text-slate-500 disabled:cursor-not-allowed text-white font-bold py-3.5 px-8 rounded-lg transition-all"
              >
                {event.availableSeats <= 0 ? 'Sold Out' : 'Register For Event'}
              </button>
            )}


          </div>

          <div className="border border-slate-200 rounded-xl p-5 mb-8 flex items-center gap-4 max-w-md">
            <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
              <User className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-0.5">Organized by</p>
              <p className="text-sm font-extrabold text-slate-900">{event.organizerId?.name || 'Kris Kalariya'}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <div className="border border-slate-200 rounded-xl p-5 flex items-start gap-4">
              <Calendar className="w-6 h-6 text-[#F95A00] shrink-0 mt-1" />
              <div>
                <p className="font-extrabold text-slate-900 text-base mb-1">
                  {new Date(event.date).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}
                </p>
                <p className="text-sm text-slate-500 font-medium">
                  {new Date(event.date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })} IST
                </p>
              </div>
            </div>

            <div className="border border-slate-200 rounded-xl p-5 flex items-start gap-4">
              <MapPin className="w-6 h-6 text-[#F95A00] shrink-0 mt-1" />
              <div>
                <p className="font-extrabold text-slate-900 text-base mb-1">{event.location}</p>
                <p className="text-sm text-slate-500 font-medium">Rajkot, Gujarat, India</p>
              </div>
            </div>
          </div>

          <div className="mb-10">
            <h2 className="text-2xl font-extrabold text-slate-900 mb-4">About this event</h2>
            <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">
              {event.description}
            </p>
          </div>
        </div>

        {/* FEEDBACK CARD */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-10 shadow-sm">
          <h2 className="text-3xl font-extrabold text-slate-900 mb-8">Recent Feedback</h2>

          {/* 1. Display Existing Feedback */}
          {reviews?.length === 0 ? (
            <p className="text-slate-500 text-sm mb-8 italic">No feedback has been submitted for this event yet.</p>
          ) : (
            <div className="space-y-6 mb-10">
              {reviews.map((review, index) => (
                <div key={review._id} className={`${index !== reviews.length - 1 ? 'border-b border-slate-200 pb-6' : 'pb-2'}`}>
                  <div className="flex items-center justify-between mb-3">
                    <span className="inline-block bg-[#F95A00] text-white text-xs font-bold px-3 py-1 rounded-md">
                      {review.user?.name || 'User'}
                    </span>
                    {/* <div className="flex items-center text-yellow-400">
                      {[...Array(review.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-current" />
                      ))}
                    </div> */}
                  </div>
                  <p className="text-slate-600 text-sm">{review.comment}</p>
                </div>
              ))}
            </div>
          )}

          {/* 2. The Feedback Form */}
          {/* <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 mt-8">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Leave your feedback</h3>
            
            {feedbackError && <div className="text-red-500 text-sm font-bold mb-4">{feedbackError}</div>}
            
            <form onSubmit={handleFeedbackSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Rating</label>
                <select 
                  value={newRating} 
                  onChange={(e) => setNewRating(Number(e.target.value))}
                  className="block w-full max-w-[150px] p-2.5 border border-slate-300 rounded-lg focus:ring-[#F95A00] focus:border-[#F95A00] text-sm font-bold"
                >
                  <option value={5}>5 Stars - Excellent</option>
                  <option value={4}>4 Stars - Good</option>
                  <option value={3}>3 Stars - Average</option>
                  <option value={2}>2 Stars - Poor</option>
                  <option value={1}>1 Star - Terrible</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Comment</label>
                <textarea
                  required
                  rows="3"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="What did you think about this event?"
                  className="block w-full p-3 border border-slate-300 rounded-lg focus:ring-[#F95A00] focus:border-[#F95A00] text-sm"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={isSubmittingFeedback || !newComment.trim()}
                className="bg-[#F95A00] hover:bg-orange-600 disabled:bg-slate-300 text-white font-bold py-2.5 px-6 rounded-lg transition-all text-sm"
              >
                {isSubmittingFeedback ? 'Submitting...' : 'Submit Feedback'}
              </button>
            </form>
          </div> */}

        </div>
      </div>
    </div>
  );
};

export default EventDetails;