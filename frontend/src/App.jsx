
// DonorDashboard.jsx
import React, { useState } from 'react';
import axios from 'axios';

const DonorDashboard = ({ donorId, onLogout }) => {
  const [formData, setFormData] = useState({
    foodName: '',
    quantity: '',
    location: '',
    expiryDate: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const dataToSend = { ...formData, donorId };
      console.log("Submitting data:", dataToSend);

      const response = await axios.post('http://localhost:5000/api/donations', dataToSend);

      alert('Donation submitted successfully!');
      setFormData({ foodName: '', quantity: '', location: '', expiryDate: '' });
    } catch (error) {
      console.error("Error submitting donation:", error.response?.data || error.message);
      alert('Submission failed. Please check the form and try again.');
    }
  };

  return (
    <div>
      hello
    </div>
  );
};

export default DonorDashboard;
