import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Heart, Package, MapPin, Calendar, User, LogOut, Phone, Image as ImageIcon, MessageCircle } from 'lucide-react';
import Chat from '../components/Chat';
import ProfileImageUpload from '../components/ProfileImageUpload';

const DonorDashboard = () => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    window.location.href = '/auth/login';
    return null;
  }

  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    foodName: '',
    quantity: '',
    pickupDate: '',
    phoneNo:'',
    location: '',
    imageUrl: ''
  });

  const [donations, setDonations] = useState([]);
  const [chatOpen, setChatOpen] = useState(false);
const [selectedVolunteer, setSelectedVolunteer] = useState(null); // { id, name, image? }

  // Fetch current user profile
  const fetchUserProfile = async () => {
    try {
      const res = await axios.get('https://khana-community.onrender.com/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 10000
      });
      setUser(res.data);
    } catch (err) {
      console.error('Error fetching user profile:', err);
      if (err.response?.status === 401) {
        localStorage.clear();
        window.location.href = '/auth/login';
      }
    }
  };

  const fetchMyDonations = async () => {
    try {
      const res = await axios.get('https://khana-community.onrender.com/api/donations/my-donations', {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 10000
      });
      setDonations(res.data || []);
    } catch (err) {
      console.error('Error fetching donations:', err);
      if (err.response?.status === 401) {
        localStorage.clear();
        window.location.href = '/auth/login';
      }
    }
  };

  useEffect(() => {
    fetchUserProfile();
    fetchMyDonations();
    // Light polling so the status reflects automatically when volunteers update it
    const intervalId = setInterval(() => {
      fetchMyDonations();
    }, 10000); // every 10 seconds
    return () => clearInterval(intervalId);
  }, []);

  const handleChange = (e) => {
    const updatedData = { ...formData, [e.target.name]: e.target.value };
    setFormData(updatedData);
    console.log("Form data updated:", updatedData);
  };

  // const donorId = localStorage.getItem('donorId'); // Must be stored during login/signup

const handleSubmit = async (e) => {
  e.preventDefault();
  const token = localStorage.getItem('token');

  if (!token) {
    alert("You must log in before making a donation.");
    localStorage.clear();
    window.location.href = '/auth/login';
    return;
  }

  try {
    // Backend will get donorId from JWT token
    await axios.post('https://khana-community.onrender.com/api/donations', formData, {
      headers: { Authorization: `Bearer ${token}` }
    });

    alert('Donation submitted!');
    setFormData({
      foodName: '',
      quantity: '',
      pickupDate: '',
      phoneNo:'',
      location: '',
      imageUrl: ''
    });
    fetchMyDonations();
  } catch (err) {
    console.error(err.response?.data || err.message);
    const errorMsg = err.response?.data?.message || 'Failed to submit donation';
    alert(errorMsg);
    if (err.response?.status === 401) {
      localStorage.clear();
      window.location.href = '/auth/login';
    }
  }
};


  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/auth/login';
  };

