import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getEventById } from '../../services/eventService';
import { registerForEvent } from '../../services/registrationService';
import { Calendar, MapPin, Ticket, IndianRupee, Users, Type } from 'lucide-react';

const ConfirmAttendancePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        const data = await getEventById(id);
        setEvent(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load event details.');
        setLoading(false);
      }
    };
    fetchEventData();
  }, [id]);

  const handleConfirmRegistration = async () => {
    setIsRegistering(true);
    try {
      await registerForEvent(event._id);
      alert('Ticket successfully secured!');
      // BOOM: This is where we will route them to the "My Events" page next!
      navigate('/user/my-events'); 
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to register. You might already have a ticket.');
      setIsRegistering(false);
    }
  };

  const handleCancel = () => {
    // Send them back to the event page if they cancel
    navigate(`/events/${id}`);
  };

  if (loading) return <div className="min-h-screen bg-slate-900/20 flex items-center justify-center font-bold text-slate-500">Loading secure checkout...</div>;
  if (error) return <div className="min-h-screen bg-slate-900/20 flex items-center justify-center font-bold text-red-500">{error}</div>;
  if (!event) return null;

  return (
    // The dark background wrapper simulates the modal look from your Figma
    <div className="min-h-screen bg-slate-900/60 py-10 px-4 flex justify-center items-start overflow-y-auto font-sans">
      
      {/* The White Modal Container */}
      <div className="bg-white w-full max-w-4xl rounded-xl shadow-2xl flex flex-col my-auto">
        
        {/* TOP SECTION: Header & Actions */}
        <div className="text-center pt-12 pb-10 border-b border-slate-100">
          <h1 className="text-3xl font-extrabold text-slate-900 mb-3">Confirm Your Attendance</h1>
          <p className="text-sm font-medium text-slate-500 mb-8">
            Please review the event details before confirming your ticket purchase.
          </p>
          
          <div className="flex justify-center gap-4">
            <button 
              onClick={handleCancel}
              className="px-10 py-2.5 rounded border border-slate-300 text-slate-700 font-bold text-sm hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button 
              onClick={handleConfirmRegistration}
              disabled={isRegistering || event.availableSeats <= 0}
              className="px-10 py-2.5 rounded bg-[#F95A00] text-white font-bold text-sm hover:bg-orange-600 disabled:bg-slate-300 transition-colors"
            >
              {isRegistering ? 'Processing...' : 'Confirm'}
            </button>
          </div>
        </div>

        {/* MIDDLE SECTION: Event Details */}
        <div className="p-10 md:px-20">
          <h2 className="text-2xl font-extrabold text-slate-900 mb-8">Event Details</h2>
          
          <div className="space-y-5">
            {/* Event Name */}
            <div className="border border-slate-200 rounded-lg p-3 flex items-center gap-5">
              <div className="w-16 h-16 bg-slate-100 rounded flex items-center justify-center text-slate-400 shrink-0">
                <Type className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900 mb-1">Event Name</p>
                <p className="text-lg font-extrabold text-[#111827]">{event.title}</p>
              </div>
            </div>

            {/* Event Date */}
            <div className="border border-slate-200 rounded-lg p-3 flex items-center gap-5">
              <div className="w-16 h-16 bg-slate-100 rounded flex items-center justify-center text-slate-400 shrink-0">
                <Calendar className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900 mb-1">Event Date</p>
                <p className="text-lg font-extrabold text-[#111827]">
                  {new Date(event.date).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}
                </p>
              </div>
            </div>

            {/* Event Location */}
            <div className="border border-slate-200 rounded-lg p-3 flex items-center gap-5">
              <div className="w-16 h-16 bg-slate-100 rounded flex items-center justify-center text-slate-400 shrink-0">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900 mb-1">Event Location</p>
                <p className="text-lg font-extrabold text-[#111827]">{event.location}</p>
              </div>
            </div>

            {/* Price */}
            <div className="border border-slate-200 rounded-lg p-3 flex items-center gap-5">
              <div className="w-16 h-16 bg-slate-100 rounded flex items-center justify-center text-slate-400 shrink-0">
                <IndianRupee className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900 mb-1">Price</p>
                <p className="text-lg font-extrabold text-[#111827]">
                  {event.price === 0 ? 'Free' : `₹${event.price}`}
                </p>
              </div>
            </div>

            {/* Available Seats */}
            <div className="border border-slate-200 rounded-lg p-3 flex items-center gap-5">
              <div className="w-16 h-16 bg-slate-100 rounded flex items-center justify-center text-slate-400 shrink-0">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900 mb-1">Available Seats</p>
                <p className="text-lg font-extrabold text-[#111827]">{event.availableSeats}</p>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM FOOTER */}
        <div className="mt-auto border-t border-slate-100 p-8 flex flex-col md:flex-row justify-between items-center text-xs font-medium text-slate-600 text-center gap-4">
          <p>For any questions, please contact<br/><span className="font-bold text-slate-900">support@eventalk.com</span></p>
          <p>Follow us on social media for updates</p>
        </div>

      </div>
    </div>
  );
};

export default ConfirmAttendancePage;