import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import toast from 'react-hot-toast';

/* ── Setup ─────────────────────────────────────────────────────────────── */
function SetupScreen({ onStart }) {
  const [mode,    setMode]    = useState('skills');
  const [skills,  setSkills]  = useState('');
  const [file,    setFile]    = useState(null);
  const [loading, setLoading] = useState(false);

  const handleStart = async () => {
    setLoading(true);
    try {
      let data;
      if (mode === 'resume') {
        if (!file) return toast.error('Please upload your resume PDF');
        const fd = new FormData(); fd.append('resume', file);
        const res = await axiosInstance.post('/interview/start-from-resume', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        data = res.data;
      } else {
        const parsed = skills.split(',').map(s => s.trim()).filter(Boolean);
        if (!parsed.length) return toast.error('Enter at least one skill');
        const res = await axiosInstance.post('/interview/start', { skills: parsed });
        data = res.data;
      }
      onStart(data);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to start interview');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🎤</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">AI Interview Simulator</h1>
          <p className="text-gray-500 text-sm">Practice a real-world interview and get scored feedback on every answer.</p>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
          {/* Mode toggle */}
          <div className="grid grid-cols-2 gap-2 mb-5">
            {[['skills', '⌨ Enter Skills'], ['resume', '📄 Upload Resume']].map(([m, label]) => (
              <button key={m} type="button" onClick={() => setMode(m)}
                className={`py-2.5 border rounded-lg text-sm font-medium transition-colors ${
                  mode === m ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 text-gray-500 hover:bg-gray-50'
                }`}>
                {label}
              </button>
            ))}
          </div>

          {mode === 'skills' ? (
            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Your Skills (comma-separated)</label>
              <input value={skills} onChange={e => setSkills(e.target.value)} placeholder="e.g. React, Node.js, Python"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          ) : (
            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Upload Resume (PDF)</label>
              <div onClick={() => document.getElementById('iv-resume').click()}
                className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${file ? 'border-green-300 bg-green-50' : 'border-gray-200 hover:border-gray-300'}`}>
                <input id="iv-resume" type="file" accept=".pdf" className="hidden" onChange={e => e.target.files[0] && setFile(e.target.files[0])} />
                <div className="text-2xl mb-2">{file ? '✅' : '📤'}</div>
                <p className="text-sm text-gray-500">{file ? file.name : 'Click to select resume PDF'}</p>
              </div>
            </div>
          )}

          {/* Info boxes */}
          <div className="grid grid-cols-3 gap-2 mb-5">
            {[['⚡', '7–10', 'Questions'], ['🎯', '3 Types', 'Categories'], ['📊', 'Scored', 'Feedback']].map(([icon, val, lbl]) => (
              <div key={lbl} className="text-center p-3 bg-gray-50 border border-gray-100 rounded-lg">
                <div className="text-lg mb-1">{icon}</div>
                <div className="text-sm font-semibold text-gray-700">{val}</div>
                <div className="text-xs text-gray-400">{lbl}</div>
              </div>
            ))}
          </div>

          <button onClick={handleStart} disabled={loading}
            className="w-full py-3 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 disabled:opacity-60 transition-colors">
            {loading ? 'Starting…' : '🎤 Start Interview'}
          </button>
        </div>

        <div className="text-center mt-4">
          <Link to="/interview/dashboard" className="text-sm text-blue-600 hover:underline">View past interview results →</Link>
        </div>
      </div>
    </div>
  );
}

/* ── Bubble ─────────────────────────────────────────────────────────────── */
function Bubble({ role, children }) {
  const isAI = role === 'ai';
  return (
    <div className={`flex ${isAI ? 'justify-start' : 'justify-end'} mb-3 items-end gap-2`}>
      {isAI && <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-sm shrink-0">🤖</div>}
      <div className={`max-w-[78%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
        isAI ? 'bg-white border border-gray-200 text-gray-800 rounded-tl-none' : 'bg-blue-600 text-white rounded-tr-none'
      }`}>
        {children}
      </div>
      {!isAI && <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-sm shrink-0">👤</div>}
    </div>
  );
}

/* ── Typing dots ─────────────────────────────────────────────────────────── */
function TypingDots() {
  return (
    <div className="flex gap-1.5 px-4 py-3 bg-white border border-gray-200 rounded-2xl rounded-tl-none w-fit mb-3">
      {[0,1,2].map(i => (
        <div key={i} className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: `${i * 0.18}s` }} />
      ))}
    </div>
  );
}

/* ── Feedback card ──────────────────────────────────────────────────────── */
function FeedbackCard({ score, feedback }) {
  const [open, setOpen] = useState(false);
  const color = score >= 8 ? 'text-green-600' : score >= 5 ? 'text-yellow-600' : 'text-red-500';
  return (
    <div className="mx-10 mb-3 bg-gray-50 border border-gray-100 rounded-xl p-3">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className={`text-lg font-bold ${color}`}>{score}<span className="text-sm font-normal text-gray-400">/10</span></span>
          <span className="text-xs text-gray-400">Answer Score</span>
        </div>
        <button onClick={() => setOpen(o => !o)} className="text-xs text-blue-600 hover:underline">{open ? 'Hide' : 'Feedback'}</button>
      </div>
      {open && (
        <div className="mt-2 space-y-2">
          {feedback.strengths?.length > 0 && <div><p className="text-xs font-semibold text-green-600 mb-1">✓ Strengths</p>{feedback.strengths.map((s,i)=><p key={i} className="text-xs text-gray-600 pl-3">• {s}</p>)}</div>}
          {feedback.weaknesses?.length > 0 && <div><p className="text-xs font-semibold text-red-500 mb-1">✗ To Improve</p>{feedback.weaknesses.map((s,i)=><p key={i} className="text-xs text-gray-600 pl-3">• {s}</p>)}</div>}
          {feedback.tip && <p className="text-xs text-blue-600 bg-blue-50 border border-blue-100 rounded-lg p-2">💡 {feedback.tip}</p>}
        </div>
      )}
    </div>
  );
}

/* ── Chat ───────────────────────────────────────────────────────────────── */
function ChatScreen({ sessionData, onComplete }) {
  const [messages,  setMessages]  = useState([]);
  const [input,     setInput]     = useState('');
  const [sending,   setSending]   = useState(false);
  const [currentQ,  setCurrentQ]  = useState(sessionData.firstQuestion);
  const [answered,  setAnswered]  = useState(0);
  const [feedbacks, setFeedbacks] = useState([]);
  const [isTyping,  setIsTyping]  = useState(false);
  const bottomRef = useRef(null);
  const total = sessionData.totalQuestions;
  const sessionId = sessionData.sessionId;

  function renderQuestion(q, idx, total) {
    return (
      <div>
        <div className="flex gap-2 mb-2">
          <span className="text-xs px-2 py-0.5 bg-blue-50 text-blue-600 border border-blue-100 rounded-full capitalize">{q.category}</span>
          <span className="text-xs px-2 py-0.5 bg-gray-50 text-gray-500 border border-gray-100 rounded-full capitalize">{q.difficulty}</span>
        </div>
        <p className="text-xs text-gray-400 mb-1">Q{idx + 1} of {total}</p>
        <p className="text-sm font-medium text-gray-800 leading-relaxed">{q.text}</p>
      </div>
    );
  }

  useEffect(() => {
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setMessages([{ role: 'ai', content: renderQuestion(sessionData.firstQuestion, 0, total) }]);
    }, 800);
  }, []);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim() || sending) return;
    const answer = input.trim();
    setInput(''); setSending(true);
    setMessages(p => [...p, { role: 'user', content: answer }]);
    const answerMsgIdx = messages.length;
    try {
      setIsTyping(true);
      const { data } = await axiosInstance.post(`/interview/${sessionId}/evaluate`, { questionId: currentQ.id, answerText: answer });
      setIsTyping(false);
      setFeedbacks(p => [...p, { msgIdx: answerMsgIdx, score: data.score, feedback: data.feedback }]);
      setAnswered(p => p + 1);
      if (data.isLast) {
        setMessages(p => [...p, { role: 'ai', content: '🎉 Interview complete! Calculating your results…' }]);
        setTimeout(() => onComplete(data), 1200);
      } else {
        setCurrentQ(data.nextQuestion);
        setMessages(p => [...p, { role: 'ai', content: renderQuestion(data.nextQuestion, data.nextQuestion.index, total) }]);
      }
    } catch (err) {
      setIsTyping(false);
      toast.error(err.response?.data?.error || 'Failed to submit answer');
    } finally { setSending(false); }
  };

  const progress = Math.round((answered / total) * 100);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top bar */}
      <div className="sticky top-14 z-40 bg-white border-b border-gray-100 px-5 py-3 flex items-center justify-between gap-4">
        <span className="font-semibold text-gray-700 text-sm">🎤 AI Interview</span>
        <div className="flex-1 max-w-xs">
          <div className="flex justify-between text-xs text-gray-400 mb-1"><span>Progress</span><span>{answered}/{total}</span></div>
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-blue-500 rounded-full transition-all" style={{ width: `${progress}%` }} />
          </div>
        </div>
        <span className="text-sm font-semibold text-blue-600">{progress}%</span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 pb-28 max-w-3xl mx-auto w-full">
        <div className="text-center text-xs text-gray-400 mb-4 p-3 bg-white border border-gray-100 rounded-xl">
          Interview started · {total} questions · Press Enter to send
        </div>
        {messages.map((msg, i) => (
          <div key={i}>
            <Bubble role={msg.role}>{msg.content}</Bubble>
            {msg.role === 'user' && feedbacks.find(f => f.msgIdx === i - 1) && (() => {
              const fb = feedbacks.find(f => f.msgIdx === i - 1);
              return fb ? <FeedbackCard score={fb.score} feedback={fb.feedback} /> : null;
            })()}
          </div>
        ))}
        {isTyping && (
          <div className="flex items-end gap-2 mb-3">
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-sm shrink-0">🤖</div>
            <TypingDots />
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="sticky bottom-6 w-full max-w-3xl mx-auto z-40 px-4">
        <div className="bg-white border border-gray-200 rounded-2xl shadow-lg flex items-end gap-2 p-2 transition-all duration-300 focus-within:shadow-xl focus-within:border-blue-300">
          <textarea
            value={input}
            onChange={e => {
              setInput(e.target.value);
              e.target.style.height = 'auto';
              e.target.style.height = Math.min(e.target.scrollHeight, 150) + 'px';
            }}
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
                e.target.style.height = 'auto';
              }
            }}
            placeholder="Type your answer... (Enter to send)"
            rows={1}
            className="flex-1 px-3 py-2 text-sm resize-none bg-transparent focus:outline-none max-h-[150px] overflow-y-auto w-full"
            style={{ minHeight: '44px' }}
          />
          <button
            onClick={() => {
              handleSend();
            }}
            disabled={!input.trim() || sending}
            className="w-10 h-10 shrink-0 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:bg-gray-200 disabled:text-gray-400 flex items-center justify-center transition-colors shadow-sm"
          >
            {sending ? '...' : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Results ────────────────────────────────────────────────────────────── */
function ResultsScreen({ results, onRedo }) {
  const { finalScore, tipsSummary } = results;
  const scoreColor = finalScore.overall >= 70 ? '#10b981' : finalScore.overall >= 40 ? '#f59e0b' : '#ef4444';
  const label = finalScore.overall >= 70 ? 'Excellent' : finalScore.overall >= 40 ? 'Good Performance' : 'Keep Practising';
  const r = 68, circ = 2 * Math.PI * r;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-block px-4 py-1 bg-green-50 border border-green-100 rounded-full text-xs text-green-600 font-medium mb-3">Interview Complete</div>
          <h1 className="text-2xl font-bold text-gray-800">Your Results</h1>
        </div>

        {/* Score */}
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-8 text-center mb-4">
          <div className="relative inline-flex items-center justify-center mb-4">
            <svg width="160" height="160" style={{ transform: 'rotate(-90deg)' }}>
              <circle cx="80" cy="80" r={r} stroke="#e5e7eb" strokeWidth="12" fill="none" />
              <circle cx="80" cy="80" r={r} stroke={scoreColor} strokeWidth="12" fill="none"
                strokeDasharray={circ} strokeDashoffset={circ - (finalScore.overall / 100) * circ}
                style={{ transition: 'stroke-dashoffset 1.5s ease' }} />
            </svg>
            <div className="absolute text-center">
              <div className="text-3xl font-bold" style={{ color: scoreColor }}>{finalScore.overall}</div>
              <div className="text-xs text-gray-400">/ 100</div>
            </div>
          </div>
          <div className="text-lg font-semibold mb-6" style={{ color: scoreColor }}>{label}</div>

          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'Technical',     value: finalScore.technical,     color: '#3b82f6', icon: '🧠' },
              { label: 'Communication', value: finalScore.communication, color: '#8b5cf6', icon: '💬' },
              { label: 'Confidence',    value: finalScore.confidence,    color: '#10b981', icon: '🎯' },
            ].map(({ label, value, color, icon }) => (
              <div key={label} className="p-4 bg-gray-50 border border-gray-100 rounded-xl text-center">
                <div className="text-xl mb-1">{icon}</div>
                <div className="text-xl font-bold" style={{ color }}>{value}</div>
                <div className="text-xs text-gray-400 mt-1">{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Tips */}
        {tipsSummary?.length > 0 && (
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5 mb-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Improvement Tips</h3>
            <div className="space-y-2">
              {tipsSummary.map((tip, i) => (
                <div key={i} className="flex gap-2 p-3 bg-yellow-50 border border-yellow-100 rounded-lg text-sm">
                  <span className="text-yellow-500 shrink-0">→</span>
                  <span className="text-gray-700">{tip}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-3">
          <button onClick={onRedo} className="flex-1 py-3 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700">🔄 Try Again</button>
          <Link to="/interview/dashboard" className="flex-1 py-3 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 text-center">📊 View History</Link>
        </div>
      </div>
    </div>
  );
}

/* ── Main ───────────────────────────────────────────────────────────────── */
export default function InterviewSimulator() {
  const [phase,       setPhase]       = useState('setup');
  const [sessionData, setSessionData] = useState(null);
  const [results,     setResults]     = useState(null);

  const handleStart    = (data) => { setSessionData(data); setPhase('chat'); };
  const handleComplete = (data) => { setResults(data); setPhase('results'); };
  const handleRedo     = ()     => { setPhase('setup'); setSessionData(null); setResults(null); };

  if (phase === 'setup')   return <SetupScreen   onStart={handleStart} />;
  if (phase === 'chat')    return <ChatScreen     sessionData={sessionData} onComplete={handleComplete} />;
  if (phase === 'results') return <ResultsScreen  results={results} onRedo={handleRedo} />;
}
