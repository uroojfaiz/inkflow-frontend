import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, Bell, Settings, Edit3, Trash2, LogOut, PlusCircle, X } from 'lucide-react';
import api from '../services/api'; 
import Swal from 'sweetalert2';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState({ name: '', email: '', bio: '', followers: 0, following: 0, totalLikes: 0 });
  const [notifications, setNotifications] = useState([]);
  
  // Modals & Forms
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newBlog, setNewBlog] = useState({ title: '', content: '', category: 'Technology' });
  
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { navigate('/login'); return; }
    fetchDashboardData(); fetchProfile(); fetchNotifications();
  }, []);

  const fetchDashboardData = async () => { try { const res = await api.get('/blogs/my-blogs'); setBlogs(res.data); } catch (err) { console.error(err); } };
  const fetchProfile = async () => { try { const res = await api.get('/auth/profile'); setUser(res.data.user); } catch (err) { console.error(err); } };
  const fetchNotifications = async () => { try { const res = await api.get('/auth/notifications'); setNotifications(res.data); } catch (err) { console.error(err); } };

  const handleCreateBlog = async () => {
    try {
      await api.post('/blogs', newBlog);
      Swal.fire('Success', 'Blog Published!', 'success');
      setIsCreateModalOpen(false);
      setNewBlog({ title: '', content: '', category: 'Technology' });
      fetchDashboardData();
    } catch (err) { Swal.fire('Error', 'Failed to create blog', 'error'); }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans">
      {/* SIDEBAR */}
      <div className="w-64 bg-[#064E3B] p-6 text-white flex flex-col justify-between fixed h-full">
        <div>
          <h2 className="text-2xl font-black mb-10">INKFLOW</h2>
          <div className="mb-8 p-4 bg-[#065F46] rounded-xl">
            <p className="font-bold text-sm truncate">{user.name}</p>
            <p className="text-[10px] text-emerald-200 truncate">{user.email}</p>
          </div>
          <nav className="space-y-2">
            {[ {name: 'Dashboard', icon: <LayoutDashboard/>}, {name: 'Notifications', icon: <Bell/>}, {name: 'Settings', icon: <Settings/>} ].map(item => (
              <button key={item.name} onClick={() => setActiveTab(item.name)} className={`flex items-center gap-3 w-full p-3 rounded-xl transition ${activeTab === item.name ? 'bg-[#065F46]' : 'hover:bg-[#065F46]'}`}>
                {item.icon} {item.name}
              </button>
            ))}
          </nav>
        </div>
        <button onClick={() => { localStorage.removeItem('token'); navigate('/login'); }} className="flex items-center gap-2 text-emerald-200 hover:text-white"><LogOut size={18}/> Logout</button>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 ml-64 p-12">
        <h1 className="text-3xl font-black text-[#064E3B] mb-8">{activeTab}</h1>

        {activeTab === 'Dashboard' && (
          <>
            <div className="flex gap-6 mb-8">
              {[ {label: 'Followers', val: user.followers}, {label: 'Following', val: user.following}, {label: 'Likes', val: user.totalLikes} ].map((stat, i) => (
                <div key={i} className="bg-white p-6 rounded-3xl border shadow-sm w-40">
                  <p className="text-gray-400 text-[10px] uppercase">{stat.label}</p>
                  <p className="text-2xl font-black text-[#064E3B]">{stat.val}</p>
                </div>
              ))}
            </div>

            <button onClick={() => setIsCreateModalOpen(true)} className="bg-[#064E3B] text-white px-6 py-3 rounded-xl font-bold mb-6 flex items-center gap-2 hover:bg-emerald-900 transition">
              <PlusCircle size={20}/> New Post
            </button>

            <div className="space-y-4">
              {blogs.map(blog => (
                <div key={blog._id} className="bg-white p-6 rounded-3xl border flex justify-between items-center">
                  <h4 className="font-bold text-[#064E3B]">{blog.title}</h4>
                  <button onClick={async () => { await api.delete(`/blogs/${blog._id}`); fetchDashboardData(); }} className="text-red-500 hover:bg-red-50 p-2 rounded-lg"><Trash2 size={18}/></button>
                </div>
              ))}
            </div>
          </>
        )}

        {activeTab === 'Notifications' && (
          <div className="bg-white p-6 rounded-3xl border">
            {notifications.length > 0 ? notifications.map((n) => (
              <div key={n._id} className="p-4 border-b last:border-0 text-sm">{n.message}</div>
            )) : <p className="text-gray-400">No new notifications.</p>}
          </div>
        )}

        {activeTab === 'Settings' && (
          <div className="bg-white p-8 rounded-3xl border max-w-lg">
            <h3 className="font-bold text-xl mb-4">Edit Profile</h3>
            <input className="w-full p-3 border rounded-xl mb-3" value={user.name} onChange={(e) => setUser({...user, name: e.target.value})} placeholder="Name" />
            <textarea className="w-full p-3 border rounded-xl mb-3" value={user.bio} onChange={(e) => setUser({...user, bio: e.target.value})} placeholder="Bio" />
            <button onClick={async () => { await api.put('/auth/update-profile', user); Swal.fire('Saved!', 'Profile updated', 'success'); }} className="w-full p-3 bg-[#064E3B] text-white rounded-xl font-bold">Save Changes</button>
          </div>
        )}
      </div>

      {/* CREATE POST MODAL */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setIsCreateModalOpen(false)}>
          <div className="bg-white p-8 rounded-3xl w-full max-w-lg relative" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setIsCreateModalOpen(false)} className="absolute top-6 right-6 text-gray-400 hover:text-red-500"><X size={24} /></button>
            <h3 className="font-bold text-xl mb-4">Create New Post</h3>
            <input className="w-full p-3 border rounded-xl mb-3" placeholder="Title" onChange={(e) => setNewBlog({...newBlog, title: e.target.value})} />
            <textarea className="w-full p-3 border rounded-xl mb-3" placeholder="Content" rows={4} onChange={(e) => setNewBlog({...newBlog, content: e.target.value})} />
            <button onClick={handleCreateBlog} className="w-full p-3 bg-[#064E3B] text-white rounded-xl font-bold">Publish</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;