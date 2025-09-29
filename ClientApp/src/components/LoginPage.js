import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginPage = ({ setLoggedInUser }) => {
    // State to hold form data
    const [Username, setUsername] = useState('');
    const [Password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); // Reset error message

        // Basic validation for empty fields
        if (!Username || !Password) {
            setError('Please fill in both fields');
            return;
        }

        const user = { username: Username, password: Password }; // match backend property names

        // Make the POST request to the backend (API)
        try {
            const response = await fetch('/api/User/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(user),
            });

            if (response.ok) {
               

                // API returns a JWT token
                const data = await response.json();
                const token = data.token;

                // Store JWT token and username in localStorage
                localStorage.setItem('token', token);
                localStorage.setItem('username', Username);

                // Update logged-in user state
                if (setLoggedInUser) {
                    setLoggedInUser({ username: Username });
                }

                // Redirect to the profile page or any protected page
                navigate('/profile');

            } else {
                const text = await response.text();
                setError(text);
            }

        } catch (error) {
            console.error('Error during login:', error);
            setError('An error occurred. Please try again later.');
        }
    };

    return (
        <div className="login-container">
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '4%' }} className="form-group">
                    <label style={{ marginRight: '1%' }} htmlFor="username">Username</label>
                    <input
                        type="text"
                        id="username"
                        value={Username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        placeholder="Enter your username"
                    />
                </div>
                <div style={{ marginBottom: '4%' }} className="form-group">
                    <label style={{ marginRight: '1%' }} htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        value={Password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        placeholder="Enter your password"
                    />
                </div>
                {error && <div className="text-danger">{error}</div>}
                <div className="mb-4"></div>
                <button style={{ marginBottom: '4%' }} type="submit" className="login-btn">
                    Login
                </button>
            </form>
            <div className="signup-link">
                Don't have an account? <a href="/register">Sign up</a>
            </div>
        </div>
    );
};

export default LoginPage;