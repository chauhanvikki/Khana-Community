import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { motion, AnimatePresence } from 'framer-motion';
import { User, Package, Calendar, Phone, CheckCircle, Clock, LogOut, Sparkles, MessageCircle, Truck, MapPin, X, Heart } from 'lucide-react';
import Chat from '../components/Chat';
import NotificationBell from '../components/NotificationBell';
import ProfileImageUpload from '../components/ProfileImageUpload';
import { useNotifications } from '../context/NotificationContext';

import { API_BASE_URL } from "../config";

function VolunteerDashboard() {
  const [availableTasks, setAvailableTasks] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [volunteer, setVolunteer] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [selectedDonor, setSelectedDonor] = useState(null);
  const [activeTab, setActiveTab] = useState('available');

  const { unreadCounts, markAsRead } = useNotifications();

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  };

  const fetchVolunteer = useCallback(async () => {
    try {
      const headers = getAuthHeaders();
      const response = await axios.get(`${API_BASE_URL}/api/auth/me`, { headers });
      setVolunteer(response.data);
    } catch (err) {
      console.error("Error fetching volunteer profile:", err);
    }
  }, []);

  const fetchAvailableTasks = useCallback(async () => {
    try {
      const headers = getAuthHeaders();
      const response = await axios.get(`${API_BASE_URL}/api/donations/available`, { headers });
      setAvailableTasks(response.data);
    } catch (err) {
      console.error("Error fetching available tasks:", err);
    }
  }, []);

  const fetchAcceptedTasks = useCallback(async () => {
    try {
      const headers = getAuthHeaders();
      const response = await axios.get(`${API_BASE_URL}/api/donations/volunteer`, { headers });
      setTasks(response.data);
    } catch (err) {
      console.error("Error fetching accepted tasks:", err);
    }
  }, []);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        await Promise.all([fetchVolunteer(), fetchAvailableTasks(), fetchAcceptedTasks()]);
      } catch (err) {
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [fetchVolunteer, fetchAvailableTasks, fetchAcceptedTasks]);

  const acceptTask = async (taskId) => {
    try {
      setLoading(true);
      const headers = getAuthHeaders();
      await axios.put(`${API_BASE_URL}/api/donations/${taskId}/claim`, {}, { headers });
      await Promise.all([fetchAvailableTasks(), fetchAcceptedTasks()]);
      setActiveTab('accepted');
    } catch (err) {
      setError(err.response?.data?.message || "Failed to accept task");
    } finally {
      setLoading(false);
    }
  };

  const markAsDelivered = async (taskId) => {
    try {
      setLoading(true);
      const headers = getAuthHeaders();
      await axios.put(`${API_BASE_URL}/api/donations/${taskId}/deliver`, {}, { headers });
      await fetchAcceptedTasks();
    } catch (err) {
      setError("Failed to mark as delivered");
    } finally {
      setLoading(false);
    }
  };

  const completeTask = async (taskId) => {
    try {
      setLoading(true);
      const headers = getAuthHeaders();
      await axios.put(`${API_BASE_URL}/api/donations/${taskId}/complete`, {}, { headers });
      await fetchAcceptedTasks();
      setActiveTab('completed');
    } catch (err) {
      setError("Failed to complete task");
    } finally {
      setLoading(false);
    }
  };

  const openChat = (id, name, image) => {
    setSelectedDonor({ id, name, image });
    setChatOpen(true);
    markAsRead(id);
  };

  const closeChat = () => {
    setChatOpen(false);
    setSelectedDonor(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    window.location.replace("/auth/login");
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-6">
              <div className="w-14 h-14 bg-gradient-to-br from-[#4CAF50] to-[#66BB6A] rounded-2xl shadow-lg flex items-center justify-center text-white overflow-hidden border-2 border-white">
                {volunteer?.profileImage ? (
                  <img src={`${API_BASE_URL}${volunteer.profileImage}`} alt="" className="w-full h-full object-cover" />
                ) : (
                  <User size={28} />
                )}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Welcome, {volunteer?.name || 'Volunteer'}! 👋</h1>
                <p className="text-sm text-gray-500 flex items-center gap-2 mt-0.5">
                  <Sparkles size={14} className="text-yellow-500" /> Community Hero
                </p>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-6">
              <NotificationBell />
              <ProfileImageUpload currentImage={volunteer?.profileImage} onUploaded={(url)=> setVolunteer((u)=> ({...u, profileImage: url}))} />
              <button onClick={handleLogout} className="flex items-center gap-2 px-5 py-2.5 bg-red-50 text-red-600 rounded-xl font-bold hover:bg-red-100 transition-all border border-red-100">
                <LogOut size={18} /> Logout
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 mb-8 bg-white p-2 rounded-2xl shadow-sm border border-gray-100">
          {[
            { id: 'available', label: 'Available', icon: Package, count: availableTasks.length, color: 'text-green-600', bg: 'bg-green-50' },
            { id: 'accepted', label: 'My Tasks', icon: Clock, count: (tasks || []).filter(t => t.status === 'claimed').length, color: 'text-orange-600', bg: 'bg-orange-50' },
            { id: 'completed', label: 'History', icon: CheckCircle, count: (tasks || []).filter(t => t.status === 'delivered' || t.status === 'completed').length, color: 'text-blue-600', bg: 'bg-blue-50' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 min-w-[120px] flex items-center justify-center gap-3 px-6 py-4 rounded-xl font-bold transition-all ${
                activeTab === tab.id 
                  ? `${tab.bg} ${tab.color} shadow-sm ring-1 ring-inset ring-black/5` 
                  : 'text-gray-400 hover:bg-gray-50'
              }`}
            >
              <tab.icon size={20} />
              <div className="text-left">
                <p className="text-[10px] uppercase tracking-widest opacity-60 font-black">{tab.label}</p>
                <p className="text-lg leading-none mt-1">{tab.count}</p>
              </div>
            </button>
          ))}
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 flex items-center gap-3 rounded-r-xl">
            <X size={20} onClick={() => setError(null)} className="cursor-pointer" />
            <p className="font-semibold">{error}</p>
          </div>
        )}

        <AnimatePresence mode="wait">
          {activeTab === 'available' && (
            <motion.div key="available" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {availableTasks.length > 0 ? (
                  availableTasks.map((task) => (
                    <motion.div whileHover={{ y: -5 }} key={task._id} className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden group">
                      <div className="p-6">
                        <div className="flex justify-between items-start mb-6">
                          <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center text-green-600">
                            <Package size={24} />
                          </div>
                          <span className="px-3 py-1 bg-green-100 text-green-600 text-[10px] font-black uppercase rounded-full">Available</span>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{task.foodName}</h3>
                        <p className="text-gray-500 text-sm mb-6 flex items-center gap-2"><MapPin size={14} className="text-red-500" /> {task.location}</p>
                        
                        <div className="flex items-center gap-3 mb-6 p-3 bg-gray-50 rounded-2xl">
                          <div className="w-8 h-8 rounded-full overflow-hidden bg-white border border-gray-200 flex items-center justify-center">
                            {task.donorId?.profileImage ? (
                              <img src={`${API_BASE_URL}${task.donorId.profileImage}`} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <User size={14} className="text-orange-500" />
                            )}
                          </div>
                          <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase leading-none mb-1">Donor</p>
                            <p className="text-sm font-bold text-gray-700">{task.donorId?.name || "Unknown Donor"}</p>
                          </div>
                        </div>

                        <div className="space-y-3 mb-8">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400 font-medium">Quantity:</span>
                            <span className="font-bold text-gray-700">{task.quantity}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400 font-medium">Pickup:</span>
                            <span className="font-bold text-gray-700">{new Date(task.pickupDate).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <button onClick={() => acceptTask(task._id)} className="w-full py-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-2xl shadow-lg shadow-green-500/20 transition-all flex items-center justify-center gap-2">
                          Accept Mission <Truck size={18} />
                        </button>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="col-span-full py-20 text-center">
                    <div className="text-6xl mb-6">🍱</div>
                    <h3 className="text-2xl font-bold text-gray-900">All caught up!</h3>
                    <p className="text-gray-500 max-w-xs mx-auto mt-2">No new donations right now. Thank you for your readiness to help!</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'accepted' && (
            <motion.div key="accepted" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}>
              <div className="space-y-4">
                {(tasks || []).filter(t => t.status === 'claimed').length > 0 ? (
                  (tasks || []).filter(t => t.status === 'claimed').map(task => (
                    <div key={task._id} className="bg-gradient-to-br from-yellow-50 to-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-wrap md:flex-nowrap items-center justify-between gap-8">
                      <div className="flex items-center gap-6 flex-1">
                        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-inner ${task.status === 'delivered' ? 'bg-emerald-50 text-emerald-600' : 'bg-orange-50 text-orange-600'}`}>
                          {task.status === 'delivered' ? <CheckCircle size={32} /> : <Clock size={32} />}
                        </div>
                        <div>
                          <div className="flex items-center gap-3 mb-1">
                            <h3 className="text-2xl font-bold text-gray-900">{task.foodName}</h3>
                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${task.status === 'delivered' ? 'bg-emerald-100 text-emerald-700' : 'bg-orange-100 text-orange-700'}`}>
                              {task.status === 'delivered' ? '📦 Delivered' : '⏳ In Progress'}
                            </span>
                          </div>
                          <p className="text-gray-500 flex items-center gap-1.5 text-sm font-medium"><MapPin size={14} className="text-red-500" /> {task.location}</p>
                          
                          <div className="flex items-center gap-2 mt-4">
                            <div className="w-6 h-6 rounded-full overflow-hidden border border-gray-200">
                              {task.donorId?.profileImage ? (
                                <img src={`${API_BASE_URL}${task.donorId.profileImage}`} alt="" className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full bg-gray-100 flex items-center justify-center text-[10px]">👤</div>
                              )}
                            </div>
                            <p className="text-sm text-gray-600">Donor: <span className="font-bold text-gray-900">{task.donorId?.name || "Donor"}</span></p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
                        <button onClick={() => markAsDelivered(task._id)} className="w-full sm:w-auto px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2">
                           <Truck size={18} /> Mark Delivered
                        </button>
                        
                        <button 
                          onClick={() => openChat(task.donorId?._id || task.donorId, task.donorId?.name || "Donor", task.donorId?.profileImage)} 
                          className="w-full sm:w-auto px-6 py-4 bg-white border-2 border-gray-100 text-gray-700 font-bold rounded-2xl hover:bg-gray-50 transition-all flex items-center justify-center gap-2 relative"
                        >
                          <MessageCircle size={20} className="text-blue-500" />
                          Chat with {task.donorId?.name?.split(' ')[0] || "Donor"}
                          {unreadCounts[task.donorId?._id || task.donorId] > 0 && (
                            <span className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white text-[10px] flex items-center justify-center rounded-full border-2 border-white animate-bounce shadow-lg">
                              {unreadCounts[task.donorId?._id || task.donorId]}
                            </span>
                          )}
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-20 text-center bg-white rounded-3xl border-2 border-dashed border-gray-200">
                    <p className="text-gray-400 font-bold text-lg">No active missions found.</p>
                    <p className="text-gray-400 text-sm mt-1 italic">The community is waiting for your help!</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'completed' && (
            <motion.div key="completed" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}>
              <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-8 space-y-6">
                  {(tasks || []).filter(t => t.status === 'delivered' || t.status === 'completed').length > 0 ? (
                    (tasks || []).filter(t => t.status === 'delivered' || t.status === 'completed').map(task => (
                      <div key={task._id} className="flex items-center justify-between p-6 hover:bg-green-50/30 rounded-3xl transition-all group border border-transparent hover:border-green-100">
                        <div className="flex items-center gap-6">
                          <div className="w-12 h-12 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center shadow-sm">
                            <Heart size={20} fill="currentColor" className="opacity-80" />
                          </div>
                          <div>
                            <p className="font-black text-gray-900 text-lg">{task.foodName}</p>
                            <p className="text-sm text-gray-500 flex items-center gap-1.5"><MapPin size={12} /> {task.location}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 text-right">
                          {task.status === 'delivered' && (
                            <button onClick={() => completeTask(task._id)} className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2">
                              <CheckCircle size={16} /> Complete Mission
                            </button>
                          )}
                          <div>
                            <p className="text-xs font-black text-gray-300 uppercase tracking-widest mb-1">{task.status === 'delivered' ? 'Pending' : 'Completed'}</p>
                            <p className="text-sm font-bold text-gray-500">{new Date(task.updatedAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-10">
                      <div className="text-5xl mb-4 opacity-20">🏆</div>
                      <p className="text-gray-400 font-bold">Your completed missions will appear here!</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {chatOpen && selectedDonor && (
        <Chat
          key={selectedDonor.id}
          isOpen={chatOpen}
          onClose={closeChat}
          recipientId={selectedDonor.id}
          recipientName={selectedDonor.name}
          recipientRole="donor"
          currentUserId={volunteer?._id?.toString() || volunteer?._id}
          currentUserRole="volunteer"
          recipientImage={selectedDonor?.image}
        />
      )}
    </div>
  );
}

export default VolunteerDashboard;
