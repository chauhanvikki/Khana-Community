import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

export default function VolunteerLogin() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        // "http://localhost:5000/api/auth/volunteer/login",
        "http://localhost:5000/api/auth/login",

        formData
      );
      console.log("Volunteer logged in:", res.data);

      const { token } = res.data;
      localStorage.setItem("token", token);

      const decoded = jwtDecode(token);
      localStorage.setItem("volunteerId", decoded.id);
      localStorage.setItem("volunteerName", decoded.name);
      localStorage.setItem("volunteerEmail", decoded.email);

      navigate("/volunteer/dashboard");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Left Side Image */}
      <div className="hidden lg:flex w-1/2 relative">
        <img
          src="/volunteer.jpg"
          alt="Volunteer Helping"
          className="absolute inset-0 w-full h-full object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-opacity-20"></div>
        <div className="relative z-10 flex flex-col justify-center items-center text-center p-35">
          <h1 className="text-4xl font-bold text-green-900 drop-shadow-lg">
            Join Our Mission
          </h1>
          <p className="text-lg text-gray-700 mt-2">
            Helping <span className="font-semibold">hundreds of people</span> every week.
          </p>
        </div>
      </div>

      {/* Right Side Form */}
      <div className="flex flex-col justify-center w-full lg:w-1/2 px-8 lg:px-20">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full mx-auto">
          <h1 className="text-3xl font-bold text-green-700 mb-2">Welcome back, Volunteer!</h1>
          <p className="text-gray-600 mb-6">Log in to continue making an impact.</p>

          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <input
              type="email"
              name="email"
              required
              placeholder="Your email"
              onChange={handleChange}
              className="p-3 border text-black border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
            />
            <input
              type="password"
              name="password"
              required
              placeholder="Your password"
              onChange={handleChange}
              className="p-3 border text-black border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
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
              to="/volunteer/signup"
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
