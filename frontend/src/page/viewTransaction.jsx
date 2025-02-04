import React, { useEffect, useState } from 'react';
import 'tailwindcss/tailwind.css';
import Sidebar from './Sidebar'; // Ensure this path is correct

const ViewAll = () => {
    const [transactions, setTransactions] = useState([]);
    const [menus, setMenus] = useState([]); // State to hold menu data
    const [searchTerm, setSearchTerm] = useState('');
    const [filterDate, setFilterDate] = useState('');
    const [filterMonth, setFilterMonth] = useState('');
    const [openDetails, setOpenDetails] = useState({}); // Track open details by transaction ID
    const [loadingDetails, setLoadingDetails] = useState({}); // Track loading state for details
    const [transactionDetails, setTransactionDetails] = useState([]); // Store fetched transaction details

    useEffect(() => {
        fetchTransactions();
        fetchMenus(); // Fetch menus when component mounts
    }, []);

    const fetchTransactions = async () => {
        try {
            const response = await fetch('http://localhost:8000/transaksi');
            const data = await response.json();
            console.log("Data Transaksi: ", data);

            setTransactions(data.data || []);
        } catch (error) {
            console.error('Error fetching transactions:', error);
        }
    };

    const fetchMenus = async () => {
        try {
            const response = await fetch('http://localhost:8000/menu'); // Adjust endpoint as necessary
            const data = await response.json();
            setMenus(data.data || []); // Assuming menus are in data.data
        } catch (error) {
            console.error('Error fetching menus:', error);
        }
    };

    const fetchTransactionDetails = async (id) => {
        setLoadingDetails((prev) => ({ ...prev, [id]: true })); // Set loading state
        try {
            let token = localStorage.getItem('token')
            const response = await fetch(`http://localhost:8000/transaksi/detail/${id}`, {
                method: 'GET',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            });
            const data = await response.json();
            setTransactionDetails(data.data.detail_transaksi);
        } catch (error) {
            console.error('Error fetching transaction details:', error);
        } finally {
            setLoadingDetails((prev) => ({ ...prev, [id]: false }));
        }
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleDateFilter = async () => {
        if (filterDate) {
            const response = await fetch(`http://localhost:8000/transaksi/${filterDate}`);
            const data = await response.json();
            setTransactions(data.data || []);
        }
    };

    const handleMonthFilter = async () => {
        if (filterMonth) {
            let token = localStorage.getItem('token')
            const response = await fetch(`http://localhost:8000/transaksi/bulan/${filterMonth}`,{
                method: 'GET',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            });
            const data = await response.json();
            setTransactions(data.data || []);
        }
    };

    const handleEditPaymentStatus = async (id) => {
        try {
            let token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:8000/transaksi/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ status: 'Paid' }) // Example status update to "Paid"
            });
            const data = await response.json();
            // Update the transaction list after status change
            fetchTransactions();
        } catch (error) {
            console.error('Error updating payment status:', error);
        }
    };

    const toggleDetails = (id) => {
        if (!openDetails[id]) {
            fetchTransactionDetails(id);
        }
        setOpenDetails((prev) => ({
            ...prev,
            [id]: !prev[id], // Toggle the visibility
        }));
    };

    const filteredTransactions = transactions.filter(transaction =>
        transaction.nama_pelanggan.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <>
        <Sidebar />
        <div className="flex min-h-screen bg-gradient-to-r from-[#fee3e2] via-[#f5a1ac] to-[#c44c5e]">
            <div className="flex-1 p-4">
                <h1 className="text-3xl font-bold text-white text-center mb-6">All Transactions</h1>
                <div className="bg-white rounded-lg shadow-lg p-6 mb-4">
                    <div className="mb-4">
                        <input
                            type="text"
                            placeholder="Search by Customer Name"
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f5a1ac]"
                            value={searchTerm}
                            onChange={handleSearch}
                        />
                    </div>
                    <div className="mb-4 flex space-x-2">
                        <input
                            type="date"
                            className="block w-1/2 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f5a1ac]"
                            value={filterDate}
                            onChange={(e) => setFilterDate(e.target.value)}
                        />
                        <button
                            onClick={handleDateFilter}
                            className="bg-pastelRose text-white rounded-lg px-4 py-2 hover:bg-[#b7122d] transition-colors duration-200 w-1/2"
                        >
                            Filter by Date
                        </button>
                    </div>
                    <div className="mb-4 flex space-x-2">
                        <input
                            type="month"
                            className="block w-1/2 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f5a1ac]"
                            value={filterMonth}
                            onChange={(e) => setFilterMonth(e.target.value)}
                        />
                        <button
                            onClick={handleMonthFilter}
                            className="bg-pastelRose text-white rounded-lg px-4 py-2 hover:bg-[#b7122d] transition-colors duration-200 w-1/2"
                        >
                            Filter by Month
                        </button>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-lg p-6">
                    <h2 className="text-xl font-semibold mb-4">Transaction List</h2>
                    <ul className="space-y-4">
                        {filteredTransactions.length > 0 ? (
                            filteredTransactions.map((transaction) => (
                                <li key={transaction.id_transaksi} className="bg-gray-50 p-4 rounded-lg shadow-md">
                                    <p>
                                        <strong>Customer Name:</strong> {transaction.nama_pelanggan}
                                    </p>
                                    <p><strong>Table Number:</strong> {transaction.id_meja}</p>
                                    <p><strong>Date:</strong> {new Date(transaction.tgl_transaksi).toLocaleString()}</p>
                                    <p><strong>Status:</strong> {transaction.status}</p>

                                    <div className="flex justify-between items-center mt-4">
                                        <button
                                            onClick={() => toggleDetails(transaction.id_transaksi)}
                                            className="text-blue-500 hover:underline"
                                        >
                                            {openDetails[transaction.id_transaksi] ? "Hide Details" : "See Details"}
                                        </button>
                                        <button
                                            onClick={() => handleEditPaymentStatus(transaction.id_transaksi)}
                                            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors duration-200"
                                        >
                                            Mark as Paid
                                        </button>
                                    </div>

                                    {openDetails[transaction.id_transaksi] && (
                                        <div className="mt-2 p-4 bg-gray-100 rounded-lg">
                                            {loadingDetails[transaction.id_transaksi] ? (
                                                <p>Loading Details...</p>
                                            ) : (
                                                <>
                                                    <h3 className="font-semibold">Selected Menus:</h3>
                                                    <ul>
                                                        {transactionDetails.length > 0 ? transactionDetails.map((item, idx) => (
                                                            <li key={idx}>
                                                                {item.menu?.nama_menu} : {item.quantity}
                                                            </li>
                                                        )) : (
                                                            <p>No menus selected.</p>
                                                        )}
                                                    </ul>
                                                    <p><strong>Total Price:</strong> {transaction.total_harga}</p>
                                                    <p><strong>Transaction Date:</strong> {new Date(transaction.tgl_transaksi).toLocaleString()}</p>
                                                </>
                                            )}
                                        </div>
                                    )}
                                </li>
                            ))
                        ) : (
                            <p className="text-pastelRose">No transactions found.</p>
                        )}
                    </ul>
                </div>
            </div>
        </div>
        </>
    );
};

export default ViewAll;
