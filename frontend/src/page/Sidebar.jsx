import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'tailwindcss/tailwind.css';
import Logout from '../page/Logout';
import Profile from '../assets/profile.jpeg';

const Sidebar = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [user, setUser] = useState({
        username: localStorage.getItem('username') || 'User',
        role: localStorage.getItem('role') || 'Guest'
    });
    const navigate = useNavigate();

    // Function to fetch user data
    const fetchUser = async () => {
        try {
            let token = localStorage.getItem('token');
            const response = await fetch('http://localhost:8000/user', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                credentials: 'include',
            });
            const data = await response.json();
            setUser(data.data); // Save user data in state
        } catch (error) {
            console.error('Failed to fetch user data', error);
        }
    };

    // Call fetchUser when component is rendered
    useEffect(() => {
        fetchUser();
    }, []);

    const handleCashier = () => {
        navigate('/cashier');
    };

    const handleViewAllTransactions = () => {
        navigate('/transactions');
    };

    const handleViewReports = () => {
        navigate('/manager');
    };

    const handleAdminDashboard = () => {
        navigate('/admin');
    };

    const handleManageUsers = () => {
        navigate('/manage-users');
    };

    const handleManageFoods = () => {
        navigate('/manage-foods');
    };

    const handleManageTables = () => {
        navigate('/manage-tables');
    };

 const handleLogout = async () => {
    console.log('Logout button clicked'); // Tambahkan log ini
    try {
        const response = await fetch('http://localhost:8000/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        });

        if (response.ok) {
            console.log('Logout successful'); // Tambahkan log ini
            setUser(null);
            navigate('/login');
        } else {
            console.error('Logout failed: ', response.statusText);
        }
    } catch (error) {
        console.error('Logout failed', error);
    }
};


    return (
        <nav className="bg-white relative border-gray-200 dark:bg-gray-900">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
          {/* <a href="https://flowbite.com/" className="flex items-center space-x-3 rtl:space-x-reverse"> */}
          <img
                        src={require('../assets/clogo.jpg')}
                        alt="CafeLogo"
                        className="w-16 h-16 rounded-full"
                      />
            {/* <img src='../assets/clogo.jpg' className="w-16 h-16 rounded-full" alt=" /> */}
            {/* <span className="-ml-[35%] text-2xl font-semibold">Belle Fiori</span> */}
          {/* </a> */}
          <div className="flex items-center md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
            <button
              type="button"
              className="flex text-sm bg-gray-800 rounded-full md:me-0 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
              id="user-menu-button"
              aria-expanded={isDropdownOpen}
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <span className="sr-only">Open user menu</span>
              <img
                        src={require('../assets/profile.jpeg')}
                        alt="Profile"
                        className="w-10 h-10 rounded-full"
                      />
            </button>
            {isDropdownOpen && (
              <div className="z-[99] absolute right-3 top-11 my-4 text-base list-none bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700 dark:divide-gray-600" id="user-dropdown">
                <div className="px-4 py-3">
                  <span className="block text-sm text-gray-900 dark:text-white">Zmra Shalaila</span>
                  <span className="block text-sm text-gray-500 truncate dark:text-gray-400">hello@gmail.com</span>
                </div>
                <ul className="py-2" aria-labelledby="user-menu-button">

                  <li >
                 <Logout/>
                  </li>
                </ul>
              </div>
            )}
            <button
              data-collapse-toggle="navbar-user"
              type="button"
              className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
              aria-controls="navbar-user"
              aria-expanded={isMenuOpen}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <span className="sr-only">Open main menu</span>
              <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 1h15M1 7h15M1 13h15" />
              </svg>
            </button>
          </div>
          <div className={`items-center justify-between ${isMenuOpen ? "block" : "hidden"} w-full md:flex md:w-auto md:order-1`} id="navbar-user">
          <ul className="flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
                  {user?.role === 'kasir' && (
                <>
                    <li 
                        onClick={handleCashier} 
                    >
                        <p className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white cursor-pointer">Add Transaction</p> 
                    </li>
                    <li 
                        onClick={handleViewAllTransactions} 
                       
                    >
                        <p  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white cursor-pointer">View All Transactions</p> 
                    </li>
                </>
            )}
            {/* Only show this button for Manager */}
            {user?.role === 'manager' && (
                <li 
                    onClick={handleViewReports} 
                    
                >
                    <p  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white cursor-pointer"> View Reports</p>
                </li>
            )}

        {/* Only show this button for Admin */}
             {user?.role === 'admin' && (
                <>
                    <li 
                        onClick={handleAdminDashboard} 
                       
                    >
                       <p  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white cursor-pointer"> Admin Dashboard</p> 
                    </li>
                    <li 
                        onClick={handleManageUsers} 
                       
                    >
                        <p  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white cursor-pointer"> Manage Users</p>
                    </li>
                    <li 
                        onClick={handleManageFoods} 
                        
                    >
                        <p  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white cursor-pointer"> Manage Foods</p>
                    </li>
                    <li 
                        onClick={handleManageTables} 
                      
                    >
                        <p  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white cursor-pointer"> Manage Tables</p>
                    </li>
                </>
            )}
            
              
              
            </ul>
          </div>
        </div>
      </nav>
    //     <div className="bg-white w-64 h-full shadow-lg rounded-lg p-6 m-4">
    //         <img 
    //             src={Profile} 
    //             alt="Profile" 
    //             className="w-20 h-20 rounded-full mx-auto mb-4" 
    //         />
    //         <h3 className="text-xl font-semibold mb-2 text-center">{user?.username || 'User'}</h3>
    //         <p className="text-gray-700 text-center">
    //             Role: {user?.role === 'admin' ? 'Admin' : user?.role === 'kasir' ? 'Cashier' : user?.role === 'manager' ? 'Manager' : 'Guest'}
    //         </p>
    //         <p className="text-gray-700 text-center">Status: Online</p>

    //         {/* Buttons based on role */}
    //         {user?.role === 'kasir' && (
    //             <>
    //                 <button 
    //                     onClick={handleCashier} 
    //                     className="mt-4 bg-pastelRose text-white rounded-lg px-4 py-2 w-full hover:bg-pastelLightPink transition duration-300"
    //                 >
    //                     Add Transaction
    //                 </button>
    //                 <button 
    //                     onClick={handleViewAllTransactions} 
    //                     className="mt-2 bg-pastelRose text-white rounded-lg px-4 py-2 w-full hover:bg-pastelLightPink transition duration-300"
    //                 >
    //                     View All Transactions
    //                 </button>
    //             </>
    //         )}

    //         {/* Only show this button for Manager */}
    //         {user?.role === 'manager' && (
    //             <button 
    //                 onClick={handleViewReports} 
    //                 className="mt-4 bg-pastelRose text-white rounded-lg px-4 py-2 w-full hover:bg-pastelLightPink transition duration-300"
    //             >
    //                 View Reports
    //             </button>
    //         )}

    //         {/* Only show this button for Admin */}
    //         {user?.role === 'admin' && (
    //             <>
    //                 <button 
    //                     onClick={handleAdminDashboard} 
    //                     className="mt-4 bg-pastelRose text-white rounded-lg px-4 py-2 w-full hover:bg-pastelLightPink transition duration-300"
    //                 >
    //                     Admin Dashboard
    //                 </button>
    //                 <button 
    //                     onClick={handleManageUsers} 
    //                     className="mt-2 bg-pastelRose text-white rounded-lg px-4 py-2 w-full hover:bg-pastelLightPink transition duration-300"
    //                 >
    //                     Manage Users
    //                 </button>
    //                 <button 
    //                     onClick={handleManageFoods} 
    //                     className="mt-2 bg-pastelRose text-white rounded-lg px-4 py-2 w-full hover:bg-pastelLightPink transition duration-300"
    //                 >
    //                     Manage Food
    //                 </button>
    //                 <button 
    //                     onClick={handleManageTables} 
    //                     className="mt-2 bg-pastelRose text-white rounded-lg px-4 py-2 w-full hover:bg-pastelLightPink transition duration-300"
    //                 >
    //                     Manage Tables
    //                 </button>
    //             </>
    //         )}

    // <button 
    //             onClick={handleLogout} 
    //             className="mt-2 bg-pastelRose text-white rounded-lg px-4 py-2 w-full hover:bg-pastelLightPink transition duration-300"
    //         >
    //             <Logout />
    //         </button>
    //     </div>
    );
};

export default Sidebar;
