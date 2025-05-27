import React, { useState } from "react";
import { useAuth } from "../context/authContext";
import { Link, useNavigate } from "react-router-dom";

const Signin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { login } = useAuth();
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await login(formData.email, formData.password);
      console.log("Login successful");
      navigate("/protected-page");
    } catch (err) {
      setError(err.message || "Login failed. Please try again.");
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-center">Sign In</h2>
      {error && <div className="text-red-500 text-center mb-4">{error}</div>}
      <form
        className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md"
        onSubmit={handleSubmit}
      >
        <input
          type="text"
          placeholder="Email"
          className="w-full p-3 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          name="email"
          onChange={handleChange}
          value={formData.email}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          name="password"
          onChange={handleChange}
          value={formData.password}
        />
        <div className="mb-4">
          <Link to="/signup" className="text-blue-500 hover:underline">Don't have an account? Sign up</Link>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-3 rounded hover:bg-blue-600 transition duration-200"
        >
          Sign In
        </button>
      </form>
    </div>
  );
};

export default Signin;
