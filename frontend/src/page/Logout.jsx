import React from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Perform logout operations, like removing the token
    localStorage.removeItem('token'); // Example of removing the token
    navigate('/'); // Redirect to the login page
  };

  return (
    <p
      onClick={handleLogout}
      className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer'
      // className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
    >
      Logout
    </p>
  );
};

export default Logout;
