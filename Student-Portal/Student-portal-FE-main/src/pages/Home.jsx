import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const features = [
  { path: '/forum',           icon: '💬', label: 'Discussion Forum',  desc: 'Share ideas and connect with fellow students.' },
  { path: '/clubs',           icon: '🏆', label: 'Campus Clubs',      desc: 'Find and join student organizations.' },
  { path: '/events',          icon: '📅', label: 'Events',            desc: 'Stay updated with campus events and workshops.' },
  { path: '/jobs',            icon: '💼', label: 'Job Board',         desc: 'Browse internships and job opportunities.' },
  { path: '/resume-checker',  icon: '🧠', label: 'Resume Checker',    desc: 'AI-powered resume analysis and ATS scoring.' },
  { path: '/recommendations', icon: '🎯', label: 'AI Job Matches',    desc: 'Personalised job recommendations from AI.' },
];

export default function Home() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const go = (path) => !user ? navigate('/login') : navigate(path);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-5xl mx-auto">

        {/* Hero */}
        <div className="text-center mb-12">
          <div className="text-5xl mb-4">🎓</div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">EduNavigator</h1>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            Your smart academic and career management platform — all in one place.
          </p>
          <div className="mt-6 flex gap-3 justify-center">
            {user ? (
              <Link to="/dashboard" className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700">
                Go to Dashboard →
              </Link>
            ) : (
              <>
                <Link to="/login"    className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700">Sign In</Link>
                <Link to="/register" className="px-6 py-2.5 border border-blue-600 text-blue-600 rounded-lg font-semibold hover:bg-blue-50">Create Account</Link>
              </>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-10">
          {[
            { value: '2,400+', label: 'Students',   color: 'text-blue-600' },
            { value: '180+',   label: 'Jobs Posted', color: 'text-green-600' },
            { value: '95%',    label: 'Match Rate',  color: 'text-purple-600' },
            { value: '50+',    label: 'Clubs',       color: 'text-orange-500' },
          ].map(({ value, label, color }) => (
            <div key={label} className="bg-white border border-gray-100 rounded-xl p-5 text-center shadow-sm">
              <div className={`text-2xl font-bold ${color}`}>{value}</div>
              <div className="text-sm text-gray-500 mt-1">{label}</div>
            </div>
          ))}
        </div>

        {/* Features */}
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Platform Features</h2>
        <div className="grid grid-cols-3 gap-4">
          {features.map(({ path, icon, label, desc }) => (
            <div key={path} onClick={() => go(path)}
              className="bg-white border border-gray-100 rounded-xl p-5 cursor-pointer hover:shadow-md hover:border-blue-200 transition-all">
              <div className="text-2xl mb-3">{icon}</div>
              <h3 className="font-semibold text-gray-800 mb-1">{label}</h3>
              <p className="text-sm text-gray-500">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
