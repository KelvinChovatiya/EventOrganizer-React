import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getMyTickets } from '../../services/registrationService';
import { submitReview } from '../../services/reviewService'; // We need this for the modal
import { Calendar, MapPin } from 'lucide-react';
import axios from 'axios';

const MyEventsPage = () => {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [feedbackName, setFeedbackName] = useState(''); // Added to match your Figma
  const [feedbackDesc, setFeedbackDesc] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalError, setModalError] = useState('');

 useEffect(() => {
    const fetchTicketsAndUser = async () => {
      try {
        // 1. Fetch the tickets
        const data = await getMyTickets();
        setTickets(data);

        // 2. Fetch the user's name
        const token = localStorage.getItem('token');
        if (token) {
          try {
            // First attempt: Ask the backend for the official profile
            const userRes = await axios.get('http://localhost:5000/api/users/profile', {
              headers: { Authorization: `Bearer ${token}` }
            });
            setFeedbackName(userRes.data.name);
          } catch (profileErr) {
            // Fallback: Check if the user object was saved in local storage during login
            const storedUser = localStorage.getItem('user') || localStorage.getItem('userInfo');
            if (storedUser) {
              setFeedbackName(JSON.parse(storedUser).name);
            }
          }
        }

        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load your tickets.');
        setLoading(false);
      }
    };

    fetchTicketsAndUser();
  }, []);

  // Helper function to determine if an event is in the past
  const isCompleted = (eventDate) => {
    return new Date(eventDate) < new Date();
  };

  const openFeedbackModal = (eventId) => {
    setSelectedEventId(eventId);
    setIsModalOpen(true);
  };

  const closeFeedbackModal = () => {
    setIsModalOpen(false);
    setSelectedEventId(null);
    setFeedbackName('');
    setFeedbackDesc('');
    setModalError('');
  };

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    if (!feedbackDesc.trim()) return;

    setIsSubmitting(true);
    setModalError('');

    try {
      // Note: We are hardcoding a 5-star rating here because your Figma
      // modal doesn't have a star selector, just a description box.
      await submitReview(selectedEventId, 5, feedbackDesc);
      closeFeedbackModal();
      alert('Feedback submitted successfully!');
    } catch (err) {
      setModalError(err.response?.data?.message || 'Failed to submit feedback.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div className="min-h-screen bg-slate-50 flex items-center justify-center font-bold text-slate-500">Loading your events...</div>;
  if (error) return <div className="min-h-screen bg-slate-50 flex items-center justify-center font-bold text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-white py-16 px-6 font-sans">
      <div className="max-w-4xl mx-auto">
        
        {/* Header matching Figma */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-slate-900 mb-3">
            My <span className="text-[#F95A00]">Registered Events</span>
          </h1>
          <p className="text-slate-600 font-medium text-sm">Manage and view tickets for your upcoming events.</p>
        </div>

        {tickets.length === 0 ? (
           <div className="text-center text-slate-500 py-10">You have no registered events.</div>
        ) : (
          <div className="space-y-6">
            {tickets.map((ticket) => {
              const event = ticket.event;
              if (!event) return null; // Safety check

              const completed = isCompleted(event.date);

              return (
                <div key={ticket._id} className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm hover:shadow-md transition-shadow">
                  
                  <div className="flex-1">
                    {/* Status Tag */}
                    <span className={`inline-block text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-3 ${
                      completed 
                        ? 'bg-orange-50 text-[#F95A00] border border-orange-100' 
                        : 'bg-orange-50 text-[#F95A00] border border-orange-100' // Using same styling based on your Figma, just changing text
                    }`}>
                      {completed ? 'COMPLETED' : 'UPCOMING'}
                    </span>
                    
                    <h3 className="text-xl font-extrabold text-slate-900 mb-3">
                      {event.title}
                    </h3>
                    
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 text-sm text-slate-600 font-medium">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-[#F95A00]" />
                        {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-[#F95A00]" />
                        {event.location || 'Location TBA'}
                      </div>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="shrink-0">
                    {completed ? (
                      <button 
                        onClick={() => openFeedbackModal(event._id)}
                        className="w-full md:w-auto bg-[#F95A00] hover:bg-orange-600 text-white font-bold py-2.5 px-6 rounded-md transition-colors text-sm"
                      >
                        Give Feedback
                      </button>
                    ) : (
                      <button 
                        onClick={() => navigate(`/events/${event._id}`)}
                        className="w-full md:w-auto bg-[#F95A00] hover:bg-orange-600 text-white font-bold py-2.5 px-6 rounded-md transition-colors text-sm"
                      >
                        View Event
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* FEEDBACK MODAL (Matches your 2nd screenshot) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
            
            <div className="p-8 text-center">
              <h2 className="text-xl font-extrabold text-slate-900 mb-8">Write your feedback</h2>
              
              {modalError && <p className="text-red-500 text-sm font-bold mb-4">{modalError}</p>}
              
              <form onSubmit={handleFeedbackSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-slate-900 mb-2">Name</label>
                 <input 
                    type="text"
                    required
                    readOnly // <--- THIS LOCKS THE FIELD
                    value={feedbackName}
                    onChange={(e) => setFeedbackName(e.target.value)}
                    className="w-full md:w-2/3 mx-auto block p-2.5 border border-slate-300 bg-slate-100 text-slate-500 cursor-not-allowed rounded-md text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-900 mb-2">Short Description</label>
                  <textarea
                    required
                    rows="4"
                    value={feedbackDesc}
                    onChange={(e) => setFeedbackDesc(e.target.value)}
                    className="w-full block p-3 border border-slate-300 rounded-md focus:ring-slate-900 focus:border-slate-900 text-sm"
                  ></textarea>
                </div>

                <div className="pt-4 flex justify-center gap-4">
                  <button
                    type="button"
                    onClick={closeFeedbackModal}
                    className="px-6 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-md transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-slate-800 hover:bg-slate-900 disabled:bg-slate-400 text-white font-bold py-2.5 px-10 rounded-md transition-colors text-sm"
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit'}
                  </button>
                </div>
              </form>
            </div>
            
          </div>
        </div>
      )}
    </div>
  );
};

export default MyEventsPage;