import React from "react";
import { useNavigate } from "react-router-dom";

export default function DonorDashboard() {
  const navigate = useNavigate();
  const donorName = localStorage.getItem("donorName") || "Donor";

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-6">
      {/* Header */}
      <header className="w-full max-w-4xl flex justify-between items-center py-4">
        <h1 className="text-2xl font-bold text-gray-800">
          Welcome, {donorName}!
        </h1>
        <button
          onClick={() => {
            localStorage.clear();
            navigate("/");
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

      {/* Extra Section for future */}
      <div className="mt-10 w-full max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white shadow-md rounded-lg p-4 text-center text-green-600">
          <h3 className="text-lg font-semibold">Total Donations</h3>
          <p className="text-2xl font-bold text-green-600">15</p>
        </div>
        <div className="bg-white shadow-md rounded-lg p-4 text-center text-blue-600">
          <h3 className="text-lg font-semibold">People Served</h3>
          <p className="text-2xl font-bold text-blue-600">120+</p>
        </div>
        <div className="bg-white shadow-md rounded-lg p-4 text-center text-gray-500">
          <h3 className="text-lg font-semibold">Upcoming Events</h3>
          <p className="text-gray-500">2 events this month</p>
        </div>
      </div>
    </div>
  );
}

