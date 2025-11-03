import React, { useState } from 'react';
import { SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";
import { useTheme } from '../../context/ThemeProvider';
import { useCart } from '../../context/CartContext';
import { FaCartPlus, FaHome } from "react-icons/fa"
import { GoPackage, GoPerson } from "react-icons/go"
import { LuMoon, LuSun } from "react-icons/lu";

// Import Page Components
import Products from './Products';
import Orders from './Orders';
import Cart from './Cart';
import Profile from './Profile';
import { useTab } from '../../context/ActiveTabContext';


const UserHomePage = () => {
    const [activeTab, setActiveTab] = useTab();
    const [theme, setTheme, toggleTheme]   = useTheme();
    const { cartItems } = useCart();

    const renderContent = () => {
        switch (activeTab) {
            case 'home': return <Products />;
            case 'orders': return <Orders />;
            case 'cart': return <Cart />;
            case 'profile': return <Profile />;
            default: return <Products />;
        }
    };

    //const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
    const cartCount = cartItems.length;
    
    const navItems = [
        { id: 'home', label: 'Home', icon: <FaHome /> },
        { id: 'orders', label: 'Orders', icon: <GoPackage /> },
        { id: 'cart', label: 'Cart', icon: (
            <div className="relative">
                <FaCartPlus />
                {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center font-bold shadow-sm">
                        {cartCount}
                    </span>
                )}
            </div>
        )},
        { id: 'profile', label: 'Profile', icon: <GoPerson /> },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 dark:from-gray-900 dark:to-gray-800 text-gray-800 dark:text-gray-100">
            {/* Desktop Sidebar */}
            <aside className="hidden lg:flex flex-col w-80 bg-white/80 dark:bg-gray-800/80 border-r border-gray-200/50 dark:border-gray-700/50 p-6 backdrop-blur-xl fixed left-0 top-0 h-full">
                <div className="mb-10">
                    <div className="font-bold text-3xl bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 mb-2">
                        BC-Traders
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Sumit Pandey</p>
                </div>
                
                <nav className="flex flex-col gap-2 flex-1">
                    {navItems.map(item => (
                        <button 
                            key={item.id} 
                            onClick={() => setActiveTab(item.id)}
                            className={`flex items-center gap-4 px-4 py-3 rounded-xl text-base font-medium transition-all duration-200 w-full group ${
                                activeTab === item.id 
                                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg' 
                                    : 'text-gray-600 dark:text-gray-400 hover:bg-white/50 dark:hover:bg-gray-700/50 hover:text-gray-900 dark:hover:text-gray-100'
                            }`}
                        >
                            <div className={`transition-transform duration-200 group-hover:scale-110 ${activeTab === item.id ? 'scale-110' : ''}`}>
                                <div className='text-xl' >
                                  {item.icon}  
                                </div>
                                
                            </div>
                            <span>{item.label}</span>
                        </button>
                    ))}
                </nav>

                <div className="mt-auto pt-6 border-t border-gray-200/50 dark:border-gray-700/50">
                    <button 
                        onClick={toggleTheme}
                        className="flex items-center justify-center gap-3 w-full py-3 px-4 rounded-xl bg-gray-100/50 dark:bg-gray-700/50 text-gray-600 dark:text-gray-400 hover:bg-gray-200/50 dark:hover:bg-gray-600/50 transition-all duration-200 font-medium"
                    >
                        {theme === 'light' ? <LuMoon  /> : <LuSun />}
                        <span>{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
                    </button>
                </div>
            </aside>

            {/* Main content area */}
            <div className="lg:ml-80 min-h-screen flex flex-col">
                {/* Mobile header */}
                <header className="lg:hidden sticky top-0 z-50 flex items-center justify-between p-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50">
                <div>
                    <div className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                        BC-Traders
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Sumit Pandey</p>
                </div>
                    
                    <div className="flex items-center gap-3">
                        <button 
                            onClick={toggleTheme}
                            className="p-2 rounded-lg bg-gray-100/50 dark:bg-gray-700/50 text-gray-600 dark:text-gray-400 hover:bg-gray-200/50 dark:hover:bg-gray-600/50 transition-colors duration-200"
                        >
                            {theme === 'light' ? <LuMoon  className="w-5 h-5" /> : <LuSun className="w-5 h-5" />}
                        </button>
                        <div className="w-8 h-8 flex items-center justify-center">
                            <SignedIn><UserButton /></SignedIn>
                            <SignedOut>
                                <button onClick={() => setActiveTab('profile')} className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100">
                                    <GoPerson className="w-8 h-8" />
                                </button>
                            </SignedOut>
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto">
                    {renderContent()}
                </main>

                {/* Mobile bottom nav */}
                <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-t border-gray-200/50 dark:border-gray-700/50 flex justify-around p-3 z-40">
                    {navItems.map(item => (
                        <button 
                            key={item.id} 
                            onClick={() => setActiveTab(item.id)}
                            className={`flex flex-col items-center gap-1 w-full py-2 rounded-xl transition-all duration-200 ${
                                activeTab === item.id 
                                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg' 
                                    : 'text-gray-600 dark:text-gray-400 hover:bg-white/50 dark:hover:bg-gray-700/50 hover:text-gray-900 dark:hover:text-gray-100'
                            }`}
                        >
                            <div className="relative text-xl">{item.icon}</div>
                            <span className="text-xl font-medium">{item.label}</span>
                        </button>
                    ))}
                </nav>
            </div>
        </div>
    );
};

export default UserHomePage;