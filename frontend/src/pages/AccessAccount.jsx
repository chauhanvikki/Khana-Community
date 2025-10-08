// // // import { useNavigate } from "react-router-dom"

// // // export default function AccessAccount() {
    
// // //     const navigate=useNavigate();
// // //     const handleVolunteer=()=>{
// // //         navigate("/auth/login")
// // //     }
// // //   return (
// // //     <div className='w-[100vw] h-[100vh] flex gap-[30px] items-center justify-center'>
// // //         <div className='place-content-center w-[45vw] p-[50px] border-amber-50 border-2 h-[90vh]'>
// // //             <h1 className='text-5xl font-[500]'>For Donors</h1>
// // //             <p className='mt-[20px]'>Reduce food waste and support communities in need by donating your surplus food. Your small act can make a big difference </p>
// // //             <button className='btn'>Login</button>
// // //             <p>Don't have an account?</p>
// // //             <span>Sign up</span>
// // //         </div>
// // //         <div className='place-content-center w-[45vw] p-[50px]  border-amber-50 border-2 h-[90vh]'>
// // //             <h1 className='text-5xl font-[500]'>For Volunteers</h1>
// // //             <p className='mt-[20px]'>Join the Food Bridge mission. Help us deliver donated food to the right places. Flexible volunteering with real impact</p>
// // //             <button onClick={handleVolunteer} className='btn'>Login</button>
// // //             <p>Don't have an account?</p>
// // //             <span>Sign up</span>
        
// // //         </div>
// // //     </div>
// // //   )
// // // }


// // import { useNavigate, Link } from "react-router-dom";

// // export default function AccessAccount() {
// //   const navigate = useNavigate();

// //   const handleDonor = () => {
// //     navigate("/donor/login");
// //   };

// //   const handleVolunteer = () => {
// //     navigate("/auth/login");
// //   };

// //   return (
// //     <div className='w-[100vw] h-[100vh] flex gap-[30px] items-center justify-center'>
// //       <div className='place-content-center w-[45vw] p-[50px] border-amber-50 border-2 h-[90vh]'>
// //         <h1 className='text-5xl font-[500]'>For Donors</h1>
// //         <p className='mt-[20px]'>
// //           Reduce food waste and support communities in need by donating your surplus food. Your small act can make a big difference.
// //         </p>
// //         <button onClick={handleDonor} className='bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4'>Login</button>
// //         <p className="mt-2">Don't have an account?</p>
// //         <Link to="/donor/signup" className="text-blue-500 underline">Sign up</Link>
// //       </div>

// //       <div className='place-content-center w-[45vw] p-[50px] border-amber-50 border-2 h-[90vh]'>
// //         <h1 className='text-5xl font-[500]'>For Volunteers</h1>
// //         <p className='mt-[20px]'>
// //           Join the Food Bridge mission. Help us deliver donated food to the right places. Flexible volunteering with real impact.
// //         </p>
// //         <button onClick={handleVolunteer} className='bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-4'>Login</button>
// //         <p className="mt-2">Don't have an account?</p>
// //         <Link to="/auth/signup" className="text-green-500 underline">Sign up</Link>
// //       </div>
// //     </div>
// //   );
// // }


// import React from "react";
// import { useNavigate } from "react-router-dom";

// export default function LandingPage() {
//   const navigate = useNavigate();

//   return (
//     <div className="min-h-screen flex flex-col bg-white">
//       {/* Header */}
//       <header className="flex justify-between items-center p-6 bg-green-600 text-white">
//         <h1 className="text-2xl font-bold">Khana Community 🍽</h1>
//         <nav className="flex gap-6">
//           <button onClick={() => navigate("/auth/login")} className="hover:underline">
//             Login
//           </button>
//           <button onClick={() => navigate("/auth/signup")} className="hover:underline">
//             Sign Up
//           </button>
//         </nav>
//       </header>

//       {/* Hero Section */}
//       <main className="flex flex-col items-center justify-center flex-grow text-center p-6">
//         <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
//           Share Your Meal, Share Your Love ❤️
//         </h2>
//         <p className="text-lg text-gray-600 max-w-2xl mb-8">
//           Join us in fighting hunger by donating surplus food to those in need.
//           Together, we’ve served more than 100+ people and counting!
//         </p>

//         <div className="flex gap-4">
//           <button
//             onClick={() => navigate("/auth/signup")}
//             className="bg-green-500 text-white px-6 py-3 rounded-lg shadow hover:bg-green-600 transition"
//           >
//             Get Started
//           </button>
//           <button
//             onClick={() => navigate("/auth/login")}
//             className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg shadow hover:bg-gray-200 transition"
//           >
//             Login
//           </button>
//         </div>
//       </main>

//       {/* Footer */}
//       <footer className="bg-gray-100 text-gray-600 text-center p-4 text-sm">
//         © {new Date().getFullYear()} Khana Community — Serving with Love
//       </footer>
//     </div>
//   );
// }


import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Users, Package, ArrowRight, Sparkles } from 'lucide-react';
import Contact from '../components/Contact';
import Footer from '../components/Footer';

