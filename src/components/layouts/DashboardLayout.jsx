import React, { useState, useEffect } from "react";
import { Link, Outlet } from "react-router-dom";
import { useAuth } from "../../context/authContext";

const DashboardLayout = () => {
  const { logout } = useAuth();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotes = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await fetch("http://localhost:3000/api/notes", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setNotes(data);
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchNotes();
  }, []);

  return (
    <div className="flex flex-col h-screen">
      <div className="bg-gray-800 text-white p-4">
        <h1 className="text-2xl font-bold">Dashboard</h1>
      </div>
      <div className="flex flex-1">
        <div className="w-64 bg-gray-200 p-4 flex flex-col justify-between">
          <div className="flex flex-col gap-4">
            <h1>
              <Link to="/protected-page/settings">link1</Link>
            </h1>
            <h1>
              <Link to="/protected-page">link2</Link>
            </h1>
          </div>
          <button
            className="px-2 rounded bg-black text-white cursor-pointer"
            onClick={logout}
          >
            logout
          </button>
        </div>
        <div className="p-4">
          {loading ? (
            <div>Loading notes...</div>
          ) : (
            <Outlet context={{ notes, setNotes }} />
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
