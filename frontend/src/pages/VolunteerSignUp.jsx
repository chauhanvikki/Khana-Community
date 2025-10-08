import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { motion } from 'framer-motion';
import { Users, Mail, Lock, User as UserIcon, UserPlus } from 'lucide-react';

export default function VolunteerSignUp() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post("https://khana-community.onrender.com/api/auth/signup", {
        name,
        email,
        password,
        role: "volunteer"
      });

      alert("Volunteer account created! Please login.");
      console.log(res.data);
      navigate("/volunteer/login");
    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong");
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#E8F5E9] via-white to-[#C8E6C9]">
      {/* Left Side Image */}
      <motion.div 
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="hidden lg:flex w-1/2 relative overflow-hidden bg-gradient-to-br from-[#E8F5E9] via-white to-[#C8E6C9]"
      >
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#4CAF50 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
        <div className="relative z-10 flex flex-col justify-center items-center text-center p-10">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.5, type: 'spring' }}
            className="mb-6"
          >
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-2xl">
              <Users size={48} className="text-[#4CAF50]" />
            </div>
          </motion.div>
          <motion.h1 
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-5xl font-bold text-[#2E7D32] drop-shadow-2xl mb-4"
          >
            Become a<br/>Volunteer
          </motion.h1>
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="text-xl text-[#2E7D32] drop-shadow-lg"
          >
            Join our community and help us reach <span className="font-bold">more people</span>.
          </motion.p>
        </div>
      </motion.div>

      {/* Right Side Form */}
      <div className="flex flex-col justify-center w-full lg:w-1/2 px-8 lg:px-20 relative">
        {/* Floating decorations */}
        <div style={{ position: 'absolute', top: '8%', right: '8%', fontSize: '3rem', opacity: 0.05, animation: 'float 6s ease-in-out infinite' }}>🚚</div>
        <div style={{ position: 'absolute', bottom: '12%', left: '8%', fontSize: '2.5rem', opacity: 0.05, animation: 'float 8s ease-in-out infinite 1s' }}>❤️</div>

        <motion.div 
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-auto border-2 border-gray-100"
        >
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <h1 className="text-3xl font-bold bg-gradient-to-r from-[#4CAF50] to-[#66BB6A] bg-clip-text text-transparent mb-2">Join us as a Volunteer!</h1>
            <p className="mb-6 text-gray-600">
              Create your Khana Community Volunteer Account
            </p>
          </motion.div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <UserIcon size={16} className="text-[#4CAF50]" />
                Full Name
              </label>
              <input
                placeholder="Enter your full name"
                type="text"
                name="name"
                className="w-full p-3 border-2 text-black border-gray-200 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent transition-all"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </motion.div>

            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <Mail size={16} className="text-[#4CAF50]" />
                Email Address
              </label>
              <input
                placeholder="your.email@example.com"
                type="email"
                name="email"
                className="w-full p-3 border-2 text-black border-gray-200 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent transition-all"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </motion.div>

            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <Lock size={16} className="text-[#4CAF50]" />
                Password
              </label>
              <input
                placeholder="Create a strong password"
                type="password"
                name="password"
                className="w-full p-3 border-2 text-black border-gray-200 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent transition-all"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </motion.div>

            <motion.label 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="flex items-start mt-2 text-sm text-gray-700"
            >
              <input type="checkbox" required className="mr-2 mt-1" />
              <span>I agree to Khana Community's Terms of Service and Privacy Policy</span>
            </motion.label>

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="w-full py-4 bg-gradient-to-r from-[#4CAF50] to-[#66BB6A] text-white font-bold rounded-xl hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <UserPlus size={20} />
              {loading ? "Creating Account..." : "Sign Up"}
            </motion.button>

            <motion.span 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
              className="text-sm text-center text-gray-600 mt-2"
            >
              Already have an account?{" "}
              <Link to="/volunteer/login" className="text-[#4CAF50] font-bold hover:underline">Login</Link>
            </motion.span>
          </form>
        </motion.div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
      `}</style>
    </div>
  );
}
