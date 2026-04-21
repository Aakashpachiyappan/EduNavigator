import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import toast from 'react-hot-toast';

export default function NewEvent() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: '', description: '', date: '', location: '', image: '' });
  const [loading, setLoading] = useState(false);

  const hc = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return toast.error('Title is required');
    setLoading(true);
    try {
      await axiosInstance.post('/events', form);
      toast.success('Event created!');
      navigate('/events');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to create event');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">New Event</h1>
        <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { name: 'title',       label: 'Title *',       type: 'text',           placeholder: 'Event title'       },
              { name: 'date',        label: 'Date & Time',   type: 'datetime-local',  placeholder: ''                 },
              { name: 'location',    label: 'Location',      type: 'text',           placeholder: 'e.g. Main Auditorium' },
              { name: 'image',       label: 'Image URL',     type: 'url',            placeholder: 'https://…'         },
            ].map(({ name, label, type, placeholder }) => (
              <div key={name}>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
                <input name={name} type={type} value={form[name]} onChange={hc} placeholder={placeholder}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            ))}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
              <textarea name="description" value={form.description} onChange={hc} rows={4} placeholder="Event description"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y" />
            </div>
            <div className="flex gap-3">
              <button type="button" onClick={() => navigate('/events')} className="flex-1 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-500 hover:bg-gray-50">Cancel</button>
              <button type="submit" disabled={loading} className="flex-1 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 disabled:opacity-60">
                {loading ? 'Creating…' : 'Create Event'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}