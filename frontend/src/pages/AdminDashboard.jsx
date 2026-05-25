import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, UserCheck, Package, TrendingUp, Search, Filter, 
  Download, LogOut, LayoutDashboard, UserPlus, MessageSquare, 
  CheckCircle, Clock, ShieldCheck, Mail, Phone, Calendar, X
} from 'lucide-react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { API_BASE_URL } from '../config';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [donors, setDonors] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [donations, setDonations] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      const [statsRes, donorsRes, volunteersRes, donationsRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/api/admin/stats`, { headers }),
        axios.get(`${API_BASE_URL}/api/admin/donors`, { headers }),
        axios.get(`${API_BASE_URL}/api/admin/volunteers`, { headers }),
        axios.get(`${API_BASE_URL}/api/admin/donations`, { headers })
      ]);

      setStats(statsRes.data);
      setDonors(donorsRes.data);
      setVolunteers(volunteersRes.data);
      setDonations(donationsRes.data);
    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  const StatCard = ({ title, value, icon: Icon, color, trend }) => (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-start justify-between"
    >
      <div>
        <p className="text-gray-500 text-sm font-medium mb-1">{title}</p>
        <h3 className="text-3xl font-bold text-gray-900">{value}</h3>
        {trend && (
          <p className="text-xs mt-2 flex items-center gap-1 text-green-600">
            <TrendingUp size={12} /> {trend}
          </p>
        )}
      </div>
      <div className={`p-3 rounded-xl ${color} text-white`}>
        <Icon size={24} />
      </div>
    </motion.div>
  );

  const UserProfileModal = ({ user, onClose }) => {
    const [msgLoading, setMsgLoading] = useState(false);
    const [sent, setSent] = useState(false);

    const handleQuickMessage = async (text) => {
      setMsgLoading(true);
      try {
        const token = localStorage.getItem('token');
        await axios.post(`${API_BASE_URL}/api/messages`, {
          recipientId: user._id,
          message: text
        }, { headers: { Authorization: `Bearer ${token}` } });
        setSent(true);
        setTimeout(() => setSent(false), 3000);
      } catch (error) {
        console.error('Error sending message:', error);
      } finally {
        setMsgLoading(false);
      }
    };

    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden"
        >
          <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-700 relative">
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-all"
            >
              <X size={20} />
            </button>
          </div>
          <div className="px-8 pb-8">
            <div className="relative -mt-16 mb-6">
              <div className="w-32 h-32 bg-white rounded-full p-1 shadow-xl mx-auto">
                {user.profileImage ? (
                  <img 
                    src={`${API_BASE_URL}${user.profileImage}`} 
                    alt={user.name} 
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-100 rounded-full flex items-center justify-center text-3xl font-bold text-gray-400 uppercase">
                    {user.name.charAt(0)}
                  </div>
                )}
              </div>
              {user.role === 'admin' && (
                <div className="absolute bottom-2 right-[calc(50%-60px)] bg-blue-500 text-white p-1.5 rounded-full border-4 border-white">
                  <ShieldCheck size={16} />
                </div>
              )}
            </div>

            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900">{user.name}</h3>
              <p className="text-blue-600 font-medium capitalize">{user.role}</p>
            </div>

            {/* Performance Stats */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              {user.role === 'donor' ? (
                <div className="col-span-2 p-4 bg-blue-50 rounded-2xl flex items-center justify-between">
                  <div>
                    <p className="text-xs text-blue-400 font-medium uppercase mb-1">Total Contributions</p>
                    <p className="text-xl font-bold text-blue-900">{user.donationCount || 0} Donations</p>
                  </div>
                  <Package size={32} className="text-blue-200" />
                </div>
              ) : (
                <>
                  <div className="p-4 bg-green-50 rounded-2xl">
                    <p className="text-xs text-green-400 font-medium uppercase mb-1">Total Tasks</p>
                    <p className="text-xl font-bold text-green-900">{user.totalTasks || 0}</p>
                  </div>
                  <div className="p-4 bg-indigo-50 rounded-2xl">
                    <p className="text-xs text-indigo-400 font-medium uppercase mb-1">Completed</p>
                    <p className="text-xl font-bold text-indigo-900">{user.completedTasks || 0}</p>
                  </div>
                </>
              )}
              <div className="p-4 bg-gray-50 rounded-2xl">
                <p className="text-xs text-gray-400 font-medium uppercase mb-1">Email</p>
                <p className="text-sm font-semibold text-gray-900 truncate">{user.email}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-2xl">
                <p className="text-xs text-gray-400 font-medium uppercase mb-1">Joined Date</p>
                <p className="text-sm font-semibold text-gray-900">{new Date(user.createdAt).toLocaleDateString()}</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="p-4 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                <p className="text-xs text-gray-500 font-medium mb-3">QUICK ACTIONS FROM ADMIN</p>
                <div className="flex flex-wrap gap-2">
                  {[
                    "Great Job! 🌟", 
                    "Keep it up! 🚀", 
                    "Excellent work! 🙌", 
                    "Thank you for your help! ❤️"
                  ].map((txt) => (
                    <button
                      key={txt}
                      onClick={() => handleQuickMessage(txt)}
                      disabled={msgLoading}
                      className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-semibold hover:border-blue-400 hover:text-blue-600 transition-all shadow-sm"
                    >
                      {txt}
                    </button>
                  ))}
                </div>
              </div>
              
              {sent && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-green-500 text-white text-center py-2 rounded-xl text-sm font-bold shadow-lg"
                >
                  Message Sent Successfully!
                </motion.div>
              )}

              <button 
                onClick={onClose}
                className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold rounded-xl transition-all"
              >
                Close Profile
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  };

  const lowerQuery = searchQuery.toLowerCase();

  const filteredDonors = donors.filter(d => 
    d.name?.toLowerCase().includes(lowerQuery) || 
    d.email?.toLowerCase().includes(lowerQuery) ||
    d.phone?.toLowerCase().includes(lowerQuery)
  );

  const filteredVolunteers = volunteers.filter(v => 
    v.name?.toLowerCase().includes(lowerQuery) || 
    v.email?.toLowerCase().includes(lowerQuery) ||
    v.phone?.toLowerCase().includes(lowerQuery)
  );

  const filteredDonations = donations.filter(d => 
    d.foodName?.toLowerCase().includes(lowerQuery) ||
    d.donorId?.name?.toLowerCase().includes(lowerQuery) ||
    d.donorId?.email?.toLowerCase().includes(lowerQuery) ||
    d.claimedBy?.name?.toLowerCase().includes(lowerQuery) ||
    d.claimedBy?.phone?.toLowerCase().includes(lowerQuery) ||
    d.status?.toLowerCase().includes(lowerQuery)
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex">
      {/* Sidebar */}
      <div className="w-72 bg-white border-r border-gray-200 fixed h-full flex flex-col">
        <div className="p-8">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-xl">K</div>
            <h1 className="text-xl font-bold text-gray-900">Admin Panel</h1>
          </div>

          <nav className="space-y-2">
            {[
              { id: 'overview', icon: LayoutDashboard, label: 'Overview' },
              { id: 'donors', icon: Users, label: 'Donors List' },
              { id: 'volunteers', icon: UserCheck, label: 'Volunteers List' },
              { id: 'donations', icon: Package, label: 'All Donations' },
              { id: 'queries', icon: MessageSquare, label: 'User Queries' }
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${
                  activeTab === item.id 
                    ? 'bg-blue-50 text-blue-600 font-semibold' 
                    : 'text-gray-500 hover:bg-gray-50'
                }`}
              >
                <item.icon size={20} />
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="mt-auto p-8 border-t border-gray-100">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl transition-all"
          >
            <LogOut size={20} />
            Sign Out
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-72 p-10">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Welcome Back, Vishvendra Singh</h2>
            <p className="text-gray-500">Here's what's happening in Khana Community today.</p>
          </div>
          <div className="flex gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Search..."
                className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button className="bg-white p-2 border border-gray-200 rounded-xl hover:bg-gray-50">
              <Filter size={20} className="text-gray-600" />
            </button>
          </div>
        </header>

        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard 
                  title="Total Donors" 
                  value={stats?.summary?.totalDonors} 
                  icon={Users} 
                  color="bg-blue-600" 
                  trend="+12% from last week"
                />
                <StatCard 
                  title="Active Volunteers" 
                  value={stats?.summary?.totalVolunteers} 
                  icon={UserCheck} 
                  color="bg-green-600"
                  trend="+5% from last week"
                />
                <StatCard 
                  title="Total Donations" 
                  value={stats?.summary?.totalDonations} 
                  icon={Package} 
                  color="bg-orange-600"
                />
                <StatCard 
                  title="Completed" 
                  value={stats?.summary?.completedDonations} 
                  icon={CheckCircle} 
                  color="bg-indigo-600"
                />
              </div>

              {/* Charts Section */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                  <div className="flex justify-between items-center mb-8">
                    <h3 className="text-lg font-bold">Donation Trends</h3>
                    <select className="bg-gray-50 border-none rounded-lg text-sm px-3 py-1">
                      <option>Last 7 Days</option>
                      <option>Last 30 Days</option>
                    </select>
                  </div>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={stats?.donationStats}>
                        <defs>
                          <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#2563EB" stopOpacity={0.1}/>
                            <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                        <XAxis dataKey="_id" axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 12}} />
                        <YAxis axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 12}} />
                        <Tooltip />
                        <Area type="monotone" dataKey="count" stroke="#2563EB" strokeWidth={3} fillOpacity={1} fill="url(#colorCount)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                  <h3 className="text-lg font-bold mb-6">Recent Activity</h3>
                  <div className="space-y-6">
                    {donations.slice(0, 5).map((donation, i) => (
                      <div key={i} className="flex gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                          donation.status === 'completed' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'
                        }`}>
                          {donation.status === 'completed' ? <CheckCircle size={18} /> : <Clock size={18} />}
                        </div>
                        <div>
                          <p className="text-sm font-semibold">{donation.donorId?.name} donated {donation.foodName}</p>
                          <p className="text-xs text-gray-500">{new Date(donation.createdAt).toLocaleString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {(activeTab === 'donors' || activeTab === 'volunteers') && (
            <motion.div
              key="users"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
            >
              <table className="w-full text-left">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-sm font-semibold text-gray-600">User</th>
                    <th className="px-6 py-4 text-sm font-semibold text-gray-600">Contact</th>
                    <th className="px-6 py-4 text-sm font-semibold text-gray-600">Joined</th>
                    <th className="px-6 py-4 text-sm font-semibold text-gray-600">Role</th>
                    <th className="px-6 py-4 text-sm font-semibold text-gray-600 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {(activeTab === 'donors' ? filteredDonors : filteredVolunteers).map((user) => (
                    <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center font-bold text-gray-600 uppercase">
                            {user.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{user.name}</p>
                            <p className="text-xs text-gray-500">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <p className="text-sm flex items-center gap-2 text-gray-600"><Mail size={14} /> {user.email}</p>
                          <p className="text-sm flex items-center gap-2 text-gray-600"><Phone size={14} /> {user.phone || 'N/A'}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase ${
                          user.role === 'donor' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => setSelectedUser(user)}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          View Profile
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </motion.div>
          )}

          {activeTab === 'donations' && (
            <motion.div
              key="donations"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
            >
              <table className="w-full text-left">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-sm font-semibold text-gray-600">Food Item</th>
                    <th className="px-6 py-4 text-sm font-semibold text-gray-600">Donor</th>
                    <th className="px-6 py-4 text-sm font-semibold text-gray-600">Volunteer</th>
                    <th className="px-6 py-4 text-sm font-semibold text-gray-600">Status</th>
                    <th className="px-6 py-4 text-sm font-semibold text-gray-600">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredDonations.map((donation) => (
                    <tr key={donation._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-gray-900">{donation.foodName}</div>
                        <div className="text-xs text-gray-500">{donation.quantity}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium">{donation.donorId?.name}</div>
                        <div className="text-xs text-gray-500">{donation.donorId?.email}</div>
                      </td>
                      <td className="px-6 py-4">
                        {donation.claimedBy ? (
                          <>
                            <div className="text-sm font-medium">{donation.claimedBy?.name}</div>
                            <div className="text-xs text-gray-500">{donation.claimedBy?.phone}</div>
                          </>
                        ) : (
                          <span className="text-xs text-gray-400">Not Claimed</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          donation.status === 'completed' ? 'bg-green-100 text-green-600' : 
                          (donation.status === 'claimed' || donation.status === 'delivered') ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
                        }`}>
                          {donation.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(donation.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {selectedUser && (
            <UserProfileModal 
              user={selectedUser} 
              onClose={() => setSelectedUser(null)} 
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AdminDashboard;
