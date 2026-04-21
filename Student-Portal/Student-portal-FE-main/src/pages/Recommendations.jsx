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
          <button onClick={handleApply} disabled={loading} className="flex-1 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 disabled:opacity-60">
            {loading ? 'Submitting…' : 'Submit'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Recommendations() {
  const { user } = useAuth();
  const canApply = user?.role === 'student';
  const isAdmin  = user?.role === 'admin' || user?.role === 'superadmin';

  const [jobs,        setJobs]        = useState([]);
  const [appliedJobs, setAppliedJobs] = useState(new Set());
  const [loading,     setLoading]     = useState(true);
  const [hasResume,   setHasResume]   = useState(true);
  const [search,      setSearch]      = useState('');
  const [modalJob,    setModalJob]    = useState(null);

  useEffect(() => {
    Promise.allSettled([
      axiosInstance.get('/recommendations'),
      axiosInstance.get('/jobs/applications/mine'),
    ]).then(([rec, apps]) => {
      if (rec.status === 'fulfilled') setJobs(rec.value.data);
      else setHasResume(false);
      if (apps.status === 'fulfilled')
        setAppliedJobs(new Set(apps.value.data.map(a => a.jobId?.toString())));
    }).finally(() => setLoading(false));
  }, []);

  const handleApplied = useCallback((id) => setAppliedJobs(p => new Set([...p, id])), []);

  const filtered = jobs.filter(j =>
    j.role?.toLowerCase().includes(search.toLowerCase()) ||
    j.company?.toLowerCase().includes(search.toLowerCase())
  ).sort((a, b) => b.matchScore - a.matchScore);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {modalJob && <ApplyModal job={modalJob} onClose={() => setModalJob(null)} onSuccess={handleApplied} />}
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-start mb-6 flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">AI Job Recommendations</h1>
            <p className="text-sm text-gray-500 mt-1">Jobs matched to your resume and skills</p>
          </div>
          {isAdmin && (
            <Link to="/admin/applications" className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700">
              View All Applicants
            </Link>
          )}
        </div>

        {!hasResume && (
          <div className="mb-5 p-4 bg-yellow-50 border border-yellow-200 rounded-xl text-sm text-yellow-700">
            ⚠ Upload your resume for personalised match scores —{' '}
            <Link to="/resume-checker" className="font-semibold underline">Upload now</Link>
          </div>
        )}

        {/* Stats */}
        {jobs.length > 0 && (
          <div className="grid grid-cols-3 gap-4 mb-5">
            {[
              { label: 'Total Jobs',     value: jobs.length },
              { label: 'Strong Matches', value: jobs.filter(j => j.matchScore >= 70).length },
              { label: 'Avg Match',      value: `${Math.round(jobs.reduce((a, j) => a + j.matchScore, 0) / jobs.length)}%` },
            ].map(({ label, value }) => (
              <div key={label} className="bg-white border border-gray-100 rounded-xl p-4 text-center shadow-sm">
                <div className="text-xl font-bold text-blue-600">{value}</div>
                <div className="text-xs text-gray-400 mt-1">{label}</div>
              </div>
            ))}
          </div>
        )}

        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search roles or companies…"
          className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm mb-5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500" />

        {loading ? (
          <div className="text-center py-16 text-gray-400">Finding your best matches…</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-400 bg-white border border-gray-100 rounded-xl">
            {jobs.length === 0 ? 'No job recommendations yet. Upload your resume to get started.' : 'No results found.'}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {filtered.map(job => {
              const s = job.matchScore ?? 0;
              const hasApplied = appliedJobs.has(job._id);
              const scoreColor = s >= 70 ? 'text-green-600' : s >= 40 ? 'text-yellow-600' : 'text-gray-400';
              return (
                <div key={job._id} className="bg-white border border-gray-100 rounded-xl shadow-sm p-5 flex flex-col hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold text-gray-800">{job.role}</h3>
                      <p className="text-sm text-gray-500">{job.company}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className={`text-xl font-bold ${scoreColor}`}>{s}%</div>
                      <div className="text-xs text-gray-400">Match</div>
                    </div>
                  </div>
                  {job.location && <p className="text-xs text-gray-400 mb-2">📍 {job.location}</p>}

                  {/* Match bar */}
                  <div className="mb-3">
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${s >= 70 ? 'bg-green-500' : s >= 40 ? 'bg-yellow-400' : 'bg-gray-300'}`}
                        style={{ width: `${s}%` }} />
                    </div>
                  </div>

                  {job.skills?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {job.skills.slice(0, 5).map(sk => {
                        const matched = (job.matchedSkills || []).some(m => m.toLowerCase() === sk.toLowerCase());
                        return (
                          <span key={sk} className={`text-xs px-2 py-0.5 rounded-full border ${matched ? 'bg-green-50 text-green-700 border-green-200' : 'bg-gray-50 text-gray-500 border-gray-100'}`}>
                            {matched ? '✓ ' : ''}{sk}
                          </span>
                        );
                      })}
                    </div>
                  )}

                  <div className="mt-auto">
                    {!canApply ? (
                      <Link to="/admin/applications" className="block text-center py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-100">View Applicants</Link>
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
