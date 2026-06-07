import React, { useState, useEffect, lazy, Suspense } from 'react';
import axios from 'axios';
import {
  Heart, Package, MapPin, Calendar, User, LogOut, Phone,
  Image as ImageIcon, MessageCircle, Navigation, CheckCircle,
  Truck, Clock,
} from 'lucide-react';
import Chat from '../components/Chat';
import NotificationBell from '../components/NotificationBell';
import ProfileImageUpload from '../components/ProfileImageUpload';
import { useNotifications } from '../context/NotificationContext';
import { useGeolocation } from '../hooks/useGeolocation';
import LocationPicker from '../components/LocationPicker';
import { useTracking } from '../hooks/useTracking';
import { API_BASE_URL } from '../config';

// Lazy-load map to avoid SSR / leaflet window issues
const DonationMap = lazy(() => import('../components/DonationMap'));

// ─── Status helpers ──────────────────────────────────────────────────────────
const STATUS_STEPS = ['available', 'accepted', 'en_route', 'arrived', 'picked_up', 'completed'];
const STATUS_LABELS = {
  available:  { label: 'Available',   emoji: '✅', color: 'bg-green-100 text-green-700' },
  accepted:   { label: 'Accepted',    emoji: '🤝', color: 'bg-blue-100 text-blue-700' },
  en_route:   { label: 'En Route',    emoji: '🚗', color: 'bg-yellow-100 text-yellow-700' },
  arrived:    { label: 'Arrived',     emoji: '📍', color: 'bg-orange-100 text-orange-700' },
  picked_up:  { label: 'Picked Up',   emoji: '📦', color: 'bg-purple-100 text-purple-700' },
  completed:  { label: 'Completed',   emoji: '🎉', color: 'bg-emerald-100 text-emerald-700' },
  // legacy
  claimed:    { label: 'In Progress', emoji: '⏳', color: 'bg-blue-100 text-blue-700' },
  delivered:  { label: 'Delivered',   emoji: '📦', color: 'bg-purple-100 text-purple-700' },
};

const ACTIVE_TRACKING_STATUSES = ['accepted', 'en_route', 'arrived', 'picked_up'];

