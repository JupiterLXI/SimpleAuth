import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';


export default function ResetPasswordConfirm() {
    const { token } = useParams(); // Extract token from URL
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }
        setLoading(true);
        setMessage('');
        setError('');
        try {
            await api.post('auth/password-reset/confirm/', { token, password });
            // await api.post('auth/password-reset/validate_token/', { token, password });
            setMessage('Password reset successful! Redirecting to login...');
            setTimeout(() => navigate('/auth/login'), 3000); // Redirect after 3 seconds
        } catch (err) {
            setError(JSON.stringify(err.response?.data) || 'Failed to send reset email.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h2>Set New Password</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="password"
                    placeholder="New Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                />
                <button type="submit" disabled={loading}>
                    {loading ? 'Resetting...' : 'Reset Password'}
                </button>
            </form>
            {message && <p style={{ color: 'green' }}>{message}</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
};