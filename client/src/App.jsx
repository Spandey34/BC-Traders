import React, { useState, useEffect } from 'react';
import { ClerkProvider, SignedOut, SignedIn, SignIn, UserButton, useUser, useClerk } from "@clerk/clerk-react";
import toast, { Toaster } from 'react-hot-toast';
import { useTheme } from './context/ThemeProvider.jsx';

// --- SVG Icon Components ---
const HomeIcon = ({ className = "w-6 h-6" }) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>);
const ShoppingCartIcon = ({ className = "w-6 h-6" }) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" /></svg>);
const PackageIcon = ({ className = "w-6 h-6" }) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="16.5" x2="7.5" y1="9.4" y2="9.4" /><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /><polyline points="3.27 6.96 12 12.01 20.73 6.96" /><line x1="12" x2="12" y1="22.08" y2="12" /></svg>);
const UserIcon = ({ className = "w-6 h-6" }) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>);
const PlusIcon = ({ className = "w-4 h-4" }) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="12" x2="12" y1="5" y2="19" /><line x1="5" x2="19" y1="12" y2="12" /></svg>);
const MinusIcon = ({ className = "w-4 h-4" }) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="5" x2="19" y1="12" y2="12" /></svg>);
const SunIcon = ({ className = "w-6 h-6" }) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>);
const MoonIcon = ({ className = "w-6 h-6" }) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>);

// --- Mock Data ---
const mockProducts = [
    { id: 1, name: 'Premium Cotton T-Shirt', price: 250.00, mrp: 499.00, imageUrl: 'https://placehold.co/400x400/f0f0f0/333?text=T-Shirt' },
    { id: 2, name: 'Denim Jeans (Bulk Pack)', price: 1200.00, mrp: 1999.00, imageUrl: 'https://placehold.co/400x400/f0f0f0/333?text=Jeans' },
    { id: 3, name: 'Leather Wallets (Set of 10)', price: 800.00, mrp: 1500.00, imageUrl: 'https://placehold.co/400x400/f0f0f0/333?text=Wallets' },
    { id: 4, name: 'Classic Wrist Watch', price: 1500.00, mrp: 2999.00, imageUrl: 'https://placehold.co/400x400/f0f0f0/333?text=Watch' },
];

const mockOrders = [
    { id: 'ORD-101', date: '2023-10-25', status: 'Delivered', total: 4800.00, items: [{ name: 'Denim Jeans (Bulk Pack)', quantity: 4 }] },
    { id: 'ORD-102', date: '2023-10-28', status: 'Shipped', total: 1600.00, items: [{ name: 'Leather Wallets (Set of 10)', quantity: 2 }] },
];

