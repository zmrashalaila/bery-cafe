import React, { useState, useEffect } from 'react';
import 'tailwindcss/tailwind.css';
import Sidebar from '../page/Sidebar';

const ManageTables = () => {
    const [tables, setTables] = useState([]);
    const [editTable, setEditTable] = useState(null); // State for the table being edited
    const [showEditModal, setShowEditModal] = useState(false); // State for modal visibility
    const [showAddModal, setShowAddModal] = useState(false); // State for Add Table modal visibility
    const [newTable, setNewTable] = useState({ nomor_meja: '', status: 'kosong' }); // State for new table form
    const [errorMessage, setErrorMessage] = useState('');
    const [notificationMessage, setNotificationMessage] = useState(''); // Notification message
    const [notificationType, setNotificationType] = useState(''); // 'success' or 'error'

    useEffect(() => {
        fetchTables();
    }, []);

    useEffect(() => {
        if (notificationMessage) {
            const timer = setTimeout(() => {
                setNotificationMessage('');
            }, 3000); // Clear notification after 3 seconds
            return () => clearTimeout(timer);
        }
    }, [notificationMessage]);

    // Fetch all tables
    const fetchTables = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:8000/meja', {
                headers: { 'Authorization': `Bearer ${token}` },
            });

            if (response.ok) {
                const data = await response.json();
                setTables(data.data || []);
            } else {
                console.error('Failed to fetch tables');
            }
        } catch (error) {
            console.error('Error fetching tables:', error);
        }
    };

    // Handle Edit Table
    const handleEditTable = (table) => {
        setEditTable(table);
        setShowEditModal(true);
    };

    // Update Table Status
    const handleUpdateTable = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`http://localhost:8000/meja/${editTable.id_meja}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(editTable),
            });

            if (response.ok) {
                fetchTables(); // Refresh table list after updating
                setShowEditModal(false); // Close the modal
                setNotificationMessage('Table updated successfully');
                setNotificationType('success');
                setErrorMessage('');
            } else {
                const errorData = await response.json();
                setErrorMessage(errorData.message || 'Failed to update table');
                setNotificationMessage('Error updating table');
                setNotificationType('error');
            }
        } catch (error) {
            console.error('Error updating table:', error);
            setErrorMessage('Error updating table');
            setNotificationMessage('Error updating table');
            setNotificationType('error');
        }
    };

    // Handle Delete Table with confirmation
    const handleDeleteTable = async (id_meja) => {
        const token = localStorage.getItem('token');
        if (window.confirm('Are you sure you want to delete this table?')) {
            try {
                const response = await fetch(`http://localhost:8000/meja/${id_meja}`, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${token}` },
                });

                if (response.ok) {
                    fetchTables(); // Refresh table list after deletion
                    setNotificationMessage('Table deleted successfully');
                    setNotificationType('success');
                } else {
                    console.error('Failed to delete table');
                    setNotificationMessage('Error deleting table');
                    setNotificationType('error');
                }
            } catch (error) {
                console.error('Error deleting table:', error);
                setNotificationMessage('Error deleting table');
                setNotificationType('error');
            }
        }
    };

    // Handle Add New Table
    const handleAddTable = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        try {
            const response = await fetch('http://localhost:8000/meja', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(newTable),
            });

            if (response.ok) {
                fetchTables(); // Refresh table list after adding
                setShowAddModal(false); // Close add modal
                setNotificationMessage('New table added successfully');
                setNotificationType('success');
                setNewTable({ nomor_meja: '', status: 'kosong' }); // Reset form
            } else {
                const errorData = await response.json();
                setErrorMessage(errorData.message || 'Failed to add table');
                setNotificationMessage('Error adding table');
                setNotificationType('error');
            }
        } catch (error) {
            console.error('Error adding table:', error);
            setErrorMessage('Error adding table');
            setNotificationMessage('Error adding table');
            setNotificationType('error');
        }
    };

    return (
        <>
            <Sidebar />
            <div className="container mx-auto p-6">
                <h1 className="text-4xl font-bold text-center text-gray-800 mb-10">Manage Tables</h1>

                {/* Notification */}
                {notificationMessage && (
                    <div className={`mb-4 p-4 rounded-lg ${notificationType === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                        {notificationMessage}
                    </div>
                )}

                {/* Add New Table Button */}
                <div className="mb-4 flex justify-end">
                    <button
                        className="bg-pastelRose text-white px-4 py-2 rounded-lg hover:bg-pastelDarkRed"
                        onClick={() => setShowAddModal(true)}
                    >
                        Add New Table
                    </button>
                </div>

                {/* Tables List */}
                <div className="overflow-x-auto shadow-lg rounded-lg">
                    <table className="min-w-full bg-white border border-black rounded-lg">
                        <thead>
                            <tr className="bg-pastelRose text-white border-black">
                                <th className="py-4 px-6 border-b border-black">Table ID</th>
                                <th className="py-4 px-6 border-b border-black">Table Number</th>
                                <th className="py-4 px-6 border-b border-black">Status</th>
                                <th className="py-4 px-6 border-b border-black">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tables.map((table, index) => (
                                <tr
                                    key={table.id_meja}
                                    className={`${
                                        index % 2 === 0 ? 'bg-white' : 'bg-gray-100'
                                    } hover:bg-pastelLightPink transition duration-200`}
                                >
                                    <td className="py-4 px-6 border-b border-black">{table.id_meja}</td>
                                    <td className="py-4 px-6 border-b border-black">Table {table.nomor_meja}</td>
                                    <td className="py-4 px-6 border-b border-black">{table.status}</td>
                                    <td className="py-4 px-6 border-b border-black">
                                        <button
                                            className="bg-blue-500 text-white px-4 py-2 rounded-lg mr-2 hover:bg-blue-700"
                                            onClick={() => handleEditTable(table)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                                            onClick={() => handleDeleteTable(table.id_meja)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Add Table Modal */}
                {showAddModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                        <div className="bg-white p-6 rounded-lg shadow-lg w-1/2">
                            <h2 className="text-2xl font-semibold mb-4 text-pastelRose">Add New Table</h2>
                            {errorMessage && (
                                <p className="text-red-500 mb-4">{errorMessage}</p>
                            )}
                            <form onSubmit={handleAddTable} className="space-y-4">
                                <div>
                                    <label className="block text-gray-700">Table Number:</label>
                                    <input
                                        type="text"
                                        value={newTable.nomor_meja}
                                        onChange={(e) => setNewTable({ ...newTable, nomor_meja: e.target.value })}
                                        className="w-full border border-gray-300 p-2 rounded-lg"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700">Status:</label>
                                    <select
                                        value={newTable.status}
                                        onChange={(e) => setNewTable({ ...newTable, status: e.target.value })}
                                        className="w-full border border-gray-300 p-2 rounded-lg"
                                    >
                                        <option value="kosong">Kosong</option>
                                        <option value="terisi">Terisi</option>
                                    </select>
                                </div>
                                <div className="flex justify-end">
                                    <button type="submit" className="bg-pastelRose text-white px-4 py-2 rounded-lg hover:bg-pastelDarkRed">
                                        Add Table
                                    </button>
                                    <button
                                        type="button"
                                        className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg ml-4 hover:bg-gray-400"
                                        onClick={() => setShowAddModal(false)}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Edit Table Modal */}
                {showEditModal && editTable && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                        <div className="bg-white p-6 rounded-lg shadow-lg w-1/2">
                            <h2 className="text-2xl font-semibold mb-4 text-blue-500">Edit Table</h2>
                            {errorMessage && (
                                <p className="text-red-500 mb-4">{errorMessage}</p>
                            )}
                            <form onSubmit={handleUpdateTable} className="space-y-4">
                                <div>
                                    <label className="block text-gray-700">Table Number:</label>
                                    <input
                                        type="text"
                                        value={editTable.nomor_meja}
                                        onChange={(e) => setEditTable({ ...editTable, nomor_meja: e.target.value })}
                                        className="w-full border border-gray-300 p-2 rounded-lg"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700">Status:</label>
                                    <select
                                        value={editTable.status}
                                        onChange={(e) => setEditTable({ ...editTable, status: e.target.value })}
                                        className="w-full border border-gray-300 p-2 rounded-lg"
                                    >
                                        <option value="kosong">Kosong</option>
                                        <option value="terisi">Terisi</option>
                                    </select>
                                </div>
                                <div className="flex justify-end">
                                    <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                                        Update Table
                                    </button>
                                    <button
                                        type="button"
                                        className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg ml-4 hover:bg-gray-400"
                                        onClick={() => setShowEditModal(false)}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default ManageTables;
