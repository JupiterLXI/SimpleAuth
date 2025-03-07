import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import api from '../services/api';


export default function PasswordResetRequest() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        setError('');
        try {
            await api.post('auth/password-reset/', { email });
            setMessage('A password reset link has been sent to your email.');
            setTimeout(() => navigate('/auth/login'), 3000); // Redirect after 3 seconds
        } catch (err) {
            setError(JSON.stringify(err.response?.data) || 'Failed to send reset email.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h2>Reset Password</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <button type="submit" disabled={loading}>
                    {loading ? 'Sending...' : 'Send Reset Link'}
                </button>
            </form>
            {message && <p style={{ color: 'green' }}>{message}</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
};