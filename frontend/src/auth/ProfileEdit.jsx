import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from './AuthContext';
import { Link } from 'react-router-dom';
import api from '../services/api';


export default function EditProfile() {
  const { user, fetchUser } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    username: '',
    first_name: '',
    last_name: '',
    profile: {
      about: '',
      birth_date: ''
    },
  });
  const [resendMessage, setResendMessage] = useState('');
  const [resendError, setResendError] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || '',
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        profile: {
          about: user.profile ? user.profile.about : '',
          birth_date: user.profile ? user.profile.birth_date : ''
        },
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'about') {
      setFormData((prevData) => ({
        ...prevData,
        profile: { ...prevData.profile, about: value }
      }));
    } else if (name === 'birth_date') {
      setFormData((prevData) => ({
        ...prevData,
        profile: { ...prevData.profile, birth_date: value }
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.patch('auth/profile/', formData);
      alert('Profile updated successfully!');
      if (fetchUser) {
        fetchUser();
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile.');
    }
  };

  const handleResendVerification = async () => {
    setResendMessage('');
    setResendError('');
    try {
      const response = await api.post('/auth/resend-verification-email/');
      setResendMessage(response.data.message);
    } catch (error) {
      setResendError('Failed to resend verification email.');
    }
  };

  return (
    <>
      {user ? (
          <>
          <h3 className='text-primary'>{user.email}</h3>
          {!user.is_verified && (
            <div>
              <p style={{ color: 'yellow' }}>
                Your email is not verified. Please verify your email to access all features.
              </p>
              <button className='btn btn-sm btn-primary' onClick={handleResendVerification}>Resend Verification Email</button>
              {resendMessage && <p style={{ color: 'green' }}>{resendMessage}</p>}
              {resendError && <p style={{ color: 'red' }}>{resendError}</p>}
            </div>
          )}
          <hr />
          <form className='px-4' onSubmit={handleSubmit}>
            <div>
              <label>Username:</label>
              <input 
                type="text" 
                name="username" 
                value={formData.username} 
                onChange={handleChange}
                className="form-control"
              />
            </div>
            <div>
              <label>First Name:</label>
              <input 
                type="text" 
                name="first_name" 
                value={formData.first_name} 
                onChange={handleChange}
                className="form-control" 
              />
            </div>
            <div>
              <label>Last Name:</label>
              <input 
                type="text" 
                name="last_name" 
                value={formData.last_name} 
                onChange={handleChange}
                className="form-control" 
              />
            </div>
            <div>
              <label>About:</label>
              <textarea 
                name="about" 
                value={formData.profile.about} 
                onChange={handleChange}
                className="form-control" 
              />
            </div>
            <div>
              <label htmlFor='date'>Birth Date:</label>
              <input
                type='date' 
                name="birth_date"
                value={formData.profile.birth_date} 
                onChange={handleChange} 
                className="form-control"
              />
            </div>
            <button type="submit" className="btn btn-sm btn-light">Save Changes</button>
          </form>
          <Link className='text-info' to='/auth/change-password'>Change my password</Link>
    
          </>
      ) : (
          <h5 className="text-center text-warning h5">You are not logged in.</h5>
      )}
   </>
  );
}