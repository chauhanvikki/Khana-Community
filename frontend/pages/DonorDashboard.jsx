// // import React, { useState } from 'react';
// // import axios from 'axios';

// // const DonorDashboard = ({ donorId }) => {
// //   const [formData, setFormData] = useState({
// //     foodName: '',
// //     quantity: '',
// //     expiryDate: '',
// //     location: '',
// //     imageUrl: ''
// //   });

// //   const handleChange = (e) => {
// //     setFormData({ ...formData, [e.target.name]: e.target.value });
// //   };

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();

// //     try {
// //       const dataToSend = { ...formData, donorId }; // add donor ID
// //       const res = await axios.post('http://localhost:5000/api/donations', dataToSend);
// //       alert('Donation submitted!');
// //       setFormData({ foodName: '', quantity: '', expiryDate: '', location: '', imageUrl: '' });
// //     } catch (err) {
// //       console.error(err.response.data);
// //       alert('Something went wrong!');
// //     }
// //   };

// //   return (
// //     <div>
// //       <h2>Donor Dashboard</h2>
// //       <form onSubmit={handleSubmit}>
// //         <input type="text" name="foodName" placeholder="Food Name" value={formData.foodName} onChange={handleChange} required />
// //         <input type="text" name="quantity" placeholder="Quantity" value={formData.quantity} onChange={handleChange} required />
// //         <input type="date" name="expiryDate" value={formData.expiryDate} onChange={handleChange} required />
// //         <input type="text" name="location" placeholder="Location" value={formData.location} onChange={handleChange} required />
// //         <input type="text" name="imageUrl" placeholder="Image URL (optional)" value={formData.imageUrl} onChange={handleChange} />
// //         <button type="submit">Submit Donation</button>
// //       </form>
// //     </div>
// //   );
// // };

// // export default DonorDashboard;


// // DonorDashboard.jsx
// import React, { useState } from 'react';
// import axios from 'axios';
// import './DonorDashboard.css'; // if using plain CSS

// const DonorDashboard = () => {
//   const donorId = localStorage.getItem('donorId');
//   // console.log("Submitting data:", dataToSend);
//   }

//   const [formData, setFormData] = useState({
//     donorId: donorId,
//     foodName: '',
//     quantity: '',
//     expiryDate: '',
//     location: '',
//     imageUrl: ''
//   });

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//     console.log("Form data updated:", { ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const token = localStorage.getItem('token');
//     console.log("Submitting data:", { ...formData, donorId });

//     try {
//       const dataToSend = { ...formData, donor: donorId };

//       const res = await axios.post('http://localhost:5000/api/donations', dataToSend, {
//         headers: { Authorization: `Bearer ${token}` }
//       });

//       alert('Donation submitted!');
//       setFormData({ foodName: '', quantity: '', expiryDate: '', location: '', imageUrl: '' });
//     } catch (err) {
//       console.error(err.response?.data || err.message);
//       alert('Something went wrong!');
//     }
//   };

//   return (
//     <div className="donor-dashboard-container">
//       <h2 className="dashboard-title">Donor Dashboard</h2>
//       <form className="donation-form" onSubmit={handleSubmit}>
//         <input type="text" name="foodName" placeholder="🍲 Food Name" value={formData.foodName} onChange={handleChange} required />
//         <input type="text" name="quantity" placeholder="📦 Quantity" value={formData.quantity} onChange={handleChange} required />
//         <input type="date" name="expiryDate" value={formData.expiryDate} onChange={handleChange} required />
//         <input type="text" name="location" placeholder="📍 Location" value={formData.location} onChange={handleChange} required />
//         <input type="text" name="imageUrl" placeholder="🖼️ Image URL (optional)" value={formData.imageUrl} onChange={handleChange} />
//         <button type="submit" className="submit-btn">✅ Submit Donation</button>
//       </form>
//     </div>
//   );
// };

// export default DonorDashboard;


// // const token = localStorage.getItem('token');

// // await axios.post(
// //   'http://localhost:5000/api/donations',
// //   dataToSend,
// //   { headers: { Authorization: `Bearer ${token}` } }
// // );
// // localStorage.setItem('token', res.data.token);


import React, { useState } from 'react';
import axios from 'axios';
import './DonorDashboard.css';

const DonorDashboard = () => {
  const donorId = localStorage.getItem('donorId');
  const donorName = localStorage.getItem("donorName");
  console.log(`Welcome, ${donorName}!`);

  const [formData, setFormData] = useState({
    donorId: donorId,
    foodName: '',
    quantity: '',
    expiryDate: '',
    location: '',
    imageUrl: ''
  });

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
      expiryDate: '',
      location: '',
      imageUrl: ''
    });
  } catch (err) {
    console.error(err.response?.data || err.message);
    alert('Something went wrong!');
  }
};

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   const token = localStorage.getItem('token');
  //   console.log("Submitting data:", { ...formData, donorId });

  //   try {
  //     const dataToSend = { ...formData, donorId };
  //     await axios.post('http://localhost:5000/api/donations', dataToSend, {
  //       headers: { Authorization: `Bearer ${token}` }
  //     });

  //     alert('Donation submitted!');
  //     setFormData({
  //       donorId: donorId,
  //       foodName: '',
  //       quantity: '',
  //       expiryDate: '',
  //       location: '',
  //       imageUrl: ''
  //     });
  //   } catch (err) {
  //     console.error(err.response?.data || err.message);
  //     alert('Something went wrong!');
  //   }
  // };

  return (
    <div className="donor-dashboard-container">
      <h2 className="dashboard-title">Donor Dashboard</h2>
      <form className="donation-form" onSubmit={handleSubmit}>
        <input type="text" name="foodName" placeholder="🍲 Food Name" value={formData.foodName} onChange={handleChange} required />
        <input type="text" name="quantity" placeholder="📦 Quantity" value={formData.quantity} onChange={handleChange} required />
        <input type="date" name="expiryDate" value={formData.expiryDate} onChange={handleChange} required />
        <input type="text" name="location" placeholder="📍 Location" value={formData.location} onChange={handleChange} required />
        <input type="text" name="imageUrl" placeholder="🖼️ Image URL (optional)" value={formData.imageUrl} onChange={handleChange} />
        <button type="submit" className="submit-btn">✅ Submit Donation</button>
      </form>
    </div>
  );
};

export default DonorDashboard;
