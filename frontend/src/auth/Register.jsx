import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from './AuthContext';

export default function Register() {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('auth/register/', formData);
            alert('Registration successful! Check your email for verification.');
            // alert(`formdata: ${formData.email} and ${formData.password}`);
            const response = await api.post('auth/token/', { username: formData.email, password: formData.password });
            login(response.data.access, response.data.refresh);
            navigate('/auth/profile');
        } catch (error) {
            alert('Registration failed.');
        }
    };

    return (
        <>
        <form onSubmit={handleSubmit}>
            <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            <input
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
            <button type="submit">Register</button>
        </form>
        <hr />
        <p>
            <span className='p-2 text-secondary'>Already have an account?</span><Link to='/auth/login'>Login</Link>
        </p>
        </>
    );
};
