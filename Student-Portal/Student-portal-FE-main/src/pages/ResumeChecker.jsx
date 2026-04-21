import { useState, useCallback } from 'react';
import axiosInstance from '../api/axiosInstance';
import toast from 'react-hot-toast';

function ATSGauge({ score }) {
  const color = score >= 70 ? '#10b981' : score >= 40 ? '#f59e0b' : '#ef4444';
  const label = score >= 70 ? 'Excellent' : score >= 40 ? 'Good' : 'Needs Work';
  const r = 52, circ = 2 * Math.PI * r;
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative inline-flex items-center justify-center">
        <svg width="130" height="130" style={{ transform: 'rotate(-90deg)' }}>
          <circle cx="65" cy="65" r={r} stroke="#e5e7eb" strokeWidth="10" fill="none" />
          <circle cx="65" cy="65" r={r} stroke={color} strokeWidth="10" fill="none"
            strokeDasharray={circ} strokeDashoffset={circ - (score / 100) * circ}
            style={{ transition: 'stroke-dashoffset 1.3s ease' }} />
        </svg>
        <div className="absolute text-center">
          <div className="text-2xl font-bold" style={{ color }}>{score}</div>
          <div className="text-xs text-gray-400">/ 100</div>
        </div>
      </div>
      <div className="text-sm font-semibold" style={{ color }}>{label}</div>
    </div>
  );
}

