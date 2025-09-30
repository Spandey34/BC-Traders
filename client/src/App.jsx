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
              <Route path="/" element={authUser ? <>{role=="admin" ? <AdminHomePage /> : <UserHomePage />} </>: <LoginPage />} />
              <Route path="/login" element={authUser ? <>{role=="admin" ? <Navigate to={"/admin"} /> : <Navigate to={"/user"} />} </>: <LoginPage />} />
              <Route path="/signup" element={authUser ? <>{role=="admin" ? <Navigate to={"/admin"} /> : <Navigate to={"/user"} />} </>: <SignupPage />} />
              <Route path="/forgotpassword" element={authUser ? <>{role=="admin" ? <Navigate to={"/admin"} /> : <Navigate to={"/user"} />} </>: <ForgotPasswordPage />} />
            </Routes>
        </div>
    );
}