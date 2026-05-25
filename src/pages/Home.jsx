import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, Users, BookOpen, Heart, MessageCircle, BarChart3, X, Send } from "lucide-react";
import api from "../services/api"; // Import your API instance

// --- CHATBOT COMPONENT ---
function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([{ text: "Hello! Need help with your writing?", isBot: true }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;
    const newMessages = [...messages, { text: input, isBot: false }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await api.post('/chat', { message: input });
      setMessages([...newMessages, { text: res.data.reply, isBot: true }]);
    } catch (err) {
      setMessages([...newMessages, { text: "Sorry, I'm having trouble connecting to the AI.", isBot: true }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <motion.button 
        whileHover={{ scale: 1.1 }} 
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)} 
        className="fixed bottom-8 right-8 bg-teal-600 p-4 rounded-full text-white shadow-2xl z-50 transition-transform"
      >
        {isOpen ? <X /> : <MessageCircle />}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} 
            animate={{ opacity: 1, scale: 1 }} 
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed bottom-24 right-8 w-80 h-96 bg-white rounded-3xl shadow-2xl z-50 flex flex-col overflow-hidden border"
          >
            <div className="bg-teal-600 p-4 text-white font-bold flex justify-between items-center">
              InkFlow AI Assistant
              <button onClick={() => setIsOpen(false)}><X size={16}/></button>
            </div>
            <div className="flex-1 p-4 overflow-y-auto space-y-2">
              {messages.map((m, i) => (
                <div key={i} className={`p-2 rounded-lg text-sm max-w-[80%] ${m.isBot ? 'bg-gray-100' : 'bg-teal-100 ml-auto'}`}>{m.text}</div>
              ))}
              {loading && <p className="text-xs text-gray-400 p-2">AI is thinking...</p>}
            </div>
            <div className="p-4 border-t flex gap-2">
              <input value={input} onChange={(e) => setInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSend()} className="flex-1 border rounded-lg p-2 text-sm outline-none" placeholder="Ask anything..." />
              <button onClick={handleSend} className="bg-teal-600 text-white p-2 rounded-lg"><Send size={16} /></button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// --- MAIN HOME PAGE ---
export default function HomePage() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [hoveredFeature, setHoveredFeature] = useState(null);

  const stats = [
    { label: "Active Writers", value: "1.2M", icon: <Users className="text-teal-500" /> },
    { label: "Famous Blogs", value: "850K", icon: <BookOpen className="text-teal-500" /> },
    { label: "Daily Readers", value: "15M", icon: <BarChart3 className="text-teal-500" /> }
  ];

  const features = [
    { id: 1, icon: <Zap size={32} />, title: "AI Assistance", desc: "Write content 10x faster using our advanced AI engine." },
    { id: 2, icon: <MessageCircle size={32} />, title: "Community", desc: "Collaborate and connect with professional writers globally." },
    { id: 3, icon: <Heart size={32} />, title: "Engagement", desc: "Track your audience growth with real-time analytics." }
  ];

  return (
    <div className="bg-[#FAFAFA] min-h-screen text-gray-800 font-sans selection:bg-teal-200">
      
      {/* HERO SECTION */}
      <section className="container mx-auto px-6 py-20 grid md:grid-cols-2 items-center gap-12">
        <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }}>
          <motion.div whileHover={{ scale: 1.05 }} className="inline-block relative group">
            <span className="text-teal-600 font-bold bg-teal-100 px-4 py-1 rounded-full text-sm">INKFLOW 2026</span>
          </motion.div>
          <h1 className="text-6xl font-black mt-6 leading-tight">Master the Art of <span className="text-teal-500">Digital Writing</span></h1>
          <p className="text-gray-500 mt-6 text-lg">Join the world's fastest-growing community of creators. Write, share, and grow your influence.</p>
          <div className="flex gap-4 mt-8">
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => token ? navigate("/create") : navigate("/login")} className="bg-gray-900 text-white px-8 py-4 rounded-full font-bold hover:bg-teal-600 transition">Start Writing</motion.button>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => navigate("/explore")} className="bg-white border border-gray-200 px-8 py-4 rounded-full font-bold hover:bg-gray-100 transition">Explore</motion.button>
          </div>
        </motion.div>
        <motion.img initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f" className="rounded-[3rem] shadow-2xl" />
      </section>

      {/* STATS SECTION */}
      <section className="container mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        {stats.map((s, i) => (
          <motion.div key={i} whileHover={{ y: -5 }} className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-6">
            <div className="p-4 bg-teal-50 rounded-2xl">{s.icon}</div>
            <div>
              <h3 className="text-3xl font-black">{s.value}</h3>
              <p className="text-gray-500 font-medium">{s.label}</p>
            </div>
          </motion.div>
        ))}
      </section>

      {/* FEATURES SECTION */}
      <section className="py-20 bg-white">
        <h2 className="text-center text-4xl font-bold mb-16">Platform Features</h2>
        <div className="container mx-auto px-6 flex flex-wrap justify-center gap-16">
          {features.map((f) => (
            <div key={f.id} className="relative flex flex-col items-center">
              <motion.div 
                whileHover={{ scale: 1.1 }}
                onHoverStart={() => setHoveredFeature(f.id)} 
                onHoverEnd={() => setHoveredFeature(null)} 
                className="w-32 h-32 rounded-full bg-gray-50 border-4 border-teal-100 flex items-center justify-center cursor-pointer hover:bg-teal-500 hover:text-white transition-colors duration-300"
              >
                {f.icon}
              </motion.div>
              <AnimatePresence>
                {hoveredFeature === f.id && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="absolute mt-40 w-64 p-6 bg-gray-900 text-white rounded-2xl z-10 text-center shadow-2xl">
                    <h4 className="font-bold mb-2">{f.title}</h4>
                    <p className="text-sm text-gray-300">{f.desc}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="container mx-auto px-6 py-20 max-w-3xl">
        <h2 className="text-4xl font-bold text-center mb-12">Frequently Asked Questions</h2>
        {[{q: "Is this platform free to use?", a: "Yes, our core writing features are completely free for all users."}, {q: "Can I monetize my blogs?", a: "Absolutely, we provide tools to help you earn from your content."}].map((f, i) => (
          <details key={i} className="mb-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm cursor-pointer">
            <summary className="font-bold text-lg">{f.q}</summary>
            <p className="mt-4 text-gray-600 leading-relaxed">{f.a}</p>
          </details>
        ))}
      </section>

      {/* CHATBOT COMPONENT CALL */}
      <ChatBot />
    </div>
  );
}