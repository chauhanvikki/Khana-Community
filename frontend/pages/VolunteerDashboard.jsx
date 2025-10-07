import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { motion } from 'framer-motion';
import { User, Package, Calendar, Phone, CheckCircle, Clock, LogOut, Sparkles, MessageCircle, Truck } from 'lucide-react';
import Chat from '../components/Chat';
import ProfileImageUpload from '../components/ProfileImageUpload';

const API_BASE_URL = "http://localhost:5000";

function VolunteerDashboard() {
  const [availableTasks, setAvailableTasks] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [volunteer, setVolunteer] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [chatOpen, setChatOpen] = useState(false);
const [selectedDonor, setSelectedDonor] = useState(null); // { id, name, image? }

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No authentication token found");
    }
    return { Authorization: `Bearer ${token}` };
  };

  const fetchAvailableTasks = useCallback(async () => {
    try {
      setError(null);
      const headers = getAuthHeaders();
      const res = await axios.get(`${API_BASE_URL}/api/donations/available`, {
        headers: {
          ...headers,
          'X-Requested-With': 'XMLHttpRequest'
        },
        timeout: 10000,
        withCredentials: false
      });
      console.log('Available tasks response:', res.data);
      setAvailableTasks(res.data || []);
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Failed to fetch available tasks";
      setError(errorMsg);
      console.error("Error fetching available tasks:", err);
    }
  }, []);

  const fetchAcceptedTasks = useCallback(async () => {
    try {
      setError(null);
      const headers = getAuthHeaders();
      const res = await axios.get(`${API_BASE_URL}/api/donations/volunteer`, {
        headers: {
          ...headers,
          'X-Requested-With': 'XMLHttpRequest'
        },
        timeout: 10000,
        withCredentials: false
      });
      console.log('Accepted tasks response:', res.data);
      setTasks(res.data || []);
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Failed to fetch your tasks";
      setError(errorMsg);
      console.error("Error fetching volunteer tasks:", err);
    }
  }, []);

  const fetchVolunteer = useCallback(async () => {
    try {
      setError(null);
      const headers = getAuthHeaders();
      const res = await axios.get(`${API_BASE_URL}/api/auth/me`, {
        headers: {
          ...headers,
          'X-Requested-With': 'XMLHttpRequest'
        },
        timeout: 10000,
        withCredentials: false
      });
      setVolunteer(res.data);
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Failed to fetch volunteer info";
      setError(errorMsg);
      console.error("Error fetching volunteer info:", err);
    }
  }, []);

  // Mark a claimed task as delivered
  const markAsDelivered = async (taskId) => {
    if (!taskId) {
      setError("Invalid task ID");
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const headers = getAuthHeaders();
      await axios.put(
        `${API_BASE_URL}/api/donations/${encodeURIComponent(taskId)}/deliver`,
        {},
        {
          headers: {
            ...headers,
            'X-Requested-With': 'XMLHttpRequest'
          },
          timeout: 10000,
          withCredentials: false
        }
      );
      // Refresh tasks so UI reflects Delivered status
      await fetchAcceptedTasks();
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Failed to mark as delivered";
      setError(errorMsg);
      console.error("Error marking as delivered:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        await Promise.all([
          fetchVolunteer(),
          fetchAvailableTasks(),
          fetchAcceptedTasks()
        ]);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [fetchVolunteer, fetchAvailableTasks, fetchAcceptedTasks]);

  const acceptTask = async (taskId) => {
    if (!taskId) {
      setError("Invalid task ID");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const headers = getAuthHeaders();
      await axios.put(
        `${API_BASE_URL}/api/donations/${encodeURIComponent(taskId)}/claim`,
        {},
        { 
          headers: {
            ...headers,
            'X-Requested-With': 'XMLHttpRequest'
          },
          timeout: 10000,
          withCredentials: false
        }
      );

      await Promise.all([
        fetchAvailableTasks(),
        fetchAcceptedTasks()
      ]);
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Failed to accept task";
      setError(errorMsg);
      console.error("Error accepting task:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/volunteer/login';
  };

const openChat = (donorId, donorName, donorImage) => {
    console.log('Opening chat with donor:', { donorId, donorName });
    
    if (!donorId) {
      console.error('No donor ID provided!');
      alert('Cannot open chat: Donor ID is missing');
      return;
    }
    
setSelectedDonor({ id: donorId, name: donorName || 'Donor', image: donorImage || '' });
    setChatOpen(true);
  };

  const closeChat = () => {
    setChatOpen(false);
    setSelectedDonor(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#E8F5E9] via-white to-[#C8E6C9] flex justify-center items-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center"
        >
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#4CAF50] mx-auto mb-4"></div>
          <p className="text-lg text-gray-600 font-semibold">Loading your dashboard...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E8F5E9] via-white to-[#C8E6C9]">
      {/* Animated Background Elements */}
      <div style={{ position: 'absolute', top: '5%', left: '3%', fontSize: '5rem', opacity: 0.04, animation: 'float 7s ease-in-out infinite' }}>🥘</div>
      <div style={{ position: 'absolute', top: '50%', right: '5%', fontSize: '4rem', opacity: 0.04, animation: 'float 9s ease-in-out infinite 1s' }}>🍱</div>
      <div style={{ position: 'absolute', bottom: '10%', left: '10%', fontSize: '6rem', opacity: 0.04, animation: 'float 8s ease-in-out infinite 2s' }}>🚚</div>

      {/* Header */}
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white shadow-md border-b border-gray-200 sticky top-0 z-50"
      >
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 border">
                {volunteer?.profileImage ? (
                  <img src={volunteer.profileImage} alt={volunteer?.name} className="w-12 h-12 object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">👤</div>
                )}
              </div>
              <div>
                <motion.h1 
                  initial={{ x: -20 }}
                  animate={{ x: 0 }}
                  className="text-3xl font-bold bg-gradient-to-r from-[#4CAF50] to-[#66BB6A] bg-clip-text text-transparent flex items-center gap-2"
                >
                  <Sparkles size={28} className="text-[#4CAF50]" />
                  Welcome, {volunteer ? (volunteer.name || volunteer.username || "Volunteer") : "Volunteer"}! 👋
                </motion.h1>
                <p className="text-sm text-gray-600 mt-1 flex items-center gap-2">
                  <User size={16} />
                  Role: <span className="font-semibold capitalize text-[#4CAF50]">{volunteer?.role === 'volunteer' ? 'Volunteer' : volunteer?.role || 'Volunteer'}</span>
                </p>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-4">
              <ProfileImageUpload currentImage={volunteer?.profileImage} onUploaded={(url)=> setVolunteer((u)=> ({...u, profileImage: url}))} />
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
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-100 border-2 border-red-400 text-red-700 px-6 py-4 rounded-xl mb-6 flex items-center gap-3 shadow-md"
          >
            <span className="text-2xl">⚠️</span>
            <span className="font-semibold">{error}</span>
          </motion.div>
        )}

        {/* Available Tasks Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-[#4CAF50] to-[#66BB6A] p-6">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <Package size={28} />
                Available Tasks
              </h2>
              <p className="text-white/90 text-sm mt-1">
                {availableTasks.length} task{availableTasks.length !== 1 ? 's' : ''} waiting for volunteers
              </p>
            </div>

            <div className="overflow-x-auto">
              {availableTasks.length > 0 ? (
                <div className="p-6 space-y-4">
                  {availableTasks.map((task, index) => {
                    console.log('Available task:', task);
                    return (
                      <motion.div
                        key={task._id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ y: -4 }}
                        className="bg-gradient-to-br from-[#E8F5E9] to-white p-6 rounded-xl border-2 border-gray-100 hover:border-[#4CAF50]/40 hover:shadow-lg transition-all"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
                          <div className="md:col-span-1">
                            <div className="flex items-center gap-2">
                              <Package size={20} className="text-[#4CAF50]" />
                              <div>
                                <p className="text-xs text-gray-500 font-semibold uppercase">Food Item</p>
                                <p className="font-bold text-gray-900">{task.foodName}</p>
                                <p className="text-sm text-gray-600">({task.quantity})</p>
                              </div>
                            </div>
                          </div>

                          <div>
                            <div className="flex items-center gap-2">
                              <Calendar size={18} className="text-[#FFD54F]" />
                              <div>
                                <p className="text-xs text-gray-500 font-semibold uppercase">Pickup Date</p>
                                <p className="font-semibold text-gray-900">
                                  {new Date(task.pickupDate).toLocaleDateString('en-IN', {
                                    day: 'numeric',
                                    month: 'short',
                                    year: 'numeric'
                                  })}
                                </p>
                              </div>
                            </div>
                          </div>

                          <div>
<div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded-full overflow-hidden bg-gray-100 border">
                                {task.donorId?.profileImage ? (
                                  <img src={task.donorId.profileImage} alt={task.donorId?.name} className="w-6 h-6 object-cover" />
                                ) : (
                                  <User size={18} className="text-[#FF9933]" />
                                )}
                              </div>
                              <div>
                                <p className="text-xs text-gray-500 font-semibold uppercase">Donor</p>
                                <p className="font-semibold text-gray-900">{task.donorId?.name || "Unknown Donor"}</p>
                              </div>
                            </div>
                          </div>

                          <div>
                            <div className="flex items-center gap-2">
                              <Phone size={18} className="text-[#2196F3]" />
                              <div>
                                <p className="text-xs text-gray-500 font-semibold uppercase">Phone</p>
                                <p className="font-semibold text-gray-900">{task.donorId?.phone || task.phoneNo}</p>
                              </div>
                            </div>
                          </div>

                          <div className="flex justify-center">
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => acceptTask(task._id)}
                              disabled={loading}
                              className="px-6 py-3 bg-gradient-to-r from-[#4CAF50] to-[#66BB6A] text-white font-bold rounded-xl shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
                            >
                              <CheckCircle size={18} />
                              {loading ? "Processing..." : "Accept Task"}
                            </motion.button>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📦</div>
                  <p className="text-gray-500 text-lg font-semibold">No available tasks right now</p>
                  <p className="text-gray-400 text-sm mt-2">Check back soon for new opportunities to help!</p>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Your Accepted Tasks Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          {(() => {
            // Derive accepted and delivered tasks from all volunteer tasks
            const acceptedTasks = (tasks || []).filter(t => t.status === 'claimed');
            const deliveredTasks = (tasks || []).filter(t => t.status === 'delivered');
            return (
              <>
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden mb-8">
                  <div className="bg-gradient-to-r from-[#FF9933] to-[#FF6F00] p-6">
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                      <Clock size={28} />
                      Your Accepted Tasks
                    </h2>
                    <p className="text-white/90 text-sm mt-1">
                      {acceptedTasks.length} active task{acceptedTasks.length !== 1 ? 's' : ''}
                    </p>
                  </div>

                  <div className="overflow-x-auto">
                    {acceptedTasks.length > 0 ? (
                      <div className="p-6 space-y-4">
                        {acceptedTasks.map((task, index) => (
                          <motion.div
                            key={task._id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ y: -4 }}
                            className="bg-gradient-to-br from-[#FFF8E7] to-white p-6 rounded-xl border-2 border-gray-100 hover:border-[#FF9933]/40 hover:shadow-lg transition-all"
                          >
                            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
                              <div className="md:col-span-1">
                                <div className="flex items-center gap-2">
                                  <Package size={20} className="text-[#FF9933]" />
                                  <div>
                                    <p className="text-xs text-gray-500 font-semibold uppercase">Food Item</p>
                                    <p className="font-bold text-gray-900">{task.foodName}</p>
                                    <p className="text-sm text-gray-600">({task.quantity})</p>
                                  </div>
                                </div>
                              </div>

                              <div>
                                <div className="flex items-center gap-2">
                                  <Calendar size={18} className="text-[#FFD54F]" />
                                  <div>
                                    <p className="text-xs text-gray-500 font-semibold uppercase">Pickup Date</p>
                                    <p className="font-semibold text-gray-900">
                                      {new Date(task.pickupDate).toLocaleDateString('en-IN', {
                                        day: 'numeric',
                                        month: 'short',
                                        year: 'numeric'
                                      })}
                                    </p>
                                  </div>
                                </div>
                              </div>

                              <div>
                                <div className="flex items-center gap-2">
                                  <User size={18} className="text-[#4CAF50]" />
                                  <div>
                                    <p className="text-xs text-gray-500 font-semibold uppercase">Donor</p>
                                    <p className="font-semibold text-gray-900">{task.donorId?.name || task.donorName || "Unknown Donor"}</p>
                                  </div>
                                </div>
                              </div>

                              <div>
                                <div className="flex items-center gap-2">
                                  <Phone size={18} className="text-[#2196F3]" />
                                  <div>
                                    <p className="text-xs text-gray-500 font-semibold uppercase">Phone</p>
                                    <p className="font-semibold text-gray-900">{task.donorId?.phone || task.phoneNo}</p>
                                  </div>
                                </div>
                              </div>

                              <div className="flex flex-col gap-2 justify-center items-center">
                                {/* Status badge for claimed */}
                                <span className="px-4 py-2 rounded-full text-sm font-bold shadow-md bg-gradient-to-r from-blue-400 to-blue-600 text-white">
                                  🔄 In Progress
                                </span>
                                {/* Mark as Delivered button */}
                                <motion.button
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => markAsDelivered(task._id)}
                                  disabled={loading}
                                  className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all flex items-center gap-2 text-sm"
                                >
                                  <Truck size={16} />
                                  {loading ? 'Updating...' : 'Mark as Delivered'}
                                </motion.button>
                                {/* Chat with donor */}
                                <motion.button
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => {
                                    console.log('Task donorId data:', task.donorId);
                                    const donorId = typeof task.donorId === 'string' 
                                      ? task.donorId 
                                      : task.donorId?._id;
                                    const donorName = typeof task.donorId === 'object' 
                                      ? task.donorId?.name 
                                      : task.donorName || 'Donor';
                                    console.log('Extracted:', { donorId, donorName });
                                    openChat(donorId, donorName);
                                  }}
                                  className="px-4 py-2 bg-gradient-to-r from-[#4CAF50] to-[#66BB6A] text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all flex items-center gap-2 text-sm"
                                >
                                  <MessageCircle size={16} />
                                  Chat with Donor
                                </motion.button>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <div className="text-6xl mb-4">🎯</div>
                        <p className="text-gray-500 text-lg font-semibold">You haven't accepted any tasks yet</p>
                        <p className="text-gray-400 text-sm mt-2">Browse available tasks above to get started!</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Delivered Tasks Section */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                  <div className="bg-gradient-to-r from-emerald-500 to-green-600 p-6">
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                      <CheckCircle size={28} />
                      Delivered Tasks
                    </h2>
                    <p className="text-white/90 text-sm mt-1">
                      {deliveredTasks.length} delivered task{deliveredTasks.length !== 1 ? 's' : ''}
                    </p>
                  </div>

                  <div className="overflow-x-auto">
                    {deliveredTasks.length > 0 ? (
                      <div className="p-6 space-y-4">
                        {deliveredTasks.map((task, index) => (
                          <motion.div
                            key={task._id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            whileHover={{ y: -4 }}
                            className="bg-gradient-to-br from-[#E8F5E9] to-white p-6 rounded-xl border-2 border-gray-100 hover:border-emerald-400/40 hover:shadow-lg transition-all"
                          >
                            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
                              <div className="md:col-span-1">
                                <div className="flex items-center gap-2">
                                  <Package size={20} className="text-emerald-600" />
                                  <div>
                                    <p className="text-xs text-gray-500 font-semibold uppercase">Food Item</p>
                                    <p className="font-bold text-gray-900">{task.foodName}</p>
                                    <p className="text-sm text-gray-600">({task.quantity})</p>
                                  </div>
                                </div>
                              </div>

                              <div>
                                <div className="flex items-center gap-2">
                                  <Calendar size={18} className="text-[#FFD54F]" />
                                  <div>
                                    <p className="text-xs text-gray-500 font-semibold uppercase">Pickup Date</p>
                                    <p className="font-semibold text-gray-900">
                                      {new Date(task.pickupDate).toLocaleDateString('en-IN', {
                                        day: 'numeric',
                                        month: 'short',
                                        year: 'numeric'
                                      })}
                                    </p>
                                  </div>
                                </div>
                              </div>

                              <div>
                                <div className="flex items-center gap-2">
                                  <User size={18} className="text-[#4CAF50]" />
                                  <div>
                                    <p className="text-xs text-gray-500 font-semibold uppercase">Donor</p>
                                    <p className="font-semibold text-gray-900">{task.donorId?.name || task.donorName || "Unknown Donor"}</p>
                                  </div>
                                </div>
                              </div>

                              <div>
                                <div className="flex items-center gap-2">
                                  <Phone size={18} className="text-[#2196F3]" />
                                  <div>
                                    <p className="text-xs text-gray-500 font-semibold uppercase">Phone</p>
                                    <p className="font-semibold text-gray-900">{task.donorId?.phone || task.phoneNo}</p>
                                  </div>
                                </div>
                              </div>

                              <div className="flex justify-center items-center">
                                <span className="px-4 py-2 rounded-full text-sm font-bold shadow-md bg-gradient-to-r from-emerald-400 to-green-600 text-white">
                                  ✅ Delivered
                                </span>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <div className="text-6xl mb-4">📦</div>
                        <p className="text-gray-500 text-lg font-semibold">No delivered tasks yet</p>
                        <p className="text-gray-400 text-sm mt-2">Once you deliver, tasks will appear here.</p>
                      </div>
                    )}
                  </div>
                </div>
              </>
            );
          })()}
        </motion.div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
      `}</style>

      {/* Chat Component */}
      {chatOpen && selectedDonor && (
        <Chat
          isOpen={chatOpen}
          onClose={closeChat}
          recipientId={selectedDonor.id}
          recipientName={selectedDonor.name}
          recipientRole="donor"
          currentUserId={volunteer?._id}
          currentUserRole="volunteer"
          recipientImage={selectedDonor?.image}
        />
      )}
    </div>
  );
}

export default VolunteerDashboard;
