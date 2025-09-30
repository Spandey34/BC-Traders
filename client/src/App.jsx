import React, { useState, useEffect, useRef } from 'react';
import LoginPage from './pages/LoginPage';
import { useAuth } from './context/AuthProvider';
import UserHomePage from './pages/user/UserHomePage';
import { Navigate, Route, Routes } from 'react-router-dom';
import SignupPage from './pages/SignupPage';
import ThemeBotton from './components/ThemeBotton';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import AdminHomePage from './pages/admin/AdminHomePage';

export default function App() {
    const [authUser, setAuthUser, role, setRole] = useAuth();

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 font-sans transition-colors duration-300">
          <ThemeBotton />
            <Routes>
              <Route path="/" element={authUser ? <>{role=="admin" ? <AdminHomePage /> : <UserHomePage />} </>: <Navigate to={"/login"} />} />
              <Route path="/login" element={authUser ? <Navigate to={"/"} />: <LoginPage />} />
              <Route path="/signup" element={authUser ? <Navigate to={"/"} />: <SignupPage />} />
              <Route path="/forgotpassword" element={authUser ? <Navigate to={"/"} />: <ForgotPasswordPage />} />
            </Routes>
        </div>
    );
}