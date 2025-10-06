
import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function VolunteerSignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = { name, email, password ,role:"donor"};

    try {
      const res = await axios.post("http://localhost:5000/api/auth/signup", data);
      alert("Account created!");
      console.log(res.data);
    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong");
      console.log(err);
    }
  };

  return (
    <div className="flex min-h-screen">
      
      {/* Left Side - Background Image */}
      <div className="hidden lg:flex w-1/2 relative">
        <img
          src="/sign.jpg" // Must be in public folder
          alt="Food Donation"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-green bg-opacity-40"></div>
        <div className="relative z-10 flex flex-col mt-4 items-center text-black p-10">
          <h1 className="text-4xl font-bold">Welcome to Khana Community</h1>
          <p className="text-lg mt-2">Serving more than 100+ people daily.</p>
        </div>
      </div>

      {/* Right Side - Sign Up Form */}
      <div className="flex flex-col justify-center w-full lg:w-1/2 px-8 lg:px-20 bg-white">
        <div className="max-w-md w-full mx-auto">
          <h1 className="text-3xl font-bold text-green-700 mb-2">Join us!</h1>
          <h2 className="text-xl mb-1">Create a Khana Community Account</h2>
          <p className="mb-6 text-gray-600">
            Be a part of a 26 million-strong community of change makers.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <input
              placeholder="Your Name"
              type="text"
              name="name"
              className="p-3 border border-gray-300 rounded text-black placeholder-gray-500"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <input
              placeholder="Your username or email"
              type="email"
              name="email"
              className="p-3 border border-gray-300 rounded text-black placeholder-gray-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              placeholder="Your password"
              type="password"
              name="password"
              className="p-3 border border-gray-300 rounded text-black placeholder-gray-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <label className="flex items-center mt-2 text-sm text-gray-700">
              <input type="checkbox" required className="mr-2" />
              I agree to Khana Community's Terms of Service and Privacy Policy
            </label>

            <input
              className="bg-green-600 text-white px-4 py-3 mt-2 rounded cursor-pointer hover:bg-green-700"
              type="submit"
              value="Sign Up"
            />
            <span className="text-sm text-gray-600 mt-2">
              Already have an account?{" "}
              <Link to="/auth/login" className="text-blue-600 hover:underline">
                Login
              </Link>
            </span>
          </form>
        </div>
      </div>
    </div>
  );
}



// import React, { useState } from "react";
// import axios from "axios";
// import { Link } from "react-router-dom";

// export default function VolunteerSignUp() {
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const data = { name, email, password };

//     try {
//       const res = await axios.post("http://localhost:5000/api/auth/signup", data);
//       alert("Account created!");
//       console.log(res.data);
//     } catch (err) {
//       alert(err.response?.data?.message || "Something went wrong");
//       console.log(err);
//     }
//   };

//   return (
//     <div className="relative min-h-screen flex items-center justify-center bg-gray-50">
//       {/* Fullscreen Background Image */}
//       <img
//         src="/loginDonate.jpg" // change this to your signup image path
//         alt="Food Donation"
//         className="absolute inset-0 w-full h-full object-cover"
//       />

//       {/* Dark Overlay */}
//       <div className="absolute inset-0  bg-opacity-70"></div>

//       {/* Signup Form */}
//       <div className="relative z-10 bg-white rounded-xl shadow-lg p-8 max-w-md w-full mx-4">
//         <h1 className="text-3xl font-bold text-green-700 mb-2 text-center">
//           Join Us!
//         </h1>
//         <h2 className="text-xl text-center mb-1">
//           Create a Khana Community Account
//         </h2>
//         <p className="text-gray-600 mb-6 text-center">
//           Be a part of a 26 million-strong community of changeMakers
//         </p>

//         <form onSubmit={handleSubmit} className="flex flex-col gap-3">
//           <input
//             placeholder="Your Name"
//             type="text"
//             name="name"
//             className="p-3 text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
//             value={name}
//             onChange={(e) => setName(e.target.value)}
//             required
//           />
//           <input
//             placeholder="Your email"
//             type="email"
//             name="email"
//             className="p-3 text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             required
//           />
//           <input
//             placeholder="Your password"
//             type="password"
//             name="password"
//             className="p-3 border text-black border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             required
//           />

//           <label className="flex items-center mt-2 text-sm text-black">
//             <input type="checkbox" required className="mr-2" />
//             I agree to Khana Community's Terms of Service and Privacy Policy
//           </label>

//           <button
//             type="submit"
//             className="bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition duration-300"
//           >
//             Sign Up
//           </button>

//           <p className="text-center text-sm text-gray-600 mt-2">
//             Already have an account?{" "}
//             <Link to="/auth/login" className="text-green-600 hover:underline">
//               Login
//             </Link>
//           </p>
//         </form>
//       </div>
//     </div>
//   );
// }
