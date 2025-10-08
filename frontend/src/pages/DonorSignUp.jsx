
import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Mail, Lock, User as UserIcon, UserPlus } from 'lucide-react';

export default function DonorSignUp() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const data = { name, email, password ,role:"donor"};

    try {
      const res = await axios.post("https://khana-community.onrender.com/api/auth/signup", data);
      alert("Account created! Please login.");
      console.log(res.data);
      navigate('/auth/login');
    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong");
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#FFF8E7] via-white to-[#FFE0B2]">
      
      {/* Left Side - Background Image */}
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

      {/* Right Side - Sign Up Form */}
      <div className="flex flex-col justify-center w-full lg:w-1/2 px-8 lg:px-20 relative">
        {/* Floating decorations */}
        <div style={{ position: 'absolute', top: '8%', right: '8%', fontSize: '3rem', opacity: 0.05, animation: 'float 6s ease-in-out infinite' }}>🍚</div>
        <div style={{ position: 'absolute', bottom: '12%', left: '8%', fontSize: '2.5rem', opacity: 0.05, animation: 'float 8s ease-in-out infinite 1s' }}>🍛</div>

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
            <h1 className="text-3xl font-bold bg-gradient-to-r from-[#FF9933] to-[#FF6F00] bg-clip-text text-transparent mb-2">Join us as a Donor!</h1>
            <p className="mb-6 text-gray-600">
              Be part of a community making real change.
            </p>
          </motion.div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <UserIcon size={16} className="text-[#FF9933]" />
                Full Name
              </label>
              <input
                placeholder="Enter your full name"
                type="text"
                name="name"
                className="w-full p-3 border-2 border-gray-200 rounded-xl text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FF9933] focus:border-transparent transition-all"
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
                <Mail size={16} className="text-[#FF9933]" />
                Email Address
              </label>
              <input
                placeholder="your.email@example.com"
                type="email"
                name="email"
                className="w-full p-3 border-2 border-gray-200 rounded-xl text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FF9933] focus:border-transparent transition-all"
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
                <Lock size={16} className="text-[#FF9933]" />
                Password
              </label>
              <input
                placeholder="Create a strong password"
                type="password"
                name="password"
                className="w-full p-3 border-2 border-gray-200 rounded-xl text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FF9933] focus:border-transparent transition-all"
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
              className="w-full py-4 bg-gradient-to-r from-[#FF9933] to-[#FF6F00] text-white font-bold rounded-xl hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
              <Link to="/auth/login" className="text-[#FF9933] font-bold hover:underline">
                Login
              </Link>
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



// import React, { useState } from "react";
// import axios from "axios";
// import { Link } from "react-router-dom";

// export default function VolunteerSignUp() {
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const data = { name, email, password };

//     try {
//       const res = await axios.post("http://localhost:5000/api/auth/signup", data);
//       alert("Account created!");
//       console.log(res.data);
//     } catch (err) {
//       alert(err.response?.data?.message || "Something went wrong");
//       console.log(err);
//     }
//   };

//   return (
//     <div className="relative min-h-screen flex items-center justify-center bg-gray-50">
//       {/* Fullscreen Background Image */}
//       <img
//         src="/loginDonate.jpg" // change this to your signup image path
//         alt="Food Donation"
//         className="absolute inset-0 w-full h-full object-cover"
//       />

//       {/* Dark Overlay */}
//       <div className="absolute inset-0  bg-opacity-70"></div>

//       {/* Signup Form */}
//       <div className="relative z-10 bg-white rounded-xl shadow-lg p-8 max-w-md w-full mx-4">
//         <h1 className="text-3xl font-bold text-green-700 mb-2 text-center">
//           Join Us!
//         </h1>
//         <h2 className="text-xl text-center mb-1">
//           Create a Khana Community Account
//         </h2>
//         <p className="text-gray-600 mb-6 text-center">
//           Be a part of a 26 million-strong community of changeMakers
//         </p>

//         <form onSubmit={handleSubmit} className="flex flex-col gap-3">
//           <input
//             placeholder="Your Name"
//             type="text"
//             name="name"
//             className="p-3 text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
//             value={name}
//             onChange={(e) => setName(e.target.value)}
//             required
//           />
//           <input
//             placeholder="Your email"
//             type="email"
//             name="email"
//             className="p-3 text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             required
//           />
//           <input
//             placeholder="Your password"
//             type="password"
//             name="password"
//             className="p-3 border text-black border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             required
//           />

//           <label className="flex items-center mt-2 text-sm text-black">
//             <input type="checkbox" required className="mr-2" />
//             I agree to Khana Community's Terms of Service and Privacy Policy
//           </label>

//           <button
//             type="submit"
//             className="bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition duration-300"
//           >
//             Sign Up
//           </button>

//           <p className="text-center text-sm text-gray-600 mt-2">
//             Already have an account?{" "}
//             <Link to="/auth/login" className="text-green-600 hover:underline">
//               Login
//             </Link>
//           </p>
//         </form>
//       </div>
//     </div>
//   );
// }
