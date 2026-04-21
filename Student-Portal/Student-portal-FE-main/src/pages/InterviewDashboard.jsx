import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';

export default function InterviewDashboard() {
  const [sessions, setSessions] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [selected, setSelected] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  useEffect(() => {
    axiosInstance.get('/interview/sessions')
      .then(r => setSessions(r.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const loadDetail = async (id) => {
    if (selected?._id === id) return setSelected(null);
    setDetailLoading(true);
    try {
      const { data } = await axiosInstance.get(`/interview/sessions/${id}`);
      setSelected(data);
    } catch {} finally { setDetailLoading(false); }
  };

  const statusStyle = {
    active:    'bg-yellow-50 text-yellow-700 border-yellow-100',
    completed: 'bg-green-50  text-green-700  border-green-100',
    abandoned: 'bg-gray-50   text-gray-500   border-gray-100',
  };

  if (loading) return <div className="min-h-screen bg-gray-50 flex items-center justify-center text-gray-400">Loading…</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Interview History</h1>
            <p className="text-sm text-gray-500 mt-1">Your AI interview performance dashboard</p>
          </div>
          <Link to="/interview" className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700">
            🎤 New Interview
          </Link>
        </div>

        {/* Overview stats */}
        {sessions.length > 0 && (() => {
          const completed = sessions.filter(s => s.status === 'completed');
          const avg  = completed.length ? Math.round(completed.reduce((a, s) => a + (s.finalScore?.overall || 0), 0) / completed.length) : 0;
          const best = completed.length ? Math.max(...completed.map(s => s.finalScore?.overall || 0)) : 0;
          return (
            <div className="grid grid-cols-4 gap-3 mb-6">
              {[
                { label: 'Total Sessions', value: sessions.length,  color: 'text-blue-600' },
                { label: 'Completed',      value: completed.length, color: 'text-green-600' },
                { label: 'Average Score',  value: `${avg}/100`,     color: 'text-purple-600' },
                { label: 'Best Score',     value: `${best}/100`,    color: 'text-orange-500' },
              ].map(({ label, value, color }) => (
                <div key={label} className="bg-white border border-gray-100 rounded-xl shadow-sm p-4 text-center">
                  <div className={`text-xl font-bold ${color}`}>{value}</div>
                  <div className="text-xs text-gray-400 mt-1">{label}</div>
                </div>
              ))}
            </div>
          );
        })()}

        {/* Sessions */}
        {sessions.length === 0 ? (
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-16 text-center">
            <div className="text-4xl mb-3">🎤</div>
            <p className="text-gray-500 mb-4">No interview sessions yet. Start practising!</p>
            <Link to="/interview" className="inline-block px-5 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700">
              Start Now
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {sessions.map(s => {
              const sc = s.finalScore?.overall ?? 0;
              const scoreColor = sc >= 70 ? 'text-green-600' : sc >= 40 ? 'text-yellow-600' : 'text-red-500';
              const isOpen = selected?._id === s._id;
              return (
                <div key={s._id} className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
                  {/* Row */}
                  <div className={`flex items-center justify-between gap-4 p-4 flex-wrap ${s.status === 'completed' ? 'cursor-pointer hover:bg-gray-50' : ''}`}
                    onClick={() => s.status === 'completed' && loadDetail(s._id)}>
                    <div className="flex items-center gap-4">
                      <div className={`text-2xl font-bold ${scoreColor}`}>
                        {s.status === 'completed' ? sc : '—'}
                      </div>
                      <div>
                        <div className="text-xs text-gray-400 mb-1">
                          {new Date(s.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {(s.detectedSkills || []).slice(0, 5).map(sk => (
                            <span key={sk} className="text-xs px-2 py-0.5 bg-blue-50 text-blue-600 border border-blue-100 rounded-full">{sk}</span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      {s.status === 'completed' && (
                        <div className="grid grid-cols-3 gap-3 text-center">
                          {[['🧠', s.finalScore?.technical, 'text-blue-500'], ['💬', s.finalScore?.communication, 'text-purple-500'], ['🎯', s.finalScore?.confidence, 'text-green-500']].map(([icon, v, c], j) => (
                            <div key={j}>
                              <div className="text-sm">{icon}</div>
                              <div className={`text-sm font-bold ${c}`}>{v}</div>
                            </div>
                          ))}
                        </div>
                      )}
                      <span className={`text-xs font-medium px-3 py-1 rounded-full border capitalize ${statusStyle[s.status] || ''}`}>{s.status}</span>
                      {s.status === 'completed' && <span className="text-gray-400 text-sm">{isOpen ? '▲' : '▼'}</span>}
                    </div>
                  </div>

                  {/* Expanded Detail */}
                  {isOpen && (
                    <div className="border-t border-gray-50 p-4 bg-gray-50">
                      {detailLoading ? (
                        <p className="text-sm text-gray-400 text-center py-4">Loading…</p>
                      ) : (
                        <div className="space-y-3">
                          {selected.tipsSummary?.length > 0 && (
                            <div className="p-3 bg-yellow-50 border border-yellow-100 rounded-xl">
                              <p className="text-xs font-semibold text-yellow-700 mb-2">Improvement Tips</p>
                              {selected.tipsSummary.map((t, i) => (
                                <p key={i} className="text-xs text-gray-700 pl-3 border-l-2 border-yellow-400 mb-1">→ {t}</p>
                              ))}
                            </div>
                          )}
                          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Question Breakdown</p>
                          {selected.answers?.map((ans, ai) => {
                            const q = selected.questions?.find(q => q.id === ans.questionId);
                            const c = ans.score >= 8 ? 'text-green-600' : ans.score >= 5 ? 'text-yellow-600' : 'text-red-500';
                            return (
                              <div key={ai} className="p-3 bg-white border border-gray-100 rounded-xl">
                                <div className="flex justify-between gap-2 mb-2">
                                  <p className="text-sm text-gray-700 font-medium flex-1">{q?.text || ans.questionText}</p>
                                  <span className={`text-sm font-bold shrink-0 ${c}`}>{ans.score}/10</span>
                                </div>
                                <p className="text-xs text-gray-500 bg-gray-50 rounded-lg p-2 mb-1 line-clamp-2">{ans.answerText}</p>
                                {ans.feedback?.tip && <p className="text-xs text-blue-600">💡 {ans.feedback.tip}</p>}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
