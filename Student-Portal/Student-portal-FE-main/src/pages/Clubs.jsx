import { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';
import toast from 'react-hot-toast';

export default function Clubs() {
  const [clubs,   setClubs]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [search,  setSearch]  = useState('');

  useEffect(() => {
    axiosInstance.get('/clubs')
      .then(({ data }) => setClubs(data))
      .catch(() => toast.error('Failed to load clubs'))
      .finally(() => setLoading(false));
  }, []);

  const handleJoin = async (id) => {
    try {
      await axiosInstance.post(`/clubs/${id}/join`);
      toast.success('Joined!');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to join');
    }
  };

  const filtered = clubs.filter(c =>
    c.name?.toLowerCase().includes(search.toLowerCase()) ||
    c.description?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Campus Clubs</h1>
        </div>

        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search clubs…"
          className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm mb-5 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" />

        {loading ? (
          <div className="text-center py-16 text-gray-400">Loading…</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-400">No clubs found.</div>
        ) : (
          <div className="grid grid-cols-3 gap-4">
            {filtered.map(club => (
              <div key={club._id} className="bg-white border border-gray-100 rounded-xl shadow-sm p-5 flex flex-col">
                {club.image && <img src={club.image} alt={club.name} className="w-full h-32 object-cover rounded-lg mb-3" />}
                <h3 className="font-semibold text-gray-800 mb-1">{club.name}</h3>
                <p className="text-sm text-gray-500 mb-3 flex-1 leading-relaxed">{club.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-400">{club.members?.length || 0} members</span>
                  <button onClick={() => handleJoin(club._id)}
                    className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700">
                    Join
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}