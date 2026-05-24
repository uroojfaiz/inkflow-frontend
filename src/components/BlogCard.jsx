// src/components/BlogCard.jsx (Revised)
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const BlogCard = ({ blog, index }) => {
  const navigate = useNavigate();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      whileHover={{ scale: 1.02 }}
      className="bg-[#161e2d] border border-white/5 p-7 rounded-3xl hover:border-[#00ff9d] transition-all cursor-pointer group shadow-xl"
      onClick={() => navigate(`/blog/${blog._id}`)}
    >
      <h2 className="text-2xl font-black text-white mb-3 tracking-tighter line-clamp-2">{blog.title}</h2>
      <p className="text-gray-400 text-sm mb-6 line-clamp-3 leading-relaxed">{blog.content}</p>
      
      <div className="flex items-center justify-between text-gray-500 text-xs border-t border-white/5 pt-5 mt-auto">
        <div className="flex gap-4 font-mono">
          <span>👁️ {blog.views || 0}</span>
          <span>❤️ {blog.likes?.length || 0}</span>
          <span>💬 {blog.comments?.length || 0}</span>
        </div>
        <span className="text-[#00ff9d] font-bold group-hover:underline">Read More →</span>
      </div>
    </motion.div>
  );
};

export default BlogCard;