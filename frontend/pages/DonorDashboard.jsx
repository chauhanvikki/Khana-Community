
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './DonorDashboard.css';

const DonorDashboard = () => {
  const donorId = localStorage.getItem('donorId');
  const donorName = localStorage.getItem("donorName");
  const token = localStorage.getItem('token');
  
  if (!token || !donorId) {
    window.location.href = '/auth/login';
    return null;
  }

  const [formData, setFormData] = useState({
    donorId: donorId,
    foodName: '',
    quantity: '',
    pickupDate: '',
    phoneNo:'',
    location: '',
    imageUrl: ''
  });

  const [donations, setDonations] = useState([]);

  const fetchMyDonations = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/donations/my-donations', {
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
    fetchMyDonations();
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

  if (!donorId) {
    alert("You must log in before making a donation.");
    return;
  }

  try {
    const dataToSend = { ...formData, donorId }; // must match backend key
    await axios.post('http://localhost:5000/api/donations', dataToSend, {
      headers: { Authorization: `Bearer ${token}` }
    });

    alert('Donation submitted!');
    setFormData({
      donorId,
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


  return (
    <div className="donor-dashboard-container">
      <h2 className="dashboard-title">Donor Dashboard</h2>
      <form className="donation-form" onSubmit={handleSubmit}>
        <input type="text" name="foodName" placeholder="🍲 Food Name" value={formData.foodName} onChange={handleChange} required />
        <input type="text" name="quantity" placeholder="📦 Quantity" value={formData.quantity} onChange={handleChange} required />
        <input type="date" name="pickupDate" placeholder="Your pickup date" value={formData.pickupDate} onChange={handleChange} required />
        <input type="text" name="phoneNo" placeholder='Enter mobile no.' value={formData.phoneNo} onChange={handleChange} required/>
        <input type="text" name="location" placeholder="📍 Location" value={formData.location} onChange={handleChange} required />
        <input type="text" name="imageUrl" placeholder="🖼️ Image URL (optional)" value={formData.imageUrl} onChange={handleChange} />
        <button type="submit" className="submit-btn">✅ Submit Donation</button>
      </form>

      <div className="donations-section">
        <h3 className="dashboard-title">My Donations</h3>
        <table className="donation-table">
          <thead>
            <tr>
              <th>Food</th>
              <th>Quantity</th>
              <th>Status</th>
              <th>Volunteer</th>
              <th>Pickup Date</th>
            </tr>
          </thead>
          <tbody>
            {donations.length > 0 ? (
              donations.map((donation) => (
                <tr key={donation._id}>
                  <td>{donation.foodName}</td>
                  <td>{donation.quantity}</td>
                  <td>{donation.status}</td>
                  <td>{donation.claimedBy ? donation.claimedBy.name : "Not accepted yet"}</td>
                  <td>{new Date(donation.pickupDate).toLocaleDateString()}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5">No donations yet</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
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
