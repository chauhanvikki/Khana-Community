import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

export default function VolunteerSignUp() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    // const data = { name, email, password };

    try {
      // const res = await axios.post("http://localhost:5000/api/auth/volunteer/signup", data);
    const res = await axios.post("http://localhost:5000/api/auth/signup", {
        name,
        email,
        password,
        role: "volunteer"
    });

      alert("Volunteer account created!");
      console.log(res.data);
      navigate("/volunteer/login");
    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong");
      console.log(err);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Left Side Image */}
      <div className="hidden lg:flex w-1/2 relative">
        <img
          src="/volunteersignup.avif"
          alt="Volunteer Team"
          className="absolute inset-0 w-full h-full object-cover "
        />
        <div className="absolute inset-0 bg-opacity-20"></div>
        <div className="relative z-10 flex flex-col justify-center items-center text-center p-35">
          <h1 className="text-4xl font-bold text-green-900 drop-shadow-lg">
            Become a Volunteer
          </h1>
          <p className="text-lg text-gray-700 mt-2">
            Join our community and help us reach <span className="font-semibold">more people</span>.
          </p>
        </div>
      </div>

      {/* Right Side Form */}
      <div className="flex flex-col justify-center w-full lg:w-1/2 px-8 lg:px-20">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full mx-auto">
          <h1 className="text-2xl text-black font-semibold mb-2">Join us, Volunteer!</h1>
          <h2 className="text-lg mb-4 text-gray-700">
            Create your Khana Community Volunteer Account
          </h2>

          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <input
              placeholder="Your Name"
              type="text"
              name="name"
              className="p-3 border text-black border-gray-300 rounded"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <input
              placeholder="Your email"
              type="email"
              name="email"
              className="p-3 border text-black border-gray-300 rounded"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              placeholder="Your password"
              type="password"
              name="password"
              className="p-3 border text-black border-gray-300 rounded"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <label className="flex items-center mt-2">
              <input type="checkbox" required className="mr-2" />
              <span className="text-black">I agree to Khana Community's Terms of Service and Privacy Policy</span>
            </label>

            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-3 mt-2 rounded cursor-pointer hover:bg-green-700 transition"
            >
              Sign Up
            </button>
            <span className="text-sm mt-2">
              Already have an account?  
              <Link to="/volunteer/login" className="text-green-600 hover:underline"> Login </Link>
            </span>
          </form>
        </div>
      </div>
    </div>
  );
}
