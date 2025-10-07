// import React from "react";
// import { useNavigate } from "react-router-dom";

// export default function DonorDashboard() {
//   const navigate = useNavigate();
//   const donorName = localStorage.getItem("donorName") || "Donor";

//   return (
//     <div className="min-h-screen bg-gray-50 flex flex-col items-center p-6">
//       {/* Header */}
//       <header className="w-full max-w-4xl flex justify-between items-center py-4">
//         <h1 className="text-2xl font-bold text-gray-800">
//           Welcome, {donorName}!
//         </h1>
//         <button
//           onClick={() => {
//             localStorage.clear();
//             navigate("/");
//           }}
//           className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
//         >
//           Logout
//         </button>
//       </header>

//       {/* Donate Card */}
//       <div className="bg-white shadow-lg rounded-xl p-8 mt-6 max-w-lg w-full text-center">
//         <h2 className="text-xl font-semibold mb-4">Make a Difference Today</h2>
//         <p className="text-gray-600 mb-6">
//           Your generosity helps feed those in need. Click below to donate food now.
//         </p>
//         <button
//           onClick={() => navigate("/auth/dashboard")}
//           className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition"
//         >
//           Donate Now
//         </button>
//       </div>

//       {/* Extra Section for future */}
//       <div className="mt-10 w-full max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-6">
//         <div className="bg-white shadow-md rounded-lg p-4 text-center text-green-600">
//           <h3 className="text-lg font-semibold">Total Donations</h3>
//           <p className="text-2xl font-bold text-green-600">15</p>
//         </div>
//         <div className="bg-white shadow-md rounded-lg p-4 text-center text-blue-600">
//           <h3 className="text-lg font-semibold">People Served</h3>
//           <p className="text-2xl font-bold text-blue-600">120+</p>
//         </div>
//         <div className="bg-white shadow-md rounded-lg p-4 text-center text-gray-500">
//           <h3 className="text-lg font-semibold">Upcoming Events</h3>
//           <p className="text-gray-500">2 events this month</p>
//         </div>
//       </div>
//     </div>
//   );
// }


import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from 'framer-motion';
import { Heart, Package, LogOut, MessageCircle, Calendar, User, TrendingUp } from 'lucide-react';
import Chat from '../components/Chat';

