import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllEvents } from '../services/eventService';
import { Calendar, MapPin, IndianRupee } from 'lucide-react';

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // The state that tracks which button is clicked
  const [selectedCategory, setSelectedCategory] = useState('All');

  // The Exact Categories from your Database
  const categories = ['All', 'Technology', 'Music', 'Business', 'Social', 'Sports', 'Education', 'Other'];

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await getAllEvents();
        setEvents(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load events. Is your backend running?');
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  // The Engine: This creates a new list based on the clicked button
  const filteredEvents = selectedCategory === 'All' 
    ? events 
    : events.filter(event => event.category === selectedCategory);

  if (loading) return <div className="text-center p-10 font-bold text-slate-500">Loading events...</div>;
  if (error) return <div className="text-center p-10 font-bold text-red-500">{error}</div>;

  return (
    <div className="max-w-7xl mx-auto p-8 font-sans">
      
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
        <div>
          <h1 className="text-4xl font-extrabold text-slate-900 mb-2">Explore Events</h1>
          <p className="text-slate-500">Discover and register for upcoming events.</p>
        </div>

        {/* The Filter Buttons */}
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all ${
                selectedCategory === category
                  ? 'bg-orange-500 text-white shadow-md'
                  : 'bg-white text-slate-600 border border-slate-200 hover:border-orange-500 hover:text-orange-500'
              }`}
            >
              {category === 'Technology' ? 'Tech' : category} 
            </button>
          ))}
        </div>
      </div>
      
      {/* If the filter finds nothing, show this message */}
      {filteredEvents.length === 0 ? (
        <div className="text-center p-16 bg-slate-50 rounded-2xl border border-slate-200">
          <p className="text-slate-500 font-bold text-lg mb-4">No events found for "{selectedCategory}".</p>
          <button 
            onClick={() => setSelectedCategory('All')} 
            className="text-orange-500 font-bold hover:underline px-6 py-2 bg-orange-50 rounded-lg"
          >
            Clear Filter
          </button>
        </div>
      ) : (
        /* If the filter finds events, show the grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredEvents.map((event) => (
            <div key={event._id} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-lg transition-all group flex flex-col">
              
              <div className="relative h-48 bg-slate-100 overflow-hidden">
                <img 
                  src={event.imageUrl || `https://source.unsplash.com/800x600/?${event.category.toLowerCase()}`} 
                  alt={event.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => { e.target.src = 'https://via.placeholder.com/800x600?text=Event' }}
                />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-lg text-xs font-bold text-orange-500 uppercase tracking-wider shadow-sm">
                  {event.category}
                </div>
              </div>
              
              <div className="p-6 flex-1 flex flex-col">
                <h2 className="text-xl font-extrabold text-slate-900 mb-3 line-clamp-2">{event.title}</h2>
                
                <div className="space-y-2.5 mb-6 flex-1">
                  <div className="flex items-center text-sm text-slate-600">
                    <Calendar className="w-4 h-4 mr-2 text-slate-400" />
                    <span className="font-medium">
                      {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <div className="flex items-center text-sm text-slate-600">
                    <MapPin className="w-4 h-4 mr-2 text-slate-400 shrink-0" />
                    <span className="font-medium truncate">{event.location}</span>
                  </div>
                  <div className="flex items-center text-sm font-bold text-slate-900 mt-2">
                    <IndianRupee className="w-4 h-4 mr-1 text-slate-400" />
                    {event.price === 0 ? 'Free' : event.price}
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-slate-100 mt-auto">
                  <span className={`text-sm font-bold ${event.availableSeats <= 0 ? 'text-red-500' : 'text-slate-500'}`}>
                    {event.availableSeats <= 0 ? 'Sold Out' : `${event.availableSeats} Seats Left`}
                  </span>
                  <Link 
                    to={`/events/${event._id}`} 
                    className="px-5 py-2.5 bg-slate-900 text-white text-sm font-bold rounded-lg hover:bg-slate-800 transition-colors"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EventsPage;