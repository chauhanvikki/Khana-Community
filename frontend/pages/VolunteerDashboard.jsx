import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";

const API_BASE_URL = "http://localhost:5000";

function VolunteerDashboard() {
  const [availableTasks, setAvailableTasks] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [volunteer, setVolunteer] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No authentication token found");
    }
    return { Authorization: `Bearer ${token}` };
  };

  const fetchAvailableTasks = useCallback(async () => {
    try {
      setError(null);
      const headers = getAuthHeaders();
      const res = await axios.get(`${API_BASE_URL}/api/donations/available`, {
        headers: {
          ...headers,
          'X-Requested-With': 'XMLHttpRequest'
        },
        timeout: 10000,
        withCredentials: false
      });
      console.log('Available tasks response:', res.data);
      setAvailableTasks(res.data || []);
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Failed to fetch available tasks";
      setError(errorMsg);
      console.error("Error fetching available tasks:", err);
    }
  }, []);

  const fetchAcceptedTasks = useCallback(async () => {
    try {
      setError(null);
      const headers = getAuthHeaders();
      const res = await axios.get(`${API_BASE_URL}/api/donations/volunteer`, {
        headers: {
          ...headers,
          'X-Requested-With': 'XMLHttpRequest'
        },
        timeout: 10000,
        withCredentials: false
      });
      console.log('Accepted tasks response:', res.data);
      setTasks(res.data || []);
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Failed to fetch your tasks";
      setError(errorMsg);
      console.error("Error fetching volunteer tasks:", err);
    }
  }, []);

  const fetchVolunteer = useCallback(async () => {
    try {
      setError(null);
      const headers = getAuthHeaders();
      const res = await axios.get(`${API_BASE_URL}/api/auth/me`, {
        headers: {
          ...headers,
          'X-Requested-With': 'XMLHttpRequest'
        },
        timeout: 10000,
        withCredentials: false
      });
      setVolunteer(res.data);
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Failed to fetch volunteer info";
      setError(errorMsg);
      console.error("Error fetching volunteer info:", err);
    }
  }, []);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        await Promise.all([
          fetchVolunteer(),
          fetchAvailableTasks(),
          fetchAcceptedTasks()
        ]);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [fetchVolunteer, fetchAvailableTasks, fetchAcceptedTasks]);

  const acceptTask = async (taskId) => {
    if (!taskId) {
      setError("Invalid task ID");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const headers = getAuthHeaders();
      await axios.put(
        `${API_BASE_URL}/api/donations/${encodeURIComponent(taskId)}/claim`,
        {},
        { 
          headers: {
            ...headers,
            'X-Requested-With': 'XMLHttpRequest'
          },
          timeout: 10000,
          withCredentials: false
        }
      );

      await Promise.all([
        fetchAvailableTasks(),
        fetchAcceptedTasks()
      ]);
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Failed to accept task";
      setError(errorMsg);
      console.error("Error accepting task:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center min-h-screen">
        <div className="text-lg text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <h1 className="text-3xl text-black font-bold mb-4">
        Welcome, {volunteer ? (volunteer.name || volunteer.username || "Volunteer") : "Volunteer"} 👋
      </h1>

      {/* ✅ Available Tasks */}
      <h2 className="text-xl text-black font-semibold mb-2">Available Tasks</h2>
      <table className="w-full border-collapse border mb-6">
        <thead>
          <tr className="bg-green-600">
            <th className="p-3 border">Food</th>
            <th className="p-3 border">Pickup Date</th>
            <th className="p-3 border">Donor</th>
            <th className="p-3 border">Phone</th>
            <th className="p-3 border">Action</th>
          </tr>
        </thead>
        <tbody>
          {availableTasks.length > 0 ? (
            availableTasks.map((task) => {
              console.log('Available task:', task);
              return (
              <tr key={task._id} className="border-t text-black hover:bg-green-50">
                <td className="p-3 text-center align-middle">{task.foodName} ({task.quantity})</td>
                <td className="p-3 text-center align-middle">{new Date(task.pickupDate).toLocaleDateString()}</td>
                <td className="p-3 text-center align-middle">
                  {task.donorId?.name || "Unknown Donor"}
                </td>
                <td className="p-3 text-center align-middle">{task.donorId?.phone || task.phoneNo}</td>
                <td className="p-3 text-center">
                  <button
                    onClick={() => acceptTask(task._id)}
                    disabled={loading}
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? "Processing..." : "Accept"}
                  </button>
                </td>
              </tr>
              );
            })
          ) : (
            <tr>
              <td className="p-3 text-center text-black" colSpan="5">
                No available tasks right now.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* ✅ Your Accepted Tasks */}
      <h2 className="text-xl font-semibold mb-2 text-black">Your Upcoming Tasks</h2>
      <table className="w-full border-collapse border">
        <thead>
          <tr className="bg-green-600">
            <th className="p-3 border">Food</th>
            <th className="p-3 border">Pickup Date</th>
            <th className="p-3 border">Status</th>
            <th className="p-3 border">Donor</th>
            <th className="p-3 border">Phone</th>
          </tr>
        </thead>
        <tbody>
          {tasks.length > 0 ? (
            tasks.map((task) => {
              console.log('Accepted task:', task);
              return (
              <tr key={task._id} className="border-t bg-amber-200 hover:bg-green-50 text-black">
                <td className="p-3 text-center align-middle">{task.foodName} ({task.quantity})</td>
                <td className="p-3 text-center align-middle">{new Date(task.pickupDate).toLocaleDateString()}</td>
                <td className="p-3 text-center align-middle">
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      task.status === "Completed"
                        ? "bg-green-500 text-white"
                        : task.status === "Pending"
                        ? "bg-yellow-400 text-white"
                        : "bg-blue-500 text-white"
                    }`}
                  >
                    {task.status}
                  </span>
                </td>
                <td className="p-3 text-center align-middle">{task.donorId?.name || task.donorName || "Unknown Donor"}</td>
                <td className="p-3 text-center align-middle">{task.donorId?.phone || task.phoneNo}</td>
              </tr>
              );
            })
          ) : (
            <tr>
              <td className="p-3 text-center text-black" colSpan="5">
                You haven’t accepted any tasks yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default VolunteerDashboard;
