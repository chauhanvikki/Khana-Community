import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { motion } from 'framer-motion';
import { Users, Mail, Lock, LogIn, Heart, Sparkles } from 'lucide-react';
import { API_BASE_URL } from "../config";
import OTPModal from "../components/OTPModal";
import GoogleLoginButton from "../components/GoogleLoginButton";
import ForgotPasswordModal from "../components/ForgotPasswordModal";

export default function VolunteerLogin() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [pendingEmail, setPendingEmail] = useState("");
  const [pendingGoogleData, setPendingGoogleData] = useState(null);
  const [showForgotModal, setShowForgotModal] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${API_BASE_URL}/api/auth/login`,
        { ...formData, role: 'volunteer' }
      );
      console.log("Volunteer logged in:", res.data);

      const { token, role } = res.data;
      
      // Clear all previous user data
      localStorage.clear();
      
      // Set new user data
      localStorage.setItem("token", token);

      const decoded = jwtDecode(token);
      localStorage.setItem("volunteerId", decoded.id);
      localStorage.setItem("volunteerName", decoded.name);
      localStorage.setItem("volunteerEmail", decoded.email);
      localStorage.setItem("userRole", decoded.role || role);

      navigate("/volunteer/dashboard", { replace: true });

    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = (data) => {
    const { token, role } = data;
    localStorage.clear();
    localStorage.setItem("token", token);
    try {
      const decoded = jwtDecode(token);
      localStorage.setItem("volunteerId", decoded.id);
      localStorage.setItem("volunteerName", decoded.name);
      localStorage.setItem("volunteerEmail", decoded.email);
      localStorage.setItem("userRole", decoded.role || role);
    } catch (e) { console.error(e); }
    navigate("/volunteer/dashboard", { replace: true });
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
            Join Our<br/>Mission
          </motion.h1>
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="text-xl text-[#2E7D32] drop-shadow-lg"
          >
            Helping <span className="font-bold">hundreds of people</span> every week.
          </motion.p>
        </div>
      </motion.div>

      {/* Right Side Form */}
      <div className="flex flex-col justify-center w-full lg:w-1/2 px-8 lg:px-20 relative">
        {/* Floating decorations */}
        <div style={{ position: 'absolute', top: '10%', right: '10%', fontSize: '4rem', opacity: 0.05, animation: 'float 6s ease-in-out infinite' }}>🚚</div>
        <div style={{ position: 'absolute', bottom: '15%', left: '10%', fontSize: '3rem', opacity: 0.05, animation: 'float 8s ease-in-out infinite 1s' }}>❤️</div>

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
            <h1 className="text-3xl font-bold bg-gradient-to-r from-[#4CAF50] to-[#66BB6A] bg-clip-text text-transparent mb-2">
              Welcome back, Volunteer!
            </h1>
            <p className="text-gray-600 mb-6 flex items-center gap-2">
              <span>Ready to make an impact?</span> 🙏
            </p>
          </motion.div>

          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <Mail size={16} className="text-[#4CAF50]" />
                Email Address
              </label>
              <input
                type="email"
                name="email"
                required
                placeholder="your.email@example.com"
                onChange={handleChange}
                className="w-full p-3 border-2 text-black border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent transition-all"
              />
            </motion.div>

            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <Lock size={16} className="text-[#4CAF50]" />
                Password
              </label>
              <input
                type="password"
                name="password"
                required
                placeholder="••••••••"
                onChange={handleChange}
                className="w-full p-3 border-2 text-black border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent transition-all"
              />
              <div className="flex justify-end mt-1">
                <button
                  type="button"
                  onClick={() => setShowForgotModal(true)}
                  className="text-xs font-semibold text-[#4CAF50] hover:underline"
                >
                  Forgot Password?
                </button>
              </div>
            </motion.div>

            <motion.button
              type="submit"
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-2 w-full py-4 bg-gradient-to-r from-[#4CAF50] to-[#66BB6A] text-white font-bold rounded-xl hover:shadow-xl transition-all flex items-center justify-center gap-2"
            >
              <LogIn size={20} />
              {loading ? "Logging in..." : "Login"}
            </motion.button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500 font-medium">Or continue with</span>
              </div>
            </div>

            <GoogleLoginButton 
              onSuccess={handleGoogleSuccess}
              role="volunteer"
              disabled={loading}
            />
          </form>

          <ForgotPasswordModal 
            isOpen={showForgotModal}
            onClose={() => setShowForgotModal(false)}
          />

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-6 text-center text-gray-600 text-sm"
          >
            Don't have an account?{" "}
            <Link
              to="/volunteer/signup"
              className="text-[#4CAF50] font-bold hover:underline"
            >
              Sign Up
            </Link>
          </motion.p>
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
