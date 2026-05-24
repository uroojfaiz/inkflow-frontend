import { motion } from 'framer-motion';

const Loader = () => {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#0f172a]">
      {/* Rotating Circle Container */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        className="relative w-24 h-24 border-t-4 border-l-4 border-[#00ff9d] rounded-full"
      >
        <motion.div 
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="absolute inset-2 border-r-4 border-b-4 border-[#00ff9d]/50 rounded-full"
        />
      </motion.div>

      {/* Brand Text */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-8 text-center"
      >
        <h2 className="text-2xl font-bold text-white tracking-widest">INKFLOW</h2>
        <p className="text-[#00ff9d]/70 text-sm mt-1 animate-pulse">
          Loading your creative space...
        </p>
      </motion.div>
    </div>
  );
};

export default Loader;