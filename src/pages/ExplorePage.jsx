import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, MessageCircle, Bookmark, UserPlus, UserCheck, Edit } from "lucide-react";
import Swal from 'sweetalert2';
import api from "../services/api";

export default function ExplorePage() {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const categories = ["All", "Technology", "Business", "Design", "Writing"];
  const currentUserId = localStorage.getItem("userId");

  const getCategoryImage = (cat) => {
    const images = {
      Technology: "https://images.unsplash.com/photo-1518770660439-4636190af475",
      Business: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab",
      Design: "https://images.unsplash.com/photo-1561070791-2526d30994b5",
      Writing: "https://images.unsplash.com/photo-1455390582262-044cdead277a",
      All: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f"
    };
    return images[cat] || images.All;
  };

  const checkAuth = () => {
    if (!localStorage.getItem("token")) {
      Swal.fire({ title: 'Login Required', text: 'Please login to continue', icon: 'warning' }).then(() => navigate("/login"));
      return false;
    }
    return true;
  };

  const fetchBlogs = async () => {
    const url = selectedCategory === "All" ? '/blogs' : `/blogs?category=${selectedCategory}`;
    const res = await api.get(url);
    setBlogs(res.data);
  };

  useEffect(() => { fetchBlogs(); }, [selectedCategory]);

  const handleLike = async (id) => { if(checkAuth()) { await api.put(`/interactions/like/${id}`); fetchBlogs(); } };
  const handleFollow = async (authorId) => { if(checkAuth()) { await api.post(`/interactions/follow/${authorId}`); fetchBlogs(); } };
  const handleSave = async (id) => { if(checkAuth()) { await api.post(`/interactions/save/${id}`); Swal.fire('Saved!', 'Added to dashboard', 'success'); } };

  const handleComment = async (blog) => {
    const { value: text } = await Swal.fire({
      title: 'Comments',
      html: `<div class="mb-4 text-left max-h-40 overflow-y-auto">${(blog.comments || []).map(c => `<p><b>${c.user}:</b> ${c.text}</p>`).join('')}</div>`,
      input: 'text',
      inputPlaceholder: 'Add a comment...',
      showCancelButton: true
    });
    if (text) { await api.post(`/interactions/comment/${blog._id}`, { text }); fetchBlogs(); }
  };

  return (
    <div className="bg-[#FAFAFA] min-h-screen py-10 px-4 md:px-6">
      {/* Categories Wrap ho jayengi, scroll nahi hongi */}
      <div className="flex flex-wrap gap-3 justify-center mb-12">
        {categories.map(cat => (
          <button key={cat} onClick={() => setSelectedCategory(cat)} className={`px-6 py-2 rounded-full font-bold transition ${selectedCategory === cat ? "bg-teal-600 text-white" : "bg-white border border-gray-200"}`}>{cat}</button>
        ))}
      </div>

      <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {blogs.map((blog) => (
          <div key={blog._id} className="bg-white p-5 md:p-6 rounded-[2rem] border border-gray-100 shadow-sm">
            <img src={blog.coverImage ? `http://localhost:5000/${blog.coverImage}` : getCategoryImage(blog.category)} className="w-full h-48 object-cover rounded-2xl mb-4" />
            <h3 className="text-xl font-bold">{blog.title}</h3>
            <p className="text-gray-500 text-sm mt-2 line-clamp-2">{blog.content}</p>
            
            <div className="flex gap-3 md:gap-4 pt-4 border-t mt-4 items-center">
              <button onClick={() => handleLike(blog._id)} className="flex items-center gap-1">
                <Heart size={18} fill={(blog.likes || []).includes(currentUserId) ? "red" : "none"} color={(blog.likes || []).includes(currentUserId) ? "red" : "gray"} /> {(blog.likes || []).length}
              </button>
              <button onClick={() => handleComment(blog)} className="flex items-center gap-1"><MessageCircle size={18} /> {(blog.comments || []).length}</button>
              <button onClick={() => handleFollow(blog.author?._id)} className="flex items-center gap-1 text-teal-600">
                {(blog.author?.followers || []).includes(currentUserId) ? <UserCheck size={18}/> : <UserPlus size={18}/>}
              </button>
              <button onClick={() => handleSave(blog._id)} className="ml-auto"><Bookmark size={18} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}