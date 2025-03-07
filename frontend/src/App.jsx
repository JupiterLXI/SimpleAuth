import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import MyNavbar from './ui/Navbar'
import Login from './auth/Login'
import Register from './auth/Register'
import Logout from './auth/Logout'
import EditProfile from './auth/ProfileEdit'
import PasswordResetRequest from './auth/PasswordResetRequest'
import ResetPasswordConfirm from './auth/PasswordResetConfirm'
import ChangePassword from './auth/PasswordChange'


export default function App() {
  return (
    <>
      <Router>
        <MyNavbar />
        <Routes>
          <Route path="/" element={<h1 className="display-4 text-primary-emphasis text-center p-3">Home, Sweet Home!</h1>}/>
            <Route path="/auth/login" element={<Login/>} />
            <Route path="/auth/register" element={<Register/>} />
            <Route path="/auth/profile" element={<EditProfile/>} />
            <Route path="/auth/logout" element={<Logout/>} />
            <Route path="/auth/password-reset" element={<PasswordResetRequest/>} />
            <Route path="/auth/password-reset/confirm/:token" element={<ResetPasswordConfirm />} />
            <Route path="/auth/change-password" element={<ChangePassword/>} />
        </Routes>
      </Router>
    </>
  )
}
