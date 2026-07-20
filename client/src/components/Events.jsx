import { useState, useEffect } from 'react';

export default function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    fetch(`${apiBaseUrl}/api/events`)
      .then(res => res.json())
      .then(data => {
        setEvents(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching events:", err);
        setLoading(false);
      });
  }, []);

  return (
    <section id="events" className="py-32 bg-[#0a0d1a] border-t border-[rgba(241,234,224,0.1)]">
      <div className="w-full px-4 md:px-8">
        <div className="mb-16">
          <div className="font-mono text-xs tracking-[0.22em] uppercase text-[#e8a33d] flex items-center gap-3 mb-4">
            <span className="w-6 h-[1px] bg-[#e8a33d]"></span>
            06 — Engagement
          </div>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-[#f1eae0]">Conferences & Events</h2>
        </div>

        {loading ? (
          <div className="text-[#5c6288] font-mono animate-pulse">Loading event schedule...</div>
        ) : events.length === 0 ? (
          <div className="text-[#5c6288] font-mono border border-[rgba(241,234,224,0.1)] p-10 text-center">
            No events scheduled at the moment. Check back soon.
          </div>
        ) : (
          <div className="border border-[rgba(241,234,224,0.1)] bg-[#141a33]">
            {events.map((event, index) => (
              <div 
                key={event._id} 
                className="group grid grid-cols-[auto_1fr_auto] gap-6 items-center p-6 lg:px-10 border-b border-[rgba(241,234,224,0.1)] last:border-b-0 hover:bg-[#1a2140] transition-colors duration-300"
              >
                <div className="font-mono text-sm text-[#5c6288]">
                  {String(index + 1).padStart(2, '0')}
                </div>
                <div>
                  <div className="font-bold text-[#f1eae0] text-lg mb-1">{event.title}</div>
                  <div className="text-[#9aa0c0] text-sm">{event.role}</div>
                </div>
                <div className="font-mono text-[10px] uppercase tracking-wider text-[#6fe7dd] border border-[rgba(241,234,224,0.2)] px-3 py-1.5 whitespace-nowrap bg-[#0a0d1a]">
                  {event.badge}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
