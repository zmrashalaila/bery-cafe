import React from 'react';
import 'tailwindcss/tailwind.css';
import Sidebar from './Sidebar'; // Pastikan path ini sesuai dengan lokasi file Sidebar

const AdminPage = () => {
    return (
        <>
            <Sidebar/>
            <div className="flex min-h-screen pb-20 bg-pastelPink">
                <div className="flex-grow p-8 flex items-center justify-center">
                    <div className="bg-white shadow-lg rounded-lg p-8 max-w-lg text-center">
                        <h1 className="text-4xl font-bold text-gray-800 mb-4">Welcome, Admin 👋</h1>
                        <p className="text-gray-700 text-lg">
                        You're logged in to the admin dashboard, where you can manage and oversee all essential data. Here, you can easily handle user accounts and roles, organize menu items, and update table information to keep operations running smoothly. Thank you for ensuring the best experience for our team and customers alike. Let’s make today a great one!
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AdminPage;
