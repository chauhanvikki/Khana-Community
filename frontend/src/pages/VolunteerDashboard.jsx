import React, { useEffect, useState, useCallback, lazy, Suspense } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, Package, Calendar, Phone, CheckCircle, Clock, LogOut,
  Sparkles, MessageCircle, Truck, MapPin, X, Heart, Navigation,
  Map as MapIcon, Loader,
} from 'lucide-react';
import Chat from '../components/Chat';
import NotificationBell from '../components/NotificationBell';
import ProfileImageUpload from '../components/ProfileImageUpload';
import { useNotifications } from '../context/NotificationContext';
import { useGeolocation } from '../hooks/useGeolocation';
import { useTracking } from '../hooks/useTracking';
import { API_BASE_URL } from '../config';

const DonationMap = lazy(() => import('../components/DonationMap'));

// ─── Status config ────────────────────────────────────────────────────────────
const STATUS_LABELS = {
  available: { label: 'Available',   color: 'bg-green-100 text-green-600' },
  accepted:  { label: 'Accepted',    color: 'bg-blue-100 text-blue-600' },
  en_route:  { label: 'En Route',    color: 'bg-yellow-100 text-yellow-600' },
  arrived:   { label: 'Arrived',     color: 'bg-orange-100 text-orange-600' },
  picked_up: { label: 'Picked Up',   color: 'bg-purple-100 text-purple-600' },
  completed: { label: 'Completed',   color: 'bg-emerald-100 text-emerald-600' },
  claimed:   { label: 'In Progress', color: 'bg-blue-100 text-blue-600' },
  delivered: { label: 'Delivered',   color: 'bg-purple-100 text-purple-600' },
};

const ACTIVE_STATUSES = ['accepted', 'en_route', 'arrived', 'picked_up'];

