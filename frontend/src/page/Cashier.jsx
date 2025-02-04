import React, { useState, useEffect } from 'react';
import 'tailwindcss/tailwind.css';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import Sidebar from '../page/Sidebar'; // Importing Sidebar

const Cashier = ({ user }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMenu, setSelectedMenu] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [tables, setTables] = useState([]);
  const [selectedMenuItem, setSelectedMenuItem] = useState(null);
  const [isTableOccupied, setIsTableOccupied] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [tableNumber, setTableNumber] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [transactionReceipt, setTransactionReceipt] = useState(null);
  const [isPaid, setIsPaid] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [currentMenu, setCurrentMenu] = useState(null);
  const [cashierName, setCashierName] = useState(localStorage.getItem("cashier_name") || ""); // Dapatkan nama kasir dari localStorage


const SearchBar = ({ searchTerm, setSearchTerm }) => (
    <div className="flex items-center bg-white rounded-full shadow-md p-2 w-full max-w-[95%] pr-8">
        <i className="fas fa-search text-gray-400 ml-2"></i>
        <input
            type="text"
            placeholder="Search..."
            className="ml-2 w-full outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
        />
    </div>
);

// const MenuItem = ({ item, handleQuantityChange, quantity, addToCart }) => (
//     <div className="bg-white rounded-lg shadow-md p-4">
//         <img src="https://placehold.co/100x150" alt={item.nama_menu} className="w-full h-40 object-cover rounded-lg mb-4" />
//         <h3 className="text-xl font-bold">{item.nama_menu} <span className="text-orange-400">Rp. {item.harga}</span></h3>
//         <p className="text-gray-600 mb-4">{item.description}</p>
//         <div className="flex items-center justify-between">
//             <div className="flex items-center">
//                 <button
//                     onClick={() => handleQuantityChange(item, 'decrement')}
//                     className="bg-gray-200 text-gray-600 rounded-full px-2 py-1"
//                 >
//                     -
//                 </button>
//                 <span className="mx-2">{quantity}</span>
//                 <button
//                     onClick={() => handleQuantityChange(item, 'increment')}
//                     className="bg-gray-200 text-gray-600 rounded-full px-2 py-1"
//                 >
//                     +
//                 </button>
//             </div>
//             <button
//                 onClick={() => addToCart(item)}
//                 className="bg-orange-400 text-white rounded-full px-4 py-2"
//             >
//                 Added to cart
//             </button>
//         </div>
//     </div>
// );

