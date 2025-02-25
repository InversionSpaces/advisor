import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { BACKEND_URL } from './config';

function LoginForm() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${BACKEND_URL}/api/login/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });
            const data = await response.json();
            if (response.ok) {
                if (data.refresh && data.access) {
                    localStorage.setItem('refreshToken', data.refresh);
                    localStorage.setItem('token', data.access);
                    setMessage('Login successful!');
                    navigate('/chat');
                } else {
                    setMessage('Invalid response from server. Missing authentication tokens.');
                }
            } else {
                setMessage(data.message || data.error || 'Login failed');
            }
        } catch (error) {
            setMessage('An error occurred. Please try again.');
        }
    };

    return (
        <form onSubmit={handleLogin}>
            <h2>Login</h2>
            <div>
                <label>Username:</label>
                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
            </div>
            <div>
                <label>Password:</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <button type="submit">Login</button>
            {message && <p>{message}</p>}
        </form>
    );
}

export default LoginForm; 