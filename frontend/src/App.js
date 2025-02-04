import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './page/Login';
import Cashier from './page/Cashier';
import Register from './page/Register';
import ViewTransaction from './page/viewTransaction';
import Manager from './page/Manager';
import Admin from './page/Admin';
import ManageUsers from './page/manageUser';
import ManageFoods from './page/manageFood';
import ManageTables from './page/manageTable';
import Logout from './page/Logout';
import Coba from './page/coba';
// import Navbar from './page/Navbar;'

const App = () => {
  return (
    <Router>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/cashier" element={<Cashier />} />
            <Route path="/register" element={<Register />} />
            <Route path="/transactions" element={<ViewTransaction />} />
            <Route path="/manager" element={<Manager />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/manage-users" element={<ManageUsers />} />
                <Route path="/manage-foods" element={<ManageFoods />} />
                <Route path="/manage-tables" element={<ManageTables />} />
                <Route path="/logout" element={<Logout />} />
                {/* <Route path="/coba" element={<Coba />}/> */}
                {/* <Route path="/navbar" element={<Navbar />} /> */}

            {/* Tambahkan route lain di sini */}
          </Routes>
    </Router>
  );
};

export default App;