function VolunteerDashboard() {
  const [nearbyTasks, setNearbyTasks] = useState([]);
  const [allTasks, setAllTasks] = useState([]);       // fallback: no-coord donations
  const [myTasks, setMyTasks] = useState([]);
  const [volunteer, setVolunteer] = useState(null);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState('');
  const [error, setError] = useState(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [selectedDonor, setSelectedDonor] = useState(null);
  const [activeTab, setActiveTab] = useState('available');
  const [showMap, setShowMap] = useState(true);
  const [trackingTaskId, setTrackingTaskId] = useState(null); // active tracking donation

  const { unreadCounts, markAsRead, socket } = useNotifications();
  const { coords: volunteerCoords, error: geoError, loading: geoLoading, request: requestLocation } = useGeolocation();

  // Volunteer broadcasts their location for the active task
  const { volunteerLocation: _unused } = useTracking(socket, trackingTaskId, 'volunteer');

  const getHeaders = () => ({ Authorization: `Bearer ${localStorage.getItem('token')}`, 'Content-Type': 'application/json' });

  const fetchVolunteer = useCallback(async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/auth/me`, { headers: getHeaders() });
      setVolunteer(res.data);
    } catch (err) { console.error(err); }
  }, []);

  const fetchNearby = useCallback(async (coords) => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/donations/nearby`, {
        headers: getHeaders(),
        params: { lat: coords.lat, lng: coords.lng, maxDistance: 15000 },
      });
      const all = res.data || [];
      setNearbyTasks(all.filter((d) => d.hasCoords));
      setAllTasks(all.filter((d) => !d.hasCoords));
    } catch (err) { console.error(err); }
  }, []);

  const fetchAvailable = useCallback(async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/donations/available`, { headers: getHeaders() });
      setAllTasks(res.data || []);
    } catch (err) { console.error(err); }
  }, []);

  const fetchMyTasks = useCallback(async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/donations/volunteer`, { headers: getHeaders() });
      setMyTasks(res.data || []);
    } catch (err) { console.error(err); }
  }, []);

  // Initial load
  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await Promise.all([fetchVolunteer(), fetchAvailable(), fetchMyTasks()]);
      setLoading(false);
    };
    init();
  }, []);

  // Fetch nearby when volunteer shares location
  useEffect(() => {
    if (volunteerCoords) fetchNearby(volunteerCoords);
  }, [volunteerCoords, fetchNearby]);

  // Auto-set tracking task when there is an active mission
  useEffect(() => {
    const active = myTasks.find((t) => ACTIVE_STATUSES.includes(t.status));
    setTrackingTaskId(active?._id || null);
  }, [myTasks]);

  // Listen for status changes from donor side
  useEffect(() => {
    if (!socket) return;
    const handler = ({ donationId, status }) => {
      setMyTasks((prev) => prev.map((t) => t._id === donationId ? { ...t, status } : t));
    };
    socket.on('status:change', handler);
    return () => socket.off('status:change', handler);
  }, [socket]);

  const doAction = async (taskId, endpoint, nextStatus) => {
    setActionLoading(taskId + endpoint);
    try {
      await axios.put(`${API_BASE_URL}/api/donations/${taskId}/${endpoint}`, {}, { headers: getHeaders() });
      await Promise.all([fetchMyTasks(), fetchNearby(volunteerCoords || { lat: 0, lng: 0 }), fetchAvailable()]);
      if (endpoint === 'claim') setActiveTab('accepted');
    } catch (err) {
      setError(err.response?.data?.message || 'Action failed');
    }
    setActionLoading('');
  };

  const openChat = (id, name, image) => {
    setSelectedDonor({ id, name, image });
    setChatOpen(true);
    markAsRead(id);
  };

  const displayTasks = volunteerCoords
    ? [...nearbyTasks, ...allTasks]
    : allTasks;

  const activeTasks  = myTasks.filter((t) => ACTIVE_STATUSES.includes(t.status));
  const historyTasks = myTasks.filter((t) => ['picked_up', 'delivered', 'completed'].includes(t.status));

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
        className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-6">
              <div className="w-14 h-14 bg-gradient-to-br from-[#4CAF50] to-[#66BB6A] rounded-2xl shadow-lg flex items-center justify-center text-white overflow-hidden border-2 border-white">
                {volunteer?.profileImage
                  ? <img src={`${API_BASE_URL}${volunteer.profileImage}`} alt="" className="w-full h-full object-cover" />
                  : <User size={28} />
                }
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Welcome, {volunteer?.name || 'Volunteer'}! 👋</h1>
                <p className="text-sm text-gray-500 flex items-center gap-2 mt-0.5">
                  <Sparkles size={14} className="text-yellow-500" /> Community Hero
                  {volunteerCoords && (
                    <span className="text-green-600 font-semibold ml-2">📍 Location active</span>
                  )}
                </p>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-4">
              <NotificationBell />
              <ProfileImageUpload currentImage={volunteer?.profileImage} onUploaded={(url) => setVolunteer((u) => ({ ...u, profileImage: url }))} />
              {/* Share Location button */}
              <button onClick={requestLocation} disabled={geoLoading}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all border ${
                  volunteerCoords
                    ? 'bg-green-50 text-green-700 border-green-200'
                    : 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100'
                }`}>
                <Navigation size={16} />
                {geoLoading ? 'Getting…' : volunteerCoords ? 'Location Shared ✓' : 'Share Location'}
              </button>
              <button onClick={() => { localStorage.removeItem('token'); localStorage.removeItem('role'); window.location.replace('/auth/login'); }}
                className="flex items-center gap-2 px-5 py-2.5 bg-red-50 text-red-600 rounded-xl font-bold hover:bg-red-100 transition-all border border-red-100">
                <LogOut size={18} /> Logout
              </button>
            </div>
          </div>
          {geoError && <p className="text-red-500 text-xs mt-2 ml-20">{geoError}</p>}
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Map toggle + map */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <MapIcon size={20} className="text-green-600" />
              {volunteerCoords ? `Nearby Donations (within 15km)` : 'Donations Map'}
              {volunteerCoords && <span className="text-green-600 text-sm font-normal">— showing {nearbyTasks.length} nearby</span>}
            </h2>
            <div className="flex items-center gap-3">
              {!volunteerCoords && (
                <button onClick={requestLocation} disabled={geoLoading}
                  className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-xl text-sm font-bold transition-all">
                  <Navigation size={15} /> {geoLoading ? <Loader size={14} className="animate-spin" /> : 'Share Location to Find Nearby'}
                </button>
              )}
              <button onClick={() => setShowMap((v) => !v)}
                className="px-3 py-2 text-sm text-gray-500 hover:text-gray-700 border rounded-xl hover:bg-gray-50 transition-all">
                {showMap ? 'Hide Map' : 'Show Map'}
              </button>
            </div>
          </div>

          {showMap && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
              <Suspense fallback={<div className="h-[380px] bg-gray-100 rounded-xl flex items-center justify-center text-gray-400">Loading map…</div>}>
                <DonationMap
                  mode="nearby"
                  donations={volunteerCoords ? nearbyTasks : []}
                  volunteerCoords={volunteerCoords}
                  centerOn="volunteer"
                />
              </Suspense>
              <div className="flex gap-4 mt-3 text-xs text-gray-500">
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-blue-500 inline-block" />You</span>
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-green-500 inline-block" />Donations</span>
              </div>
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 bg-white p-2 rounded-2xl shadow-sm border border-gray-100">
          {[
            { id: 'available', label: 'Available', icon: Package, count: displayTasks.length, color: 'text-green-600', bg: 'bg-green-50' },
            { id: 'accepted',  label: 'My Missions', icon: Clock, count: activeTasks.length, color: 'text-orange-600', bg: 'bg-orange-50' },
            { id: 'completed', label: 'History', icon: CheckCircle, count: historyTasks.length, color: 'text-blue-600', bg: 'bg-blue-50' },
          ].map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex-1 min-w-[120px] flex items-center justify-center gap-3 px-6 py-4 rounded-xl font-bold transition-all ${
                activeTab === tab.id ? `${tab.bg} ${tab.color} shadow-sm ring-1 ring-inset ring-black/5` : 'text-gray-400 hover:bg-gray-50'
              }`}>
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
            <X size={20} onClick={() => setError(null)} className="cursor-pointer shrink-0" />
            <p className="font-semibold">{error}</p>
          </div>
        )}

        <AnimatePresence mode="wait">
          {/* ── Available Tab ─────────────────────────────────────────────── */}
          {activeTab === 'available' && (
            <motion.div key="available" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}>
              {!volunteerCoords && (
                <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-xl text-sm text-blue-700 flex items-center gap-3">
                  <Navigation size={18} />
                  <span>Share your location above to see <strong>nearby donations sorted by distance</strong>. Showing all available for now.</span>
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayTasks.length > 0 ? displayTasks.map((task) => (
                  <motion.div whileHover={{ y: -4 }} key={task._id} className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center text-green-600">
                          <Package size={24} />
                        </div>
                        <div className="text-right">
                          <span className="px-3 py-1 bg-green-100 text-green-600 text-[10px] font-black uppercase rounded-full">Available</span>
                          {task.distanceKm && (
                            <p className="text-xs text-gray-500 font-bold mt-1">📍 {task.distanceKm} km away</p>
                          )}
                        </div>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-1">{task.foodName}</h3>
                      <p className="text-gray-500 text-sm mb-4 flex items-center gap-2">
                        <MapPin size={14} className="text-red-500 shrink-0" /> {task.location}
                      </p>
                      <div className="flex items-center gap-3 mb-5 p-3 bg-gray-50 rounded-2xl">
                        <div className="w-8 h-8 rounded-full overflow-hidden bg-white border border-gray-200 flex items-center justify-center">
                          {task.donorId?.profileImage
                            ? <img src={`${API_BASE_URL}${task.donorId.profileImage}`} alt="" className="w-full h-full object-cover" />
                            : <User size={14} className="text-orange-500" />
                          }
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-gray-400 uppercase mb-0.5">Donor</p>
                          <p className="text-sm font-bold text-gray-700">{task.donorId?.name || 'Unknown'}</p>
                        </div>
                      </div>
                      <div className="space-y-2 text-sm mb-6">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Quantity</span>
                          <span className="font-bold text-gray-700">{task.quantity}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Pickup</span>
                          <span className="font-bold text-gray-700">{new Date(task.pickupDate).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => doAction(task._id, 'claim')}
                        disabled={!!actionLoading}
                        className="w-full py-3.5 bg-green-600 hover:bg-green-700 text-white font-bold rounded-2xl shadow-lg shadow-green-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-60">
                        {actionLoading === task._id + 'claim' ? <Loader size={18} className="animate-spin" /> : <><Truck size={18} /> Accept Mission</>}
                      </button>
                    </div>
                  </motion.div>
                )) : (
                  <div className="col-span-full py-20 text-center">
                    <div className="text-6xl mb-4">🍱</div>
                    <h3 className="text-2xl font-bold text-gray-900">All caught up!</h3>
                    <p className="text-gray-500 mt-2">No donations available right now.</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* ── Active Missions Tab ────────────────────────────────────────── */}
          {activeTab === 'accepted' && (
            <motion.div key="accepted" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}>
              <div className="space-y-4">
                {activeTasks.length > 0 ? activeTasks.map((task) => {
                  const statusInfo = STATUS_LABELS[task.status] || STATUS_LABELS['accepted'];
                  const donorId = task.donorId?._id || task.donorId;
                  const taskDonorCoords = task.coordinates?.coordinates?.length === 2 ? {
                    lat: task.coordinates.coordinates[1],
                    lng: task.coordinates.coordinates[0],
                  } : null;

                  return (
                    <div key={task._id} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                      <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                        <div>
                          <div className="flex items-center gap-3 mb-1">
                            <h3 className="text-xl font-bold text-gray-900">{task.foodName}</h3>
                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${statusInfo.color}`}>
                              {statusInfo.label}
                            </span>
                          </div>
                          <p className="text-gray-500 text-sm flex items-center gap-1.5">
                            <MapPin size={13} className="text-red-500" /> {task.location}
                          </p>
                        </div>
                      </div>

                      {/* Inline tracking map for this task */}
                      {ACTIVE_STATUSES.includes(task.status) && volunteerCoords && taskDonorCoords && (
                        <div className="mb-4">
                          <Suspense fallback={<div className="h-44 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400 text-sm">Loading map…</div>}>
                            <DonationMap
                              mode="tracking"
                              volunteerCoords={volunteerCoords}
                              donorCoords={taskDonorCoords}
                              centerOn="volunteer"
                            />
                          </Suspense>
                          <p className="text-xs text-gray-400 mt-1.5">🔵 You &nbsp;|&nbsp; 🟠 Donor pickup point</p>
                        </div>
                      )}
                      {ACTIVE_STATUSES.includes(task.status) && !volunteerCoords && (
                        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-xl text-sm text-blue-700">
                          📍 Share your location to see the route to donor
                        </div>
                      )}
                      {ACTIVE_STATUSES.includes(task.status) && volunteerCoords && !taskDonorCoords && (
                        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-xl text-sm text-yellow-700">
                          ⚠️ Donor hasn't set a map location — use the address above
                        </div>
                      )}

                      {/* Action buttons per status */}
                      <div className="flex flex-wrap gap-3">
                        {task.status === 'accepted' && (
                          <button onClick={() => doAction(task._id, 'start')} disabled={!!actionLoading}
                            className="flex items-center gap-2 px-5 py-3 bg-yellow-500 hover:bg-yellow-600 text-white font-bold rounded-2xl shadow-md transition-all disabled:opacity-60">
                            {actionLoading === task._id + 'start' ? <Loader size={16} className="animate-spin" /> : <><Truck size={16} /> Start Journey</>}
                          </button>
                        )}
                        {task.status === 'en_route' && (
                          <button onClick={() => doAction(task._id, 'arrive')} disabled={!!actionLoading}
                            className="flex items-center gap-2 px-5 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-2xl shadow-md transition-all disabled:opacity-60">
                            {actionLoading === task._id + 'arrive' ? <Loader size={16} className="animate-spin" /> : <><MapPin size={16} /> I've Arrived</>}
                          </button>
                        )}
                        {task.status === 'arrived' && (
                          <button onClick={() => doAction(task._id, 'deliver')} disabled={!!actionLoading}
                            className="flex items-center gap-2 px-5 py-3 bg-purple-500 hover:bg-purple-600 text-white font-bold rounded-2xl shadow-md transition-all disabled:opacity-60">
                            {actionLoading === task._id + 'deliver' ? <Loader size={16} className="animate-spin" /> : <><Package size={16} /> Food Picked Up</>}
                          </button>
                        )}

                        {/* Chat with donor */}
                        <button onClick={() => openChat(donorId, task.donorId?.name || 'Donor', task.donorId?.profileImage)}
                          className="flex items-center gap-2 px-5 py-3 bg-white border-2 border-gray-100 text-gray-700 font-bold rounded-2xl hover:bg-gray-50 transition-all relative">
                          <MessageCircle size={18} className="text-blue-500" />
                          Chat with Donor
                          {unreadCounts[donorId] > 0 && (
                            <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white text-[10px] flex items-center justify-center rounded-full border-2 border-white">
                              {unreadCounts[donorId]}
                            </span>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                }) : (
                  <div className="py-20 text-center bg-white rounded-3xl border-2 border-dashed border-gray-200">
                    <p className="text-gray-400 font-bold text-lg">No active missions.</p>
                    <p className="text-gray-400 text-sm mt-1">Accept a donation to start!</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* ── History Tab ────────────────────────────────────────────────── */}
          {activeTab === 'completed' && (
            <motion.div key="completed" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}>
              <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-8 space-y-4">
                  {historyTasks.length > 0 ? historyTasks.map((task) => (
                    <div key={task._id} className="flex items-center justify-between p-5 hover:bg-green-50/30 rounded-2xl transition-all border border-transparent hover:border-green-100">
                      <div className="flex items-center gap-5">
                        <div className="w-12 h-12 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center">
                          <Heart size={20} fill="currentColor" className="opacity-80" />
                        </div>
                        <div>
                          <p className="font-black text-gray-900">{task.foodName}</p>
                          <p className="text-sm text-gray-500 flex items-center gap-1.5"><MapPin size={12} /> {task.location}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${STATUS_LABELS[task.status]?.color || 'bg-gray-100 text-gray-600'}`}>
                          {STATUS_LABELS[task.status]?.label || task.status}
                        </span>
                        <p className="text-xs text-gray-400 mt-1">{new Date(task.updatedAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  )) : (
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
          onClose={() => { setChatOpen(false); setSelectedDonor(null); }}
          recipientId={selectedDonor.id}
          recipientName={selectedDonor.name}
          recipientRole="donor"
          currentUserId={volunteer?._id?.toString()}
          currentUserRole="volunteer"
          recipientImage={selectedDonor?.image}
        />
      )}
    </div>
  );
}

export default VolunteerDashboard;
