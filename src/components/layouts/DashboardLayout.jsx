import React from 'react'
import { Link, Outlet } from 'react-router-dom'

const DashboardLayout = () => {
    return (
        <div className="flex flex-col h-screen">
            <div className="bg-gray-800 text-white p-4">
                <h1 className="text-2xl font-bold">Dashboard</h1>
            </div>
            <div className="flex flex-1">
                <div className="w-64 bg-gray-200 p-4">
                    <h1><Link to="/protected-page/settings">link1</Link></h1>
                    <h1><Link to="/protected-page">link2</Link></h1>
                </div>
                <Outlet />
            </div>
        </div>
    )
}

export default DashboardLayout