export default function Welcome() {
  const navigate = useNavigate();
  const donorName = localStorage.getItem("donorName") || "Donor";
  const [donations, setDonations] = useState([]);
  const [chatOpen, setChatOpen] = useState(false);
  const [selectedVolunteer, setSelectedVolunteer] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  // Fetch donor's donations and profile
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        
        // Fetch user profile
        const userRes = await axios.get("http://localhost:5000/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCurrentUser(userRes.data);

        // Fetch donations
        const res = await axios.get("http://localhost:5000/api/donations/my-donations", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDonations(res.data);
      } catch (err) {
        console.error("Error fetching data:", err);
        if (err.response?.status === 401) {
          localStorage.clear();
          navigate('/auth/login');
        }
      }
    };
    fetchData();
  }, []);

  // Real chat function
  const chatWithVolunteer = (volunteerId, volunteerName) => {
    console.log('Opening chat with volunteer:', { volunteerId, volunteerName });
    
    if (!volunteerId) {
      console.error('No volunteer ID provided!');
      alert('Cannot open chat: Volunteer ID is missing');
      return;
    }
    
    setSelectedVolunteer({ id: volunteerId, name: volunteerName || 'Volunteer' });
    setChatOpen(true);
  };

  const closeChat = () => {
    setChatOpen(false);
    setSelectedVolunteer(null);
  };

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #FFF8E7 0%, #FFFFFF 50%, #FFF0CC 100%)' }}>
      {/* Header */}
      <motion.header 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        style={{ background: 'white', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', borderBottom: '1px solid #E5E7EB' }}
      >
        <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '1.5rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 'bold', background: 'linear-gradient(135deg, #FF9933, #FF6F00)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              Welcome, {donorName}! 👋
            </h1>
            <p style={{ fontSize: '0.875rem', color: '#6B7280', marginTop: '0.25rem' }}>Dashboard Overview</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              try {
                localStorage.clear();
                navigate("/");
              } catch (err) {
                console.error('Logout error:', err);
                window.location.href = '/';
              }
            }}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem', background: '#EF4444', color: 'white', border: 'none', borderRadius: '0.75rem', fontWeight: '600', cursor: 'pointer', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
          >
            <LogOut size={18} />
            Logout
          </motion.button>
        </div>
      </motion.header>

      <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '2rem' }}>

        {/* Hero CTA Card */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          style={{ background: 'linear-gradient(135deg, #FF9933, #FF6F00)', borderRadius: '1.5rem', padding: '3rem', textAlign: 'center', boxShadow: '0 20px 40px rgba(255, 153, 51, 0.3)', marginBottom: '2rem' }}
        >
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🍱</div>
          <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: 'white', marginBottom: '1rem' }}>Make a Difference Today</h2>
          <p style={{ fontSize: '1.125rem', color: 'rgba(255,255,255,0.9)', marginBottom: '2rem' }}>
            Your generosity helps feed those in need. Every donation counts!
          </p>
          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/auth/dashboard")}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '1rem 2rem', background: 'white', color: '#FF9933', border: 'none', borderRadius: '0.75rem', fontSize: '1.125rem', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}
          >
            <Heart fill="#FF9933" size={24} />
            Donate Food Now
          </motion.button>
        </motion.div>

        {/* Stats Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            whileHover={{ y: -5 }}
            style={{ background: 'white', borderRadius: '1rem', padding: '2rem', textAlign: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', border: '2px solid #4CAF50' }}
          >
            <div style={{ width: '4rem', height: '4rem', background: 'linear-gradient(135deg, #4CAF50, #66BB6A)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
              <Package size={28} color="white" />
            </div>
            <h3 style={{ fontSize: '0.875rem', color: '#6B7280', fontWeight: '600', marginBottom: '0.5rem' }}>Total Donations</h3>
            <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#4CAF50' }}>{donations.length}</p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            whileHover={{ y: -5 }}
            style={{ background: 'white', borderRadius: '1rem', padding: '2rem', textAlign: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', border: '2px solid #3B82F6' }}
          >
            <div style={{ width: '4rem', height: '4rem', background: 'linear-gradient(135deg, #3B82F6, #60A5FA)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
              <User size={28} color="white" />
            </div>
            <h3 style={{ fontSize: '0.875rem', color: '#6B7280', fontWeight: '600', marginBottom: '0.5rem' }}>People Helped</h3>
            <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#3B82F6' }}>120+</p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            whileHover={{ y: -5 }}
            style={{ background: 'white', borderRadius: '1rem', padding: '2rem', textAlign: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', border: '2px solid #FF9933' }}
          >
            <div style={{ width: '4rem', height: '4rem', background: 'linear-gradient(135deg, #FF9933, #FF6F00)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
              <TrendingUp size={28} color="white" />
            </div>
            <h3 style={{ fontSize: '0.875rem', color: '#6B7280', fontWeight: '600', marginBottom: '0.5rem' }}>Impact Score</h3>
            <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#FF9933' }}>95%</p>
          </motion.div>
        </div>

        {/* Donation List - Now inside the main container */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          style={{ background: 'white', borderRadius: '1.5rem', padding: '2rem', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
        >
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#374151', marginBottom: '1.5rem' }}>Your Recent Donations</h2>

          {donations.length > 0 ? (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: 'linear-gradient(135deg, #4CAF50, #66BB6A)', color: 'white' }}>
                    <th style={{ padding: '0.75rem', textAlign: 'left' }}>Food</th>
                    <th style={{ padding: '0.75rem', textAlign: 'left' }}>Quantity</th>
                    <th style={{ padding: '0.75rem', textAlign: 'left' }}>Pickup Date</th>
                    <th style={{ padding: '0.75rem', textAlign: 'left' }}>Volunteer</th>
                    <th style={{ padding: '0.75rem', textAlign: 'center' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {donations.map((donation, idx) => (
                    <motion.tr 
                      key={donation._id} 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: idx * 0.1 }}
                      style={{ borderTop: '1px solid #E5E7EB' }}
                    >
                      <td style={{ padding: '1rem', color: '#374151' }}>🍱 {donation.foodName}</td>
                      <td style={{ padding: '1rem', color: '#374151' }}>{donation.quantity}</td>
                      <td style={{ padding: '1rem', color: '#374151' }}>
                        {new Date(donation.pickupDate).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </td>
                      <td style={{ padding: '1rem', color: '#374151' }}>
                        {donation.claimedBy ? donation.claimedBy.name : "Waiting for volunteer..."}
                      </td>
                      <td style={{ padding: '1rem', textAlign: 'center' }}>
                        {donation.claimedBy ? (
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => {
                              console.log('Donation claimedBy data:', donation.claimedBy);
                              const volunteerId = typeof donation.claimedBy === 'string' 
                                ? donation.claimedBy 
                                : donation.claimedBy._id;
                              const volunteerName = typeof donation.claimedBy === 'object' 
                                ? donation.claimedBy.name 
                                : 'Volunteer';
                              console.log('Extracted:', { volunteerId, volunteerName });
                              chatWithVolunteer(volunteerId, volunteerName);
                            }}
                            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', background: 'linear-gradient(135deg, #4CAF50, #66BB6A)', color: 'white', border: 'none', borderRadius: '0.5rem', cursor: 'pointer', fontSize: '0.875rem', fontWeight: '600' }}
                          >
                            <MessageCircle size={16} />
                            Chat
                          </motion.button>
                        ) : (
                          <span style={{ color: '#9CA3AF', fontSize: '0.875rem' }}>-</span>
                        )}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '3rem' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🍱</div>
              <p style={{ color: '#9CA3AF', fontSize: '1rem' }}>No donations yet. Start making a difference today!</p>
            </div>
          )}
        </motion.div>
      </div>

      {/* Chat Component */}
      {chatOpen && selectedVolunteer && currentUser && (
        <Chat
          isOpen={chatOpen}
          onClose={closeChat}
          recipientId={selectedVolunteer.id}
          recipientName={selectedVolunteer.name}
          recipientRole="volunteer"
          currentUserId={currentUser._id}
          currentUserRole="donor"
        />
      )}
    </div>
  );
}
