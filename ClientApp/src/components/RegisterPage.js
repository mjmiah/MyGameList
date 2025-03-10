import React, { useState } from 'react';

const RegisterPage = () => {
    const [Username, setUsername] = useState('');
    const [Password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Simple password match check
        if (Password !== confirmPassword) {
            setError("Passwords don't match!");
            return;
        }

        // Create the user registration object
        const user = { Username, Password };

        try {
            const response = await fetch('/api/User/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(user),
            });
            console.log('user: ', JSON.stringify(user));
            // Log response status & raw text before parsing JSON
            const text = await response.text();
            //console.log('Raw response:', text);

            if (response.ok) { // User registered successfully
                console.log(text);
                setError(text);

            } else { // Error
                try {
                    const errorData = JSON.parse(text);
                    setError(errorData.message || 'Something went wrong. Please try again.');
                } catch (err) {
                    console.error('Error parsing error response:', text);
                    setError('Something went wrong. Please try again.');
                }
            }
        } catch (error) {
            setError('Error: ' + error.message);
            console.error('Error: ' + error.message);
        }
    };

    return (
        <div className="container">
            <h2>Register</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="username" className="form-label">Username</label>
                    <input
                        type="text"
                        className="form-control"
                        id="username"
                        value={Username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input
                        type="password"
                        className="form-control"
                        id="password"
                        value={Password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                    <input
                        type="password"
                        className="form-control"
                        id="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                </div>
                {error && <div className="text-danger">{error}</div>}
                <div className="mb-4"></div>
                <button type="submit" className="submit">Register</button>
            </form>
        </div>
    );
};

export default RegisterPage;