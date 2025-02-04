import React, { useState } from 'react';
import 'tailwindcss/tailwind.css';
import login_bg from '../assets/login_bg.png';
import { useNavigate } from 'react-router-dom';


const Register = () => {
  const [nama_user, setNamaUser] = useState('');
  const [role, setRole] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
      e.preventDefault();

      if (password !== confirmPassword) {
          setError('Passwords do not match');
          return;
      }

      if (password.length < 8) {
          setError('Password must be at least 8 characters long');
          return;
      }

      try {
          const response = await fetch('http://localhost:8000/auth//regist', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({ nama_user, role, username, password }),
          });

          const data = await response.body;
          console.log(data);

          if (response.ok) {
              navigate("/");
          } else if (data.message === "Username already exists") {
              setError("Username already exists");
          } else {
              setError("Registration failed");
          }
      } catch (err) {
          console.error('Error during registration:', err);
          setError('Error registering user');
      }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-start bg-cover bg-center"
      style={{ backgroundImage: `url(${login_bg})` }}
    >
      <div className="bg-white shadow-md rounded-lg flex flex-col w-full max-w-md p-8 ml-[200px]">
        <h2 className="text-3xl font-bold text-center text-pastelRose mb-4">Hello Bloomies!</h2>
        <p className="text-center text-gray-500 mb-6">Create your account below.</p>

        <form onSubmit={handleRegister} className="space-y-4">
          <input
            type="text"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pastelPink"
            value={nama_user}
            onChange={(e) => setNamaUser(e.target.value)}
            placeholder="Enter your name"
            required
          />
          <input
            type="text"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pastelPink"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            required
          />
          <input
            type="password"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pastelPink"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
          />
          <input
            type="password"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pastelPink"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm Password"
            required
          />
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pastelPink"
            required
          >
            <option value="" disabled>Select Role</option>
            <option value="kasir">Kasir</option>
            <option value="manager">Manager</option>
            <option value="admin">Admin</option>
          </select>

          {error && <p className="text-red-500 text-center mt-3">{error}</p>}

          <div className="mt-6">
            <button
              type="submit"
              className="w-full bg-pastelRose text-white py-3 rounded-lg hover:bg-pastelLightPink transition"
            >
              Register
            </button>
          </div>
        </form>

        <p className="text-center mt-6 text-pastelLightPink">
          Already have an account?{' '}
          <a href="/" className="text-pastelLightPink hover:underline">
            Log in
          </a>
        </p>
      </div>
    </div>
  );
};

export default Register;