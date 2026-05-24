import { useState, useRef } from 'react';
import { Save, Image as ImageIcon, X, Link as LinkIcon, Sparkles } from 'lucide-react';
import api from '../services/api';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const CreateBlog = () => {
  const [formData, setFormData] = useState({ title: '', content: '', category: 'Technology', externalUrl: '', coverImage: null });
  const [imagePreview, setImagePreview] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, coverImage: file });
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handlePublish = async () => {
    if (!formData.title || !formData.content) return Swal.fire("Oops!", "Title and Content are mandatory.", "warning");
    setIsSaving(true);
    const data = new FormData();
    data.append('title', formData.title); data.append('content', formData.content);
    data.append('category', formData.category); data.append('externalUrl', formData.externalUrl);
    if (formData.coverImage) data.append('coverImage', formData.coverImage);

    try {
      await api.post('/blogs/create', data, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
      Swal.fire("Success!", "Your blog is live!", "success");
      navigate('/dashboard');
    } catch (err) { Swal.fire("Error", "Publishing failed.", "error"); }
    finally { setIsSaving(false); }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-16 px-6">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white p-8 md:p-12 rounded-[2.5rem] border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.05)]">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-black text-slate-900">Create Post</h2>
            <div className="bg-emerald-50 text-emerald-600 px-4 py-1.5 rounded-full text-sm font-bold flex items-center gap-2">
              <Sparkles size={16} /> Auto-save on
            </div>
          </div>
          
          <div className="space-y-6">
            {/* Upload Area */}
            <div className="relative">
              {imagePreview ? (
                <div className="relative h-64 rounded-3xl overflow-hidden border-2 border-emerald-500 shadow-lg">
                  <img src={imagePreview} className="w-full h-full object-cover" />
                  <button onClick={() => {setImagePreview(null); setFormData({...formData, coverImage: null})}} className="absolute top-4 right-4 bg-white/90 p-2 rounded-full text-slate-900 shadow-md"><X size={20} /></button>
                </div>
              ) : (
                <div onClick={() => fileInputRef.current.click()} className="h-48 border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center cursor-pointer hover:border-emerald-500 hover:bg-emerald-50/50 transition-all">
                  <ImageIcon className="text-emerald-500 mb-2" size={40} />
                  <span className="text-sm font-bold text-slate-400">Click to upload cover image</span>
                  <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileChange} />
                </div>
              )}
            </div>

            <input className="w-full bg-transparent text-4xl font-black outline-none text-slate-900 placeholder:text-slate-300" placeholder="Title of your story..." value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} />
            
            <div className="flex gap-4">
              <select className="bg-slate-50 p-4 rounded-2xl outline-none text-slate-700 font-bold border border-slate-100" value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})}>
                <option>Technology</option><option>Design</option><option>Lifestyle</option><option>Business</option>
              </select>
              <div className="flex-1 flex items-center bg-slate-50 px-6 rounded-2xl border border-slate-100">
                <LinkIcon className="text-slate-400 mr-3" size={20} />
                <input className="w-full bg-transparent p-4 outline-none text-slate-700" placeholder="External URL (Optional)" value={formData.externalUrl} onChange={(e) => setFormData({...formData, externalUrl: e.target.value})} />
              </div>
            </div>

            <textarea className="w-full h-64 bg-slate-50 p-6 rounded-2xl text-lg outline-none resize-none text-slate-700 border border-slate-100 focus:border-emerald-200 transition-all" placeholder="Start writing your masterpiece..." value={formData.content} onChange={(e) => setFormData({...formData, content: e.target.value})} />
          </div>

          <div className="mt-8 pt-8 border-t border-slate-100 flex justify-end">
            <button onClick={handlePublish} disabled={isSaving} className="bg-emerald-600 hover:bg-emerald-700 text-white px-10 py-4 rounded-full font-black flex items-center gap-3 transition-all transform hover:scale-105 disabled:opacity-50">
              <Save size={20} /> {isSaving ? 'Publishing...' : 'Publish Post'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default CreateBlog;