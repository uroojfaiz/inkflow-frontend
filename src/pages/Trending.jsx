import { useEffect, useState } from 'react';
import api from '../services/api';
import { motion } from 'framer-motion';

const Trending = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const res = await api.get('/blogs/trending');
        setBlogs(res.data);
      } catch (err) {
        console.error("Error fetching trending blogs:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTrending();
  }, []);

  if (loading) return <div className="text-white text-center mt-20">Loading...</div>;

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold text-white mb-8">🔥 Trending Now</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {blogs.map((blog) => (
          <motion.div 
            key={blog._id}
            whileHover={{ y: -10 }}
            className="bg-[#161e2d] rounded-2xl overflow-hidden border border-white/10"
          >
            <img src={blog.coverImage} alt={blog.title} className="w-full h-48 object-cover" />
            <div className="p-6">
              <h2 className="text-xl font-bold text-white mb-2">{blog.title}</h2>
              <p className="text-gray-400 text-sm">{blog.description?.substring(0, 80)}...</p>
              <div className="mt-4 text-[#00ff9d] font-semibold">
                {blog.likes?.length || 0} Likes
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Trending;