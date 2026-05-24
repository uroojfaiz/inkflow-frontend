import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Footer = () => {
  return (
    <footer className="bg-[#0b1221] border-t border-white/10 pt-16 pb-8 text-gray-400">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
        
        {/* Brand Section */}
        <div className="col-span-1 md:col-span-1">
          <h2 className="text-2xl font-bold text-[#00ff9d] tracking-tighter mb-4">INKFLOW.</h2>
          <p className="text-sm leading-relaxed">The future of AI-powered blogging.</p>
        </div>

        {/* Links Group 1 */}
        <div>
          <h4 className="text-white font-semibold mb-6 uppercase tracking-wider text-sm">Platform</h4>
          <ul className="space-y-4">
            <TooltipLink text="About Us" msg="We are creators of the future." />
            <TooltipLink text="Services" msg="AI content generation & curation." />
            <TooltipLink text="Trending" msg="See what's buzzing right now!" />
          </ul>
        </div>

        {/* Links Group 2 */}
        <div>
          <h4 className="text-white font-semibold mb-6 uppercase tracking-wider text-sm">Policy</h4>
          <ul className="space-y-4">
            <TooltipLink text="Privacy Policy" msg="Your data is safe with us." />
            <TooltipLink text="Terms" msg="Simple rules for a great community." />
            <TooltipLink text="Cookies" msg="We use cookies to improve your UI." />
          </ul>
        </div>

        {/* Contact Group */}
        <div>
          <h4 className="text-white font-semibold mb-6 uppercase tracking-wider text-sm">Support</h4>
          <ul className="space-y-4">
            <TooltipLink text="Email Us" msg="support@inkflow.com" />
            <TooltipLink text="Help Center" msg="Available 24/7 for you." />
            <TooltipLink text="Feedback" msg="We love to hear from you!" />
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-8 border-t border-white/5 text-sm text-center">
        <p>© 2026 InkFlow Inc. All rights reserved.</p>
      </div>
    </footer>
  );
};

// Reusable Tooltip Component
const TooltipLink = ({ text, msg }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <li 
      className="relative inline-block cursor-help group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <span className="hover:text-[#00ff9d] transition-colors duration-300 cursor-pointer">
        {text}
      </span>

      {/* Floating Neon Box */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 5, scale: 0.9 }}
            animate={{ opacity: 1, y: -40, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.9 }}
            className="absolute left-0 bg-[#00ff9d] text-[#0b1221] px-4 py-2 rounded-lg font-bold text-xs whitespace-nowrap shadow-[0_0_15px_rgba(0,255,157,0.3)] z-50"
          >
            {msg}
            {/* Arrow */}
            <div className="absolute -bottom-1 left-4 w-2 h-2 bg-[#00ff9d] rotate-45"></div>
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  );
};

export default Footer;