import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Swal from 'sweetalert2';
import api from '../services/api';
import { Heart, MessageCircle, Share2, Trash2, Edit3 } from 'lucide-react';

const BlogDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState("");
  
  // LocalStorage se User ID nikalna
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isAuthor = blog?.author?._id === user?._id;

  useEffect(() => { fetchBlog(); }, [id]);

  const fetchBlog = async () => {
    try {
      const res = await api.get(`/blogs/${id}`);
      setBlog(res.data);
      setLoading(false);
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Oops', text: 'Blog load nahi ho saka!' });
      navigate('/');
    }
  };

  const handleLike = async () => {
    try {
      await api.post(`/blogs/${id}/like`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      fetchBlog();
    } catch (err) {
      Swal.fire({ icon: 'warning', title: 'Login required', text: 'Like karne ke liye login karein!' });
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    try {
      await api.post(`/blogs/${id}/comment`, { text: comment }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setComment("");
      fetchBlog();
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Error', text: 'Comment post nahi ho saka.' });
    }
  };

  const handleDelete = async () => {
    const result = await Swal.fire({ title: 'Delete?', text: "Wapas nahi milega!", icon: 'warning', showCancelButton: true, confirmButtonColor: '#d33' });
    if (result.isConfirmed) {
      await api.delete(`/blogs/${id}`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }});
      Swal.fire("Deleted!", "Post uda diya gaya.", "success");
      navigate('/');
    }
  };

  if (loading) return <div className="text-teal-400 pt-40 text-center font-bold">Loading masterpiece...</div>;

  return (
    <div className="min-h-screen bg-white dark:bg-[#020617] transition-colors pt-24 pb-20 px-6">
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="max-w-3xl mx-auto">
        
        {blog.coverImage && (
          <img src={blog.coverImage} className="w-full h-80 object-cover rounded-3xl mb-8 shadow-2xl" alt="Cover" />
        )}

        <h1 className="text-5xl font-black text-gray-900 dark:text-white mb-6 tracking-tight">{blog.title}</h1>
        
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-full bg-teal-500/20 flex items-center justify-center font-bold text-teal-500">
            {blog.author?.name?.[0]}
          </div>
          <div>
            <p className="font-bold text-gray-900 dark:text-white">{blog.author?.name}</p>
            <p className="text-sm text-gray-500">{new Date(blog.createdAt).toLocaleDateString()}</p>
          </div>
        </div>

        <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed mb-10 whitespace-pre-line">{blog.content}</p>
        
        {/* Actions Bar */}
        <div className="flex items-center justify-between border-y border-gray-200 dark:border-white/10 py-6 mb-10">
          <div className="flex gap-6">
            <button onClick={handleLike} className="flex items-center gap-2 hover:text-red-500 transition"><Heart /> {blog.likes?.length || 0}</button>
            <button className="flex items-center gap-2"><MessageCircle /> {blog.comments?.length || 0}</button>
          </div>
          {isAuthor && (
            <div className="flex gap-4">
              <button onClick={() => navigate(`/edit/${id}`)} className="text-blue-500"><Edit3 size={20}/></button>
              <button onClick={handleDelete} className="text-red-500"><Trash2 size={20}/></button>
            </div>
          )}
        </div>

        {/* Comments Section */}
        <div className="bg-gray-50 dark:bg-[#0f172a] p-8 rounded-3xl">
          <h3 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">Discussion</h3>
          <form onSubmit={handleComment} className="flex gap-2 mb-8">
            <input value={comment} onChange={(e) => setComment(e.target.value)} className="flex-1 bg-white dark:bg-[#1e293b] p-3 rounded-xl border border-gray-200 dark:border-white/10 outline-none text-gray-900 dark:text-white" placeholder="Apni raay dein..." />
            <button className="bg-teal-500 text-white px-6 rounded-xl font-bold">Post</button>
          </form>
          {blog.comments?.map((c, i) => (
            <div key={i} className="mb-4 p-4 bg-white dark:bg-[#1e293b] rounded-xl border border-gray-100 dark:border-white/5">
              <p className="font-bold text-sm text-teal-500">{c.user?.name || "Anonymous"}</p>
              <p className="text-gray-600 dark:text-gray-300">{c.text}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default BlogDetail;