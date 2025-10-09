import React, { useState, useEffect, useRef } from 'react';
import LoginPage from './pages/LoginPage';
import { useAuth } from './context/AuthProvider';
import UserHomePage from './pages/user/UserHomePage';
import { Navigate, Route, Routes } from 'react-router-dom';
import ThemeBotton from './components/ThemeBotton';
import AdminHomePage from './pages/admin/AdminHomePage';
export default function App() {
    const [authUser, setAuthUser] = useAuth();

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 font-sans transition-colors duration-300">
          <ThemeBotton />
            <Routes>
              <Route path="/" element={authUser ? <>{authUser.role=="admin" ? <AdminHomePage /> : <UserHomePage />} </>: <LoginPage />} />
            </Routes>
        </div>
    );
}