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

export default function Welcome() {
  const navigate = useNavigate();
  const donorName = localStorage.getItem("donorName") || "Donor";
  const [donations, setDonations] = useState([]);

  // Fetch donor's donations
  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/donations/my-donations", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDonations(res.data);
      } catch (err) {
        console.error("Error fetching donations:", err);
        if (err.response?.status === 401) {
          localStorage.clear();
          navigate('/auth/login');
        }
      }
    };
    fetchDonations();
  }, []);

  // Dummy chat navigation (replace with real chat route later)
  const chatWithVolunteer = (volunteerId, volunteerName) => {
    alert(`Chat with ${volunteerName} (${volunteerId}) coming soon 🚀`);
    // navigate(`/chat/${volunteerId}`);  // optional route
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-6">
      {/* Header */}
      <header className="w-full max-w-4xl flex justify-between items-center py-4">
        <h1 className="text-2xl font-bold text-gray-800">
          Welcome, {donorName}!
        </h1>
        <button
          onClick={() => {
            try {
              localStorage.clear();
              navigate("/");
            } catch (err) {
              console.error('Logout error:', err);
              window.location.href = '/';
            }
          }}
          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
        >
          Logout
        </button>
      </header>

      {/* Donate Card */}
      <div className="bg-white shadow-lg rounded-xl p-8 mt-6 max-w-lg w-full text-center">
        <h2 className="text-xl font-semibold mb-4">Make a Difference Today</h2>
        <p className="text-gray-600 mb-6">
          Your generosity helps feed those in need. Click below to donate food now.
        </p>
        <button
          onClick={() => navigate("/auth/dashboard")}
          className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition"
        >
          Donate Now
        </button>
      </div>

      {/* Stats Section */}
      <div className="mt-10 w-full max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white shadow-md rounded-lg p-4 text-center text-green-600">
          <h3 className="text-lg font-semibold">Total Donations</h3>
          <p className="text-2xl font-bold">{donations.length}</p>
        </div>
        <div className="bg-white shadow-md rounded-lg p-4 text-center text-blue-600">
          <h3 className="text-lg font-semibold">People Served</h3>
          <p className="text-2xl font-bold">120+</p>
        </div>
        <div className="bg-white shadow-md rounded-lg p-4 text-center text-gray-500">
          <h3 className="text-lg font-semibold">Upcoming Events</h3>
          <p className="text-gray-500">2 events this month</p>
        </div>
      </div>

      {/* Donation List */}
      <div className="mt-12 w-full max-w-4xl bg-white shadow-lg rounded-xl p-6">
        <h2 className="text-xl font-bold text-gray-700 mb-4">Your Donations</h2>

        {donations.length > 0 ? (
          <table className="w-full border-collapse border">
            <thead>
              <tr className="bg-green-600 text-white">
                <th className="p-3 border">Food</th>
                <th className="p-3 border">Quantity</th>
                <th className="p-3 border">Pickup Date</th>
                <th className="p-3 border">Volunteer</th>
                <th className="p-3 border">Chat</th>
              </tr>
            </thead>
            <tbody>
              {donations.map((donation) => (
                <tr key={donation._id} className="border-t hover:bg-green-50 text-black">
                  <td className="p-3 text-center">{donation.foodName}</td>
                  <td className="p-3 text-center">{donation.quantity}</td>
                  <td className="p-3 text-center">
                    {new Date(donation.pickupDate).toLocaleDateString()}
                  </td>
                  <td className="p-3 text-center">
                    {donation.claimedBy ? donation.claimedBy.name : "Not Accepted Yet"}
                  </td>
                


                  <td className="p-3 text-center">
                    {donation.claimedBy && (
                      <button
                        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                        onClick={() => chatWithVolunteer(donation.claimedBy._id, donation.claimedBy.name)}
                      >
                        Chat
                      </button>
                    )}
                  </td>


                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-500 text-center">No donations yet.</p>
        )}
      </div>
    </div>
  );
}
