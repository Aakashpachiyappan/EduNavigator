import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import { ArrowLeft, User, Calendar, MessageSquare } from 'lucide-react';

export default function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    console.log("Fetching post ID:", id);
    axiosInstance.get(`/forum/${id}`)
      .then(({ data }) => {
        console.log("Post data fetched:", data);
        setPost(data);
      })
      .catch((err) => {
        console.error("Error fetching post data:", err);
        setError('Failed to load the post. It might have been deleted.');
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="skeleton h-8 w-1/3 rounded-lg mb-4" />
        <div className="skeleton h-40 rounded-xl" />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <button onClick={() => navigate('/forum')} className="flex items-center gap-2 text-blue-600 font-medium mb-6 hover:underline">
          <ArrowLeft size={16} /> Back to Forum
        </button>
        <div className="bg-red-50 border border-red-100 text-red-600 p-6 rounded-2xl text-center">
          {error || 'Post not found.'}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      
      <button onClick={() => navigate('/forum')} className="flex items-center gap-2 text-slate-500 hover:text-blue-600 font-medium mb-6 transition-colors">
        <ArrowLeft size={16} /> Back to Forum
      </button>

      <article className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
        
        {/* Header */}
        <header className="mb-8 pb-8 border-b border-gray-50">
          <div className="flex items-center gap-2 text-blue-600 bg-blue-50 w-max px-3 py-1 rounded-full text-xs font-semibold mb-4">
            <MessageSquare size={14} /> Forum Discussion
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-4 leading-tight">{post.title}</h1>
          
          <div className="flex items-center gap-6 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center shrink-0">
                <User size={16} />
              </div>
              <span className="font-medium text-gray-700">{post.authorName}</span>
            </div>
            
            <div className="flex items-center gap-1.5 opacity-80">
              <Calendar size={14} />
              {new Date(post.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="prose prose-slate max-w-none prose-p:leading-relaxed prose-a:text-blue-600 text-gray-700">
          {post.content.split('\n').map((paragraph, idx) => (
            <p key={idx} className="mb-4">{paragraph}</p>
          ))}
        </div>
      </article>

    </div>
  );
}
