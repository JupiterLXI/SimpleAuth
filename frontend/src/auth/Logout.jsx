import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import api from '../services/api';


export default function Logout() {
    const { logout } = useContext(AuthContext);
    const navigate = useNavigate()

    const handleLogout = () => {
        logout();
        alert("Successfully logged out.")
        navigate('/');
    };
    
    return (
        <>
            <h4 className='text-warning'>Are you suer you want to logout?</h4>
            <button onClick={handleLogout}>Logout</button>
        </>
    )

};