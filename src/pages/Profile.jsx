import { useEffect, useState } from 'react';
import api from '../services/api';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ 
    name: '', bio: '', profileImage: '', 
    socialLinks: { linkedin: '', twitter: '' } 
  });

  useEffect(() => { fetchProfile(); }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.get('/auth/profile', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      const userData = res.data.user;
      setUser(userData);
      setFormData({ 
        name: userData.name, 
        bio: userData.bio || '', 
        profileImage: userData.profileImage || '',
        socialLinks: userData.socialLinks || { linkedin: '', twitter: '' }
      });
    } catch (err) { console.error("Error loading profile"); }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setFormData(prev => ({ ...prev, profileImage: reader.result }));
      reader.readAsDataURL(file);
    }
  };

  const handleUpdate = async () => {
    try {
      await api.put('/auth/update-profile', formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setIsEditing(false);
      fetchProfile();
    } catch (err) { alert("Update failed!"); }
  };

  if (!user) return <div className="text-white pt-40 text-center font-bold">Loading...</div>;

  return (
    <div className="pt-28 max-w-xl mx-auto px-6 text-white min-h-screen">
      <div className="bg-[#0f172a] p-8 rounded-[2rem] border border-white/10 shadow-2xl">
        
        {/* Profile Image Section */}
        <div className="flex flex-col items-center">
          <div className="relative group cursor-pointer" onClick={() => document.getElementById('fileInput').click()}>
            <img 
              src={formData.profileImage || `https://ui-avatars.com/api/?name=${user.name}&background=00ff9d&color=0f172a`} 
              className="w-32 h-32 rounded-full border-4 border-[#00ff9d] object-cover transition-transform group-hover:scale-105"
            />
            <input id="fileInput" type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
          </div>

          {isEditing ? (
            <input className="mt-6 bg-[#1e293b] text-center text-xl font-bold w-full p-2 rounded-lg border border-[#00ff9d]" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
          ) : (
            <h1 className="text-3xl font-bold mt-6">{user.name}</h1>
          )}
        </div>

        {/* Edit/View Fields */}
        <div className="mt-8 space-y-4">
          {isEditing ? (
            <>
              <textarea className="w-full bg-[#1e293b] p-4 rounded-xl border border-white/10" value={formData.bio} onChange={(e) => setFormData({...formData, bio: e.target.value})} placeholder="Write your bio..." />
              <input className="w-full bg-[#1e293b] p-3 rounded-xl border border-white/10" value={formData.socialLinks.linkedin} onChange={(e) => setFormData({...formData, socialLinks: {...formData.socialLinks, linkedin: e.target.value}})} placeholder="LinkedIn URL" />
              <input className="w-full bg-[#1e293b] p-3 rounded-xl border border-white/10" value={formData.socialLinks.twitter} onChange={(e) => setFormData({...formData, socialLinks: {...formData.socialLinks, twitter: e.target.value}})} placeholder="Twitter URL" />
            </>
          ) : (
            <div className="text-center space-y-4">
              <p className="text-gray-400 italic">"{user.bio || "No bio added yet."}"</p>
              <div className="flex justify-center gap-4">
                {user.socialLinks?.linkedin && <a href={user.socialLinks.linkedin} target="_blank" className="text-[#00ff9d] font-bold">LinkedIn</a>}
                {user.socialLinks?.twitter && <a href={user.socialLinks.twitter} target="_blank" className="text-[#00ff9d] font-bold">Twitter</a>}
              </div>
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className="mt-10">
          {isEditing ? (
            <button onClick={handleUpdate} className="w-full bg-[#00ff9d] text-black font-bold py-3 rounded-full hover:bg-[#00cc7d] transition">Save Changes</button>
          ) : (
            <button onClick={() => setIsEditing(true)} className="w-full bg-white/5 border border-white/10 py-3 rounded-full hover:bg-white/10 transition">Edit Profile</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;