// const Cart = ({ selectedMenu }) => {
//     const totalAmount = selectedMenu.reduce((total, item) => total + item.harga * item.quantity, 0);
//     return (
//         <div className="w-full md:w-1/4 bg-white p-6">
//             <h2 className="text-2xl font-bold mb-4">Cart</h2>
//             {selectedMenu.length === 0 ? (
//                 <p>Your cart is empty</p>
//             ) : (
//                 <div>
//                     <ul>
//                         {selectedMenu.map((item, index) => (
//                             <li key={index} className="flex justify-between">
//                                 <span>{item.nama_menu} (x{item.quantity})</span>
//                                 <span>Rp. {item.harga * item.quantity}</span>
//                             </li>
//                         ))}
//                     </ul>
//                     <div className="flex justify-between font-bold text-lg mt-4">
//                         <span>Total</span>
//                         <span>Rp. {totalAmount}</span>
//                     </div>
//                     <button className="bg-orange-400 text-white rounded-full w-full py-2 mt-4">Place an order</button>
//                 </div>
//             )}
//         </div>
//     );
// };


    // useEffect(() => {
    //     fetchMenuItems();
    //     fetchTableNumbers();
    // }, []);

    useEffect(() => {
      // Set nama kasir setelah komponen dimuat
      const nameFromStorage = localStorage.getItem("cashier_name");
      if (nameFromStorage) {
          setCashierName(nameFromStorage);
      }
      fetchMenuItems();
      fetchTableNumbers();
  }, []);

    const fetchMenuItems = async () => {
        try {
            const response = await fetch(`http://localhost:8000/menu`);
            const data = await response.json();
            const menuItemsWithQuantity = data.data.map(item => ({
                ...item,
                quantity: 1 // Atur quantity default menjadi 1
            }));
            setMenuItems(menuItemsWithQuantity || []);
        } catch (error) {
            console.error('Error fetching menu items:', error);
        }
    };
    

    const fetchTableNumbers = async () => {
        try {
            const response = await fetch('http://localhost:8000/meja');
            const data = await response.json();
            setTables(data.data || []);
        } catch (error) {
            console.error('Error fetching table numbers:', error);
        }
    };

    const handleTableCheck = (selectedTable) => {
        const table = tables.find((t) => t.nomor_meja === selectedTable);
        const occupied = table ? table.status === 'terisi' : false;
        setIsTableOccupied(occupied);
        setTableNumber(selectedTable);
    };


    // const handleMenuChange = (e) => {
    //     const selectedId = e.target.value;
    //     const menuItem = menuItems.find(item => item.id_menu === parseInt(selectedId));
    //     setSelectedMenuItem(menuItem || null); // Set the selected menu item
    // };

    const handleQuantityChange = (id_menu, type) => {
        setSelectedMenu(prevSelectedMenu =>
            prevSelectedMenu.map(item =>
                item.id_menu === id_menu
                    ? { ...item, quantity: type === 'increment' ? item.quantity + 1 : item.quantity - 1 }
                    : item
            )
        );
    };

    const handleAddToCart = (menuItem) => {
        // Assuming you have a state to store selected items
        setSelectedMenu((prevMenu) => [...prevMenu, menuItem]);
    };
    

    const handleSubmitTransaction = async () => {
        if (!customerName || !tableNumber) {
            setErrorMessage('Customer name and table number are required!');
            return;
        }

        if (selectedMenu.length === 0) {
            setErrorMessage('Please add at least one menu item before submitting!');
            return;
        }

        const newTransaction = {
            tgl_transaksi: new Date().toISOString(),
            id_user: localStorage.getItem("id_user"),
            id_meja: tableNumber,
            nama_pelanggan: customerName,
            status: isPaid ? 'lunas' : 'belum_bayar',
            detail_transaksi: selectedMenu.map(item => ({
                id_menu: item.id_menu,
                quantity: item.quantity,
            })),
        };

        try {
            let token = localStorage.getItem('token');
            const response = await fetch('http://localhost:8000/transaksi', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(newTransaction),
            });

            if (response.ok) {
                alert('Transaction successfully added!');

                // Update table status to "terisi"
                await updateTableStatus(tableNumber, 'terisi');
                let result = await response.json();
                let receipt = { ...newTransaction, id_transaksi: result.insertTransaksi.id_transaksi };
                setTransactionReceipt(receipt);
                setSelectedMenu([]);
                setCustomerName('');
                setTableNumber('');
            } else {
                const errorText = await response.text();
                console.error('Failed to add transaction:', errorText);
                setErrorMessage('Failed to add transaction. Please try again!');
            }
        } catch (error) {
            console.error('Error submitting transaction:', error);
        }
    };

    
    const updateTableStatus = async (tableNumber, status) => {
        try {
            let token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:8000/meja/${tableNumber}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ status }),
            });

            if (!response.ok) {
                throw new Error('Failed to update table status');
            }
        } catch (error) {
            console.error('Error updating table status:', error);
        }
    };

   
    const handlePayment = async () => {
        const updatedReceipt = {
            ...transactionReceipt,
            status: "lunas"
        };

        try {
            let token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:8000/transaksi/${transactionReceipt.id_transaksi}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(updatedReceipt),
            });

            if (response.ok) {
                alert('Payment successful!');
                setIsPaid(true);
                await updateTableStatus(transactionReceipt.id_meja, 'kosong'); // Set table status to 'kosong'
            } else {
                const errorText = await response.text();
                console.error('Failed to process payment:', errorText);
                setErrorMessage('Failed to process payment. Please try again!');
            }
        } catch (error) {
            console.error('Error during payment:', error);
        }
    };

    const calculateReceiptTotalHarga = () => {
        return transactionReceipt.detail_transaksi.reduce((total, item) => {
          const menuItem = menuItems.find(menu => menu.id_menu === item.id_menu);
          return total + (menuItem?.harga * item.quantity);
        }, 0);
      };

      const handleDone = () => {
        // Logic for marking the transaction as complete
        setSelectedMenu([]);
        setTransactionReceipt(null);
        setIsPaid(false);
        setErrorMessage('');
        alert('Transaction completed! Thank you for your purchase.');
      };

     const generatePDF = async (transactionId) => {
    const receiptElement = document.querySelector('.receipt-container'); // The container for the receipt
    const canvas = await html2canvas(receiptElement);
    const imgData = canvas.toDataURL('image/png');
    
    const pdf = new jsPDF('p', 'mm', 'a4');
    
    const pageWidth = 210; // A4 page width in mm
    const pageHeight = 297; // A4 page height in mm
    const margin = 40; // margin in mm for both top/bottom and left/right
    
    const imgWidth = pageWidth - margin * 2; // Width of the image within the margins
    const imgHeight = (canvas.height * imgWidth) / canvas.width; // Maintain aspect ratio
  
    const x = (pageWidth - imgWidth) / 2;
    const y = (pageHeight - imgHeight) / 2;
  
    pdf.addImage(imgData, 'PNG', x, y, imgWidth, imgHeight);
    pdf.save(`receipt_${transactionId}.pdf`);

    //harusnya buttonnya ga ikut di print
};

      
     const openModal = (menu) => {
     setCurrentMenu(menu);
     setShowModal(true);
     };

     const closeModal = () => {
     setShowModal(false);
     setCurrentMenu(null);
    };
      
      
    return (
        <>
     <Sidebar />
    <div className="flex">
      {/* Main Content */}
      <div className="flex flex-col flex-1 p-4">
      <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        <div className="flex flex-wrap gap-5 mt-6">
          {menuItems
            .filter(item =>
              item.nama_menu.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .map(item => (
              <div
                key={item.id_menu}
                className="relative flex items-center border rounded-lg p-4 shadow hover:shadow-lg transition cursor-pointer min-h-[120px]"
              >
                <img
                  src={'http://localhost:8000/menu-image/' + item.gambar}
                  alt={item.nama_menu}
                  className="w-20 h-20 rounded-md"
                />
                <div className="flex flex-col justify-center min-w-[200px]">
                  <div className="flex">
                    <div className="ml-4 flex-1 w-[120px]">
                      <h3 className="font-bold">{item.nama_menu}</h3>
                      <p className="text-gray-600">
                        Rp {item.harga.toLocaleString()}
                      </p>
                    </div>
                    <div className="flex items-center">
                    </div>
                  </div>
                  <div className="flex justify-between pl-4 mt-3 space-x-2">
                  <button
                   className="p-1 bg-orange-400 text-white px-2 rounded-lg hover:bg-pastelLightPink transition"
                   onClick={() => openModal(item)}
                  >
                  See Details
                  </button>
                  <button
                  className="p-1 bg-green-500 text-white px-2 rounded-lg hover:bg-pastelLightPink transition"
                  onClick={() => handleAddToCart(item)}
                  >
                  Add to Cart
                  </button>

                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
      

            {/* Modal Detail Menu */}
        {showModal && currentMenu && (
          <div className="fixed inset-0 bg-gray-900 bg-opacity-70 flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full transform transition duration-300 ease-in-out scale-100">
              <button onClick={closeModal} className="text-gray-500 hover:text-gray-800 transition duration-300 text-right">
                &times;
              </button>
              <img src={'http://localhost:8000/menu-image/' + currentMenu.gambar} alt={currentMenu.nama_menu} className="w-full h-48 object-cover" />
              <div className="mt-4">
                <h3 className="text-2xl font-semibold">{currentMenu.nama_menu}</h3>
                <p className="text-gray-600">{currentMenu.deskripsi}</p>
                <p className="text-gray-700 font-semibold">type: {currentMenu.jenis}</p>
                <p className="font-bold text-lg text-gray-900 mt-2">Rp {currentMenu.harga.toLocaleString()}</p>
              </div>
            </div>
          </div>
        )}


            {/* Cart Section */}
            <div className="w-[40%] bg-white shadow-lg p-4 mr-5">
              <h2 className="text-2xl font-bold mb-4">Cart</h2>
              <div className="mb-6">
          <label className="block text-gray-700 font-bold mb-2">Customer Name</label>
          <input
            type="text"
            placeholder="Enter customer name"
            className="border rounded-md p-2 mb-4 w-full"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
          />

          <label className="block text-gray-700 font-bold mb-2">Table Number</label>
          <select
            className="border rounded-md p-2 mb-4 w-full"
            value={tableNumber}
            onChange={(e) => handleTableCheck(e.target.value)}
          >
            <option value="">Select Table</option>
            {tables.map((table) => (
              <option key={table.nomor_meja} value={table.nomor_meja}>
                {table.nomor_meja} {table.status === 'terisi' && '(Occupied)'}
              </option>
            ))}
          </select>
        </div>
              <div className="mb-4">
                <h3 className="font-bold text-lg mb-2">Selected Menus:</h3>
                {selectedMenu.length === 0 ? (
                  <p>No items in cart</p>
                ) : (
                  <ul>
                    {selectedMenu.map((item) => (
                      <li key={item.id_menu} className="flex justify-between items-center mb-4">
                        <img
                          src={'http://localhost:8000/menu-image/' + item.gambar}
                          alt={item.nama_menu}
                          className="w-12 h-12 rounded-md"
                        />
                        <div className="flex-1 mx-4">
                          <h4 className="font-bold">{item.nama_menu}</h4>
                          <p>Rp {item.harga.toLocaleString()}</p>
                        </div>
                        <div className="flex items-center">
                          <button
                            className="px-2 py-1 bg-gray-200 rounded-lg"
                            onClick={() => handleQuantityChange(item.id_menu, 'decrement')}
                            disabled={item.quantity <= 1}
                          >
                            -
                          </button>
                          <span className="mx-2">{item.quantity}</span>
                          <button
                            className="px-2 py-1 bg-gray-200 rounded-lg"
                            onClick={() => handleQuantityChange(item.id_menu, 'increment')}
                          >
                            +
                          </button>
                        </div>
                        <span className="ml-4">Rp {(item.harga * item.quantity).toLocaleString()}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

        
      
              {/* Checkout Button */}
              <button
                className="w-full bg-green-500 text-white rounded-full px-4 py-2 mt-4"
                onClick={handleSubmitTransaction}
              >
                Checkout
              </button>
      
              {transactionReceipt && (
                <div className="bg-white rounded-lg shadow-lg p-6 mt-7 receipt-container">
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center space-x-4">
                      <img
                        src={require('../assets/clogo.jpg')}
                        alt="CafeLogo"
                        className="w-16 h-16 rounded-full border-2 border-pastelRose"
                      />
                      <div>
                        <h2 className="text-2xl font-bold text-pastelRose">Belle Fiori</h2>
                        <p className="text-gray-500">Jl. Eliot No. 10, Malang</p>
                      </div>
                    </div>
                    <p className="text-gray-500 text-lg">{new Date().toLocaleDateString()}</p>
                  </div>
      
                  <div className="border-t border-b border-gray-300 py-4">
                    <div className="flex mb-2">
                      {/* <p className="font-semibold">Cashier Name : {cashierName} </p> */}
                      <p className="font-semibold">Customer Name:</p>
                      <p className="ml-2">{transactionReceipt.nama_pelanggan}</p>
                    </div>
                    <div className="flex mb-2">
                      <p className="font-semibold">Table:</p>
                      <p className="ml-2">{transactionReceipt.id_meja}</p>
                    </div>
                  </div>
      
                  <h3 className="text-xl font-semibold my-4">Order List:</h3>
                  <table className="min-w-full border border-gray-300">
                    <thead>
                      <tr>
                        <th className="py-2 px-4 border-b border-gray-300">Menu</th>
                        <th className="py-2 px-4 border-b border-gray-300">Quantity</th>
                        <th className="py-2 px-4 border-b border-gray-300">Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactionReceipt.detail_transaksi.map((item, index) => {
                        const menuItem = menuItems.find(menu => menu.id_menu === item.id_menu);
                        const totalHarga = menuItem?.harga * item.quantity;
                        return (
                          <tr key={index} className="border-b border-gray-300">
                            <td className="py-2 px-4">{menuItem?.nama_menu}</td>
                            <td className="py-2 px-4">{item.quantity}</td>
                            <td className="py-2 px-4">Rp {totalHarga.toLocaleString()}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
      
                  <div className="border-t border-gray-300 pt-4">
                    <div className="flex justify-between mb-2">
                      <p className="font-semibold">Total:</p>
                      <p className="font-bold">Rp {calculateReceiptTotalHarga().toLocaleString()}</p>
                    </div>
                  </div>
      
                  {isPaid ? (
                    <p className="mt-4 text-green-500 font-semibold">Status: Lunas</p>
                  ) : (
                    <button
                      type="button"
                      className="bg-pastelRose text-white px-4 py-2 rounded-lg mt-4 hover:bg-[#697565] transition duration-300 ease-in-out"
                      onClick={handlePayment}
                    >
                      Bayar
                    </button>
                  )}
      
                  {isPaid && (
                    <div className="mt-4 flex space-x-4">
                      <button
                        type="button"
                        className="bg-[#8b5742] text-white px-4 py-2 rounded-lg hover:bg-[#697565] transition duration-300 ease-in-out"
                        onClick={handleDone}
                      >
                        Selesai
                      </button>
      
                      <button
                        type="button"
                        className="bg-[#4a7c59] text-white px-4 py-2 rounded-lg hover:bg-[#355e42] transition duration-300 ease-in-out"
                        onClick={() => generatePDF(transactionReceipt.id_transaksi)}
                        
                      >
                        Download Receipt
                      </button>
                    </div>
                  )}
      
                  <p className="text-center text-gray-500 mt-4 italic">
                    Thank you so much for visiting Belle Fiori Café! We hope you had a lovely time and
                    look forward to welcoming you back soon.
                  </p>
                </div>
              )}
      
              {errorMessage && <p className="text-red-500 mt-2">{errorMessage}</p>}
            </div>
          </div>
        </>
      );
};      
    export default Cashier;
