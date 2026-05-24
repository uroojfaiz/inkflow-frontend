import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, UserPlus } from 'lucide-react';
import api from '../services/api'; // Hamari api service
import Swal from 'sweetalert2';    // SweetAlert2

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Backend ko data bhejna
      await api.post('/auth/register', formData);

      Swal.fire({
        title: 'Account Created!',
        text: 'You can now log in to InkFlow.',
        icon: 'success',
        background: '#0b1221',
        color: '#fff',
        confirmButtonColor: '#00ff9d'
      });

      // Login page par redirect
      navigate('/login');
    } catch (err) {
      Swal.fire({
        title: 'Registration Failed',
        text: err.response?.data?.message || 'Something went wrong.',
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
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-[#161e2d] p-10 rounded-3xl border border-white/5 shadow-2xl"
      >
        <h2 className="text-3xl font-bold mb-2">Join InkFlow</h2>
        <p className="text-gray-400 mb-8">Start your journey into AI-powered blogging.</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <User className="absolute left-4 top-3.5 text-gray-500" size={20} />
            <input 
              type="text"
              placeholder="Full Name"
              className="w-full bg-[#0f172a] pl-12 pr-4 py-3 rounded-xl border border-white/10 focus:border-[#00ff9d] outline-none transition"
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
            />
          </div>

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
              placeholder="Create Password"
              className="w-full bg-[#0f172a] pl-12 pr-4 py-3 rounded-xl border border-white/10 focus:border-[#00ff9d] outline-none transition"
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              required
            />
          </div>

          <button 
            disabled={loading}
            className="w-full bg-[#00ff9d] text-[#0f172a] py-3 rounded-xl font-bold hover:scale-105 transition flex items-center justify-center gap-2"
          >
            {loading ? 'Creating Account...' : <><UserPlus size={18} /> Create Account</>}
          </button>
        </form>

        <p className="mt-8 text-center text-gray-400 text-sm">
          Already have an account? <Link to="/login" className="text-[#00ff9d] font-bold">Sign in</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;