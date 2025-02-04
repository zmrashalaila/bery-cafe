import React, { useState, useEffect } from 'react';
import 'tailwindcss/tailwind.css';
import Sidebar from '../page/Sidebar';

const ManagerPage = ({ user }) => {
    const [selectedTransaction, setSelectedTransaction] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [filteredTransactions, setFilteredTransactions] = useState([]);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [expandedTransaction, setExpandedTransaction] = useState(null);
    

    useEffect(() => {
        fetchAllTransactions();
    }, []);

    const fetchAllTransactions = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:8000/transaksi', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                setTransactions(data.data || []);
                setFilteredTransactions(data.data || []);
            } else {
                console.error('Failed to fetch transactions');
            }
        } catch (error) {
            console.error('Error fetching transactions:', error);
        }
    };

    const handleDateFilter = () => {
        if (!startDate || !endDate) {
            setErrorMessage('Both start and end date must be selected!');
            return;
        }

        const filtered = transactions.filter(transaction => {
            const transactionDate = new Date(transaction.tgl_transaksi);
            return transactionDate >= new Date(startDate) && transactionDate <= new Date(endDate);
        });

        setFilteredTransactions(filtered);
        setErrorMessage('');
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString();
    };

    const calculateTotalTransaction = (transaction) => {
        return transaction.detail_transaksi.reduce((total, item) => {
            return total + (item.harga * item.quantity);
        }, 0);
    };

    const toggleTransactionDetails = (transactionId) => {
        if (expandedTransaction === transactionId) {
            setExpandedTransaction(null); // Collapse if clicked again
        } else {
            setExpandedTransaction(transactionId); // Expand for the selected transaction
        }
    };

    
        return (
            <>
                <Sidebar />
                <div className="flex min-h-screen bg-pastelPink">
    
                    <div className="flex-grow p-8 bg-white shadow-lg rounded-lg mx-6 mt-4 mb-4">
                        <h1 className="text-4xl font-semibold text-pastelDarkRed mb-10 text-center">
                            Manager Reports
                        </h1>
    
                        {/* Date Filtering */}
                        <div className="flex flex-col items-center justify-center mb-8 space-y-4 md:flex-row md:space-y-0 md:space-x-8">
                            <div className="flex flex-col w-full md:w-1/4">
                                <label htmlFor="startDate" className="text-pastelDarkRed font-medium mb-1">Start Date</label>
                                <input
                                    type="date"
                                    id="startDate"
                                    className="border border-pastelRose rounded-lg p-3 bg-pastelLightPink text-pastelDarkRed focus:ring-pastelRose focus:border-pastelRose transition duration-200"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                />
                            </div>
    
                            <div className="flex flex-col w-full md:w-1/4">
                                <label htmlFor="endDate" className="text-pastelDarkRed font-medium mb-1">End Date</label>
                                <input
                                    type="date"
                                    id="endDate"
                                    className="border border-pastelRose rounded-lg p-3 bg-pastelLightPink text-pastelDarkRed focus:ring-pastelRose focus:border-pastelRose transition duration-200"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                />
                            </div>
    
                            <button
                                className="w-full md:w-1/4 bg-pastelRose text-white py-3 rounded-lg shadow-lg hover:bg-pastelRed transition duration-300 transform hover:scale-105 mt-6"
                                onClick={handleDateFilter}
                            >
                                Filter
                            </button>
                        </div>
    
                        {errorMessage && <p className="text-pastelRed text-center mb-4">{errorMessage}</p>}
    
                        {/* Transaction List */}
                        {filteredTransactions.length > 0 ? (
                            <div className="space-y-6">
                                {filteredTransactions.map((transaksi, index) => (
                                    <div
                                        key={index}
                                        className="p-6 bg-white rounded-lg shadow-lg flex flex-col space-y-3 hover:shadow-2xl transition-shadow duration-300"
                                    >
                                        <div className="flex justify-between items-center">
                                            <h3 className="text-xl font-semibold text-pastelDarkRed">
                                                Tanggal: {formatDate(transaksi.tgl_transaksi)}
                                            </h3>
                                            <button
                                                onClick={() => toggleTransactionDetails(transaksi.id_transaksi)}
                                                className="bg-pastelRose text-white px-4 py-2 rounded-lg shadow-lg hover:bg-pastelRed transition duration-300 transform hover:scale-105"
                                            >
                                                {expandedTransaction === transaksi.id_transaksi ? 'Hide Details' : 'View Details'}
                                            </button>
                                        </div>
    
                                        <p className="font-semibold text-gray-700">Pelanggan: {transaksi.nama_pelanggan}</p>
                                        <p className="text-gray-700">Meja: {transaksi.id_meja}</p>
                                        <p className="text-gray-700">Karyawan: {transaksi.id_user}</p>
                                        <p className={`font-semibold ${transaksi.status === 'lunas' ? 'text-green-500' : 'text-red-500'}`}>
                                            Status Pembayaran: {transaksi.status}
                                        </p>
                                        <p className="text-gray-700 font-bold">
                                            Total Transaksi: Rp {transaksi.total_harga.toLocaleString()}
                                        </p>
    
                                        {/* Transaction Details */}
                                        {expandedTransaction === transaksi.id_transaksi && (
                                            <div className="mt-4">
                                                <h3 className="font-semibold text-gray-700">Order Details:</h3>
                                                <ul className="list-disc ml-6">
                                                    {transaksi.detail_transaksi.map((detail) => (
                                                        <li key={detail.id_detail_transaksi} className="text-gray-600">
                                                            {detail.menu?.nama_menu || 'Unknown Menu Item'} - Qty: {detail.quantity} - Price: Rp {detail.harga.toLocaleString()}
                                                        </li>
                                                    ))}
                                                </ul>
                                                <p className="mt-4 font-bold text-lg text-[#1d3c34]">Total: Rp {transaksi.total_harga.toLocaleString()}</p>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-pastelDarkRed mt-6 text-center">Tidak ada transaksi ditemukan</p>
                        )}
                    </div>
                </div>
            </>
        );
    };
    
    export default ManagerPage;
    