// ─── Inline StatusTimeline ───────────────────────────────────────────────────
const StatusTimeline = ({ status }) => {
  const currentIdx = STATUS_STEPS.indexOf(status);
  return (
    <div className="flex items-center gap-1 mt-3 overflow-x-auto pb-1">
      {STATUS_STEPS.map((s, i) => {
        const done = i <= currentIdx;
        const active = i === currentIdx;
        return (
          <React.Fragment key={s}>
            <div className={`flex flex-col items-center shrink-0 ${done ? 'opacity-100' : 'opacity-30'}`}>
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs border-2 ${
                active ? 'border-orange-500 bg-orange-100 text-orange-700 font-bold' :
                done    ? 'border-green-400 bg-green-50 text-green-600' :
                          'border-gray-200 bg-gray-50 text-gray-400'
              }`}>
                {STATUS_LABELS[s]?.emoji}
              </div>
              <span className="text-[9px] text-gray-500 mt-0.5 capitalize">{STATUS_LABELS[s]?.label}</span>
            </div>
            {i < STATUS_STEPS.length - 1 && (
              <div className={`flex-1 h-0.5 shrink-0 min-w-[12px] ${i < currentIdx ? 'bg-green-400' : 'bg-gray-200'}`} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

// ─── Component ───────────────────────────────────────────────────────────────
const DonorDashboard = () => {
  const token = localStorage.getItem('token');
  useEffect(() => { if (!token) window.location.replace('/auth/login'); }, [token]);
  if (!token) return null;

  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    foodName: '', quantity: '', pickupDate: '', phoneNo: '', location: '', imageUrl: '',
  });
  const [donations, setDonations] = useState([]);
  const [chatOpen, setChatOpen] = useState(false);
  const [selectedVolunteer, setSelectedVolunteer] = useState(null);
  const [trackingDonation, setTrackingDonation] = useState(null); // donation being tracked on map
  const [completingId, setCompletingId] = useState(null);
  const [showLocationPicker, setShowLocationPicker] = useState(false);

  const { coords: donorCoords, error: geoError, loading: geoLoading, request: requestLocation } = useGeolocation();
  const [pickedCoords, setPickedCoords] = useState(null);
  const [pickedAddress, setPickedAddress] = useState('');
  const { socket } = useNotifications();
  const { unreadCounts, markAsRead } = useNotifications();

  // Tracking \u2014 donor listens for volunteer live location
  const activeDonationId = trackingDonation?._id || null;
  const { volunteerLocation } = useTracking(socket, activeDonationId, 'donor');

  const headers = { Authorization: `Bearer ${token}` };

  const fetchUserProfile = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/auth/me`, { headers, timeout: 10000 });
      setUser(res.data);
    } catch (err) {
      if (err.response?.status === 401) { localStorage.clear(); window.location.href = '/auth/login'; }
    }
  };

  const fetchMyDonations = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/donations/my-donations`, { headers, timeout: 10000 });
      setDonations(res.data || []);
    } catch (err) {
      if (err.response?.status === 401) { localStorage.clear(); window.location.href = '/auth/login'; }
    }
  };

  useEffect(() => {
    fetchUserProfile();
    fetchMyDonations();
    const id = setInterval(fetchMyDonations, 10000);
    return () => clearInterval(id);
  }, []);

  // Auto-open tracking for active donations
  useEffect(() => {
    if (!trackingDonation && donations.length) {
      const active = donations.find((d) => ACTIVE_TRACKING_STATUSES.includes(d.status));
      if (active) setTrackingDonation(active);
    }
  }, [donations]);

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `${API_BASE_URL}/api/donations`,
        { ...formData, coordinates: pickedCoords || donorCoords || undefined },
        { headers }
      );
      alert('Donation submitted!');
      setFormData({ foodName: '', quantity: '', pickupDate: '', phoneNo: '', location: '', imageUrl: '' });
      setPickedCoords(null);
      setPickedAddress('');
      fetchMyDonations();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit donation');
      if (err.response?.status === 401) { localStorage.clear(); window.location.href = '/auth/login'; }
    }
  };

  const handleComplete = async (donationId) => {
    setCompletingId(donationId);
    try {
      await axios.put(`${API_BASE_URL}/api/donations/${donationId}/complete`, {}, { headers });
      fetchMyDonations();
      if (trackingDonation?._id === donationId) setTrackingDonation(null);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to complete donation');
    }
    setCompletingId(null);
  };

  const openChat = (volunteerId, volunteerName, volunteerImage) => {
    if (!volunteerId) return;
    setSelectedVolunteer({ id: volunteerId, name: volunteerName || 'Volunteer', image: volunteerImage || '' });
    setChatOpen(true);
  };

  const getDonorCoordsFromDonation = (donation) => {
    if (!donation?.coordinates?.coordinates?.length) return null;
    const [lng, lat] = donation.coordinates.coordinates;
    return { lat, lng };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-orange-50">
      {/* Header */}
      <div className="bg-white shadow-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 border">
                {user?.profileImage
                  ? <img src={user.profileImage.startsWith('http') ? user.profileImage : `${API_BASE_URL}${user.profileImage}`} alt={user?.name} className="w-12 h-12 object-cover" />
                  : <div className="w-full h-full flex items-center justify-center text-gray-400">👤</div>
                }
              </div>
              <div>
                <h1 className="text-3xl font-bold text-orange-600">Welcome, {user?.name || 'Donor'}! 👋</h1>
                <p className="text-sm text-gray-600 mt-1 flex items-center gap-2">
                  <User size={16} /> Role: <span className="font-semibold capitalize text-orange-600">{user?.role || 'donor'}</span>
                </p>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-6">
              <NotificationBell />
              <ProfileImageUpload currentImage={user?.profileImage} onUploaded={(url) => setUser((u) => ({ ...u, profileImage: url }))} />
              <button onClick={() => { localStorage.clear(); window.location.replace('/'); }}
                className="flex items-center gap-2 px-6 py-3 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 transition-all shadow-md">
                <LogOut size={18} /> Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Live Tracking Map \u2014 shown when there is an active donation */}
        {trackingDonation && (
          <div className="mb-8 bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  🚗 Live Tracking — {trackingDonation.foodName}
                </h2>
                <p className="text-blue-100 text-sm mt-0.5">
                  {volunteerLocation ? 'Volunteer location is updating in real-time' : 'Waiting for volunteer to share location…'}
                </p>
              </div>
              <button onClick={() => setTrackingDonation(null)} className="text-blue-200 hover:text-white text-sm font-semibold">
                Close Map
              </button>
            </div>
            <div className="p-4">
              <Suspense fallback={<div className="h-[380px] bg-gray-100 rounded-xl flex items-center justify-center text-gray-400">Loading map…</div>}>
                <DonationMap
                  mode="tracking"
                  donorCoords={getDonorCoordsFromDonation(trackingDonation)}
                  volunteerLiveCoords={volunteerLocation}
                  centerOn="donor"
                />
              </Suspense>
              {/* Legend */}
              <div className="flex gap-4 mt-3 text-xs text-gray-500">
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-orange-500 inline-block" />Your location</span>
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-blue-500 inline-block" />Volunteer (live)</span>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Donation Form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <Heart fill="white" size={24} /> Make a Donation
                </h2>
                <p className="text-white/90 text-sm mt-1">Share food, share love</p>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                {/* Location capture button */}
                <div className="p-3 rounded-xl border-2 border-dashed border-orange-200 bg-orange-50">
                  <p className="text-xs text-gray-500 mb-2 font-medium">
                    📍 Share your location so nearby volunteers can find you
                  </p>
                  <button type="button" onClick={() => setShowLocationPicker(true)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-semibold text-sm transition-all">
                    <Navigation size={16} />
                    {pickedCoords ? '📍 Location Set — Change?' : 'Pick My Location on Map'}
                  </button>
                  {pickedAddress && <p className="text-green-600 text-xs mt-2 font-medium">✅ {pickedAddress}</p>}
                  {!pickedCoords && <p className="text-gray-400 text-xs mt-1">Optional — you can skip and type your address below</p>}
                </div>

                {[
                  { name: 'foodName', label: 'Food Name', placeholder: 'e.g., Rice, Dal, Roti', icon: Package },
                  { name: 'quantity', label: 'Quantity', placeholder: 'e.g., 10 plates, 5kg', icon: Package },
                  { name: 'phoneNo', label: 'Mobile Number', placeholder: '10 digit mobile number', icon: Phone },
                ].map(({ name, label, placeholder, icon: Icon }) => (
                  <div key={name}>
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                      <Icon size={16} className="text-orange-500" /> {label} *
                    </label>
                    <input type="text" name={name} value={formData[name]} onChange={handleChange}
                      placeholder={placeholder} required
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all" />
                  </div>
                ))}

                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <Calendar size={16} className="text-orange-500" /> Pickup Date *
                  </label>
                  <input type="date" name="pickupDate" value={formData.pickupDate} onChange={handleChange} required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all" />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <MapPin size={16} className="text-orange-500" /> Address *
                  </label>
                  <input type="text" name="location" value={formData.location} onChange={handleChange}
                    placeholder="Pickup address (e.g., Andheri East, Mumbai)" required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all" />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <ImageIcon size={16} className="text-orange-500" /> Image URL (Optional)
                  </label>
                  <input type="text" name="imageUrl" value={formData.imageUrl} onChange={handleChange}
                    placeholder="Add food image URL"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all" />
                </div>

                <button type="submit"
                  className="w-full mt-6 px-6 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2">
                  <Heart fill="white" size={20} /> Submit Donation
                </button>
              </form>
            </div>
          </div>

          {/* My Donations */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-green-500 to-green-600 p-6">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <Package size={24} /> My Donations
                </h2>
                <p className="text-white/90 text-sm mt-1">{donations.length} donation{donations.length !== 1 ? 's' : ''} made</p>
              </div>

              <div className="p-6">
                {donations.length > 0 ? (
                  <div className="space-y-4">
                    {donations.map((donation) => {
                      const statusInfo = STATUS_LABELS[donation.status] || STATUS_LABELS['available'];
                      const isActive = ACTIVE_TRACKING_STATUSES.includes(donation.status);
                      const isTracking = trackingDonation?._id === donation._id;
                      const volunteerId = typeof donation.claimedBy === 'string' ? donation.claimedBy : donation.claimedBy?._id;
                      const volunteerName = typeof donation.claimedBy === 'object' ? donation.claimedBy?.name : 'Volunteer';
                      const volunteerImage = typeof donation.claimedBy === 'object' ? donation.claimedBy?.profileImage : '';

                      return (
                        <div key={donation._id}
                          className={`p-5 rounded-xl border-2 transition-all ${isTracking ? 'border-blue-400 bg-blue-50/30' : 'border-gray-100 hover:border-orange-300 hover:shadow-md'}`}>
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="text-xl font-bold text-gray-900">🍱 {donation.foodName}</h3>
                            <span className={`px-3 py-1.5 rounded-full text-xs font-bold ${statusInfo.color}`}>
                              {statusInfo.emoji} {statusInfo.label}
                            </span>
                          </div>

                          {/* Status timeline */}
                          <StatusTimeline status={donation.status} />

                          <div className="grid grid-cols-2 gap-3 text-sm mt-4">
                            <div className="flex items-center gap-2 text-gray-600">
                              <Calendar size={15} className="text-yellow-500" />
                              {new Date(donation.pickupDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </div>
                            <div className="flex items-center gap-2 text-gray-600">
                              <MapPin size={15} className="text-red-400" />
                              <span className="truncate">{donation.location}</span>
                            </div>
                            {donation.claimedBy && (
                              <div className="flex items-center gap-2 text-gray-600 col-span-2">
                                <div className="w-5 h-5 rounded-full overflow-hidden bg-gray-100 border shrink-0">
                                  {donation.claimedBy?.profileImage
                                    ? <img src={`${API_BASE_URL}${donation.claimedBy.profileImage}`} alt="" className="w-5 h-5 object-cover" />
                                    : <User size={14} className="text-green-500" />
                                  }
                                </div>
                                <span>Volunteer: <strong>{volunteerName}</strong></span>
                              </div>
                            )}
                          </div>

                          <div className="mt-4 flex flex-wrap gap-2">
                            {/* Track button \u2014 show when active */}
                            {isActive && donation.coordinates && (
                              <button onClick={() => setTrackingDonation(isTracking ? null : donation)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                                  isTracking ? 'bg-blue-500 text-white' : 'bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100'
                                }`}>
                                <Navigation size={15} /> {isTracking ? '🔵 Tracking Active' : 'Track on Map'}
                              </button>
                            )}

                            {/* Complete button \u2014 donor confirms after picked_up */}
                            {donation.status === 'picked_up' && (
                              <button onClick={() => handleComplete(donation._id)} disabled={completingId === donation._id}
                                className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-sm font-semibold transition-all disabled:opacity-60">
                                <CheckCircle size={15} /> {completingId === donation._id ? 'Completing…' : 'Confirm Complete'}
                              </button>
                            )}

                            {/* Chat button */}
                            {donation.claimedBy && (
                              <button onClick={() => openChat(volunteerId, volunteerName, volunteerImage)}
                                className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 border border-green-200 hover:bg-green-100 rounded-xl text-sm font-semibold transition-all relative">
                                <MessageCircle size={15} />
                                Chat with {volunteerName?.split(' ')[0]}
                                {unreadCounts[volunteerId] > 0 && (
                                  <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white text-[9px] flex items-center justify-center rounded-full border-2 border-white">
                                    {unreadCounts[volunteerId]}
                                  </span>
                                )}
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
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
          </div>
        </div>
      </div>

      {showLocationPicker && (
        <LocationPicker
          onConfirm={({ coords, address }) => {
            setPickedCoords(coords);
            setPickedAddress(address);
            if (address && !formData.location) setFormData((p) => ({ ...p, location: address }));
            setShowLocationPicker(false);
          }}
          onClose={() => setShowLocationPicker(false)}
        />
      )}

      {chatOpen && selectedVolunteer && (
        <Chat
          key={selectedVolunteer.id}
          isOpen={chatOpen}
          onClose={() => { setChatOpen(false); setSelectedVolunteer(null); }}
          recipientId={selectedVolunteer.id}
          recipientName={selectedVolunteer.name}
          recipientRole="volunteer"
          currentUserId={user?._id?.toString()}
          currentUserRole="donor"
          recipientImage={selectedVolunteer?.image}
        />
      )}
    </div>
  );
};

export default DonorDashboard;
