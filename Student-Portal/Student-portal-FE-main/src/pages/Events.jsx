import { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';
import toast from 'react-hot-toast';

export default function Events() {
  const [events,  setEvents]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [search,  setSearch]  = useState('');

  useEffect(() => {
    axiosInstance.get('/events')
      .then(({ data }) => setEvents(data))
      .catch(() => toast.error('Failed to load events'))
      .finally(() => setLoading(false));
  }, []);

  const handleRegister = async (id) => {
    try {
      await axiosInstance.post(`/events/${id}/register`);
      toast.success('Registered for event!');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to register');
    }
  };

  const filtered = events.filter(e =>
    e.title?.toLowerCase().includes(search.toLowerCase()) ||
    e.description?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Events</h1>

        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search events…"
          className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm mb-5 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" />

        {loading ? (
          <div className="text-center py-16 text-gray-400">Loading…</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-400">No events found.</div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {filtered.map(ev => (
              <div key={ev._id} className="bg-white border border-gray-100 rounded-xl shadow-sm p-5">
                {ev.image && <img src={ev.image} alt={ev.title} className="w-full h-40 object-cover rounded-lg mb-3" />}
                <h3 className="font-semibold text-gray-800 mb-1">{ev.title}</h3>
                {ev.date && (
                  <p className="text-xs text-blue-600 mb-2">
                    📅 {new Date(ev.date).toLocaleDateString('en-IN', { weekday:'short', day:'numeric', month:'short', year:'numeric' })}
                  </p>
                )}
                {ev.location && <p className="text-xs text-gray-400 mb-2">📍 {ev.location}</p>}
                <p className="text-sm text-gray-600 mb-4 leading-relaxed">{ev.description}</p>
                <button onClick={() => handleRegister(ev._id)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700">
                  Register
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}