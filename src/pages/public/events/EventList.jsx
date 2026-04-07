import React, { useState, useEffect } from 'react';
import Header from '../../../components/common/Header';
import Footer from '../../../components/common/Footer';
import EventCard from '../../../components/event/EventCard';
import { getAllEvents } from '../../../services/eventService'; // Ensure this path is correct

const EventList = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [activeFilter, setActiveFilter] = useState('All');
  const filters = ['All', 'Tech', 'Music', 'Business', 'Social'];

  // 1. Fetch real data from MongoDB when the page loads
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await getAllEvents();
        setEvents(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load events.');
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  // 2. The Filter Engine
  const filteredEvents = activeFilter === 'All'
    ? events
    : events.filter(event => {
      if (activeFilter === 'Tech') return event.category === 'Technology';
      return event.category === activeFilter;
    });

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <div className="flex-grow bg-white font-sans text-slate-900 py-16 px-6">
        <div className="mx-auto max-w-6xl">

          {/* Header Section */}
          <div className="text-center mb-12 mt-10">
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-8">
              Explore <span className="text-[#F95A00]">Events</span>
            </h1>

            {/* Filter Pills */}
            <div className="flex flex-wrap justify-center gap-3">
              {filters.map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`rounded-full px-6 py-2 text-sm font-medium transition-all ${activeFilter === filter
                      ? 'bg-[#F95A00] text-white'
                      : 'border border-slate-300 bg-white text-slate-600 hover:border-[#F95A00] hover:text-[#F95A00]'
                    }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          {/* Error & Loading States */}
          {loading && <div className="text-center p-10 font-bold text-slate-500">Loading live events...</div>}
          {error && <div className="text-center p-10 font-bold text-red-500">{error}</div>}

          {/* Event Cards Grid */}
          {!loading && !error && filteredEvents.length === 0 ? (
            <div className="text-center p-16 bg-slate-50 rounded-xl border border-slate-200">
              <p className="text-slate-500 font-bold text-lg">No events found for "{activeFilter}".</p>
            </div>
          ) : (
            /* 3. Pass the live, filtered data directly into your custom design */
            <EventCard events={filteredEvents} />
          )}

        </div>
      </div>

      <Footer />
    </div>
  );
}

export default EventList;