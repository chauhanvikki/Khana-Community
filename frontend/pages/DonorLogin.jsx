
// import React, { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import axios from "axios";
// import { jwtDecode } from "jwt-decode";

// export default function VolunteerLogin() {
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({ email: "", password: "" });

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const res = await axios.post(
//         "http://localhost:5000/api/auth/login",
//         formData
//       );
//       console.log("Logged in:", res.data);

//       const { token } = res.data;
//       localStorage.setItem("token", token);

//       const decoded = jwtDecode(token);
//       localStorage.setItem("donorId", decoded.id);
//       localStorage.setItem("donorName", decoded.name);
//       localStorage.setItem("donorEmail", decoded.email);

//       navigate("/auth/welcome");
//     } catch (err) {
//       console.error(err);
//       alert(err.response?.data?.message || "Login failed");
//     }
//   };

//   return (
//     <div className="flex min-h-screen bg-gray-50">
//       {/* Left Side - Hero Image & Info */}
//       <div className="hidden lg:flex w-1/2 bg-green-100 flex-col justify-center items-center p-10">
//         <img
//           src="../public/loginDonate.jpg"
//           alt="Food Donation"
//           className="w-full max-w-md rounded-xl shadow-lg"
//         />
//         <h1 className="text-4xl font-bold text-green-800 mt-6">
//           Welcome to Khana Community
//         </h1>
//         <p className="text-lg text-gray-700 mt-2">
//           Serving more than <span className="font-semibold">100+ people</span> daily.
//         </p>
//       </div>

//       {/* Right Side - Login Form */}
//       <div className="flex flex-col justify-center w-full lg:w-1/2 px-8 lg:px-20">
//         <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full mx-auto">
//           <h1 className="text-3xl font-bold text-green-700 mb-2">
//             Welcome back!
//           </h1>
//           <p className="text-gray-600 mb-6">
//             It's nice to see you again. Ready to serve?
//           </p>

//           <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
//             <input
//               type="email"
//               name="email"
//               required
//               placeholder="Your email"
//               onChange={handleChange}
//               className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
//             />
//             <input
//               type="password"
//               name="password"
//               required
//               placeholder="Your password"
//               onChange={handleChange}
//               className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
//             />
//             <button
//               type="submit"
//               className="bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition duration-300"
//             >
//               Login
//             </button>
//           </form>

//           <p className="mt-4 text-gray-600 text-sm">
//             Don't have an account?{" "}
//             <Link
//               to="/auth/signup"
//               className="text-green-600 font-semibold hover:underline"
//             >
//               Sign Up
//             </Link>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }




import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

export default function DonorLogin() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        formData
      );
      console.log("Logged in:", res.data);

      const { token } = res.data;
      localStorage.setItem("token", token);

      const decoded = jwtDecode(token);
      localStorage.setItem("donorId", decoded.id);
      localStorage.setItem("donorName", decoded.name);
      localStorage.setItem("donorEmail", decoded.email);

      navigate("/auth/welcome");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Left Side - Full Background Image with Overlay */}
      <div className="hidden lg:flex w-1/2 relative">
        {/* Background image */}
        <img
          src="/log.jpg"
          alt="Food Donation"
          className="absolute inset-0 w-full h-full object-cover "
        />
        {/* Overlay for readability */}
        <div className="absolute inset-0 bg-opacity-20"></div>

        {/* Content on top */}
        <div className="relative z-10 flex flex-col justify-center items-center text-center p-10">
          <h1 className="text-4xl font-bold text-black drop-shadow-lg">
            Welcome to Khana Community
          </h1>
          <p className="text-lg text-gray-100 mt-2">
            Serving more than <span className="font-semibold">100+ people</span> daily.
          </p>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex flex-col justify-center w-full lg:w-1/2 px-8 lg:px-20">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full mx-auto">
          <h1 className="text-3xl font-bold text-green-700 mb-2">
            Welcome back!
          </h1>
          <p className="text-gray-600 mb-6">
            It's nice to see you again. Ready to serve?
          </p>

          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <input
              type="email"
              name="email"
              required
              placeholder="Your email"
              onChange={handleChange}
              className="p-3 text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
            />
            <input
              type="password"
              name="password"
              required
              placeholder="Your password"
              onChange={handleChange}
              className="p-3 text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
            />
            <button
              type="submit"
              className="bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition duration-300"
            >
              Login
            </button>
          </form>

          <p className="mt-4 text-gray-600 text-sm">
            Don't have an account?{" "}
            <Link
              to="/auth/signup"
              className="text-green-600 font-semibold hover:underline"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
