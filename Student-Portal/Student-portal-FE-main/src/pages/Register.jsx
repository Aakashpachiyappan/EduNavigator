import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import toast from 'react-hot-toast';

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '', department: '', role: 'student' });
  const [loading, setLoading] = useState(false);
  const [pendingApproval, setPendingApproval] = useState(false);

  const hc = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) return toast.error('Passwords do not match');
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters');
    setLoading(true);
    try {
      const { data } = await axiosInstance.post('/auth/register', {
        name: form.name, email: form.email, password: form.password,
        department: form.department, role: form.role,
      });
      if (data.pending) {
        setPendingApproval(true);
      } else {
        toast.success('Account created! Please log in.');
        navigate('/login');
      }
    } catch (err) {
      toast.error(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  if (pendingApproval) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 max-w-md w-full text-center">
        <div className="text-5xl mb-4">⏳</div>
        <h2 className="text-xl font-bold text-gray-800 mb-3">Awaiting Approval</h2>
        <p className="text-gray-500 text-sm mb-6 leading-relaxed">
          Your Admin registration has been submitted. A Superadmin will review and approve your account.
        </p>
        <Link to="/login" className="inline-block px-6 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700">
          Back to Login
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="text-4xl mb-3">🚀</div>
          <h1 className="text-2xl font-bold text-gray-800">Create Account</h1>
          <p className="text-gray-500 mt-1">Join the EduNavigator platform</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Role toggle */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Account Type</label>
              <div className="flex gap-2">
                {['student', 'admin'].map(r => (
                  <button key={r} type="button" onClick={() => setForm(p => ({ ...p, role: r }))}
                    className={`flex-1 py-2 border rounded-lg text-sm font-medium capitalize transition-colors ${
                      form.role === r
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 text-gray-500 hover:bg-gray-50'
                    }`}>
                    {r === 'student' ? '👤 Student' : '⚙️ Admin'}
                  </button>
                ))}
              </div>
              {form.role === 'admin' && (
                <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-xs text-yellow-700">
                  ⚠ Admin accounts require Superadmin approval before login.
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name *</label>
              <input type="text" name="name" value={form.name} onChange={hc} required placeholder="Your full name"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email *</label>
              <input type="email" name="email" value={form.email} onChange={hc} required placeholder="your@email.com"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Department</label>
              <input type="text" name="department" value={form.department} onChange={hc} placeholder="e.g. Computer Science"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Password *</label>
                <input type="password" name="password" value={form.password} onChange={hc} required placeholder="Min 6 chars"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm *</label>
                <input type="password" name="confirm" value={form.confirm} onChange={hc} required placeholder="Repeat"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg text-sm font-semibold transition-colors">
              {loading ? 'Creating account…' : '🚀 Create Account'}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-500">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 font-medium hover:underline">Sign in →</Link>
          </div>
        </div>
      </div>
    </div>
  );
}