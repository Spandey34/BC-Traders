import React from 'react';
import { SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";
import { useTheme } from '../../context/ThemeProvider';
import { useCart } from '../../context/CartContext';
import { useTab } from '../../context/ActiveTabContext';

// Import Page Components
import Products from '../../components/Products';
import Orders from '../../components/Orders';
import Cart from '../../components/Cart';
import Profile from '../../components/Profile';

// Icon Components
const HomeIcon = ({ className = "w-6 h-6" }) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>);
const ShoppingCartIcon = ({ className = "w-6 h-6" }) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" /></svg>);
const PackageIcon = ({ className = "w-6 h-6" }) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="16.5" x2="7.5" y1="9.4" y2="9.4" /><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /><polyline points="3.27 6.96 12 12.01 20.73 6.96" /><line x1="12" x2="12" y1="22.08" y2="12" /></svg>);
const UserIcon = ({ className = "w-6 h-6" }) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>);
const SunIcon = ({ className = "w-6 h-6" }) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>);
const MoonIcon = ({ className = "w-6 h-6" }) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>);


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
        { id: 'home', label: 'Home', icon: <HomeIcon /> },
        { id: 'orders', label: 'Orders', icon: <PackageIcon /> },
        { id: 'cart', label: 'Cart', icon: (
            <div className="relative">
                <ShoppingCartIcon />
                {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold shadow-sm">
                        {cartCount}
                    </span>
                )}
            </div>
        )},
        { id: 'profile', label: 'Profile', icon: <UserIcon /> },
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
                                {item.icon}
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
                        {theme === 'light' ? <MoonIcon /> : <SunIcon />}
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
                            {theme === 'light' ? <MoonIcon className="w-5 h-5" /> : <SunIcon className="w-5 h-5" />}
                        </button>
                        <div className="w-8 h-8 flex items-center justify-center">
                            <SignedIn><UserButton /></SignedIn>
                            <SignedOut>
                                <button onClick={() => setActiveTab('profile')} className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100">
                                    <UserIcon className="w-6 h-6" />
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
                                    ? 'text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-900/20' 
                                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                            }`}
                        >
                            <div className="relative">{item.icon}</div>
                            <span className="text-xs font-medium">{item.label}</span>
                        </button>
                    ))}
                </nav>
            </div>
        </div>
    );
};

export default UserHomePage;