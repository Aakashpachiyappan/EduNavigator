import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../api/axiosInstance';
import { Link } from 'react-router-dom';
import {
  ClipboardList, Mic, Briefcase, TrendingUp, Star,
  BrainCircuit, ArrowRight, UploadCloud, Target
} from 'lucide-react';
import StatCard from '../components/StatCard';

export default function StudentDashboard() {
  const { user } = useAuth();
  
  const [stats, setStats] = useState({
    totalApplications: 0,
    acceptedOffers: 0,
    interviewSessions: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosInstance.get('/dashboard')
      .then(({ data }) => {
        setStats({
          totalApplications: data.totalApplications || 0,
          acceptedOffers: data.applicationsByStatus?.accepted || 0,
          interviewSessions: data.interviewSessions || 0,
        });
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6 max-w-6xl mx-auto px-4 pb-12">
      
      {/* ── Welcome Banner ─────────────────────────────────────────────── */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-8 shadow-lg">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-blue-400/20 rounded-full blur-2xl translate-y-1/3 -translate-x-1/4" />
        
        <div className="relative z-10">
          <p className="text-blue-100 font-medium mb-2 opacity-90 tracking-wide uppercase text-xs">Your AI Career Dashboard</p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-2">
            Welcome back, {user?.name || 'Student'} 👋
          </h2>
          <p className="text-blue-100 text-sm max-w-md leading-relaxed opacity-90">
            Track your job applications, polish your resume with AI, and practice mock interviews to land your dream role.
          </p>
        </div>
      </div>

      {/* ── Core AI Stats ──────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {loading ? (
          Array(3).fill(0).map((_, i) => <div key={i} className="skeleton h-28 rounded-2xl" />)
        ) : (
          <>
            {/* Total Applications - Smart Empty State */}
            {stats.totalApplications > 0 ? (
              <StatCard gradient icon={ClipboardList} label="Job Applications" value={stats.totalApplications} sub="Track your active roles" />
            ) : (
              <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-2">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                    <Briefcase size={20} />
                  </div>
                  <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded-full">Explore</span>
                </div>
                <div>
                  <h3 className="text-gray-800 font-bold mb-1">0 Applications</h3>
                  <p className="text-xs text-gray-500">No applications yet — start applying to jobs today!</p>
                </div>
              </div>
            )}

            {/* Mock Interviews - Smart Empty State */}
            {stats.interviewSessions > 0 ? (
              <StatCard color="purple" icon={Mic} label="Mock Interviews" value={stats.interviewSessions} sub="Practice sessions completed" />
            ) : (
              <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-2">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                    <BrainCircuit size={20} />
                  </div>
                  <span className="text-xs font-semibold text-purple-600 bg-purple-50 px-2 py-1 rounded-full">New</span>
                </div>
                <div>
                  <h3 className="text-gray-800 font-bold mb-1">No Practice Yet</h3>
                  <p className="text-xs text-gray-500">Start your first AI mock interview to boost confidence.</p>
                </div>
              </div>
            )}

            {/* Fixed AI Insight Card */}
            <div className="bg-gradient-to-br from-indigo-50 to-white rounded-2xl border border-indigo-100 p-5 shadow-sm flex flex-col justify-between">
              <div className="flex justify-between items-start mb-2">
                <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
                  <Star size={20} />
                </div>
                <span className="text-xs font-semibold text-green-600 bg-green-50 border border-green-100 px-2 py-1 rounded-full">Strong Profile</span>
              </div>
              <div>
                <h3 className="text-gray-800 font-bold mb-1">Resume AI Score</h3>
                <p className="text-xs text-gray-600">Upload an updated resume to recalculate your strength.</p>
              </div>
            </div>
          </>
        )}
      </div>

      {/* ── Main 2-Column Layout ───────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        
        {/* Left Column: Quick Actions (Focus) */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-full -z-10" />
          
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
              <Target size={18} />
            </div>
            <h3 className="text-lg font-bold text-gray-800">Quick Actions</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            <Link to="/jobs" className="group p-5 bg-gray-50 border border-gray-100 rounded-2xl hover:bg-blue-50 hover:border-blue-100 transition-all duration-300">
              <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-blue-600 mb-4 group-hover:scale-110 transition-transform">
                <Briefcase size={20} />
              </div>
              <h4 className="font-bold text-gray-800 mb-1">Browse Jobs</h4>
              <p className="text-xs text-gray-500 mb-3">Find AI matched roles</p>
              <div className="text-xs font-semibold text-blue-600 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0">
                Explore <ArrowRight size={12} />
              </div>
            </Link>

            <Link to="/interview" className="group p-5 bg-gray-50 border border-gray-100 rounded-2xl hover:bg-purple-50 hover:border-purple-100 transition-all duration-300">
              <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-purple-600 mb-4 group-hover:scale-110 transition-transform">
                <Mic size={20} />
              </div>
              <h4 className="font-bold text-gray-800 mb-1">Mock Interview</h4>
              <p className="text-xs text-gray-500 mb-3">AI simulated practice</p>
              <div className="text-xs font-semibold text-purple-600 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0">
                Start Session <ArrowRight size={12} />
              </div>
            </Link>

            <Link to="/resume-checker" className="group p-5 bg-gray-50 border border-gray-100 rounded-2xl hover:bg-orange-50 hover:border-orange-100 transition-all duration-300">
              <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-orange-600 mb-4 group-hover:scale-110 transition-transform">
                <UploadCloud size={20} />
              </div>
              <h4 className="font-bold text-gray-800 mb-1">Check Resume</h4>
              <p className="text-xs text-gray-500 mb-3">Get ATS formatting score</p>
              <div className="text-xs font-semibold text-orange-600 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0">
                Upload Document <ArrowRight size={12} />
              </div>
            </Link>

            <Link to="/recommendations" className="group p-5 bg-gray-50 border border-gray-100 rounded-2xl hover:bg-green-50 hover:border-green-100 transition-all duration-300">
              <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-green-600 mb-4 group-hover:scale-110 transition-transform">
                <TrendingUp size={20} />
              </div>
              <h4 className="font-bold text-gray-800 mb-1">AI Job Matches</h4>
              <p className="text-xs text-gray-500 mb-3">Custom tailored skills</p>
              <div className="text-xs font-semibold text-green-600 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0">
                View Recommendations <ArrowRight size={12} />
              </div>
            </Link>

          </div>
        </div>

        {/* Right Column: AI Insights */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 overflow-hidden relative h-full flex flex-col">
          
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
              <BrainCircuit size={18} />
            </div>
            <h3 className="text-lg font-bold text-gray-800">Your AI Insights</h3>
          </div>

          <div className="flex-1 space-y-4">
            
            {/* Example insight 1 */}
            <div className="p-4 rounded-2xl border border-blue-50 bg-blue-50/50 flex gap-4 items-start">
              <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                <TrendingUp size={14} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-800 mb-1">Suggested Role</h4>
                <p className="text-sm text-gray-600">Based on your recent mock interviews, you show strong aptitude for <span className="font-semibold text-blue-700">Frontend Developer</span> roles. Focus your next applications here!</p>
              </div>
            </div>

            {/* Example insight 2 */}
            <div className="p-4 rounded-2xl border border-orange-50 bg-orange-50/50 flex gap-4 items-start">
              <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center shrink-0 mt-0.5">
                <Target size={14} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-800 mb-1">Identified Skill Gap</h4>
                <p className="text-sm text-gray-600">Our engine noticed you struggled with Node.js architecture questions. Try taking a quick brush-up course!</p>
              </div>
            </div>

            {/* Example insight 3 */}
            <div className="p-4 rounded-2xl border border-green-50 bg-green-50/50 flex gap-4 items-start">
              <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center shrink-0 mt-0.5">
                <Star size={14} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-800 mb-1">Resume Formatting Strength</h4>
                <p className="text-sm text-gray-600">Your latest uploaded resume scores <span className="font-semibold text-green-700">82/100</span>. Adding more measurable impact metrics can push this to 90+.</p>
              </div>
            </div>

          </div>

          <div className="mt-6 pt-4 border-t border-gray-100 text-center">
            <Link to="/recommendations" className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 hover:underline inline-flex items-center gap-1">
              Analyze my full profile <ArrowRight size={14} />
            </Link>
          </div>
        </div>

      </div>

    </div>
  );
}