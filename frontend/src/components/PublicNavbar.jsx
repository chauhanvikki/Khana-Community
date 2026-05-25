import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, ArrowLeft } from 'lucide-react';

const PublicNavbar = () => {
  const navigate = useNavigate();

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="bg-white/95 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <Heart size={20} color="white" fill="white" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent">
              Khana Community
            </h1>
          </Link>
          
          <nav className="flex items-center gap-6">
            <motion.button
              whileHover={{ x: -5 }}
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-gray-600 hover:text-orange-600 font-semibold transition-colors"
            >
              <ArrowLeft size={18} />
              Back to Home
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/auth/login')}
              className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-2 rounded-lg font-bold shadow-md hover:shadow-lg transition-all"
            >
              Login
            </motion.button>
          </nav>
        </div>
      </div>
    </motion.header>
  );
};

export default PublicNavbar;
