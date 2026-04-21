import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import toast from 'react-hot-toast';

export default function NewJobBoard() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ role: '', company: '', location: '', type: 'Full-time', description: '', skills: '', contact: '' });
  const [loading, setLoading] = useState(false);

  const hc = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.role.trim() || !form.company.trim()) return toast.error('Role and Company are required');
    setLoading(true);
    try {
      const payload = {
        ...form,
        skills: form.skills.split(',').map(s => s.trim()).filter(Boolean),
      };
      await axiosInstance.post('/jobs', payload);
      toast.success('Job posted!');
      navigate('/jobs');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to post job');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Post a Job</h1>
        <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { name: 'role',     label: 'Job Role *',  type: 'text', placeholder: 'e.g. Frontend Developer' },
              { name: 'company',  label: 'Company *',   type: 'text', placeholder: 'Company name'             },
              { name: 'location', label: 'Location',    type: 'text', placeholder: 'e.g. Remote, Mumbai'      },
              { name: 'contact',  label: 'Contact',     type: 'email', placeholder: 'hr@company.com'           },
              { name: 'skills',   label: 'Skills (comma-separated)', type: 'text', placeholder: 'React, Node.js, MongoDB' },
            ].map(({ name, label, type, placeholder }) => (
              <div key={name}>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
                <input name={name} type={type} value={form[name]} onChange={hc} placeholder={placeholder}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            ))}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Job Type</label>
              <select name="type" value={form.type} onChange={hc}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                {['Full-time','Internship','Part-time','Contract'].map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
              <textarea name="description" value={form.description} onChange={hc} rows={4} placeholder="Job description and responsibilities"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y" />
            </div>
            <div className="flex gap-3">
              <button type="button" onClick={() => navigate('/jobs')} className="flex-1 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-500 hover:bg-gray-50">Cancel</button>
              <button type="submit" disabled={loading} className="flex-1 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 disabled:opacity-60">
                {loading ? 'Posting…' : 'Post Job'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}