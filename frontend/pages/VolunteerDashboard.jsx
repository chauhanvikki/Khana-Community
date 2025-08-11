import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function VolunteerDashboard() {
  const navigate = useNavigate();
  const [volunteerName, setVolunteerName] = useState("");
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const name = localStorage.getItem("volunteerName");
    if (!name) {
      navigate("/volunteer/login");
    } else {
      setVolunteerName(name);
    }

    // Example tasks — in real app, fetch from API
    setTasks([
      {
        id: 1,
        title: "Pick up food donation from City Bakery",
        date: "2025-08-14",
        status: "Pending",
      },
      {
        id: 2,
        title: "Deliver meals to Shelter Home #3",
        date: "2025-08-15",
        status: "Scheduled",
      },
      {
        id: 3,
        title: "Assist in food packaging event",
        date: "2025-08-17",
        status: "Completed",
      },
    ]);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("volunteerId");
    localStorage.removeItem("volunteerName");
    localStorage.removeItem("volunteerEmail");
    navigate("/volunteer/login");
  };

  return (
    <div className="min-h-screen bg-gray-10 p-6">
      {/* Header */}
      <header className="flex justify-between items-center bg-green-600 text-white p-4 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold">
          Welcome, {volunteerName || "Volunteer"} 👋
        </h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 px-4 py-2 rounded hover:bg-red-600 transition"
        >
          Logout
        </button>
      </header>

      {/* Tasks Section */}
      <section className="mt-6">
        <h2 className="text-xl text-black font-semibold mb-4">Your Upcoming Tasks</h2>
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <table className="w-full border-collapse">
            <thead className="text-black bg-green-100">
              <tr>
                <th className="p-3 text-left">Task</th>
                <th className="p-3 text-left">Date</th>
                <th className="p-3 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task) => (
                <tr
                  key={task.id}
                  className="border-t hover:bg-green-50 transition"
                >
                  <td className="p-3">{task.title}</td>
                  <td className="p-3">{task.date}</td>
                  <td className="p-3">
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        task.status === "Completed"
                          ? "bg-green-500 text-white"
                          : task.status === "Scheduled"
                          ? "bg-blue-500 text-white"
                          : "bg-yellow-400 text-black"
                      }`}
                    >
                      {task.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Events Section */}
      <section className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Upcoming Volunteer Events</h2>
        <div className="bg-white shadow-lg rounded-lg p-4">
          <ul className="list-disc pl-6 space-y-2">
            <li>Community Kitchen Service — Aug 20, 2025</li>
            <li>Food Drive at Central Park — Aug 25, 2025</li>
            <li>Charity Dinner Event — Aug 30, 2025</li>
          </ul>
        </div>
      </section>
    </div>
  );
}
