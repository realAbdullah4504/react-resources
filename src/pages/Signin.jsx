import React from 'react'
import { useAuth } from '../context/authContext';
import { Navigate, useNavigate } from 'react-router-dom';

const Signin = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = React.useState({
        username: '',
        password: ''
    });

    const { login } = useAuth();
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    }

    const handleSubmit = async (e) => {

        e.preventDefault();
        await login(formData.username, formData.password);
        console.log('Login successful');
        navigate('/protected-page');
    }


    return (
        <div>
            <h2 className="text-2xl font-bold mb-6 text-center">Sign In</h2>
            <form className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md" onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="username"
                    className="w-full p-3 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    name='username'
                    onChange={handleChange}
                    value={formData.username}
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
                    className="w-full bg-blue-500 text-white p-3 rounded hover:bg-blue-600 transition duration-200" >
                    Sign In
                </button>
            </form>
        </div>
    )
}

export default Signin
