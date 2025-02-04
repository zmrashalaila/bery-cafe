import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';


const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

       try {
    const response = await fetch('http://localhost:8000/auth', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
        // If response is not OK, display error
        throw new Error('Failed to login. Please check your username and password.');
    }

    const data = await response.json();

    if (data.message === 'Authentication Successed') {
        const role = data.data.role;
        const username = data.data.username;
        const id_user = data.data.id_user;
        const token = data.token;

        // Save user data to localStorage
        localStorage.setItem('username', username);
        localStorage.setItem('role', role);
        localStorage.setItem('id_user', id_user);
        localStorage.setItem('token', token);

        // Redirect based on role
        if (role === 'kasir') {
            navigate('/cashier');
        } else if (role === 'manager') {
            navigate('/manager');
        } else if (role === 'admin') {
            navigate('/admin');
        } else {
            setError('Invalid role');
        }
    } else {
        setError('Invalid username or password');
    }
} catch (err) {
    // Handle network or other errors
    setError('Error logging in: ' + err.message);
}

    };
    return (
        <div 
        className="min-h-screen flex items-center justify-start bg-cover bg-center" 
        style={{ backgroundImage: `url(${require('../assets/login_bg.png')})` }}  >
        
            <div className="bg-white shadow-md rounded-lg flex flex-col w-full max-w-md p-8 ml-[200px]">
                <h2 className="text-3xl font-bold text-center text-pastelRose mb-6">Hello Bloomies! </h2>
                {/* <h3 className="text-2xl font-semibold text-center text-gray-700 mb-2">Login</h3> */}
                <p className="text-center text-gray-500 mb-7">We’re thrilled to have you at Belle Fiori, where hearts bloom.</p>

                {/* Input Fields */}
                <form onSubmit={handleLogin} className="space-y-4">
                    <input
                        type='text'
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pastelPink"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder='Username'
                        required 
                    />
                    <input
                        type='password'
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pastelPink"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder='Password'
                        required 
                    />

                    {/* Remember Me */}
                    {/* <div className="flex items-center justify-between">
                        <label className="flex items-center text-gray-500">
                            <input type="checkbox" className="h-4 w-4 text-pastelPink rounded" />
                            <span className="ml-2 text-sm">Remember me for 30 days</span>
                        </label>
                    </div> */}

                    {/* Log in Button */}
                    <div className="mt-6">
                        <button 
                            type="submit"
                            className="w-full bg-pastelRose text-white py-3 rounded-lg hover:bg-pastelLightPink transition"
                        >
                            Log in
                        </button>
                    </div>

                    {/* Error Message */}
                    {error && <p className='text-red-500 text-center mt-3'>{error}</p>}
                </form>

                {/* Registration Link */}
                <p className='text-center mt-6 text-pastelLightPink'>
                    Don't have an account? <a href='/register' className="text-pastelLightPink hover:underline">Register</a>
                </p>
            </div>
        </div>
    );
};

export default Login;
