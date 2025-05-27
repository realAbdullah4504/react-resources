import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/authContext';

const Signup = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: ''
    });

    const { signup } = useAuth();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    }

    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await signup(formData.username, formData.email, formData.password);
            navigate('/protected-page');
        } catch (err) {
            setError(err.message || 'Registration failed. Please try again.');
        }
    }

    return (
        <div>
            <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>
            {error && (
                <div className="text-red-500 text-center mb-4">
                    {error}
                </div>
            )}
            <form className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md" onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Full Name"
                    className="w-full p-3 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    name='username'
                    onChange={handleChange}
                    value={formData.username}
                />
                <input
                    type="text"
                    placeholder="Email"
                    className="w-full p-3 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    name='email'
                    onChange={handleChange}
                    value={formData.email}
                />
                <input
                    type="password"
                    placeholder="Password"
                    className="w-full p-3 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    name='password'
                    onChange={handleChange}
                    value={formData.password}
                />
                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white p-3 rounded hover:bg-blue-600 transition duration-200"
                >
                    Sign Up
                </button>
            </form>
        </div>
    );
};

export default Signup;
