import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import toast from 'react-hot-toast';

export default function NewClub() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', description: '', image: '', category: '' });
  const [loading, setLoading] = useState(false);

  const hc = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return toast.error('Club name is required');
    setLoading(true);
    try {
      await axiosInstance.post('/clubs', form);
      toast.success('Club created!');
      navigate('/clubs');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to create club');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">New Club</h1>
        <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { name: 'name',     label: 'Club Name *', type: 'text', placeholder: 'e.g. Coding Club'  },
              { name: 'category', label: 'Category',    type: 'text', placeholder: 'e.g. Technology'   },
              { name: 'image',    label: 'Image URL',   type: 'url',  placeholder: 'https://…'         },
            ].map(({ name, label, type, placeholder }) => (
              <div key={name}>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
                <input name={name} type={type} value={form[name]} onChange={hc} placeholder={placeholder}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            ))}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
              <textarea name="description" value={form.description} onChange={hc} rows={4} placeholder="What is this club about?"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y" />
            </div>
            <div className="flex gap-3">
              <button type="button" onClick={() => navigate('/clubs')} className="flex-1 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-500 hover:bg-gray-50">Cancel</button>
              <button type="submit" disabled={loading} className="flex-1 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 disabled:opacity-60">
                {loading ? 'Creating…' : 'Create Club'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}