export default function ResumeChecker() {
  const [file,      setFile]      = useState(null);
  const [dragging,  setDragging]  = useState(false);
  const [uploading, setUploading] = useState(false);
  const [result,    setResult]    = useState(null);
  const [progress,  setProgress]  = useState(0);

  const onDragOver  = useCallback((e) => { e.preventDefault(); setDragging(true); }, []);
  const onDragLeave = useCallback(() => setDragging(false), []);
  const onDrop      = useCallback((e) => {
    e.preventDefault(); setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f?.type === 'application/pdf') setFile(f);
    else toast.error('Only PDF files are accepted');
  }, []);

  const handleAnalyze = async () => {
    if (!file) { toast.error('Please select a PDF first'); return; }
    setUploading(true); setResult(null); setProgress(0);
    const iv = setInterval(() => setProgress(p => p < 85 ? p + Math.random() * 11 : p), 400);
    try {
      const fd = new FormData(); fd.append('resume', file);
      const { data } = await axiosInstance.post('/resume/upload', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      clearInterval(iv); setProgress(100);
      setTimeout(() => { setResult(data.data); setUploading(false); }, 400);
      toast.success('Analysis complete!');
    } catch (err) {
      clearInterval(iv);
      toast.error(err.response?.data?.error || 'Analysis failed');
      setUploading(false);
    }
  };

  const steps = ['Parsing PDF…', 'Extracting skills…', 'Scoring ATS…', 'Identifying gaps…'];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-4xl mb-3">🧠</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">AI Resume Checker</h1>
          <p className="text-gray-500 text-sm">Upload your resume PDF to get an ATS score, skill analysis, and improvement tips.</p>
        </div>

        {/* Upload zone */}
        <div className={`bg-white border-2 rounded-xl p-6 mb-5 transition-colors ${dragging ? 'border-blue-400 bg-blue-50' : file ? 'border-green-400' : 'border-dashed border-gray-200'}`}>
          <div onDragOver={onDragOver} onDragLeave={onDragLeave} onDrop={onDrop}
            onClick={() => document.getElementById('rf').click()}
            className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all ${dragging ? 'border-blue-400' : file ? 'border-green-300 bg-green-50' : 'border-gray-200 hover:border-gray-300'}`}>
            <input id="rf" type="file" accept=".pdf" onChange={e => { const f = e.target.files[0]; if (f) setFile(f); }} className="hidden" />
            <div className="text-3xl mb-2">{file ? '✅' : '📤'}</div>
            {file ? (
              <>
                <p className="font-semibold text-green-700 mb-1">{file.name}</p>
                <p className="text-sm text-green-600">{(file.size / 1024).toFixed(1)} KB · Ready to analyse</p>
              </>
            ) : (
              <>
                <p className="font-medium text-gray-600 mb-1">Drag & drop your resume here</p>
                <p className="text-sm text-gray-400">or click to browse · PDF only · max 5 MB</p>
              </>
            )}
          </div>

          {uploading && (
            <div className="mt-4">
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>{steps[Math.floor(progress / 26) % 4]}</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
              </div>
            </div>
          )}

          <button onClick={handleAnalyze} disabled={!file || uploading}
            className="w-full mt-4 py-3 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
            {uploading ? 'Analysing…' : 'Analyse Resume'}
          </button>
        </div>

        {/* Results */}
        {result && !uploading && (
          <div className="space-y-4">
            {/* Meta stats */}
            {result.meta && (
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'Word Count',    value: result.meta.wordCount,    color: 'text-blue-600' },
                  { label: 'Pages',         value: result.meta.pageCount,    color: 'text-purple-600' },
                  { label: 'Bullet Points', value: result.meta.bulletPoints, color: 'text-green-600' },
                ].map(({ label, value, color }) => (
                  <div key={label} className="bg-white border border-gray-100 rounded-xl p-4 text-center shadow-sm">
                    <div className={`text-2xl font-bold ${color}`}>{value}</div>
                    <div className="text-xs text-gray-400 mt-1">{label}</div>
                  </div>
                ))}
              </div>
            )}

            {/* ATS + Tips */}
            <div className="grid grid-cols-[160px_1fr] gap-4">
              <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm flex flex-col items-center">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">ATS Score</h3>
                <ATSGauge score={result.atsScore} />
              </div>
              <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Improvement Tips</h3>
                {result.suggestions?.length > 0 ? (
                  <div className="space-y-2">
                    {result.suggestions.map((s, i) => (
                      <div key={i} className={`flex gap-2 p-2.5 rounded-lg text-sm border-l-2 ${i < 3 ? 'border-red-400 bg-red-50' : i < 6 ? 'border-yellow-400 bg-yellow-50' : 'border-blue-400 bg-blue-50'}`}>
                        <span className="shrink-0">{i < 3 ? '⚡' : i < 6 ? '→' : '·'}</span>
                        <span className="text-gray-700">{s}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-100 rounded-lg text-sm text-green-700">
                    <span>✅</span> Great resume! No major improvements needed.
                  </div>
                )}
              </div>
            </div>

            {/* Skills */}
            <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Skills Detected ({result.skills?.length ?? 0})</h3>
              {result.skills?.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {result.skills.map(s => (
                    <span key={s} className="text-xs px-3 py-1 bg-blue-50 text-blue-700 border border-blue-100 rounded-full font-medium">{s}</span>
                  ))}
                </div>
              ) : <p className="text-sm text-gray-400">No recognisable skills found.</p>}
            </div>

            {/* Skill gaps */}
            {result.skillGaps?.length > 0 && (
              <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Skill Gaps</h3>
                <p className="text-xs text-gray-400 mb-3">These in-demand skills are missing from your resume.</p>
                <div className="flex flex-wrap gap-2">
                  {result.skillGaps.map(s => (
                    <span key={s} className="text-xs px-3 py-1 bg-red-50 text-red-600 border border-red-100 rounded-full font-medium">{s}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Education / Experience / Roles */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { title: 'Education',      data: result.education,               empty: 'Not detected' },
                { title: 'Experience',     data: result.experience?.slice(0, 4), empty: 'Not detected' },
                { title: 'Matching Roles', data: result.matchingRoles,           empty: 'Upload resume for matches' },
              ].map(({ title, data, empty }) => (
                <div key={title} className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">{title}</h3>
                  {data?.length > 0 ? (
                    <ul className="space-y-1.5">
                      {data.map((item, i) => (
                        <li key={i} className="text-sm text-gray-600 flex gap-1.5"><span className="text-blue-400">▸</span>{item}</li>
                      ))}
                    </ul>
                  ) : <p className="text-sm text-gray-400">{empty}</p>}
                </div>
              ))}
            </div>

            <div className="text-center">
              <button onClick={() => { setResult(null); setFile(null); setProgress(0); }}
                className="px-6 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-500 hover:bg-gray-50">
                ↩ Analyse Another Resume
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}