const useCart = () => {
    const [cartItems, setCartItems] = useState([]);
    useEffect(() => {
        try {
            const localCart = localStorage.getItem('wholesaleCart');
            if (localCart) {
                setCartItems(JSON.parse(localCart));
            }
        } catch (error) {
            console.error("Failed to parse cart from localStorage", error);
            localStorage.removeItem('wholesaleCart');
        }
    }, []);
    useEffect(() => {
        localStorage.setItem('wholesaleCart', JSON.stringify(cartItems));
    }, [cartItems]);
    const addToCart = (product) => {
        setCartItems(prevItems => {
            const existingItem = prevItems.find(item => item.id === product.id);
            if (existingItem) {
                return prevItems.map(item =>
                    item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            }
            return [...prevItems, { ...product, quantity: 1 }];
        });
        toast.success(`${product.name} added to cart!`);
    };
    const updateQuantity = (productId, amount) => {
        setCartItems(prevItems =>
            prevItems
                .map(item =>
                    item.id === productId ? { ...item, quantity: item.quantity + amount } : item
                )
                .filter(item => item.quantity > 0)
        );
    };
    const clearCart = () => {
        setCartItems([]);
    };
    return { cartItems, addToCart, updateQuantity, clearCart };
};

const ProductsPage = ({ addToCart }) => (
    <div>
        <main className="p-4">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">Featured Products</h1>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {mockProducts.map(product => (
                    <div key={product.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden group">
                        <img src={product.imageUrl} alt={product.name} className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300" />
                        <div className="p-4">
                            <h3 className="font-semibold text-gray-800 dark:text-gray-200 truncate">{product.name}</h3>
                            <div className="flex items-center gap-2 mt-1">
                                <p className="text-lg font-bold text-blue-600 dark:text-blue-400">₹{product.price.toFixed(2)}</p>
                                <p className="text-sm text-gray-400 line-through">₹{product.mrp.toFixed(2)}</p>
                            </div>
                            <button onClick={() => addToCart(product)} className="w-full mt-3 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-semibold">
                                Add to Cart
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </main>
    </div>
);

const OrdersPage = () => {
    const { isSignedIn } = useUser();
    return (
        <div>
            <header className="sticky top-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm z-10 p-4 border-b border-gray-200 dark:border-gray-700">
                <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100 text-center">My Orders</h1>
            </header>
            <main className="p-4">
                {isSignedIn ? (
                    <div className="space-y-4">
                        {mockOrders.map(order => (
                            <div key={order.id} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <p className="font-bold text-gray-800 dark:text-gray-100">{order.id}</p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Placed on: {order.date}</p>
                                    </div>
                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${order.status === 'Delivered' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'}`}>
                                        {order.status}
                                    </span>
                                </div>
                                <div className="border-t border-gray-200 dark:border-gray-700 pt-2">
                                    <p className="text-right font-bold text-lg mt-2 text-gray-800 dark:text-gray-100">Total: ₹{order.total.toFixed(2)}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <PackageIcon className="mx-auto w-16 h-16 text-gray-300 dark:text-gray-600" />
                        <p className="mt-4 text-gray-500 dark:text-gray-400">Please log in to view your orders.</p>
                    </div>
                )}
            </main>
        </div>
    );
};

const CartPage = ({ cartItems, updateQuantity, clearCart, setActiveTab }) => {
    const { isSignedIn } = useUser();
    const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const handlePlaceOrder = () => {
        if (!isSignedIn) {
            toast.error("Please log in to place an order.");
            setActiveTab('profile');
            return;
        }
        clearCart();
        toast.success("Order placed successfully!");
    };
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
                                    <div className="flex items-center gap-2">
                                      <p className="text-blue-600 dark:text-blue-400 font-bold">₹{item.price.toFixed(2)}</p>
                                      <p className="text-xs text-gray-400 line-through">₹{item.mrp.toFixed(2)}</p>
                                    </div>
                                    <div className="flex items-center gap-2 mt-2">
                                        <button onClick={() => updateQuantity(item.id, -1)} className="p-1 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"><MinusIcon /></button>
                                        <span className="font-bold w-8 text-center">{item.quantity}</span>
                                        <button onClick={() => updateQuantity(item.id, 1)} className="p-1 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"><PlusIcon /></button>
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
                        <button onClick={handlePlaceOrder} className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-bold">
                            Place Order
                        </button>
                    </div>
                </footer>
            )}
        </div>
    );
};

const ProfilePage = () => {
    const { user } = useUser();
    const { signOut } = useClerk();
    return (
        <div>
            <header className="sticky top-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm z-10 p-4 border-b border-gray-200 dark:border-gray-700">
                <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100 text-center">My Profile</h1>
            </header>
            <main className="p-4">
                <SignedIn>
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md text-center">
                        <div className="flex justify-center">
                           <UserButton afterSignOutUrl="/" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mt-4">{user?.fullName}</h2>
                        <p className="text-gray-500 dark:text-gray-400">{user?.primaryEmailAddress?.emailAddress}</p>
                    </div>
                    <div className="mt-6">
                        <button onClick={() => signOut()} className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition-colors">
                            Logout
                        </button>
                    </div>
                </SignedIn>
                <SignedOut>
                    <div className="flex justify-center items-center flex-col">
                        <p className="text-center mb-4">Log in to manage your profile and orders.</p>
                        <SignIn routing="path" path="/profile" />
                    </div>
                </SignedOut>
            </main>
        </div>
    );
};

const UserHomePage = () => {
    const [activeTab, setActiveTab] = useState('home');
    const { theme, toggleTheme } = useTheme();
    const cart = useCart();
    const renderContent = () => {
        switch (activeTab) {
            case 'home': return <ProductsPage addToCart={cart.addToCart} />;
            case 'orders': return <OrdersPage />;
            case 'cart': return <CartPage {...cart} setActiveTab={setActiveTab} />;
            case 'profile': return <ProfilePage />;
            default: return <ProductsPage addToCart={cart.addToCart} />;
        }
    };
    const navItems = [
        { id: 'home', label: 'Home', icon: <HomeIcon /> },
        { id: 'orders', label: 'Orders', icon: <PackageIcon /> },
        { id: 'cart', label: 'Cart', icon: <div className="relative"><ShoppingCartIcon /><span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">{cart.cartItems.reduce((acc, item) => acc + item.quantity, 0)}</span></div> },
        { id: 'profile', label: 'Profile', icon: <UserIcon /> },
    ];
    return (
        <div className="md:flex h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100">
            <aside className="hidden md:flex flex-col w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 p-4">
                <div className="font-bold text-2xl text-blue-600 dark:text-blue-400 mb-8">WholesaleShop</div>
                <nav className="flex flex-col gap-2">
                    {navItems.map(item => (
                        <button key={item.id} onClick={() => setActiveTab(item.id)} className={`flex flex-row items-center justify-start gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors w-full ${activeTab === item.id ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300' : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800'}`}>
                            {item.icon}
                            <span>{item.label}</span>
                        </button>
                    ))}
                </nav>
            </aside>
            <div className="flex-1 flex flex-col">
                <header className="sticky top-0 z-20 flex md:hidden items-center justify-between p-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b dark:border-gray-700">
                     <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
                        {theme === 'light' ? <MoonIcon /> : <SunIcon />}
                    </button>
                    <div className="font-bold text-xl text-blue-600 dark:text-blue-400">WholesaleShop</div>
                    <div className="w-10 h-10 flex items-center justify-center">
                        <SignedIn><UserButton /></SignedIn>
                        <SignedOut><button onClick={() => setActiveTab('profile')}><UserIcon/></button></SignedOut>
                    </div>
                </header>
                 <main className="flex-1 overflow-y-auto pb-16 md:pb-0">
                    {renderContent()}
                </main>
            </div>
            <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 flex justify-around p-2">
                {navItems.map(item => (
                    <button key={item.id} onClick={() => setActiveTab(item.id)} className={`flex flex-col items-center gap-1 w-full rounded-md py-1 transition-colors ${activeTab === item.id ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'}`}>
                        {item.icon}
                        <span className="text-xs">{item.label}</span>
                    </button>
                ))}
            </nav>
        </div>
    );
};

const App = () => {
    return (
      <>
        <Toaster
            position="top-center"
            reverseOrder={false}
            toastOptions={{
                className: '',
                style: { background: '#333', color: '#fff' }
            }}
        />
        <UserHomePage />
      </>
    );
};

export default App;
