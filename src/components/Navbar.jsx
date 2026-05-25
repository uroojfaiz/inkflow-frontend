import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, PenTool, LogOut, Bell, LayoutDashboard } from 'lucide-react';
import api from '../services/api';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [showProfileTooltip, setShowProfileTooltip] = useState(false); // New state for Profile
  const [user, setUser] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem('token');

  useEffect(() => {
    if (isLoggedIn) {
      fetchProfile();
      fetchNotifications();
    }
  }, [isLoggedIn]);

  const fetchProfile = async () => {
    try {
      const res = await api.get('/auth/profile');
      setUser(res.data.user);
    } catch (err) { console.log("Profile load failed"); }
  };

  const fetchNotifications = async () => {
    try {
      const res = await api.get('/auth/notifications');
      setNotifications(res.data.filter(n => !n.isRead)); 
    } catch (err) { console.log("Notifications load failed"); }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
    window.location.reload();
  };

  return (
    <nav className="fixed w-full z-50 bg-[#020617]/80 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        
        {/* Logo Section */}
        <div className="relative" onMouseEnter={() => setShowTooltip(true)} onMouseLeave={() => setShowTooltip(false)}>
          <Link to="/" className="text-2xl font-black tracking-tighter text-teal-400">INK<span className="text-white">FLOW</span></Link>
          <AnimatePresence>
            {showTooltip && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 45 }} exit={{ opacity: 0, y: 10 }} className="absolute left-0 w-56 bg-[#00ff9d] text-[#020617] px-4 py-2 rounded-lg font-bold text-xs shadow-[0_0_20px_rgba(0,255,157,0.3)] z-50 whitespace-nowrap">
                AI-Powered Blogging Platform 🚀
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-300">
          <Link to="/" className="hover:text-teal-400 transition">Home</Link>
          <Link to="/dashboard" className="hover:text-teal-400 transition flex items-center gap-1.5"><LayoutDashboard size={16} /> Dashboard</Link>
          
          {isLoggedIn && user ? (
            <>
              <Link to="/dashboard" className="hover:text-teal-400 transition relative">
                <Bell size={18} />
                {notifications.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold">
                    {notifications.length}
                  </span>
                )}
              </Link>

              {/* Profile with Hover Tooltip */}
              <div 
                className="relative flex items-center" 
                onMouseEnter={() => setShowProfileTooltip(true)} 
                onMouseLeave={() => setShowProfileTooltip(false)}
              >
                <Link to="/profile">
                  <img 
                    src={user.profileImage ? user.profileImage : `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=00ff9d&color=0f172a&bold=true&size=128`}
                    className="w-9 h-9 rounded-full border-2 border-teal-500 object-cover cursor-pointer"
                    alt="Profile"
                  />
                </Link>

                <AnimatePresence>
                  {showProfileTooltip && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.9 }} 
                      animate={{ opacity: 1, scale: 1 }} 
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="absolute top-12 right-0 bg-white text-[#020617] px-4 py-2 rounded-lg font-bold text-xs shadow-xl z-50 whitespace-nowrap border border-teal-500"
                    >
                      {user.email}
                      <div className="absolute -top-1 right-3 w-2 h-2 bg-white rotate-45 border-l border-t border-teal-500"></div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <Link to="/create" className="bg-teal-500 text-black px-5 py-2.5 rounded-full font-bold hover:bg-teal-400 transition flex items-center gap-2 text-xs uppercase tracking-wider">
                <PenTool size={14} /> Write
              </Link>

              <button onClick={handleLogout} className="text-slate-500 hover:text-red-400 transition"><LogOut size={18} /></button>
            </>
          ) : (
            <Link to="/login" className="bg-white/5 px-5 py-2 rounded-full hover:bg-white/10 transition">Login</Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;