import React, { useState } from 'react';

// --- SVG Icon Components (for better performance and customization) ---
const HomeIcon = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
);

const ShoppingCartIcon = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" /></svg>
);

const PackageIcon = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="16.5" x2="7.5" y1="9.4" y2="9.4" /><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /><polyline points="3.27 6.96 12 12.01 20.73 6.96" /><line x1="12" x2="12" y1="22.08" y2="12" /></svg>
);

const UserIcon = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
);

const SearchIcon = ({ className = "w-5 h-5" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="11" cy="11" r="8" /><line x1="21" x2="16.65" y1="21" y2="16.65" /></svg>
);

const PlusIcon = ({ className = "w-4 h-4" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="12" x2="12" y1="5" y2="19" /><line x1="5" x2="19" y1="12" y2="12" /></svg>
);

const MinusIcon = ({ className = "w-4 h-4" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="5" x2="19" y1="12" y2="12" /></svg>
);


// --- Mock Data ---
const mockProducts = [
    { id: 1, name: 'Premium Cotton T-Shirt', price: 250.00, imageUrl: 'https://placehold.co/400x400/f0f0f0/333?text=T-Shirt' },
    { id: 2, name: 'Denim Jeans (Bulk Pack)', price: 1200.00, imageUrl: 'https://placehold.co/400x400/f0f0f0/333?text=Jeans' },
    { id: 3, name: 'Leather Wallets (Set of 10)', price: 800.00, imageUrl: 'https://placehold.co/400x400/f0f0f0/333?text=Wallets' },
    { id: 4, name: 'Classic Wrist Watch', price: 1500.00, imageUrl: 'https://placehold.co/400x400/f0f0f0/333?text=Watch' },
    { id: 5, name: 'Canvas Sneakers', price: 750.00, imageUrl: 'https://placehold.co/400x400/f0f0f0/333?text=Sneakers' },
    { id: 6, name: 'Woolen Scarf (12-Pack)', price: 950.00, imageUrl: 'https://placehold.co/400x400/f0f0f0/333?text=Scarf' },
];

const mockOrders = [
    { id: 'ORD-101', date: '2023-10-25', status: 'Delivered', total: 4800.00, items: [{ name: 'Denim Jeans (Bulk Pack)', quantity: 4 }] },
    { id: 'ORD-102', date: '2023-10-28', status: 'Shipped', total: 1600.00, items: [{ name: 'Leather Wallets (Set of 10)', quantity: 2 }] },
    { id: 'ORD-103', date: '2023-11-01', status: 'Processing', total: 2250.00, items: [{ name: 'Canvas Sneakers', quantity: 3 }] },
];

const mockCartItems = [
    { ...mockProducts[0], quantity: 5 },
    { ...mockProducts[2], quantity: 2 },
];


// --- Page Components ---

// 1. Products Page (Home)
const ProductsPage = () => {
    return (
        <div>
            <header className="sticky top-0 bg-white dark:bg-gray-900/80 backdrop-blur-sm z-10 p-4 border-b border-gray-200 dark:border-gray-700">
                <div className="relative">
                    <input
                        type="search"
                        placeholder="Search for products..."
                        className="w-full pl-10 pr-4 py-2 rounded-lg border bg-gray-100 dark:bg-gray-800 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                        <SearchIcon />
                    </div>
                </div>
            </header>
            <main className="p-4">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">Featured Products</h1>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {mockProducts.map(product => (
                        <div key={product.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden group">
                            <img src={product.imageUrl} alt={product.name} className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300" />
                            <div className="p-4">
                                <h3 className="font-semibold text-gray-800 dark:text-gray-200 truncate">{product.name}</h3>
                                <p className="text-lg font-bold text-blue-600 dark:text-blue-400 mt-1">₹{product.price.toFixed(2)}</p>
                                <button className="w-full mt-3 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-semibold">
                                    Add to Cart
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
};

// 2. Orders Page
const OrdersPage = () => {
    return (
        <div>
             <header className="sticky top-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm z-10 p-4 border-b border-gray-200 dark:border-gray-700">
                <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100 text-center">My Orders</h1>
            </header>
            <main className="p-4 space-y-4">
                {mockOrders.map(order => (
                    <div key={order.id} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
                        <div className="flex justify-between items-start mb-2">
                            <div>
                                <p className="font-bold text-gray-800 dark:text-gray-100">{order.id}</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Placed on: {order.date}</p>
                            </div>
                             <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                order.status === 'Delivered' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                                order.status === 'Shipped' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                                'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                            }`}>
                                {order.status}
                            </span>
                        </div>
                        <div className="border-t border-gray-200 dark:border-gray-700 pt-2">
                            {order.items.map((item, index) => (
                                <p key={index} className="text-sm text-gray-700 dark:text-gray-300">{item.quantity} x {item.name}</p>
                            ))}
                            <p className="text-right font-bold text-lg mt-2 text-gray-800 dark:text-gray-100">Total: ₹{order.total.toFixed(2)}</p>
                        </div>
                    </div>
                ))}
            </main>
        </div>
    );
};

// 3. Cart Page
const CartPage = () => {
    const [cartItems, setCartItems] = useState(mockCartItems);

    const handleQuantityChange = (id, amount) => {
        setCartItems(prevItems =>
            prevItems.map(item =>
                item.id === id ? { ...item, quantity: Math.max(1, item.quantity + amount) } : item
            ).filter(item => item.quantity > 0)
        );
    };
    
    const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

    return (
        <div>
            <header className="sticky top-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm z-10 p-4 border-b border-gray-200 dark:border-gray-700">
                <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100 text-center">Shopping Cart</h1>
            </header>
             <main className="p-4 pb-44">
                 {cartItems.length > 0 ? (
                    <div className="space-y-4">
                        {cartItems.map(item => (
                            <div key={item.id} className="flex items-center bg-white dark:bg-gray-800 p-3 rounded-lg shadow-md gap-4">
                                <img src={item.imageUrl} alt={item.name} className="w-20 h-20 object-cover rounded-md" />
                                <div className="flex-1">
                                    <p className="font-semibold text-gray-800 dark:text-gray-200">{item.name}</p>
                                    <p className="text-blue-600 dark:text-blue-400 font-bold">₹{item.price.toFixed(2)}</p>
                                    <div className="flex items-center gap-2 mt-2">
                                        <button onClick={() => handleQuantityChange(item.id, -1)} className="p-1 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"><MinusIcon /></button>
                                        <span className="font-bold w-8 text-center">{item.quantity}</span>
                                        <button onClick={() => handleQuantityChange(item.id, 1)} className="p-1 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"><PlusIcon /></button>
                                    </div>
                                </div>
                                <p className="font-bold text-lg text-gray-800 dark:text-gray-100">₹{(item.price * item.quantity).toFixed(2)}</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <ShoppingCartIcon className="mx-auto w-16 h-16 text-gray-300 dark:text-gray-600" />
                        <p className="mt-4 text-gray-500 dark:text-gray-400">Your cart is empty.</p>
                    </div>
                 )}
            </main>
            {cartItems.length > 0 && (
                 <footer className="fixed bottom-16 md:bottom-0 left-0 md:left-64 right-0 bg-white dark:bg-gray-800 p-4 border-t border-gray-200 dark:border-gray-700 shadow-lg">
                    <div className="max-w-4xl mx-auto">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-gray-600 dark:text-gray-300">Subtotal</span>
                            <span className="font-bold text-xl text-gray-900 dark:text-white">₹{subtotal.toFixed(2)}</span>
                        </div>
                        <button className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-bold">
                            Proceed to Checkout
                        </button>
                    </div>
                </footer>
            )}
        </div>
    );
};

// 4. Profile Page
const ProfilePage = () => {
    // Replace with actual user data from your auth provider
    const user = {
        name: 'John Doe',
        email: 'john.doe@example.com',
        address: '123 Business Rd, Commerce City, 11001'
    };
    
    return (
         <div>
            <header className="sticky top-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm z-10 p-4 border-b border-gray-200 dark:border-gray-700">
                <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100 text-center">My Profile</h1>
            </header>
            <main className="p-4">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md text-center">
                    {/* In a real app, you would use Clerk's <UserButton /> here */}
                    <div className="w-24 h-24 rounded-full bg-blue-500 text-white flex items-center justify-center mx-auto mb-4">
                       <span className="text-4xl font-bold">JD</span>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{user.name}</h2>
                    <p className="text-gray-500 dark:text-gray-400">{user.email}</p>
                </div>

                <div className="mt-6 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
                   <h3 className="font-bold text-gray-800 dark:text-gray-100 mb-2">Account Details</h3>
                   <div className="space-y-2 text-sm">
                       <p><span className="font-semibold">Shipping Address:</span> {user.address}</p>
                       {/* You can add more user details here */}
                   </div>
                   <button className="w-full mt-4 text-sm text-blue-600 dark:text-blue-400 font-semibold py-2 rounded-lg border border-blue-600 dark:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition">
                       Edit Profile
                   </button>
                </div>
                 <div className="mt-6">
                    <button className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition-colors">
                        Logout
                    </button>
                </div>
            </main>
        </div>
    );
};


// --- Navigation Components ---
const NavItem = ({ icon, label, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`flex flex-col md:flex-row items-center md:justify-start gap-1 md:gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors w-full ${
            isActive
                ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300'
                : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800'
        }`}
    >
        {icon}
        <span>{label}</span>
    </button>
);

const navItems = [
    { id: 'home', label: 'Home', icon: <HomeIcon /> },
    { id: 'orders', label: 'Orders', icon: <PackageIcon /> },
    { id: 'cart', label: 'Cart', icon: <ShoppingCartIcon /> },
    { id: 'profile', label: 'Profile', icon: <UserIcon /> },
];


// --- Main UserHomePage ---
const UserHomePage = () => {
    const [activeTab, setActiveTab] = useState('home');

    const renderContent = () => {
        switch (activeTab) {
            case 'home':
                return <ProductsPage />;
            case 'orders':
                return <OrdersPage />;
            case 'cart':
                return <CartPage />;
            case 'profile':
                return <ProfilePage />;
            default:
                return <ProductsPage />;
        }
    };

    return (
        <div className="md:flex h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100">
            {/* Sidebar for Desktop */}
            <aside className="hidden md:flex flex-col w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 p-4">
                <div className="font-bold text-2xl text-blue-600 dark:text-blue-400 mb-8">WholesaleShop</div>
                <nav className="flex flex-col gap-2">
                    {navItems.map(item => (
                        <NavItem
                            key={item.id}
                            icon={item.icon}
                            label={item.label}
                            isActive={activeTab === item.id}
                            onClick={() => setActiveTab(item.id)}
                        />
                    ))}
                </nav>
            </aside>

            {/* Main Content */}
            <div className="flex-1 overflow-y-auto pb-16 md:pb-0">
                {renderContent()}
            </div>

            {/* Bottom Nav for Mobile */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 flex justify-around p-2">
                {navItems.map(item => (
                     <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={`flex flex-col items-center gap-1 w-full rounded-md py-1 transition-colors ${
                            activeTab === item.id ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'
                        }`}
                    >
                        {item.icon}
                        <span className="text-xs">{item.label}</span>
                    </button>
                ))}
            </nav>
        </div>
    );
};

export default UserHomePage;