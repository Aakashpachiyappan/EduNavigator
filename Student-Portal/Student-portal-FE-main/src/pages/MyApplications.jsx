import { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function MyApplications() {
  const [apps,    setApps]    = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosInstance.get('/jobs/applications/mine')
      .then(({ data }) => setApps(data))
      .catch(() => toast.error('Failed to load applications'))
      .finally(() => setLoading(false));
  }, []);

  const statusStyle = {
    pending:  'bg-yellow-50 text-yellow-700 border-yellow-100',
    accepted: 'bg-green-50  text-green-700  border-green-100',
    rejected: 'bg-red-50    text-red-700    border-red-100',
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">My Applications</h1>

        {/* Stats */}
        {apps.length > 0 && (
          <div className="grid grid-cols-4 gap-3 mb-6">
            {[
              { label: 'Total',    value: apps.length, color: 'text-blue-600' },
              { label: 'Pending',  value: apps.filter(a => a.status === 'pending').length,  color: 'text-yellow-600' },
              { label: 'Accepted', value: apps.filter(a => a.status === 'accepted').length, color: 'text-green-600' },
              { label: 'Rejected', value: apps.filter(a => a.status === 'rejected').length, color: 'text-red-500' },
            ].map(({ label, value, color }) => (
              <div key={label} className="bg-white border border-gray-100 rounded-xl p-4 text-center shadow-sm">
                <div className={`text-2xl font-bold ${color}`}>{value}</div>
                <div className="text-xs text-gray-400 mt-1">{label}</div>
              </div>
            ))}
          </div>
        )}

        {loading ? (
          <div className="text-center py-16 text-gray-400">Loading…</div>
        ) : apps.length === 0 ? (
          <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-12 text-center">
            <div className="text-4xl mb-3">📋</div>
            <p className="text-gray-500 mb-4">No applications yet. Browse jobs to get started!</p>
            <Link to="/jobs" className="inline-block px-5 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700">Browse Jobs</Link>
          </div>
        ) : (
          <div className="space-y-3">
            {apps.map(app => (
              <div key={app._id} className="bg-white border border-gray-100 rounded-xl shadow-sm p-4 flex items-center justify-between gap-4">
                <div>
                  <div className="font-semibold text-gray-800">{app.jobRole}</div>
                  <div className="text-sm text-gray-500">{app.company}</div>
                  {app.coverNote && <div className="text-xs text-gray-400 mt-1 italic">"{app.coverNote}"</div>}
                </div>
                <div className="text-right flex-shrink-0">
                  <span className={`inline-block text-xs font-semibold px-3 py-1 rounded-full border capitalize ${statusStyle[app.status] || 'bg-gray-50 text-gray-500'}`}>
                    {app.status}
                  </span>
                  <div className="text-xs text-gray-400 mt-1">
                    {new Date(app.createdAt).toLocaleDateString('en-IN')}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {apps.length > 0 && (
          <div className="mt-5 flex gap-3">
            <Link to="/jobs" className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700">Browse More Jobs</Link>
            <Link to="/recommendations" className="px-4 py-2 border border-blue-200 text-blue-600 rounded-lg text-sm font-semibold hover:bg-blue-50">AI Matches</Link>
          </div>
        )}
      </div>
    </div>
  );
}