const openChat = (volunteerId, volunteerName, volunteerImage) => {
    console.log('Opening chat with volunteer:', { volunteerId, volunteerName });
    
    if (!volunteerId) {
      console.error('No volunteer ID provided!');
      alert('Cannot open chat: Volunteer ID is missing');
      return;
    }
    
setSelectedVolunteer({ id: volunteerId, name: volunteerName || 'Volunteer', image: volunteerImage || '' });
    setChatOpen(true);
  };

  const closeChat = () => {
    setChatOpen(false);
    setSelectedVolunteer(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF8E7] via-white to-[#FFF0CC]">
      {/* Header */}
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white shadow-md border-b border-gray-200"
      >
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 border">
                {user?.profileImage ? (
                  <img src={user.profileImage} alt={user?.name} className="w-12 h-12 object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">👤</div>
                )}
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-[#FF9933] to-[#FF6F00] bg-clip-text text-transparent">
                  Welcome, {user?.name || 'Donor'}! 👋
                </h1>
                <p className="text-sm text-gray-600 mt-1 flex items-center gap-2">
                  <User size={16} />
                  Role: <span className="font-semibold capitalize text-[#FF9933]">{user?.role || 'donor'}</span>
                </p>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-4">
              <ProfileImageUpload currentImage={user?.profileImage} onUploaded={(url)=> setUser((u)=> ({...u, profileImage: url}))} />
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
                className="flex items-center gap-2 px-6 py-3 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 transition-all shadow-md"
              >
                <LogOut size={18} />
                Logout
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Donation Form */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-1"
          >
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-[#FF9933] to-[#FF6F00] p-6">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <Heart fill="white" size={24} />
                  Make a Donation
                </h2>
                <p className="text-white/90 text-sm mt-1">Share food, share love</p>
              </div>
              
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <Package size={16} className="text-[#FF9933]" />
                    Food Name *
                  </label>
                  <input
                    type="text"
                    name="foodName"
                    value={formData.foodName}
                    onChange={handleChange}
                    placeholder="e.g., Rice, Dal, Roti"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#FF9933] focus:ring-2 focus:ring-[#FF9933]/20 outline-none transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <Package size={16} className="text-[#FF9933]" />
                    Quantity *
                  </label>
                  <input
                    type="text"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleChange}
                    placeholder="e.g., 10 plates, 5kg"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#FF9933] focus:ring-2 focus:ring-[#FF9933]/20 outline-none transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <Calendar size={16} className="text-[#FF9933]" />
                    Pickup Date *
                  </label>
                  <input
                    type="date"
                    name="pickupDate"
                    value={formData.pickupDate}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#FF9933] focus:ring-2 focus:ring-[#FF9933]/20 outline-none transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <Phone size={16} className="text-[#FF9933]" />
                    Mobile Number *
                  </label>
                  <input
                    type="text"
                    name="phoneNo"
                    value={formData.phoneNo}
                    onChange={handleChange}
                    placeholder="10 digit mobile number"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#FF9933] focus:ring-2 focus:ring-[#FF9933]/20 outline-none transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <MapPin size={16} className="text-[#FF9933]" />
                    Location *
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="Pickup address"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#FF9933] focus:ring-2 focus:ring-[#FF9933]/20 outline-none transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <ImageIcon size={16} className="text-[#FF9933]" />
                    Image URL (Optional)
                  </label>
                  <input
                    type="text"
                    name="imageUrl"
                    value={formData.imageUrl}
                    onChange={handleChange}
                    placeholder="Add food image URL"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#FF9933] focus:ring-2 focus:ring-[#FF9933]/20 outline-none transition-all"
                  />
                </div>

                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full mt-6 px-6 py-4 bg-gradient-to-r from-[#FF9933] to-[#FF6F00] text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
                >
                  <Heart fill="white" size={20} />
                  Submit Donation
                </motion.button>
              </form>
            </div>
          </motion.div>

          {/* Donations List */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-2"
          >
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-[#4CAF50] to-[#66BB6A] p-6">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <Package size={24} />
                  My Donations
                </h2>
                <p className="text-white/90 text-sm mt-1">
                  {donations.length} donation{donations.length !== 1 ? 's' : ''} made
                </p>
              </div>

              <div className="p-6">
                {donations.length > 0 ? (
                  <div className="space-y-4">
                    {donations.map((donation, index) => (
                      <motion.div
                        key={donation._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ y: -4 }}
                        className="bg-gradient-to-br from-[#FFF8E7] to-white p-6 rounded-xl border-2 border-gray-100 hover:border-[#FF9933]/30 hover:shadow-md transition-all"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                              🍱 {donation.foodName}
                            </h3>
                          </div>
                          <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                            donation.status === 'available' ? 'bg-green-100 text-green-700' :
                            donation.status === 'claimed' ? 'bg-blue-100 text-blue-700' :
                            donation.status === 'delivered' ? 'bg-emerald-100 text-emerald-700' :
                            'bg-purple-100 text-purple-700'
                          }`}>
                            {donation.status === 'available' ? '✅ Available' :
                             donation.status === 'claimed' ? '⏳ In Progress' :
                             donation.status === 'delivered' ? '📦 Delivered' :
                             '🎉 Completed'}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div className="flex items-center gap-2 text-gray-600">
                            <Calendar size={16} className="text-[#FFD54F]" />
                            {new Date(donation.pickupDate).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric'
                            })}
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <div className="w-6 h-6 rounded-full overflow-hidden bg-gray-100 border">
                              {donation.claimedBy?.profileImage ? (
                                <img src={donation.claimedBy.profileImage} alt={donation.claimedBy.name} className="w-6 h-6 object-cover" />
                              ) : (
                                <User size={16} className="text-[#4CAF50]" />
                              )}
                            </div>
                            {donation.claimedBy ? donation.claimedBy.name : 'No volunteer yet'}
                          </div>
                        </div>

                        {/* Chat Button - Only show if claimed by volunteer */}
                        {donation.claimedBy && (
                          <div className="mt-4 pt-4 border-t border-gray-200">
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => {
                                console.log('Donation claimedBy data:', donation.claimedBy);
                                const volunteerId = typeof donation.claimedBy === 'string' 
                                  ? donation.claimedBy 
                                  : donation.claimedBy._id;
                                const volunteerName = typeof donation.claimedBy === 'object' 
                                  ? donation.claimedBy.name 
                                  : 'Volunteer';
                                const volunteerImage = typeof donation.claimedBy === 'object'
                                  ? donation.claimedBy.profileImage
                                  : '';
                                console.log('Extracted:', { volunteerId, volunteerName, volunteerImage });
                                openChat(volunteerId, volunteerName, volunteerImage);
                              }}
                              className="w-full px-4 py-3 bg-gradient-to-r from-[#4CAF50] to-[#66BB6A] text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
                            >
                              <MessageCircle size={18} />
                              Chat with {typeof donation.claimedBy === 'object' ? donation.claimedBy.name : 'Volunteer'}
                            </motion.button>
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">🍱</div>
                    <p className="text-gray-500 text-lg font-semibold">No donations yet</p>
                    <p className="text-gray-400 text-sm mt-2">Start making a difference today!</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Chat Component */}
      {chatOpen && selectedVolunteer && (
        <Chat
          isOpen={chatOpen}
          onClose={closeChat}
          recipientId={selectedVolunteer.id}
          recipientName={selectedVolunteer.name}
          recipientRole="volunteer"
          currentUserId={user?._id}
          currentUserRole="donor"
          recipientImage={selectedVolunteer?.image}
        />
      )}
    </div>
  );
};

export default DonorDashboard;ame="text-[#FF9933]" />
                    Pickup Date *
                  </label>
                  <input
                    type="date"
                    name="pickupDate"
                    value={formData.pickupDate}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#FF9933] focus:ring-2 focus:ring-[#FF9933]/20 outline-none transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <Phone size={16} className="text-[#FF9933]" />
                    Mobile Number *
                  </label>
                  <input
                    type="text"
                    name="phoneNo"
                    value={formData.phoneNo}
                    onChange={handleChange}
                    placeholder="10 digit mobile number"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#FF9933] focus:ring-2 focus:ring-[#FF9933]/20 outline-none transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <MapPin size={16} className="text-[#FF9933]" />
                    Location *
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="Pickup address"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#FF9933] focus:ring-2 focus:ring-[#FF9933]/20 outline-none transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <ImageIcon size={16} className="text-[#FF9933]" />
                    Image URL (Optional)
                  </label>
                  <input
                    type="text"
                    name="imageUrl"
                    value={formData.imageUrl}
                    onChange={handleChange}
                    placeholder="Add food image URL"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#FF9933] focus:ring-2 focus:ring-[#FF9933]/20 outline-none transition-all"
                  />
                </div>

                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full mt-6 px-6 py-4 bg-gradient-to-r from-[#FF9933] to-[#FF6F00] text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
                >
                  <Heart fill="white" size={20} />
                  Submit Donation
                </motion.button>
              </form>
            </div>
          </motion.div>

          {/* Donations List */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-2"
          >
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-[#4CAF50] to-[#66BB6A] p-6">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <Package size={24} />
                  My Donations
                </h2>
                <p className="text-white/90 text-sm mt-1">
                  {donations.length} donation{donations.length !== 1 ? 's' : ''} made
                </p>
              </div>

              <div className="p-6">
                {donations.length > 0 ? (
                  <div className="space-y-4">
                    {donations.map((donation, index) => (
                      <motion.div
                        key={donation._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ y: -4 }}
                        className="bg-gradient-to-br from-[#FFF8E7] to-white p-6 rounded-xl border-2 border-gray-100 hover:border-[#FF9933]/30 hover:shadow-md transition-all"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                              🍱 {donation.foodName}
                            </h3>
                          </div>
                          <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                            donation.status === 'available' ? 'bg-green-100 text-green-700' :
                            donation.status === 'claimed' ? 'bg-blue-100 text-blue-700' :
                            donation.status === 'delivered' ? 'bg-emerald-100 text-emerald-700' :
                            'bg-purple-100 text-purple-700'
                          }`}>
                            {donation.status === 'available' ? '✅ Available' :
                             donation.status === 'claimed' ? '⏳ In Progress' :
                             donation.status === 'delivered' ? '📦 Delivered' :
                             '🎉 Completed'}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div className="flex items-center gap-2 text-gray-600">
                            <Calendar size={16} className="text-[#FFD54F]" />
                            {new Date(donation.pickupDate).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric'
                            })}
                          </div>
<div className="flex items-center gap-2 text-gray-600">
                            <div className="w-6 h-6 rounded-full overflow-hidden bg-gray-100 border">
                              {donation.claimedBy?.profileImage ? (
                                <img src={donation.claimedBy.profileImage} alt={donation.claimedBy.name} className="w-6 h-6 object-cover" />
                              ) : (
                                <User size={16} className="text-[#4CAF50]" />
                              )}
                            </div>
                            {donation.claimedBy ? donation.claimedBy.name : 'No volunteer yet'}
                          </div>
                        </div>

                        {/* Chat Button - Only show if claimed by volunteer */}
                        {donation.claimedBy && (
                          <div className="mt-4 pt-4 border-t border-gray-200">
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
onClick={() => {
                                console.log('Donation claimedBy data:', donation.claimedBy);
                                const volunteerId = typeof donation.claimedBy === 'string' 
                                  ? donation.claimedBy 
                                  : donation.claimedBy._id;
                                const volunteerName = typeof donation.claimedBy === 'object' 
                                  ? donation.claimedBy.name 
                                  : 'Volunteer';
                                const volunteerImage = typeof donation.claimedBy === 'object'
                                  ? donation.claimedBy.profileImage
                                  : '';
                                console.log('Extracted:', { volunteerId, volunteerName, volunteerImage });
                                openChat(volunteerId, volunteerName, volunteerImage);
                              }}
                              className="w-full px-4 py-3 bg-gradient-to-r from-[#4CAF50] to-[#66BB6A] text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
                            >
                              <MessageCircle size={18} />
                              Chat with {typeof donation.claimedBy === 'object' ? donation.claimedBy.name : 'Volunteer'}
                            </motion.button>
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">🍱</div>
                    <p className="text-gray-500 text-lg font-semibold">No donations yet</p>
                    <p className="text-gray-400 text-sm mt-2">Start making a difference today!</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Chat Component */}
      {chatOpen && selectedVolunteer && (
        <Chat
          isOpen={chatOpen}
          onClose={closeChat}
          recipientId={selectedVolunteer.id}
          recipientName={selectedVolunteer.name}
recipientRole="volunteer"
          currentUserId={user?._id}
          currentUserRole="donor"
          recipientImage={selectedVolunteer?.image}
        />
      )}
    </div>
  );
};

export default DonorDashboard;


// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import "./DonorDashboard.css";

// const DonorDashboard = () => {
//   const donorId = localStorage.getItem("donorId");
//   const donorName = localStorage.getItem("donorName");
//   const token = localStorage.getItem("token");

//   const [formData, setFormData] = useState({
//     foodName: "",
//     quantity: "",
//     pickupDate: "",
//     phoneNo: "",
//     location: "",
//     imageUrl: "",
//   });

//   const [donations, setDonations] = useState([]);

//   const fetchMyDonations = async () => {
//     try {
//       const res = await axios.get("http://localhost:5000/api/donations/my-donations", {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setDonations(res.data);
//     } catch (err) {
//       console.error("Error fetching donations:", err);
//     }
//   };

//   useEffect(() => {
//     fetchMyDonations();
//   }, []);

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       await axios.post("http://localhost:5000/api/donations", formData, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       alert("Donation created successfully!");
//       setFormData({ foodName: "", quantity: "", pickupDate: "", phoneNo: "", location: "", imageUrl: "" });
//       fetchMyDonations(); // refresh list
//     } catch (err) {
//       console.error(err);
//       alert("Error creating donation!");
//     }
//   };

//   return (
//     <div className="donor-dashboard-container">
//       <h2 className="dashboard-title">Donor Dashboard</h2>

//       {/* Donation Form */}
//       <form className="donation-form" onSubmit={handleSubmit}>
//         {/* inputs same as before */}
//         <button type="submit" className="submit-btn">✅ Submit Donation</button>
//       </form>

//       {/* My Donations List */}
//       <h3 className="dashboard-title">My Donations</h3>
//       <table className="donation-table">
//         <thead>
//           <tr>
//             <th>Food</th>
//             <th>Quantity</th>
//             <th>Status</th>
//             <th>Volunteer</th>
//           </tr>
//         </thead>
//         <tbody>
//           {donations.map((d) => (
//             <tr key={d._id}>
//               <td>{d.foodName}</td>
//               <td>{d.quantity}</td>
//               <td>{d.status}</td>
//               <td>{d.claimedBy ? d.claimedBy.name : "Not accepted yet"}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default DonorDashboard;
