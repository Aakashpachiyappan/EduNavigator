import { useState, useEffect, useCallback } from 'react';
import axiosInstance from '../api/axiosInstance';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

function ApplyModal({ job, onClose, onSuccess }) {
  const [coverNote, setCoverNote] = useState('');
  const [loading, setLoading] = useState(false);

  const handleApply = async () => {
    setLoading(true);
    try {
      await axiosInstance.post(`/jobs/${job._id}/apply`, { coverNote });
      toast.success('Application submitted!');
      onSuccess(job._id);
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to apply');
    } finally { setLoading(false); }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
        <h3 className="font-semibold text-gray-800 mb-1">Applying for: {job.role}</h3>
        <p className="text-sm text-gray-500 mb-4">{job.company}</p>
        <textarea rows={4} value={coverNote} onChange={e => setCoverNote(e.target.value)}
          placeholder="Cover note (optional)"
          className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-2 border border-gray-200 rounded-lg text-sm text-gray-500 hover:bg-gray-50">Cancel</button>
          <button onClick={handleApply} disabled={loading} className="flex-2 flex-1 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 disabled:opacity-60">
            {loading ? 'Submitting…' : 'Submit'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function JobBoard() {
  const { user } = useAuth();
  const canApply = user?.role === 'student';
  const isAdmin  = user?.role === 'admin' || user?.role === 'superadmin';

  const [jobs,        setJobs]        = useState([]);
  const [appliedJobs, setAppliedJobs] = useState(new Set());
  const [loading,     setLoading]     = useState(true);
  const [search,      setSearch]      = useState('');
  const [modalJob,    setModalJob]    = useState(null);

  useEffect(() => {
    Promise.allSettled([
      axiosInstance.get('/jobs'),
      axiosInstance.get('/jobs/applications/mine'),
    ]).then(([jobsRes, appsRes]) => {
      if (jobsRes.status === 'fulfilled') setJobs(jobsRes.value.data);
      if (appsRes.status === 'fulfilled') setAppliedJobs(new Set(appsRes.value.data.map(a => a.jobId?.toString())));
    }).finally(() => setLoading(false));
  }, []);

  const handleApplied = useCallback((id) => setAppliedJobs(p => new Set([...p, id])), []);

  const filtered = jobs.filter(j =>
    j.role?.toLowerCase().includes(search.toLowerCase()) ||
    j.company?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {modalJob && <ApplyModal job={modalJob} onClose={() => setModalJob(null)} onSuccess={handleApplied} />}
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Job Board</h1>
          {isAdmin && (
            <Link to="/jobs/new" className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700">
              + Post Job
            </Link>
          )}
        </div>

        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search roles or companies…"
          className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm mb-5 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" />

        {loading ? (
          <div className="text-center py-16 text-gray-400">Loading…</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-400">No jobs found.</div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {filtered.map(job => {
              const hasApplied = appliedJobs.has(job._id);
              return (
                <div key={job._id} className="bg-white border border-gray-100 rounded-xl shadow-sm p-5 flex flex-col">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold text-gray-800">{job.role}</h3>
                      <p className="text-sm text-gray-500">{job.company}</p>
                    </div>
                    {job.type && (
                      <span className="text-xs px-2 py-1 bg-blue-50 text-blue-600 rounded-full border border-blue-100">{job.type}</span>
                    )}
                  </div>
                  {job.location && <p className="text-xs text-gray-400 mb-2">📍 {job.location}</p>}
                  {job.description && <p className="text-sm text-gray-600 mb-3 flex-1 leading-relaxed line-clamp-2">{job.description}</p>}
                  {job.skills?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {job.skills.slice(0, 5).map(s => (
                        <span key={s} className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full">{s}</span>
                      ))}
                    </div>
                  )}
                  <div className="mt-auto">
                    {!canApply ? (
                      <Link to="/admin/applications" className="block text-center py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-100">
                        View Applicants
                      </Link>
                    ) : hasApplied ? (
                      <div className="py-2 text-center text-sm text-green-600 bg-green-50 rounded-lg border border-green-100">✓ Applied</div>
                    ) : (
                      <button onClick={() => setModalJob(job)} className="w-full py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700">
                        Apply Now
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}