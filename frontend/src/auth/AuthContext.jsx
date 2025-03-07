import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [accessToken, setAccessToken] = useState(localStorage.getItem('accessToken'));
    const [refreshToken, setRefreshToken] = useState(localStorage.getItem('refreshToken'));
    const [user, setUser] = useState(null);

    // Fetch user details whenever the access token is available
    const fetchUser = async () => {
        try {
        const response = await api.get('auth/profile/');
        setUser(response.data);
        // localStorage.setItem('userInfo', user);
        } catch (error) {
            if (error.response && error.response.status === 401) {
                logout();
            } else {
                console.error('Failed to fetch user:', error);
            }
        }
    };

    useEffect(() => {
        if (accessToken) {
        fetchUser();
        }
    }, [accessToken]);

    const login = (access, refresh) => {
        setAccessToken(access);
        setRefreshToken(refresh);
        localStorage.setItem('accessToken', access);
        localStorage.setItem('refreshToken', refresh);
    };

    const logout = () => {
        setAccessToken(null);
        setRefreshToken(null);
        setUser(null);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');

        // api.defaults.headers['Authorization'] = '';
    };

    return (
        <AuthContext.Provider value={{ accessToken, refreshToken, user, login, logout, fetchUser }}>
            {children}
        </AuthContext.Provider>
    );
};