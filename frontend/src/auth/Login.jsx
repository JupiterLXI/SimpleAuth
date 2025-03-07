import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import api from '../services/api';


export default function Login() {
    const [formData, setFormData] = useState({ username: '', password: '' });
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('auth/token/', formData);
            login(response.data.access, response.data.refresh);
            alert('Login successful!');
            navigate('/auth/profile');
        } catch (error) {
            const message = error.response?.data?.detail || 'Login failed.';
            alert(message);
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Username or Email"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                <button type="submit">Login</button>
            </form>
            <hr />
            <p>
                <Link to='/auth/password-reset' className='text-info p-2'>Forget Password?</Link>
                <br />
                <span className='p-2 text-secondary'>Don't have an account?</span><Link to='/auth/register'>Signup</Link>
            </p>
        </>
    );
};
