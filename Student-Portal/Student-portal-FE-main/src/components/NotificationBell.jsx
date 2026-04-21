import { useState, useEffect, useRef } from 'react';
import axiosInstance from '../api/axiosInstance';
import { useAuth } from '../context/AuthContext';

export default function NotificationBell() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!user) return;
    axiosInstance.get('/notifications')
      .then(({ data }) => setNotifications(data.notifications || []))
      .catch(() => {});
  }, [user]);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const unread = notifications.filter(n => !n.read).length;

  const markRead = async (id) => {
    try {
      await axiosInstance.patch(`/notifications/${id}/read`);
      setNotifications(p => p.map(n => n._id === id ? { ...n, read: true } : n));
    } catch {}
  };

  const markAllRead = async () => {
    try {
      await axiosInstance.patch('/notifications/read-all');
      setNotifications(p => p.map(n => ({ ...n, read: true })));
    } catch {}
  };

  return (
    <div className="relative" ref={ref}>
      <button onClick={() => setOpen(o => !o)}
        className="relative p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors">
        🔔
        {unread > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-semibold">
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-gray-100 rounded-2xl shadow-xl z-50 overflow-hidden">
          <div className="flex justify-between items-center px-4 py-3 border-b border-gray-100">
            <span className="font-semibold text-gray-700 text-sm">Notifications</span>
            {unread > 0 && (
              <button onClick={markAllRead} className="text-xs text-blue-600 hover:underline">Mark all read</button>
            )}
          </div>
          <div className="max-h-72 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="text-center py-8 text-sm text-gray-400">No notifications</div>
            ) : (
              notifications.map(n => (
                <div key={n._id} onClick={() => markRead(n._id)}
                  className={`px-4 py-3 border-b border-gray-50 cursor-pointer hover:bg-gray-50 ${!n.read ? 'bg-blue-50' : ''}`}>
                  <p className="text-sm text-gray-700 leading-relaxed">{n.message}</p>
                  <p className="text-xs text-gray-400 mt-1">{new Date(n.createdAt).toLocaleDateString()}</p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
