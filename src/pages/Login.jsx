import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom'; // useNavigate add kiya
import { Mail, Lock, LogIn } from 'lucide-react';
import api from '../services/api'; // Hamari api service import ki
import Swal from 'sweetalert2';    // SweetAlert2 import kiya

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // Redirect ke liye

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post('/auth/login', formData); // Backend request
      
      // Token save karein
      localStorage.setItem('token', res.data.token);

      Swal.fire({
        title: 'Welcome Back!',
        text: 'Login successful.',
        icon: 'success',
        background: '#0b1221',
        color: '#fff',
        confirmButtonColor: '#00ff9d',
        timer: 1500
      });

      // Redirect to Dashboard
      navigate('/dashboard');
    } catch (err) {
      Swal.fire({
        title: 'Error!',
        text: err.response?.data?.message || 'Invalid credentials',
        icon: 'error',
        background: '#0b1221',
        color: '#fff'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-[#0f172a]">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-[#161e2d] p-10 rounded-3xl border border-white/5 shadow-2xl"
      >
        <h2 className="text-3xl font-bold mb-2">Welcome Back</h2>
        <p className="text-gray-400 mb-8">Enter your credentials to access InkFlow.</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <Mail className="absolute left-4 top-3.5 text-gray-500" size={20} />
            <input 
              type="email"
              placeholder="Email address"
              className="w-full bg-[#0f172a] pl-12 pr-4 py-3 rounded-xl border border-white/10 focus:border-[#00ff9d] outline-none transition"
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-4 top-3.5 text-gray-500" size={20} />
            <input 
              type="password"
              placeholder="Password"
              className="w-full bg-[#0f172a] pl-12 pr-4 py-3 rounded-xl border border-white/10 focus:border-[#00ff9d] outline-none transition"
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              required
            />
          </div>

          <button 
            disabled={loading}
            className="w-full bg-[#00ff9d] text-[#0f172a] py-3 rounded-xl font-bold hover:scale-105 transition flex items-center justify-center gap-2"
          >
            {loading ? 'Signing in...' : <><LogIn size={18} /> Sign In</>}
          </button>
        </form>

        <p className="mt-8 text-center text-gray-400 text-sm">
          Don't have an account? <Link to="/register" className="text-[#00ff9d] font-bold">Create one</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;