export default function LandingPage() {
  const navigate = useNavigate();

  const features = [
    { icon: Heart, title: 'Share Love', desc: 'Donate surplus food with ease' },
    { icon: Users, title: '500+ Volunteers', desc: 'Active community helping daily' },
    { icon: Package, title: '10,000+ Meals', desc: 'Delivered to those in need' }
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #FFF8E7 0%, #FFFFFF 50%, #FFE0B2 100%)', position: 'relative', overflow: 'hidden' }}>
      {/* Animated Background Elements */}
      <div style={{ position: 'absolute', top: '10%', left: '5%', fontSize: '6rem', opacity: 0.05, animation: 'float 6s ease-in-out infinite' }}>🍚</div>
      <div style={{ position: 'absolute', top: '60%', right: '10%', fontSize: '5rem', opacity: 0.05, animation: 'float 8s ease-in-out infinite 1s' }}>🥘</div>
      <div style={{ position: 'absolute', bottom: '20%', left: '15%', fontSize: '4rem', opacity: 0.05, animation: 'float 7s ease-in-out infinite 2s' }}>🍞</div>

      {/* Header */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        style={{ background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(10px)', padding: '1.5rem 0', boxShadow: '0 2px 20px rgba(0,0,0,0.08)', position: 'sticky', top: 0, zIndex: 50 }}
      >
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: '3rem', height: '3rem', background: 'linear-gradient(135deg, #FF9933, #FF6F00)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Heart size={24} color="white" fill="white" />
            </div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 'bold', background: 'linear-gradient(135deg, #FF9933, #FF6F00)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Khana Community</h1>
          </div>
          <nav style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => navigate('/auth/login')} style={{ padding: '0.625rem 1.25rem', background: 'white', color: '#FF9933', border: '2px solid #FF9933', borderRadius: '0.5rem', fontWeight: '600', cursor: 'pointer', transition: 'all 0.3s' }}>Donor Login</motion.button>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => navigate('/volunteer/login')} style={{ padding: '0.625rem 1.25rem', background: 'white', color: '#4CAF50', border: '2px solid #4CAF50', borderRadius: '0.5rem', fontWeight: '600', cursor: 'pointer', transition: 'all 0.3s' }}>Volunteer Login</motion.button>
          </nav>
        </div>
      </motion.header>

      {/* Hero Section */}
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '4rem 2rem', position: 'relative' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: 'spring' }} style={{ display: 'inline-block', padding: '0.5rem 1.5rem', background: 'linear-gradient(135deg, #FFD54F, #FF9933)', borderRadius: '2rem', marginBottom: '1.5rem' }}>
            <span style={{ color: 'white', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Sparkles size={18} /> Fighting Hunger Together
            </span>
          </motion.div>
          
          <motion.h2 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: '800', marginBottom: '1.5rem', lineHeight: 1.2 }}>
            Share Your <span style={{ background: 'linear-gradient(135deg, #FF9933, #FF6F00)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Meal</span>,<br/>Share Your <span style={{ background: 'linear-gradient(135deg, #4CAF50, #66BB6A)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Love</span>
          </motion.h2>
          
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} style={{ fontSize: '1.25rem', color: '#666', maxWidth: '700px', margin: '0 auto 3rem', lineHeight: 1.6 }}>
            Join India's largest community platform connecting food donors with volunteers to fight hunger. Every meal matters. 🙏
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <motion.button whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }} onClick={() => navigate('/auth/signup')} style={{ padding: '1rem 2.5rem', background: 'linear-gradient(135deg, #FF9933, #FF6F00)', color: 'white', border: 'none', borderRadius: '0.75rem', fontSize: '1.125rem', fontWeight: '700', cursor: 'pointer', boxShadow: '0 10px 30px rgba(255, 153, 51, 0.3)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              Become a Donor <ArrowRight size={20} />
            </motion.button>
            <motion.button whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }} onClick={() => navigate('/volunteer/signup')} style={{ padding: '1rem 2.5rem', background: 'linear-gradient(135deg, #4CAF50, #66BB6A)', color: 'white', border: 'none', borderRadius: '0.75rem', fontSize: '1.125rem', fontWeight: '700', cursor: 'pointer', boxShadow: '0 10px 30px rgba(76, 175, 80, 0.3)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              Join as Volunteer <ArrowRight size={20} />
            </motion.button>
          </motion.div>
        </div>

        {/* Features */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', marginTop: '5rem' }}>
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <motion.div key={i} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 + i * 0.1 }} whileHover={{ y: -8, scale: 1.03 }} style={{ background: 'white', borderRadius: '1.5rem', padding: '2.5rem', textAlign: 'center', boxShadow: '0 10px 40px rgba(0,0,0,0.08)', border: '2px solid #F5F5F5', cursor: 'pointer' }}>
                <div style={{ width: '5rem', height: '5rem', background: `linear-gradient(135deg, ${i === 0 ? '#FF9933, #FF6F00' : i === 1 ? '#4CAF50, #66BB6A' : '#FFD54F, #FF9933'})`, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                  <Icon size={36} color="white" />
                </div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.75rem', color: '#333' }}>{feature.title}</h3>
                <p style={{ color: '#666', lineHeight: 1.6 }}>{feature.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </main>

      {/* Contact Section */}
      <Contact />
      
      {/* Footer */}
      <Footer />

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
      `}</style>
    </div>
  );
}
