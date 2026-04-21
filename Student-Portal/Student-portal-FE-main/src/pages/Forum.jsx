import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Forum() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [posts,   setPosts]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [title,   setTitle]   = useState('');
  const [body,    setBody]    = useState('');
  const [posting, setPosting] = useState(false);
  const [search,  setSearch]  = useState('');

  useEffect(() => {
    axiosInstance.get('/forum')
      .then(({ data }) => setPosts(data))
      .catch(() => toast.error('Failed to load posts'))
      .finally(() => setLoading(false));
  }, []);

  const handlePost = async (e) => {
    e.preventDefault();
    if (!title.trim()) return toast.error('Title is required');
    setPosting(true);
    try {
      const { data } = await axiosInstance.post('/forum', { title, content: body });
      setPosts(p => [data, ...p]);
      setTitle(''); setBody('');
      toast.success('Post created!');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to post');
    } finally { setPosting(false); }
  };

  const filtered = posts.filter(p =>
    p.title?.toLowerCase().includes(search.toLowerCase()) ||
    p.body?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Discussion Forum</h1>

        {/* New post */}
        <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-5 mb-6">
          <h2 className="font-semibold text-gray-700 mb-3">Create a Post</h2>
          <form onSubmit={handlePost} className="space-y-3">
            <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Post title"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <textarea value={body} onChange={e => setBody(e.target.value)} placeholder="What's on your mind?" rows={3}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
            <button type="submit" disabled={posting}
              className="px-5 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 disabled:opacity-60">
              {posting ? 'Posting…' : 'Post'}
            </button>
          </form>
        </div>

        {/* Search */}
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search posts…"
          className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" />

        {/* Posts */}
        {loading ? (
          <div className="text-center py-12 text-gray-400">Loading…</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12 text-gray-400">No posts found.</div>
        ) : (
          <div className="space-y-4">
            {filtered.map(post => (
              <div key={post._id} 
                   onClick={() => navigate(`/forum/${post._id}`)}
                   className="bg-white border border-gray-100 rounded-xl shadow-sm p-5 cursor-pointer hover:shadow-md transition-shadow group">
                <h3 className="font-semibold text-gray-800 mb-1 group-hover:text-blue-600 transition-colors">{post.title}</h3>
                {post.content && <p className="text-sm text-gray-600 mb-3 leading-relaxed line-clamp-3">{post.content}</p>}
                {post.body && <p className="text-sm text-gray-600 mb-3 leading-relaxed line-clamp-3">{post.body}</p>}
                <div className="text-xs text-slate-500 font-medium flex gap-2 items-center">
                  <span className="bg-slate-100 px-2 py-0.5 rounded-md">By {post.authorName || post.author?.name || 'Unknown'}</span> 
                  <span className="text-slate-400">•</span>
                  <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}