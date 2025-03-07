import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api'; 

export default function ChangePassword() {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');
        try {
            const response = await api.post('/auth/change-password/', {
                current_password: currentPassword,
                new_password: newPassword,
            });
            setMessage(response.data.message + ' Redirecting to Profile...');
            setTimeout(() => navigate('/auth/profile'), 3000); // Redirect after 3 seconds
            setCurrentPassword(''); // Clear form on success
            setNewPassword('');
        } catch (err) {
            setError(
                err.response?.data?.current_password ||
                err.response?.data?.new_password ||
                'Failed to change password.'
            );
        }
    };

    return (
        <div>
            <h2>Change Password</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="password"
                    placeholder="Current Password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="New Password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                />
                <button type="submit">Change Password</button>
                <button className='btn btn-danger'><Link to='/auth/profile'>Cancel</Link></button>
            </form>
            {message && <p style={{ color: 'green' }}>{message}</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
};