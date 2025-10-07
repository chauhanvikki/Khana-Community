
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { motion } from 'framer-motion';
import { Heart, Mail, Lock, LogIn } from 'lucide-react';

const API_BASE_URL = "http://localhost:5000";

export default function DonorLogin() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError(""); // Clear error when user starts typing
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      // Input validation
      if (!formData.email || !formData.password) {
        throw new Error("Please fill in all fields");
      }

      const res = await axios.post(
        `${API_BASE_URL}/api/auth/login`,
        formData,
        {
          timeout: 10000,
          headers: {
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest'
          },
          withCredentials: false
        }
      );

      const { token, role } = res.data;
      if (!token) {
        throw new Error("No token received");
      }

      // Clear all previous user data
      localStorage.clear();

      // Set new user data
      localStorage.setItem("token", token);

      try {
        const decoded = jwtDecode(token);
        localStorage.setItem("donorId", decoded.id);
        localStorage.setItem("donorName", decoded.name);
        localStorage.setItem("donorEmail", decoded.email);
        localStorage.setItem("userRole", decoded.role || role);
      } catch (decodeErr) {
        console.error("Token decode error:", decodeErr);
        throw new Error("Invalid token received");
      }

      navigate("/auth/welcome");
    } catch (err) {
      console.error("Login error:", err);
      const errorMessage = err.response?.data?.message || err.message || "Login failed";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

//   return (
//     <div className="flex min-h-screen bg-gray-50">
//       {/* Left Side - Hero Image & Info */}
//       <div className="hidden lg:flex w-1/2 bg-green-100 flex-col justify-center items-center p-10">
//         <img
//           src="../public/loginDonate.jpg"
//           alt="Food Donation"
//           className="w-full max-w-md rounded-xl shadow-lg"
          
//         />
//         <h1 className="text-4xl font-bold text-green-800 mt-6">
//           Welcome to Khana Community
//         </h1>
//         <p className="text-lg text-gray-700 mt-2">
//           Serving more than <span className="font-semibold">100+ people</span> daily.
//         </p>
//       </div>

//       {/* Right Side - Login Form */}
//       <div className="flex flex-col justify-center w-full lg:w-1/2 px-8 lg:px-20">
//         <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full mx-auto">
//           <h1 className="text-3xl font-bold text-green-700 mb-2">
//             Welcome back!
//           </h1>
//           <p className="text-gray-600 mb-6">
//             It's nice to see you again. Ready to serve?
//           </p>

//           <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
//             <input
//               type="email"
//               name="email"
//               required
//               placeholder="Your email"
//               onChange={handleChange}
//               className="p-3 border text-black border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
//             />
//             <input
//               type="password"
//               name="password"
//               required
//               placeholder="Your password"
//               onChange={handleChange}
//               className="p-3 text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
//             />
//             <button
//               type="submit"
//               className="bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition duration-300"
//             >
//               Login
//             </button>
//           </form>

//           <p className="mt-4 text-gray-600 text-sm">
//             Don't have an account?{" "}
//             <Link
//               to="/auth/signup"
//               className="text-green-600 font-semibold hover:underline"
//             >
//               Sign Up
//             </Link>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }




// import React, { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import axios from "axios";
// import { jwtDecode } from "jwt-decode";

// export default function DonorLogin() {
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({ email: "", password: "" });

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const res = await axios.post(
//         "http://localhost:5000/api/auth/login",
//         formData
//       );
//       console.log("Logged in:", res.data);

//       const { token } = res.data;
//       localStorage.setItem("token", token);

//       const decoded = jwtDecode(token);
//       localStorage.setItem("donorId", decoded.id);
//       localStorage.setItem("donorName", decoded.name);
//       localStorage.setItem("donorEmail", decoded.email);

//       navigate("/auth/welcome");
//     } catch (err) {
//       console.error(err);
//       alert(err.response?.data?.message || "Login failed");
//     }
//   };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#FFF8E7] via-white to-[#FFE0B2]">
      {/* Left Side - Full Background Image with Overlay */}
      <motion.div 
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="hidden lg:flex w-1/2 relative overflow-hidden bg-gradient-to-br from-[#FFEDD5] via-[#FFF8E7] to-[#FFE0B2]"
      >
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#FF9933 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
        <div className="relative z-10 flex flex-col justify-center items-center text-center p-10">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.5, type: 'spring' }}
            className="mb-6"
          >
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-2xl">
              <Heart size={48} className="text-[#FF9933]" fill="#FF9933" />
            </div>
          </motion.div>
          <motion.h1 
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-5xl font-bold text-[#FF6F00] drop-shadow-2xl mb-4"
          >
            Welcome to<br/>Khana Community
          </motion.h1>
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="text-xl text-[#FF6F00] drop-shadow-lg"
          >
            Serving more than <span className="font-bold">100+ people</span> daily.
          </motion.p>
        </div>
      </motion.div>

      {/* Right Side - Login Form */}
      <div className="flex flex-col justify-center w-full lg:w-1/2 px-8 lg:px-20 relative">
        {/* Floating decorations */}
        <div style={{ position: 'absolute', top: '10%', right: '10%', fontSize: '4rem', opacity: 0.05, animation: 'float 6s ease-in-out infinite' }}>🍚</div>
        <div style={{ position: 'absolute', bottom: '15%', left: '10%', fontSize: '3rem', opacity: 0.05, animation: 'float 8s ease-in-out infinite 1s' }}>🍛</div>

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
            <h1 className="text-3xl font-bold bg-gradient-to-r from-[#FF9933] to-[#FF6F00] bg-clip-text text-transparent mb-2">
              Welcome back, Donor!
            </h1>
            <p className="text-gray-600 mb-6 flex items-center gap-2">
              <span>Ready to make a difference?</span> 🙏
            </p>
          </motion.div>

          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-red-50 border-2 border-red-400 text-red-700 px-4 py-3 rounded-xl mb-4 flex items-center gap-2"
            >
              <span className="text-xl">⚠️</span>
              <span>{error}</span>
            </motion.div>
          )}

          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <Mail size={16} className="text-[#FF9933]" />
                Email Address
              </label>
              <input
                type="email"
                name="email"
                required
                placeholder="your.email@example.com"
                onChange={handleChange}
                className="w-full p-3 text-black border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF9933] focus:border-transparent transition-all"
              />
            </motion.div>

            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <Lock size={16} className="text-[#FF9933]" />
                Password
              </label>
              <input
                type="password"
                name="password"
                required
                placeholder="••••••••"
                onChange={handleChange}
                className="w-full p-3 text-black border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF9933] focus:border-transparent transition-all"
              />
            </motion.div>

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-2 w-full py-4 bg-gradient-to-r from-[#FF9933] to-[#FF6F00] text-white font-bold rounded-xl hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <LogIn size={20} />
              {loading ? "Logging in..." : "Login"}
            </motion.button>
          </form>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-6 text-center text-gray-600 text-sm"
          >
            Don't have an account?{" "}
            <Link
              to="/auth/signup"
              className="text-[#FF9933] font-bold hover:underline"
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
