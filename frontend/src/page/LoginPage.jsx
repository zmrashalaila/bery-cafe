// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import coffeeImage from '../assets/pinky.jpg';

// const Login = () => {
//     const [username, setUsername] = useState('');
//     const [password, setPassword] = useState('');
//     const [error, setError] = useState('');
//     const navigate = useNavigate();

//     const handleLogin = async (e) => {
//         e.preventDefault();

//         try {
//             const response = await fetch('http://localhost:22077/auth/auth', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({ username, password }),
//             });

//             const data = await response.json();

//             if (data.message === 'Authentication Successed') {
//                 const { role, username, id_user } = data.data;
//                 localStorage.setItem('username', username);
//                 localStorage.setItem('role', role);
//                 localStorage.setItem('id_user', id_user);

//                 switch (role) {
//                     case 'kasir':
//                         navigate('/cashier');
//                         break;
//                     case 'manajer':
//                         navigate('/manajer');
//                         break;
//                     case 'admin':
//                         navigate('/admin');
//                         break;
//                     default:
//                         setError('Invalid role');
//                 }
//             } else {
//                 setError('Invalid username or password');
//             }
//         } catch (err) {
//             setError('Error logging in');
//         }
//     };

//     return (
//         <div className="min-h-screen flex items-center justify-center bg-pastelPink">
//             <div className="bg-white shadow-md rounded-lg flex flex-col md:flex-row w-full max-w-4xl overflow-hidden">
//                 {/* Left Side - Image & Text */}
//                 <div className="relative hidden md:flex md:w-1/2 p-8 bg-pink-50 items-center justify-center">
//                     <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${coffeeImage})` }}></div>
//                     <div className="relative z-10 text-center">
//                         <h2 className="text-3xl font-semibold text-pastelRose">Welcome to Cofesho!</h2>
//                         <p className="mt-2 text-pastelRose">Kick back, sip, and enjoy the blend of laughter, warmth, and a little extra pep in your step</p>
//                     </div>
//                 </div>

//                 {/* Right Side - Login Form */}
//                 <div className="w-full md :w-1/2 p-8">
//                     <h3 className="text-2xl font-semibold text-center text-gray-700">Login</h3>
//                     <p className="text-center text-gray-500">Welcome back! Please enter your details.</p>
                    
//                     {/* Input Fields */}
//                     <form onSubmit={handleLogin} className="mt-8 space-y-4">
//                         <input
//                             type='text'
//                             className="w-full p-3 border border-pink-200 rounded-lg focus:ring-2 focus:ring-pink-400"
//                             value={username}
//                             onChange={(e) => setUsername(e.target.value)}
//                             placeholder='Username'
//                             required 
//                         />
//                         <input
//                             type='password'
//                             className="w-full p-3 border border-pink-200 rounded-lg focus:ring-2 focus:ring-pink-400"
//                             value={password}
//                             onChange={(e) => setPassword(e.target.value)}
//                             placeholder='Password'
//                             required 
//                         />

//                         {/* Remember Me */}
//                         <div className="flex items-center justify-between">
//                             <label className="flex items-center text-gray-500">
//                                 <input type="checkbox" className="h-4 w-4 text-pink-500 rounded" />
//                                 <span className="ml-2 text-sm">Remember me for 30 days</span>
//                             </label>
//                         </div>

//                         {/* Log in Button */}
//                         <div className="mt-6">
//                             <button 
//                                 type="submit"
//                                 className="w-full bg-pastelRose text-white py-3 rounded-lg hover:bg-cream transition"
//                             >
//                                 Log in
//                             </button>
//                         </div>

//                         {/* Error Message */}
//                         {error && <p className='text-red-500 text-center mt-3'>{error}</p>}
//                     </form>

//                     {/* Registration Link */}
//                     <p className='text-center mt-3 text-pastelRose'>
//                         Don't have an account? <a href='/register' className="text-pastelRose hover:underline">Register</a>
//                     </p>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default Login;