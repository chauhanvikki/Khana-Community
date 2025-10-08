import React, { useState, useEffect } from 'react';
import axios from 'axios';
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
  const [selectedVolunteer, setSelectedVolunteer] = useState(null);

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
    const intervalId = setInterval(() => {
      fetchMyDonations();
    }, 10000);
    return () => clearInterval(intervalId);
  }, []);

  const handleChange = (e) => {
    const updatedData = { ...formData, [e.target.name]: e.target.value };
    setFormData(updatedData);
  };

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
    if (!volunteerId) {
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
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-orange-50">
      <div className="bg-white shadow-md border-b border-gray-200">
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
                <h1 className="text-3xl font-bold text-orange-600">
                  Welcome, {user?.name || 'Donor'}! 👋
                </h1>
                <p className="text-sm text-gray-600 mt-1 flex items-center gap-2">
                  <User size={16} />
                  Role: <span className="font-semibold capitalize text-orange-600">{user?.role || 'donor'}</span>
                </p>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-4">
              <ProfileImageUpload currentImage={user?.profileImage} onUploaded={(url)=> setUser((u)=> ({...u, profileImage: url}))} />
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-6 py-3 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 transition-all shadow-md"
              >
                <LogOut size={18} />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <Heart fill="white" size={24} />
                  Make a Donation
                </h2>
                <p className="text-white/90 text-sm mt-1">Share food, share love</p>
              </div>
              
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <Package size={16} className="text-orange-500" />
                    Food Name *
                  </label>
                  <input
                    type="text"
                    name="foodName"
                    value={formData.foodName}
                    onChange={handleChange}
                    placeholder="e.g., Rice, Dal, Roti"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <Package size={16} className="text-orange-500" />
                    Quantity *
                  </label>
                  <input
                    type="text"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleChange}
                    placeholder="e.g., 10 plates, 5kg"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <Calendar size={16} className="text-orange-500" />
                    Pickup Date *
                  </label>
                  <input
                    type="date"
                    name="pickupDate"
                    value={formData.pickupDate}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <Phone size={16} className="text-orange-500" />
                    Mobile Number *
                  </label>
                  <input
                    type="text"
                    name="phoneNo"
                    value={formData.phoneNo}
                    onChange={handleChange}
                    placeholder="10 digit mobile number"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <MapPin size={16} className="text-orange-500" />
                    Location *
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="Pickup address"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <ImageIcon size={16} className="text-orange-500" />
                    Image URL (Optional)
                  </label>
                  <input
                    type="text"
                    name="imageUrl"
                    value={formData.imageUrl}
                    onChange={handleChange}
                    placeholder="Add food image URL"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full mt-6 px-6 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
                >
                  <Heart fill="white" size={20} />
                  Submit Donation
                </button>
              </form>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-green-500 to-green-600 p-6">
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
                      <div
                        key={donation._id}
                        className="bg-gradient-to-br from-yellow-50 to-white p-6 rounded-xl border-2 border-gray-100 hover:border-orange-300 hover:shadow-md transition-all"
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
                            <Calendar size={16} className="text-yellow-500" />
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
                                <User size={16} className="text-green-500" />
                              )}
                            </div>
                            {donation.claimedBy ? donation.claimedBy.name : 'No volunteer yet'}
                          </div>
                        </div>

                        {donation.claimedBy && (
                          <div className="mt-4 pt-4 border-t border-gray-200">
                            <button
                              onClick={() => {
                                const volunteerId = typeof donation.claimedBy === 'string' 
                                  ? donation.claimedBy 
                                  : donation.claimedBy._id;
                                const volunteerName = typeof donation.claimedBy === 'object' 
                                  ? donation.claimedBy.name 
                                  : 'Volunteer';
                                const volunteerImage = typeof donation.claimedBy === 'object'
                                  ? donation.claimedBy.profileImage
                                  : '';
                                openChat(volunteerId, volunteerName, volunteerImage);
                              }}
                              className="w-full px-4 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
                            >
                              <MessageCircle size={18} />
                              Chat with {typeof donation.claimedBy === 'object' ? donation.claimedBy.name : 'Volunteer'}
                            </button>
                          </div>
                        )}
                      </div>
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
          </div>
        </div>
      </div>

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