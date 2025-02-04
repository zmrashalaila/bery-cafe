import React, { useState, useEffect } from 'react';
import 'tailwindcss/tailwind.css';
import Sidebar from '../page/Sidebar';

const ManageUsers = () => {
    const [users, setUsers] = useState([]);
    const [newUser, setNewUser] = useState({
        nama_user: '',
        username: '',
        password: '',
        role: 'kasir',
    });
    const [editUser, setEditUser] = useState(null);
    const [showAddUserForm, setShowAddUserForm] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState(''); // State for success messages

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:8000/user', {
                headers: { 'Authorization': `Bearer ${token}` },
            });

            if (response.ok) {
                const data = await response.json();
                setUsers(data.data || []);
            } else {
                console.error('Failed to fetch users');
            }
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const handleAddUser = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');

        const existingUser = users.find(user => user.username === newUser.username);
        if (existingUser) {
            setErrorMessage('Username already exists. Please choose a different one.');
            return;
        }

        try {
            const response = await fetch('http://localhost:8000/user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(newUser),
            });

            const data = await response.json();

            if (response.ok) {
                fetchUsers();
                setNewUser({ nama_user: '', username: '', password: '', role: 'kasir' });
                setShowAddUserForm(false);
                setErrorMessage('');
                setSuccessMessage('User successfully added!');
            } else {
                // Menampilkan pesan error dari response server
                setErrorMessage(data.message || 'Failed to add user');
            }
        } catch (error) {
            console.error('Error adding user:', error);
            setErrorMessage('Something went wrong. Please try again.');
        }
    };

    const handleUpdateUser = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
    
        // Create a copy of editUser without id_user, createdAt, and updatedAt fields
        const { id_user, createdAt, updatedAt, ...userDataWithoutTimestamps } = editUser;
    
        try {
            const response = await fetch(`http://localhost:8000/user/${id_user}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(userDataWithoutTimestamps), // Send only the fields needed for update
            });
    
            const data = await response.json();
            console.log('data: ', data);
    
            if (response.ok) {
                fetchUsers(); // Refresh the list of users
                setShowEditModal(false); // Close modal
                setErrorMessage(''); // Clear any error message
                setSuccessMessage('User successfully updated!'); // Show success message
            } else {
                // Display the error message returned by the server
                setErrorMessage(data.message || 'Failed to update user');
            }
        } catch (error) {
            console.error('Error updating user:', error);
            setErrorMessage('Something went wrong. Please try again.');
        }
    };
    

    const handleEditUser = (user) => {
        setEditUser(user);
        setShowEditModal(true);
    };


    const handleDeleteUser = async (id_user) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this user?'); // Confirm deletion
        if (!confirmDelete) return;

        const token = localStorage.getItem('token');

        try {
            const response = await fetch(`http://localhost:8000/user/${id_user}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.ok) {
                fetchUsers();
                setSuccessMessage('User successfully deleted!'); // Success message for deleting user
            } else {
                console.error('Failed to delete user');
            }
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    return (
        <>
            <Sidebar />
            <div className="container mx-auto p-6">
                <h1 className="text-4xl font-bold text-center text-gray-800 mb-10">Manage Users</h1>

                {/* Success Notification */}
                {successMessage && (
                    <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6" role="alert">
                        <p>{successMessage}</p>
                    </div>
                )}

                {/* Error Notification */}
                {errorMessage && (
                    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
                        <p>{errorMessage}</p>
                    </div>
                )}

                {/* Button to show Add User Form */}
                <button
                    className="bg-pastelRose text-white px-4 py-2 rounded-lg mb-6 hover:bg-pastelDarkRed"
                    onClick={() => setShowAddUserForm(!showAddUserForm)}
                >
                    {showAddUserForm ? 'Cancel' : 'Add User'}
                </button>

                {/* Add User Form */}
                {showAddUserForm && (
                    <div className="bg-white p-6 rounded-lg shadow-lg mb-10 border border-gray-300">
                        <h2 className="text-2xl font-semibold mb-4 text-pastelRose">Add New User</h2>

                        <form onSubmit={handleAddUser} className="space-y-4">
                            <div>
                                <label className="block text-gray-700">Nama User:</label>
                                <input
                                    type="text"
                                    value={newUser.nama_user}
                                    onChange={(e) => setNewUser({ ...newUser, nama_user: e.target.value })}
                                    className="w-full p-2 border border-gray-300 rounded-lg"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700">Username:</label>
                                <input
                                    type="text"
                                    value={newUser.username}
                                    onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                                    className="w-full p-2 border border-gray-300 rounded-lg"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700">Password:</label>
                                <input
                                    type="password"
                                    value={newUser.password}
                                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                                    className="w-full p-2 border border-gray-300 rounded-lg"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700">Role:</label>
                                <select
                                    value={newUser.role}
                                    onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                                    className="w-full p-2 border border-gray-300 rounded-lg"
                                >
                                    <option value="kasir">Kasir</option>
                                    <option value="manager">Manager</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>
                            <button
                                type="submit"
                                className="bg-pastelRose text-white p-2 rounded-lg w-full hover:bg-pastelDarkRed"
                            >
                                Add User
                            </button>
                        </form>
                    </div>
                )}

                {/* Users Table */}
                <div className="overflow-x-auto shadow-lg rounded-lg">
                    <table className="min-w-full bg-white border border-black rounded-lg">
                        <thead>
                            <tr className="bg-pastelRose text-white border-black">
                                <th className="py-4 px-6 border-b border-black">User ID</th>
                                <th className="py-4 px-6 border-b border-black">Nama User</th>
                                <th className="py-4 px-6 border-b border-black">Username</th>
                                <th className="py-4 px-6 border-b border-black">Password</th>
                                <th className="py-4 px-6 border-b border-black">Role</th>
                                <th className="py-4 px-6 border-b border-black">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user, index) => (
                                <tr
                                    key={user.id_user}
                                    className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-100'
                                        } hover:bg-pastelLightPink transition duration-200`}
                                >
                                    <td className="py-4 px-6 border-b border-black">{user.id_user}</td>
                                    <td className="py-4 px-6 border-b border-black">{user.nama_user}</td>
                                    <td className="py-4 px-6 border-b border-black">{user.username}</td>
                                    <td className="py-4 px-6 border-b border-black">{user.password}</td>
                                    <td className="py-4 px-6 border-b border-black">{user.role}</td>
                                    <td className="py-4 px-6 border-b border-black flex justify-start">
                                        <button
                                            className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2 hover:bg-blue-700"
                                            onClick={() => handleEditUser(user)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-700"
                                            onClick={() => handleDeleteUser(user.id_user)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Edit User Modal */}
                {showEditModal && editUser && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <div className="bg-white p-6 rounded-lg w-96">
                            <h2 className="text-2xl font-semibold mb-4">Edit User</h2>

                            <form onSubmit={handleUpdateUser} className="space-y-4">
                                <div>
                                    <label className="block text-gray-700">Nama User:</label>
                                    <input
                                        type="text"
                                        value={editUser.nama_user}
                                        onChange={(e) =>
                                            setEditUser({ ...editUser, nama_user: e.target.value })
                                        }
                                        className="w-full p-2 border border-gray-300 rounded-lg"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700">Username:</label>
                                    <input
                                        type="text"
                                        value={editUser.username}
                                        onChange={(e) =>
                                            setEditUser({ ...editUser, username: e.target.value })
                                        }
                                        className="w-full p-2 border border-gray-300 rounded-lg"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700">Password:</label>
                                    <input
                                        type="password"
                                        value={editUser.password}
                                        onChange={(e) =>
                                            setEditUser({ ...editUser, password: e.target.value })
                                        }
                                        className="w-full p-2 border border-gray-300 rounded-lg"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700">Role:</label>
                                    <select
                                        value={editUser.role}
                                        onChange={(e) => setEditUser({ ...editUser, role: e.target.value })}
                                        className="w-full p-2 border border-gray-300 rounded-lg"
                                    >
                                        <option value="kasir">Kasir</option>
                                        <option value="manager">Manager</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </div>
                                <button
                                    type="submit"
                                    className="bg-blue-500 text-white px-4 py-2 rounded-lg w-full hover:bg-blue-700"
                                >
                                    Update User
                                </button>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default ManageUsers;
