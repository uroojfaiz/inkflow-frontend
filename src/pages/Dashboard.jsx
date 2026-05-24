import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, BarChart3, Settings, Bell, Edit3, Trash2 } from 'lucide-react';
import api from '../services/api'; 
import Swal from 'sweetalert2';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState({ name: '', email: '', profileImage: '', bio: '' });
  const [notifications, setNotifications] = useState([]);
  const [editingBlog, setEditingBlog] = useState(null); // Edit ke liye state
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
    fetchProfile();
    fetchNotifications();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const res = await api.get('/blogs/my-blogs');
      setBlogs(res.data);
    } catch (err) { console.error("Blogs fetch error:", err); }
  };

  const fetchProfile = async () => {
    try {
      const res = await api.get('/auth/profile');
      setUser(res.data.user);
    } catch (err) { console.error("Profile fetch error:", err); }
  };

  const fetchNotifications = async () => {
    try {
      const res = await api.get('/auth/notifications');
      setNotifications(res.data);
    } catch (err) { console.error("Notifications fetch error:", err); }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans">
      {/* SIDEBAR */}
      <div className="w-64 bg-[#064E3B] p-6 text-white flex flex-col justify-between">
        <div>
          <h2 className="text-2xl font-black mb-10">INKFLOW</h2>
          
          <div className="bg-[#065F46] p-4 rounded-xl mb-6 flex items-center gap-3">
            <img src={user.profileImage || 'https://via.placeholder.com/40'} className="w-10 h-10 rounded-full object-cover" />
            <div className="overflow-hidden">
              <p className="font-bold text-sm truncate">{user.name}</p>
              <p className="text-[10px] text-emerald-200 truncate">{user.email}</p>
            </div>
          </div>

          <nav className="space-y-2">
            {[ {name: 'Dashboard', icon: <LayoutDashboard/>}, {name: 'Analytics', icon: <BarChart3/>}, {name: 'Notifications', icon: <Bell/>}, {name: 'Settings', icon: <Settings/>} ].map(item => (
              <button key={item.name} onClick={() => setActiveTab(item.name)} className={`flex items-center gap-3 w-full p-3 rounded-xl transition ${activeTab === item.name ? 'bg-[#065F46]' : 'hover:bg-[#065F46]'}`}>
                {item.icon} {item.name}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* CONTENT AREA */}
      <div className="flex-1 p-12">
        <h1 className="text-3xl font-black text-[#064E3B] mb-8">{activeTab}</h1>

        {activeTab === 'Dashboard' && (
          <div className="space-y-4">
            {blogs.map(blog => (
              <BlogCard 
                key={blog._id} 
                blog={blog} 
                refresh={fetchDashboardData} 
                onEdit={() => setEditingBlog(blog)} // Edit trigger
              />
            ))}
          </div>
        )}

        {activeTab === 'Notifications' && (
          <div className="bg-white p-6 rounded-3xl border shadow-sm">
            {notifications.length > 0 ? notifications.map((n, i) => <p key={i} className="p-3 border-b">{n.message}</p>) : <p className="text-gray-400">No new notifications</p>}
          </div>
        )}

        {activeTab === 'Settings' && (
          <div className="bg-white p-8 rounded-3xl border shadow-sm max-w-lg">
            <h3 className="font-bold mb-4">Edit Profile</h3>
            <input className="w-full p-3 border rounded-xl mb-4" placeholder="Name" value={user.name} onChange={(e) => setUser({...user, name: e.target.value})} />
            <textarea className="w-full p-3 border rounded-xl mb-4" placeholder="Bio" value={user.bio} onChange={(e) => setUser({...user, bio: e.target.value})} />
            <button onClick={async () => { 
                await api.put('/auth/update-profile', user); 
                Swal.fire('Saved!', 'Profile updated successfully.', 'success'); 
                fetchProfile();
            }} className="bg-[#064E3B] text-white px-6 py-2 rounded-xl">Save Changes</button>
          </div>
        )}
      </div>

      {/* EDIT BLOG MODAL */}
      {editingBlog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-8 rounded-3xl w-full max-w-lg">
            <h3 className="font-bold text-xl mb-4">Edit Blog</h3>
            <input className="w-full p-3 border rounded-xl mb-3" value={editingBlog.title} onChange={(e) => setEditingBlog({...editingBlog, title: e.target.value})} />
            <textarea className="w-full p-3 border rounded-xl mb-3" value={editingBlog.content} onChange={(e) => setEditingBlog({...editingBlog, content: e.target.value})} />
            <div className="flex gap-4">
              <button onClick={() => setEditingBlog(null)} className="flex-1 p-3 border rounded-xl">Cancel</button>
              <button onClick={async () => { 
                await api.put(`/blogs/${editingBlog._id}`, editingBlog);
                Swal.fire('Updated!', 'Blog updated successfully', 'success');
                setEditingBlog(null);
                fetchDashboardData();
              }} className="flex-1 p-3 bg-[#064E3B] text-white rounded-xl">Save Changes</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// BLOG CARD COMPONENT
const BlogCard = ({ blog, refresh, onEdit }) => {
  const getCatImg = (cat) => ({ Technology: "https://images.unsplash.com/photo-1518770660439-4636190af475", Business: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab", Design: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4", Writing: "https://images.unsplash.com/photo-1455390582262-044cdead277a" }[cat] || "https://images.unsplash.com/photo-1522202176988-66273c2fd55f");

  return (
    <div className="bg-white p-6 rounded-3xl border flex items-center gap-6">
      <img src={blog.coverImage ? `http://localhost:5000/${blog.coverImage}` : getCatImg(blog.category)} className="w-20 h-20 rounded-2xl object-cover" />
      <div className="flex-1">
        <h4 className="font-bold text-[#064E3B]">{blog.title}</h4>
        <p className="text-xs text-gray-400">{blog.category} • {new Date(blog.createdAt).toLocaleDateString()}</p>
      </div>
      <div className="flex gap-4">
        <button onClick={onEdit} className="text-blue-500"><Edit3 size={18}/></button>
        <button onClick={async () => { await api.delete(`/blogs/${blog._id}`); refresh(); }} className="text-red-500"><Trash2 size={18}/></button>
      </div>
    </div>
  );
};

export default Dashboard;