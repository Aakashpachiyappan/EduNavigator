import { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';
import toast from 'react-hot-toast';

export default function AdminApplications() {
  const [applications, setApplications] = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [search,       setSearch]       = useState('');

  useEffect(() => {
    axiosInstance.get('/jobs/applications/all')
      .then(({ data }) => setApplications(data))
      .catch(() => toast.error('Failed to load applications'))
      .finally(() => setLoading(false));
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await axiosInstance.patch(`/jobs/applications/${id}/status`, { status });
      setApplications(p => p.map(a => a._id === id ? { ...a, status } : a));
      toast.success(`Status updated to ${status}`);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to update');
    }
  };

  const statusStyle = {
    pending:  'bg-yellow-50 text-yellow-700 border-yellow-200',
    accepted: 'bg-green-50  text-green-700  border-green-200',
    rejected: 'bg-red-50    text-red-700    border-red-200',
  };

  const filtered = applications.filter(a =>
    a.studentName?.toLowerCase().includes(search.toLowerCase()) ||
    a.jobRole?.toLowerCase().includes(search.toLowerCase()) ||
    a.company?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">All Applications</h1>

        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search applicants or roles…"
          className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm mb-5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500" />

        {loading ? (
          <div className="text-center py-16 text-gray-400">Loading…</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-400">No applications found.</div>
        ) : (
          <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-left">
                  <th className="px-5 py-3 text-gray-500 font-medium">Student</th>
                  <th className="px-5 py-3 text-gray-500 font-medium">Role</th>
                  <th className="px-5 py-3 text-gray-500 font-medium">Company</th>
                  <th className="px-5 py-3 text-gray-500 font-medium">Applied</th>
                  <th className="px-5 py-3 text-gray-500 font-medium">Status</th>
                  <th className="px-5 py-3 text-gray-500 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(app => (
                  <tr key={app._id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="px-5 py-3">
                      <div className="font-medium text-gray-800">{app.studentName}</div>
                      <div className="text-xs text-gray-400">{app.studentEmail}</div>
                    </td>
                    <td className="px-5 py-3 text-gray-700">{app.jobRole}</td>
                    <td className="px-5 py-3 text-gray-600">{app.company}</td>
                    <td className="px-5 py-3 text-gray-400 text-xs">{new Date(app.createdAt).toLocaleDateString()}</td>
                    <td className="px-5 py-3">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border capitalize ${statusStyle[app.status] || ''}`}>
                        {app.status}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      {app.status === 'pending' && (
                        <div className="flex gap-2">
                          <button onClick={() => updateStatus(app._id, 'accepted')} className="px-3 py-1 bg-green-600 text-white rounded-lg text-xs hover:bg-green-700">Accept</button>
                          <button onClick={() => updateStatus(app._id, 'rejected')} className="px-3 py-1 bg-red-500 text-white rounded-lg text-xs hover:bg-red-600">Reject</button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
