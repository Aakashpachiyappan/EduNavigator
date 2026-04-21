import { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';
import toast from 'react-hot-toast';

export default function SuperAdminPanel() {
  const [tab,     setTab]     = useState('pending');
  const [users,   setUsers]   = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosInstance.get('/auth/admin/pending')
      .then(({ data }) => setUsers(data))
      .catch(() => toast.error('Failed to load users'))
      .finally(() => setLoading(false));
  }, []);

  const handleApprove = async (id) => {
    try {
      await axiosInstance.patch(`/auth/admin/${id}/approve`);
      setUsers(p => p.filter(u => u._id !== id));
      toast.success('User approved!');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to approve');
    }
  };

  const handleReject = async (id) => {
    try {
      await axiosInstance.delete(`/auth/admin/${id}`);
      setUsers(p => p.filter(u => u._id !== id));
      toast.success('User rejected.');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to reject');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Super Admin Panel</h1>

        <div className="flex gap-2 mb-6">
          {['pending', 'all'].map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
                tab === t ? 'bg-blue-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}>
              {t} Admins
            </button>
          ))}
        </div>

        <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
          {loading ? (
            <div className="text-center py-16 text-gray-400">Loading…</div>
          ) : users.length === 0 ? (
            <div className="text-center py-16 text-gray-400">No pending admin requests.</div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-left">
                  <th className="px-5 py-3 text-gray-500 font-medium">Name</th>
                  <th className="px-5 py-3 text-gray-500 font-medium">Email</th>
                  <th className="px-5 py-3 text-gray-500 font-medium">Department</th>
                  <th className="px-5 py-3 text-gray-500 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u._id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="px-5 py-3 font-medium text-gray-800">{u.name}</td>
                    <td className="px-5 py-3 text-gray-600">{u.email}</td>
                    <td className="px-5 py-3 text-gray-500">{u.department || '—'}</td>
                    <td className="px-5 py-3">
                      <div className="flex gap-2">
                        <button onClick={() => handleApprove(u._id)} className="px-3 py-1 bg-green-600 text-white rounded-lg text-xs hover:bg-green-700">Approve</button>
                        <button onClick={() => handleReject(u._id)} className="px-3 py-1 bg-red-500 text-white rounded-lg text-xs hover:bg-red-600">Reject</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
