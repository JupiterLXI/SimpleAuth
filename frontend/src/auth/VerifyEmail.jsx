import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';

export default function VerifyEmail() {
    const { token } = useParams();

    useEffect(() => {
        const verifyEmail = async () => {
            try {
                await api.get(`auth/verify-email/${token}/`);
                alert('Email verified successfully!');
            } catch (error) {
                alert('Verification failed.');
            }
        };
        verifyEmail();
    }, [token]);

    return <div>Verifying email...</div>;
};
