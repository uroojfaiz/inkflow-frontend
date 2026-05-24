import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import CreateBlog from './pages/CreateBlog';
import Dashboard from './pages/Dashboard';
import Trending from './pages/Trending';
import BlogDetail from './pages/BlogDetail';
import ExplorePage from './pages/ExplorePage';

function App() {
  // Auth state manage karne ke liye
  const [token, setToken] = useState(localStorage.getItem('token'));

  // Jab bhi login/logout ho, ye refresh karega
  useEffect(() => {
    const handleStorageChange = () => {
      setToken(localStorage.getItem('token'));
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <Router>
      <MainLayout>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/trending" element={<Trending />} />
          <Route path="/blog/:id" element={<BlogDetail />} /> 
          
          {/* Auth Routes */}
          <Route path="/login" element={!token ? <Login /> : <Navigate to="/" />} />
          <Route path="/register" element={!token ? <Register /> : <Navigate to="/" />} />

          {/* Protected Routes - Ab ye token state ko track karenge */}
          <Route path="/profile" element={token ? <Profile /> : <Navigate to="/login" />} />
          <Route path="/create" element={token ? <CreateBlog /> : <Navigate to="/login" />} />
          <Route path="/dashboard" element={token ? <Dashboard /> : <Navigate to="/login" />} />
          <Route path="/explore" element={<ExplorePage />} />

          {/* 404 */}
          <Route path="*" element={
            <div className="min-h-[80vh] flex flex-col items-center justify-center text-gray-900 dark:text-white p-6">
              <h1 className="text-9xl font-black text-teal-500/20">404</h1>
              <h2 className="text-3xl font-bold mt-4">Page not found</h2>
              <a href="/" className="mt-8 px-8 py-3 bg-teal-500 text-black font-bold rounded-full hover:bg-teal-400 transition">Return Home</a>
            </div>
          } />
        </Routes>
      </MainLayout>
    </Router>
  );
}

export default App;